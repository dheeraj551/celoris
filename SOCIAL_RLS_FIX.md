# Social Features RLS Fix

Please run the following SQL commands in your Supabase SQL Editor to fix the social discovery and matching issues.

**Note:** The column name for the target user in the `swipes` table is `target_user_id`.

```sql
-- Enable RLS on relevant tables if not already enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Users Table Policies
-- Allow everyone to view basic user profiles (needed for discovery)
DROP POLICY IF EXISTS "Users are viewable by everyone" ON users;
CREATE POLICY "Users are viewable by everyone" 
ON users FOR SELECT 
USING (true);

-- Swipes Table Policies
-- Allow users to insert their own swipes
DROP POLICY IF EXISTS "Users can insert their own swipes" ON swipes;
CREATE POLICY "Users can insert their own swipes" 
ON swipes FOR INSERT 
WITH CHECK (auth.uid() = swiper_id);

-- Allow users to view swipes where they are the swiper (to see who they liked)
DROP POLICY IF EXISTS "Users can view their own swipes" ON swipes;
CREATE POLICY "Users can view their own swipes" 
ON swipes FOR SELECT 
USING (auth.uid() = swiper_id);

-- Allow users to view swipes where they are the target_user_id (to see incoming requests)
DROP POLICY IF EXISTS "Users can view incoming swipes" ON swipes;
CREATE POLICY "Users can view incoming swipes" 
ON swipes FOR SELECT 
USING (auth.uid() = target_user_id);

-- Matches Table Policies
-- Allow users to view matches they are part of
DROP POLICY IF EXISTS "Users can view their own matches" ON matches;
CREATE POLICY "Users can view their own matches" 
ON matches FOR SELECT 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Allow users to insert matches (triggered by client-side logic currently, though server-side is better)
DROP POLICY IF EXISTS "Users can insert matches" ON matches;
CREATE POLICY "Users can insert matches" 
ON matches FOR INSERT 
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Grant permissions to authenticated users
GRANT SELECT ON users TO authenticated;
GRANT ALL ON swipes TO authenticated;
GRANT ALL ON matches TO authenticated;
```
