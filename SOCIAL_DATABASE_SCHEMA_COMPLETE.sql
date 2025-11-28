-- Social Media Tables Schema for InstaLinkr+ - WITH CONFLICT HANDLING
-- Run this in your Supabase SQL Editor
-- This version handles existing data gracefully

-- Step 1: Insert sample data (using ON CONFLICT to handle duplicates)
INSERT INTO social_profiles (username, full_name, bio, location, instagram_handle, is_creator) VALUES
('sarah_artist', 'Sarah Chen', 'Digital artist & content creator. Love connecting with fellow creatives!', 'New York, NY', 'sarah_creates', true),
('mike_dev', 'Mike Rodriguez', 'Software engineer passionate about building cool stuff. Always open to new projects!', 'San Francisco, CA', 'mike_codes', true),
('emma_design', 'Emma Davis', 'UX Designer & Startup founder. Building the future, one design at a time.', 'Austin, TX', 'emma_designs', true)
ON CONFLICT (username) DO NOTHING;

-- Step 2: Insert sample Instagram posts (using subquery to handle existing users)
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

-- Step 4: Create RLS policies (only if they don't exist)

-- Social Profiles policies
DROP POLICY IF EXISTS "Users can view public profiles" ON social_profiles;
CREATE POLICY "Users can view public profiles" ON social_profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON social_profiles;
CREATE POLICY "Users can update own profile" ON social_profiles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON social_profiles;
CREATE POLICY "Users can insert own profile" ON social_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Swipes policies
DROP POLICY IF EXISTS "Users can view own swipes" ON swipes;
CREATE POLICY "Users can view own swipes" ON swipes
  FOR SELECT USING (auth.uid() = swiper_id);

DROP POLICY IF EXISTS "Users can create swipes" ON swipes;
CREATE POLICY "Users can create swipes" ON swipes
  FOR INSERT WITH CHECK (auth.uid() = swiper_id);

-- Matches policies
DROP POLICY IF EXISTS "Users can view matches they're in" ON matches;
CREATE POLICY "Users can view matches they're in" ON matches
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Users can create matches" ON matches;
CREATE POLICY "Users can create matches" ON matches
  FOR INSERT WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
DROP POLICY IF EXISTS "Users can view messages in their matches" ON messages;
CREATE POLICY "Users can view messages in their matches" ON messages
  FOR SELECT USING (
    match_id IN (
      SELECT id FROM matches WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    match_id IN (
      SELECT id FROM matches WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    ) AND auth.uid() = sender_id
  );

-- Creator Earnings policies
DROP POLICY IF EXISTS "Users can view own earnings" ON creator_earnings;
CREATE POLICY "Users can view own earnings" ON creator_earnings
  FOR SELECT USING (auth.uid() = creator_id OR auth.uid() = supporter_id);

-- Content Monetization policies
DROP POLICY IF EXISTS "Anyone can view public content" ON content_monetization;
CREATE POLICY "Anyone can view public content" ON content_monetization
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Creators can manage own content" ON content_monetization;
CREATE POLICY "Creators can manage own content" ON content_monetization
  FOR ALL USING (auth.uid() = creator_id);

-- Creator Subscriptions policies
DROP POLICY IF EXISTS "Users can view own subscriptions" ON creator_subscriptions;
CREATE POLICY "Users can view own subscriptions" ON creator_subscriptions
  FOR SELECT USING (auth.uid() = subscriber_id);

DROP POLICY IF EXISTS "Creators can view subscribers" ON creator_subscriptions;
CREATE POLICY "Creators can view subscribers" ON creator_subscriptions
  FOR SELECT USING (auth.uid() = creator_id);

-- Instagram Posts policies
DROP POLICY IF EXISTS "Anyone can view Instagram posts" ON instagram_posts;
CREATE POLICY "Anyone can view Instagram posts" ON instagram_posts
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own Instagram posts" ON instagram_posts;
CREATE POLICY "Users can manage own Instagram posts" ON instagram_posts
  FOR ALL USING (auth.uid() = user_id);

-- Live Streams policies
DROP POLICY IF EXISTS "Anyone can view live streams" ON live_streams;
CREATE POLICY "Anyone can view live streams" ON live_streams
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Creators can manage own streams" ON live_streams;
CREATE POLICY "Creators can manage own streams" ON live_streams
  FOR ALL USING (auth.uid() = creator_id);

-- Step 5: Create functions and triggers

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