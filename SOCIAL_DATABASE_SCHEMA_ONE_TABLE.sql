-- Social Media Tables Schema for InstaLinkr+ - ONE TABLE AT A TIME
-- Run this in your Supabase SQL Editor
-- This version creates one table at a time to identify issues

-- Step 1: Create only social_profiles table
CREATE TABLE IF NOT EXISTS social_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  instagram_handle TEXT,
  instagram_verified BOOLEAN DEFAULT false,
  is_creator BOOLEAN DEFAULT false,
  follower_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  subscription_plan TEXT DEFAULT 'free',
  interests TEXT[],
  profession TEXT,
  company TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert sample data
INSERT INTO social_profiles (username, full_name, bio, location, instagram_handle, is_creator) VALUES
('sarah_artist', 'Sarah Chen', 'Digital artist & content creator. Love connecting with fellow creatives!', 'New York, NY', 'sarah_creates', true);