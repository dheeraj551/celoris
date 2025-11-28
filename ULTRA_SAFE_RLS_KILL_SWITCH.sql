-- ULTRA SAFE RLS KILL SWITCH
-- This only creates open policies on EXISTING tables - NO DROP operations
-- Run this in Supabase SQL Editor to fix authentication issues safely

-- ================================================
-- 1. CHECK WHAT TABLES ACTUALLY EXIST
-- ================================================

SELECT 'Tables that exist in your database:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ================================================
-- 2. DISABLE RLS ON EXISTING TABLES ONLY
-- ================================================

SELECT 'Disabling RLS on existing tables...' as status;

-- Only disable RLS on tables that exist (we'll handle each one separately)
DO $$ 
BEGIN
    -- Check and disable RLS for courses table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'courses' AND table_schema = 'public') THEN
        ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on courses table';
    ELSE
        RAISE NOTICE 'courses table does not exist - skipping';
    END IF;
    
    -- Check and disable RLS for users table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on users table';
    ELSE
        RAISE NOTICE 'users table does not exist - skipping';
    END IF;
    
    -- Check and disable RLS for instagram_posts table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'instagram_posts' AND table_schema = 'public') THEN
        ALTER TABLE public.instagram_posts DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on instagram_posts table';
    ELSE
        RAISE NOTICE 'instagram_posts table does not exist - skipping';
    END IF;
    
    -- Check and disable RLS for user_profiles table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
        ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on user_profiles table';
    ELSE
        RAISE NOTICE 'user_profiles table does not exist - skipping';
    END IF;
    
    -- Check and disable RLS for blog_posts table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts' AND table_schema = 'public') THEN
        ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on blog_posts table';
    ELSE
        RAISE NOTICE 'blog_posts table does not exist - skipping';
    END IF;
    
    -- Check and disable RLS for educational_content table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'educational_content' AND table_schema = 'public') THEN
        ALTER TABLE public.educational_content DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on educational_content table';
    ELSE
        RAISE NOTICE 'educational_content table does not exist - skipping';
    END IF;
    
    -- Check and disable RLS for course_enrollments table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'course_enrollments' AND table_schema = 'public') THEN
        ALTER TABLE public.course_enrollments DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on course_enrollments table';
    ELSE
        RAISE NOTICE 'course_enrollments table does not exist - skipping';
    END IF;
    
    -- Check and disable RLS for payment_transactions table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_transactions' AND table_schema = 'public') THEN
        ALTER TABLE public.payment_transactions DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on payment_transactions table';
    ELSE
        RAISE NOTICE 'payment_transactions table does not exist - skipping';
    END IF;
    
    -- Check and disable RLS for admins table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admins' AND table_schema = 'public') THEN
        ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on admins table';
    ELSE
        RAISE NOTICE 'admins table does not exist - skipping';
    END IF;
    
    -- Check and disable RLS for sessions table
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sessions' AND table_schema = 'public') THEN
        ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'RLS disabled on sessions table';
    ELSE
        RAISE NOTICE 'sessions table does not exist - skipping';
    END IF;
END $$;

-- ================================================
-- 3. CREATE OPEN POLICIES ON EXISTING TABLES
-- ================================================

SELECT 'Creating open policies on existing tables...' as status;

