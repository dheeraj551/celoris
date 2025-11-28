-- DEBUG USER ID ISSUE FOR INSTAGRAM POSTS
-- Problem: Getting "16" instead of UUID when uploading Instagram posts

-- STEP 1: Check what user IDs we have in auth.users
SELECT '=== USER IDs IN AUTH.USERS ===' as info;
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->>'name' as display_name
FROM auth.users
ORDER BY created_at;

-- STEP 2: Check corresponding profiles
SELECT '=== CORRESPONDING PROFILES ===' as info;
SELECT 
  p.id as profile_id,
  p.name,
  p.email,
  p.role,
  p.created_at as profile_created
FROM public.profiles p
ORDER BY p.created_at;

-- STEP 3: Check instagram_posts table to see what's being inserted
SELECT '=== INSTAGRAM POSTS (IF ANY) ===' as info;
SELECT 
  ip.id,
  ip.user_id,
  ip.instagram_url,
  ip.created_at,
  p.name as user_name,
  p.email as user_email
FROM public.instagram_posts ip
LEFT JOIN public.profiles p ON ip.user_id = p.id
ORDER BY ip.created_at DESC;

-- STEP 4: Check the create_instagram_post function parameters
-- Let's see what the function expects
SELECT '=== FUNCTION PARAMETERS ===' as info;
SELECT 
  routine_name,
  parameter_name,
  data_type,
  parameter_mode
FROM information_schema.parameters 
WHERE routine_name = 'create_instagram_post'
ORDER BY ordinal_position;

-- STEP 5: Check the database function definition
SELECT '=== CREATE_INSTAGRAM_POST FUNCTION ===' as info;
SELECT 
  p.proname as function_name,
  pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
WHERE p.proname = 'create_instagram_post';