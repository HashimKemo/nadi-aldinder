# دليل ربط Supabase — نادي الدندر الثقافي الاجتماعي

**آخر تحديث:** 2026-05-29

---

## نظرة عامة

هذا الدليل يشرح كيفية ربط الموقع الثابت بـ Supabase لتحويله من موقع ثابت إلى موقع ديناميكي بقاعدة بيانات ومصادقة حقيقية.

### ماذا سنحقق؟

| الميزة | الحالي (ثابت) | بعد الربط (ديناميكي) |
|--------|---------------|---------------------|
| **المقالات** | 8 مقالات ثابتة في HTML | مقالات من قاعدة البيانات، إضافة/تعديل/حذف من لوحة التحكم |
| **المصادقة** | localStorage وهمي | Supabase Auth مع جلسات آمنة |
| **المشتركون** | Formspree فقط | مخزون في قاعدة البيانات + إرسال بريد |
| **طلبات العضوية** | Formspree فقط | ظهور في لوحة التحكم مع قبول/رفض |
| **الفعاليات** | ثابتة في HTML | فعاليات من قاعدة البيانات |

---

## الجزء 1: إنشاء مشروع Supabase

1. افتح [supabase.com](https://supabase.com)
2. اضغط **Start your project** — سجّل بحساب GitHub
3. أنشئ منظمة جديدة أو استخدم المنظمة الافتراضية
4. اضغط **New project**
5. املأ البيانات:
   - **Name:** `dinder-club`
   - **Database Password:** اختر كلمة قوية واحفظها
   - **Region:** الأقرب إليك (مثلاً `Singapore`)
   - **Pricing Plan:** **Free**
6. انتظر 1-2 دقيقة حتى ينشأ المشروع

---

## الجزء 2: إنشاء الجداول (Tables)

ادخل إلى **SQL Editor** (في القائمة اليسرى) وألصق الكود التالي:

```sql
-- 1. جدول المقالات
CREATE TABLE articles (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL DEFAULT 'نادي الدندر',
  author_avatar TEXT DEFAULT 'https://i.pravatar.cc/100?img=1',
  category TEXT NOT NULL CHECK (category IN ('opinion', 'literature', 'history', 'society', 'culture')),
  cover_image TEXT DEFAULT 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  read_time INT DEFAULT 5,
  is_published BOOLEAN DEFAULT true,
  slug TEXT UNIQUE,
  views INT DEFAULT 0
);

-- 2. جدول الملفات الشخصية (للمصادقة)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'publisher' CHECK (role IN ('admin', 'editor', 'publisher', 'viewer')),
  is_approved BOOLEAN DEFAULT false,
  avatar_url TEXT DEFAULT 'https://i.pravatar.cc/100?img=1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول المشتركين في النشرة البريدية
CREATE TABLE subscribers (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول طلبات العضوية
CREATE TABLE membership_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  origin TEXT,
  interests TEXT,
  bio TEXT,
  how_knew TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. جدول الفعاليات
CREATE TABLE events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('culture', 'literature', 'social', 'workshop')),
  event_date DATE NOT NULL,
  event_time TEXT DEFAULT '8:00 م',
  location TEXT,
  cover_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

> **إذا كنت تحدّث قاعدة موجودة:** أضف دور `editor` بتشغيل هذا الكود:
> ```sql
> ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
> ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
> ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
>   CHECK (role IN ('admin', 'editor', 'publisher', 'viewer'));
> ```

اضغط **Run** — سيتم إنشاء جميع الجداول.

---

## الجزء 3: إعداد Row Level Security (RLS)

> **⚠️ مهم:** أولاً أنشئ دوال `SECURITY DEFINER` لتجنب مشكلة الحلقات اللانهائية (infinite recursion) في سياسات RLS. هذه الدوال تتجاوز RLS لأنها تعمل بصلاحية منشئها (postgres).

```sql
-- ============================================================
-- دوال SECURITY DEFINER (تُنشأ قبل السياسات لتجنب recursion)
-- ============================================================

-- التحقق مما إذا كان المستخدم الحالي هو أدمن
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_approved = true
  );
