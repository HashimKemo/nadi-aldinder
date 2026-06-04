# نادي الدندر الثقافي الاجتماعي — STATE.md
**آخر تحديث:** 2026-06-04
**المرحلة الحالية:** 5 - ربط Supabase + 6 - تحسينات + 9 - إصلاحات + 10 - نظام التعليقات + 11 - التحسينات النهائية + 12 - إرسال النشرات البريدية — الكل مكتمل 100% ✅

---

## ✅ مكتمل — المرحلة 1: التخطيط والتصميم
- [x] جمع متطلبات النادي والأسئلة التأسيسية
- [x] تحديد البنية التقنية الكاملة
- [x] تصميم هوية المشروع (الألوان، الخطوط، الأسلوب البصري)
- [x] رسم خريطة الموقع الكاملة
- [x] تصميم هيكل قاعدة البيانات ونظام الأدوار
- [x] إنشاء شجرة ملفات المشروع

## ✅ مكتمل — المرحلة 2: بناء الموقع
- [x] بناء نظام CSS كامل (main.css) — المتغيرات، الزخارف، RTL
- [x] إنشاء الصفحة الرئيسية (index.html)
- [x] إنشاء صفحة عن النادي (about.html)
- [x] إنشاء صفحة الفعاليات (events.html)
- [x] إنشاء صفحة طلب الانضمام (join.html)
- [x] إنشاء صفحة التواصل (contact.html)
- [x] إنشاء صفحة المقالات (articles.html)
- [x] إنشاء صفحة مقالة فردية (article.html)
- [x] إنشاء صفحة دخول الأعضاء (login.html)
- [x] إنشاء صفحة لوحة التحكم (admin.html)
- [x] تحديث التذييل (Footer) في جميع الصفحات
- [x] تحديث قوائم التنقل (Nav) في جميع الصفحات
- [x] إنشاء ملف محتوى (CONTENT.md) — جميع النصوص

## ✅ مكتمل — المرحلة 3: مراجعة الجودة (QA) والإصلاحات
- [x] مراجعة جودة شاملة (QA) — 10 أخطاء حرجة، 11 تحذيراً، 17 اقتراحاً
- [x] إصدار QA_REPORT.md و QA_FIXES.md
- [x] تطبيق جميع الإصلاحات على الملفات المصدرية
- [x] استخراج الكود المشترك إلى `js/main.js`
- [x] إضافة `loading="lazy" decoding="async"` لجميع الصور
- [x] إضافة `aria-hidden="true"` لجميع أيقونات Font Awesome
- [x] إضافة Favicon + `theme-color` لجميع الصفحات
- [x] إصلاح ثغرات أمنية في login.html (rate limiting + تحذيرات)
- [x] إصلاح نموذج النشرة البريدية في index.html
- [x] إزالة كود breadcrumbs CSS المكرر
- [x] إصلاح أيقونات غير مناسبة عبر الموقع
- [x] تحويل FAQ من onclick إلى event delegation
- [x] إصلاح زر "تحميل المزيد" في articles.html
- [x] حذف قسم "قصة النادي" من about.html
- [x] استبدال جميع الإيموجيات بـ Font Awesome في about.html و join.html

## ✅ مكتمل — المرحلة 4: النشر والتوثيق
- [x] إنشاء README.md — توثيق ثنائي اللغة (عربي/إنجليزي)
- [x] إنشاء DEPLOY.md — دليل نشر خطوة بخطوة للمبتدئين
- [x] إنشاء MAINTENANCE.md — دليل صيانة دوري بدون برمجة
- [x] إنشاء sitemap.xml لمحركات البحث
- [x] إنشاء robots.txt
- [x] إنشاء .htaccess للاستضافات المستقبلية
- [x] إنشاء images/ مجلد
- [x] تحديث STATE.md — الحالة النهائية

## ✅ مكتمل — المرحلة 5: ربط Supabase (قاعدة البيانات والمصادقة)
- [x] إنشاء ملف js/supabase.js بمفاتيح API
- [x] إضافة Supabase SDK + supabase.js لجميع صفحات HTML (9 صفحات)
- [x] **login.html** — استبدال localStorage بـ Supabase Auth + rate limiting
- [x] **admin.html** — مصادقة عبر Supabase Session + إحصائيات وجداول من DB
- [x] **articles.html** — تحميل المقالات ديناميكياً من Supabase (فلترة + بحث + ترتيب)
- [x] **article.html** — تحميل مقالة فردية حسب ?id + عداد مشاهدات + مقالات ذات صلة
- [x] **join.html** — حفظ طلبات العضوية في Supabase (إلغاء Formspree)
- [x] **contact.html** — حفظ رسائل التواصل في Supabase
- [x] **النشرة البريدية** — ربط جميع صفحات الموقع (9 صفحات) بحفظ المشتركين في Supabase
- [x] إنشاء جدول contact_messages في SUPABASE_GUIDE.md
- [x] تحديث SUPABASE_GUIDE.md بجميع خطوات الربط وكود JavaScript

