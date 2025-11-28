-- FRONTEND ERROR HUNTER - Find the exact source of the map error
-- This script helps identify which API endpoints are returning null

-- 1. Test all your API endpoints to see which one returns null
SELECT '=== TESTING API ENDPOINTS ===' as status;

-- Test courses endpoint
SELECT 'COURSES ENDPOINT TEST:' as endpoint;
SELECT 
    'SELECT * FROM public.courses' as query,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Returns empty array - OK'
        ELSE 'Returns data - OK'
    END as result,
    COUNT(*) as record_count
FROM public.courses;

-- Test modules endpoint  
SELECT 'MODULES ENDPOINT TEST:' as endpoint;
SELECT 
    'SELECT * FROM public.course_modules' as query,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Returns empty array - OK'
        ELSE 'Returns data - OK'
    END as result,
    COUNT(*) as record_count
FROM public.course_modules;

-- Test topics endpoint
SELECT 'TOPICS ENDPOINT TEST:' as endpoint;
SELECT 
    'SELECT * FROM public.course_topics' as query,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Returns empty array - OK'
        ELSE 'Returns data - OK'
    END as result,
    COUNT(*) as record_count
FROM public.course_topics;

-- Test users endpoint
SELECT 'USERS ENDPOINT TEST:' as endpoint;
SELECT 
    'SELECT * FROM public.users' as query,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Returns empty array - OK'
        ELSE 'Returns data - OK'
    END as result,
    COUNT(*) as record_count
FROM public.users;

-- 2. Check if tables exist and structure
SELECT '=== TABLE STRUCTURE CHECK ===' as status;

-- Get table column info for courses
SELECT 
    'courses' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'courses'
ORDER BY ordinal_position;

-- Get table column info for course_modules
SELECT 
    'course_modules' as table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'course_modules'
ORDER BY ordinal_position;

-- 3. Create a simple test data insert to see if empty table is the issue
SELECT '=== CREATING TEST DATA ===' as status;

-- Insert a test course if none exist
INSERT INTO public.courses (id, title, description, created_at)
SELECT 
    gen_random_uuid(),
    'Test Course',
    'This is a test course to fix null array error',
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.courses);

-- Insert test modules if none exist  
INSERT INTO public.course_modules (id, title, course_id, created_at)
SELECT 
    gen_random_uuid(),
    'Test Module',
    (SELECT id FROM public.courses LIMIT 1),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.course_modules);

-- Insert test topics if none exist
INSERT INTO public.course_topics (id, title, module_id, created_at)
SELECT 
    gen_random_uuid(),
    'Test Topic',
    (SELECT id FROM public.course_modules LIMIT 1),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.course_topics);

-- 4. Final verification
SELECT '=== FINAL VERIFICATION ===' as status;
SELECT 
    'courses' as table_name,
    COUNT(*) as records,
    'Should be > 0' as expected
FROM public.courses
UNION ALL
SELECT 
    'course_modules' as table_name,
    COUNT(*) as records,
    'Should be > 0' as expected
FROM public.course_modules
UNION ALL
SELECT 
    'course_topics' as table_name,
    COUNT(*) as records,
    'Should be > 0' as expected
FROM public.course_topics;

SELECT 'FRONTEND ERROR DIAGNOSIS COMPLETE! Check the results above.' as result;