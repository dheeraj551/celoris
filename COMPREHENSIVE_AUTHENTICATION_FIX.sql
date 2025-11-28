-- COMPREHENSIVE AUTHENTICATION FIX
-- This script fixes all authentication issues for admin and Instagram posting
-- Resolves "invalid session" errors and admin course creation problems

-- ===========================================
-- 1. FIX DATABASE FUNCTIONS
-- ===========================================

-- Drop and recreate Instagram post function with proper error handling
DROP FUNCTION IF EXISTS create_instagram_post(text, uuid);
DROP FUNCTION IF EXISTS extract_instagram_id(text);

-- Create Instagram ID extraction function
CREATE OR REPLACE FUNCTION extract_instagram_id(url TEXT)
RETURNS TEXT AS $$
DECLARE
    post_id TEXT;
BEGIN
    -- Handle different Instagram URL formats
    IF url ~ 'instagram\.com/p/([A-Za-z0-9_-]+)' THEN
        post_id := substring(url from 'instagram\.com/p/([A-Za-z0-9_-]+)');
    ELSIF url ~ 'instagram\.com/reel/([A-Za-z0-9_-]+)' THEN
        post_id := substring(url from 'instagram\.com/reel/([A-Za-z0-9_-]+)');
    ELSIF url ~ 'instagram\.com/tv/([A-Za-z0-9_-]+)' THEN
        post_id := substring(url from 'instagram\.com/tv/([A-Za-z0-9_-]+)');
    ELSE
        -- For other formats, try to extract any alphanumeric sequence
        post_id := substring(url from '[A-Za-z0-9_-]{10,}');
    END IF;
    
    RETURN post_id;
END;
$$ LANGUAGE plpgsql;

-- Create updated Instagram post function
CREATE OR REPLACE FUNCTION create_instagram_post(
    p_instagram_url TEXT,
    p_user_id UUID
)
RETURNS JSON AS $$
DECLARE
    post_id UUID;
    extracted_instagram_id TEXT;
    final_user_id UUID;
BEGIN
    -- Validate inputs
    IF p_instagram_url IS NULL OR length(trim(p_instagram_url)) = 0 THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Instagram URL is required'
        );
    END IF;
    
    IF p_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'User ID is required'
        );
    END IF;
    
    -- Extract Instagram post ID
    extracted_instagram_id := extract_instagram_id(p_instagram_url);
    
    IF extracted_instagram_id IS NULL THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Invalid Instagram URL format'
        );
    END IF;
    
    -- Use the provided user ID (admin fixed ID)
    final_user_id := p_user_id;
    
    -- Check if post already exists
    IF EXISTS (SELECT 1 FROM public.instagram_posts 
               WHERE instagram_post_id = extracted_instagram_id 
               AND user_id = final_user_id) THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Post with this URL already exists for this user'
        );
    END IF;
    
    -- Insert the post
    INSERT INTO public.instagram_posts (
        id,
        user_id,
        instagram_url,
        instagram_post_id,
        caption,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        final_user_id,
        p_instagram_url,
        extracted_instagram_id,
        NULL,
        NOW(),
        NOW()
    ) RETURNING id INTO post_id;
    
    RETURN json_build_object(
        'success', true, 
        'post_id', post_id,
        'instagram_id', extracted_instagram_id
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false, 
            'error', SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- 2. FIX RLS POLICIES FOR ADMIN
-- ===========================================

-- Ensure courses table has proper RLS policies for admin
DROP POLICY IF EXISTS "Admin can manage all courses" ON public.courses;
CREATE POLICY "Admin can manage all courses" ON public.courses
    FOR ALL 
    TO authenticated
    USING (
        auth.uid() = ANY(ARRAY['550e8400-e29b-41d4-a716-446655440000'])
        OR 
        (auth.email() IN ('support@celorisdesigns.com', 'admin@celorisdesigns.com'))
    )
    WITH CHECK (
        auth.uid() = ANY(ARRAY['550e8400-e29b-41d4-a716-446655440000'])
        OR 
        (auth.email() IN ('support@celorisdesigns.com', 'admin@celorisdesigns.com'))
    );

-- Fix instagram_posts RLS policies
DROP POLICY IF EXISTS "Users can manage their own posts" ON public.instagram_posts;
DROP POLICY IF EXISTS "Admin can manage all instagram posts" ON public.instagram_posts;

-- Allow admin to manage all posts
CREATE POLICY "Admin can manage all instagram posts" ON public.instagram_posts
    FOR ALL 
    TO authenticated
    USING (
        auth.uid() = ANY(ARRAY['550e8400-e29b-41d4-a716-446655440000'])
        OR 
        (auth.email() IN ('support@celorisdesigns.com', 'admin@celorisdesigns.com'))
    )
    WITH CHECK (
        auth.uid() = ANY(ARRAY['550e8400-e29b-41d4-a716-446655440000'])
        OR 
        (auth.email() IN ('support@celorisdesigns.com', 'admin@celorisdesigns.com'))
    );

-- ===========================================
-- 3. CREATE ADMIN AUTHENTICATION HELPERS
-- ===========================================

-- Function to validate admin session from headers
CREATE OR REPLACE FUNCTION validate_admin_session(
    session_email TEXT,
    session_timestamp BIGINT
)
RETURNS JSON AS $$
DECLARE
    session_age INTERVAL;
    allowed_emails TEXT[] := ARRAY['support@celorisdesigns.com', 'admin@celorisdesigns.com'];
BEGIN
    -- Check if email is allowed
    IF session_email IS NULL OR NOT (session_email = ANY(allowed_emails)) THEN
        RETURN json_build_object(
            'valid', false,
            'error', 'Invalid admin email: ' || COALESCE(session_email, 'null')
        );
    END IF;
    
    -- Check session age (24 hours)
    session_age := NOW() - TO_TIMESTAMP(session_timestamp / 1000);
    
    IF session_age > INTERVAL '24 hours' THEN
        RETURN json_build_object(
            'valid', false,
            'error', 'Session expired. Session age: ' || EXTRACT(EPOCH FROM session_age) / 3600 || ' hours'
        );
    END IF;
    
    RETURN json_build_object(
        'valid', true,
        'admin_id', '550e8400-e29b-41d4-a716-446655440000',
        'admin_email', session_email,
        'session_age_hours', EXTRACT(EPOCH FROM session_age) / 3600
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'valid', false,
            'error', 'Session validation error: ' || SQLERRM
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- 4. VERIFICATION QUERIES
-- ===========================================

-- Test admin email validation
SELECT validate_admin_session('support@celorisdesigns.com', EXTRACT(EPOCH FROM NOW()) * 1000) as test_result;

-- Check RLS policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('courses', 'instagram_posts', 'course_modules', 'course_topics');

-- Verify Instagram function exists and works
SELECT create_instagram_post('https://www.instagram.com/p/test123/', '550e8400-e29b-41d4-a716-446655440000') as test_result;