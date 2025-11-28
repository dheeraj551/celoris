-- ===========================================
-- TESTIMONIALS MANAGEMENT SYSTEM
-- ===========================================

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    client_title VARCHAR(255),
    client_company VARCHAR(255),
    client_avatar_url TEXT,
    testimonial_text TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    testimonial_type VARCHAR(50) DEFAULT 'general' CHECK (testimonial_type IN ('general', 'service', 'product', 'feature', 'support')),
    target_pages TEXT[] DEFAULT ARRAY['homepage', 'about', 'services'],
    display_order INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    client_location VARCHAR(255),
    client_website VARCHAR(500),
    project_details JSONB,
    client_industry VARCHAR(100),
    date_received DATE,
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'pending_review')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_testimonials_type ON public.testimonials(testimonial_type);
CREATE INDEX IF NOT EXISTS idx_testimonials_visible ON public.testimonials(is_visible);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON public.testimonials(display_order);

-- Enable Row Level Security
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access (for displaying testimonials)
DROP POLICY IF EXISTS "Public can view visible testimonials" ON public.testimonials;
CREATE POLICY "Public can view visible testimonials" ON public.testimonials
    FOR SELECT USING (is_visible = true);

-- Create RLS policies for authenticated admin users (for managing testimonials)
DROP POLICY IF EXISTS "Admin users can manage testimonials" ON public.testimonials;
CREATE POLICY "Admin users can manage testimonials" ON public.testimonials
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('support@celorisdesigns.com')
        )
    );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER update_testimonials_updated_at 
    BEFORE UPDATE ON public.testimonials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policy for authenticated admin operations
DROP POLICY IF EXISTS "Authenticated admin can insert testimonials" ON public.testimonials;
CREATE POLICY "Authenticated admin can insert testimonials" ON public.testimonials
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN ('support@celorisdesigns.com')
        )
    );

-- Add initial sample testimonials
INSERT INTO public.testimonials (
    client_name,
    client_title,
    client_company,
    testimonial_text,
    rating,
    testimonial_type,
    target_pages,
    display_order,
    is_featured,
    is_visible,
    client_location,
    verification_status,
    date_received
) VALUES 
(
    'Sarah Johnson',
    'Marketing Director',
    'TechStart Inc.',
    'The team at Celoris Designs transformed our brand identity completely. Their attention to detail and creative vision exceeded all our expectations. The new logo and website design have significantly improved our market presence.',
    5,
    'service',
    ARRAY['homepage', 'services', 'about'],
    1,
    true,
    true,
    'San Francisco, CA',
    'verified',
    '2024-11-15'
),
(
    'Michael Chen',
    'Founder & CEO',
    'GrowthCorp',
    'Outstanding service and incredible results! The website redesign helped us increase our conversion rate by 40%. Professional, timely, and highly creative team.',
    5,
    'service',
    ARRAY['homepage', 'services'],
    2,
    true,
    true,
    'Austin, TX',
    'verified',
    '2024-11-10'
),
(
    'Emily Rodriguez',
    'Product Manager',
    'InnovateLabs',
    'The mobile app development was flawless. They understood our vision perfectly and delivered a product that our users absolutely love. Highly recommended!',
    5,
    'product',
    ARRAY['homepage', 'services'],
    3,
    true,
    true,
    'New York, NY',
    'verified',
    '2024-11-08'
),
(
    'David Kim',
    'Creative Director',
    'BrandForward Agency',
    'Working with Celoris Designs was a game-changer for our agency. Their strategic approach to branding helped us win multiple client contracts.',
    5,
    'service',
    ARRAY['about', 'services'],
    4,
    false,
    true,
    'Los Angeles, CA',
    'verified',
    '2024-11-05'
),
(
    'Jennifer Adams',
    'VP of Marketing',
    'ScaleTech',
    'The SEO and digital marketing services have been phenomenal. Our organic traffic increased by 200% in just 6 months. Exceptional ROI!',
    5,
    'feature',
    ARRAY['homepage', 'services'],
    5,
    false,
    true,
    'Seattle, WA',
    'verified',
    '2024-11-02'
);

-- Function to get testimonials by type and page
DROP FUNCTION IF EXISTS get_testimonials_for_page(TEXT, TEXT, INTEGER, BOOLEAN);
CREATE OR REPLACE FUNCTION get_testimonials_for_page(
    target_page TEXT,
    testimonial_type_param TEXT DEFAULT 'general',
    limit_count INTEGER DEFAULT 10,
    include_featured_first BOOLEAN DEFAULT true
)
RETURNS TABLE (
    id UUID,
    client_name VARCHAR(255),
    client_title VARCHAR(255),
    client_company VARCHAR(255),
    client_avatar_url TEXT,
    testimonial_text TEXT,
    rating INTEGER,
    testimonial_type VARCHAR(50),
    client_location VARCHAR(255),
    client_website VARCHAR(500),
    date_received DATE,
    is_featured BOOLEAN
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT 
        t.id,
        t.client_name,
        t.client_title,
        t.client_company,
        t.client_avatar_url,
        t.testimonial_text,
        t.rating,
        t.testimonial_type,
        t.client_location,
        t.client_website,
        t.date_received,
        t.is_featured
    FROM public.testimonials t
    WHERE t.is_visible = true 
    AND t.testimonial_type = testimonial_type_param
    AND target_page = ANY(t.target_pages)
    ORDER BY 
        CASE WHEN include_featured_first THEN t.is_featured ELSE false END DESC,
        t.display_order ASC,
        t.created_at DESC
    LIMIT limit_count;
$$;