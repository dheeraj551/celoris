-- COMPLETE RLS KILL SWITCH
-- This will completely disable ALL RLS and create completely open policies
-- Run this in Supabase SQL Editor to fix authentication issues

-- ================================================
-- 1. DISABLE RLS ON ALL TABLES
-- ================================================

-- Disable RLS on main tables
ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;

-- ================================================
-- 2. DROP ALL EXISTING POLICIES
-- ================================================

-- Drop all policies on courses table
DROP POLICY IF EXISTS "Users can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view all courses" ON public.courses;
DROP POLICY IF EXISTS "Users can create courses" ON public.courses;
DROP POLICY IF EXISTS "Users can update their courses" ON public.courses;
DROP POLICY IF EXISTS "Users can delete their courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can view all courses" ON public.courses;
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Allow all for courses" ON public.courses;

-- Drop all policies on users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their profile" ON public.users;
DROP POLICY IF EXISTS "Allow all for users" ON public.users;

-- Drop all policies on instagram_posts table
DROP POLICY IF EXISTS "Users can view own Instagram posts" ON public.instagram_posts;
DROP POLICY IF EXISTS "Users can manage own Instagram posts" ON public.instagram_posts;
DROP POLICY IF EXISTS "Allow all for instagram_posts" ON public.instagram_posts;

-- Drop all policies on user_profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow all for user_profiles" ON public.user_profiles;

-- Drop all policies on blog_posts table
DROP POLICY IF EXISTS "Users can view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can view all blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can create blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can update their blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Users can delete their blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Allow all for blog_posts" ON public.blog_posts;

-- Drop all policies on educational_content table
DROP POLICY IF EXISTS "Users can view published content" ON public.educational_content;
DROP POLICY IF EXISTS "Users can view all content" ON public.educational_content;
DROP POLICY IF EXISTS "Users can create content" ON public.educational_content;
DROP POLICY IF EXISTS "Users can update their content" ON public.educational_content;
DROP POLICY IF EXISTS "Users can delete their content" ON public.educational_content;
DROP POLICY IF EXISTS "Allow all for educational_content" ON public.educational_content;

-- Drop all policies on course_enrollments table
DROP POLICY IF EXISTS "Users can view their own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can create enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can delete their own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Allow all for course_enrollments" ON public.course_enrollments;

-- Drop all policies on payment_transactions table
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.payment_transactions;
DROP POLICY IF EXISTS "Allow all for payment_transactions" ON public.payment_transactions;

-- Drop all policies on admins table
DROP POLICY IF EXISTS "Admins can view their own record" ON public.admins;
DROP POLICY IF EXISTS "Admins can manage their record" ON public.admins;
DROP POLICY IF EXISTS "Allow all for admins" ON public.admins;

-- Drop all policies on sessions table
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.sessions;
DROP POLICY IF EXISTS "Users can manage their sessions" ON public.sessions;
DROP POLICY IF EXISTS "Allow all for sessions" ON public.sessions;

-- ================================================
-- 3. CREATE COMPLETELY OPEN POLICIES
-- ================================================

-- Allow EVERYTHING on courses table
CREATE POLICY "Allow all operations on courses" ON public.courses
FOR ALL USING (true) WITH CHECK (true);

-- Allow EVERYTHING on users table
CREATE POLICY "Allow all operations on users" ON public.users
FOR ALL USING (true) WITH CHECK (true);

-- Allow EVERYTHING on instagram_posts table
CREATE POLICY "Allow all operations on instagram_posts" ON public.instagram_posts
FOR ALL USING (true) WITH CHECK (true);

-- Allow EVERYTHING on user_profiles table
CREATE POLICY "Allow all operations on user_profiles" ON public.user_profiles
FOR ALL USING (true) WITH CHECK (true);

-- Allow EVERYTHING on blog_posts table
CREATE POLICY "Allow all operations on blog_posts" ON public.blog_posts
FOR ALL USING (true) WITH CHECK (true);

-- Allow EVERYTHING on educational_content table
CREATE POLICY "Allow all operations on educational_content" ON public.educational_content
FOR ALL USING (true) WITH CHECK (true);

-- Allow EVERYTHING on course_enrollments table
CREATE POLICY "Allow all operations on course_enrollments" ON public.course_enrollments
FOR ALL USING (true) WITH CHECK (true);

-- Allow EVERYTHING on payment_transactions table
CREATE POLICY "Allow all operations on payment_transactions" ON public.payment_transactions
FOR ALL USING (true) WITH CHECK (true);

-- Allow EVERYTHING on admins table
CREATE POLICY "Allow all operations on admins" ON public.admins
FOR ALL USING (true) WITH CHECK (true);

-- Allow EVERYTHING on sessions table
CREATE POLICY "Allow all operations on sessions" ON public.sessions
FOR ALL USING (true) WITH CHECK (true);

-- ================================================
-- 4. VERIFICATION
-- ================================================

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('courses', 'users', 'instagram_posts', 'user_profiles', 'blog_posts', 'educational_content', 'course_enrollments', 'payment_transactions', 'admins', 'sessions');

-- Check policies count
SELECT schemaname, tablename, COUNT(*) as policy_count
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;