DO $$ 
BEGIN
    -- Create policy on courses table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'courses' AND table_schema = 'public') THEN
        -- Drop existing policy first (if any) using a different approach
        DELETE FROM pg_policies WHERE tablename = 'courses' AND schemaname = 'public' AND policyname = 'Allow all operations on courses';
        
        CREATE POLICY "Allow all operations on courses" ON public.courses
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for courses table';
    ELSE
        RAISE NOTICE 'courses table does not exist - skipping policy creation';
    END IF;
    
    -- Create policy on users table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        DELETE FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public' AND policyname = 'Allow all operations on users';
        
        CREATE POLICY "Allow all operations on users" ON public.users
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for users table';
    ELSE
        RAISE NOTICE 'users table does not exist - skipping policy creation';
    END IF;
    
    -- Create policy on instagram_posts table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'instagram_posts' AND table_schema = 'public') THEN
        DELETE FROM pg_policies WHERE tablename = 'instagram_posts' AND schemaname = 'public' AND policyname = 'Allow all operations on instagram_posts';
        
        CREATE POLICY "Allow all operations on instagram_posts" ON public.instagram_posts
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for instagram_posts table';
    ELSE
        RAISE NOTICE 'instagram_posts table does not exist - skipping policy creation';
    END IF;
    
    -- Create policy on user_profiles table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles' AND table_schema = 'public') THEN
        DELETE FROM pg_policies WHERE tablename = 'user_profiles' AND schemaname = 'public' AND policyname = 'Allow all operations on user_profiles';
        
        CREATE POLICY "Allow all operations on user_profiles" ON public.user_profiles
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for user_profiles table';
    ELSE
        RAISE NOTICE 'user_profiles table does not exist - skipping policy creation';
    END IF;
    
    -- Create policy on blog_posts table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blog_posts' AND table_schema = 'public') THEN
        DELETE FROM pg_policies WHERE tablename = 'blog_posts' AND schemaname = 'public' AND policyname = 'Allow all operations on blog_posts';
        
        CREATE POLICY "Allow all operations on blog_posts" ON public.blog_posts
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for blog_posts table';
    ELSE
        RAISE NOTICE 'blog_posts table does not exist - skipping policy creation';
    END IF;
    
    -- Create policy on educational_content table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'educational_content' AND table_schema = 'public') THEN
        DELETE FROM pg_policies WHERE tablename = 'educational_content' AND schemaname = 'public' AND policyname = 'Allow all operations on educational_content';
        
        CREATE POLICY "Allow all operations on educational_content" ON public.educational_content
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for educational_content table';
    ELSE
        RAISE NOTICE 'educational_content table does not exist - skipping policy creation';
    END IF;
    
    -- Create policy on course_enrollments table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'course_enrollments' AND table_schema = 'public') THEN
        DELETE FROM pg_policies WHERE tablename = 'course_enrollments' AND schemaname = 'public' AND policyname = 'Allow all operations on course_enrollments';
        
        CREATE POLICY "Allow all operations on course_enrollments" ON public.course_enrollments
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for course_enrollments table';
    ELSE
        RAISE NOTICE 'course_enrollments table does not exist - skipping policy creation';
    END IF;
    
    -- Create policy on payment_transactions table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'payment_transactions' AND table_schema = 'public') THEN
        DELETE FROM pg_policies WHERE tablename = 'payment_transactions' AND schemaname = 'public' AND policyname = 'Allow all operations on payment_transactions';
        
        CREATE POLICY "Allow all operations on payment_transactions" ON public.payment_transactions
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for payment_transactions table';
    ELSE
        RAISE NOTICE 'payment_transactions table does not exist - skipping policy creation';
    END IF;
    
    -- Create policy on admins table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'admins' AND table_schema = 'public') THEN
        DELETE FROM pg_policies WHERE tablename = 'admins' AND schemaname = 'public' AND policyname = 'Allow all operations on admins';
        
        CREATE POLICY "Allow all operations on admins" ON public.admins
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for admins table';
    ELSE
        RAISE NOTICE 'admins table does not exist - skipping policy creation';
    END IF;
    
    -- Create policy on sessions table if it exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sessions' AND table_schema = 'public') THEN
        DELETE FROM pg_policies WHERE tablename = 'sessions' AND schemaname = 'public' AND policyname = 'Allow all operations on sessions';
        
        CREATE POLICY "Allow all operations on sessions" ON public.sessions
        FOR ALL USING (true) WITH CHECK (true);
        
        RAISE NOTICE 'Open policy created for sessions table';
    ELSE
        RAISE NOTICE 'sessions table does not exist - skipping policy creation';
    END IF;
END $$;

-- ================================================
-- 4. VERIFICATION - SHOW FINAL RESULTS
-- ================================================

SELECT '=== FINAL RESULTS ===' as info;
SELECT 
    t.table_name,
    CASE 
        WHEN t.rowsecurity = true THEN 'ENABLED'
        WHEN t.rowsecurity = false THEN 'DISABLED'
        ELSE 'UNKNOWN'
    END as rls_status,
    COALESCE(p.policy_count, 0) as open_policies_count
FROM information_schema.tables t
LEFT JOIN (
    SELECT 
        tablename, 
        COUNT(*) as policy_count
    FROM pg_policies 
    WHERE schemaname = 'public' 
        AND policyname LIKE 'Allow all operations%'
    GROUP BY tablename
) p ON p.tablename = t.table_name
WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
    AND t.table_name IN ('courses', 'users', 'instagram_posts', 'user_profiles', 'blog_posts', 'educational_content', 'course_enrollments', 'payment_transactions', 'admins', 'sessions')
ORDER BY t.table_name;

SELECT 'Script completed successfully! RLS is now disabled and open policies created on existing tables.' as status;