## ✅ مكتمل — المرحلة 6: إصلاح RLS وإكمال لوحة التحكم وتحسين الجوال
- [x] **إصلاح infinite recursion في RLS** — إنشاء دوال SECURITY DEFINER (is_admin, is_publisher, should_create_admin) بدلاً من الاستعلام المباشر عن profiles داخل سياسات RLS
- [x] **login.html** — إصلاح ثغرة أمنية: استخدام should_create_admin() RPC، لم يعد يمنح دور admin لكل من يسجّل دخول
- [x] **admin.html** — إعادة كتابة كاملة:
  - [x] تصغير وتكثيف dashboard (بطاقات إحصائيات صغيرة، إزالة الترحيب الكبير)
  - [x] تفعيل تبويب **المقالات** — جدول كامل بجميع المقالات من Supabase
  - [x] تفعيل تبويب **الأعضاء** — قائمة الأعضاء المعتمدين من membership_requests
  - [x] تفعيل تبويب **المشتركون** — قائمة المشتركين من subscribers
- [x] **main.css** — إضافة responsive CSS شامل:
  - [x] تحجيم الهيرو والخطوط على الجوال
  - [x] جعل جميع الـ grids عمودية على الشاشات الصغيرة
  - [x] تحسين النماذج وشريط المقالات
  - [x] دعم الشاشات الصغيرة جداً (380px)
  - [x] تحسين تذييل الموقع
- [x] تحديث SUPABASE_GUIDE.md بالسياسات المصححة
- [x] تحديث STATE.md

---

## ✅ مكتمل — المرحلة 8: صلاحيات كاملة + إحصائيات حية + بقاء الجلسة + قائمة مطورة
- [x] **إضافة دور `viewer`** — تحديث CHECK constraint: `CHECK (role IN ('admin','editor','publisher','viewer'))`
- [x] **admin.html — صلاحيات ترقية كاملة:**
  - [x] ترقية العضو إلى "ناشر" أو "محرر" من تبويب الأعضاء (زرين منفصلين)
  - [x] تغيير أي مستخدم إلى أي دور (أدمن، محرر، ناشر، مشاهد) من إدارة المستخدمين
  - [x] عكس الترقية (تنزيل أي مستخدم بمن فيهم الأدمنز)
  - [x] إضافة "مشاهد" للقائمة المنسدلة للأدوار
- [x] **login.html — السماح بدخول `viewer`** (يُوجه إلى index.html مع رسالة ترحيب)
- [x] **admin.html — منع دخول `viewer`** (تسجيل خروج تلقائي)
- [x] **index.html — إحصائيات حية من Supabase:**
  - [x] جلب عدد المقالات المنشورة، الأعضاء المعتمدين، الفعاليات النشطة
  - [x] تحديث data-target بالقيم الفعلية قبل بدء animation
  - [x] سنة التأسيس (2018) تبقى ثابتة
- [x] **main.js — بقاء الجلسة في جميع الصفحات + شارة المستخدم:**
  - [x] التحقق من `supabaseClient.auth.getSession()` في كل صفحة
  - [x] إنشاء شارة المستخدم ديناميكياً في الـ header (الاسم، الدور، رابط لوحة التحكم، زر خروج)
  - [x] إخفاء زر "دخول الأعضاء" عند تسجيل الدخول
- [x] **main.css — شارة المستخدم:**
  - [x] CSS متجاوب مع مساحة الهيدر
  - [x] إخفاء المعلومات التفصيلية على الجوال (يظهر زر الخروج فقط)
- [x] **main.css — تطوير قائمة الشطيرة:**
  - [x] من full-screen overlay إلى dropdown أسفل الهيدر مباشرة
  - [x] تصغير الخط من text-xl إلى text-sm
  - [x] تصغير الـ padding
  - [x] إضافة خلفية شفافة خلف القائمة
  - [x] إزالة الحاجة للتمرير (جميع الخيارات تظهر بوضوح)
