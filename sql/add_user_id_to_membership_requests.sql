ALTER TABLE membership_requests ADD COLUMN IF NOT EXISTS user_id UUID;

-- Update the create_join_request function to include user_id if not already
CREATE OR REPLACE FUNCTION public.create_join_request(
  p_user_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_city TEXT DEFAULT '',
  p_origin TEXT DEFAULT NULL,
  p_interests TEXT DEFAULT NULL,
  p_bio TEXT DEFAULT '',
  p_how_knew TEXT DEFAULT NULL
)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role, is_approved)
  VALUES (p_user_id, p_name, p_email, 'member', false)
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO membership_requests (full_name, email, phone, city, origin, interests, bio, how_knew, user_id, status)
  VALUES (p_name, p_email, p_phone, p_city, p_origin, p_interests, p_bio, p_how_knew, p_user_id, 'pending')
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;