$$;

-- التحقق مما إذا كان المستخدم الحالي هو أدمن أو محرر
CREATE OR REPLACE FUNCTION public.is_editor_or_above()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor', 'publisher') AND is_approved = true
  );
$$;

-- التحقق مما إذا كان أول مستخدم يسجل الدخول (لإنشاء أول أدمن تلقائياً)
CREATE OR REPLACE FUNCTION public.should_create_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE role = 'admin' AND is_approved = true
  );
$$;

-- التحقق مما إذا كان البريد الإلكتروني معتمداً (لديه طلب عضوية مقبول)
CREATE OR REPLACE FUNCTION public.is_email_approved(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.membership_requests
    WHERE email = user_email AND status = 'approved'
  );
$$;

-- ============================================================
-- تفعيل RLS على جميع الجداول
-- ============================================================
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- سياسات المقالات
-- ============================================================
-- القراءة للجميع (حتى غير المسجلين)
CREATE POLICY "articles_read_all" ON articles FOR SELECT USING (true);

-- الإضافة: أي مستخدم مسجل (سيتم تقييد الصلاحية عبر الكود)
CREATE POLICY "articles_insert_auth" ON articles FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND public.is_editor_or_above()
);

-- التحديث: الأدمن أو المحرر
CREATE POLICY "articles_update_editor" ON articles FOR UPDATE USING (
  public.is_editor_or_above()
);

-- الحذف: الأدمن فقط
CREATE POLICY "articles_delete_admin" ON articles FOR DELETE USING (
  public.is_admin()
);

-- ============================================================
-- سياسات الملفات الشخصية
-- ============================================================
-- القراءة: المستخدم يرى نفسه، الأدمن يرى الكل
CREATE POLICY "profiles_read_own" ON profiles FOR SELECT USING (
  auth.uid() = id OR public.is_admin()
);

-- الإضافة: المستخدم يضيف نفسه فقط (عند أول تسجيل دخول)
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (
  auth.uid() = id
);

-- التحديث: المستخدم يعدّل نفسه، الأدمن يعدّل الكل
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (
  auth.uid() = id OR public.is_admin()
);

-- ============================================================
-- سياسات المشتركين (النشرة البريدية)
-- ============================================================
-- الإضافة: أي زائر (حتى غير مسجل)
CREATE POLICY "subscribers_insert_all" ON subscribers FOR INSERT WITH CHECK (true);

-- القراءة: الأدمن فقط
CREATE POLICY "subscribers_read_admin" ON subscribers FOR SELECT USING (
  public.is_admin()
);

-- ============================================================
-- سياسات طلبات العضوية
-- ============================================================
-- الإضافة: أي زائر
CREATE POLICY "membership_insert_all" ON membership_requests FOR INSERT WITH CHECK (true);

-- القراءة: الأدمن فقط
CREATE POLICY "membership_read_admin" ON membership_requests FOR SELECT USING (
  public.is_admin()
);

-- التحديث (قبول/رفض): الأدمن فقط
CREATE POLICY "membership_update_admin" ON membership_requests FOR UPDATE USING (
  public.is_admin()
);

-- ============================================================
-- سياسات الفعاليات
-- ============================================================
-- القراءة للجميع
CREATE POLICY "events_read_all" ON events FOR SELECT USING (true);

-- الإضافة: الأدمن أو المحرر
CREATE POLICY "events_write_editor" ON events FOR INSERT WITH CHECK (
  public.is_editor_or_above()
);
CREATE POLICY "events_update_editor" ON events FOR UPDATE USING (
  public.is_editor_or_above()
);

