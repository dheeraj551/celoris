-- QUICK DIAGNOSTIC: User and Admin Status
-- Run this to see current status of users and admin accounts

-- 1. Check auth.users (authentication records)
SELECT '=== AUTH.USERS (Authentication Records) ===' as info;
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC;

-- 2. Check public.profiles (user profile records)
SELECT '=== PUBLIC.PROFILES (User Profiles) ===' as info;
SELECT 
    id,
    name,
    email,
    role,
    is_active,
    wallet_balance,
    created_at
FROM public.profiles 
ORDER BY created_at DESC;

-- 3. Check for missing profiles (auth users without profiles)
SELECT '=== MISSING PROFILES (Users without profile records) ===' as info;
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ORDER BY au.created_at DESC;

-- 4. Check admin users specifically
SELECT '=== ADMIN USERS ONLY ===' as info;
SELECT 
    p.id,
    p.name,
    p.email,
    p.role,
    p.is_active,
    au.email_confirmed_at
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
WHERE p.role = 'admin'
ORDER BY p.created_at;

-- 5. Count users by role
SELECT '=== USER COUNTS BY ROLE ===' as info;
SELECT 
    role,
    COUNT(*) as count,
    SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_count
FROM public.profiles 
GROUP BY role
ORDER BY role;

-- 6. Check RLS policies
SELECT '=== CURRENT RLS POLICIES ===' as info;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('courses', 'course_modules', 'course_topics', 'profiles')
ORDER BY tablename, policyname;

-- 7. Trigger status
SELECT '=== PROFILE CREATION TRIGGER STATUS ===' as info;
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- STATUS SUMMARY
SELECT '=== STATUS SUMMARY ===' as info;
SELECT 
    'Total auth users' as metric,
    (SELECT COUNT(*) FROM auth.users) as value
UNION ALL
SELECT 
    'Total profiles' as metric,
    (SELECT COUNT(*) FROM public.profiles) as value
UNION ALL
SELECT 
    'Admin profiles' as metric,
    (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') as value
UNION ALL
SELECT 
    'Users with missing profiles' as metric,
    (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.profiles p ON au.id = p.id WHERE p.id IS NULL) as value;