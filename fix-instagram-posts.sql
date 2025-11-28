-- Fix Instagram Posts Table and RLS Policies
-- This will resolve the 500 Internal Server Error

-- Step 1: Create instagram_posts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.instagram_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instagram_id VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    instagram_url TEXT NOT NULL,
    thumbnail_url TEXT,
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Step 2: Enable RLS
ALTER TABLE public.instagram_posts ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies - Allow authenticated users to manage their own posts
CREATE POLICY "Users can view their own Instagram posts" ON public.instagram_posts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Instagram posts" ON public.instagram_posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Instagram posts" ON public.instagram_posts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own Instagram posts" ON public.instagram_posts
    FOR DELETE USING (auth.uid() = user_id);

-- Step 4: Allow admin access (session-based authentication)
CREATE POLICY "Admin can manage all Instagram posts" ON public.instagram_posts
    FOR ALL USING (
        current_setting('request.jwt.claims', true)::json->>'role' = 'admin' 
        OR current_setting('request.jwt.claims', true)::json->>'email' = 'support@celorisdesigns.com'
    );

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_instagram_posts_user_id ON public.instagram_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_instagram_id ON public.instagram_posts(instagram_id);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_created_at ON public.instagram_posts(created_at DESC);

-- Step 6: Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 7: Create trigger for updated_at
DROP TRIGGER IF EXISTS update_instagram_posts_updated_at ON public.instagram_posts;
CREATE TRIGGER update_instagram_posts_updated_at
    BEFORE UPDATE ON public.instagram_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 8: Grant necessary permissions
GRANT ALL ON public.instagram_posts TO authenticated;
GRANT ALL ON public.instagram_posts TO anon;

-- Show success message
SELECT 'Instagram posts table created/updated successfully!' as status;