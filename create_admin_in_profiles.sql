-- SIMPLE FIX: Create Admin User in Profiles Table
-- Run this in Supabase SQL Editor to fix the foreign key constraint error

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  instagram_handle TEXT,
  profile_pic_url TEXT,
  location TEXT,
  subscription_status TEXT DEFAULT 'free',
  verification_status TEXT DEFAULT 'unverified',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin user in profiles table (this is what the foreign key references!)
INSERT INTO profiles (
  id,
  username,
  full_name,
  bio,
  subscription_status,
  verification_status,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin',
  'Admin User',
  'System Administrator for Instagram Posts',
  'premium',
  'verified',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  subscription_status = EXCLUDED.subscription_status,
  verification_status = EXCLUDED.verification_status,
  updated_at = NOW()
RETURNING id, username, full_name;

-- Grant permissions
GRANT ALL ON profiles TO authenticated, anon;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policy
CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Success message
SELECT 'Admin user created in profiles table! Instagram posts should now work.' as result;