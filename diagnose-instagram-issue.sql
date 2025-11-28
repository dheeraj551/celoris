-- Check if instagram_posts table exists
SELECT 
    table_name
FROM information_schema.tables 
WHERE table_name = 'instagram_posts' AND table_schema = 'public';

-- Show table structure if it exists
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'instagram_posts' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'instagram_posts';

-- Check if RLS is enabled
SELECT 
    rowsecurity
FROM pg_tables 
WHERE tablename = 'instagram_posts' AND schemaname = 'public';