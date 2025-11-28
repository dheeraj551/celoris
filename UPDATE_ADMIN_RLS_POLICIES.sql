-- UPDATE RLS POLICIES TO USE PROFILE ROLE
-- This updates the policies to check profile.role = 'admin' instead of email addresses
-- This is cleaner and more maintainable than email-based checks

-- STEP 1: Drop existing email-based admin policies
DROP POLICY IF EXISTS "Enable all access for admins" ON public.courses;
DROP POLICY IF EXISTS "Enable all access for admins modules" ON public.course_modules;
DROP POLICY IF EXISTS "Enable all access for admins topics" ON public.course_topics;

-- STEP 2: Create new role-based admin policies
CREATE POLICY "Admin access for courses" ON public.courses
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
            AND p.is_active = TRUE
        )
    );

CREATE POLICY "Admin access for course_modules" ON public.course_modules
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
            AND p.is_active = TRUE
        )
    );

CREATE POLICY "Admin access for course_topics" ON public.course_topics
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
            AND p.is_active = TRUE
        )
    );

-- STEP 3: Create profile-based policies for other operations
-- Admin can manage all profiles (for user creation/management)
CREATE POLICY "Admin can manage profiles" ON public.profiles
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.profiles p 
            WHERE p.id = auth.uid() 
            AND p.role = 'admin'
            AND p.is_active = TRUE
        )
    );

-- STEP 4: Verify the new policies
SELECT '=== NEW RLS POLICIES CREATED ===' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('courses', 'course_modules', 'course_topics', 'profiles')
AND policyname LIKE '%admin%'
ORDER BY tablename, policyname;

-- SUCCESS MESSAGE
SELECT '🎉 RLS POLICIES UPDATED!
✅ New policies use profile.role = ''admin'' instead of email checks
✅ Policies check profile exists and is_active = TRUE
✅ More secure and maintainable approach
✅ Admin users can now access admin functions' as result;