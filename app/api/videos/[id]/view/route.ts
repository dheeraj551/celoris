import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: videoId } = await params;
    const supabase = createClient();

    // Get user from session (optional for views)
    const { data: { user } } = await supabase.auth.getUser();

    // Update view count on the video
    const { data: video, error: videoError } = await (supabase
      .from('vps_videos') as any)
      .select('view_count')
      .eq('id', videoId)
      .single();

    if (videoError) {
      throw videoError;
    }

    const newViewCount = (video.view_count || 0) + 1;

    const { error: updateError } = await (supabase
      .from('vps_videos') as any)
      .update({ view_count: newViewCount })
      .eq('id', videoId);

    if (updateError) {
      throw updateError;
    }

    // Log the view (optional, for analytics)
    if (user) {
      // You could log individual views here if needed
      // For now, we'll just track the count
    }

    return NextResponse.json({
      success: true,
      view_count: newViewCount
    });

  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}

// GET - Get view count for a video
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: videoId } = await params;
    const supabase = createClient();

    const { data: video, error } = await (supabase
      .from('vps_videos') as any)
      .select('view_count')
      .eq('id', videoId)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      view_count: video.view_count || 0
    });

  } catch (error) {
    console.error('Get view count error:', error);
    return NextResponse.json(
      { error: 'Failed to get view count' },
      { status: 500 }
    );
  }
}