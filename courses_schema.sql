-- ===========================================
-- COURSE MANAGEMENT SYSTEM
-- ===========================================

-- Drop existing objects if they exist (for clean re-execution)
-- Using CASCADE to automatically handle dependent objects (policies, triggers, etc.)

DROP TABLE IF EXISTS public.topic_progress CASCADE;
DROP TABLE IF EXISTS public.course_enrollments CASCADE;
DROP TABLE IF EXISTS public.course_topics CASCADE;
DROP TABLE IF EXISTS public.course_modules CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;

-- Note: We're not dropping update_updated_at_column() as it's used by other tables
-- We'll use CREATE OR REPLACE FUNCTION instead
DROP FUNCTION IF EXISTS get_complete_course(UUID);

-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    grade_level VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    instructor_name VARCHAR(255),
    instructor_bio TEXT,
    course_duration VARCHAR(100),
    price DECIMAL(10,2) DEFAULT 0.00,
    course_image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create modules table
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    module_number INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    estimated_duration INTEGER, -- in minutes
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, module_number)
);

-- Create topics table
CREATE TABLE IF NOT EXISTS public.course_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    module_id UUID NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
    order_in_module INTEGER NOT NULL,
    title VARCHAR(500) NOT NULL,
    short_description TEXT NOT NULL,
    full_content TEXT,
    content_type VARCHAR(50) DEFAULT 'text', -- text, video, quiz, assignment
    estimated_duration INTEGER, -- in minutes
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'content_generated', 'published', 'archived')),
    is_free_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(module_id, order_in_module)
);

-- Create course enrollments table
CREATE TABLE IF NOT EXISTS public.course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_date TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'paused', 'dropped')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create topic progress tracking
CREATE TABLE IF NOT EXISTS public.topic_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    enrollment_id UUID NOT NULL REFERENCES public.course_enrollments(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.course_topics(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started' CHECK (status IN ('not_started', 'started', 'completed', 'skipped')),
    time_spent INTEGER DEFAULT 0, -- in seconds
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(enrollment_id, topic_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published, is_featured);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON public.courses(subject);
CREATE INDEX IF NOT EXISTS idx_modules_course ON public.course_modules(course_id, module_number);
CREATE INDEX IF NOT EXISTS idx_topics_module ON public.course_topics(module_id, order_in_module);
CREATE INDEX IF NOT EXISTS idx_topics_status ON public.course_topics(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_enrollment ON public.topic_progress(enrollment_id);

-- Enable Row Level Security
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public access (published courses)
CREATE POLICY "Public can view published courses" ON public.courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published modules" ON public.course_modules
    FOR SELECT USING (
        is_published = true AND 
        EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_modules.course_id AND c.is_published = true)
    );

CREATE POLICY "Public can view published topics" ON public.course_topics
    FOR SELECT USING (
        status = 'published' AND 
        EXISTS (
            SELECT 1 FROM public.course_modules cm 
            JOIN public.courses c ON c.id = cm.course_id 
            WHERE cm.id = course_topics.module_id 
            AND cm.is_published = true AND c.is_published = true
        )
    );

-- RLS Policies for admin users (for managing courses)
CREATE POLICY "Admin users can manage courses" ON public.courses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('support@celorisdesigns.com')
        )
    );

CREATE POLICY "Admin users can manage modules" ON public.course_modules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('support@celorisdesigns.com')
        )
    );

CREATE POLICY "Admin users can manage topics" ON public.course_topics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('support@celorisdesigns.com')
        )
    );

CREATE POLICY "Admin users can manage enrollments" ON public.course_enrollments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('support@celorisdesigns.com')
        )
    );

CREATE POLICY "Admin users can manage topic progress" ON public.topic_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('support@celorisdesigns.com')
        )
    );

-- RLS Policies for authenticated users (for their own enrollments and progress)
CREATE POLICY "Users can view own enrollments" ON public.course_enrollments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own enrollments" ON public.course_enrollments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can view own progress" ON public.topic_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.course_enrollments ce 
            WHERE ce.id = topic_progress.enrollment_id 
            AND ce.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own progress" ON public.topic_progress
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.course_enrollments ce 
            WHERE ce.id = topic_progress.enrollment_id 
            AND ce.user_id = auth.uid()
        )
    );

-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update triggers for updated_at
CREATE TRIGGER update_courses_updated_at 
    BEFORE UPDATE ON public.courses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at 
    BEFORE UPDATE ON public.course_modules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_topics_updated_at 
    BEFORE UPDATE ON public.course_topics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at 
    BEFORE UPDATE ON public.course_enrollments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_progress_updated_at 
    BEFORE UPDATE ON public.topic_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Helper function to get course with modules and topics
CREATE OR REPLACE FUNCTION get_complete_course(course_uuid UUID)
RETURNS TABLE (
    course_id UUID,
    course_title VARCHAR(500),
    course_subject VARCHAR(255),
    course_grade_level VARCHAR(100),
    course_description TEXT,
    course_target_audience TEXT,
    course_instructor_name VARCHAR(255),
    course_price DECIMAL(10,2),
    course_image_url TEXT,
    module_id UUID,
    module_number INTEGER,
    module_title VARCHAR(500),
    module_description TEXT,
    topic_id UUID,
    topic_order INTEGER,
    topic_title VARCHAR(500),
    topic_short_description TEXT,
    topic_full_content TEXT,
    topic_status VARCHAR(50),
    topic_estimated_duration INTEGER
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT 
        c.id as course_id,
        c.title as course_title,
        c.subject as course_subject,
        c.grade_level as course_grade_level,
        c.description as course_description,
        c.target_audience as course_target_audience,
        c.instructor_name as course_instructor_name,
        c.price as course_price,
        c.course_image_url as course_image_url,
        cm.id as module_id,
        cm.module_number,
        cm.title as module_title,
        cm.description as module_description,
        ct.id as topic_id,
        ct.order_in_module as topic_order,
        ct.title as topic_title,
        ct.short_description as topic_short_description,
        ct.full_content as topic_full_content,
        ct.status as topic_status,
        ct.estimated_duration as topic_estimated_duration
    FROM public.courses c
    LEFT JOIN public.course_modules cm ON cm.course_id = c.id
    LEFT JOIN public.course_topics ct ON ct.module_id = cm.id
    WHERE c.id = course_uuid
    AND c.is_published = true
    ORDER BY cm.module_number, ct.order_in_module;
$$;

-- Sample course data
INSERT INTO public.courses (
    title,
    subject,
    grade_level,
    description,
    target_audience,
    instructor_name,
    course_duration,
    price,
    is_published,
    is_featured
) VALUES 
(
    'Mastering Class 12th CBSE Mathematics: A Comprehensive Guide',
    'Mathematics',
    'Class 12th CBSE',
    'A comprehensive guide to mastering Class 12th CBSE Mathematics. This course is designed to help students excel in their board examinations and build a strong foundation for higher studies. The course follows the NCERT syllabus and is organized into digestible modules with clear explanations, examples, and practice opportunities.',
    'Class 12th CBSE students, Board exam preparers, Students looking to strengthen their high school mathematics foundation',
    'Dr. Sarah Johnson',
    '6 months',
    2999.00,
    true,
    true
);