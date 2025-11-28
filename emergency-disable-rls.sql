-- Emergency: Complete RLS Disable for Instagram Posts
-- ONLY USE THIS IF ultra-permissive-instagram-fix.sql doesn't work
-- This completely disables Row Level Security

-- Step 1: Disable RLS completely (emergency fix)
ALTER TABLE public.instagram_posts DISABLE ROW LEVEL SECURITY;

-- Step 2: Grant all possible permissions
GRANT ALL ON public.instagram_posts TO authenticated;
GRANT ALL ON public.instagram_posts TO anon;
GRANT ALL ON public.instagram_posts TO service_role;
GRANT ALL ON public.instagram_posts TO postgres;

-- Step 3: Grant schema and sequence permissions
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO service_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Step 4: Create any missing tables or functions that might be needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Success message
SELECT 'RLS completely disabled for Instagram posts! This should resolve ALL 500 errors.' as status;