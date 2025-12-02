# Fix Infinite Recursion in Users Table

The error "infinite recursion detected" means there is a bad RLS policy on your `users` table. We need to remove **all** existing policies on the `users` table and replace them with clean, simple ones.

Please run this entire SQL block in your Supabase SQL Editor:

```sql
-- 1. Drop ALL existing policies on the users table to clear the recursion
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON users', pol.policyname); 
    END LOOP; 
END $$;

-- 2. Re-enable RLS (just in case)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Create a clean "Public Read" policy
-- This allows ANYONE (logged in or not) to see user profiles.
-- This is essential for the discovery page to work.
CREATE POLICY "Public profiles" 
ON users FOR SELECT 
USING (true);

-- 4. Create "Update Own Profile" policy
-- This allows users to update ONLY their own profile.
CREATE POLICY "Users can update own profile" 
ON users FOR UPDATE 
USING (auth.uid() = id);

-- 5. Grant permissions
GRANT SELECT ON users TO anon, authenticated;
GRANT UPDATE ON users TO authenticated;

-- 6. Verify policies
SELECT policyname, cmd, roles, qual FROM pg_policies WHERE tablename = 'users';
```
