-- FIND YOUR EXISTING ADMIN USER
-- Run this to find the admin user that's already working

SELECT 
  id, 
  username, 
  full_name, 
  bio,
  subscription_status,
  verification_status,
  created_at
FROM users 
WHERE username = 'admin' 
   OR username ILIKE '%admin%'
   OR full_name ILIKE '%admin%'
ORDER BY created_at DESC 
LIMIT 1;