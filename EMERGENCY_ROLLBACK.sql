-- EMERGENCY ROLLBACK - Restore Original Authentication
-- This rolls back all changes to restore website functionality immediately

-- ===========================================
-- ROLLBACK: Instagram Posts Functions
-- ===========================================

-- Drop the broken function
DROP FUNCTION IF EXISTS create_instagram_post(text, uuid, text);

-- Restore original function (simplified version)
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
    -- Extract Instagram post ID from URL
    extracted_instagram_id := extract_instagram_id(p_instagram_url);
    
    -- Use the provided user ID
    final_user_id := p_user_id;
    
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
    
    RETURN json_build_object('success', true, 'post_id', post_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- ROLLBACK: RLS Policies (Restore Original)
-- ===========================================

-- Drop all broken policies
DROP POLICY IF EXISTS "Allow all operations for instagram_posts" ON public.instagram_posts;
DROP POLICY IF EXISTS "Allow all operations for courses" ON public.courses;
DROP POLICY IF EXISTS "Allow all operations for modules" ON public.course_modules;
DROP POLICY IF EXISTS "Allow all operations for topics" ON public.course_topics;

-- Restore original authentication-based policies
-- Instagram Posts
CREATE POLICY "Users can manage their own posts" ON public.instagram_posts 
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to view posts" ON public.instagram_posts 
FOR SELECT USING (auth.uid() IS NOT NULL);

-- Courses
CREATE POLICY "Allow all for authenticated users" ON public.courses 
FOR ALL USING (auth.uid() IS NOT NULL);

-- Course Modules
CREATE POLICY "Allow all for authenticated users" ON public.course_modules 
FOR ALL USING (auth.uid() IS NOT NULL);

-- Course Topics
CREATE POLICY "Allow all for authenticated users" ON public.course_topics 
FOR ALL USING (auth.uid() IS NOT NULL);

-- ===========================================
-- ROLLBACK: Triggers (Restore Original)
-- ===========================================

-- Ensure user profile creation trigger works
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ===========================================
-- VERIFICATION
-- ===========================================

-- Grant permissions back to authenticated users
GRANT ALL ON public.instagram_posts TO authenticated;
GRANT ALL ON public.courses TO authenticated;
GRANT ALL ON public.course_modules TO authenticated;
GRANT ALL ON public.course_topics TO authenticated;