-- Verify admin user and Instagram setup after quick creation

-- Check admin user exists
SELECT 'Admin User Status' as check_type,
       id::text,
       username,
       full_name,
       subscription_status,
       verification_status
FROM users 
WHERE username = 'admin';

-- Check Instagram table exists
SELECT 'Instagram Table Status' as check_type,
       table_name,
       'Ready for use' as status
FROM information_schema.tables 
WHERE table_name = 'instagram_posts' 
  AND table_schema = 'public';

-- Test admin session creation
WITH admin_user AS (
  SELECT id, username, full_name 
  FROM users 
  WHERE username = 'admin'
)
SELECT 
  'Admin Session Ready' as status,
  json_build_object(
    'id', id,
    'email', 'support@celorisdesigns.com', 
    'role', 'admin',
    'username', username,
    'full_name', full_name,
    'timestamp', EXTRACT(EPOCH FROM NOW())
  ) as session_json
FROM admin_user;