-- شغّل هذا الكود كاملاً في SQL Editor في Supabase Dashboard
-- يصلح سياسات RLS على جدول profiles لاستخدام دوال SECURITY DEFINER
-- (للتخلص من مشكلة عدم ظهور الأعضاء للأدمن)

-- ============================================================
-- 1. التأكد من وجود دوال SECURITY DEFINER
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin' AND is_approved = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_editor_or_above()
RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor', 'publisher') AND is_approved = true
  );
$$;

-- ============================================================
-- 2. إصلاح سياسات profiles
-- ============================================================
DROP POLICY IF EXISTS "profiles_read_own" ON profiles;
CREATE POLICY "profiles_read_own" ON profiles FOR SELECT USING (
  auth.uid() = id OR public.is_admin()
);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (
  auth.uid() = id OR public.is_admin()
);
