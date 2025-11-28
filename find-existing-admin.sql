-- Alternative: Find existing admin user and use that
-- This queries for existing users and lets you choose one

-- Find all users that could be admin
SELECT 
  u.id,
  u.username,
  u.full_name,
  u.email,
  u.subscription_status,
  u.verification_status,
  au.email as auth_email,
  au.created_at as auth_created
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.username = 'admin' 
   OR u.full_name ILIKE '%admin%'
   OR au.email ILIKE '%admin%'
   OR au.email ILIKE '%support%'
ORDER BY u.created_at DESC;