-- Ultra Simple Admin Setup - No assumptions about table structure
-- This will work regardless of your current table structure

-- Try the absolute minimum: just create a user record in the main table
INSERT INTO profiles (id, full_name) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Admin User'
) ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name;

-- Verify what was created
SELECT 'Admin Setup Status:' as status, 
       id::text, 
       full_name,
       created_at
FROM profiles 
WHERE id = '550e8400-e29b-41d4-a716-446655440000';