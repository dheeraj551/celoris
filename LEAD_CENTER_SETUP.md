# 🚨 Universal Fix Script

The error `relation "leads" does not exist` confirms the table is currently missing (it might have been deleted in a previous step).

**Run this SINGLE script block. It handles everything:**
1. Creates the table if it's missing.
2. Adds any missing columns if it already exists (partially).
3. Fixes permissions.

```sql
-- 1. Create Table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  status text DEFAULT 'open',
  source text DEFAULT 'manual'
);

-- 2. Add/Ensure Columns Exist (Idempotent)
-- We run these individually so they don't fail if column already exists
ALTER TABLE leads ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS course text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS mode text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS requirement text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contact_info text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email text;

-- 3. Enable Security & Policies
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop policy to avoid "policy already exists" error, then recreate
DROP POLICY IF EXISTS "Enable all access" ON leads;
CREATE POLICY "Enable all access" ON leads FOR ALL USING (true) WITH CHECK (true);

-- 4. Refresh Schema
NOTIFY pgrst, 'reload schema';
```

**Run this, and then click "Sync Now".**
