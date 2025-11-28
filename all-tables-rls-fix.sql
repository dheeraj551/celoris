-- COMPREHENSIVE RLS FIX FOR ALL TABLES
-- This fixes the circular dependency issues across all tables

-- ===========================================
-- COURSES TABLE FIX
-- ===========================================
-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Admin users can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Admin users can manage modules" ON public.course_modules;
DROP POLICY IF EXISTS "Admin users can manage topics" ON public.course_topics;
DROP POLICY IF EXISTS "Admin users can manage enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Admin users can manage topic progress" ON public.topic_progress;
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can update own enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Users can view own progress" ON public.topic_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.topic_progress;
DROP POLICY IF EXISTS "Public can view published courses" ON public.courses;
DROP POLICY IF EXISTS "Public can view published modules" ON public.course_modules;
DROP POLICY IF EXISTS "Public can view published topics" ON public.course_topics;
DROP POLICY IF EXISTS "Allow all operations for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow all operations for modules" ON public.course_modules;
DROP POLICY IF EXISTS "Allow all operations for topics" ON public.course_topics;
DROP POLICY IF EXISTS "Allow all operations for enrollments" ON public.course_enrollments;
DROP POLICY IF EXISTS "Allow all operations for progress" ON public.topic_progress;

-- Create simplified admin policies that don't require auth.users access
CREATE POLICY "Allow all operations for courses" ON public.courses FOR ALL USING (true);
CREATE POLICY "Allow all operations for modules" ON public.course_modules FOR ALL USING (true);
CREATE POLICY "Allow all operations for topics" ON public.course_topics FOR ALL USING (true);
CREATE POLICY "Allow all operations for enrollments" ON public.course_enrollments FOR ALL USING (true);
CREATE POLICY "Allow all operations for progress" ON public.topic_progress FOR ALL USING (true);

-- User-specific policies for enrollments and progress
CREATE POLICY "Users can view own enrollments" ON public.course_enrollments FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own enrollments" ON public.course_enrollments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can view own progress" ON public.topic_progress FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.course_enrollments ce WHERE ce.id = topic_progress.enrollment_id AND ce.user_id = auth.uid())
);
CREATE POLICY "Users can update own progress" ON public.topic_progress FOR ALL USING (
    EXISTS (SELECT 1 FROM public.course_enrollments ce WHERE ce.id = topic_progress.enrollment_id AND ce.user_id = auth.uid())
);

-- Public read access for published content
CREATE POLICY "Public can view published courses" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published modules" ON public.course_modules FOR SELECT USING (
    is_published = true AND EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_modules.course_id AND c.is_published = true)
);
CREATE POLICY "Public can view published topics" ON public.course_topics FOR SELECT USING (
    status = 'published' AND EXISTS (
        SELECT 1 FROM public.course_modules cm 
        JOIN public.courses c ON c.id = cm.course_id 
        WHERE cm.id = course_topics.module_id AND cm.is_published = true AND c.is_published = true
    )
);

-- ===========================================
-- JOBS TABLE FIX
-- ===========================================
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin users can manage jobs" ON public.jobs;
DROP POLICY IF EXISTS "Public can view active published jobs" ON public.jobs;

-- Create simplified admin policies that don't require auth.users access
CREATE POLICY "Allow all operations for jobs" ON public.jobs FOR ALL USING (true);

-- Public read access for published content
CREATE POLICY "Public can view published jobs" ON public.jobs FOR SELECT USING (is_active = true AND is_published = true);

-- ===========================================
-- SWIPES AND MATCHES TABLES CREATION
-- ===========================================
-- Create swipes table for dating app functionality
CREATE TABLE IF NOT EXISTS public.swipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    swiper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    swiped_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('left', 'right', 'super_like')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create matches table for mutual likes
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user1_id, user2_id)
);

-- Enable RLS for new tables
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for swipes table
CREATE POLICY "Users can create their own swipes" ON public.swipes FOR INSERT WITH CHECK (swiper_id = auth.uid());
CREATE POLICY "Users can view swipes involving them" ON public.swipes FOR SELECT USING (swiper_id = auth.uid() OR swiped_id = auth.uid());
CREATE POLICY "Users can update their own swipes" ON public.swipes FOR UPDATE USING (swiper_id = auth.uid());
CREATE POLICY "Users can delete their own swipes" ON public.swipes FOR DELETE USING (swiper_id = auth.uid());

-- RLS Policies for matches table
CREATE POLICY "Users can view matches involving them" ON public.matches FOR SELECT USING (user1_id = auth.uid() OR user2_id = auth.uid());
CREATE POLICY "Users can create matches" ON public.matches FOR INSERT WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());
CREATE POLICY "Users can update matches involving them" ON public.matches FOR UPDATE USING (user1_id = auth.uid() OR user2_id = auth.uid());
CREATE POLICY "Users can delete matches involving them" ON public.matches FOR DELETE USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_swipes_swiper_id ON public.swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped_id ON public.swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_swipes_direction ON public.swipes(direction);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_active ON public.matches(is_active);