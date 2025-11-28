-- SUPER SIMPLE RLS FIX
-- Just disable RLS and create open policies - ignore existing policies
-- This version won't fail on any table-related errors

-- ================================================
-- 1. CHECK WHAT TABLES EXIST
-- ================================================

SELECT '=== YOUR EXISTING TABLES ===' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- ================================================
-- 2. DISABLE RLS ON ALL EXISTING TABLES
-- ================================================

SELECT 'Disabling RLS on all your tables...' as status;

DO $$
DECLARE
    rec record;
BEGIN
    FOR rec IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            AND table_name IN ('courses', 'users', 'instagram_posts', 'user_profiles', 'blog_posts', 'educational_content', 'course_enrollments', 'payment_transactions', 'admins', 'sessions')
        ORDER BY table_name
    LOOP
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', rec.table_name);
        RAISE NOTICE 'RLS disabled on table: %', rec.table_name;
    END LOOP;
END $$;

-- ================================================
-- 3. CREATE OPEN POLICIES ON ALL EXISTING TABLES
-- ================================================

SELECT 'Creating open policies on all your tables...' as status;

DO $$
DECLARE
    rec record;
    policy_name text;
BEGIN
    FOR rec IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            AND table_name IN ('courses', 'users', 'instagram_posts', 'user_profiles', 'blog_posts', 'educational_content', 'course_enrollments', 'payment_transactions', 'admins', 'sessions')
        ORDER BY table_name
    LOOP
        policy_name := 'Allow all operations on ' || rec.table_name;
        
        -- Try to drop existing policy (ignore errors)
        BEGIN
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', policy_name, rec.table_name);
        EXCEPTION WHEN undefined_object THEN
            -- Policy doesn't exist, that's fine
            NULL;
        END;
        
        -- Create new open policy
        EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL USING (true) WITH CHECK (true)', policy_name, rec.table_name);
        RAISE NOTICE 'Open policy created for table: %', rec.table_name;
    END LOOP;
END $$;

-- ================================================
-- 4. FINAL VERIFICATION
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

SELECT 'SUCCESS: RLS disabled and open policies created on all your existing tables!' as status;