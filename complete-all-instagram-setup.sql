-- ALL-IN-ONE Instagram Posts Complete Setup
-- This script creates everything needed for Instagram posts to work

-- Step 1: Create the extract_instagram_id function first
CREATE OR REPLACE FUNCTION extract_instagram_id(instagram_url TEXT)
RETURNS TEXT AS $$
DECLARE
    post_id TEXT;
BEGIN
    -- Extract post ID from various Instagram URL patterns
    SELECT 
        CASE 
            -- Standard post URLs
            WHEN instagram_url ~ 'instagram\.com/p/([A-Za-z0-9_-]+)' THEN 
                substring(instagram_url from 'instagram\.com/p/([A-Za-z0-9_-]+)')
            
            -- Reel URLs
            WHEN instagram_url ~ 'instagram\.com/reel/([A-Za-z0-9_-]+)' THEN 
                substring(instagram_url from 'instagram\.com/reel/([A-Za-z0-9_-]+)')
            
            -- URLs with query parameters
            WHEN instagram_url ~ 'instagram\.com/p/([A-Za-z0-9_-]+)\?' THEN 
                substring(instagram_url from 'instagram\.com/p/([A-Za-z0-9_-]+)\?')
            
            WHEN instagram_url ~ 'instagram\.com/reel/([A-Za-z0-9_-]+)\?' THEN 
                substring(instagram_url from 'instagram\.com/reel/([A-Za-z0-9_-]+)\?')
            
            -- URLs ending with trailing slash
            WHEN instagram_url ~ 'instagram\.com/p/([A-Za-z0-9_-]+)/$' THEN 
                substring(instagram_url from 'instagram\.com/p/([A-Za-z0-9_-]+)/')
            
            WHEN instagram_url ~ 'instagram\.com/reel/([A-Za-z0-9_-]+)/$' THEN 
                substring(instagram_url from 'instagram\.com/reel/([A-Za-z0-9_-]+)/')
            
            -- If no match, try to get the last part of the URL
            WHEN instagram_url ~ 'instagram\.com/.*/([A-Za-z0-9_-]+)' THEN 
                substring(instagram_url from 'instagram\.com/.*/([A-Za-z0-9_-]+)')
            
            -- Fallback: return the cleaned URL
            ELSE 
                regexp_replace(instagram_url, '^https?://', '')
                || regexp_replace(instagram_url, '^www\.', '')
                || regexp_replace(instagram_url, '\?.*$', '')
        END
    INTO post_id;
    
    RETURN post_id;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Step 2: Function to create Instagram post
CREATE OR REPLACE FUNCTION create_instagram_post(
    p_instagram_url TEXT,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
DECLARE
    post_id UUID;
    extracted_instagram_id TEXT;
    user_email TEXT;
    user_role TEXT;
BEGIN
    -- Extract Instagram post ID from URL
    extracted_instagram_id := extract_instagram_id(p_instagram_url);
    
    -- Get user info from JWT claims (for admin support)
    SELECT 
        COALESCE(current_setting('request.jwt.claims', true)::json->>'email', ''),
        COALESCE(current_setting('request.jwt.claims', true)::json->>'role', 'user')
    INTO user_email, user_role;
    
    -- Insert the Instagram post
    INSERT INTO public.instagram_posts (
        instagram_id,
        user_id,
        instagram_url,
        created_at,
        updated_at
    ) VALUES (
        extracted_instagram_id,
        COALESCE(p_user_id, (auth.uid())::uuid),
        p_instagram_url,
        now(),
        now()
    ) RETURNING id INTO post_id;
    
    -- Return success response
    RETURN json_build_object(
        'success', true,
        'post_id', post_id,
        'instagram_id', extracted_instagram_id,
        'user_email', user_email,
        'role', user_role
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Return error response
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'error_code', SQLSTATE
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Function to get Instagram posts
CREATE OR REPLACE FUNCTION get_instagram_posts(
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
DECLARE
    posts_data JSON;
    user_email TEXT;
    user_role TEXT;
BEGIN
    -- Get user info from JWT claims
    SELECT 
        COALESCE(current_setting('request.jwt.claims', true)::json->>'email', ''),
        COALESCE(current_setting('request.jwt.claims', true)::json->>'role', 'user')
    INTO user_email, user_role;
    
    -- Get all posts (admin gets all, users get only their own)
    SELECT json_agg(
        json_build_object(
            'id', ip.id,
            'instagram_id', ip.instagram_id,
            'instagram_url', ip.instagram_url,
            'thumbnail_url', ip.thumbnail_url,
            'caption', ip.caption,
            'created_at', ip.created_at,
            'updated_at', ip.updated_at
        )
    )
    INTO posts_data
    FROM public.instagram_posts ip
    WHERE 
        CASE 
            WHEN user_role = 'admin' OR user_email = 'support@celorisdesigns.com' THEN true
            ELSE ip.user_id = p_user_id OR ip.user_id = (auth.uid())::uuid
        END;
    
    -- Return success response
    RETURN json_build_object(
        'success', true,
        'posts', COALESCE(posts_data, '[]'::json),
        'user_email', user_email,
        'role', user_role
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Return error response
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'error_code', SQLSTATE
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Function to delete Instagram post
CREATE OR REPLACE FUNCTION delete_instagram_post(
    p_post_id UUID,
    p_user_id UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
DECLARE
    affected_rows INTEGER;
    user_email TEXT;
    user_role TEXT;
BEGIN
    -- Get user info from JWT claims
    SELECT 
        COALESCE(current_setting('request.jwt.claims', true)::json->>'email', ''),
        COALESCE(current_setting('request.jwt.claims', true)::json->>'role', 'user')
    INTO user_email, user_role;
    
    -- Delete the post (admin can delete all, users can delete only their own)
    DELETE FROM public.instagram_posts 
    WHERE id = p_post_id 
    AND (
        user_role = 'admin' 
        OR user_email = 'support@celorisdesigns.com'
        OR user_id = p_user_id
        OR user_id = (auth.uid())::uuid
    );
    
    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    
    -- Return success response
    RETURN json_build_object(
        'success', affected_rows > 0,
        'deleted_count', affected_rows,
        'user_email', user_email,
        'role', user_role
    );
    
EXCEPTION
    WHEN OTHERS THEN
        -- Return error response
        RETURN json_build_object(
            'success', false,
            'error', SQLERRM,
            'error_code', SQLSTATE
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Grant permissions to all functions
GRANT EXECUTE ON FUNCTION create_instagram_post(TEXT, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_instagram_posts(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_instagram_post(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION extract_instagram_id(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION extract_instagram_id(TEXT) TO anon;

-- Step 6: Clean up any broken data and fix missing instagram_id
UPDATE public.instagram_posts 
SET instagram_id = extract_instagram_id(instagram_url)
WHERE instagram_id IS NULL AND instagram_url IS NOT NULL;

-- Step 7: Success message
SELECT 'All Instagram posts functions created successfully! 500 error should be fixed.' as status;