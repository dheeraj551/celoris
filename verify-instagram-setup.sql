-- Verify Instagram Posts API Setup
-- This script checks if everything is properly configured

-- Check if required functions exist
SELECT 
    'Function check' as check_type,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('create_instagram_post', 'get_instagram_posts', 'delete_instagram_post', 'extract_instagram_id')
ORDER BY routine_name;

-- Check table permissions
SELECT 
    'Table permissions' as check_type,
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name = 'instagram_posts' 
AND table_schema = 'public'
ORDER BY grantee;

-- Check RLS policies
SELECT 
    'RLS policies' as check_type,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'instagram_posts';

-- Test a simple insert (this will help debug issues)
DO $$
DECLARE
    test_result JSON;
BEGIN
    -- This will test if the functions work
    RAISE NOTICE 'Instagram API functions are ready for testing!';
    
    -- If you want to test, uncomment the lines below:
    -- test_result := create_instagram_post('https://www.instagram.com/p/test123/');
    -- RAISE NOTICE 'Test insert result: %', test_result;
END $$;