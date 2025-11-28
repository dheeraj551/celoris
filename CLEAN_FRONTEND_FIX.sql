-- CLEAN FRONTEND ERROR FIX
-- This script diagnoses and fixes database issues that cause frontend map errors

-- Test courses table
SELECT 'TESTING COURSES TABLE' as test;
SELECT COUNT(*) as courses_count FROM public.courses;

-- Test course_modules table  
SELECT 'TESTING COURSE_MODULES TABLE' as test;
SELECT COUNT(*) as modules_count FROM public.course_modules;

-- Test course_topics table
SELECT 'TESTING COURSE_TOPICS TABLE' as test;
SELECT COUNT(*) as topics_count FROM public.course_topics;

-- Test users table
SELECT 'TESTING USERS TABLE' as test;
SELECT COUNT(*) as users_count FROM public.users;

-- Insert test data if tables are empty
INSERT INTO public.courses (id, title, description, created_at)
SELECT gen_random_uuid(), 'Test Course', 'Test description', NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.courses);

-- Test again after insert
SELECT 'AFTER INSERT - COURSES COUNT:' as status;
SELECT COUNT(*) as courses_count FROM public.courses;

SELECT 'DATABASE CHECK COMPLETE' as result;