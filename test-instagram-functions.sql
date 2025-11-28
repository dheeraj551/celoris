-- Test script to verify Instagram posts functions work
-- Run this after complete-all-instagram-setup.sql

-- Test 1: Check if functions exist
SELECT 
    'Function check' as test,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('create_instagram_post', 'get_instagram_posts', 'delete_instagram_post', 'extract_instagram_id')
ORDER BY routine_name;

-- Test 2: Test extract_instagram_id function with sample URLs
SELECT 
    'Extract function test' as test,
    url,
    extract_instagram_id(url) as extracted_id
FROM (
    VALUES 
        ('https://www.instagram.com/p/DOGnjUUkfhS/'),
        ('https://www.instagram.com/reel/test123/'),
        ('https://instagram.com/p/abc123'),
        ('https://www.instagram.com/p/xyz789?hl=en'),
        ('https://www.instagram.com/reel/def456/')
) AS test_urls(url);

-- Test 3: Check current posts in table
SELECT 
    'Posts check' as test,
    COUNT(*) as total_posts,
    COUNT(CASE WHEN instagram_id IS NOT NULL THEN 1 END) as posts_with_id
FROM public.instagram_posts;

-- Test 4: RLS status check
SELECT 
    'RLS status' as test,
    tablename,
    rowsecurity,
    CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as status
FROM pg_tables 
WHERE tablename = 'instagram_posts' AND schemaname = 'public';

-- Test 5: Check policies
SELECT 
    'RLS policies' as test,
    policyname,
    cmd,
    roles
FROM pg_policies 
WHERE tablename = 'instagram_posts';

-- Final result
DO $$
BEGIN
    RAISE NOTICE 'Instagram posts system is ready for testing!';
    RAISE NOTICE 'Try adding an Instagram post now - should work without 500 error.';
END $$;