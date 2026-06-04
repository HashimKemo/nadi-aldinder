import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

interface ArticlePayload {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  category: string;
  cover_image?: string;
  site_url: string;
}

function buildHtmlEmail(article: ArticlePayload): string {
  const articleUrl = `${article.site_url.replace(/\/+$/, "")}/article.html?slug=${encodeURIComponent(article.slug)}`;
  const coverImg = article.cover_image
    ? `<tr><td style="padding:0 0 24px"><img src="${article.cover_image}" alt="${article.title}" style="width:100%;max-width:600px;height:auto;border-radius:8px;display:block"></td></tr>`
    : "";
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:'Segoe UI',Tahoma,Arial,sans-serif">
<table role="presentation" style="width:100%;max-width:600px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
<tr><td style="background:linear-gradient(135deg,#1a3a4a,#2c6b7a);padding:32px 24px;text-align:center">
<h1 style="margin:0;color:#fff;font-size:22px;font-weight:700">نادي الدندر الثقافي الاجتماعي</h1>
<p style="margin:8px 0 0;color:rgba(255,255,255,.8);font-size:14px">النشرة البريدية</p>
</td></tr>
${coverImg}
<tr><td style="padding:0 24px">
<h2 style="margin:0 0 12px;color:#1a3a4a;font-size:20px;line-height:1.4">${article.title}</h2>
<p style="margin:0 0 16px;color:#555;font-size:15px;line-height:1.7">${article.excerpt}</p>
<table role="presentation" style="width:100%;margin-bottom:20px">
<tr><td style="font-size:13px;color:#888">
${article.author} &mdash; ${article.category}
</td></tr>
</table>
<a href="${articleUrl}" style="display:inline-block;padding:12px 28px;background:#1a3a4a;color:#fff;text-decoration:none;border-radius:6px;font-size:15px;font-weight:600">قراءة المقال</a>
</td></tr>
<tr><td style="padding:24px;text-align:center;border-top:1px solid #eee">
<p style="margin:0;color:#aaa;font-size:12px">يمكنك إلغاء الاشتراك في أي وقت بالرد على هذه الرسالة</p>
<p style="margin:4px 0 0;color:#aaa;font-size:12px">&copy; ${new Date().getFullYear()} نادي الدندر الثقافي الاجتماعي</p>
</td></tr>
</table></body></html>`;
}

function buildTextEmail(article: ArticlePayload): string {
  const articleUrl = `${article.site_url.replace(/\/+$/, "")}/article.html?slug=${encodeURIComponent(article.slug)}`;
  return `${article.title}\n\n${article.excerpt}\n\n${article.author} — ${article.category}\n\nرابط المقال: ${articleUrl}\n\n---\nنادي الدندر الثقافي الاجتماعي`;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const jwt = authHeader.replace("Bearer ", "");
  const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["admin", "publisher"].includes(profile.role)) {
    return new Response(JSON.stringify({ error: "Forbidden: admins and publishers only" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const article: ArticlePayload = await req.json();
  if (!article.title || !article.slug || !article.excerpt || !article.site_url) {
    return new Response(JSON.stringify({ error: "title, slug, excerpt, and site_url are required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { data: subscribers, error: subsError } = await supabase
    .from("subscribers")
    .select("email");

  if (subsError) {
    return new Response(JSON.stringify({ error: "Failed to fetch subscribers: " + subsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!subscribers || subscribers.length === 0) {
    return new Response(JSON.stringify({ message: "No subscribers to notify" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
  const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587");
  const smtpUser = Deno.env.get("SMTP_USER") || "";
  const smtpPass = Deno.env.get("SMTP_PASS") || "";
  const fromEmail = Deno.env.get("SMTP_FROM") || smtpUser;

  if (!smtpUser || !smtpPass) {
    return new Response(JSON.stringify({ error: "SMTP credentials not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const emailBcc = subscribers.map((s) => s.email);
  const htmlBody = buildHtmlEmail(article);
  const textBody = buildTextEmail(article);

  const client = new SmtpClient();

  try {
    await client.connectTLS({
      hostname: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPass,
    });

    await client.send({
      from: fromEmail,
      to: fromEmail,
      bcc: emailBcc,
      subject: `📰 ${article.title} — نادي الدندر الثقافي الاجتماعي`,
      content: textBody,
      html: htmlBody,
    });

    await client.close();
  } catch (err) {
    try { await client.close(); } catch (_) { /* ignore */ }
    return new Response(JSON.stringify({ error: "SMTP send failed: " + (err.message || String(err)) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "Newsletter sent", count: emailBcc.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
