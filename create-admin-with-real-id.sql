-- Create admin user profile with the ACTUAL auth user ID
-- Replace 'YOUR_ACTUAL_USER_ID_HERE' with the UUID from Supabase Dashboard

INSERT INTO users (
  id, username, full_name, bio, instagram_handle,
  profile_pic_url, location, subscription_status,
  verification_status, created_at, updated_at
) VALUES (
  'YOUR_ACTUAL_USER_ID_HERE',  -- Replace with the actual UUID from Dashboard
  'admin', 
  'Admin User',
  'System Administrator for AI Blog Publishing',
  '', '', '', 'premium', 'verified', NOW(), NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  subscription_status = EXCLUDED.subscription_status,
  verification_status = EXCLUDED.verification_status,
  updated_at = NOW()
RETURNING id, username, full_name, subscription_status;