import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Accepts a full YouTube URL (watch, youtu.be, embed, shorts) or a bare
// 11-character video ID and returns just the ID. Returns null if nothing
// recognizable was found. (Kept in sync with the copy in ../route.ts.)
function parseYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

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
      const idx = parts.findIndex(p => ['embed', 'shorts', 'live'].includes(p));
      if (idx !== -1 && parts[idx + 1]) {
        const id = parts[idx + 1];
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
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

// Edits one of the caller's own published lectures. Only the fields present
// in the body are changed; everything else on the row is left as-is. Scoped
// to `teacher_id = auth.uid()` both here and via RLS (celoris_tv_videos_
// update_own) — the extra filter here just turns a mismatched id/owner into
// a clean 404 instead of relying solely on the database to reject the write.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    } = body || {};

    const update: Record<string, any> = {};

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 });
      }
      update.title = title.trim();
    }

    if (description !== undefined) {
      update.description = (description || '').trim();
    }

    if (youtubeLink !== undefined) {
      const youtubeId = parseYouTubeId(youtubeLink);
      if (!youtubeId) {
        return NextResponse.json(
          { error: 'Could not find a valid YouTube video ID in that link' },
          { status: 400 }
        );
      }
      update.youtube_id = youtubeId;
      update.thumbnail_url = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
    }

    if (subject !== undefined) update.subject = subject;
    if (gradeLevel !== undefined) update.grade_level = gradeLevel;
    if (difficulty !== undefined) update.difficulty = difficulty;
    if (durationMinutes !== undefined) {
      update.duration_seconds = Math.max(1, Math.round((Number(durationMinutes) || 15) * 60));
    }
    if (Array.isArray(tags)) update.tags = tags;
    if (Array.isArray(chapters)) update.chapters = chapters;
    if (Array.isArray(resources)) update.resources = resources;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('celoris_tv_videos')
      .update(update)
      .eq('id', videoId)
      .eq('teacher_id', user.id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Lecture not found or not yours to edit' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ video: mapRowToVideo(data) });
  } catch (error) {
    console.error('Celoris TV video update error:', error);
    return NextResponse.json({ error: 'Failed to update lecture' }, { status: 500 });
  }
}

// Deletes one of the caller's own published lectures. Q&A threads and
// reactions tied to it are removed automatically (ON DELETE CASCADE on
// celoris_tv_questions.video_id and celoris_tv_video_reactions.video_id).
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: videoId } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('celoris_tv_videos')
      .delete()
      .eq('id', videoId)
      .eq('teacher_id', user.id)
      .select('id')
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return NextResponse.json({ error: 'Lecture not found or not yours to delete' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Celoris TV video delete error:', error);
    return NextResponse.json({ error: 'Failed to delete lecture' }, { status: 500 });
  }
}
