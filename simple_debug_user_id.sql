-- SIMPLE DEBUG: User ID Issue for Instagram Posts
-- Problem: Getting "16" instead of UUID

-- STEP 1: Check user IDs in auth.users
SELECT '=== USER IDs IN AUTH.USERS ===' as info;
SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at;

-- STEP 2: Check corresponding profiles  
SELECT '=== CORRESPONDING PROFILES ===' as info;
SELECT 
  id,
  name,
  email,
  role,
  created_at
FROM profiles
ORDER BY created_at;

-- STEP 3: Check any Instagram posts
SELECT '=== INSTAGRAM POSTS (IF ANY) ===' as info;
SELECT 
  user_id,
  instagram_url,
  created_at
FROM instagram_posts
ORDER BY created_at DESC
LIMIT 5;

-- STEP 4: Test the database function directly
-- Get a real user ID and test the Instagram function
SELECT '=== TESTING CREATE_INSTAGRAM_POST FUNCTION ===' as info;

-- Use the first user ID from profiles to test
DO $$
DECLARE
    test_user_id UUID;
    test_result TEXT;
BEGIN
    -- Get first active user ID
    SELECT id INTO test_user_id 
    FROM profiles 
    WHERE is_active = TRUE 
    LIMIT 1;
    
    RAISE NOTICE 'Testing with user ID: %', test_user_id;
    
    -- Test the function
    BEGIN
        PERFORM create_instagram_post('https://instagram.com/test123', test_user_id);
        RAISE NOTICE '✅ Function works with user ID: %', test_user_id;
        
        -- Clean up test
        DELETE FROM instagram_posts 
        WHERE instagram_url = 'https://instagram.com/test123';
        
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Function failed: %', SQLERRM;
    END;
END
$$;

-- STEP 5: Show the exact issue
SELECT '=== DIAGNOSIS ===' as info;
SELECT 
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ User has profile'
    ELSE '❌ User missing profile'
  END as profile_status,
  au.id,
  au.email
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at;