- [x] **article.html — إصلاح `nav__link--active`** (إضافة الكلاس المفقود على رابط "المقالات")
- [x] تحديث STATE.md

---
- [x] **إضافة دور `editor`** — تحديث CHECK constraint في profiles ليشمل `admin, editor, publisher`
- [x] **login.html** — تحديث التحقق ليشمل `editor` (بجانب `admin` و `publisher`)
- [x] **admin.html — إظهار/إخفاء التبويبات حسب الدور:**
  - [x] **Admin** يرى: لوحة التحكم، المقالات، الأعضاء، المشتركون، إدارة المستخدمين
  - [x] **Editor** يرى فقط: لوحة التحكم، المقالات
  - [x] إضافة `data-role="all"` و `data-role="admin"` لروابط الشريط الجانبي
  - [x] إعادة توجيه تلقائية إذا حاول Editor الدخول إلى تبويب محظور
- [x] **admin.html — تبويب "إدارة المستخدمين" (بدلاً من الإعدادات):**
  - [x] جدول بجميع المستخدمين من profiles (الاسم، البريد، الدور، الحالة، التاريخ)
  - [x] قائمة منسدلة لتغيير الدور (admin/editor/publisher)
  - [x] زر حفظ الدور + زر تفعيل/إيقاف المستخدم
  - [x] المستخدم لا يستطيع تغيير دور نفسه
  - [x] إشعارات منبثقة (toast notifications) لتأكيد العمليات
- [x] **admin.html — زر "ترقية إلى Editor" في تبويب الأعضاء:**
  - [x] البحث عن تطابق البريد الإلكتروني في profiles
  - [x] إذا وُجد: ترقية الدور + تفعيل الحساب
  - [x] إذا لم يُوجد: رسالة "ليس لديه حساب دخول"
  - [x] منع ترقية الأدمن
- [x] **SUPABASE_GUIDE.md** — إضافة ALTER TABLE SQL لتحديث قاعدة موجودة
- [x] تحديث STATE.md

---

## ✅ مكتمل — المرحلة 9: إصلاح admin.html + ربط events.html بـ Supabase + CRUD المقالات

- [x] **إصلاح admin.html (عطل loadMembers/loadSubscribers):**
  - [x] إضافة `if (!container) return;` في `loadMembers()` و `loadSubscribers()` قبل التعامل مع container
  - [x] لف `DOMContentLoaded` بـ `try/catch` لمنع توقف الكود بالكامل عند أي خطأ
- [x] **إصلاح RLS policies (infinite recursion):**
  - [x] إنشاء دوال `is_admin()` و `is_editor_or_above()` بـ SECURITY DEFINER
  - [x] استبدال جميع الاستعلامات المتكررة `(SELECT role FROM profiles WHERE id = auth.uid())` بـ `public.is_admin()` و `public.is_editor_or_above()`
  - [x] تحديث جميع سياسات RLS في SUPABASE_GUIDE.md والملفات المتأثرة
- [x] **إصلاح `published_at` null:**
  - [x] إنشاء دالة `fmtDate()` تعالج `null` وترجع `—` بدلاً من تاريخ 1970
  - [x] استبدال `new Date(...).toLocaleDateString('ar-SD')` بـ `fmtDate()` في `loadAllArticles()` و `loadDashboard()`
- [x] **نقل CRUD event listeners إلى داخل DOMContentLoaded:**
  - [x] إنشاء `setupArticleCRUD()` تُستدعى من داخل `DOMContentLoaded`
  - [x] إضافة null checks قبل كل `addEventListener` و `classList`
- [x] **إضافة فحص صحة Supabase في supabase.js:**
  - [x] إضافة `checkSupabase()` — يكتشف إذا كان المشروع متوقفاً (Paused) ويُظهر banner أحمر + تحذير في Console
- [x] **إنشاء sql/seed_articles.sql — 8 مقالات أولية:**
  - [x] مقالات في جميع التصنيفات (ثقافة، أدب، تاريخ، مجتمع، رأي)
  - [x] محتوى HTML كامل لكل مقالة مع صور وأوقات قراءة و slug
- [x] **SUPABASE_GUIDE.md — إضافة:**
  - [x] الجزء 12: إدخال البيانات الأولية (المقالات والفعاليات)
  - [x] جدول `event_registrations` مع RLS policies
