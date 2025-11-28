-- Step 2: Complete Admin User Setup - Alternative Approach
-- Since foreign key constraints are complex, let's use the actual Supabase Auth system

-- Approach A: If auth user exists, use that ID
WITH auth_admin AS (
  SELECT id FROM auth.users WHERE email = 'support@celorisdesigns.com'
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
FROM auth_admin
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  subscription_status = EXCLUDED.subscription_status,
  verification_status = EXCLUDED.verification_status,
  updated_at = NOW()
RETURNING id, username, full_name;