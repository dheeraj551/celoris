```sql
-- Add missing columns to jobs table if they don't exist

-- Company Branding
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_icon text DEFAULT 'Building';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_description text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_website text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS company_size text;

-- Job Details
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS remote_policy text DEFAULT 'hybrid';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS visa_sponsorship boolean DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS years_required integer;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS education_required text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS language_requirements text[];
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS travel_required boolean DEFAULT false;

-- Team & Structure
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS seniority text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS reporting_to text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS team_size integer;

-- Hiring Process
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hiring_manager_name text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hiring_manager_email text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hiring_manager_phone text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS external_job_id text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS interview_process text;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS onboarding_timeline text;

-- Status & Budget
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS urgency_level text DEFAULT 'normal';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS budget_range_min integer;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS budget_range_max integer;

-- Ensure RLS is enabled
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users (adjust policies as needed)
-- Drop existing policies to avoid conflicts if you want to reset them
-- DROP POLICY IF EXISTS "Public read access" ON jobs;
-- DROP POLICY IF EXISTS "Admin insert access" ON jobs;
-- DROP POLICY IF EXISTS "Admin update access" ON jobs;
-- DROP POLICY IF EXISTS "Admin delete access" ON jobs;

CREATE POLICY "Public read access" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "Admin insert access" ON jobs
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admin update access" ON jobs
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY "Admin delete access" ON jobs
  FOR DELETE TO authenticated
  USING (true);
```
