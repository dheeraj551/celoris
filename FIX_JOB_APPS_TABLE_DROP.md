
# Fix: Recreate Job Applications Table

The error occurs because the `job_applications` table likely already exists but is missing the `user_id` column from a previous attempt. 
The script below will **DROP** the existing table and recreate it correctly.

Please run this entire block in your Supabase SQL Editor:

```sql
-- 1. DROP the table explicitly to ensure we start fresh
-- This handles the case where the table exists but has a wrong schema (missing user_id)
DROP TABLE IF EXISTS job_applications CASCADE;

-- 2. Create job_applications table with all required columns
CREATE TABLE job_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  user_phone text NOT NULL,
  message text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Users can insert their own applications
CREATE POLICY "Users can insert their own applications" ON job_applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can view their own applications
CREATE POLICY "Users can view their own applications" ON job_applications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON job_applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 5. Grant privileges
GRANT ALL ON job_applications TO service_role;
GRANT ALL ON job_applications TO postgres;
GRANT SELECT, INSERT ON job_applications TO authenticated;
```
