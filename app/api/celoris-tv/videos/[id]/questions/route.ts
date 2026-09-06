import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diffMin = Math.floor((Date.now() - then) / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return 'Yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function displayName(profile: any) {
  return profile?.full_name || profile?.username || 'Celoris Student';
}

function displayAvatar(profile: any, name: string) {
  return (
    profile?.profile_pic_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7F9172&color=fff`
  );
}

type VideoTeacherInfo = {
  teacher_id: string | null;
  teacher_name: string | null;
  teacher_avatar_url: string | null;
};

// The lecture's real, signed-in teacher (video.teacher_id) is a distinct
// identity from a student profile — label an author "Instructor" only when
// their id actually matches the lecture owner, everyone else is a student.
function mapAuthor(authorId: string, video: VideoTeacherInfo, profile: any) {
  const isTeacher = !!video.teacher_id && authorId === video.teacher_id;

  if (isTeacher) {
    const name = video.teacher_name || 'Celoris Instructor';
    return {
      id: authorId,
      name,
      avatar:
        video.teacher_avatar_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7F9172&color=fff`,
      role: 'teacher' as const,
      title: 'Faculty / Instructor',
      verified: true,
    };
  }

  const name = displayName(profile);
  return {
    id: authorId,
    name,
    avatar: displayAvatar(profile, name),
    role: 'student' as const,
    title: 'Student Peer',
    verified: false,
  };
}

// Q&A questions/answers are real, shared rows (celoris_tv_questions /
// celoris_tv_answers) keyed to the lecture, not per-browser localStorage —
// so a lecture's instructor sees every student's doubt regardless of which
// device either of them is signed in on, and vice versa.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: videoId } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: video, error: videoError } = await supabase
      .from('celoris_tv_videos')
      .select('id, title, teacher_id, teacher_name, teacher_avatar_url')
      .eq('id', videoId)
      .single();

    if (videoError) throw videoError;
    if (!video) {
      return NextResponse.json({ error: 'Lecture not found' }, { status: 404 });
    }

    const { data: questions, error: questionsError } = await supabase
      .from('celoris_tv_questions')
      .select('*')
      .eq('video_id', videoId)
      .order('created_at', { ascending: true });

    if (questionsError) throw questionsError;

    const questionIds = (questions || []).map(q => q.id);

    let answers: any[] = [];
    if (questionIds.length > 0) {
      const { data: answersData, error: answersError } = await supabase
        .from('celoris_tv_answers')
        .select('*')
        .in('question_id', questionIds)
        .order('created_at', { ascending: true });

      if (answersError) throw answersError;
      answers = answersData || [];
    }

    // Look up display names/avatars for every real student (non-teacher)
    // author involved, in one batch.
    const nonTeacherAuthorIds = Array.from(
      new Set(
        [...(questions || []).map(q => q.author_id), ...answers.map(a => a.author_id)].filter(
          id => id !== video.teacher_id
        )
      )
    );

    let profileById = new Map<string, any>();
    if (nonTeacherAuthorIds.length > 0) {
      const { data: profiles } = await supabase
        .from('users')
        .select('id, full_name, username, profile_pic_url')
        .in('id', nonTeacherAuthorIds);
      profileById = new Map((profiles || []).map(p => [p.id, p]));
    }

    const answersByQuestionId = new Map<string, any[]>();
    for (const a of answers) {
      const list = answersByQuestionId.get(a.question_id) || [];
      list.push(a);
      answersByQuestionId.set(a.question_id, list);
    }

    const result = (questions || []).map(q => ({
      id: q.id,
      videoId: q.video_id,
      videoTitle: video.title,
      author: mapAuthor(q.author_id, video, profileById.get(q.author_id)),
      timestampSec: q.timestamp_sec,
      title: q.title,
      content: q.content,
      codeSnippet: q.code_snippet || undefined,
      createdAt: formatRelativeTime(q.created_at),
      upvotes: 0,
      isResolved: q.is_resolved,
      answers: (answersByQuestionId.get(q.id) || []).map(a => ({
        id: a.id,
        questionId: a.question_id,
        author: mapAuthor(a.author_id, video, profileById.get(a.author_id)),
        content: a.content,
        createdAt: formatRelativeTime(a.created_at),
        upvotes: 0,
        isEndorsedByTeacher: a.is_endorsed_by_teacher,
        isAccepted: a.is_accepted,
      })),
      tags: q.tags || [],
    }));

    return NextResponse.json({ questions: result });
  } catch (error) {
    console.error('Celoris TV questions list error:', error);
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}

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
    const { title, content, timestampSec, tags, codeSnippet } = body || {};

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Question content is required' }, { status: 400 });
    }

    const { data: video, error: videoError } = await supabase
      .from('celoris_tv_videos')
      .select('id, title, teacher_id, teacher_name, teacher_avatar_url')
      .eq('id', videoId)
      .single();

    if (videoError) throw videoError;
    if (!video) {
      return NextResponse.json({ error: 'Lecture not found' }, { status: 404 });
    }

    const { data: inserted, error: insertError } = await supabase
      .from('celoris_tv_questions')
      .insert({
        video_id: videoId,
        author_id: user.id,
        title: title.trim(),
        content: content.trim(),
        code_snippet: codeSnippet || null,
        tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Question'],
        timestamp_sec: typeof timestampSec === 'number' ? timestampSec : null,
      })
      .select('*')
      .single();

    if (insertError) throw insertError;

    let authorProfile = null;
    if (user.id !== video.teacher_id) {
      const { data: profile } = await supabase
        .from('users')
        .select('id, full_name, username, profile_pic_url')
        .eq('id', user.id)
        .single();
      authorProfile = profile;
    }

    return NextResponse.json({
      question: {
        id: inserted.id,
        videoId: inserted.video_id,
        videoTitle: video.title,
        author: mapAuthor(user.id, video, authorProfile),
        timestampSec: inserted.timestamp_sec,
        title: inserted.title,
        content: inserted.content,
        codeSnippet: inserted.code_snippet || undefined,
        createdAt: 'Just now',
        upvotes: 0,
        isResolved: inserted.is_resolved,
        answers: [],
        tags: inserted.tags || [],
      },
    });
  } catch (error) {
    console.error('Celoris TV question create error:', error);
    return NextResponse.json({ error: 'Failed to post question' }, { status: 500 });
  }
}
