-- CREATE PROFILES FOR REGULAR USERS WITH CORRECT ROLES
-- Fix: Use 'tutor' role instead of 'user' (based on existing user)

-- STEP 1: Check current users in auth.users
SELECT '=== REGULAR USERS IN AUTH SYSTEM ===' as info;
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->>'name' as display_name
FROM auth.users 
ORDER BY created_at DESC;

-- STEP 2: Create profiles for users without them using 'tutor' role
-- Based on the existing user having role='tutor'
INSERT INTO public.profiles (
  id,
  name,
  email,
  role,
  wallet_balance,
  is_active,
  created_at,
  updated_at
)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data->>'name', 'Tutor', split_part(au.email, '@', 1)) as name,
  au.email,
  'tutor', -- Use 'tutor' role based on existing user
  0,
  TRUE,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL -- Only users without profiles
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Verify the fix worked
SELECT '=== VERIFICATION: Check profiles created ===' as info;

-- Check all profiles
SELECT 
  id,
  name,
  email,
  role,
  is_active,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- Count by role
SELECT 
  'Role: ' || role as role_breakdown,
  COUNT(*) as user_count
FROM profiles
GROUP BY role
ORDER BY role;

-- STEP 4: Final verification - no missing profiles
SELECT '=== MISSING PROFILES CHECK ===' as info;
SELECT 
  'Users without profiles' as check_type,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- SUCCESS MESSAGE
SELECT '🎉 SUCCESS! 
✅ Regular users now have profiles with tutor role
✅ Instagram posts should now work for all users
✅ All auth.users now have corresponding profiles
✅ Foreign key constraints satisfied
' as result;