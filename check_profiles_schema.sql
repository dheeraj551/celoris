-- CHECK: What columns exist in the profiles table?
-- Run this to see the actual schema

SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- Also check if there are any existing rows
SELECT COUNT(*) as total_records FROM profiles;

-- Show first few records to understand the structure
SELECT * FROM profiles LIMIT 5;