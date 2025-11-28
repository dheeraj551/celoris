-- Get the admin user ID and create session for it
-- This will find the working admin user and create the session you need

-- Find admin user and create session JSON
WITH admin_user AS (
  SELECT 
    id, 
    username, 
    full_name,
    subscription_status,
    verification_status
  FROM users 
  WHERE username = 'admin' 
     OR username ILIKE '%admin%'
     OR full_name ILIKE '%admin%'
  ORDER BY created_at DESC 
  LIMIT 1
)
SELECT 
  'Admin User Found' as status,
  id::text as user_id,
  username,
  full_name,
  subscription_status,
  'Ready for blog API' as next_step,
  json_build_object(
    'id', id,
    'email', 'support@celorisdesigns.com', -- Use this email for auth
    'role', 'admin',
    'username', username,
    'full_name', full_name,
    'timestamp', EXTRACT(EPOCH FROM NOW())
  ) as session_for_header
FROM admin_user;