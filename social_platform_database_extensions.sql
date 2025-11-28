-- Social Platform Database Extensions
-- This script adds all the necessary tables and features for the complete social platform

-- 1. FCM Tokens Management
CREATE TABLE IF NOT EXISTS user_fcm_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'web',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, token)
);

-- Enable RLS
ALTER TABLE user_fcm_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policy for FCM tokens
CREATE POLICY "Users can manage their own FCM tokens" ON user_fcm_tokens
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage FCM tokens" ON user_fcm_tokens
  FOR ALL USING (auth.role() = 'service_role');

-- 2. Notification Logs
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy for notification logs
CREATE POLICY "Users can view their own notification logs" ON notification_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage notification logs" ON notification_logs
  FOR ALL USING (auth.role() = 'service_role');

-- 3. WhatsApp Messages
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  whatsapp_message_id TEXT,
  error_message TEXT,
  is_test BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy for WhatsApp messages
CREATE POLICY "Users can view their own WhatsApp messages" ON whatsapp_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage WhatsApp messages" ON whatsapp_messages
  FOR ALL USING (auth.role() = 'service_role');

-- 4. Call Logs
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  caller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  callee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  call_type TEXT DEFAULT 'video',
  status TEXT DEFAULT 'initiated',
  duration INTEGER DEFAULT 0, -- in seconds
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  agora_channel_id TEXT,
  recording_url TEXT
);

-- Enable RLS
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy for call logs
CREATE POLICY "Users can view their own call logs" ON call_logs
  FOR SELECT USING (
    auth.uid() = caller_id OR auth.uid() = callee_id
  );

CREATE POLICY "Service role can manage call logs" ON call_logs
  FOR ALL USING (auth.role() = 'service_role');

-- 5. User Presence
CREATE TABLE IF NOT EXISTS user_presence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'offline', -- 'online', 'away', 'offline'
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- RLS Policy for user presence
CREATE POLICY "Users can view presence of matches" ON user_presence
  FOR SELECT USING (
    user_id IN (
      SELECT DISTINCT 
        CASE 
          WHEN user1_id = auth.uid() THEN user2_id 
          ELSE user1_id 
        END
      FROM matches 
      WHERE user1_id = auth.uid() OR user2_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own presence" ON user_presence
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage user presence" ON user_presence
  FOR ALL USING (auth.role() = 'service_role');

-- 6. Enhanced Messages Table (if not exists)
-- Add read_at column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'read_at'
  ) THEN
    ALTER TABLE messages ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Add message_type column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'message_type'
  ) THEN
    ALTER TABLE messages ADD COLUMN message_type TEXT DEFAULT 'text';
  END IF;
END $$;

-- Add content column if not exists (some implementations use 'content' instead of 'message')
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'content'
  ) THEN
    ALTER TABLE messages ADD COLUMN content TEXT;
  END IF;
END $$;

-- 7. Enhanced Matches Table
-- Add last_message_at column if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'matches' AND column_name = 'last_message_at'
  ) THEN
    ALTER TABLE matches ADD COLUMN last_message_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_fcm_tokens_user_id ON user_fcm_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_fcm_tokens_token ON user_fcm_tokens(token);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_user_id ON whatsapp_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone ON whatsapp_messages(phone);
