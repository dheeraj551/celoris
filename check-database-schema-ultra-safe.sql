-- Database Schema Inspector - Ultra Safe Version
-- Run this first to see what tables and columns you actually have

-- Step 1: Check what tables exist
SELECT 'Table List:' as info, table_name as result
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Step 2: Check profiles table structure (if it exists)
SELECT 'Profiles Table Columns:' as info, column_name as result
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 3: Check users table structure (if it exists) 
SELECT 'Users Table Columns:' as info, column_name as result
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 4: Simple check - does admin ID exist?
DO $$
DECLARE
  admin_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM profiles 
    WHERE id = '550e8400-e29b-41d4-a716-446655440000'
  ) INTO admin_exists;
  
  IF admin_exists THEN
    RAISE NOTICE 'Admin user with correct ID found in profiles table';
  ELSE
    RAISE NOTICE 'No admin user found with correct ID in profiles table';
  END IF;
END $$;