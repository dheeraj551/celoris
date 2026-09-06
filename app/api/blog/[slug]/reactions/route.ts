import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function countReactions(supabase: any, slug: string) {
  const [{ count: likes }, { count: dislikes }] = await Promise.all([
    supabase
      .from('blog_post_reactions')
      .select('id', { count: 'exact', head: true })
      .eq('post_slug', slug)
      .eq('reaction', 'like'),
    supabase
      .from('blog_post_reactions')
      .select('id', { count: 'exact', head: true })
      .eq('post_slug', slug)
      .eq('reaction', 'dislike'),
  ]);

  return { likes: likes || 0, dislikes: dislikes || 0 };
}

// The blog has no login wall, so a reader's "identity" for a like/dislike is
// either their real signed-in account (auth.uid()) or, for anonymous
// visitors, a guest_id they generate once and keep in localStorage.
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const guestId = request.nextUrl.searchParams.get('guestId');

    const { likes, dislikes } = await countReactions(supabase, slug);

    let userReaction: 'like' | 'dislike' | null = null;
    if (user) {
      const { data } = await supabase
        .from('blog_post_reactions')
        .select('reaction')
        .eq('post_slug', slug)
        .eq('user_id', user.id)
        .maybeSingle();
      userReaction = data?.reaction || null;
    } else if (guestId) {
      const { data } = await supabase
        .from('blog_post_reactions')
        .select('reaction')
        .eq('post_slug', slug)
        .eq('guest_id', guestId)
        .maybeSingle();
      userReaction = data?.reaction || null;
    }

    return NextResponse.json({ likes, dislikes, userReaction });
  } catch (error) {
    console.error('Blog reactions fetch error:', error);
    return NextResponse.json({ error: 'Failed to load reactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = await request.json().catch(() => ({}));
    const reaction = body?.reaction;
    const guestId = typeof body?.guestId === 'string' ? body.guestId : null;

    if (reaction !== 'like' && reaction !== 'dislike') {
      return NextResponse.json({ error: "reaction must be 'like' or 'dislike'" }, { status: 400 });
    }
    if (!user && !guestId) {
      return NextResponse.json({ error: 'guestId is required when not signed in' }, { status: 400 });
    }

    const identityColumn = user ? 'user_id' : 'guest_id';
    const identityValue = user ? user.id : guestId;

    const { data: existing, error: fetchErr } = await supabase
      .from('blog_post_reactions')
      .select('id, reaction')
      .eq('post_slug', slug)
      .eq(identityColumn, identityValue as string)
      .maybeSingle();

    if (fetchErr) throw fetchErr;

    let userReaction: 'like' | 'dislike' | null = reaction;

    if (existing && existing.reaction === reaction) {
      // Clicking the same reaction again removes it.
      const { error } = await supabase.from('blog_post_reactions').delete().eq('id', existing.id);
      if (error) throw error;
      userReaction = null;
    } else if (existing) {
      // Switching from like -> dislike or vice versa.
      const { error } = await supabase
        .from('blog_post_reactions')
        .update({ reaction })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('blog_post_reactions').insert({
        post_slug: slug,
        user_id: user?.id || null,
        guest_id: user ? null : guestId,
        reaction,
      });
      if (error) throw error;
    }

    const { likes, dislikes } = await countReactions(supabase, slug);

    return NextResponse.json({ likes, dislikes, userReaction });
  } catch (error) {
    console.error('Blog reaction toggle error:', error);
    return NextResponse.json({ error: 'Failed to update reaction' }, { status: 500 });
  }
}
