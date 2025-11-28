-- Fix Blog RLS Policies
-- This script fixes the RLS policies to allow public access to published blog posts

-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;

-- Create a new, more flexible policy that allows access based on is_published flag
CREATE POLICY "Public can view published blog posts" ON public.blog_posts
    FOR SELECT USING (is_published = true);

-- Also ensure status is properly managed
-- Update any posts that have is_published = true but status != 'published'
UPDATE public.blog_posts 
SET status = 'published', published_at = NOW()
WHERE is_published = true AND status != 'published';

-- Grant usage to anon and authenticated users
GRANT SELECT ON public.blog_posts TO anon, authenticated;

-- Verify the current state
SELECT 
    id,
    title,
    is_published,
    status,
    published_at,
    created_at
FROM public.blog_posts
ORDER BY created_at DESC;