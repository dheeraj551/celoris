-- Check Supabase project configuration that might affect user creation
-- Run this to see project settings

-- Check auth configuration
SELECT name, value 
FROM vault.decrypted_secrets 
WHERE name LIKE '%auth%';

-- Check database extensions that might be required
SELECT name, installed_version, comment
FROM pg_available_extensions 
WHERE name IN ('uuid-ossp', 'pgcrypto', 'pg_auth');

-- Check if there are any auth-related functions
SELECT routine_name, routine_type, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'auth' 
  AND routine_name LIKE '%user%';