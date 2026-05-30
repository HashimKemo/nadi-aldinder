# AGENTS.md — نادي الدندر الثقافي الاجتماعي

## Project Type
Static multi-page Arabic HTML site (9 pages). **No build tools, no frameworks, no package.json.** Pure HTML+CSS+JS, hosted on GitHub Pages.

## Architecture

| Layer | File(s) | Role |
|-------|---------|------|
| Styles | `css/main.css` (~2300 lines) | CSS custom properties, RTL, responsive, theme vars |
| Shared JS | `js/main.js` | Menu toggle, scroll reveal, `checkUserSession()` (session badge in header) |
| Supabase | `js/supabase.js` | Client init (`supabaseClient` global), newsletter handler, health check |
| Page-specific JS | inline in each `.html` | Articles (Supabase), admin (auth+CRUD), events (Supabase), login (auth) |
| DB | Supabase (remote) | Tables: `articles`, `profiles`, `subscribers`, `membership_requests`, `events`, `contact_messages`, `event_registrations`, `article_comments` |

## Critical Setup — Supabase

- **Supabase config** is in `js/supabase.js` — `SUPABASE_URL` + `SUPABASE_ANON_KEY` are hardcoded (anon key is safe with RLS).
- **RLS policies** must use SECURITY DEFINER functions to avoid infinite recursion:
  - `public.is_admin()` — checks `profiles.role = 'admin'`
  - `public.is_editor_or_above()` — checks `role IN ('admin','editor','publisher')`
  - Do NOT use raw subqueries like `(SELECT role FROM profiles WHERE id = auth.uid())` — they cause recursion.
- **Free tier pauses after 7 days** of inactivity. `supabase.js` has a health check (`checkSupabase()`) that shows a red banner if paused.
- **First user** who logs in becomes admin via `should_create_admin()` RPC.
- **Seed data**: `sql/seed_articles.sql` has 8 articles. Run in Supabase SQL Editor.

## Roles & Admin

| Role | Admin tab access | Can CRUD articles |
|------|-----------------|-------------------|
| `admin` | All 5 tabs | Full (create, edit, delete, publish) |
| `editor` | Dashboard + Articles only | Create + edit (no delete) |
| `publisher` | Dashboard + Articles only | Create + edit + publish |
| `viewer` | Redirected to `index.html` | None |

- `admin.html` — `setupRoleBasedUI()` hides tabs by `data-role="admin"` attribute.
- `loadMembers()` and `loadSubscribers()` have `if (!container) return;` null guard.
- Admin `DOMContentLoaded` is wrapped in `try/catch`.

## Key Conventions

- **Forms**: All submit to Supabase directly. `class="newsletter-form"` is auto-handled by `supabase.js`. No Formspree.
- **Dates**: Use `fmtDate()` helper (handles null → `—`) never `new Date(null)`.
- **Icons**: Font Awesome 6 self-hosted in `lib/fontawesome/`. Always add `aria-hidden="true"`.
- **Arabic RTL**: `dir="rtl"` on `<html>`. CSS vars for spacing, no hardcoded margins.
- **Animations**: `class="reveal"` + IntersectionObserver in `main.js`.
- **Mobile menu**: Dropdown below header (not full-screen). `nav--open` / `menu-toggle--active` classes.

## Important Files

- `STATE.md` — Project progress, all phases completed up to Phase 9.
- `SUPABASE_GUIDE.md` — Full SQL for tables, RLS policies (SECURITY DEFINER versions), and setup steps.
- `CONTENT.md` — All Arabic text content for the site.
- `sql/seed_articles.sql` — 8 initial articles INSERT.
- `DEPLOY.md` — GitHub Pages deployment guide (Arabic).
- `MAINTENANCE.md` — Regular maintenance guide (Arabic).

## Common Tasks

| Task | What to do |
|------|-----------|
| Add a new article | Use admin.html "مقالة جديدة" modal (or `INSERT INTO articles` in SQL Editor) |
| Add an event | `INSERT INTO events` in SQL Editor |
| View registered users | admin.html → إدارة المستخدمين tab |
| Approve members | admin.html → لوحة التحكم tab → طلبات العضوية |
| Fix RLS issues | Re-run SECURITY DEFINER functions + policies from SUPABASE_GUIDE.md Part 3 |
| Moderate comments | admin.html → التعليقات tab (editor+) — delete unwanted comments |
| Add comments table | Run SQL from SUPABASE_GUIDE.md Part 13 in SQL Editor |
| Wake up Supabase | Visit Supabase Dashboard → project → Resume (if paused) |

## Gotchas

- `published_at` can be `null` (for drafts). Always use `fmtDate()` not raw `new Date()`.
- All `<script>` tags load Supabase CDN first, then `supabase.js`, then page-specific code. Order matters.
- The CRUD event listeners in admin are set up inside `setupArticleCRUD()` called from `DOMContentLoaded` — NOT at script load time.
- `article.html` expects `?id=` query param. `increment_views` RPC must exist in DB.
- Events countdown fetches nearest future event from Supabase — if no events exist, shows "لا توجد فعاليات قادمة".
- Comments on articles are published instantly (no moderation queue). Admins/Editors/Publishers can delete via the article page or admin panel.
- Article users with "confirmed" role (admin/editor/publisher) see a "حذف" button on every comment when viewing article.html.
- The `article_comments` table uses `parent_id` (self-referencing FK) for nested replies (max 2 levels visually).
- When deleting a comment via admin panel, all its child replies are CASCADE deleted.
