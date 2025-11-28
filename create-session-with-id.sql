-- Create admin session JSON for x-admin-session header
-- Replace 'YOUR_ADMIN_ID_HERE' with the actual ID from Step 1

-- Method 1: If you know the admin user ID, use this:
WITH admin_user AS (
  SELECT id, username, full_name
  FROM users 
  WHERE id = 'YOUR_ADMIN_ID_HERE'  -- Replace with actual ID from Step 1
)
SELECT 
  json_build_object(
    'id', id,
    'email', 'support@celorisdesigns.com',
    'role', 'admin',
    'username', username,
    'full_name', full_name,
    'timestamp', EXTRACT(EPOCH FROM NOW())
  ) as x_admin_session_value;