-- CHECK VALID ROLES IN PROFILES TABLE
-- Problem: profiles_role_check constraint is rejecting 'user' role

-- STEP 1: Check what roles currently exist
SELECT '=== EXISTING ROLES IN PROFILES TABLE ===' as info;
SELECT DISTINCT role, COUNT(*) as count
FROM profiles 
GROUP BY role
ORDER BY role;

-- STEP 2: Check the check constraint definition
SELECT '=== CHECK CONSTRAINT DETAILS ===' as info;
SELECT 
  tc.constraint_name,
  cc.check_clause,
  cc.constraint_definition
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'profiles' 
  AND tc.constraint_type = 'CHECK'
  AND tc.constraint_name = 'profiles_role_check';

-- STEP 3: See all existing users with their roles
SELECT '=== ALL EXISTING USERS WITH ROLES ===' as info;
SELECT 
  id,
  name,
  email,
  role,
  is_active,
  created_at
FROM profiles
ORDER BY created_at;

-- STEP 4: Try to find the constraint definition
SELECT '=== LOOKING FOR ROLE CONSTRAINT DEFINITION ===' as info;
SELECT 
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'profiles'::regclass
  AND contype = 'c';