
# Fixed SQL for Job Applications

Please run the following SQL in your Supabase SQL Editor. 
This version fixes the "column user_id does not exist" error by checking the `users` table for admin roles instead of the non-existent `user_roles` table.

```sql
-- Create job_applications table
CREATE TABLE IF NOT EXISTS job_applications (
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

-- Enable RLS
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Policies
-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Users can insert their own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON job_applications;

CREATE POLICY "Users can insert their own applications" ON job_applications
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications" ON job_applications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" ON job_applications
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Grant privileges
GRANT ALL ON job_applications TO service_role;
GRANT ALL ON job_applications TO postgres;
GRANT SELECT, INSERT ON job_applications TO authenticated;
```
