-- Create Instagram posts table - Safe Version
-- This creates the table with proper RLS policies

-- Create the table
CREATE TABLE IF NOT EXISTS instagram_posts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  instagram_url TEXT NOT NULL,
  embed_html TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can view Instagram posts" ON instagram_posts
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own posts
CREATE POLICY "Users can insert own Instagram posts" ON instagram_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update own Instagram posts" ON instagram_posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete own Instagram posts" ON instagram_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Admin policy for managing all posts
CREATE POLICY "Admin can manage all Instagram posts" ON instagram_posts
  FOR ALL USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_posts_user_id ON instagram_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_created_at ON instagram_posts(created_at DESC);

-- Verify table creation
SELECT 'Instagram posts table created successfully' as status;