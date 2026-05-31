-- ============================================================
-- الترحيل: إضافة دور "member" وإصلاح خطأ 403 عند التسجيل
-- ============================================================

-- 1. تحديل الأدوار الحالية من viewer → member
UPDATE profiles SET role = 'member' WHERE role = 'viewer';

-- 2. تحديث CHECK constraint: إزالة viewer وإضافة member
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('admin', 'editor', 'publisher', 'member'));

-- 3. إنشاء دالة SECURITY DEFINER لإدراج الملف الشخصي (تتجاوز RLS)
CREATE OR REPLACE FUNCTION public.create_profile_on_signup(
  user_id UUID,
  user_name TEXT,
  user_email TEXT
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  -- لا تنشئ الحساب إلا إذا كان البريد معتمداً مسبقاً عبر طلب العضوية
  IF EXISTS (SELECT 1 FROM public.membership_requests WHERE email = user_email AND status = 'approved') THEN
    INSERT INTO public.profiles (id, name, email, role, is_approved)
    VALUES (user_id, user_name, user_email, 'member', true)
    ON CONFLICT (id) DO NOTHING;
  ELSE
    RAISE EXCEPTION 'لم يتم اعتماد البريد الإلكتروني. قدّم طلب انضمام أولاً.';
  END IF;
END;
$$;

-- 4. منح صلاحية الاستدعاء للمستخدمين غير المسجلين (anon) والمصادق عليهم
GRANT EXECUTE ON FUNCTION public.create_profile_on_signup TO anon, authenticated;
