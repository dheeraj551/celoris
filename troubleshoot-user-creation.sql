-- Troubleshooting: Find what's preventing user creation
-- Run these queries to identify the issue

-- 1. Check if there are custom triggers on auth.users
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- 2. Check for RLS policies that might interfere
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies 
WHERE schemaname = 'auth' 
  AND tablename = 'users';

-- 3. Check constraints on public.users table
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'users' 
  AND table_schema = 'public';