-- ============================================================
-- جدول تسجيل الفعاليات + سياساته
-- ============================================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id BIGINT REFERENCES events(id) ON DELETE SET NULL,
  event_name TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guests INT DEFAULT 1,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "event_reg_insert_all" ON event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "event_reg_read_admin" ON event_registrations FOR SELECT USING (
  public.is_admin()
);
```

### جدول إضافي: رسائل التواصل (contact_messages)

نفّذ هذا الكود في SQL Editor أيضاً لتفعيل نموذج التواصل:

```sql
-- 6. جدول رسائل التواصل
CREATE TABLE contact_messages (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_read BOOLEAN DEFAULT false
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "contact_insert_all" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_read_admin" ON contact_messages FOR SELECT USING (
  public.is_admin()
);
```

---

## الجزء 4: الحصول على مفاتيح API

1. في مشروع Supabase، اذهب إلى **Project Settings → API**
2. ستجد:
   - **Project URL** — مثلاً `https://abcxyz.supabase.co`
   - **anon public key** — سلسلة نصية طويلة
3. انسخهما — سنحتاجهما في الخطوة التالية

---

## الجزء 5: إنشاء ملف تكوين Supabase

أنشئ ملف `js/supabase.js`:

```javascript
// js/supabase.js — تهيئة Supabase
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

> **تنبيه:** استبدل `YOUR_PROJECT` و `YOUR_ANON_KEY` بمفاتيح مشروعك الحقيقية.
> لا تقلق من ظهور المفتاح العام (anon key) — فهو آمن للاستخدام في التطبيقات الأمامية بفضل RLS.

أضف مكتبة Supabase في جميع الصفحات التي تحتاجها:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase.js"></script>
```

---

## الجزء 6: تعديل المصادقة (login.html)

### 6.1: إضافة SDK إلى login.html

في `<head>` أو قبل إغلاق `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase.js"></script>
```

### 6.2: استبدال كود JavaScript في login.html

احذف كود `localStorage` الحالي واستبدله بـ:

```javascript
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loginError = document.getElementById('loginError');
  const loginSuccess = document.getElementById('loginSuccess');
  const submitBtn = document.querySelector('.login-form .btn-primary');

  // Reset messages
  loginError.style.display = 'none';
  loginSuccess.style.display = 'none';

  // Validate
  if (!email || !password) {
    loginError.textContent = 'يرجى إدخال البريد الإلكتروني وكلمة المرور.';
    loginError.style.display = 'block';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جارٍ تسجيل الدخول...';

  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      loginError.textContent = error.message === 'Invalid login credentials'
        ? 'بريد إلكتروني أو كلمة مرور غير صحيحة.'
        : 'حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.';
      loginError.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'دخول <i class="fas fa-arrow-left"></i>';
      return;
    }

    // تحقق من صلاحية المستخدم
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role, is_approved')
      .eq('id', data.user.id)
      .single();

    if (profile && (profile.role === 'admin' || profile.role === 'publisher') && profile.is_approved) {
      loginSuccess.textContent = 'تم تسجيل الدخول بنجاح! جارٍ التحويل إلى لوحة التحكم...';
      loginSuccess.style.display = 'block';
      setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
    } else {
      await supabaseClient.auth.signOut();
      loginError.textContent = 'حسابك غير مصرح له بالدخول إلى لوحة التحكم. تواصل مع الإدارة.';
      loginError.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'دخول <i class="fas fa-arrow-left"></i>';
    }
  } catch (err) {
    loginError.textContent = 'حدث خطأ في الاتصال. تحقق من اتصالك بالإنترنت.';
    loginError.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'دخول <i class="fas fa-arrow-left"></i>';
  }
});
```

---

## الجزء 7: تعديل لوحة التحكم (admin.html)

### 7.1: التحقق من جلسة المستخدم

أضف في أعلى كود JavaScript في admin.html:

