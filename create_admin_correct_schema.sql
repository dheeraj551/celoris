-- CREATE ADMIN USER WITH YOUR ACTUAL PROFILES SCHEMA
-- Based on complete_schema_check.sql output

-- Insert admin user into profiles table with ALL the columns that exist in your table
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
    wallet_balance = EXCLUDED.wallet_balance,
    updated_at = NOW();

-- Verify the admin was created successfully
SELECT 
    id,
    name,
    email,
    role,
    wallet_balance,
    is_active,
    created_at
FROM profiles 
WHERE email = 'support@celorisdesigns.com' 
   OR id = '550e8400-e29b-41d4-a716-446655440000';

-- Success confirmation
SELECT '✅ Admin user created in profiles table with correct schema! Check result above.' as result;