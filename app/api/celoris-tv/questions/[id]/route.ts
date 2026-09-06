import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Toggling resolved and deleting are moderation actions gated by Postgres
// RLS itself (celoris_tv_questions_update_own_or_teacher /
// _delete_own_or_teacher policies) — only the question's own author, or the
// real signed-in teacher who owns the lecture, can actually change a row
// they don't own; anyone else's request here simply matches zero rows.
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionId } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: current, error: fetchErr } = await supabase
      .from('celoris_tv_questions')
      .select('is_resolved')
      .eq('id', questionId)
      .single();

    if (fetchErr) throw fetchErr;

    const { data: updated, error } = await supabase
      .from('celoris_tv_questions')
      .update({ is_resolved: !current.is_resolved })
      .eq('id', questionId)
      .select('is_resolved')
      .single();

    if (error) throw error;

    return NextResponse.json({ isResolved: updated.is_resolved });
  } catch (error) {
    console.error('Celoris TV question update error:', error);
    return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: questionId } = await params;
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { error } = await supabase.from('celoris_tv_questions').delete().eq('id', questionId);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Celoris TV question delete error:', error);
    return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
  }
}
