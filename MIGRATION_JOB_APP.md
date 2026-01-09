
-- Create a bucket for job documents if it doesn't exist (can reuse trainer-documents or create a new one 'user-documents')
insert into storage.buckets (id, name, public)
values ('job-documents', 'job-documents', false)
on conflict (id) do nothing;

-- Policies for storage
drop policy if exists "Authenticated users can upload job docs" on storage.objects;
create policy "Authenticated users can upload job docs"
  on storage.objects for insert
  with check ( bucket_id = 'job-documents' and auth.uid() = owner );

drop policy if exists "Users read own job docs" on storage.objects;
create policy "Users read own job docs"
  on storage.objects for select
  using ( bucket_id = 'job-documents' and (auth.uid() = owner or exists (select 1 from public.users where id = auth.uid() and role = 'admin')) );

-- Create job_applications table
drop table if exists public.job_applications cascade;

create table public.job_applications (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    user_id uuid not null references auth.users(id),
    job_id text, -- ID from the frontend static list or dynamic DB if implemented
    
    application_ref_id text, -- #JOB-XXXX format
    
    -- 1. Personal Details
    full_name text not null,
    date_of_birth date,
    gender text,
    mobile_number text,
    email text,
    current_city text,
    current_address text, -- City, State, Country
    
    -- 2. Job Application Details
    job_title text,
    department text, -- IT, Marketing, etc.
    employment_type_preferred text, -- Full-time, etc.
    work_mode_preference text, -- Remote, On-site
    
    -- 3. Professional Summary
    professional_summary text,
    
    -- 4. Education Details (JSONB)
    -- Structure: { tenth: {...}, twelfth: {...}, graduation: {...}, post_graduation: {...} }
    education_details jsonb, 
    
    -- 5. Skills & Expertise
    primary_skills text, -- Comma separated
    secondary_skills text,
    tools_known text,
    skill_level text, -- Beginner, Expert, etc.
    
    -- 6. Work Experience
    total_experience text,
    last_job_company text,
    last_job_role text,
    last_job_duration text,
    last_job_responsibilities text,
    
    -- Status
    status text default 'pending', -- pending, reviewed, shortlisted, rejected
    
    primary key (id)
);

-- RLS
alter table public.job_applications enable row level security;

create policy "Users can insert their own job apps"
    on public.job_applications for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own job apps"
    on public.job_applications for select
    using (auth.uid() = user_id);

create policy "Admins can view all job apps"
    on public.job_applications for select
    using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
