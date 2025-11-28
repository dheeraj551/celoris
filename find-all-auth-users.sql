-- Find ALL users in auth.users to see what admin users exist
-- This will show us what users you actually have

SELECT id, email, created_at, email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 10;