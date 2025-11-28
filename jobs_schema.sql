-- ===========================================
-- JOBS MANAGEMENT SYSTEM
-- ===========================================

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_logo_url TEXT,
    location VARCHAR(255) NOT NULL,
    is_remote BOOLEAN DEFAULT false,
    employment_type VARCHAR(50) DEFAULT 'full-time' CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'freelance', 'internship')),
    experience_level VARCHAR(50) DEFAULT 'mid-level' CHECK (experience_level IN ('entry-level', 'mid-level', 'senior', 'executive')),
    salary_min INTEGER,
    salary_max INTEGER,
    salary_currency VARCHAR(10) DEFAULT 'USD',
    salary_period VARCHAR(20) DEFAULT 'year' CHECK (salary_period IN ('year', 'month', 'week', 'hour')),
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT ARRAY[]::TEXT[],
    skills TEXT[] DEFAULT ARRAY[]::TEXT[],
    responsibilities TEXT[] DEFAULT ARRAY[]::TEXT[],
    benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
    application_deadline DATE,
    contact_email VARCHAR(255),
    application_url TEXT,
    application_instructions TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    category VARCHAR(100),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    remote_policy VARCHAR(50) DEFAULT 'hybrid' CHECK (remote_policy IN ('remote-only', 'hybrid', 'office-only')),
    visa_sponsorship BOOLEAN DEFAULT false,
    years_required INTEGER,
    education_required VARCHAR(100),
    language_requirements TEXT[],
    travel_required BOOLEAN DEFAULT false,
    department VARCHAR(100),
    seniority VARCHAR(100),
    reporting_to VARCHAR(255),
    team_size INTEGER,
    job_posting_source VARCHAR(100) DEFAULT 'internal',
    meta_title VARCHAR(255),
    meta_description TEXT,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    application_instructions_detailed TEXT,
    hiring_manager_name VARCHAR(255),
    hiring_manager_email VARCHAR(255),
    hiring_manager_phone VARCHAR(50),
    external_job_id VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'closed', 'expired', 'cancelled')),
    urgency_level VARCHAR(20) DEFAULT 'normal' CHECK (urgency_level IN ('low', 'normal', 'high', 'urgent')),
    budget_range_min INTEGER,
    budget_range_max INTEGER,
    interview_process JSONB,
    onboarding_timeline VARCHAR(100),
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON public.jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_published ON public.jobs(is_published);
CREATE INDEX IF NOT EXISTS idx_jobs_featured ON public.jobs(is_featured);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON public.jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_remote ON public.jobs(is_remote);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_industry ON public.jobs(industry);
CREATE INDEX IF NOT EXISTS idx_jobs_company_name ON public.jobs(company_name);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON public.jobs(application_deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_published_at ON public.jobs(published_at DESC);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_jobs_active_published ON public.jobs(is_active, is_published);
CREATE INDEX IF NOT EXISTS idx_jobs_type_location ON public.jobs(employment_type, location);
CREATE INDEX IF NOT EXISTS idx_jobs_company_type ON public.jobs(company_name, employment_type);

-- Enable Row Level Security
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (for displaying active jobs)
DROP POLICY IF EXISTS "Public can view active published jobs" ON public.jobs;
CREATE POLICY "Public can view active published jobs" ON public.jobs
    FOR SELECT USING (is_active = true AND is_published = true);

-- Create RLS policies for admin users (for managing jobs)
DROP POLICY IF EXISTS "Admin users can manage jobs" ON public.jobs;
CREATE POLICY "Admin users can manage jobs" ON public.jobs
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'support@celorisdesigns.com'
        )
    );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_jobs_updated_at ON public.jobs;
CREATE TRIGGER update_jobs_updated_at 
    BEFORE UPDATE ON public.jobs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate job slug