- [x] **ربط events.html بـ Supabase بالكامل:**
  - [x] جلب الفعاليات ديناميكياً من Supabase (بدلاً من البطاقات الثابتة)
  - [x] العد التنازلي يستخدم تاريخ أقرب فعالية من قاعدة البيانات
  - [x] إضافة أزرار تصفية ديناميكية (الكل، ثقافي، أدبي، مجتمعي، ورشة)
  - [x] استبدال Formspree في النشرة البريدية بـ Supabase
  - [x] استبدال Formspree في نموذج تسجيل الفعاليات (Modal) بـ Supabase
- [x] **واجهة CRUD للمقالات في admin.html:**
  - [x] زر "مقالة جديدة" في تبويب المقالات
  - [x] Modal إنشاء/تعديل: عنوان، تصنيف، كاتب، ملخص، محتوى (HTML)، صورة، وقت قراءة، حالة نشر
  - [x] أزرار تعديل، حذف، نشر/إلغاء نشر لكل مقالة في الجدول
  - [x] Modal تأكيد الحذف
  - [x] صلاحية كاملة لجميع الأدوار (admin/editor/publisher) حسب صلاحياتهم

---

## 📊 ملخص المشروع

| المجال | التفاصيل |
|--------|----------|
| **إجمالي الصفحات** | 10 صفحات HTML |
| **إجمالي الملفات** | 20+ ملف (HTML, CSS, JS, XML, MD, إلخ) |
| **نظام CSS** | main.css — ~2100 سطر، متغيرات، RTL، متجاوب |
| **JavaScript** | js/main.js — كود مشترك (menu + scroll reveal) + js/supabase.js |
| **الأيقونات** | Font Awesome 6 — مستضافة محلياً |
| **النماذج** | Supabase (عضوية، نشرة، تواصل) — Formspree مُلغى |
| **الاستضافة** | GitHub Pages (مجاني) |
| **قاعدة البيانات** | Supabase — فعّال (جداول: articles, profiles, subscribers, membership_requests, events, contact_messages) |
| **المصادقة** | Supabase Auth — بديل localStorage النهائي |

---

## 📁 بنية الملفات النهائية

```
/
├── index.html              # الصفحة الرئيسية
├── about.html              # عن النادي
├── events.html             # الفعاليات
├── join.html               # طلب العضوية
├── contact.html            # التواصل
├── articles.html           # قائمة المقالات
├── article.html            # قالب مقالة فردية
├── login.html              # دخول الأعضاء
├── admin.html              # لوحة التحكم
├── activities.html          # الأنشطة
├── css/
│   └── main.css            # ملف التنسيق الأساسي (~2100 سطر)
├── js/
│   ├── main.js             # الكود المشترك (menu + scroll reveal)
│   └── supabase.js         # إعداد Supabase Client + معالج النشرة البريدية
├── lib/
│   └── fontawesome/        # Font Awesome 6 — مستضافة محلياً
├── images/                 # مجلد الصور
├── CONTENT.md              # جميع نصوص الموقع
├── STATE.md                # هذا الملف — حالة المشروع
├── QA_REPORT.md            # تقرير مراجعة الجودة
├── QA_FIXES.md             # الإصلاحات المقترحة
├── README.md               # توثيق الموقع (عربي/إنجليزي)
├── DEPLOY.md               # دليل النشر للمبتدئين
├── MAINTENANCE.md          # دليل الصيانة الدورية
├── SUPABASE_GUIDE.md        # دليل ربط Supabase كامل
├── sitemap.xml             # خريطة الموقع لمحركات البحث
├── robots.txt              # تعليمات محركات البحث
└── .htaccess               # إعدادات Apache (مستقبلاً)
```

---

## ✅ مكتمل — المرحلة 10: نظام التعليقات على المقالات
- [x] إنشاء جدول `article_comments` في قاعدة البيانات (مع RLS للحذف للمحررين فما فوق)
- [x] إضافة CSS كامل لنظام التعليقات في main.css (بطاقات، نموذج، ردود، متجاوب)
- [x] **article.html** — نظام تعليقات كامل: نشر فوري بدون موافقة، ردود متداخلة (حتى عمق 2)، دعم المستخدمين المسجلين والزوار، عداد الأحرف
- [x] **admin.html** — تبويب "التعليقات" متاح للمحررين فما فوق مع عرض بجدول + حذف
- [x] إضافة إحصائية التعليقات إلى لوحة التحكم (عداد + تحديث تلقائي)
- [x] تحديث SUPABASE_GUIDE.md بالجزء 13 — جدول التعليقات + RLS

