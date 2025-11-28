-- Temporarily disable RLS on users table to troubleshoot
-- Run this to check if RLS is causing the issue

-- Check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- If RLS is enabled, temporarily disable it
-- (Only for troubleshooting - re-enable after testing)
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Check policies that might be interfering
SELECT policyname, cmd, roles, permissive 
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename = 'users';