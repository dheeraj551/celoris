-- SIMPLE RLS KILL SWITCH
-- Just disable RLS and create open policies - this will definitely work

-- Show what tables exist
SELECT 'Tables in your database:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Disable RLS on courses table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'courses' AND table_schema = 'public') THEN
        ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow all operations on courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Disable RLS on instagram_posts table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'instagram_posts' AND table_schema = 'public') THEN
        ALTER TABLE public.instagram_posts DISABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow all operations on instagram_posts" ON public.instagram_posts FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Disable RLS on users table (only if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow all operations on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Verify the results
SELECT 'Final RLS Status:' as info;
SELECT table_name, 
       CASE WHEN rowsecurity THEN 'ENABLED' ELSE 'DISABLED' END as rls_status
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('courses', 'instagram_posts', 'users', 'user_profiles', 'blog_posts')
ORDER BY table_name;