-- OPTION A: CREATE ADMIN FOR EXISTING USER
-- If you already have a user account that should be admin

-- First, check who your existing users are
SELECT '=== EXISTING USERS ===' as info;
SELECT 
    id,
    username,
    full_name,
    email,
    created_at
FROM public.users 
ORDER BY created_at;

-- Convert existing user to admin
DO $$
DECLARE
    existing_user_id UUID;
    target_username TEXT := 'ananyajairath'; -- Change this to your actual username
BEGIN
    -- Get the ID of existing user
    SELECT id INTO existing_user_id 
    FROM public.users 
    WHERE username = target_username;
    
    -- Add role and is_active columns if they don't exist
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
    ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
    
    -- Update existing user to be admin
    UPDATE public.users 
    SET 
        role = 'admin',
        is_active = TRUE,
        bio = 'System Administrator',
        subscription_status = 'premium',
        verification_status = 'verified'
    WHERE username = target_username;
    
    -- Also check if user exists in auth.users and add email if needed
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = existing_user_id) THEN
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
            existing_user_id,
            'authenticated',
            'authenticated',
            'your-admin@email.com', -- Replace with actual admin email
            '$2a$10$dummy_hash_for_admin_user',
            NOW(),
            NOW(),
            NOW(),
            '{"provider": "email", "providers": ["email"]}',
            '{"name": "Admin User"}'
        );
    END IF;
    
    RAISE NOTICE 'Existing user converted to admin: % (%)', target_username, existing_user_id;
END $$;