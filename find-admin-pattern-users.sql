-- Alternative: Check if any admin-like users exist
-- Search for admin or support email patterns

SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
WHERE email ILIKE '%admin%' 
   OR email ILIKE '%support%'
   OR email ILIKE '%celoris%'
ORDER BY created_at DESC;