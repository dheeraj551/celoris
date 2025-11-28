-- Find the existing admin user and create their profile
-- This uses the actual UUID from the existing auth user

-- Step 1: Find the existing auth user
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'support@celorisdesigns.com';