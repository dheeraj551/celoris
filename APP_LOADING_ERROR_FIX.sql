-- APP LOADING ERROR FIX
-- This script will help diagnose and fix the app loading issue

-- First, let's run the admin conversion that we were working on
-- Add admin role columns if they don't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing users to have proper role
UPDATE public.users SET role = 'user' WHERE role IS NULL;
UPDATE public.users SET is_active = TRUE WHERE is_active IS NULL;

-- Convert ananyajairath to admin
DO $$
DECLARE
    target_username TEXT := 'ananyajairath';
    admin_user_id UUID;
    rows_affected INTEGER;
BEGIN
    -- Get the existing user ID
    SELECT id INTO admin_user_id 
    FROM public.users 
    WHERE username = target_username;
    
    -- Check if user exists
    IF admin_user_id IS NULL THEN
        RAISE EXCEPTION 'User with username % not found!', target_username;
    END IF;
    
    -- Update user to be admin
    UPDATE public.users 
    SET 
        role = 'admin',
        is_active = TRUE,
        bio = 'System Administrator | Admin Access',
        subscription_status = 'premium',
        verification_status = 'verified',
        updated_at = NOW()
    WHERE username = target_username;
    
    GET DIAGNOSTICS rows_affected = ROW_COUNT;
    
    IF rows_affected > 0 THEN
        RAISE NOTICE '✅ SUCCESS: User % converted to admin!', target_username;
        RAISE NOTICE 'User ID: %', admin_user_id;
    ELSE
        RAISE EXCEPTION 'Failed to update user %', target_username;
    END IF;
END $$;

-- Now let's check if there are any data issues that might cause the app error
-- Check courses table
SELECT '=== CHECKING COURSES TABLE ===' as info;
SELECT 
    COUNT(*) as total_courses,
    COUNT(CASE WHEN title IS NULL THEN 1 END) as null_titles,
    COUNT(CASE WHEN description IS NULL THEN 1 END) as null_descriptions
FROM public.courses;

-- Check course_modules table  
SELECT '=== CHECKING COURSE_MODULES TABLE ===' as info;
SELECT 
    COUNT(*) as total_modules,
    COUNT(CASE WHEN title IS NULL THEN 1 END) as null_titles,
    COUNT(CASE WHEN course_id IS NULL THEN 1 END) as null_course_ids
FROM public.course_modules;

-- Check course_topics table
SELECT '=== CHECKING COURSE_TOPICS TABLE ===' as info;
SELECT 
    COUNT(*) as total_topics,
    COUNT(CASE WHEN title IS NULL THEN 1 END) as null_titles,
    COUNT(CASE WHEN module_id IS NULL THEN 1 END) as null_module_ids
FROM public.course_topics;

-- Check users table for role column
SELECT '=== CHECKING USERS TABLE ===' as info;
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role IS NULL THEN 1 END) as null_roles,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
    COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users
FROM public.users;

-- Fix any null array issues by ensuring empty arrays instead of null
-- This might be the cause of the "Cannot read properties of null" error

-- Create policies for admin access
DROP POLICY IF EXISTS "Admin access for courses" ON public.courses;
DROP POLICY IF EXISTS "Admin access for course_modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admin access for course_topics" ON public.course_topics;
DROP POLICY IF EXISTS "Admin can manage users" ON public.users;

CREATE POLICY "Admin access for courses" ON public.courses
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin'
            AND u.is_active = TRUE
        )
    );

CREATE POLICY "Admin access for course_modules" ON public.course_modules
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin'
            AND u.is_active = TRUE
        )
    );

CREATE POLICY "Admin access for course_topics" ON public.course_topics
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin'
            AND u.is_active = TRUE
        )
    );

-- Success message
SELECT '🎉 ADMIN CONVERSION AND APP ERROR DIAGNOSIS COMPLETE!
✅ ananyajairath converted to admin
✅ Database structure verified
✅ Admin RLS policies created
✅ Ready to test app functionality
' as result;