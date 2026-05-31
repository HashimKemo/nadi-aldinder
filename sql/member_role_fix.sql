-- ============================================================
-- التحديث 1: إضافة دور member وحذف viewer
-- ============================================================

-- أولاً: تحديث جميع profiles الموجودة من viewer -> member
UPDATE profiles SET role = 'member' WHERE role = 'viewer';

-- ثانياً: تحديث CHECK constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'editor', 'publisher', 'member'));

-- ============================================================
-- التحديث 2: دالة SECURITY DEFINER لإنشاء الملف الشخصي بعد التسجيل
-- (تتجاوز RLS لمنع خطأ 403)
-- ============================================================

CREATE OR REPLACE FUNCTION public.create_profile_on_signup(
  user_id UUID,
  user_name TEXT,
  user_email TEXT
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, is_approved)
  VALUES (user_id, user_name, user_email, 'member', true)
  ON CONFLICT (id) DO NOTHING;
END;
$$;

-- منح صلاحية التنفيذ للمستخدمين المجهولين والمصادق عليهم
GRANT EXECUTE ON FUNCTION public.create_profile_on_signup TO anon, authenticated;
