-- COMPLETE SCHEMA INVESTIGATION
-- Run this first to understand your database structure

-- 1. Check instagram_posts table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'instagram_posts' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check foreign key constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'instagram_posts';

-- 3. Check profiles table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Show existing profiles
SELECT id, * FROM profiles LIMIT 5;

-- 5. Show auth users (if accessible)
SELECT id, email FROM auth.users WHERE email = 'support@celorisdesigns.com' LIMIT 1;