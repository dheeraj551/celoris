-- Alternative: Create user via SQL with minimal data
-- This bypasses the auth system temporarily

-- Step 1: Create minimal user record directly in users table
-- (This is temporary - you should still use Supabase Auth for real users)

INSERT INTO users (
  id, username, full_name, bio, subscription_status,
  verification_status, created_at, updated_at
) VALUES (
  gen_random_uuid(), -- Use PostgreSQL UUID generator
  'admin', 
  'Admin User',
  'System Administrator for AI Blog Publishing',
  'premium',
  'verified', 
  NOW(), 
  NOW()
) ON CONFLICT (username) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  subscription_status = EXCLUDED.subscription_status,
  verification_status = EXCLUDED.verification_status,
  updated_at = NOW()
RETURNING id, username, full_name;