# Fix Swipes Table Policies

Since no swipes are being saved, it's likely the RLS policies on the `swipes` table are blocking inserts. Let's reset them.

Please run this SQL in your Supabase SQL Editor:

```sql
-- 1. Drop ALL existing policies on the swipes table
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'swipes' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON swipes', pol.policyname); 
    END LOOP; 
END $$;

-- 2. Enable RLS
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

-- 3. Allow users to insert their own swipes
CREATE POLICY "Users can insert own swipes" 
ON swipes FOR INSERT 
WITH CHECK (auth.uid() = swiper_id);

-- 4. Allow users to view swipes they made
CREATE POLICY "Users can view own swipes" 
ON swipes FOR SELECT 
USING (auth.uid() = swiper_id);

-- 5. Allow users to view swipes sent TO them (incoming requests)
CREATE POLICY "Users can view incoming swipes" 
ON swipes FOR SELECT 
USING (auth.uid() = target_user_id);

-- 6. Grant permissions
GRANT ALL ON swipes TO authenticated;

-- 7. Verify policies
SELECT policyname, cmd, roles, qual, with_check FROM pg_policies WHERE tablename = 'swipes';
```
