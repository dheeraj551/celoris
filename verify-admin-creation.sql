-- Verify admin user setup after creation
-- Run this to confirm the admin user was created successfully

-- Check if admin exists in both auth.users and users tables
SELECT 
  'Auth User' as source,
  au.id::text,
  au.email,
  u.username,
  u.full_name,
  u.subscription_status,
  u.verification_status
FROM auth.users au
LEFT JOIN users u ON au.id = u.id
WHERE au.email = 'support@celorisdesigns.com'

UNION ALL

-- Check if admin profile exists in users table
SELECT 
  'User Profile' as source,
  u.id::text,
  COALESCE(au.email, 'No auth record') as email,
  u.username,
  u.full_name,
  u.subscription_status,
  u.verification_status
FROM users u
LEFT JOIN auth.users au ON u.id = au.id
WHERE u.username = 'admin' OR au.email = 'support@celorisdesigns.com'

ORDER BY source;