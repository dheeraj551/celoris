
import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createRouteClient();

        const { data: videos, error } = await supabase
            .from('featured_videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching featured videos:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ videos });
    } catch (error) {
        console.error('Error in GET featured videos:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        // Use service role client to bypass RLS
        const supabase = createSupabaseClientForServer();
        const body = await request.json();

        // Basic validation
        if (!body.title || !body.youtube_url) {
            return NextResponse.json({ error: 'Title and YouTube URL are required' }, { status: 400 });
        }

        // Auto-extract thumbnail if not provided
        let thumbnail_url = body.thumbnail_url;
        if (!thumbnail_url && body.youtube_url) {
            const videoIdMatch = body.youtube_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/);
            const videoId = videoIdMatch ? videoIdMatch[1] : null;
            if (videoId) {
                thumbnail_url = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }
        }

        const { data: video, error } = await supabase
            .from('featured_videos')
            .insert({
                title: body.title,
                youtube_url: body.youtube_url,
                thumbnail_url: thumbnail_url,
                category: body.category || 'General',
                duration: body.duration || '00:00',
                author: body.author || 'Celoris Team',
                is_active: body.is_active !== undefined ? body.is_active : true
            } as any)
            .select()
            .single();

        if (error) {
            console.error('Error creating featured video:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ video });
    } catch (error) {
        console.error('Error in POST featured video:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
