-- Social Media Tables Schema for InstaLinkr+ - HANDLE EXISTING TABLES
-- Run this in your Supabase SQL Editor
-- This version handles existing tables and foreign key conflicts

-- Step 1: Check if instagram_posts exists and see what table it references
-- If it references 'profiles', we need to work with that structure

-- Let's drop the existing instagram_posts table and recreate it properly
DROP TABLE IF EXISTS instagram_posts CASCADE;

-- Step 2: Create instagram_posts table without foreign key for now
CREATE TABLE instagram_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  instagram_url TEXT NOT NULL,
  embed_html TEXT,
  thumbnail_url TEXT,
  caption TEXT,
  is_featured BOOLEAN DEFAULT false,
  engagement_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Enable RLS on instagram_posts
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Step 4: Create instagram_posts policies
DROP POLICY IF EXISTS "Anyone can view Instagram posts" ON instagram_posts;
CREATE POLICY "Anyone can view Instagram posts" ON instagram_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own Instagram posts" ON instagram_posts;
CREATE POLICY "Users can manage own Instagram posts" ON instagram_posts
  FOR ALL USING (auth.uid() = user_id);

-- Step 5: Insert sample Instagram posts (handle any duplicates)
INSERT INTO instagram_posts (user_id, instagram_url, caption) 
SELECT id, 'https://www.instagram.com/p/Cxample1/', 'Just finished this amazing digital art piece! 💜'
FROM social_profiles WHERE username = 'sarah_artist'

UNION ALL

SELECT id, 'https://www.instagram.com/p/Cxample2/', 'Working on some new features for my app 🚀'
FROM social_profiles WHERE username = 'mike_dev'

UNION ALL

SELECT id, 'https://www.instagram.com/p/Cxample3/', 'Beautiful UI design inspiration from today''s meeting ✨'
FROM social_profiles WHERE username = 'emma_design'

ON CONFLICT DO NOTHING;