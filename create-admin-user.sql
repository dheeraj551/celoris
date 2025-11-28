-- Create admin user in profiles table
INSERT INTO profiles (
  id,
  email,
  full_name,
  username,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'support@celorisdesigns.com',
  'Admin User',
  'admin',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  role = 'admin',
  updated_at = NOW()
RETURNING id, email;