# دليل الصيانة — نادي الدندر الثقافي الاجتماعي

**مخصص لغير المبرمجين** — تعليمات بسيطة لتحديث الموقع بنفسك.

---

## 1. كيفية تحديث الفعاليات

### تغيير فعالية موجودة

1. افتح ملف `events.html` في **المفكرة (Notepad)** أو أي محرر نصوص
2. ابحث عن النص الذي تريد تغييره (مثلاً "ملتقى الدندر الأدبي")
3. استبدله بالنص الجديد
4. احفظ الملف (`Ctrl + S`)
5. ارفع الملف إلى GitHub (انظر قسم "كيف ترفع التغييرات")

### إضافة فعالية جديدة

ابحث في `events.html` عن هذا النمط:

```html
<div class="event-card" data-category="culture">
  <div class="event-date">
    <span class="event-day">15</span>
    <span class="event-month">يونيو</span>
  </div>
  <div class="event-info">
    <h3>عنوان الفعالية</h3>
    <p class="event-meta"><i class="fas fa-clock"></i> 8:00 م</p>
    <p class="event-meta"><i class="fas fa-map-marker-alt"></i> موقع الفعالية</p>
    <p>وصف الفعالية</p>
  </div>
</div>
```

انسخ هذا النمط وألصقه قبل إغلاق `</div>` الخاص بقسم الفعاليات، ثم غيّر المحتوى.

**بيانات الفئات المتاحة لـ `data-category`:**
- `culture` — ثقافي
- `literature` — أدبي
- `social` — اجتماعي
- `workshop` — ورشة عمل

---

## 2. كيفية تغيير الصور

1. ضع الصورة الجديدة في مجلد `images/`
2. افتف الملف HTML المطلوب
3. ابحث عن `<img` و `src="images/..."` 
4. غيّر اسم الملف إلى اسم الصورة الجديدة

**مثال:**
```html
<!-- قبل -->
<img src="images/old-photo.jpg" alt="وصف">

<!-- بعد -->
<img src="images/new-photo.jpg" alt="وصف جديد">
```

### أحجام الصور الموصى بها:

| الاستخدام | الحجم الموصى به |
|-----------|----------------|
| صور المقالات | 800×500 بكسل |
| صور الفعاليات | 600×400 بكسل |
| صور عامة | 1200×800 بكسل |
| Open Graph (صورة المشاركة) | 1200×630 بكسل |