---

---

## ✅ مكتمل — المرحلة 12: إرسال النشرات البريدية عند نشر المقالات
- [x] **Edge Function (Backend):** إنشاء `supabase/functions/send-newsletter/index.ts` — يستقبل بيانات المقالة، يتحقق من صلاحية الناشر/الأدمن، يسحب جميع المشتركين، يرسل بريد BCC عبر SMTP مع قالب HTML عربي RTL كامل
- [x] **Admin Panel Integration:** ربط Edge Function في `admin.html` — استدعاء fire-and-forget عند حفظ مقالة بحالة منشورة + عند التبديل إلى نشر عبر `togglePublish()`
- [x] **صفحة إلغاء الاشتراك:** إنشاء `unsubscribe.html` — تقرأ `?email=`، تؤكد الحذف، تحذف من `subscribers`
- [x] **إدارة المشتركين:** إضافة زر حذف لكل مشترك في تبويب المشتركون بلوحة التحكم
- [x] **النشر:** رفع Edge Function (`send-newsletter`) + ضبط متغيرات SMTP في Supabase Secrets
- [x] **التوثيق:** تحديث AGENTS.md و STATE.md

---

## 🔮 التحسينات المستقبلية (مقترحة)

- [x] ربط Supabase الفعلي (جداول articles, profiles, subscribers, membership_requests, events, contact_messages)
- [x] تنفيذ مصادقة حقيقية عبر Supabase Auth (بديل localStorage)
- [x] ربط جميع النماذج بقاعدة البيانات (بديل Formspree)
- [x] إصلاح infinite recursion في RLS policies
- [x] تفعيل تبويبات لوحة التحكم (المقالات، الأعضاء، المشتركون) ببيانات Supabase
- [x] تحسين توافق الموقع مع الجوال (responsive)
- [x] إنشاء صور Favicon حقيقية (favicon.ico + apple-touch-icon.png + favicon-16/32 PNG)
- [x] إنشاء صورة Open Graph (images/og-cover.jpg 1200×630)
- [x] بناء صفحة 404.html مخصصة
- [x] إضافة JSON-LD structured data (Organization, WebSite, Article)
- [x] إضافة نموذج التعليقات على المقالات
- [ ] بناء نظام RSS feed للمقالات
- [ ] ~~إضافة دعم الوضع الليلي (Dark Mode) مع toggle في جميع الصفحات~~ (تمت إزالته)
- [x] تحميل الفعاليات (events) ديناميكياً من Supabase
- [x] إضافة واجهة إدارة المقالات في لوحة التحكم (إنشاء/تعديل/حذف)
- [x] إضافة صفحة إعدادات لوحة التحكم (تعديل الملف الشخصي، تغيير كلمة المرور)
- [x] إنشاء صفحة الأنشطة (activities.html) — 6 بطاقات أنشطة، CTA، نشرة بريدية، فوتير
- [x] إضافة رابط الأنشطة في التنقل (nav) والفوتر في جميع الصفحات (10 صفحات)

---

## 📝 ملاحظات مهمة

- أول مستخدم يسجّل دخول عبر `login.html` يصبح **Admin** تلقائياً (عبر `should_create_admin()` RPC)
- جميع النماذج (عضوية، تواصل، نشرة) ترسل إلى Supabase مباشرة — **Formspree مُلغى بالكامل**
- الصور الرمزية (avatar) في لوحة التحكم تستخدم `https://i.pravatar.cc` — خدمة خارجية
- البيانات الأولية للمقالات (8 مقالات) متوفرة في `sql/seed_articles.sql` — شغّلها في SQL Editor في Supabase
- البيانات الأولية للفعاليات (3 فعاليات) موجودة في `SUPABASE_GUIDE.md` — الجزء 12.2
- دوال `increment_views` في article.html تحتاج إلى إنشاء دالة SQL (موجودة في SUPABASE_GUIDE.md)

---

## 🏁 الخلاصة

**الموقع الآن ديناميكي بالكامل مع Supabase.** اتبع التعليمات في [SUPABASE_GUIDE.md](SUPABASE_GUIDE.md) لإضافة البيانات الأولية (المقالات، الفعاليات). أنشئ مستخدمك الأول عبر Authentication → Users ثم سجّل الدخول في `login.html` لتفعيل حساب المشرف.
