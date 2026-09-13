import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser, getOrCreateProfile, isModerator, logModerationAction } from '@/lib/chat-cafe-server';

// PATCH: moderator-only message actions — soft-delete, pin, unpin.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: messageId } = await params;
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const action = body?.action as 'delete' | 'pin' | 'unpin';
    if (!['delete', 'pin', 'unpin'].includes(action)) {
      return NextResponse.json({ error: 'action must be delete, pin, or unpin' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const profile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New Patron');

    if (!isModerator(profile)) {
      return NextResponse.json({ error: 'Moderator access required' }, { status: 403 });
    }

    const updates: Record<string, any> =
      action === 'delete'
        ? { is_deleted: true, deletion_reason: body?.reason || 'Violation of house rules', deleted_by: user.id }
        : { is_pinned: action === 'pin' };

    const { data: updated, error } = await admin
      .from('chat_cafe_messages')
      .update(updates)
      .eq('id', messageId)
      .select('*, sender:chat_cafe_profiles(*)')
      .single();

    if (error) throw new Error(error.message);

    await logModerationAction(admin, {
      action,
      targetMessageId: messageId,
      moderatorId: user.id,
      moderatorName: profile.name,
      reason: body?.reason || null,
    });

    return NextResponse.json({ message: updated });
  } catch (error: any) {
    console.error('chat-cafe message PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
