-- Fix Blog Post Issues
-- Run this in your Supabase SQL Editor

-- Step 1: Fix the Shraddha Kapoor blog post with proper date and add featured image
UPDATE blog_posts 
SET 
  featured_image_url = 'https://images.unsplash.com/photo-1551748257-3718e4f0d68b?w=800&h=400&fit=crop',
  published_at = '2024-11-20T10:00:00Z',
  views_count = 245,
  likes_count = 12
WHERE title ILIKE '%Shraddha Kapoor%' OR title ILIKE '%drug case%';

-- Step 2: Add featured image to other posts if they don't have one
UPDATE blog_posts 
SET featured_image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
WHERE featured_image_url IS NULL;

-- Step 3: Ensure all posts have proper dates
UPDATE blog_posts 
SET published_at = created_at 
WHERE published_at IS NULL OR published_at > NOW();

-- Step 4: Set proper reading time for posts without it
UPDATE blog_posts 
SET reading_time = CASE 
  WHEN LENGTH(content) < 1000 THEN 3
  WHEN LENGTH(content) < 2000 THEN 5
  WHEN LENGTH(content) < 4000 THEN 8
  ELSE 12
END
WHERE reading_time IS NULL OR reading_time = 0;