-- Clean up duplicate testimonials
-- Remove duplicate entries and keep only unique testimonials

-- Step 1: Find duplicates
SELECT 
    client_name,
    testimonial_text,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as testimonial_ids
FROM public.testimonials 
GROUP BY client_name, testimonial_text
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- Step 2: Remove duplicates - keep only one copy of each testimonial
-- This will delete duplicates based on client_name and testimonial_text
WITH duplicates AS (
    SELECT id,
        ROW_NUMBER() OVER (
            PARTITION BY client_name, testimonial_text 
            ORDER BY created_at DESC, is_featured DESC, id
        ) as rn
    FROM public.testimonials
)
DELETE FROM public.testimonials 
WHERE id IN (
    SELECT id FROM duplicates WHERE rn > 1
);

-- Step 3: Verify cleanup
SELECT 
    client_name,
    client_company,
    is_featured,
    testimonial_type,
    COUNT(*) as count
FROM public.testimonials 
GROUP BY client_name, client_company, is_featured, testimonial_type
ORDER BY client_name;

-- Step 4: Check final results
SELECT 
    COUNT(*) as total_testimonials,
    COUNT(CASE WHEN is_featured = true THEN 1 END) as featured_count,
    COUNT(CASE WHEN is_visible = true THEN 1 END) as visible_count
FROM public.testimonials;

-- Step 5: Show visible testimonials for homepage
SELECT 
    id,
    client_name,
    client_company,
    is_featured,
    testimonial_type,
    target_pages
FROM public.testimonials 
WHERE is_visible = true 
ORDER BY is_featured DESC, display_order ASC, created_at DESC;