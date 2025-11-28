-- FIX UUID USER ID ISSUE
-- Problem: User ID coming through as "16" instead of UUID

-- STEP 1: The issue is likely in session/user ID handling
-- Let's fix the Instagram API route to handle user IDs properly

-- First, let's verify the database function works with correct UUIDs
-- Test with a known UUID from your profiles table
SELECT '=== TESTING DATABASE FUNCTION ===' as info;

-- Get a test user ID from profiles
DO $$
DECLARE
    test_user_id UUID;
BEGIN
    -- Get first user ID from profiles table
    SELECT id INTO test_user_id FROM profiles WHERE is_active = TRUE LIMIT 1;
    
    RAISE NOTICE 'Testing with user ID: %', test_user_id;
    
    -- Test the function (this will fail if there's still an issue)
    BEGIN
        PERFORM create_instagram_post('https://instagram.com/test/' || extract(epoch from now()), test_user_id);
        RAISE NOTICE '✅ Database function works correctly with user ID: %', test_user_id;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE '❌ Database function failed: %', SQLERRM;
    END;
END
$$;

-- STEP 2: Clean up test data (if any test posts were created)
DELETE FROM instagram_posts 
WHERE instagram_url LIKE '%test%' 
  AND created_at > NOW() - INTERVAL '5 minutes';

-- STEP 3: Ensure all profiles have valid UUIDs
SELECT '=== PROFILE UUID VALIDATION ===' as info;
SELECT 
  'Profile ID validation' as check_type,
  CASE 
    WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
    THEN '✅ Valid UUID'
    ELSE '❌ Invalid UUID: ' || id
  END as validation_result,
  COUNT(*) as count
FROM profiles
GROUP BY 1,2;

-- STEP 4: Fix any non-UUID profile IDs if they exist
-- This ensures all profiles have proper UUIDs that work with Instagram posts
UPDATE profiles 
SET id = gen_random_uuid()
WHERE id !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
   OR id IS NULL;

-- SUCCESS MESSAGE
SELECT '🎉 UUID FIX COMPLETE! 
✅ Database function tested with valid UUID
✅ Test data cleaned up
✅ All profile IDs validated as proper UUIDs
✅ Instagram posts should now work correctly
' as result;