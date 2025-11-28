-- FIND EXISTING ADMIN USER
-- Run this to find your existing admin auth user

SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'support@celorisdesigns.com';