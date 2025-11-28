-- SIMPLE TABLE STRUCTURE CHECK
-- This will show the actual columns in public.users

SELECT '=== ACTUAL COLUMN STRUCTURE OF PUBLIC.USERS ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Also check what data is currently in public.users
SELECT '=== CURRENT DATA IN PUBLIC.USERS ===' as info;
SELECT * FROM public.users LIMIT 5;