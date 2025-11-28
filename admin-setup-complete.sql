-- COMPLETE ADMIN USER SETUP GUIDE
-- Run these steps in order to resolve the foreign key constraint issue

-- Step 1: Check what users already exist
SELECT 'auth.users' as source, id::text, email, created_at FROM auth.users WHERE email LIKE '%admin%' OR email LIKE '%support%'
UNION ALL
SELECT 'public.users' as source, id::text, COALESCE(username, email) as email, created_at FROM users WHERE username = 'admin' OR email LIKE '%admin%' OR email LIKE '%support%';