-- Robust Instagram Posts Table Fix
-- Handles existing tables that might be missing columns

-- Step 1: Check current table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'instagram_posts' 
AND table_schema = 'public'
ORDER BY ordinal_position;