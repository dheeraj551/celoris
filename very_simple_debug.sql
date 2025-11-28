-- VERY SIMPLE DEBUG: User ID Issue
-- Remove all complex queries that might cause column errors

-- STEP 1: Check your auth users
SELECT '=== AUTH USERS ===' as info;
SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at;

-- STEP 2: Check profiles
SELECT '=== PROFILES ===' as info;
SELECT 
  id,
  name,
  email,
  role,
  created_at
FROM profiles
ORDER BY created_at;

-- STEP 3: Check Instagram posts
SELECT '=== INSTAGRAM POSTS ===' as info;
SELECT 
  user_id,
  instagram_url,
  created_at
FROM instagram_posts
ORDER BY created_at DESC
LIMIT 5;

-- STEP 4: Test the Instagram function manually
SELECT '=== TESTING INSTAGRAM FUNCTION ===' as info;

-- Get a real user ID and test
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    SELECT id INTO test_user_id FROM profiles WHERE is_active = TRUE LIMIT 1;
    
    RAISE NOTICE 'Testing with user ID: %', test_user_id;
    
    -- Test creating an Instagram post
    BEGIN
        PERFORM create_instagram_post('https://instagram.com/test123', test_user_id);
        RAISE NOTICE '✅ Function test successful with user ID: %', test_user_id;
        
        -- Clean up test
        DELETE FROM instagram_posts WHERE instagram_url = 'https://instagram.com/test123';
        RAISE NOTICE '✅ Test cleanup completed';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Function test failed: %', SQLERRM;
    END;
END
$$;

-- STEP 5: Show if users have profiles
SELECT '=== USER-PROFILE MATCHING ===' as info;
SELECT 
  au.id as auth_id,
  au.email as auth_email,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Has Profile'
    ELSE '❌ Missing Profile'
  END as profile_status,
  p.id as profile_id,
  p.email as profile_email
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at;