```javascript
(async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  // تحقق من الصلاحية
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('name, role, avatar_url')
    .eq('id', session.user.id)
    .single();

  if (!profile || !profile.is_approved) {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
    return;
  }

  // عرض اسم المستخدم
  document.getElementById('adminName').textContent = profile.name;
  document.getElementById('adminAvatar').src = profile.avatar_url;

  // تحميل الإحصائيات
  await loadStats();
  await loadArticles();
  await loadMembershipRequests();
})();
```

### 7.2: تحميل الإحصائيات من قاعدة البيانات

```javascript
async function loadStats() {
  const { count: articlesCount } = await supabaseClient
    .from('articles')
    .select('*', { count: 'exact', head: true });

  const { count: membersCount } = await supabaseClient
    .from('membership_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');

  const { count: subscribersCount } = await supabaseClient
    .from('subscribers')
    .select('*', { count: 'exact', head: true });

  const { count: eventsCount } = await supabaseClient
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  document.getElementById('totalArticles').textContent = articlesCount || 0;
  document.getElementById('totalMembers').textContent = membersCount || 0;
  document.getElementById('totalSubscribers').textContent = subscribersCount || 0;
  document.getElementById('totalEvents').textContent = eventsCount || 0;
}
```

### 7.3: تحميل المقالات في الجدول

