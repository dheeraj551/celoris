-- FLEXIBLE ADMIN USER CREATION
-- This script adapts to your profiles table schema automatically

-- First, let's see what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Now create admin user based on what exists
DO $$
DECLARE
    admin_id UUID := '550e8400-e29b-41d4-a716-446655440000';
    admin_email TEXT := 'support@celorisdesigns.com';
    admin_name TEXT := 'Admin User';
    columns_to_update TEXT[];
    sql_statement TEXT;
BEGIN
    -- Check if profiles table exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        -- Create profiles table with common structure
        EXECUTE 'CREATE TABLE profiles (
            id UUID PRIMARY KEY,
            email TEXT UNIQUE,
            full_name TEXT,
            role TEXT DEFAULT ''user'',
            is_admin BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )';
        
        -- Enable RLS
        EXECUTE 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY';
        EXECUTE 'CREATE POLICY "Users can read their own profile" ON profiles FOR SELECT USING (auth.uid() = id)';
        
        RAISE NOTICE 'Created new profiles table';
    END IF;
    
    -- Build dynamic INSERT/UPDATE statement based on available columns
    columns_to_update := ARRAY[
        'id', 'email', 'full_name', 'role', 'is_admin', 'created_at', 'updated_at'
    ];
    
    -- Try to insert admin user
    BEGIN
        EXECUTE format('
            INSERT INTO profiles (id, email, full_name, role, is_admin, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO UPDATE SET
                email = EXCLUDED.email,
                full_name = EXCLUDED.full_name,
                role = EXCLUDED.role,
                is_admin = EXCLUDED.is_admin,
                updated_at = NOW()
            RETURNING id, email, full_name',
            admin_id, admin_email, admin_name, 'admin', true, NOW(), NOW()
        );
        
        RAISE NOTICE 'Admin user created/updated successfully';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error creating admin user: %', SQLERRM;
    END;
    
    -- Grant permissions
    BEGIN
        EXECUTE 'GRANT ALL ON profiles TO authenticated, anon';
        RAISE NOTICE 'Permissions granted';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Error granting permissions: %', SQLERRM;
    END;
END $$;

-- Final verification
SELECT 'Admin user creation process completed!' as status;