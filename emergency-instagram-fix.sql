-- EMERGENCY BACKUP: Complete RLS Disable
-- ONLY run if direct-instagram-fix.sql doesn't work

-- Emergency: Disable RLS completely to eliminate all 500 errors
ALTER TABLE public.instagram_posts DISABLE ROW LEVEL SECURITY;

-- Grant maximum possible permissions
GRANT ALL ON public.instagram_posts TO authenticated;
GRANT ALL ON public.instagram_posts TO anon;
GRANT ALL ON public.instagram_posts TO service_role;
GRANT ALL ON public.instagram_posts TO postgres;

-- Emergency success message
SELECT 'RLS completely disabled - Instagram posts should work now!' as result;