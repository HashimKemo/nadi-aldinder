-- Fill user_id for old membership_requests by matching email in auth.users
UPDATE membership_requests mr
SET user_id = au.id
FROM auth.users au
WHERE mr.user_id IS NULL
  AND mr.email = au.email
  AND mr.status = 'pending';

-- Show what was updated
SELECT mr.id, mr.full_name, mr.email, mr.user_id
FROM membership_requests mr
WHERE mr.status = 'pending'
ORDER BY mr.created_at DESC;
