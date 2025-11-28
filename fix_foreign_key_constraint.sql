-- COMPLETE FIX: Foreign Key Constraint Error
-- This script fixes the foreign key constraint mismatch

-- Step 1: Check which user table exists and has data
SELECT 'users table' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'profiles table' as table_name, COUNT(*) as record_count FROM profiles;

-- Step 2: If profiles table doesn't exist, create it
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

-- Step 3: Create admin user in profiles table (NOT users table)
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
  'System Administrator',
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

-- Step 4: Grant necessary permissions
GRANT ALL ON profiles TO authenticated, anon;
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Step 5: Create RLS policies for profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles" ON profiles
  FOR SELECT USING (
    auth.jwt() ->> 'email' = 'support@celorisdesigns.com'
    OR auth.jwt() ->> 'role' = 'admin'
  );

-- Step 6: Verify the fix
SELECT 'Foreign key constraint should now work!' as status, 
       (SELECT COUNT(*) FROM profiles WHERE id = '550e8400-e29b-41d4-a716-446655440000') as admin_exists;