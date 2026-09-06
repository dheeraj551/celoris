import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

// Posting an answer as the lecture's real, signed-in teacher
// (video.teacher_id) auto-endorses it and resolves the doubt — same
// behavior as before, just driven by the real account instead of the local
// student/teacher UI toggle.
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionId } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const content = body?.content;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Answer content is required' }, { status: 400 });
    }

    const { data: question, error: qErr } = await supabase
      .from('celoris_tv_questions')
      .select('id, video_id')
      .eq('id', questionId)
      .single();

    if (qErr) throw qErr;
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const { data: video, error: vErr } = await supabase
      .from('celoris_tv_videos')
      .select('id, teacher_id, teacher_name, teacher_avatar_url')
      .eq('id', question.video_id)
      .single();

    if (vErr) throw vErr;

    const isTeacher = !!video.teacher_id && user.id === video.teacher_id;

    const { data: inserted, error: insertError } = await supabase
      .from('celoris_tv_answers')
      .insert({
        question_id: questionId,
        author_id: user.id,
        content: content.trim(),
        is_endorsed_by_teacher: isTeacher,
      })
      .select('*')
      .single();

    if (insertError) throw insertError;

    let questionIsResolved: boolean | null = null;
    if (isTeacher) {
      const { data: updatedQ, error: updErr } = await supabase
        .from('celoris_tv_questions')
        .update({ is_resolved: true })
        .eq('id', questionId)
        .select('is_resolved')
        .single();
      if (!updErr) questionIsResolved = updatedQ?.is_resolved ?? true;
    }

    let authorProfile = null;
    if (!isTeacher) {
      const { data: profile } = await supabase
        .from('users')
        .select('id, full_name, username, profile_pic_url')
        .eq('id', user.id)
        .single();
      authorProfile = profile;
    }

    return NextResponse.json({
      answer: {
        id: inserted.id,
        questionId: inserted.question_id,
        author: mapAuthor(user.id, video, authorProfile),
        content: inserted.content,
        createdAt: 'Just now',
        upvotes: 0,
        isEndorsedByTeacher: inserted.is_endorsed_by_teacher,
        isAccepted: inserted.is_accepted,
      },
      questionIsResolved,
    });
  } catch (error) {
    console.error('Celoris TV answer create error:', error);
    return NextResponse.json({ error: 'Failed to post answer' }, { status: 500 });
  }
}
