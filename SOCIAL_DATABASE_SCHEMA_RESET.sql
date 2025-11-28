-- Social Media Tables Schema for InstaLinkr+ - COMPLETE RESET
-- Run this in your Supabase SQL Editor
-- This version drops all tables and starts fresh

-- Step 1: Drop all existing tables to start fresh
DROP TABLE IF EXISTS instagram_posts CASCADE;
DROP TABLE IF EXISTS social_profiles CASCADE;
DROP TABLE IF EXISTS swipes CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS creator_earnings CASCADE;
DROP TABLE IF EXISTS content_monetization CASCADE;
DROP TABLE IF EXISTS creator_subscriptions CASCADE;
DROP TABLE IF EXISTS live_streams CASCADE;

-- Step 2: Create all tables fresh
CREATE TABLE social_profiles (
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

CREATE TABLE swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID NOT NULL,
  target_user_id UUID NOT NULL,
  direction TEXT CHECK (direction IN ('like', 'pass', 'super_like')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, target_user_id)
);

CREATE TABLE matches (
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

CREATE TABLE messages (
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

CREATE TABLE creator_earnings (
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

CREATE TABLE content_monetization (
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

CREATE TABLE creator_subscriptions (
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

CREATE TABLE live_streams (
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

-- Step 3: Enable RLS on all tables
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_monetization ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies

-- Social Profiles policies
CREATE POLICY "Users can view public profiles" ON social_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON social_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON social_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Swipes policies
CREATE POLICY "Users can view own swipes" ON swipes
  FOR SELECT USING (auth.uid() = swiper_id);

CREATE POLICY "Users can create swipes" ON swipes
  FOR INSERT WITH CHECK (auth.uid() = swiper_id);

-- Matches policies
CREATE POLICY "Users can view matches they're in" ON matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create matches" ON matches
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can view messages in their matches" ON messages
  FOR SELECT USING (
    match_id IN (
      SELECT id FROM matches WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    match_id IN (
      SELECT id FROM matches WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    ) AND auth.uid() = sender_id
  );

-- Creator Earnings policies
CREATE POLICY "Users can view own earnings" ON creator_earnings
  FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = supporter_id);

-- Content Monetization policies
CREATE POLICY "Anyone can view public content" ON content_monetization
  FOR SELECT USING (true);

CREATE POLICY "Creators can manage own content" ON content_monetization
  FOR ALL USING (auth.uid() = creator_id);

-- Creator Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON creator_subscriptions
  FOR SELECT USING (auth.uid() = subscriber_id);

CREATE POLICY "Creators can view subscribers" ON creator_subscriptions
  FOR SELECT USING (auth.uid() = creator_id);

-- Instagram Posts policies
CREATE POLICY "Anyone can view Instagram posts" ON instagram_posts
  FOR SELECT USING (true);

CREATE POLICY "Users can manage own Instagram posts" ON instagram_posts
  FOR ALL USING (auth.uid() = user_id);

-- Live Streams policies
CREATE POLICY "Anyone can view live streams" ON live_streams
  FOR SELECT USING (true);

CREATE POLICY "Creators can manage own streams" ON live_streams
  FOR ALL USING (auth.uid() = creator_id);

-- Step 5: Insert sample data
INSERT INTO social_profiles (username, full_name, bio, location, instagram_handle, is_creator) VALUES
('sarah_artist', 'Sarah Chen', 'Digital artist & content creator. Love connecting with fellow creatives!', 'New York, NY', 'sarah_creates', true),
('mike_dev', 'Mike Rodriguez', 'Software engineer passionate about building cool stuff. Always open to new projects!', 'San Francisco, CA', 'mike_codes', true),
('emma_design', 'Emma Davis', 'UX Designer & Startup founder. Building the future, one design at a time.', 'Austin, TX', 'emma_designs', true);

INSERT INTO instagram_posts (user_id, instagram_url, caption) 
SELECT id, 'https://www.instagram.com/p/Cxample1/', 'Just finished this amazing digital art piece! 💜'
FROM social_profiles WHERE username = 'sarah_artist'

UNION ALL

SELECT id, 'https://www.instagram.com/p/Cxample2/', 'Working on some new features for my app 🚀'
FROM social_profiles WHERE username = 'mike_dev'

UNION ALL

SELECT id, 'https://www.instagram.com/p/Cxample3/', 'Beautiful UI design inspiration from today''s meeting ✨'
FROM social_profiles WHERE username = 'emma_design';