-- Troubleshooting: Check for database issues preventing user creation
-- Run this to identify potential problems

-- Check if there are any triggers on auth.users that might be failing
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table, 
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';