```javascript
async function loadArticles() {
  const { data: articles } = await supabaseClient
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false });

  const tbody = document.querySelector('.admin-table tbody');
  tbody.innerHTML = '';

  articles.forEach(article => {
    const row = document.createElement('tr');
    const statusClass = article.is_published ? 'status-published' : 'status-draft';
    const statusText = article.is_published ? 'منشور' : 'مسودة';

    row.innerHTML = `
      <td>${article.title}</td>
      <td>${article.author}</td>
      <td>${new Date(article.published_at).toLocaleDateString('ar-SD')}</td>
      <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      <td>
        <button onclick="editArticle(${article.id})" class="btn-sm"><i class="fas fa-edit"></i></button>
        <button onclick="deleteArticle(${article.id})" class="btn-sm btn-danger"><i class="fas fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(row);
  });
}
```

### 7.4: تحميل طلبات العضوية

```javascript
async function loadMembershipRequests() {
  const { data: requests } = await supabaseClient
    .from('membership_requests')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  const container = document.querySelector('.requests-list');
  container.innerHTML = '';

  if (!requests || requests.length === 0) {
    container.innerHTML = '<p class="empty-state">لا توجد طلبات عضوية معلقة.</p>';
    return;
  }

  requests.forEach(req => {
    const card = document.createElement('div');
    card.className = 'request-card';
    card.innerHTML = `
      <div class="request-info">
        <h4>${req.full_name}</h4>
        <p><i class="fas fa-envelope"></i> ${req.email}</p>
        <p><i class="fas fa-phone"></i> ${req.phone || 'غير متاح'}</p>
        <p><i class="fas fa-graduation-cap"></i> ${req.qualification || 'غير متاح'}</p>
        ${req.message ? `<p><i class="fas fa-comment"></i> ${req.message}</p>` : ''}
      </div>
      <div class="request-actions">
        <button onclick="approveRequest(${req.id})" class="btn-approve">قبول</button>
        <button onclick="rejectRequest(${req.id})" class="btn-reject">رفض</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function approveRequest(id) {
  await supabaseClient.from('membership_requests').update({ status: 'approved' }).eq('id', id);
  loadMembershipRequests();
}

async function rejectRequest(id) {
  await supabaseClient.from('membership_requests').update({ status: 'rejected' }).eq('id', id);
  loadMembershipRequests();
}
```

### 7.5: تسجيل الخروج

```javascript
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  window.location.href = 'login.html';
});
```

---

## الجزء 8: تعديل صفحة المقالات (articles.html)

بدلاً من المقالات الثابتة، نحملها من Supabase:

```javascript
async function loadArticles() {
  const { data: articles, error } = await supabaseClient
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error loading articles:', error);
    return;
  }

  const grid = document.querySelector('.articles-grid');
  grid.innerHTML = '';

  articles.forEach(article => {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.setAttribute('data-category', article.category);
    card.innerHTML = `
      <a href="article.html?id=${article.id}">
        <img src="${article.cover_image}" alt="${article.title}" loading="lazy" decoding="async">
      </a>
      <div class="article-content">
        <span class="article-category">${getCategoryName(article.category)}</span>
        <h3><a href="article.html?id=${article.id}">${article.title}</a></h3>
        <p>${article.excerpt || article.content.substring(0, 150)}</p>
        <div class="article-meta">
          <span><i class="fas fa-user"></i> ${article.author}</span>
          <span><i class="fas fa-calendar"></i> ${new Date(article.published_at).toLocaleDateString('ar-SD')}</span>
          <span><i class="fas fa-clock"></i> ${article.read_time} د</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function getCategoryName(cat) {
  const names = {
    opinion: 'رأي',
    literature: 'أدب',
    history: 'تاريخ',
    society: 'مجتمع',
    culture: 'ثقافة'
  };
  return names[cat] || cat;
}

loadArticles();
```

---

## الجزء 9: تعديل صفحة المقالة الفردية (article.html)

```javascript
// تحميل المقالة من الرابط
const urlParams = new URLSearchParams(window.location.search);
const articleId = urlParams.get('id');

if (articleId) {
  const { data: article } = await supabaseClient
    .from('articles')
    .select('*')
    .eq('id', articleId)
    .single();

  if (article) {
    document.title = `${article.title} - نادي الدندر`;
    document.querySelector('.article-title').textContent = article.title;
    document.querySelector('.article-author').textContent = article.author;
    document.querySelector('.article-date').textContent = new Date(article.published_at).toLocaleDateString('ar-SD');
    document.querySelector('.article-read-time').textContent = `مدة القراءة: ${article.read_time} دقائق`;
    document.querySelector('.article-hero-image img').src = article.cover_image;
    document.querySelector('.article-body').innerHTML = article.content;

    // زيادة عدد المشاهدات
    await supabaseClient.rpc('increment_views', { article_id: articleId });
  }
}
```

> **ملاحظة:** لزيادة المشاهدات، أنشئ دالة في SQL Editor:
> ```sql
> CREATE OR REPLACE FUNCTION increment_views(article_id BIGINT)
> RETURNS void AS $$
> BEGIN
>   UPDATE articles SET views = views + 1 WHERE id = article_id;
> END;
> $$ LANGUAGE plpgsql;
> ```

---

## الجزء 10: ربط النماذج بـ Supabase

### نموذج طلب العضوية (join.html)

أضف في كود JavaScript:

```javascript
document.getElementById('membershipForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);

  const { error } = await supabaseClient.from('membership_requests').insert({
    full_name: formData.get('full_name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    birth_year: parseInt(formData.get('birth_year')),
    qualification: formData.get('qualification'),
    interests: formData.get('interests'),
    message: formData.get('message')
  });

  if (!error) {
    alert('تم استلام طلب عضويتك بنجاح! سنتواصل معك قريباً.');
    e.target.reset();
  } else {
    alert('حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.');
  }
});
```

### نموذج النشرة البريدية (في التذييل)

```javascript
document.querySelectorAll('.footer-col form').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;

    const { error } = await supabaseClient.from('subscribers').insert({ email });

    if (!error) {
      alert('تم الاشتراك في النشرة البريدية بنجاح!');
      form.reset();
    } else if (error.code === '23505') {
      alert('هذا البريد مسجل مسبقاً في النشرة.');
    } else {
      alert('حدث خطأ. حاول مرة أخرى.');
    }
  });
});
```

---

## الجزء 11: إنشاء أول مشرف (Admin)

بعد ربط Supabase، تحتاج إلى إنشاء أول مستخدم مشرف يدوياً:

1. في Supabase، اذهب إلى **Authentication → Users**
2. اضغط **Invite user** أو **Add user**
3. أدخل بريد المستخدم وكلمة المرور
4. بعد إنشاء المستخدم، اذهب إلى **Table Editor → profiles**
5. أضف سطراً جديداً:
   - `id`: انسخ UUID المستخدم من صفحة Authentication
   - `name`: اسم المشرف
   - `role`: `admin`
   - `is_approved`: `true`

---

## ملخص: قائمة التعديلات المطلوبة

| الملف | التعديل |
|-------|---------|
| `js/supabase.js` | إنشاء ملف جديد — مفاتيح API |
| `login.html` | إضافة SDK + استبدال كود المصادقة |
| `admin.html` | إضافة SDK + استبدال كل كود JavaScript |
| `articles.html` | إضافة SDK + تحميل المقالات من Supabase |
| `article.html` | إضافة SDK + تحميل المقالة الفردية |
| `join.html` | إضافة SDK + حفظ الطلب في Supabase |
| جميع الصفحات (footer) | إضافة SDK + حفظ المشتركين في Supabase |
| `events.html` | إضافة SDK + تحميل الفعاليات من Supabase |

---

## الجزء 12: إدخال البيانات الأولية (Seed Data)

### 12.1: المقالات (8 مقالات)

بعد إنشاء الجداول، افتح **SQL Editor** في Supabase وشغّل ملف `sql/seed_articles.sql` الموجود في المشروع. يمكنك نسخ المحتوى مباشرة أو رفع الملف.

**محتويات المقالات الثمانية:**

| # | العنوان | التصنيف | الكاتب |
|---|---------|---------|--------|
| 1 | الهوية الثقافية في زمن العولمة | ثقافة | أ. عبدالله أحمد |
| 2 | الشعر في الدندر: صوت الأرض والحنين | أدب | د. سارة محمد |
| 3 | الدندر عبر التاريخ: محطة على طريق القوافل | تاريخ وتراث | د. عمر الشيخ |
| 4 | التكافل الاجتماعي في الريف السوداني | مجتمع | م. هاشم كمال |
| 5 | لماذا نحتاج الأندية الثقافية؟ | رأي | أ. فيصل النور |
| 6 | الرواية السودانية الجديدة: قراءة في المشهد | أدب | د. أمل صالح |
| 7 | الأمثال الشعبية في منطقة الدندر | تاريخ وتراث | أ. حسن محمد علي |
| 8 | الموروث الموسيقي في شرق السودان | ثقافة | م. خالد عمر |

> **ملاحظة:** إذا أردت إضافة مقالات أخرى، استخدم نفس صيغة `INSERT INTO` في SQL Editor.

### 12.2: البيانات الأولية للفعاليات (اختياري)

يمكنك إضافة بعض الفعاليات التجريبية عبر SQL Editor:

```sql
INSERT INTO events (title, description, category, event_date, event_time, location, cover_image, is_active) VALUES
('أمسية "ذاكرة النهر" — شعر وحكايات من الدندر', 'أمسية شعرية وأدبية تستحضر صور النهر والريف وحياة الناس في الدندر.', 'literature', '2026-06-20', '8:00 م', 'قاعة المركز الثقافي — الخرطوم', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', true),
('ورشة "ابدأ من هنا" — مدخل إلى كتابة المقالة', 'ورشة مكثفة لمدة ثلاث ساعات تقدم أساسيات بناء المقالة الفكرية.', 'workshop', '2026-07-05', '10:00 صباحاً', 'أونلاين عبر Google Meet', 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800', true),
('ندوة "الهوية المحلية في مواجهة العولمة"', 'حوار فكري مفتوح حول إشكاليات الهوية الثقافية.', 'culture', '2026-07-18', '7:00 م', 'هجين (حضوري + بث مباشر)', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', true);
```

---

## الجزء 13: نظام التعليقات على المقالات

### 13.1: إنشاء جدول التعليقات

نفّذ هذا الكود في SQL Editor في Supabase:

```sql
-- جدول التعليقات
CREATE TABLE article_comments (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  article_id BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  content TEXT NOT NULL CHECK (char_length(content) >= 2 AND char_length(content) <= 2000),
  parent_id BIGINT REFERENCES article_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE article_comments ENABLE ROW LEVEL SECURITY;

-- القراءة: الجميع يرى جميع التعليقات
CREATE POLICY "comments_read_all" ON article_comments
  FOR SELECT USING (true);

-- الإضافة: أي زائر (سواء مسجل أو لا)
CREATE POLICY "comments_insert_all" ON article_comments
  FOR INSERT WITH CHECK (true);

-- التحديث: المحررون فما فوق
CREATE POLICY "comments_update_editor" ON article_comments
  FOR UPDATE USING (public.is_editor_or_above());

-- الحذف: المحررون فما فوق فقط
CREATE POLICY "comments_delete_editor" ON article_comments
  FOR DELETE USING (public.is_editor_or_above());
```

### 13.2: إضافة عداد التعليقات إلى لوحة التحكم

في دالة `loadDashboard()` في admin.html، أضف هذا السطر لجلب عدد التعليقات:

```javascript
var commentsRes = await supabaseClient
  .from('article_comments')
  .select('*', { count: 'exact', head: true });
```

---

## الجزء 14: تدفق الانضمام الكامل (Join → Signup → Login)

### سير العمل الكامل

```
1. يملأ الزائر استمارة join.html ← يُدرج في membership_requests (status = 'pending')
2. يرى المشرف الطلب في لوحة التحكم admin.html ← يضغط "قبول"
3. يظهر إشعار للمشرف مع رابط signup.html ليشاركه مع العضو
4. يذهب العضو إلى signup.html ← يدخل البريد والاسم وكلمة المرور
5. signup.html يتأكد via is_email_approved(email) أن الطلب معتمد
6. ينشئ حساب Auth عبر signUp() ← يُدرج profile مع role='viewer', is_approved=true
7. يوقّع الخروج تلقائياً ← يُوجّه إلى login.html
8. يسجل العضو الدخول ← يُوجّه حسب صلاحياته
```

### SQL المطلوب للقاعدة (شغّل في SQL Editor)

للتحديث من النظام القديم إلى الجديد:

```sql
-- إضافة الأعمدة الجديدة لجدول طلبات العضوية
ALTER TABLE membership_requests 
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS origin TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS how_knew TEXT;

-- حذف الأعمدة القديمة غير المستخدمة
ALTER TABLE membership_requests 
  DROP COLUMN IF EXISTS birth_year,
  DROP COLUMN IF EXISTS qualification,
  DROP COLUMN IF EXISTS message;

-- إنشاء دالة التحقق من البريد المعتمد
CREATE OR REPLACE FUNCTION public.is_email_approved(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.membership_requests
    WHERE email = user_email AND status = 'approved'
  );
$$;

-- إنشاء دالة أول مشرف (ضرورية لتسجيل الدخول الأول)
CREATE OR REPLACE FUNCTION public.should_create_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE role = 'admin' AND is_approved = true
  );
$$;
```

### الصفحات الجديدة

| الملف | الدور |
|-------|-------|
| `signup.html` | إنشاء حساب جديد للأعضاء المعتمدين — يتحقق من الموافقة قبل إنشاء الحساب |

---

## تنبيهات مهمة

1. **احتفظ بكلمة مرور قاعدة البيانات** — لا يمكن استعادتها
2. **مفاتيح API العامة (anon key)** — آمنة طالما فعّلت RLS
3. **النسخة المجانية** تسمح بـ 50000 صف و 2GB قاعدة بيانات — كافية للنادي
4. **يُفضّل** إبقاء Formspree كنسخة احتياطية للنماذج
5. **خطة مجانية Supabase** تنام بعد 7 أيام من عدم النشاط — استيقظ بزيارة الموقع
