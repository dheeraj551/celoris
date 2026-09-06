import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Accepts a full YouTube URL (watch, youtu.be, embed, shorts) or a bare
// 11-character video ID and returns just the ID. Returns null if nothing
// recognizable was found.
function parseYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Bare 11-char YouTube ID (letters, digits, - and _)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.searchParams.get('v')) {
        const id = url.searchParams.get('v')!;
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
      const parts = url.pathname.split('/').filter(Boolean);
      // /embed/ID, /shorts/ID, /live/ID
      const idx = parts.findIndex(p => ['embed', 'shorts', 'live'].includes(p));
      if (idx !== -1 && parts[idx + 1]) {
        const id = parts[idx + 1];
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    // Not a valid URL and not a bare ID
    return null;
  }

  return null;
}

function mapRowToVideo(row: any, userReaction: 'like' | 'dislike' | null = null) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    videoUrl: '',
    youtubeId: row.youtube_id,
    thumbnailUrl: row.thumbnail_url || `https://img.youtube.com/vi/${row.youtube_id}/hqdefault.jpg`,
    duration: row.duration_seconds || 900,
    views: row.view_count || 0,
    likes: row.like_count || 0,
    dislikes: row.dislike_count || 0,
    userReaction,
    publishedAt: row.created_at,
    category: row.subject,
    subject: row.subject,
    gradeLevel: row.grade_level,
    difficulty: row.difficulty,
    tags: row.tags || [],
    author: {
      id: row.teacher_id || 'unknown',
      name: row.teacher_name || 'Celoris Instructor',
      avatar:
        row.teacher_avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(row.teacher_name || 'Instructor')}&background=7F9172&color=fff`,
      role: 'professor',
      verified: true,
    },
    chapters: row.chapters || [],
    resources: row.resources || [],
    transcript: [],
    quizzes: [],
    isFeatured: false,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Auth-gated: a logged-out request (or one hitting this route directly
    // without a session) never gets the video list or the youtube_id it
    // contains.
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('celoris_tv_videos')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Attach this viewer's own like/dislike (if any) to each lecture so the
    // client can show the button already toggled on instead of resetting to
    // "not reacted" on every reload.
    const videoIds = (data || []).map(row => row.id);
    let reactionByVideoId = new Map<string, 'like' | 'dislike'>();
    if (videoIds.length > 0) {
      const { data: reactions, error: reactionsError } = await supabase
        .from('celoris_tv_video_reactions')
        .select('video_id, reaction')
        .eq('user_id', user.id)
        .in('video_id', videoIds);

      if (!reactionsError && reactions) {
        reactionByVideoId = new Map(reactions.map(r => [r.video_id, r.reaction]));
      }
    }

    return NextResponse.json({
      videos: (data || []).map(row => mapRowToVideo(row, reactionByVideoId.get(row.id) || null)),
    });
  } catch (error) {
    console.error('Celoris TV videos list error:', error);
    return NextResponse.json({ error: 'Failed to load videos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Teacher Studio (and publishing specifically) requires holding at least
    // this many credits. Checked here — not just in the UI — since the UI
    // gate alone can be bypassed by calling this route directly.
    const { data: userRow, error: userRowError } = await supabase
      .from('users')
      .select('wallet_balance')
      .eq('id', user.id)
      .single();

    if (userRowError) throw userRowError;

    const TEACHER_ACCESS_CREDIT_THRESHOLD = 5000;
    if ((userRow?.wallet_balance || 0) < TEACHER_ACCESS_CREDIT_THRESHOLD) {
      return NextResponse.json(
        { error: `Publishing requires at least ${TEACHER_ACCESS_CREDIT_THRESHOLD.toLocaleString()} credits in your wallet.` },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      youtubeLink,
      subject,
      gradeLevel,
      difficulty,
      durationMinutes,
      tags,
      chapters,
      resources,
      teacherName,
      teacherAvatarUrl,
    } = body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const youtubeId = parseYouTubeId(youtubeLink);
    if (!youtubeId) {
      return NextResponse.json(
        { error: 'Could not find a valid YouTube video ID in that link' },
        { status: 400 }
      );
    }

    const durationSeconds = Math.max(1, Math.round((Number(durationMinutes) || 15) * 60));

    const { data, error } = await supabase
      .from('celoris_tv_videos')
      .insert({
        title: title.trim(),
        description: (description || '').trim(),
        youtube_id: youtubeId,
        thumbnail_url: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        duration_seconds: durationSeconds,
        subject: subject || 'General Education',
        grade_level: gradeLevel || 'Undergraduate',
        difficulty: difficulty || 'Intermediate',
        tags: Array.isArray(tags) ? tags : [],
        chapters: Array.isArray(chapters) ? chapters : [],
        resources: Array.isArray(resources) ? resources : [],
        teacher_id: user.id,
        teacher_name: teacherName || user.email?.split('@')[0] || 'Celoris Instructor',
        teacher_avatar_url: teacherAvatarUrl || null,
      })
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json({ video: mapRowToVideo(data) });
  } catch (error) {
    console.error('Celoris TV video publish error:', error);
    return NextResponse.json({ error: 'Failed to publish lecture' }, { status: 500 });
  }
}
