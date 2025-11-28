-- Create Instagram Posts Table - Corrected for Your Database Schema
-- This references the users table (not profiles)

-- Create the table with correct foreign key reference
CREATE TABLE IF NOT EXISTS instagram_posts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  instagram_url TEXT NOT NULL,
  embed_html TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for viewing Instagram posts on profiles)
CREATE POLICY "Anyone can view Instagram posts" ON instagram_posts
  FOR SELECT USING (true);

-- Allow users to insert their own Instagram posts
CREATE POLICY "Users can insert own Instagram posts" ON instagram_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own Instagram posts
CREATE POLICY "Users can update own Instagram posts" ON instagram_posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own Instagram posts
CREATE POLICY "Users can delete own Instagram posts" ON instagram_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Admin policy for managing all posts (for your admin user)
CREATE POLICY "Admin can manage all Instagram posts" ON instagram_posts
  FOR ALL USING (true);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_posts_user_id ON instagram_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_created_at ON instagram_posts(created_at DESC);

-- Verify table creation
SELECT 'Instagram posts table created successfully with users table reference' as status;