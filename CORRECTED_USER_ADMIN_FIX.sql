-- CORRECTED COMPREHENSIVE USER AND ADMIN FIX
-- This addresses the actual table structure: public.users (not profiles)
-- Fixes the username NOT NULL constraint error

-- ===========================================
-- PART 1: CHECK CURRENT TABLE STRUCTURE
-- ===========================================

-- Check what tables exist
SELECT '=== EXISTING TABLES ===' as info;
SELECT table_name, table_schema
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'profiles', 'user_profiles')
ORDER BY table_name;

-- Check public.users table structure
SELECT '=== PUBLIC.USERS TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Check current users in public.users
SELECT '=== CURRENT PUBLIC.USERS ===' as info;
SELECT * FROM public.users ORDER BY created_at DESC;

-- ===========================================
-- PART 2: CREATE ADMIN USERS WITH USERNAME CONSTRAINT
-- ===========================================

-- Create admin user 1: support@celorisdesigns.com
DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'support@celorisdesigns.com';
    admin_username TEXT := 'admin_user';
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
            '$2a$10$dummy_hash_for_admin_user',
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Admin User"}'
        );
    END IF;
    
    -- Create admin user record in public.users with username
    INSERT INTO public.users (
        id,
        username,
        full_name,
        email,
        role,
        wallet_balance,
        status,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        admin_username, -- Provide username to satisfy NOT NULL constraint
        'Admin User',
        admin_email,
        'admin',
        0,
        'active',
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        status = 'active',
        is_active = TRUE,
        updated_at = NOW();
        
    RAISE NOTICE 'Admin user 1 created/updated: % (%)', admin_email, admin_username;
END $$;

-- Create admin user 2: celoris.designs@gmail.com
DO $$
DECLARE
    admin_user_id2 UUID;
    admin_email2 TEXT := 'celoris.designs@gmail.com';
    admin_username2 TEXT := 'admin_user_2';
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
    
    INSERT INTO public.users (
        id,
        username,
        full_name,
        email,
        role,
        wallet_balance,
        status,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id2,
        admin_username2,
        'Admin User 2',
        admin_email2,
        'admin',
        0,
        'active',
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        status = 'active',
        is_active = TRUE,
        updated_at = NOW();
        
    RAISE NOTICE 'Admin user 2 created/updated: % (%)', admin_email2, admin_username2;
END $$;

-- ===========================================
-- PART 3: CORRECT THE TRIGGER FUNCTION
-- ===========================================

-- Drop the existing broken function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create correct function for public.users table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        username,
        full_name,
        email,
        role,
        wallet_balance,
        status,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'user_' || substring(NEW.id::text, 1, 8)), -- Provide username
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.email,
        'user', -- Default role
        0,
        'pending',
        TRUE,
        NEW.created_at,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = NEW.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- PART 4: UPDATE RLS POLICIES FOR USERS TABLE
-- ===========================================

-- Drop old email-based policies
DROP POLICY IF EXISTS "Enable all access for admins" ON public.courses;
DROP POLICY IF EXISTS "Enable all access for admins modules" ON public.course_modules;
DROP POLICY IF EXISTS "Enable all access for admins topics" ON public.course_topics;

-- Create new role-based policies that check public.users table
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

-- Admin can manage users
CREATE POLICY "Admin can manage users" ON public.users
    FOR ALL USING (
        auth.role() = 'service_role' OR
        EXISTS (
            SELECT 1 FROM public.users u 
            WHERE u.id = auth.uid() 
            AND u.role = 'admin'
            AND u.is_active = TRUE
        )
    );

-- ===========================================
-- PART 5: VERIFICATION
-- ===========================================

-- Check admin users in public.users
SELECT '=== ADMIN USERS IN PUBLIC.USERS ===' as info;
SELECT 
    id,
    username,
    full_name,
    email,
    role,
    status,
    is_active,
    created_at
FROM public.users 
WHERE role = 'admin'
ORDER BY created_at;

-- Check trigger exists
SELECT '=== TRIGGER STATUS ===' as info;
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
WHERE tablename IN ('courses', 'course_modules', 'course_topics', 'users')
AND policyname LIKE '%admin%'
ORDER BY tablename;

-- Final status check
SELECT '=== FINAL STATUS ===' as info;
SELECT 
    'Total auth users' as metric,
    (SELECT COUNT(*) FROM auth.users) as value
UNION ALL
SELECT 
    'Total public users' as metric,
    (SELECT COUNT(*) FROM public.users) as value
UNION ALL
SELECT 
    'Admin users' as metric,
    (SELECT COUNT(*) FROM public.users WHERE role = 'admin') as value
UNION ALL
SELECT 
    'Users with missing auth records' as metric,
    (SELECT COUNT(*) FROM public.users u LEFT JOIN auth.users au ON u.id = au.id WHERE au.id IS NULL) as value;

-- SUCCESS MESSAGE
SELECT '🎉 CORRECTED ADMIN AND USER FIX COMPLETE!
✅ Admin users created with proper usernames
✅ handle_new_user() function fixed for public.users table
✅ Username constraint issue resolved
✅ RLS policies updated to check public.users.role
✅ New user registration should now work
' as result;