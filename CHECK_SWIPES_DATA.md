# Check Swipes Data

Please run this SQL to see if the "Friend Request" (swipe) was actually saved in the database.

```sql
-- Check all swipes where the current user is the TARGET
-- Replace 'YOUR_USER_ID_HERE' with your actual User ID if testing manually, 
-- but running this as-is will show all swipes, which is fine for debugging.
SELECT * FROM swipes;

-- Check specifically for right swipes (likes/requests)
SELECT * FROM swipes WHERE direction = 'right';
```
