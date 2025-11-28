-- ULTRA SIMPLE ADMIN CREATION
-- Use only the most basic columns that should exist

-- Create admin user with minimal columns
INSERT INTO profiles (
  id,
  email,
  role,
  created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'support@celorisdesigns.com',
  'admin',
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  role = EXCLUDED.role
RETURNING id, email, role;

-- If the above fails, try even more minimal approach
-- Just insert the ID and let defaults fill other columns
/*
INSERT INTO profiles (id) 
VALUES ('550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING
RETURNING id;
*/

-- Success confirmation
SELECT 'Admin user created with minimal required fields!' as result;