import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Endorsing and accepting are moderation actions gated by Postgres RLS
// (celoris_tv_answers_update_own_or_teacher_or_question_author) — endorse
// only succeeds for the real signed-in teacher who owns the lecture; accept
// succeeds for that same teacher OR the question's own author.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: answerId } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const action = body?.action;

    if (action !== 'endorse' && action !== 'accept') {
      return NextResponse.json({ error: "action must be 'endorse' or 'accept'" }, { status: 400 });
    }

    const { data: current, error: fetchErr } = await supabase
      .from('celoris_tv_answers')
      .select('id, question_id, is_endorsed_by_teacher, is_accepted')
      .eq('id', answerId)
      .single();

    if (fetchErr) throw fetchErr;

    const field = action === 'endorse' ? 'is_endorsed_by_teacher' : 'is_accepted';
    const nextValue = !current[field as 'is_endorsed_by_teacher' | 'is_accepted'];

    const { data: updated, error } = await supabase
      .from('celoris_tv_answers')
      .update({ [field]: nextValue })
      .eq('id', answerId)
      .select('is_endorsed_by_teacher, is_accepted')
      .single();

    if (error) throw error;

    // Accepting an answer resolves the underlying doubt, same as before.
    let questionIsResolved: boolean | null = null;
    if (action === 'accept' && nextValue) {
      const { data: updatedQ, error: qErr } = await supabase
        .from('celoris_tv_questions')
        .update({ is_resolved: true })
        .eq('id', current.question_id)
        .select('is_resolved')
        .single();
      if (!qErr) questionIsResolved = updatedQ?.is_resolved ?? true;
    }

    return NextResponse.json({
      isEndorsedByTeacher: updated.is_endorsed_by_teacher,
      isAccepted: updated.is_accepted,
      questionIsResolved,
    });
  } catch (error) {
    console.error('Celoris TV answer update error:', error);
    return NextResponse.json({ error: 'Failed to update answer' }, { status: 500 });
  }
}
