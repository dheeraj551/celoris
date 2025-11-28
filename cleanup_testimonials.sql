-- ===========================================
-- TESTIMONIALS CLEANUP SCRIPT
-- Use this if you want to completely remove and recreate the testimonials system
-- ===========================================

-- Drop existing objects in reverse order of dependencies
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON public.testimonials;
DROP POLICY IF EXISTS "Public can view visible testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admin users can manage testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated admin can insert testimonials" ON public.testimonials;
DROP FUNCTION IF EXISTS get_testimonials_for_page(TEXT, TEXT, INTEGER, BOOLEAN);
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS public.testimonials CASCADE;