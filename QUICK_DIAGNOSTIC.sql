-- QUICK DIAGNOSTIC - Check what broke
-- Run this in Supabase SQL Editor to identify the issue

-- Check 1: RLS Policies Status
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- Check 2: Instagram Posts Function Status
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'create_instagram_post';

-- Check 3: User Authentication Status
SELECT 
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as recent_users
FROM auth.users;

-- Check 4: Recent Instagram Posts
SELECT COUNT(*) as instagram_posts_count, MAX(created_at) as latest_post
FROM public.instagram_posts;

-- Check 5: Course Data Status
SELECT COUNT(*) as courses_count, MAX(created_at) as latest_course
FROM public.courses;