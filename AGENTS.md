# AGENTS.md — نادي الدندر الثقافي الاجتماعي

## Project Type
Static multi-page Arabic HTML site. **No build tools, no frameworks, no package.json.** Pure HTML+CSS+JS, hosted on GitHub Pages.

## Architecture

| Layer | File(s) | Role |
|-------|---------|------|
| Styles | `css/main.css` (~2650 lines) | CSS custom properties, RTL, responsive |
| Shared JS | `js/main.js` | Menu toggle, scroll reveal, `checkUserSession()` (nav + role-based redirects) |
| Favicon | `images/favicon.svg`, `favicon.ico`, `images/favicon-{16,32}.png`, `images/apple-touch-icon.png` | Multi-format favicon set |
| OG Image | `images/og-cover.jpg` | 1200×630 Open Graph image |
| 404 | `404.html` | Custom error page |
| Supabase | `js/supabase.js` | Client init (`supabaseClient`), newsletter handler, health check, `SUPABASE_FUNCTIONS_URL` |
| Page-specific JS | inline in each `.html` | Articles, admin, dashboard, login |
| Edge Function | `supabase/functions/invite-member/index.ts` | (احتياطي — غير مستخدم حالياً) |
| DB | Supabase (remote) | Tables: `articles`, `profiles`, `subscribers`, `membership_requests`, `contact_messages`, `article_comments` |

## Critical Setup — Supabase

- **Supabase config** in `js/supabase.js` — `SUPABASE_URL` + `SUPABASE_ANON_KEY` hardcoded (anon key safe with RLS).
- **RLS policies** use SECURITY DEFINER functions to avoid infinite recursion:
  - `public.is_admin()` — checks `profiles.role = 'admin'`
  - `public.is_editor_or_above()` — checks `role IN ('admin','editor','publisher')`
- **Free tier pauses after 7 days** inactivity. `supabase.js` has health check banner.
- **First user** who logs in becomes admin via `should_create_admin()` RPC.
- **Seed data**: `sql/seed_articles.sql` has 8 articles.
- **Edge Function** needs deployment: `supabase functions deploy invite-member` (redundant now)

## Membership Flow

```
join.html (multi-step: info + account + submit)
  ↓ creates Auth user (role=pending) + profile + membership_requests
  ↓
User can't log in yet — login.html detects role=pending and shows message
  ↓
admin.html → approveReq() → profiles.role = 'member'
  ↓
User logs in → dashboard.html (member/publisher/editor) or admin.html (admin)
```

## Roles & Navigation

| Role | After login | Nav link | Dashboard features |
|------|-------------|----------|-------------------|
| `member` | `dashboard.html` | لوحة العضو → dashboard.html | ملف شخصي |
| `editor` | `dashboard.html` | لوحة العضو → dashboard.html | ملف شخصي + رابط للمقالات في admin.html |
| `publisher` | `dashboard.html` | لوحة العضو → dashboard.html | ملف شخصي + رابط للمقالات في admin.html |
| `admin` | `admin.html` | لوحة التحكم → admin.html | كل شيء (admin.html) |

- `dashboard.html` — لوحة العضو للمستخدمين العاديين والمحررين والناشرين
- `admin.html` — لوحة الإدارة (يدخلها admin فقط + publisher/editor للمقالات)
- `signup.html` — صفحة توجيه تخبر المستخدم بأنه سيصله رابط دعوة على الإيميل (تم إلغاء النموذج)
- `checkUserSession()` في `main.js` تُظهر رابط dashboard.html أو admin.html حسب الدور
- القائمة العلوية متوافقة مع الشاشات الصغيرة (تبقى منسدلة)

## Admin Panel (admin.html)

### Tabs

