-- Diagnostic script to check current Instagram posts table state
-- This will help identify the exact issue causing 500 error

-- Check if table exists and its structure
SELECT 
    'Table exists' as check_status,
    table_name
FROM information_schema.tables 
WHERE table_name = 'instagram_posts' AND table_schema = 'public';

-- Show table columns
SELECT 
    'Table columns' as check_status,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'instagram_posts' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check current RLS policies
SELECT 
    'RLS policies' as check_status,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'instagram_posts';

-- Check if RLS is enabled
SELECT 
    'RLS enabled' as check_status,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'instagram_posts' AND schemaname = 'public';

-- Check table permissions
SELECT 
    'Table grants' as check_status,
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'instagram_posts' AND table_schema = 'public';