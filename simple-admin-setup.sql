-- Simple admin user setup - Try this first
-- This uses the minimum required fields for your authentication system

-- Try to insert into profiles table (what dashboard uses)
INSERT INTO profiles (
  id,
  email,
  full_name
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'support@celorisdesigns.com',
  'Admin User'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

-- Verify creation
SELECT 'Admin user created in profiles table' as status, id, email, full_name
FROM profiles 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';