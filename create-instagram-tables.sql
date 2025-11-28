-- Create Instagram posts table for social profiles
CREATE TABLE IF NOT EXISTS instagram_posts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  instagram_url TEXT NOT NULL,
  embed_html TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for Instagram posts
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Allow users to view all Instagram posts (for public profiles)
CREATE POLICY "Anyone can view Instagram posts" ON instagram_posts
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own Instagram posts
CREATE POLICY "Users can insert own Instagram posts" ON instagram_posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own Instagram posts
CREATE POLICY "Users can update own Instagram posts" ON instagram_posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own Instagram posts
CREATE POLICY "Users can delete own Instagram posts" ON instagram_posts
  FOR DELETE USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_instagram_posts_user_id ON instagram_posts(user_id);
CREATE INDEX idx_instagram_posts_created_at ON instagram_posts(created_at DESC);