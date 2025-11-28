-- Create admin user for blog publishing API
-- This creates an admin user that matches your existing authentication system

-- Option 1: If you have a 'profiles' table
INSERT INTO profiles (
  id,
  email,
  full_name,
  username,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'support@celorisdesigns.com',
  'Admin User',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  updated_at = NOW()
RETURNING id, email;

-- Option 2: If you have a 'users' table  
INSERT INTO users (
  id,
  email,
  full_name,
  username,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'support@celorisdesigns.com',
  'Admin User', 
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  updated_at = NOW()
RETURNING id, email;

-- Option 3: Simple admin table for API authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO admin_users (
  id,
  email,
  name,
  role
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'support@celorisdesigns.com',
  'Admin User',
  'admin'
) ON CONFLICT (email) DO UPDATE SET
  updated_at = NOW()
RETURNING id, email;