-- شغّل هذا الكود في SQL Editor في Supabase Dashboard
-- ينشئ دالة SECURITY DEFINER لإنشاء الملف الشخصي + طلب العضوية
-- (تتجاوز RLS وتحل مشكلة 401)

CREATE OR REPLACE FUNCTION public.create_join_request(
  p_user_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_origin TEXT DEFAULT NULL,
  p_interests TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_how_knew TEXT DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, is_approved)
  VALUES (p_user_id, p_name, p_email, 'member', false)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.membership_requests (full_name, email, phone, city, origin, interests, bio, how_knew, profile_id, status)
  VALUES (p_name, p_email, p_phone, p_city, p_origin, p_interests, p_bio, p_how_knew, p_user_id, 'pending')
  ON CONFLICT DO NOTHING;
END;
$$;

-- السماح للمستخدمين غير المسجلين والمسجلين باستخدام الدالة
GRANT EXECUTE ON FUNCTION public.create_join_request TO anon, authenticated;
