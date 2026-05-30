# نادي الدندر الثقافي الاجتماعي — الموقع الرسمي
### Dinder Cultural & Social Club — Official Website

[![GitHub Pages](https://img.shields.io/badge/hosted_on-GitHub_Pages-222?logo=github&logoColor=white)](https://pages.github.com)
[![Formspree](https://img.shields.io/badge/forms-Formspree-1f1f1f?logo=formspree)](https://formspree.io)
[![Google Fonts](https://img.shields.io/badge/fonts-Google_Fonts-4285F4?logo=googlefonts)](https://fonts.google.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🌐 English

A static multi-page Arabic website for **Dinder Cultural & Social Club (نادي الدندر الثقافي الاجتماعي)**. Built with pure HTML, CSS, and JavaScript — no frameworks, no build tools.

### ✨ Features

- **9 HTML pages** — Home, About, Events, Join, Contact, Articles, Article, Login, Admin Dashboard
- **RTL Arabic** layout with heritage-inspired design
- **Fully responsive** — mobile, tablet, desktop
- **CSS custom properties** theming system
- **Font Awesome 6** (self-hosted) — all icons
- **Scroll reveal animations** via IntersectionObserver
- **SEO-ready** — Open Graph, Twitter Cards, meta tags
- **Accessible** — ARIA labels, semantic HTML, keyboard navigation
- **Google Fonts** — Amiri, Noto Naskh Arabic, Playfair Display
- **Formspree integration** — membership, newsletter, contact forms
- **Local storage auth** — demo admin panel (`admin / admin123`)
- **Rate limiting** on login (5 attempts, 30s lockout)

### 🗺️ Site Map

| Page | File | Purpose |
|------|------|---------|
| Home | `index.html` | Hero, features, stats, footer |
| About | `about.html` | Mission, vision, board, partners |
| Events | `events.html` | Countdown, filters, calendar, registration modal |
| Membership | `join.html` | Membership form (Formspree) + benefits |
| Contact | `contact.html` | Contact form (Formspree) + FAQ |
| Articles | `articles.html` | Article grid with filters, search, sort |
| Article | `article.html` | Single article template (static, 8 articles) |
| Login | `login.html` | Member login with rate limiting |
| Admin | `admin.html` | Dashboard, stats, article table, membership requests |

### 🛠 Tech Stack

| Technology | Usage |
|------------|-------|
| **HTML5** | Structure (9 pages) |
| **CSS3** | Custom properties, flexbox, grid, animations |
| **JavaScript** | Menu toggle, scroll reveal, auth, article filters |
| **Font Awesome 6** | Icons (self-hosted in `lib/fontawesome/`) |
| **Google Fonts** | Amiri, Noto Naskh Arabic, Playfair Display |
| **Formspree** | Form backend (membership, contact, newsletter) |
| **GitHub Pages** | Free hosting |

### 📁 Project Structure

```
/
├── index.html              # Home page
├── about.html              # About the club
├── events.html             # Events & calendar
├── join.html               # Membership application
├── contact.html            # Contact & FAQ
├── articles.html           # Article listing
├── article.html            # Single article
├── login.html              # Member login
├── admin.html              # Admin dashboard
├── css/
│   └── main.css            # Complete stylesheet (~2000 lines)
├── js/
│   └── main.js             # Shared JS (menu, scroll reveal)
├── lib/
│   └── fontawesome/        # Font Awesome 6 (self-hosted)
├── images/                 # Upload images here
├── CONTENT.md              # All site content for editing
├── STATE.md                # Project state tracking
├── QA_REPORT.md            # QA audit report
├── QA_FIXES.md             # QA fixes reference
├── DEPLOY.md               # Deployment guide (Arabic)
├── MAINTENANCE.md          # Maintenance guide (Arabic)
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine rules
├── .htaccess               # Apache config (future hosting)
└── README.md               # This file
```

### 🚀 Quick Deploy (GitHub Pages)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to **Deploy from branch: main → / (root)**
4. Your site is live at `https://<username>.github.io/<repo>/`

See [DEPLOY.md](DEPLOY.md) for a complete step-by-step guide in Arabic.

---

## 🌍 العربية

موقع ثابت متعدد الصفحات لنادي **الدندر الثقافي الاجتماعي**، مبني بلغة HTML وCSS وJavaScript نقية — بدون إطارات عمل أو أدوات بناء.

### ✨ المميزات

- **9 صفحات HTML** — رئيسية، عن النادي، فعاليات، انضمام، تواصل، مقالات، مقالة، دخول، لوحة تحكم
- **تصميم RTL عربي** بإلهام تراثي دافئ
- **متجاوب بالكامل** — جوال، جهاز لوحي، حاسوب
- **نظام سمات** عبر متغيرات CSS
- **Font Awesome 6** مستضافة محلياً — جميع الأيقونات
- **أنيميشن ظهور** عبر IntersectionObserver
- **جاهز لمحركات البحث** — Open Graph، بطاقات تويتر، وسوم تحسين
- **إمكانية وصول** — تسميات ARIA، هيكل دلالي، تنقل بلوحة المفاتيح
- **خطوط Google** — أميري، نوتو نَسْخ عربي، بلايفير ديسپلي
- **نماذج Formspree** — عضوية، نشرات، تواصل
- **دخول مؤقت** — لوحة تحكم تجريبية (`admin / admin123`)
- **تقييد معدل الدخول** — 5 محاولات، قفل 30 ثانية

### 🛠 التقنيات

| التقنية | الاستخدام |
|---------|-----------|
| **HTML5** | هيكل الموقع (9 صفحات) |
| **CSS3** | متغيرات، فليكس، grid، حركات |
| **JavaScript** | قائمة جوال، ظهور تدريجي، دخول، فلترة مقالات |
| **Font Awesome 6** | أيقونات (مستضافة محلياً) |
| **Google Fonts** | أميري، نوتو نَسْخ عربي، بلايفير ديسپلي |
| **Formspree** | واجهة خلفية للنماذج |
| **GitHub Pages** | استضافة مجانية |

### 📋 الصفحات

| الصفحة | الملف | الوصف |
|--------|-------|-------|
| الرئيسية | `index.html` | هيرو، مميزات، إحصائيات، تذييل |
| عن النادي | `about.html` | رسالة، رؤية، مجلس إدارة، شركاء |
| الفعاليات | `events.html` | عداد تنازلي، فلترة، تقويم، تسجيل |
| طلب العضوية | `join.html` | استمارة عضوية + مزايا |
| التواصل | `contact.html` | نموذج تواصل + أسئلة شائعة |
| المقالات | `articles.html` | شبكة مقالات + فلترة + بحث + ترتيب |
| مقالة | `article.html` | قالب مقالة (ثابت، 8 مقالات) |
| دخول الأعضاء | `login.html` | دخول مع تقييد المحاولات |
| لوحة التحكم | `admin.html` | إحصائيات، جدول مقالات، طلبات عضوية |

### 🚀 النشر السريع

1. ارفع المجلد إلى GitHub
2. اذهب إلى **Settings → Pages**
3. اختر **Deploy from branch: main → / (root)**
4. الموقع يعمل على `https://<username>.github.io/<repo>/`

للدليل الكامل خطوة بخطوة، راجع [DEPLOY.md](DEPLOY.md).

---

## 📄 License

MIT — feel free to use, modify, and share.

## 🤝 Contact

- **Email:** info@dinderclub.sd
- **Developer:** م/هاشم كمال
