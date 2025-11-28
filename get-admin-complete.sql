-- COMPLETE: Find admin user and create session in one query
-- Run this to get everything you need

-- Find the admin user and create session JSON
WITH admin_user AS (
  SELECT 
    id, 
    username, 
    full_name,
    subscription_status
  FROM users 
  WHERE username = 'admin' 
     OR username ILIKE '%admin%'
     OR full_name ILIKE '%admin%'
  ORDER BY created_at DESC 
  LIMIT 1
)
SELECT 
  id::text as admin_user_id,
  username,
  full_name,
  subscription_status,
  'Use this ID in session' as instruction,
  json_build_object(
    'id', id,
    'email', 'support@celorisdesigns.com',
    'role', 'admin',
    'username', username,
    'full_name', full_name,
    'timestamp', EXTRACT(EPOCH FROM NOW())
  ) as session_json_for_header
FROM admin_user;