CREATE INDEX IF NOT EXISTS idx_call_logs_match_id ON call_logs(match_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_user_id ON call_logs(caller_id, callee_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_status ON user_presence(status);
CREATE INDEX IF NOT EXISTS idx_messages_match_id ON messages(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_matches_user1_user2 ON matches(user1_id, user2_id);

-- 9. Create functions for automatic presence updates
CREATE OR REPLACE FUNCTION update_user_presence()
RETURNS TRIGGER AS $$
BEGIN
  -- Update presence when user sends a message
  INSERT INTO user_presence (user_id, status, last_seen, updated_at)
  VALUES (NEW.sender_id, 'online', NOW(), NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET 
    status = 'online',
    last_seen = NOW(),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for message presence update
DROP TRIGGER IF EXISTS trigger_update_presence_on_message ON messages;
CREATE TRIGGER trigger_update_presence_on_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_user_presence();

-- 10. Create function to update read receipts
CREATE OR REPLACE FUNCTION update_read_receipts()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark messages as read when they are inserted by another user
  IF NEW.sender_id != OLD.sender_id THEN
    NEW.is_read = true;
    NEW.read_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for read receipts
DROP TRIGGER IF EXISTS trigger_update_read_receipts ON messages;
CREATE TRIGGER trigger_update_read_receipts
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_read_receipts();

-- 11. Create view for enhanced match information
CREATE OR REPLACE VIEW matches_with_info AS
SELECT 
  m.*,
  up1.username as user1_username,
  up1.full_name as user1_full_name,
  up1.avatar_url as user1_avatar_url,
  up2.username as user2_username,
  up2.full_name as user2_full_name,
  up2.avatar_url as user2_avatar_url,
  -- Get the last message
  (SELECT content FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message,
  (SELECT created_at FROM messages WHERE match_id = m.id ORDER BY created_at DESC LIMIT 1) as last_message_at,
  (SELECT COUNT(*) FROM messages WHERE match_id = m.id AND is_read = false AND sender_id != 
    CASE 
      WHEN m.user1_id = auth.uid() THEN m.user2_id 
      ELSE m.user1_id 
    END
  ) as unread_count
FROM matches m
JOIN social_profiles up1 ON m.user1_id = up1.user_id
JOIN social_profiles up2 ON m.user2_id = up2.user_id;

-- 12. Enable Row Level Security on views (if needed)
ALTER VIEW matches_with_info SET (security_invoker = on);

-- 13. Insert some sample data for testing (optional)
-- This can be used for development and testing
/*
INSERT INTO user_fcm_tokens (user_id, token, platform) VALUES
  ('sample-user-id', 'sample-fcm-token-123', 'web')
ON CONFLICT (user_id, token) DO NOTHING;

INSERT INTO user_presence (user_id, status) VALUES
  ('sample-user-id', 'online')
ON CONFLICT (user_id) DO UPDATE SET 
  status = 'online',
  updated_at = NOW();
*/

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;

-- Grant table permissions
GRANT ALL ON user_fcm_tokens TO authenticated;
GRANT ALL ON user_fcm_tokens TO service_role;

GRANT ALL ON notification_logs TO authenticated;
GRANT ALL ON notification_logs TO service_role;

GRANT ALL ON whatsapp_messages TO authenticated;
GRANT ALL ON whatsapp_messages TO service_role;

GRANT ALL ON call_logs TO authenticated;
GRANT ALL ON call_logs TO service_role;

GRANT ALL ON user_presence TO authenticated;
GRANT ALL ON user_presence TO service_role;

GRANT SELECT ON matches_with_info TO authenticated;

-- 14. VPS Video Storage Tables
CREATE TABLE vps_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vps_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT,
  privacy_level VARCHAR(20) DEFAULT 'public' CHECK (privacy_level IN ('public', 'followers', 'private')),
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  duration INTEGER, -- in seconds
  dimensions JSONB, -- {width: number, height: number}
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vps_video_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES vps_videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

CREATE TABLE vps_video_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES vps_videos(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES vps_video_comments(id) ON DELETE CASCADE,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vps_uploads_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  vps_path TEXT NOT NULL,
  upload_status VARCHAR(20) DEFAULT 'pending' CHECK (upload_status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_vps_videos_user_id ON vps_videos(user_id);
CREATE INDEX idx_vps_videos_created_at ON vps_videos(created_at DESC);
CREATE INDEX idx_vps_videos_privacy ON vps_videos(privacy_level);
CREATE INDEX idx_vps_video_likes_user_video ON vps_video_likes(user_id, video_id);
CREATE INDEX idx_vps_video_comments_video_id ON vps_video_comments(video_id);
CREATE INDEX idx_vps_video_comments_parent_id ON vps_video_comments(parent_comment_id);
CREATE INDEX idx_vps_uploads_log_user_id ON vps_uploads_log(user_id);
CREATE INDEX idx_vps_uploads_log_status ON vps_uploads_log(upload_status);

-- Row Level Security
ALTER TABLE vps_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vps_video_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vps_video_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vps_uploads_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vps_videos
CREATE POLICY "Users can view public videos" ON vps_videos
  FOR SELECT USING (privacy_level = 'public');

CREATE POLICY "Users can view their own videos" ON vps_videos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view videos of people they follow" ON vps_videos
  FOR SELECT USING (
    privacy_level = 'followers' AND 
    user_id IN (
      SELECT followed_id FROM social_follows WHERE follower_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own videos" ON vps_videos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own videos" ON vps_videos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own videos" ON vps_videos
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for vps_video_likes
CREATE POLICY "Users can view all likes" ON vps_video_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own likes" ON vps_video_likes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for vps_video_comments
CREATE POLICY "Users can view comments on accessible videos" ON vps_video_comments
  FOR SELECT USING (
    video_id IN (
      SELECT id FROM vps_videos WHERE 
      privacy_level = 'public' OR 
      user_id = auth.uid() OR
      (privacy_level = 'followers' AND user_id IN (
        SELECT followed_id FROM social_follows WHERE follower_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can insert comments on accessible videos" ON vps_video_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    video_id IN (
      SELECT id FROM vps_videos WHERE 
      privacy_level = 'public' OR 
      user_id = auth.uid() OR
      (privacy_level = 'followers' AND user_id IN (
        SELECT followed_id FROM social_follows WHERE follower_id = auth.uid()
      ))
    )
  );

CREATE POLICY "Users can update their own comments" ON vps_video_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON vps_video_comments
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for vps_uploads_log
CREATE POLICY "Users can view their own upload logs" ON vps_uploads_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all upload logs" ON vps_uploads_log
  FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions for VPS tables
GRANT ALL ON vps_videos TO authenticated;
GRANT ALL ON vps_videos TO service_role;

GRANT ALL ON vps_video_likes TO authenticated;
GRANT ALL ON vps_video_likes TO service_role;

GRANT ALL ON vps_video_comments TO authenticated;
GRANT ALL ON vps_video_comments TO service_role;

GRANT ALL ON vps_uploads_log TO authenticated;
GRANT ALL ON vps_uploads_log TO service_role;