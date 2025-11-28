-- OPTION B: CREATE NEW ADMIN WITH PROPER AUTHENTICATION
-- This creates admin but explains password limitations

-- Add admin role system to existing users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing users to have user role
UPDATE public.users SET role = 'user' WHERE role IS NULL;
UPDATE public.users SET is_active = TRUE WHERE is_active IS NULL;

-- Create admin users (with note about passwords)
DO $$
DECLARE
    admin_user_id UUID;
    admin_email TEXT := 'support@celorisdesigns.com';
    admin_username TEXT := 'admin_user';
BEGIN
    -- Generate new admin user ID
    admin_user_id := gen_random_uuid();
    
    -- Create auth record (NOTE: dummy password - will not work for login)
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
        '$2a$10$dummy_hash_for_admin_user', -- ⚠️ DUMMY PASSWORD - WON'T WORK FOR LOGIN
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Admin User"}'
    );
    
    -- Create profile record
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
        role = 'admin',
        is_active = TRUE;
        
    RAISE NOTICE 'Admin user created: % (%)', admin_email, admin_user_id;
    RAISE NOTICE '⚠️ IMPORTANT: Dummy password used - set real password through Supabase Auth!';
END $$;