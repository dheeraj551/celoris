# Fix Chat and Presence RLS Policies

The error `new row violates row-level security policy for table "user_presence"` indicates that sending a message triggers an update to the `user_presence` table (likely via a database trigger), but the `user_presence` table doesn't have the correct RLS policies to allow this.

Please run the following SQL in your Supabase SQL Editor to fix all social RLS issues (Chat, Matches, and Presence):

```sql
-- 1. Fix user_presence RLS
ALTER TABLE user_presence ENABLE ROW LEVEL SECURITY;

-- Allow users to insert/update their own presence
DROP POLICY IF EXISTS "Users can manage their own presence" ON user_presence;
CREATE POLICY "Users can manage their own presence"
ON user_presence
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow everyone to view presence (to see who is online)
DROP POLICY IF EXISTS "Users can view presence" ON user_presence;
CREATE POLICY "Users can view presence"
ON user_presence FOR SELECT
USING (true);

-- 2. Fix messages RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow users to view messages for matches they belong to
DROP POLICY IF EXISTS "Users can view messages in their matches" ON messages;
CREATE POLICY "Users can view messages in their matches"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Allow users to insert messages into matches they belong to
DROP POLICY IF EXISTS "Users can insert messages in their matches" ON messages;
CREATE POLICY "Users can insert messages in their matches"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Allow users to update messages in their matches (e.g. for read receipts)
DROP POLICY IF EXISTS "Users can update messages in their matches" ON messages;
CREATE POLICY "Users can update messages in their matches"
ON messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- 3. Fix matches RLS (Update)
-- Allow users to update matches they belong to (for last_message_at)
DROP POLICY IF EXISTS "Users can update their matches" ON matches;
CREATE POLICY "Users can update their matches"
ON matches FOR UPDATE
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- 4. Grant permissions
GRANT ALL ON user_presence TO authenticated;
GRANT ALL ON messages TO authenticated;
GRANT ALL ON matches TO authenticated;
```

## Verification
After running this SQL, try sending a message again. The error about `user_presence` should be resolved.
