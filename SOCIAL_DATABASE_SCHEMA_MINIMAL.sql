-- Social Media Tables Schema for InstaLinkr+ - MINIMAL VERSION
-- Run this in your Supabase SQL Editor
-- This version creates tables without any policies first

-- Step 1: Create the social_profiles table
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

-- Step 2: Create swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  direction TEXT CHECK (direction IN ('like', 'pass', 'super_like')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, target_user_id)
);

-- Step 3: Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  is_mutual BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Step 4: Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL,
  sender_id UUID NOT NULL,
  content TEXT,
  message_type TEXT DEFAULT 'text',
  media_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 5: Create creator_earnings table
CREATE TABLE IF NOT EXISTS creator_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  supporter_id UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  earning_type TEXT CHECK (earning_type IN ('tip', 'subscription', 'content_payment')) NOT NULL,
  content_id TEXT,
  transaction_id TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 6: Create content_monetization table
CREATE TABLE IF NOT EXISTS content_monetization (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  content_type TEXT CHECK (content_type IN ('post', 'live_stream', 'exclusive_content')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0,
  media_urls TEXT[],
  is_paid_content BOOLEAN DEFAULT false,
  is_exclusive BOOLEAN DEFAULT false,
  subscriber_count INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 7: Create creator_subscriptions table
CREATE TABLE IF NOT EXISTS creator_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  subscriber_id UUID NOT NULL,
  subscription_tier TEXT CHECK (subscription_tier IN ('basic', 'premium', 'vip')) NOT NULL,
  monthly_amount DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  next_billing_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(creator_id, subscriber_id)
);

-- Step 8: Create instagram_posts table
CREATE TABLE IF NOT EXISTS instagram_posts (
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

-- Step 9: Create live_streams table
CREATE TABLE IF NOT EXISTS live_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  stream_key TEXT UNIQUE,
  is_live BOOLEAN DEFAULT false,
  viewer_count INTEGER DEFAULT 0,
  max_viewers INTEGER DEFAULT 0,
  earnings DECIMAL(10,2) DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 10: Insert sample data
INSERT INTO social_profiles (username, full_name, bio, location, instagram_handle, is_creator) VALUES
('sarah_artist', 'Sarah Chen', 'Digital artist & content creator. Love connecting with fellow creatives!', 'New York, NY', 'sarah_creates', true),
('mike_dev', 'Mike Rodriguez', 'Software engineer passionate about building cool stuff. Always open to new projects!', 'San Francisco, CA', 'mike_codes', true),
('emma_design', 'Emma Davis', 'UX Designer & Startup founder. Building the future, one design at a time.', 'Austin, TX', 'emma_designs', true);

-- Step 11: Insert sample Instagram posts
INSERT INTO instagram_posts (user_id, instagram_url, caption) 
SELECT id, 'https://www.instagram.com/p/Cxample1/', 'Just finished this amazing digital art piece! 💜'
FROM social_profiles WHERE username = 'sarah_artist'

UNION ALL

SELECT id, 'https://www.instagram.com/p/Cxample2/', 'Working on some new features for my app 🚀'
FROM social_profiles WHERE username = 'mike_dev'

UNION ALL

SELECT id, 'https://www.instagram.com/p/Cxample3/', 'Beautiful UI design inspiration from today''s meeting ✨'
FROM social_profiles WHERE username = 'emma_design';