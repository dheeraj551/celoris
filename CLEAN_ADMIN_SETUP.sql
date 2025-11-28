-- CLEAN ADMIN SETUP SCRIPT
-- This script sets up the admin user and proper RLS policies

-- Convert ananyajairath to admin
INSERT INTO public.admins (id, user_id, role, created_at)
SELECT 
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'ananyajairath'),
    'admin',
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'ananyajairath')
);

-- Enable RLS on tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_topics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow admin access to courses" ON public.courses;
DROP POLICY IF EXISTS "Allow admin access to modules" ON public.course_modules;
DROP POLICY IF EXISTS "Allow admin access to topics" ON public.course_topics;

-- Create admin access policies
CREATE POLICY "Allow admin access to courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Allow admin access to modules" ON public.course_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Allow admin access to topics" ON public.course_topics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE user_id = auth.uid()
        )
    );

SELECT 'ADMIN SETUP COMPLETE' as status;