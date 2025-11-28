-- SAFE RLS KILL SWITCH
-- This will disable RLS and create open policies only on EXISTING tables
-- Run this in Supabase SQL Editor to fix authentication issues

-- First, let's see what tables actually exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ================================================
-- 1. DISABLE RLS ON EXISTING TABLES ONLY
-- ================================================

-- Disable RLS on main tables (only if they exist)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'courses' AND table_schema = 'public') THEN
        ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts' AND table_schema = 'public') THEN
        ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'instagram_posts' AND table_schema = 'public') THEN
        ALTER TABLE public.instagram_posts DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
        ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'educational_content' AND table_schema = 'public') THEN
        ALTER TABLE public.educational_content DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'course_enrollments' AND table_schema = 'public') THEN
        ALTER TABLE public.course_enrollments DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_transactions' AND table_schema = 'public') THEN
        ALTER TABLE public.payment_transactions DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admins' AND table_schema = 'public') THEN
        ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sessions' AND table_schema = 'public') THEN
        ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- ================================================
-- 2. DROP ALL EXISTING POLICIES (IF THEY EXIST)
-- ================================================

-- Drop all policies on courses table (if exists and has policies)
DO $$ 
BEGIN
    -- Drop policies on courses table
    DROP POLICY IF EXISTS "Users can view published courses" ON public.courses;
    DROP POLICY IF EXISTS "Users can view all courses" ON public.courses;
    DROP POLICY IF EXISTS "Users can create courses" ON public.courses;
    DROP POLICY IF EXISTS "Users can update their courses" ON public.courses;
    DROP POLICY IF EXISTS "Users can delete their courses" ON public.courses;
    DROP POLICY IF EXISTS "Admins can view all courses" ON public.courses;
    DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
    DROP POLICY IF EXISTS "Allow all for courses" ON public.courses;
    
    -- Drop policies on users table
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
    DROP POLICY IF EXISTS "Users can insert their profile" ON public.users;
    DROP POLICY IF EXISTS "Allow all for users" ON public.users;
    
    -- Drop policies on instagram_posts table
    DROP POLICY IF EXISTS "Users can view own Instagram posts" ON public.instagram_posts;
    DROP POLICY IF EXISTS "Users can manage own Instagram posts" ON public.instagram_posts;
    DROP POLICY IF EXISTS "Allow all for instagram_posts" ON public.instagram_posts;
    
    -- Drop policies on user_profiles table
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Users can insert their profile" ON public.user_profiles;
    DROP POLICY IF EXISTS "Allow all for user_profiles" ON public.user_profiles;
    
    -- Drop policies on blog_posts table
    DROP POLICY IF EXISTS "Users can view published blog posts" ON public.blog_posts;
    DROP POLICY IF EXISTS "Users can view all blog posts" ON public.blog_posts;
    DROP POLICY IF EXISTS "Users can create blog posts" ON public.blog_posts;
    DROP POLICY IF EXISTS "Users can update their blog posts" ON public.blog_posts;
    DROP POLICY IF EXISTS "Users can delete their blog posts" ON public.blog_posts;
    DROP POLICY IF EXISTS "Allow all for blog_posts" ON public.blog_posts;
    
    -- Drop policies on educational_content table
    DROP POLICY IF EXISTS "Users can view published content" ON public.educational_content;
    DROP POLICY IF EXISTS "Users can view all content" ON public.educational_content;
    DROP POLICY IF EXISTS "Users can create content" ON public.educational_content;
    DROP POLICY IF EXISTS "Users can update their content" ON public.educational_content;
    DROP POLICY IF EXISTS "Users can delete their content" ON public.educational_content;
    DROP POLICY IF EXISTS "Allow all for educational_content" ON public.educational_content;
    
    -- Drop policies on course_enrollments table
    DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.course_enrollments;
    DROP POLICY IF EXISTS "Users can create enrollments" ON public.course_enrollments;
    DROP POLICY IF EXISTS "Users can update their own enrollments" ON public.course_enrollments;
    DROP POLICY IF EXISTS "Users can delete their own enrollments" ON public.course_enrollments;
    DROP POLICY IF EXISTS "Allow all for course_enrollments" ON public.course_enrollments;
    
    -- Drop policies on payment_transactions table
    DROP POLICY IF EXISTS "Users can view their own transactions" ON public.payment_transactions;
    DROP POLICY IF EXISTS "Users can create transactions" ON public.payment_transactions;
    DROP POLICY IF EXISTS "Admins can view all transactions" ON public.payment_transactions;
    DROP POLICY IF EXISTS "Allow all for payment_transactions" ON public.payment_transactions;
    
    -- Drop policies on admins table
    DROP POLICY IF EXISTS "Admins can view their own record" ON public.admins;
    DROP POLICY IF EXISTS "Admins can manage their record" ON public.admins;
    DROP POLICY IF EXISTS "Allow all for admins" ON public.admins;
    
    -- Drop policies on sessions table
    DROP POLICY IF EXISTS "Users can view their own sessions" ON public.sessions;
    DROP POLICY IF EXISTS "Users can manage their sessions" ON public.sessions;
    DROP POLICY IF EXISTS "Allow all for sessions" ON public.sessions;
END $$;

-- ================================================
-- 3. CREATE COMPLETELY OPEN POLICIES ON EXISTING TABLES
-- ================================================

-- Allow EVERYTHING on existing tables
DO $$ 
BEGIN
    -- Create policy on courses table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'courses' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on courses" ON public.courses
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Create policy on users table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on users" ON public.users
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Create policy on instagram_posts table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'instagram_posts' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on instagram_posts" ON public.instagram_posts
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Create policy on user_profiles table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on user_profiles" ON public.user_profiles
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Create policy on blog_posts table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on blog_posts" ON public.blog_posts
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Create policy on educational_content table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'educational_content' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on educational_content" ON public.educational_content
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Create policy on course_enrollments table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'course_enrollments' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on course_enrollments" ON public.course_enrollments
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Create policy on payment_transactions table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_transactions' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on payment_transactions" ON public.payment_transactions
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Create policy on admins table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admins' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on admins" ON public.admins
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
    
    -- Create policy on sessions table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sessions' AND table_schema = 'public') THEN
        CREATE POLICY "Allow all operations on sessions" ON public.sessions
        FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ================================================
-- 4. VERIFICATION
-- ================================================

-- Check which tables exist and their RLS status
SELECT 
    t.table_name,
    t.rowsecurity as rls_enabled,
    COUNT(p.tablename) as policy_count
FROM information_schema.tables t
LEFT JOIN pg_policies p ON p.tablename = t.table_name AND p.schemaname = t.table_schema
WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
    AND t.table_name IN ('courses', 'users', 'instagram_posts', 'user_profiles', 'blog_posts', 'educational_content', 'course_enrollments', 'payment_transactions', 'admins', 'sessions')
GROUP BY t.table_name, t.rowsecurity
ORDER BY t.table_name;