| Tab | Content | Access |
|-----|---------|--------|
| لوحة التحكم | Stats + pending membership requests + recent articles | all |
| المقالات | Full articles CRUD | all non-member |
| التعليقات | Moderate comments | editor+ |
| الأعضاء | `profiles WHERE role='member'` with promote buttons | admin only |
| المشتركون | Newsletter subscriber list | admin only |
| الإعدادات | Personal profile edit | all |
| إدارة المستخدمين | All profiles with role management | admin only |

- `loadMembers()` queries `profiles WHERE role = 'member'` (source of truth)
- `linkMemberAccount()` and "ربط حساب" button **removed** (no longer needed)
- `approveReq()` updates `profiles.role = 'member'` directly (no Edge Function)

### Roles & CRUD

| Role | Create | Edit | Delete | Publish |
|------|--------|------|--------|---------|
| `admin` | ✅ | ✅ | ✅ | ✅ |
| `editor` | ✅ | ✅ | ❌ | ❌ |
| `publisher` | ✅ | ✅ | ❌ | ✅ |
| `member` | ❌ | ❌ | ❌ | ❌ |

## Key Conventions

- **Forms**: All submit to Supabase directly. `class="newsletter-form"` auto-handled by `supabase.js`.
- **Dates**: Use `fmtDate()` helper (handles null → `—`) never `new Date(null)`.
- **Icons**: Font Awesome 6 self-hosted in `lib/fontawesome/`. Always add `aria-hidden="true"`.
- **Arabic RTL**: `dir="rtl"` on `<html>`. CSS vars for spacing, no hardcoded margins.
- **Animations**: `class="reveal"` + IntersectionObserver in `main.js`.
- **Mobile menu**: Dropdown below header (not full-screen). `nav--open` / `menu-toggle--active` classes.
- **Favicon**: Multi-format set in `images/` + root `favicon.ico`. All HTML files reference all formats.
- **JSON-LD**: Organization + WebSite on `index.html` and `about.html`. Article schema in `article.html`.
- **Profile edit**: Edits name, avatar, password via Supabase Auth. Available in both `dashboard.html` and `admin.html`.

## Important Files

- `STATE.md` — Project progress
- `SUPABASE_GUIDE.md` — Full SQL for tables, RLS policies, setup steps
- `CONTENT.md` — All Arabic text content for the site
- `sql/seed_articles.sql` — 8 initial articles INSERT
- `supabase/functions/invite-member/index.ts` — Edge Function for invite emails
- `DEPLOY.md` — GitHub Pages deployment guide (Arabic)
- `MAINTENANCE.md` — Regular maintenance guide (Arabic)

## Common Tasks

| Task | What to do |
|------|-----------|
| Add a new article | admin.html → المقالات → مقالة جديدة |
| Approve member | admin.html → لوحة التحكم → طلبات العضوية → قبول |
| Promote member | admin.html → الأعضاء → ناشر/محرر |
| View all members | admin.html → الأعضاء |
| Manage all users | admin.html → إدارة المستخدمين |
| Moderate comments | admin.html → التعليقات |
| Deploy Edge Function | `supabase functions deploy invite-member` (requires Supabase CLI, احتياطي فقط) |
| Fix RLS issues | Re-run SECURITY DEFINER functions + policies from SUPABASE_GUIDE.md Part 3 |
| Wake up Supabase | Supabase Dashboard → project → Resume (if paused) |

## Gotchas

- `published_at` can be `null` (for drafts). Always use `fmtDate()` not raw `new Date()`.
- All `<script>` tags load Supabase CDN first, then `supabase.js`, then page-specific code. Order matters.
- `signup.html` — صفحة توجيه تخبر المستخدم بأنه سيصله رابط دعوة على الإيميل (تم إلغاء النموذج)
- `SUPABASE_FUNCTIONS_URL` in `supabase.js` derives from `SUPABASE_URL` automatically.
- `membership_requests` keeps records with status `pending`/`approved`/`rejected`.
- Comments on articles are published instantly (no moderation queue).
- When deleting a comment via admin panel, all child replies are CASCADE deleted.
