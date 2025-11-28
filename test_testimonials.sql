-- Quick test to verify testimonials table was created successfully
SELECT COUNT(*) as total_testimonials FROM public.testimonials;

-- Test the page filtering function
SELECT get_testimonials_for_page('homepage', 'service', 5, true);