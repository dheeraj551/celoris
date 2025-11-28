-- CORRECTED ADMIN CREATION BASED ON ACTUAL TABLE STRUCTURE
-- First run CHECK_TABLE_STRUCTURE.sql to see the actual columns

-- Drop broken trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ===========================================
-- PART 1: CREATE ADMIN USERS BASED ON REAL STRUCTURE
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
        
        RAISE NOTICE 'Admin auth user created: % (%)', admin_email, admin_user_id;
    END IF;
    
    -- Create admin user record using only the columns that exist
    -- Based on the error, we know username exists but email doesn't
    INSERT INTO public.users (
        id,
        username,
        role,
        status,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        admin_username, -- Explicit username to satisfy NOT NULL constraint
        'admin',
        'active',
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        role = 'admin',
        status = 'active',
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
        role,
        status,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id2,
        admin_username2,
        'admin',
        'active',
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        username = EXCLUDED.username,
        role = 'admin',
        status = 'active',
        is_active = TRUE,
        updated_at = NOW();
        
    RAISE NOTICE 'Admin user 2 created/updated: % (username: %)', admin_email2, admin_username2;
END $$;

-- ===========================================
-- PART 2: CREATE CORRECT TRIGGER FUNCTION
-- ===========================================

-- Create trigger function using only the columns that exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id,
        username,
        role,
        status,
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
        'user', -- Default role
        'pending',
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
-- PART 3: UPDATE RLS POLICIES
-- ===========================================

-- Drop old policies
DROP POLICY IF EXISTS "Enable all access for admins" ON public.courses;
DROP POLICY IF EXISTS "Enable all access for admins modules" ON public.course_modules;
DROP POLICY IF EXISTS "Enable all access for admins topics" ON public.course_topics;

-- Create new policies
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
-- PART 4: VERIFICATION (Using only existing columns)
-- ===========================================

-- Check admin users using the columns that actually exist
SELECT '=== VERIFICATION: ADMIN USERS ===' as info;
SELECT 
    id,
    username,
    role,
    status,
    is_active,
    created_at
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

-- Check trigger
SELECT '=== VERIFICATION: TRIGGER WORKING ===' as info;
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

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
    'Trigger active' as metric,
    (SELECT COUNT(*) FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created')::text as value;

-- SUCCESS MESSAGE
SELECT '🎉 CORRECTED ADMIN CREATION COMPLETE!
✅ Admin users created using actual table structure
✅ No email column used (using only existing columns)
✅ Fixed trigger function for new user registration
✅ RLS policies updated for proper access control
✅ Course creation and Instagram upload should now work
' as result;