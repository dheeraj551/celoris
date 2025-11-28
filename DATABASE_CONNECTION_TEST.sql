// DATABASE CONNECTION TEST
// Test this in Supabase SQL Editor to check if the database is accessible

-- Check 1: Basic table access
SELECT COUNT(*) as total_courses FROM public.courses;

-- Check 2: Featured courses specifically
SELECT COUNT(*) as featured_courses FROM public.courses WHERE is_featured = true;

-- Check 3: Recent course data
SELECT id, title, subject, is_featured, created_at 
FROM public.courses 
ORDER BY created_at DESC 
LIMIT 5;

-- Check 4: Instagram posts
SELECT COUNT(*) as instagram_posts FROM public.instagram_posts;

-- Check 5: User table
SELECT COUNT(*) as total_users FROM public.users;

-- Check 6: Authentication status
SELECT COUNT(*) as total_auth_users FROM auth.users;