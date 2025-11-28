-- Create admin session after admin user is created
-- This gives you the session JSON to use in x-admin-session header

-- Get the admin user details
WITH admin_user AS (
  SELECT id, username, full_name 
  FROM users 
  WHERE username = 'admin'
)
SELECT 
  json_build_object(
    'id', id,
    'email', 'support@celorisdesigns.com', 
    'role', 'admin',
    'username', username,
    'full_name', full_name,
    'timestamp', EXTRACT(EPOCH FROM NOW())
  ) as admin_session
FROM admin_user;