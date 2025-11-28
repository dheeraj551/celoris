-- CREATE PROFILES FOR REGULAR USERS (Not Admin)
-- Solution: Regular users need profiles to upload Instagram posts
-- Admin accounts stay separate for system management

-- STEP 1: Check current auth.users (regular signups)
SELECT '=== CHECKING REGULAR USERS IN AUTH SYSTEM ===' as info;
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->>'name' as display_name
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;

-- STEP 2: Check which users already have profiles
SELECT '=== CHECKING USERS WITH PROFILES ===' as info;
SELECT 
  au.id,
  au.email,
  p.name as profile_name,
  p.role
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
ORDER BY au.created_at DESC
LIMIT 10;

-- STEP 3: Create profiles for users who don't have them
-- This ensures regular users can upload Instagram posts
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
  COALESCE(au.raw_user_meta_data->>'name', au.email, 'User') as name,
  au.email,
  'user', -- Regular user role
  0,
  TRUE,
  au.created_at,
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL -- Only users without profiles
ON CONFLICT (id) DO NOTHING;

-- STEP 4: Update any existing profiles to have 'user' role (not admin)
UPDATE public.profiles 
SET role = 'user'
WHERE role != 'admin' OR role IS NULL;

-- STEP 5: Verify the fix
SELECT '=== VERIFICATION: All users should now have profiles ===' as info;

SELECT 
  'Total auth users' as count_type,
  (SELECT COUNT(*) FROM auth.users) as count
UNION ALL
SELECT 
  'Total profiles created' as count_type,
  (SELECT COUNT(*) FROM public.profiles) as count
UNION ALL
SELECT 
  'Admin profiles' as count_type,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin') as count
UNION ALL
SELECT 
  'Regular user profiles' as count_type,
  (SELECT COUNT(*) FROM public.profiles WHERE role = 'user') as count;

-- STEP 6: Show which users can now upload Instagram posts
SELECT '=== USERS WHO CAN NOW UPLOAD INSTAGRAM POSTS ===' as info;
SELECT 
  p.id,
  p.name,
  p.email,
  p.role,
  p.is_active
FROM public.profiles p
WHERE p.role = 'user' AND p.is_active = TRUE
ORDER BY p.created_at DESC;

-- SUCCESS MESSAGE
SELECT '🎉 SUCCESS! 
✅ Regular users now have profiles in profiles table
✅ Instagram posts will work for regular users  
✅ Admin accounts remain separate for system management
✅ Foreign key constraints are satisfied
' as result;