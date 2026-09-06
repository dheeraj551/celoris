import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Toggles the signed-in viewer's like/dislike on a Celoris TV lecture.
// Clicking the same reaction again removes it; switching from one to the
// other swaps it and adjusts both counts. The actual insert/update/delete
// and counter bookkeeping happens atomically in the
// celoris_tv_toggle_reaction() Postgres function (SECURITY DEFINER, so a
// viewer can bump counts on someone else's published lecture) — this route
// just validates the request and relays the result.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: videoId } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const reaction = body?.reaction;

    if (reaction !== 'like' && reaction !== 'dislike') {
      return NextResponse.json(
        { error: "reaction must be 'like' or 'dislike'" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc('celoris_tv_toggle_reaction', {
      p_video_id: videoId,
      p_reaction: reaction,
    });

    if (error) throw error;

    // The function returns a single row (the video's post-toggle state) via
    // RETURNS TABLE, so the JS client hands it back as a one-element array.
    const row = Array.isArray(data) ? data[0] : data;

    if (!row) {
      return NextResponse.json({ error: 'Lecture not found' }, { status: 404 });
    }

    return NextResponse.json({
      likes: row.like_count ?? 0,
      dislikes: row.dislike_count ?? 0,
      userReaction: row.user_reaction ?? null,
    });
  } catch (error) {
    console.error('Celoris TV reaction toggle error:', error);
    return NextResponse.json({ error: 'Failed to update reaction' }, { status: 500 });
  }
}
