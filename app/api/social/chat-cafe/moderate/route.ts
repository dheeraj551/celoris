import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser, getOrCreateProfile, isModerator, logModerationAction } from '@/lib/chat-cafe-server';

type ModerateAction = 'mute' | 'unmute' | 'ban' | 'unban' | 'slowmode';

// POST: every staff-only moderation action that isn't a per-message action
// (those live in /api/social/chat-cafe/messages/[id]). One route keeps the
// "is this caller actually a moderator?" check in exactly one place.
export async function POST(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const action = body?.action as ModerateAction;
    if (!['mute', 'unmute', 'ban', 'unban', 'slowmode'].includes(action)) {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const callerProfile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New User');

    if (!isModerator(callerProfile)) {
      return NextResponse.json({ error: 'Moderator access required' }, { status: 403 });
    }

    if (action === 'slowmode') {
      const { tableId, seconds } = body;
      if (!tableId || typeof seconds !== 'number') {
        return NextResponse.json({ error: 'tableId and seconds are required' }, { status: 400 });
      }
      const { error } = await admin
        .from('chat_cafe_tables')
        .update({ slow_mode_seconds: Math.max(0, Math.floor(seconds)), updated_at: new Date().toISOString() })
        .eq('id', tableId);
      if (error) throw new Error(error.message);

      await logModerationAction(admin, {
        action: 'slowmode',
        moderatorId: user.id,
        moderatorName: callerProfile.name,
        reason: `Set to ${seconds}s on ${tableId}`,
      });
      return NextResponse.json({ success: true });
    }

    const { targetUserId, targetUserName, reason } = body;
    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
    }

    if (action === 'mute') {
      const durationMin = Math.max(1, Math.min(1440, Number(body.durationMin) || 10));
      const mutedUntil = new Date(Date.now() + durationMin * 60 * 1000).toISOString();
      const { error } = await admin
        .from('chat_cafe_profiles')
        .update({ muted_until: mutedUntil, updated_at: new Date().toISOString() })
        .eq('id', targetUserId);
      if (error) throw new Error(error.message);
      await logModerationAction(admin, { action: 'mute', targetUserId, targetUserName, moderatorId: user.id, moderatorName: callerProfile.name, reason });
      return NextResponse.json({ success: true, mutedUntil });
    }

    if (action === 'unmute') {
      const { error } = await admin
        .from('chat_cafe_profiles')
        .update({ muted_until: null, updated_at: new Date().toISOString() })
        .eq('id', targetUserId);
      if (error) throw new Error(error.message);
      await logModerationAction(admin, { action: 'unmute', targetUserId, targetUserName, moderatorId: user.id, moderatorName: callerProfile.name });
      return NextResponse.json({ success: true });
    }

    if (action === 'ban') {
      const { error } = await admin
        .from('chat_cafe_profiles')
        .update({ is_banned: true, ban_reason: reason || 'Severe disruption / harassment', updated_at: new Date().toISOString() })
        .eq('id', targetUserId);
      if (error) throw new Error(error.message);
      await logModerationAction(admin, { action: 'ban', targetUserId, targetUserName, moderatorId: user.id, moderatorName: callerProfile.name, reason });
      return NextResponse.json({ success: true });
    }

    if (action === 'unban') {
      const { error } = await admin
        .from('chat_cafe_profiles')
        .update({ is_banned: false, ban_reason: null, updated_at: new Date().toISOString() })
        .eq('id', targetUserId);
      if (error) throw new Error(error.message);
      await logModerationAction(admin, { action: 'unban', targetUserId, targetUserName, moderatorId: user.id, moderatorName: callerProfile.name });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unhandled action' }, { status: 400 });
  } catch (error: any) {
    console.error('chat-cafe moderate POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
