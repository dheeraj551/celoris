
# Setup Featured Videos Table

Run the following SQL in your Supabase SQL Editor to create the `featured_videos` table:

```sql
-- Create featured_videos table
CREATE TABLE IF NOT EXISTS public.featured_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'General',
    duration TEXT DEFAULT '00:00',
    author TEXT DEFAULT 'Celoris Team',
    views_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.featured_videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view featured videos" 
ON public.featured_videos FOR SELECT 
USING (true);

-- Allow authenticated users (admins) to insert/update/delete
CREATE POLICY "Admins can manage featured videos" 
ON public.featured_videos FOR ALL 
USING (auth.role() = 'authenticated');
```
