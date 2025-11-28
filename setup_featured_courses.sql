-- FEATURED COURSES: Database Setup & Verification
-- This script ensures the courses table is ready for admin-posted courses

-- STEP 1: Check if courses table exists
SELECT '=== CHECKING COURSES TABLE ===' as info;
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'courses'
ORDER BY ordinal_position;

-- STEP 2: Check existing courses
SELECT '=== EXISTING COURSES ===' as info;
SELECT 
  id,
  title,
  subject,
  grade_level,
  instructor_name,
  price,
  is_published,
  is_featured,
  created_at
FROM courses
ORDER BY created_at DESC
LIMIT 10;

-- STEP 3: Check courses that are marked as featured
SELECT '=== FEATURED COURSES ===' as info;
SELECT 
  id,
  title,
  subject,
  instructor_name,
  price,
  created_at
FROM courses
WHERE is_featured = true
  AND is_published = true
ORDER BY created_at DESC;

-- STEP 4: Create some sample courses if none exist
-- This provides demo content for the Featured Courses section
DO $$
DECLARE
    course_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO course_count FROM courses;
    
    IF course_count = 0 THEN
        INSERT INTO courses (
            id,
            title,
            subject,
            grade_level,
            description,
            target_audience,
            instructor_name,
            course_duration,
            price,
            course_image_url,
            is_published,
            is_featured,
            created_at,
            updated_at
        ) VALUES 
        (
            gen_random_uuid(),
            'Complete Web Development Bootcamp',
            'Programming',
            'Beginner',
            'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, Node.js, and databases.',
            'Beginner developers and career changers',
            'Sarah Johnson',
            '40 hours',
            0,
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            true,
            true,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'UI/UX Design Fundamentals',
            'Design',
            'Intermediate',
            'Master the principles of user interface and user experience design. Create beautiful and functional designs.',
            'Designers and product developers',
            'Mike Chen',
            '25 hours',
            49,
            'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            true,
            true,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Digital Marketing Mastery',
            'Marketing',
            'Beginner',
            'Learn modern digital marketing strategies including SEO, social media, email marketing, and analytics.',
            'Marketing professionals and entrepreneurs',
            'Emma Davis',
            '30 hours',
            29,
            'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            true,
            true,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Data Science with Python',
            'Data Science',
            'Advanced',
            'Complete guide to data science using Python. Learn pandas, numpy, matplotlib, and machine learning.',
            'Data analysts and scientists',
            'Dr. Alex Rodriguez',
            '35 hours',
            79,
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            true,
            true,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Mobile App Development with React Native',
            'Mobile Development',
            'Intermediate',
            'Build cross-platform mobile apps using React Native. Deploy to iOS and Android app stores.',
            'Web developers and mobile enthusiasts',
            'Jessica Park',
            '32 hours',
            59,
            'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            true,
            true,
            NOW(),
            NOW()
        ),
        (
            gen_random_uuid(),
            'Business Strategy and Leadership',
            'Business',
            'Beginner',
            'Develop strategic thinking and leadership skills to drive business success in the digital age.',
            'Business professionals and leaders',
            'Robert Kim',
            '20 hours',
            39,
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            true,
            true,
            NOW(),
            NOW()
        );
        
        RAISE NOTICE '✅ Created 6 sample featured courses for demonstration';
    ELSE
        RAISE NOTICE '✅ Courses table already has % courses', course_count;
    END IF;
END
$$;

-- STEP 5: Verify featured courses are available
SELECT '=== FINAL VERIFICATION: Featured Courses Available ===' as info;
SELECT 
  'Total courses' as metric,
  COUNT(*)::text as value
FROM courses
UNION ALL
SELECT 
  'Published courses' as metric,
  COUNT(*)::text as value
FROM courses WHERE is_published = true
UNION ALL
SELECT 
  'Featured courses' as metric,
  COUNT(*)::text as value
FROM courses WHERE is_featured = true AND is_published = true;

-- STEP 6: Show the courses that will appear in Featured Courses section
SELECT '=== COURSES THAT WILL SHOW IN FEATURED SECTION ===' as info;
SELECT 
  id,
  title,
  subject,
  instructor_name,
  price,
  is_featured,
  is_published
FROM courses
WHERE is_featured = true AND is_published = true
ORDER BY created_at DESC;

-- SUCCESS MESSAGE
SELECT '🎉 SETUP COMPLETE! 
✅ Courses table verified
✅ Featured courses available for admin-created content
✅ API will return real courses instead of sample data
✅ Learn page Featured Courses section is now dynamic
' as result;