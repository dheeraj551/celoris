-- Find the existing admin user that's already working
-- Look for admin users in the users table

SELECT 
  id, 
  username, 
  full_name, 
  bio,
  subscription_status,
  verification_status,
  created_at
FROM users 
WHERE username ILIKE '%admin%'
   OR full_name ILIKE '%admin%'
   OR bio ILIKE '%admin%'
ORDER BY created_at DESC;