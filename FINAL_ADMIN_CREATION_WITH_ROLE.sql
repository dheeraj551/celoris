-- ADD ADMIN ROLE COLUMN TO USERS TABLE
-- Your users table is a profile table, so we need to add a role column

-- ===========================================
-- PART 1: ADD ROLE COLUMN TO USERS TABLE
-- ===========================================

-- Add role column to distinguish between users and admins
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';

-- Add is_active column if needed
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing users to have 'user' role
UPDATE public.users SET role = 'user' WHERE role IS NULL;

-- Update existing users to be active
UPDATE public.users SET is_active = TRUE WHERE is_active IS NULL;

-- ===========================================
-- PART 2: DISABLE BROKEN TRIGGER
-- ===========================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ===========================================
-- PART 3: CREATE ADMIN USERS IN AUTH.USERS
-- ===========================================

-- Create admin user 1: support@celorisdesigns.com
DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'support@celorisdesigns.com';
    admin_username TEXT := 'admin_user';
BEGIN
    -- Check if admin user already exists in auth.users
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
        
        RAISE NOTICE 'Admin auth user created: % (%)', admin_email, admin_user_id;
    END IF;
    
    -- Create admin profile in public.users
    INSERT INTO public.users (
        id,
        username,
        full_name,
        bio,
        subscription_status,
        verification_status,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        admin_username,
        'Admin User',
        'System Administrator',
        'premium',
        'verified',
        'admin',
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        full_name = EXCLUDED.full_name,
        bio = EXCLUDED.bio,
        subscription_status = EXCLUDED.subscription_status,
        verification_status = EXCLUDED.verification_status,
        role = 'admin',
        is_active = TRUE,
        updated_at = NOW();
        
    RAISE NOTICE 'Admin user 1 created/updated: % (username: %)', admin_email, admin_username;
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
        
        RAISE NOTICE 'Admin auth user 2 created: % (%)', admin_email2, admin_user_id2;
    END IF;
    
    INSERT INTO public.users (
        id,
        username,
        full_name,
        bio,
        subscription_status,
        verification_status,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id2,
        admin_username2,
        'Admin User 2',
        'System Administrator',
        'premium',
        'verified',
        'admin',
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        full_name = EXCLUDED.full_name,
        bio = EXCLUDED.bio,
        subscription_status = EXCLUDED.subscription_status,
        verification_status = EXCLUDED.verification_status,
        role = 'admin',
        is_active = TRUE,
        updated_at = NOW();
        
    RAISE NOTICE 'Admin user 2 created/updated: % (username: %)', admin_email2, admin_username2;
END $$;

-- ===========================================
-- PART 4: CREATE FIXED TRIGGER FUNCTION
-- ===========================================

-- Create trigger function that works with the actual users table structure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        username,
        full_name,
        bio,
        subscription_status,
        verification_status,
        role,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        -- Provide username to satisfy NOT NULL constraint
        COALESCE(
            NEW.raw_user_meta_data->>'username',
            split_part(NEW.email, '@', 1),
            'user_' || substring(NEW.id::text, 1, 8)
        ),
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'User'),
        'New user',
        'free',
        'pending',
        'user',
        TRUE,
        NEW.created_at,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- PART 5: UPDATE RLS POLICIES
-- ===========================================

-- Drop old policies
DROP POLICY IF EXISTS "Enable all access for admins" ON public.courses;
DROP POLICY IF EXISTS "Enable all access for admins modules" ON public.course_modules;
DROP POLICY IF EXISTS "Enable all access for admins topics" ON public.course_topics;

-- Create new policies that check public.users.role
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
-- PART 6: VERIFICATION
-- ===========================================

-- Check admin users
SELECT '=== VERIFICATION: ADMIN USERS ===' as info;
SELECT 
    id,
    username,
    full_name,
    role,
    subscription_status,
    verification_status,
    is_active
FROM public.users 
WHERE role = 'admin'
ORDER BY created_at;

-- Check auth.users for admin accounts
SELECT '=== VERIFICATION: AUTH.USERS ADMIN ===' as info;
SELECT 
    id,
    email,
    created_at
FROM auth.users 
WHERE email IN ('support@celorisdesigns.com', 'celoris.designs@gmail.com')
ORDER BY created_at;

-- Check new column structure
SELECT '=== VERIFICATION: USERS TABLE STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
AND column_name IN ('role', 'is_active')
ORDER BY column_name;

-- Final status
SELECT '=== FINAL STATUS SUMMARY ===' as info;
SELECT 
    'Admin users in public.users' as metric,
    (SELECT COUNT(*) FROM public.users WHERE role = 'admin') as value
UNION ALL
SELECT 
    'Admin accounts in auth.users' as metric,
    (SELECT COUNT(*) FROM auth.users WHERE email IN ('support@celorisdesigns.com', 'celoris.designs@gmail.com')) as value
UNION ALL
SELECT 
    'Total users' as metric,
    (SELECT COUNT(*) FROM public.users) as value
UNION ALL
SELECT 
    'Users with role column' as metric,
    (SELECT COUNT(*) FROM public.users WHERE role IS NOT NULL)::text as value;

-- SUCCESS MESSAGE
SELECT '🎉 COMPLETE ADMIN USER CREATION WITH ROLE COLUMN!
✅ Added role column to public.users table
✅ Added is_active column to public.users table
✅ Created 2 admin users in both auth.users and public.users
✅ Admin users have role = ''admin'' and premium subscription
✅ Fixed trigger function for new user registration
✅ Updated RLS policies to check public.users.role
✅ Course creation and Instagram upload should now work for admins
' as result;