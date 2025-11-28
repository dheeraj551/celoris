-- ===========================================
-- BLOG MANAGEMENT SYSTEM
-- ===========================================

-- Drop existing objects if they exist (for clean re-execution)
DROP TABLE IF EXISTS public.blog_posts CASCADE;

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image_url TEXT,
    author_name VARCHAR(255) DEFAULT 'Admin',
    category VARCHAR(100) DEFAULT 'General',
    tags TEXT[], -- Array of tags
    meta_title VARCHAR(255),
    meta_description TEXT,
    reading_time INTEGER, -- in minutes
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_comments table (for future use)
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    parent_comment_id UUID REFERENCES public.blog_comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status, is_published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON public.blog_posts(is_featured, is_published);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(post_id, is_approved);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public access (published posts only)
CREATE POLICY "Public can view published blog posts" ON public.blog_posts
    FOR SELECT USING (is_published = true AND status = 'published');

CREATE POLICY "Public can view approved comments" ON public.blog_comments
    FOR SELECT USING (is_approved = true);

-- RLS Policies for admin users (for managing blog posts)
CREATE POLICY "Admin users can manage blog posts" ON public.blog_posts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('support@celorisdesigns.com')
        )
    );

CREATE POLICY "Admin users can manage blog comments" ON public.blog_comments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('support@celorisdesigns.com')
        )
    );

-- Update triggers for updated_at
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON public.blog_posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_comments_updated_at 
    BEFORE UPDATE ON public.blog_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically generate slug from title
CREATE OR REPLACE FUNCTION generate_blog_slug(title_text TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(
        TRIM(
            BOTH '-' FROM 
            REGEXP_REPLACE(
                REGEXP_REPLACE(title_text, '[^a-zA-Z0-9\s-]', '', 'g'),
                '[\s-]+', '-', 'g'
            )
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to calculate reading time (average 200 words per minute)
CREATE OR REPLACE FUNCTION calculate_reading_time(content_text TEXT)
RETURNS INTEGER AS $$
DECLARE
    word_count INTEGER;
BEGIN
    word_count := array_length(string_to_array(trim(content_text), ' '), 1);
    IF word_count IS NULL THEN
        RETURN 1;
    END IF;
    RETURN GREATEST(1, CEIL(word_count::FLOAT / 200));
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate slug before insert/update
CREATE OR REPLACE FUNCTION set_blog_slug_and_reading_time()
RETURNS TRIGGER AS $$
BEGIN
    -- Generate slug if not provided or title changed
    IF NEW.slug IS NULL OR (TG_OP = 'UPDATE' AND OLD.title != NEW.title) THEN
        NEW.slug := generate_blog_slug(NEW.title);
        
        -- Ensure unique slug
        WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = NEW.slug AND id != NEW.id) LOOP
            NEW.slug := NEW.slug || '-' || EXTRACT(epoch FROM NOW())::TEXT;
        END LOOP;
    END IF;
    
    -- Calculate reading time
    NEW.reading_time := calculate_reading_time(NEW.content);
    
    -- Set published_at when first published (only for UPDATE)
    IF TG_OP = 'UPDATE' THEN
        IF OLD.is_published = false AND NEW.is_published = true AND NEW.published_at IS NULL THEN
            NEW.published_at := NOW();
        END IF;
        
        -- Auto-set status based on publish status
        IF NEW.is_published = true THEN
            NEW.status := 'published';
        ELSIF NEW.status = 'published' AND NEW.is_published = false THEN
            NEW.status := 'draft';
        END IF;
    ELSE
        -- For INSERT, set published_at if being published immediately
        IF NEW.is_published = true AND NEW.published_at IS NULL THEN
            NEW.published_at := NOW();
        END IF;
        
        -- For INSERT, auto-set status based on publish status
        IF NEW.is_published = true THEN
            NEW.status := 'published';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blog posts
DROP TRIGGER IF EXISTS blog_posts_slug_trigger ON public.blog_posts;
CREATE TRIGGER blog_posts_slug_trigger
    BEFORE INSERT OR UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION set_blog_slug_and_reading_time();

-- Sample blog posts
INSERT INTO public.blog_posts (
    title,
    excerpt,
    content,
    author_name,
    category,
    tags,
    meta_title,
    meta_description,
    is_published,
    is_featured,
    status
) VALUES 
(
    'Welcome to Our Platform: A Complete Guide',
    'Discover the power of our comprehensive platform designed to streamline your workflow and boost productivity.',
    '# Welcome to Our Platform

We''re excited to introduce you to our comprehensive platform designed to streamline your workflow and boost productivity. This guide will walk you through the key features and benefits.

## Getting Started

Our platform offers:

- **Intuitive Interface**: Easy to navigate and understand
- **Comprehensive Tools**: Everything you need in one place
- **Secure Environment**: Your data is always protected
- **24/7 Support**: We''re here when you need us

## Key Features

### Dashboard Overview
The main dashboard provides a real-time view of your activities, notifications, and quick access to important functions.

### Content Management
Create, edit, and publish content with our powerful editing tools. Support for rich text, images, and media integration.

### Analytics & Insights
Track your performance with detailed analytics and actionable insights.

## Getting Help

If you have questions or need assistance, don''t hesitate to reach out to our support team.

Thank you for choosing our platform!',
    'MiniMax Agent',
    'Platform',
    ARRAY['welcome', 'guide', 'getting-started'],
    'Welcome to Our Platform: A Complete Guide | Celoris Designs',
    'Discover the power of our comprehensive platform designed to streamline your workflow and boost productivity.',
    true,
    true,
    'published'
),
(
    'Top 10 Tips for Maximizing Your Productivity',
    'Proven strategies and techniques to help you work smarter, not harder, and achieve more in less time.',
    '# Top 10 Tips for Maximizing Your Productivity

Productivity isn''t just about working harder—it''s about working smarter. Here are our top 10 proven strategies to help you maximize your output and achieve better results.

## 1. Start with a Clear Plan

Before diving into work, take time to plan your day. Use to-do lists, prioritization techniques, and time-blocking to structure your workflow.

## 2. Eliminate Distractions

Create a focused work environment by:
- Turning off non-essential notifications
- Using website blockers during focus time
- Organizing your workspace

## 3. Use the Pomodoro Technique

Work in focused 25-minute intervals followed by 5-minute breaks. This helps maintain concentration and prevents burnout.

## 4. Batch Similar Tasks

Group similar tasks together to reduce context switching and improve efficiency.

## 5. Automate Repetitive Processes

Identify tasks that can be automated and implement tools or scripts to handle them automatically.

## 6. Take Regular Breaks

Your brain needs rest to function optimally. Schedule breaks throughout your day to recharge.

## 7. Prioritize High-Value Activities

Focus on tasks that have the greatest impact on your goals.

## 8. Use Technology Wisely

Leverage productivity tools and apps to streamline your workflow.

## 9. Maintain Work-Life Balance

Overworking leads to decreased productivity. Set clear boundaries between work and personal time.

## 10. Review and Reflect

Regularly assess your productivity strategies and adjust them based on what works best for you.

Remember, productivity is personal. Experiment with these tips to find what works best for your unique situation.',
    'MiniMax Agent',
    'Productivity',
    ARRAY['productivity', 'tips', 'workflow', 'efficiency'],
    'Top 10 Tips for Maximizing Your Productivity | Celoris Designs',
    'Proven strategies and techniques to help you work smarter, not harder, and achieve more in less time.',
    true,
    false,
    'published'
);