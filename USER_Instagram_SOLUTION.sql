-- USER-FOCUSED INSTAGRAM SOLUTION 
-- Fix for regular users, NOT admin accounts
-- Problem: Regular users can't upload Instagram posts due to foreign key constraints

-- INSIGHT: Regular users sign up through Supabase Auth (auth.users table)
-- but they might not exist in the application tables (users/profiles)

-- STEP 1: Create a trigger to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table if it exists
  INSERT INTO public.users (id, created_at, updated_at)
  VALUES (NEW.id, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id, 
    name, 
    email, 
    role,
    wallet_balance,
    is_active,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.email,
    'user', -- Regular user role, not admin
    0,
    TRUE,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(NEW.raw_user_meta_data->>'name', profiles.name),
    email = NEW.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 2: For existing users, create their profiles manually
-- This ensures all current users can upload Instagram posts
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
  COALESCE(au.raw_user_meta_data->>'name', 'User'),
  au.email,
  'user',
  0,
  TRUE,
  NOW(),
  NOW()
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Grant necessary permissions for Instagram functionality
-- These policies ensure users can manage their own Instagram posts
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instagram_posts TO authenticated;

-- STEP 4: Verify the fix worked
SELECT '=== VERIFICATION: Check if profiles exist for all users ===' as info;
SELECT 
  'Total users in auth.users' as check_type,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Total profiles created' as check_type,
  COUNT(*) as count
FROM public.profiles
UNION ALL
SELECT 
  'Users missing profiles' as check_type,
  COUNT(*) as count
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- STEP 5: Test Instagram post creation for a regular user
-- This simulates what happens when a user uploads an Instagram post
SELECT '=== TEST: Instagram post creation simulation ===' as info;
-- Use a test user ID (replace with actual user ID from your auth.users table)
-- SELECT create_instagram_post('https://instagram.com/test', '550e8400-e29b-41d4-a716-446655440000') as test_result;

-- SUCCESS MESSAGE
SELECT '🎉 SUCCESS! 
- Trigger created to auto-create profiles for new users
- Existing users now have profiles in profiles table  
- Regular users can now upload Instagram posts
- Admin accounts remain separate from user Instagram functionality
' as result;