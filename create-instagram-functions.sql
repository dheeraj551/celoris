-- Create Instagram Posts API Functions
-- This creates the backend functions that handle Instagram post creation

-- Step 1: Create function to extract Instagram post ID from URL
CREATE OR REPLACE FUNCTION extract_instagram_id(instagram_url TEXT)
RETURNS TEXT AS $$
DECLARE
    post_id TEXT;
BEGIN
    -- Extract post ID from Instagram URL patterns
    -- Pattern: https://www.instagram.com/p/POST_ID/ or https://www.instagram.com/reel/POST_ID/
    SELECT 
        CASE 
            WHEN instagram_url ~ 'instagram\.com/p/([A-Za-z0-9_-]+)' THEN substring(instagram_url from 'instagram\.com/p/([A-Za-z0-9_-]+)')
            WHEN instagram_url ~ 'instagram\.com/reel/([A-Za-z0-9_-]+)' THEN substring(instagram_url from 'instagram\.com/reel/([A-Za-z0-9_-]+)')
            WHEN instagram_url ~ 'instagram\.com/p/([A-Za-z0-9_-]+)\?' THEN substring(instagram_url from 'instagram\.com/p/([A-Za-z0-9_-]+)')
            WHEN instagram_url ~ 'instagram\.com/reel/([A-Za-z0-9_-]+)\?' THEN substring(instagram_url from 'instagram\.com/reel/([A-Za-z0-9_-]+)')
            ELSE instagram_url
        END
    INTO post_id;
    
    RETURN post_id;
END;
$$ LANGUAGE plpgsql IMMUTABLE;