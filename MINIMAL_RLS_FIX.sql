-- MINIMAL RLS FIX
-- Only disable RLS and create policies - no verification queries

-- Show tables that exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Fix courses table (only if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'courses' AND table_schema = 'public') THEN
        ALTER TABLE public.courses DISABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow all courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Fix instagram_posts table (only if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'instagram_posts' AND table_schema = 'public') THEN
        ALTER TABLE public.instagram_posts DISABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow all instagram_posts" ON public.instagram_posts FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- Fix users table (only if exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow all users" ON public.users FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

SELECT 'Done!' as status;