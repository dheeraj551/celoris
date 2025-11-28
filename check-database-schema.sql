-- Database Schema Inspector
-- Run this first to see what tables and columns you actually have

-- Check what tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check profiles table structure (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check users table structure (if it exists)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check if admin user already exists anywhere
SELECT 'profiles' as source_table, id, email, full_name
FROM profiles 
WHERE id = '550e8400-e29b-41d4-a716-446655440000'
   OR email = 'support@celorisdesigns.com'

UNION ALL

SELECT 'users' as source_table, id::text, email, full_name
FROM users 
WHERE id = '550e8400-e29b-41d4-a716-446655440000'
   OR email = 'support@celorisdesigns.com';