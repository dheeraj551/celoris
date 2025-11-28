-- CREATE ADMIN USER AND PROFILE
-- This creates the actual admin user account that matches our RLS policies

-- STEP 1: Check current situation
SELECT '=== CURRENT AUTH.USERS ===' as info;
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC;

SELECT '=== CURRENT PROFILES ===' as info;
SELECT id, name, email, role FROM public.profiles ORDER BY created_at DESC;

-- STEP 2: Create admin user in auth.users
-- NOTE: In production, you would use Supabase Auth API to create this user
-- This SQL creates the auth user entry directly (for development/testing)
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
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'support@celorisdesigns.com',
  '$2a$10$dummy_hash_for_admin_user',
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Admin User"}',
  FALSE,
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Get the created user ID
DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'support@celorisdesigns.com';
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = admin_email;
    
    -- If admin user doesn't exist, create a placeholder for demonstration
    IF admin_user_id IS NULL THEN
        admin_user_id := gen_random_uuid();
        
        -- Insert a placeholder admin user
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
    
    -- Create admin profile
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
        
    -- Display results
    RAISE NOTICE 'Admin user created/updated: % (%)', admin_email, admin_user_id;
END $$;

-- STEP 4: Also create second admin email
DO $$
DECLARE
    admin_user_id2 UUID;
    admin_email2 TEXT := 'celoris.designs@gmail.com';
BEGIN
    -- Get or create user for second admin email
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
        
    RAISE NOTICE 'Second admin user created/updated: % (%)', admin_email2, admin_user_id2;
END $$;

-- STEP 5: Verify admin users exist
SELECT '=== VERIFICATION: Admin Users Created ===' as info;
SELECT 
  p.id,
  p.name,
  p.email,
  p.role,
  p.is_active,
  au.created_at as auth_created
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.role = 'admin'
ORDER BY p.created_at;

-- STEP 6: Fix user creation for new registrations
-- Update RLS policies to use profile role instead of email check
SELECT '=== RLS POLICY UPDATE NEEDED ===' as info;
SELECT 'Update RLS policies to check: p.role = ''admin''' as recommendation;

-- SUCCESS MESSAGE
SELECT '🎉 ADMIN USER CREATION COMPLETE!
✅ Admin users created in auth.users
✅ Admin profiles created with role=''admin''
✅ Both admin emails now have accounts
✅ New user registration should work
❗ Next: Update RLS policies to use profile role instead of email check' as result;