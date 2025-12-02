# Enable Realtime for Messages

The chat messages are not updating in real-time because the `messages` table is not added to the Supabase Realtime publication.

Please run the following SQL in your Supabase SQL Editor to enable real-time updates:

```sql
-- Add tables to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE matches;
ALTER PUBLICATION supabase_realtime ADD TABLE user_presence;
```

## Verification
After running this SQL, the chat should update instantly without needing a page refresh.
