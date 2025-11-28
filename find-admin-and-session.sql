-- FIND EXISTING ADMIN USER AND CREATE SESSION
-- This will find your working admin user and create the session JSON

SELECT 
  id::text as your_admin_id,
  username,
  full_name,
  subscription_status,
  '🎯 Copy this session for x-admin-session header:' as instruction,
  json_build_object(
    'id', id,
    'email', 'support@celorisdesigns.com',
    'role', 'admin',
    'username', username,
    'full_name', full_name,
    'timestamp', EXTRACT(EPOCH FROM NOW())
  ) as x_admin_session_header_value
FROM users 
WHERE username = 'admin' 
   OR username ILIKE '%admin%'
   OR full_name ILIKE '%admin%'
ORDER BY created_at DESC 
LIMIT 1;