-- Create swipes table for dating app functionality
CREATE TABLE IF NOT EXISTS public.swipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    swiper_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    swiped_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('left', 'right', 'super_like')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create matches table for mutual likes
CREATE TABLE IF NOT EXISTS public.matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    UNIQUE(user1_id, user2_id)
);

-- Enable RLS
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for swipes table
CREATE POLICY "Users can create their own swipes" ON public.swipes
    FOR INSERT WITH CHECK (swiper_id = auth.uid());

CREATE POLICY "Users can view swipes involving them" ON public.swipes
    FOR SELECT USING (swiper_id = auth.uid() OR swiped_id = auth.uid());

CREATE POLICY "Users can update their own swipes" ON public.swipes
    FOR UPDATE USING (swiper_id = auth.uid());

CREATE POLICY "Users can delete their own swipes" ON public.swipes
    FOR DELETE USING (swiper_id = auth.uid());

-- RLS Policies for matches table
CREATE POLICY "Users can view matches involving them" ON public.matches
    FOR SELECT USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create matches" ON public.matches
    FOR INSERT WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can update matches involving them" ON public.matches
    FOR UPDATE USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can delete matches involving them" ON public.matches
    FOR DELETE USING (user1_id = auth.uid() OR user2_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_swipes_swiper_id ON public.swipes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_swipes_swiped_id ON public.swipes(swiped_id);
CREATE INDEX IF NOT EXISTS idx_swipes_direction ON public.swipes(direction);
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_active ON public.matches(is_active);