-- COMPLETE FIX: Create admin user respecting foreign key constraints
-- Issue: profiles table has foreign key to users table

-- STEP 1: First check if admin exists in users table
SELECT 'Checking if admin exists in users table...' as step;
SELECT id, email FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440000' OR email = 'support@celorisdesigns.com';

-- STEP 2: Check users table schema to understand structure
SELECT 'Discovering users table schema...' as step;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- STEP 3: Create admin user in users table (common pattern)
-- Using INSERT with basic required columns
INSERT INTO users (
    id,
    email,
    created_at,
    updated_at,
    is_active
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'support@celorisdesigns.com',
    NOW(),
    NOW(),
    true
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW(),
    is_active = EXCLUDED.is_active;

-- STEP 4: Now create admin in profiles table
INSERT INTO profiles (
    id,
    name,
    email,
    role,
    wallet_balance,
    specialization,
    contact,
    avatar_url,
    is_active,
    created_at,
    updated_at,
    full_name
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Admin User',
    'support@celorisdesigns.com',
    'admin',
    0,
    NULL,
    NULL,
    NULL,
    TRUE,
    NOW(),
    NOW(),
    NULL
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    updated_at = NOW();

-- STEP 5: Verify both tables have the admin
SELECT 'Final verification - admin should exist in both users and profiles tables:' as step;

-- Check users table
SELECT 'Users table:' as table_name, id, email, is_active, created_at 
FROM users 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Check profiles table  
SELECT 'Profiles table:' as table_name, id, name, email, role, is_active, created_at 
FROM profiles 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';

-- Final success message
SELECT '🎉 SUCCESS! Admin user created in both users and profiles tables. Foreign key constraints should now be satisfied!' as result;