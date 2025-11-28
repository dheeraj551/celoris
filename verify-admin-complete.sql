-- Verify admin user creation was successful
-- Run this after creating both auth user and profile

SELECT 
  'Admin Creation Status' as check_type,
  CASE 
    WHEN au.email IS NOT NULL AND u.username IS NOT NULL THEN '✅ Complete'
    WHEN au.email IS NOT NULL AND u.username IS NULL THEN '⚠️ Auth user exists, profile missing'
    WHEN au.email IS NULL THEN '❌ Auth user missing'
  END as status,
  COALESCE(au.email, 'No auth user') as email,
  COALESCE(u.username, 'No profile') as username,
  COALESCE(u.subscription_status, 'No status') as subscription_status
FROM (SELECT 'support@celorisdesigns.com' as email_check) email_check
LEFT JOIN auth.users au ON au.email = email_check.email_check
LEFT JOIN users u ON u.id = au.id;