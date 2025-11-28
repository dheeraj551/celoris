-- Admin User Setup - Based on Your Actual Database Schema
-- Create admin user in the users table with your correct column structure

-- Insert admin user into users table
INSERT INTO users (
  id,
  username,
  full_name,
  bio,
  instagram_handle,
  profile_pic_url,
  location,
  subscription_status,
  verification_status,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin',
  'Admin User',
  'System Administrator for AI Blog Publishing',
  '',
  '',
  '',
  'premium',
  'verified',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  bio = EXCLUDED.bio,
  updated_at = NOW()
RETURNING id, username, full_name, subscription_status;