# Social Block Feature Setup

To enable the functionality to block users from social features, please run the following SQL command in your Supabase SQL Editor:

```sql
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS is_social_blocked BOOLEAN DEFAULT FALSE;
```

This adds a flag to users that the system checks before displaying them in social sections.
