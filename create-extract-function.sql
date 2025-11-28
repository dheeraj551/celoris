-- Complete Instagram Posts Setup - All Functions Together
-- This creates everything in the correct order

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

-- Step 2: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION extract_instagram_id(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION extract_instagram_id(TEXT) TO anon;