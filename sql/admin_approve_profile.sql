-- شغّل هذا الكود في SQL Editor في Supabase Dashboard
-- ينشئ دالة SECURITY DEFINER لاستخدامها من لوحة التحكم عند قبول طلب عضوية
-- (تتجاوز RLS وتنشئ البروفايل بدون إنشاء طلب عضوية مكرر)

CREATE OR REPLACE FUNCTION public.admin_approve_profile(
  p_user_id UUID,
  p_name TEXT,
  p_email TEXT
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, is_approved)
  VALUES (p_user_id, p_name, p_email, 'member', true)
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = 'member',
    is_approved = true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_approve_profile TO authenticated;
