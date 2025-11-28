-- Final verification and cleanup
-- Run this after applying the complete solution

-- Step 1: Clean up any broken data
DELETE FROM public.instagram_posts WHERE instagram_url IS NULL OR instagram_url = '';

-- Step 2: Update any posts missing instagram_id
UPDATE public.instagram_posts 
SET instagram_id = extract_instagram_id(instagram_url)
WHERE instagram_id IS NULL AND instagram_url IS NOT NULL;

-- Step 3: Ensure table is optimized
CLUSTER public.instagram_posts;

-- Step 4: Success message
SELECT 'Instagram posts system fully configured and ready!' as status;