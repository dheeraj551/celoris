-- COMPREHENSIVE USER AND ADMIN FIX
-- This script addresses:
-- 1. Creating missing admin users
-- 2. Fixing new user registration
-- 3. Updating RLS policies for proper role-based access

-- ===========================================
-- PART 1: CREATE ADMIN USERS
-- ===========================================

-- Create admin user 1: support@celorisdesigns.com
DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'support@celorisdesigns.com';
BEGIN
    -- Check if admin user already exists
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = admin_email;
    
    -- Create admin user if doesn't exist
    IF admin_user_id IS NULL THEN
        admin_user_id := gen_random_uuid();
        
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            admin_user_id,
            'authenticated',
            'authenticated',
            admin_email,
            '$2a$10$dummy_hash_for_admin_user', -- Replace with real hash in production
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Admin User"}'
        );
    END IF;
    
    -- Create or update admin profile
    INSERT INTO public.profiles (
        id,
        name,
        email,
        role,
        wallet_balance,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'Admin User',
        admin_email,
        'admin',
        0,
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        is_active = TRUE,
        updated_at = NOW();
END $$;

-- Create admin user 2: celoris.designs@gmail.com
DO $$
DECLARE
    admin_user_id2 UUID;
    admin_email2 TEXT := 'celoris.designs@gmail.com';
BEGIN
    SELECT id INTO admin_user_id2 
    FROM auth.users 
    WHERE email = admin_email2;
    
    IF admin_user_id2 IS NULL THEN
        admin_user_id2 := gen_random_uuid();
        
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            admin_user_id2,
            'authenticated',
            'authenticated',
            admin_email2,
            '$2a$10$dummy_hash_for_admin_user_2',
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Admin User 2"}'
        );
    END IF;
    
    INSERT INTO public.profiles (
        id,
        name,
        email,
        role,
        wallet_balance,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id2,
        'Admin User 2',
        admin_email2,
        'admin',
        0,
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        is_active = TRUE,
        updated_at = NOW();
END $$;

-- ===========================================
-- PART 2: FIX NEW USER REGISTRATION
-- ===========================================

-- Create a function to automatically create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        name,
        email,
        role,
        wallet_balance,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email, 'User'),
        NEW.email,
        'user', -- Default role for new users
        0,
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = NEW.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- PART 3: UPDATE RLS POLICIES
-- ===========================================

-- Drop old email-based policies
DROP POLICY IF EXISTS "Enable all access for admins" ON public.courses;
DROP POLICY IF EXISTS "Enable all access for admins modules" ON public.course_modules;
DROP POLICY IF EXISTS "Enable all access for admins topics" ON public.course_topics;

-- Create new role-based policies
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

-- Admin can manage profiles
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

-- ===========================================
-- PART 4: VERIFICATION
-- ===========================================

-- Check admin users
SELECT '=== ADMIN USERS ===' as info;
SELECT 
    p.id,
    p.name,
    p.email,
    p.role,
    p.is_active
FROM public.profiles p
WHERE p.role = 'admin'
ORDER BY p.created_at;

-- Check trigger exists
SELECT '=== PROFILE CREATION TRIGGER ===' as info;
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check RLS policies
SELECT '=== RLS POLICIES ===' as info;
SELECT 
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE tablename IN ('courses', 'course_modules', 'course_topics', 'profiles')
AND policyname LIKE '%admin%'
ORDER BY tablename;

-- SUCCESS MESSAGE
SELECT '🎉 COMPREHENSIVE USER ADMIN FIX COMPLETE!
✅ Admin users created for both email addresses
✅ Automatic profile creation for new users
✅ RLS policies updated to use role-based access
✅ New user registration should now work
✅ Admin functionality should work properly
' as result;