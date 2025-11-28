-- Investigate Testimonials Data and Display
-- Check what's actually in the testimonials table

-- 1. Check all testimonials in the database
SELECT 
    id,
    client_name,
    client_company,
    is_visible,
    is_featured,
    testimonial_type,
    target_pages,
    display_order,
    created_at
FROM public.testimonials 
ORDER BY display_order ASC, created_at DESC;

-- 2. Check count by type
SELECT 
    testimonial_type,
    COUNT(*) as total_count,
    COUNT(CASE WHEN is_visible = true THEN 1 END) as visible_count,
    COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count
FROM public.testimonials 
GROUP BY testimonial_type;

-- 3. Check specifically for homepage target
SELECT 
    id,
    client_name,
    is_visible,
    is_featured,
    target_pages
FROM public.testimonials 
WHERE 'homepage' = ANY(target_pages)
ORDER BY display_order, created_at DESC;