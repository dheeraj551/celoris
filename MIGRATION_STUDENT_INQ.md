
-- Create a new table for detailed student inquiries
create table if not exists public.student_inquiries (
    id uuid not null default gen_random_uuid(),
    created_at timestamp with time zone not null default now(),
    user_id uuid references auth.users(id), -- Nullable if not logged in, but better if logged in
    
    inquiry_ref_id text, -- #INQ-XXXX format
    
    -- 1. Student Details
    full_name text not null,
    age_class text,
    gender text,
    parent_name text,
    contact_number text,
    alternate_number text,
    email text,
    
    -- 2. Location Details
    city text,
    area_locality text,
    address text,
    
    -- 3. Learning Requirement
    requirement_type text[], -- Array for Home Tutor, Online Tutor etc
    learning_mode text,
    
    -- 4. Subject / Course Details
    subject_course_needed text,
    class_level text,
    board_exam text,
    
    -- 5. Learning Goals
    primary_goal text,
    specific_topics text,
    
    -- 6. Preferred Tutor
    tutor_preference text,
    experience_preference text,
    language_preference text[], -- Array
    
    -- 7. Schedule
    days_required text[], -- Array
    preferred_time_slot text[], -- Array
    classes_per_week text,
    
    -- 8. Budget
    budget_range text,
    negotiable boolean,
    
    -- 9. Demo Class
    demo_interested boolean,
    demo_mode text,
    
    -- 10. Urgency
    urgency_level text,
    
    -- 11. Notes
    additional_notes text,
    
    status text default 'pending', -- pending, contacted, closed
    
    primary key (id)
);

-- RLS
alter table public.student_inquiries enable row level security;

create policy "Users can insert their own inquiries"
    on public.student_inquiries for insert
    with check (true); -- Allow anyone to insert for now, or auth.uid() = user_id if we force login

create policy "Admins can view all inquiries"
    on public.student_inquiries for select
    using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Users can view own inquiries"
    on public.student_inquiries for select
    using (auth.uid() = user_id);
