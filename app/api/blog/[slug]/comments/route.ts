import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function displayName(profile: any) {
  return profile?.full_name || profile?.username || 'Celoris Reader';
}

function displayAvatar(profile: any, name: string) {
  return (
    profile?.profile_pic_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7F9172&color=fff`
  );
}

// The blog has no login wall — a comment is either posted by a real signed-in
// account (name/avatar pulled from public.users) or by an anonymous reader
// who types their own display name.
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: rows, error } = await supabase
      .from('blog_post_comments')
      .select('*')
      .eq('post_slug', slug)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const userIds = Array.from(
      new Set((rows || []).filter(r => r.user_id).map(r => r.user_id as string))
    );

    let profileById = new Map<string, any>();
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('users')
        .select('id, full_name, username, profile_pic_url')
        .in('id', userIds);
      profileById = new Map((profiles || []).map(p => [p.id, p]));
    }

    const comments = (rows || []).map(r => {
      if (r.user_id) {
        const profile = profileById.get(r.user_id);
        const name = displayName(profile);
        return {
          id: r.id,
          authorName: name,
          authorAvatar: displayAvatar(profile, name),
          content: r.content,
          createdAt: r.created_at,
          isOwn: user?.id === r.user_id,
        };
      }
      const name = r.guest_name || 'Guest';
      return {
        id: r.id,
        authorName: name,
        authorAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7F9172&color=fff`,
        content: r.content,
        createdAt: r.created_at,
        isOwn: false,
      };
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Blog comments fetch error:', error);
    return NextResponse.json({ error: 'Failed to load comments' }, { status: 500 });
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
    const content = typeof body?.content === 'string' ? body.content.trim() : '';
    const guestName = typeof body?.guestName === 'string' ? body.guestName.trim() : '';

    if (!content) {
      return NextResponse.json({ error: 'Comment cannot be empty' }, { status: 400 });
    }
    if (!user && !guestName) {
      return NextResponse.json({ error: 'Name is required to comment' }, { status: 400 });
    }

    const { data: inserted, error } = await supabase
      .from('blog_post_comments')
      .insert({
        post_slug: slug,
        user_id: user?.id || null,
        guest_name: user ? null : guestName,
        content,
      })
      .select('*')
      .single();

    if (error) throw error;

    let authorName = guestName || 'Guest';
    let authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=7F9172&color=fff`;

    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('id, full_name, username, profile_pic_url')
        .eq('id', user.id)
        .single();
      authorName = displayName(profile);
      authorAvatar = displayAvatar(profile, authorName);
    }

    return NextResponse.json({
      comment: {
        id: inserted.id,
        authorName,
        authorAvatar,
        content: inserted.content,
        createdAt: inserted.created_at,
        isOwn: true,
      },
    });
  } catch (error) {
    console.error('Blog comment create error:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