CREATE OR REPLACE FUNCTION generate_job_slug(title TEXT, company TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN LOWER(TRIM(BOTH '-' FROM REGEXP_REPLACE(REGEXP_REPLACE(title || '-' || company, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')));
END;
$$ LANGUAGE plpgsql;

-- Add slug column if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'jobs' AND column_name = 'slug') THEN
        ALTER TABLE public.jobs ADD COLUMN slug VARCHAR(255) UNIQUE;
        
        -- Create index for slug
        CREATE INDEX idx_jobs_slug ON public.jobs(slug);
    END IF;
END $$;

-- Function to update slug on insert/update
CREATE OR REPLACE FUNCTION update_job_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.title != OLD.title OR NEW.company_name != OLD.company_name OR NEW.slug IS NULL THEN
        NEW.slug = generate_job_slug(NEW.title, NEW.company_name);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for slug generation
DROP TRIGGER IF EXISTS update_jobs_slug_trigger ON public.jobs;
CREATE TRIGGER update_jobs_slug_trigger 
    BEFORE INSERT OR UPDATE ON public.jobs 
    FOR EACH ROW EXECUTE FUNCTION update_job_slug();

-- Function to set published_at when job becomes published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_published = true AND (OLD.is_published IS DISTINCT FROM NEW.is_published OR NEW.published_at IS NULL) THEN
        NEW.published_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for published_at
DROP TRIGGER IF EXISTS set_jobs_published_at ON public.jobs;
CREATE TRIGGER set_jobs_published_at 
    BEFORE UPDATE ON public.jobs 
    FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- Insert sample jobs for testing
INSERT INTO public.jobs (title, company_name, location, is_remote, employment_type, experience_level, salary_min, salary_max, salary_currency, description, requirements, skills, category, industry, is_featured, is_active, is_published) VALUES
('Senior Frontend Developer', 'TechCorp Solutions', 'San Francisco, CA', true, 'full-time', 'senior', 120000, 150000, 'USD', 'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building user-facing features and collaborating with designers and backend developers to deliver exceptional user experiences.', ARRAY['5+ years React experience', 'TypeScript proficiency', 'Experience with modern CSS frameworks', 'Strong portfolio of shipped projects'], ARRAY['React', 'TypeScript', 'Next.js', 'CSS', 'JavaScript', 'HTML', 'Redux', 'Git'], 'Technology', 'Software Development', true, true, true),

('UX/UI Designer', 'DesignStudio Inc', 'New York, NY', false, 'full-time', 'mid-level', 80000, 100000, 'USD', 'Join our creative team to design intuitive and beautiful user experiences for web and mobile applications. Work closely with product managers and developers to bring designs to life.', ARRAY['3+ years UI/UX design experience', 'Proficiency in Figma and Adobe Creative Suite', 'Strong portfolio demonstrating design thinking process', 'Experience with user research and testing'], ARRAY['Figma', 'UI Design', 'UX Research', 'Prototyping', 'User Testing', 'Adobe Creative Suite', 'Sketch', 'InVision'], 'Design', 'Technology', false, true, true),

('Data Scientist', 'DataFlow Analytics', 'Austin, TX', true, 'full-time', 'senior', 110000, 140000, 'USD', 'Analyze complex datasets to extract insights and build predictive models that drive business decisions. Work with cross-functional teams to identify opportunities for data-driven solutions.', ARRAY['Python/R expertise', 'Machine learning experience', 'Statistics and mathematics background', 'Experience with SQL and database management'], ARRAY['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow', 'Pandas', 'NumPy', 'Scikit-learn'], 'Data Science', 'Analytics', false, true, true),

('Freelance Content Writer', 'ContentPro Agency', 'Remote', true, 'freelance', 'entry-level', 25, 50, 'USD', 'Create engaging blog posts, articles, and marketing copy for various clients across different industries. Work on a project basis with flexible hours and competitive rates.', ARRAY['Excellent writing and editing skills', 'SEO knowledge and implementation', 'Portfolio of writing samples across industries', 'Ability to meet deadlines and follow brand guidelines'], ARRAY['Content Writing', 'SEO', 'Copywriting', 'Research', 'WordPress', 'Google Analytics', 'Social Media'], 'Marketing', 'Content Creation', false, true, true),

('DevOps Engineer', 'CloudTech Systems', 'Seattle, WA', true, 'full-time', 'mid-level', 100000, 130000, 'USD', 'Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure reliable system deployments. Work with cutting-edge technologies in a fast-paced environment.', ARRAY['AWS/Azure cloud experience', 'Docker and Kubernetes proficiency', 'CI/CD tools experience (Jenkins, GitLab CI)', 'Linux system administration skills'], ARRAY['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Terraform', 'Python', 'Shell Scripting'], 'Technology', 'Cloud Computing', false, true, true),

('Marketing Manager', 'Growth Dynamics', 'Los Angeles, CA', false, 'full-time', 'mid-level', 70000, 90000, 'USD', 'Lead our marketing initiatives and drive customer acquisition across multiple channels. Develop and execute comprehensive marketing strategies to increase brand awareness and drive growth.', ARRAY['5+ years marketing experience', 'Digital marketing expertise', 'Team leadership and management skills', 'Analytics and data-driven decision making'], ARRAY['Digital Marketing', 'Google Ads', 'Analytics', 'Content Strategy', 'Team Management', 'Social Media', 'SEO'], 'Marketing', 'Digital Marketing', false, true, true);

-- Create view for job statistics
CREATE OR REPLACE VIEW job_statistics AS
SELECT 
    COUNT(*) as total_jobs,
    COUNT(*) FILTER (WHERE is_active = true) as active_jobs,
    COUNT(*) FILTER (WHERE is_published = true) as published_jobs,
    COUNT(*) FILTER (WHERE is_featured = true) as featured_jobs,
    COUNT(*) FILTER (WHERE application_deadline >= CURRENT_DATE) as jobs_with_deadline,
    COUNT(*) FILTER (WHERE is_remote = true) as remote_jobs,
    ROUND(AVG(salary_min)) as avg_min_salary,
    ROUND(AVG(salary_max)) as avg_max_salary
FROM public.jobs;

-- Grant necessary permissions
GRANT SELECT ON public.job_statistics TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO service_role;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Comments for documentation
COMMENT ON TABLE public.jobs IS 'Job postings table for the earn section of the platform';
COMMENT ON COLUMN public.jobs.slug IS 'URL-friendly identifier for job postings';
COMMENT ON COLUMN public.jobs.salary_min IS 'Minimum salary amount';
COMMENT ON COLUMN public.jobs.salary_max IS 'Maximum salary amount';
COMMENT ON COLUMN public.jobs.is_featured IS 'Whether job is featured on homepage';
COMMENT ON COLUMN public.jobs.is_published IS 'Whether job is visible to public';
COMMENT ON COLUMN public.jobs.status IS 'Current status: draft, active, paused, closed, expired, cancelled';
COMMENT ON COLUMN public.jobs.urgency_level IS 'Hiring urgency: low, normal, high, urgent';

COMMIT;