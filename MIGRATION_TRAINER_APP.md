-- 1. Storage Bucket Setup
insert into storage.buckets (id, name, public)
values ('trainer-documents', 'trainer-documents', false)
on conflict (id) do nothing;

-- Drop existing policies to avoid conflicts
drop policy if exists "Authenticated users can upload documents" on storage.objects;
drop policy if exists "Users can read own documents, Admins read all" on storage.objects;

-- Policy to allow authenticated users to upload their own documents
create policy "Authenticated users can upload documents"
  on storage.objects for insert
  with check ( bucket_id = 'trainer-documents' and auth.uid() = owner );

-- Policy to allow users to read their own documents and admins to read all
create policy "Users can read own documents, Admins read all"
  on storage.objects for select
  using ( bucket_id = 'trainer-documents' and (auth.uid() = owner or exists (select 1 from public.users where id = auth.uid() and role = 'admin')) );

-- 2. Trainer Applications Table
-- Drop table if exists to ensure we apply the latest schema changes (e.g. removed 'full_address')
drop table if exists public.trainer_applications cascade;
create table public.trainer_applications (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    user_id uuid not null references auth.users(id),
    notice_id uuid references public.notice_board(id), -- Optional link to a specific job
    
    application_ref_id text, -- Randomly generated ID (e.g. #APP-1234)
    
    -- 1. Personal Information
    full_name text not null,
    gender text,
    date_of_birth date,
    mobile_number text,
    alternate_contact_number text,
    email text,
    current_city text,
    -- Removed full_address
    
    -- 2. Identity & Verification (Optional now)
    verification_later boolean default false,
    gov_id_type text,
    gov_id_number text,
    id_proof_front_url text, -- Path in storage
    id_proof_back_url text, -- Path in storage
    profile_photo_url text, -- Path in storage
    
    -- 3. Educational Qualification
    education_details jsonb, -- Array of {level, degree, subject, university, year}
    additional_certifications text,
    
    -- 4. Teaching Experience
    total_experience text,
    experience_type text[], -- Array of strings (Home Tuition, Online, etc.)
    previously_taught_at text,
    
    -- 5. Subjects
    subjects_academic text[],
    classes text[],
    subjects_skill text[],
    other_subjects text,
    
    -- 6. Teaching Mode
    teaching_mode text,
    preferred_location text, -- Areas
    online_tools_known text[],
    
    -- 7. Availability
    days_available text[],
    time_slots text[],
    
    -- 8. Fees
    expected_fees text,
    minimum_fee text,
    free_demo boolean,
    payment_modes text[],
    
    -- 9. Language
    languages text[],
    language_proficiency text,
    
    -- 10. Additional
    why_choose_you text,
    achievements text,
    reference text,
    
    -- 11. Declaration
    declaration_accepted boolean default false,
    
    primary key (id)
);

-- Add RLS policies
alter table public.trainer_applications enable row level security;

create policy "Users can insert their own applications"
    on public.trainer_applications for insert
    with check (auth.uid() = user_id);

create policy "Users can view their own applications"
    on public.trainer_applications for select
    using (auth.uid() = user_id);

create policy "Admins can view all applications"
    on public.trainer_applications for select
    using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
