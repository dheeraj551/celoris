-- Alternative approach: Create admin user using Supabase Admin API
-- Since direct SQL to auth.users is restricted, we'll create the user profile only
-- The foreign key constraint likely references auth.users(id)

-- Method 1: If the foreign key can be temporarily disabled
-- (Use with caution - only for setup)

-- Method 2: Create user through Supabase Admin API (recommended)
-- This would need to be done via the Supabase Dashboard or Admin API
-- Admin email: support@celorisdesigns.com
-- Admin password: f3yay3qa2!oTFTpa

-- Method 3: Create a minimal user record that satisfies the foreign key
-- This assumes the foreign key references auth.users(id)

-- Let's try a different approach - insert with NULL first to see what happens
-- Or create a temporary user that exists in auth.users

-- For now, let's check what tables exist and their relationships
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth';