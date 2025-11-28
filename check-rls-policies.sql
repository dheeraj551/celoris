-- Check Current RLS Policies for blog_posts
-- Run this in your Supabase SQL Editor

-- 1. Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'blog_posts'
ORDER BY policyname;

-- 2. Show RLS status
SELECT 
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'blog_posts';

-- 3. Check if public read access exists
SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'blog_posts' 
    AND policyname LIKE '%public%read%'
) as public_read_policy_exists;

-- 4. Try to see what's in the table (this might fail due to RLS)
SELECT 
    COUNT(*) as total_posts,
    COUNT(CASE WHEN is_published = true THEN 1 END) as published_posts
FROM public.blog_posts;