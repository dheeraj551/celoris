-- Social Media Tables Schema for InstaLinkr+ - FIXED VERSION
-- Run this in your Supabase SQL Editor
-- This version creates tables first, then policies

-- Extend users table with social features
CREATE TABLE IF NOT EXISTS social_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
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
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium', 'creator')),
  interests TEXT[],
  profession TEXT,
  company TEXT,
  website TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swipes table
CREATE TABLE IF NOT EXISTS swipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swiper_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  direction TEXT CHECK (direction IN ('like', 'pass', 'super_like')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, target_user_id)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  is_mutual BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  content TEXT,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'voice', 'video', 'gif')),
  media_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator Earnings table
CREATE TABLE IF NOT EXISTS creator_earnings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  supporter_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  earning_type TEXT CHECK (earning_type IN ('tip', 'subscription', 'content_payment')) NOT NULL,
  content_id TEXT,
  transaction_id TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Monetization table
CREATE TABLE IF NOT EXISTS content_monetization (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
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

-- Creator Subscriptions table
CREATE TABLE IF NOT EXISTS creator_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  subscriber_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  subscription_tier TEXT CHECK (subscription_tier IN ('basic', 'premium', 'vip')) NOT NULL,
  monthly_amount DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  next_billing_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(creator_id, subscriber_id)
);

-- Instagram Posts table
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
  instagram_url TEXT NOT NULL,
  embed_html TEXT,
  thumbnail_url TEXT,
  caption TEXT,
  is_featured BOOLEAN DEFAULT false,
  engagement_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Streams table
CREATE TABLE IF NOT EXISTS live_streams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID REFERENCES social_profiles(id) ON DELETE CASCADE,
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

-- Enable RLS on all tables
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_monetization ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_streams ENABLE ROW LEVEL SECURITY;

-- Now create the policies (tables exist now)
-- Social Profiles policies
CREATE POLICY "Users can view public profiles" ON social_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON social_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON social_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

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

-- Functions and triggers for automatic updates

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_social_profiles_updated_at ON social_profiles;
CREATE TRIGGER update_social_profiles_updated_at 
  BEFORE UPDATE ON social_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at 
  BEFORE UPDATE ON matches 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create a match when both users like each other
CREATE OR REPLACE FUNCTION create_mutual_match()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the target user has already liked the swiper
  IF NEW.direction = 'like' AND EXISTS (
    SELECT 1 FROM swipes 
    WHERE swiper_id = NEW.target_user_id 
    AND target_user_id = NEW.swiper_id 
    AND direction = 'like'
  ) THEN
    -- Create mutual match (ensure consistent user ordering)
    IF NEW.swiper_id < NEW.target_user_id THEN
      INSERT INTO matches (user1_id, user2_id, is_mutual) 
      VALUES (NEW.swiper_id, NEW.target_user_id, true);
    ELSE
      INSERT INTO matches (user1_id, user2_id, is_mutual) 
      VALUES (NEW.target_user_id, NEW.swiper_id, true);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatic match creation
DROP TRIGGER IF EXISTS create_match_trigger ON swipes;
CREATE TRIGGER create_match_trigger
  AFTER INSERT ON swipes
  FOR EACH ROW EXECUTE FUNCTION create_mutual_match();

-- Sample data for testing
INSERT INTO social_profiles (id, username, full_name, bio, location, instagram_handle, is_creator) VALUES
('11111111-1111-1111-1111-111111111111', 'sarah_artist', 'Sarah Chen', 'Digital artist & content creator. Love connecting with fellow creatives!', 'New York, NY', 'sarah_creates', true),
('22222222-2222-2222-2222-222222222222', 'mike_dev', 'Mike Rodriguez', 'Software engineer passionate about building cool stuff. Always open to new projects!', 'San Francisco, CA', 'mike_codes', true),
('33333333-3333-3333-3333-333333333333', 'emma_design', 'Emma Davis', 'UX Designer & Startup founder. Building the future, one design at a time.', 'Austin, TX', 'emma_designs', true)
ON CONFLICT (id) DO NOTHING;

-- Instagram posts sample data
INSERT INTO instagram_posts (user_id, instagram_url, caption) VALUES
('11111111-1111-1111-1111-111111111111', 'https://www.instagram.com/p/Cxample1/', 'Just finished this amazing digital art piece! 💜'),
('22222222-2222-2222-2222-222222222222', 'https://www.instagram.com/p/Cxample2/', 'Working on some new features for my app 🚀'),
('33333333-3333-3333-3333-333333333333', 'https://www.instagram.com/p/Cxample3/', 'Beautiful UI design inspiration from today''s meeting ✨')
ON CONFLICT DO NOTHING;