-- Verify admin user setup
-- Run this to check if admin user was created successfully

-- Check if user exists in auth.users
SELECT 'auth_users' as table_name, id, email, created_at
FROM auth.users
WHERE email = 'support@celorisdesigns.com'

UNION ALL

-- Check if user profile exists in users table
SELECT 'users_profile' as table_name, id::text, username as email, created_at
FROM users
WHERE username = 'admin' OR id IN (SELECT id FROM auth.users WHERE email = 'support@celorisdesigns.com')

UNION ALL

-- Check if instagram_posts table exists
SELECT 'instagram_posts' as table_name, 
       table_name as id, 
       'Table exists' as email, 
       NOW() as created_at
FROM information_schema.tables 
WHERE table_name = 'instagram_posts' AND table_schema = 'public'

ORDER BY table_name;