> نصيحة: استخدم [tinypng.com](https://tinypng.com) لتصغير حجم الصور قبل الرفع.

---

## 3. كيفية إضافة صفحة جديدة

### أسهل طريقة — نسخ صفحة موجودة:

1. انسخ ملف `contact.html` وأعد تسميته (مثلاً `gallery.html`)
2. افتح الملف الجديد
3. غيّر:
   - **عنوان الصفحة:** `<title>معرض الصور - نادي الدندر</title>`
   - **وصف SEO:** `<meta name="description" content="...">`
   - **محتوى `<main>`:** امسح المحتوى القديم واكتب الجديد
4. اربط الصفحة من القائمة:
   - افتح `index.html` وابحث عن `<nav>`
   - أضف سطراً مثل:
     ```html
     <li><a href="gallery.html">معرض الصور</a></li>
     ```
5. احفظ جميع الملفات وارفعها

### القالب الأساسي لصفحة جديدة:

```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>عنوان الصفحة - نادي الدندر</title>
  <meta name="description" content="وصف الصفحة لمحركات البحث">
  <link rel="icon" href="favicon.ico" type="image/x-icon">
  <meta name="theme-color" content="#1B4D3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="lib/fontawesome/css/all.min.css">
  <link rel="stylesheet" href="css/main.css">
  <style>
    /* أكواد CSS الإضافية الخاصة بهذه الصفحة فقط */
  </style>
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a href="index.html" class="logo">نادي الدندر 🌟 الثقافي الاجتماعي</a>
      <button class="menu-toggle" aria-label="فتح القائمة"><i class="fas fa-bars"></i></button>
      <nav class="main-nav">
        <ul>
          <li><a href="index.html">الرئيسية</a></li>
          <li><a href="about.html">عن النادي</a></li>
          <li><a href="events.html">الفعاليات</a></li>
          <li><a href="articles.html">المقالات</a></li>
          <li><a href="join.html">طلب عضوية</a></li>
          <li><a href="contact.html">تواصل معنا</a></li>
          <li><a href="login.html">دخول الأعضاء</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <section class="page-hero">
      <div class="container">
        <h1>عنوان الصفحة</h1>
        <p>وصف قصير تحت العنوان</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <!-- محتوى الصفحة هنا -->
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h4>روابط سريعة</h4>
          <ul>
            <li><a href="index.html">الرئيسية</a></li>
            <li><a href="articles.html">المقالات</a></li>
            <li><a href="about.html">عن النادي</a></li>
            <li><a href="events.html">الفعاليات</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>روابط مهمة</h4>
          <ul>
            <li><a href="join.html">طلب عضوية</a></li>
            <li><a href="contact.html">تواصل معنا</a></li>
            <li><a href="login.html">دخول الأعضاء</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>النشرة البريدية</h4>
          <form action="https://formspree.io/f/xnqkyorw" method="POST">
            <input type="email" name="email" placeholder="بريدك الإلكتروني" required>
            <button type="submit">اشتراك</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 نادي الدندر الثقافي الاجتماعي | بتوقيع <strong>م/هاشم كمال</strong></p>
      </div>
    </div>
  </footer>

  <script src="js/main.js"></script>
</body>
</html>
```

---

## 4. كيفية رفع التغييرات إلى GitHub

### من المتصفح (تعديل سريع):

1. افتح مستودعك على `https://github.com/<اسمك>/<المستودع>`
2. افتح الملف الذي تريد تعديله
3. اضغط على أيقونة **القلم (✏️)** لبدء التعديل
4. حرر المحتوى
5. في الأسفل اكتب وصفاً للتغيير (مثلاً "تحديث فعالية يونيو")
6. اضغط **Commit changes**

### من GitHub Desktop (تعديلات متعددة):

1. افتح GitHub Desktop
2. سيظهر التغييرات التي أجريتها على الملفات
3. في الأسفل، اكتب وصفاً للتغيير
4. اضغط **Commit to main**
5. اضغط **Push origin**

---

## 5. قائمة تدقيق دورية (شهرية)

- [ ] **الفعاليات**: حدث تواريخ الفعاليات المنتهية أو أضف جديدة
- [ ] **المقالات**: أضف مقالات جديدة إن وجدت
- [ ] **النماذج**: اختبر نماذج Formspree (أرسل تجربة وتأكد من وصول البريد)
- [ ] **الروابط**: تأكد من أن جميع الروابط تعمل
- [ ] **الصور**: تأكد من ظهور جميع الصور
- [ ] **لوحة التحكم**: ادخل بـ `admin / admin123` وتأكد من عملها
- [ ] **النسخ الاحتياطي**: احتفظ بنسخة من الموقع على جهازك

---

## 6. تغيير البريد الإلكتروني الرسمي

البريد الإلكتروني `info@dinderclub.sd` مذكور في عدة أماكن:

1. `contact.html` — معلومات التواصل
2. `login.html` — خيار "نسيت كلمة المرور"
3. `admin.html` — معلومات المسؤول
4. `README.md` — معلومات الاتصال

للتغيير: ابحث عن `info@dinderclub.sd` في الملفات أعلاه واستبدله بالبريد الجديد.

---

## 7. إدارة النماذج (Formspree)

جميع النماذج تستخدم حساب Formspree واحد: `xnqkyorw`

**لتغيير حساب Formspree:**
1. افتح [Formspree.io](https://formspree.io) وأنشئ حساباً
2. أنشئ نماذج جديدة لكل نموذج (عضوية، نشرة بريدية، تواصل)
3. في كل ملف HTML، ابحث عن:
   ```html
   action="https://formspree.io/f/xnqkyorw"
   ```
4. استبدل `xnqkyorw` بمعرّف النموذج الجديد

> لكل نموذج يجب أن يكون له معرّف مستقل (حالياً جميعها تستخدم نفس المعرّف).

---

## 8. الألوان والخطوط (لتعديل التصميم)

يمكن تغيير الألوان من ملف `css/main.css` — ابحث عن:

```css
:root {
  --primary: #1B4D3E;       /* الأخضر النيلي — اللون الرئيسي */
  --secondary: #C8922A;     /* الذهبي الصحراوي — اللون الثانوي */
  --bg-cream: #F5EDD8;      /* العاجي الدافئ — الخلفية */
  --text-secondary: #6B4226; /* البني الترابي — النص الثانوي */
  --card-bg: #FDFAF4;        /* أبيض صافٍ — خلفية البطاقات */
  --border-light: #E8E0D0;  /* رمادي خفيف — الفواصل */
}
```

---

## 📞 للدعم الفني

إذا احتجت مساعدة، تواصل مع المطور:

- **المطور:** م/هاشم كمال
- **البريد الإلكتروني:** info@dinderclub.sd
