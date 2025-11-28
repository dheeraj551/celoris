-- Find existing admin user and create profile with actual UUID
-- This query finds the admin auth user and creates their profile

-- Find the existing auth user and create admin profile
WITH admin_auth AS (
  SELECT id 
  FROM auth.users 
  WHERE email = 'support@celorisdesigns.com'
)
INSERT INTO users (
  id, username, full_name, bio, instagram_handle,
  profile_pic_url, location, subscription_status,
  verification_status, created_at, updated_at
)
SELECT 
  id,
  'admin', 
  'Admin User',
  'System Administrator for AI Blog Publishing',
  '', '', '', 'premium', 'verified', NOW(), NOW()
FROM admin_auth
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  subscription_status = EXCLUDED.subscription_status,
  verification_status = EXCLUDED.verification_status,
  updated_at = NOW()
RETURNING id, username, full_name, subscription_status;