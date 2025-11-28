-- Test script to verify Instagram posts table works
-- Run this after applying any of the fixes

-- Test 1: Check if we can select from the table
SELECT 'Test 1: SELECT permission' as test, COUNT(*) as total_posts FROM public.instagram_posts;

-- Test 2: Check RLS status
SELECT 
    'Test 2: RLS status' as test,
    schemaname,
    tablename,
    rowsecurity,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_tables 
WHERE tablename = 'instagram_posts' AND schemaname = 'public';

-- Test 3: Check current policies
SELECT 
    'Test 3: RLS policies' as test,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'instagram_posts';

-- Test 4: Check permissions
SELECT 
    'Test 4: Table permissions' as test,
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'instagram_posts' AND table_schema = 'public';

-- Test 5: Try a test insert (this might fail if auth is required, but should not 500)
-- DO $$
-- BEGIN
--     RAISE NOTICE 'Ready for test insert...';
-- END $$;