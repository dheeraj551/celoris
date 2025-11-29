-- Migration: Remove VPS and Generalize Posts

-- 1. Drop VPS Tables
DROP TABLE IF EXISTS vps_video_comments;
DROP TABLE IF EXISTS vps_video_likes;
DROP TABLE IF EXISTS vps_uploads_log;
DROP TABLE IF EXISTS vps_videos;

-- 2. Update instagram_posts table to be generic
-- First, rename instagram_url to media_url
ALTER TABLE instagram_posts RENAME COLUMN instagram_url TO media_url;

-- Add post_type column
ALTER TABLE instagram_posts ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'instagram';

-- Add check constraint for post_type
ALTER TABLE instagram_posts ADD CONSTRAINT check_post_type CHECK (post_type IN ('instagram', 'image', 'video'));

-- Add title/description if they don't exist (caption exists)
-- We'll use caption as the main text.

-- 3. Update RLS Policies
-- Ensure policies allow insert for authenticated users
DROP POLICY IF EXISTS "Users can insert own posts" ON instagram_posts;
CREATE POLICY "Users can insert own posts" ON instagram_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Ensure policies allow update/delete for own posts
DROP POLICY IF EXISTS "Users can update own posts" ON instagram_posts;
CREATE POLICY "Users can update own posts" ON instagram_posts
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON instagram_posts;
CREATE POLICY "Users can delete own posts" ON instagram_posts
  FOR DELETE USING (auth.uid() = user_id);
