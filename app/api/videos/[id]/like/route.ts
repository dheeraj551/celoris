import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// POST - Toggle like on video
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const videoId = params.id;
    const supabase = createClient();
    
    // Get user from session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already liked this video
    const { data: existingLike } = await supabase
      .from('vps_video_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .single() as { data: { id: string } | null };

    let isLiked = false;

    if (existingLike) {
      // Unlike - remove the like
      const { error: deleteError } = await supabase
        .from('vps_video_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        throw deleteError;
      }
      isLiked = false;
    } else {
      // Like - insert new like
      const { error: insertError } = await (supabase
        .from('vps_video_likes') as any)
        .insert({
          user_id: user.id,
          video_id: videoId
        });

      if (insertError) {
        throw insertError;
      }
      isLiked = true;
    }

    // Update the like count on the video
    const { data: likeCount } = await supabase
      .from('vps_video_likes')
      .select('id', { count: 'exact' })
      .eq('video_id', videoId);

    const { error: updateError } = await (supabase
      .from('vps_videos') as any)
      .update({ like_count: likeCount?.length || 0 })
      .eq('id', videoId);

    if (updateError) {
      console.error('Error updating like count:', updateError);
    }

    return NextResponse.json({
      success: true,
      liked: isLiked,
      like_count: likeCount?.length || 0
    });

  } catch (error) {
    console.error('Like toggle error:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

// GET - Check if user liked the video
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const videoId = params.id;
    const supabase = createClient();
    
    // Get user from session
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user liked this video
    const { data: existingLike } = await supabase
      .from('vps_video_likes')
      .select('id')
      .eq('user_id', user.id)
      .eq('video_id', videoId)
      .single() as { data: { id: string } | null };

    return NextResponse.json({
      liked: !!existingLike
    });

  } catch (error) {
    console.error('Check like status error:', error);
    return NextResponse.json(
      { error: 'Failed to check like status' },
      { status: 500 }
    );
  }
}