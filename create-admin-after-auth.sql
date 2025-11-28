-- Create admin profile after auth user is created
-- This uses the actual UUID from the newly created auth user

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
RETURNING id, username, full_name;