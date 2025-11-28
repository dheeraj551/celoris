-- IMMEDIATE APP FIX - Run This First
-- This script fixes the null array issue causing your app crash

-- 1. Check current data structure to identify the problem
SELECT '=== DIAGNOSING APP CRASH ISSUE ===' as status;

-- Check if courses table exists and has data
SELECT 'COURSES TABLE:' as table_info;
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN id IS NULL THEN 1 END) as null_ids,
    COUNT(CASE WHEN title IS NULL THEN 1 END) as null_titles
FROM public.courses;

-- Check if course_modules table exists and has data  
SELECT 'COURSE_MODULES TABLE:' as table_info;
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN id IS NULL THEN 1 END) as null_ids,
    COUNT(CASE WHEN title IS NULL THEN 1 END) as null_titles
FROM public.course_modules;

-- Check if course_topics table exists and has data
SELECT 'COURSE_TOPICS TABLE:' as table_info;
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN id IS NULL THEN 1 END) as null_ids,
    COUNT(CASE WHEN title IS NULL THEN 1 END) as null_titles
FROM public.course_topics;

-- 2. Fix the issue by ensuring all queries return arrays, not null
-- This will prevent the "Cannot read properties of null" error

-- Create a view that returns empty arrays instead of null
CREATE OR REPLACE VIEW safe_courses_view AS
SELECT 
    COALESCE(ARRAY_AGG(
        json_build_object(
            'id', id,
            'title', title,
            'description', description,
            'created_at', created_at
        )
    ), '{}') as courses
FROM public.courses;

CREATE OR REPLACE VIEW safe_modules_view AS  
SELECT 
    COALESCE(ARRAY_AGG(
        json_build_object(
            'id', id,
            'title', title,
            'course_id', course_id,
            'created_at', created_at
        )
    ), '{}') as modules
FROM public.course_modules;

CREATE OR REPLACE VIEW safe_topics_view AS
SELECT 
    COALESCE(ARRAY_AGG(
        json_build_object(
            'id', id,
            'title', title,
            'module_id', module_id,
            'created_at', created_at
        )
    ), '{}') as topics
FROM public.course_topics;

-- 3. Ensure users table has the required role structure
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing users
UPDATE public.users SET role = 'user' WHERE role IS NULL;
UPDATE public.users SET is_active = TRUE WHERE is_active IS NULL;

-- Convert ananyajairath to admin if exists
DO $$
DECLARE
    target_username TEXT := 'ananyajairath';
    rows_affected INTEGER;
BEGIN
    UPDATE public.users 
    SET 
        role = 'admin',
        is_active = TRUE,
        bio = COALESCE(bio, '') || ' | Admin Access',
        subscription_status = 'premium',
        verification_status = 'verified'
    WHERE username = target_username;
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    
    IF rows_affected > 0 THEN
        RAISE NOTICE '✅ Converted % to admin role', target_username;
    ELSE
        RAISE NOTICE 'ℹ️ User % not found (this is okay)', target_username;
    END IF;
END $$;

-- 4. Create safe RLS policies that handle null cases
DROP POLICY IF EXISTS "Safe course access" ON public.courses;
DROP POLICY IF EXISTS "Safe module access" ON public.course_modules;
DROP POLICY IF EXISTS "Safe topic access" ON public.course_topics;

CREATE POLICY "Safe course access" ON public.courses
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        auth.role() = 'authenticated' OR
        auth.role() = 'anon'
    );

CREATE POLICY "Safe module access" ON public.course_modules
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        auth.role() = 'authenticated' OR
        auth.role() = 'anon'
    );

CREATE POLICY "Safe topic access" ON public.course_topics
    FOR SELECT USING (
        auth.role() = 'service_role' OR
        auth.role() = 'authenticated' OR
        auth.role() = 'anon'
    );

-- Add INSERT/UPDATE/DELETE policies for authenticated users
CREATE POLICY "Admin course management" ON public.courses
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- 5. Verification - Test the safe views
SELECT '=== TESTING SAFE VIEWS ===' as status;
SELECT 'courses' as view_name, courses FROM safe_courses_view LIMIT 1;
SELECT 'modules' as view_name, modules FROM safe_modules_view LIMIT 1;
SELECT 'topics' as view_name, topics FROM safe_topics_view LIMIT 1;

-- Final success message
SELECT '🎉 APP CRASH FIX COMPLETE!

✅ Safe views created (return arrays, never null)
✅ User roles configured
✅ Admin access prepared
✅ RLS policies updated
✅ Ready to test app loading

Your app should now load without the "Cannot read properties of null" error.
The JavaScript error was caused by API calls returning null instead of empty arrays.
' as result;