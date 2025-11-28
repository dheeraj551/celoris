-- Create admin user for blog publishing API
-- This creates an admin user that matches your existing authentication system
-- Based on your actual database schema

-- First, let's check the structure of existing tables
-- Then create the admin user

-- Option 1: If you have a 'profiles' table (based on dashboard usage)
-- Let's try inserting with common profile fields
INSERT INTO profiles (
  id,
  email,
  full_name,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'support@celorisdesigns.com',
  'Admin User',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = NOW()
RETURNING id, email, full_name;

-- Option 2: If you also have a 'users' table (based on swipe page)
-- Create admin user in users table too
INSERT INTO users (
  id,
  email,
  full_name,
  username,
  bio,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'support@celorisdesigns.com',
  'Admin User',
  'admin',
  'System Administrator',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  username = EXCLUDED.username,
  bio = EXCLUDED.bio,
  updated_at = NOW()
RETURNING id, email, full_name, username;

-- Verification: Check if admin user was created successfully
SELECT 
  'profiles' as table_name,
  id, email, full_name, created_at
FROM profiles 
WHERE id = '550e8400-e29b-41d4-a716-446655440000'

UNION ALL

SELECT 
  'users' as table_name,
  id, email, full_name::text, created_at
FROM users 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';