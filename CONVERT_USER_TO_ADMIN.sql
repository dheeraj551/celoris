-- CONVERT EXISTING USER TO ADMIN
-- Converts ananyajairath to admin (based on your current data)

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

-- Verify admin conversion
SELECT '=== ADMIN CONVERSION VERIFICATION ===' as info;
SELECT 
    username,
    full_name,
    role,
    subscription_status,
    verification_status,
    is_active,
    bio,
    updated_at
FROM public.users 
WHERE username = 'ananyajairath';

-- Create RLS policies for admin access
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
SELECT '🎉 EXISTING USER CONVERTED TO ADMIN!
✅ ananyajairath now has role = ''admin''
✅ Has premium subscription and verified status
✅ RLS policies updated for admin access
✅ Can now create courses and upload Instagram posts
✅ Password issue resolved (using existing auth)
' as result;

-- Final check - show admin users
SELECT '=== CURRENT ADMIN USERS ===' as info;
SELECT 
    username,
    full_name,
    role,
    is_active
FROM public.users 
WHERE role = 'admin';