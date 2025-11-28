-- CHECK ACTUAL TABLE STRUCTURE
-- This will show us the real column structure to work with

-- Check what columns actually exist in public.users
SELECT '=== PUBLIC.USERS ACTUAL STRUCTURE ===' as info;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- Show existing data in public.users to understand the structure
SELECT '=== EXISTING DATA IN PUBLIC.USERS ===' as info;
SELECT * FROM public.users ORDER BY created_at DESC LIMIT 5;

-- Check foreign key constraints
SELECT '=== FOREIGN KEY CONSTRAINTS ON PUBLIC.USERS ===' as info;
SELECT
    tc.constraint_name,
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
AND tc.table_name='users'
AND tc.table_schema='public';

-- Check all constraints on the users table
SELECT '=== ALL CONSTRAINTS ON PUBLIC.USERS ===' as info;
SELECT
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name
FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
WHERE tc.table_name='users'
AND tc.table_schema='public'
ORDER BY tc.constraint_type, kcu.column_name;