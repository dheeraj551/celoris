import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser, getOrCreateProfile, isModerator } from '@/lib/chat-cafe-server';

// GET: moderator-only reports queue (chat_cafe_reports has no client SELECT
// policy at all, so this route is the only way to read it).
export async function GET() {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const admin = createSupabaseClientForServer();
    const profile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New User');
    if (!isModerator(profile)) {
      return NextResponse.json({ error: 'Moderator access required' }, { status: 403 });
    }

    const { data, error } = await admin
      .from('chat_cafe_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw new Error(error.message);

    const reports = (data || []).map((r: any) => ({
      id: r.id,
      messageId: r.message_id,
      messagePreview: r.message_preview,
      reportedUserId: r.reported_user_id,
      reportedUserName: r.reported_user_name,
      reportedBy: r.reported_by_name,
      reason: r.reason,
      note: r.note,
      timestamp: new Date(r.created_at).getTime(),
      status: r.status,
    }));

    return NextResponse.json({ reports });
  } catch (error: any) {
    console.error('chat-cafe reports GET error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}

// POST: any signed-in patron can flag a message.
export async function POST(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { messageId, reason, note } = await request.json();
    if (!messageId || !reason) {
      return NextResponse.json({ error: 'messageId and reason are required' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const reporterProfile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New User');

    const { data: message, error: msgError } = await admin
      .from('chat_cafe_messages')
      .select('id, content, sender_id, sender:chat_cafe_profiles(name)')
      .eq('id', messageId)
      .maybeSingle();

    if (msgError) throw new Error(msgError.message);
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const senderName = Array.isArray(message.sender) ? message.sender[0]?.name : (message.sender as any)?.name;

    const { error: insertError } = await admin.from('chat_cafe_reports').insert({
      message_id: messageId,
      message_preview: String(message.content || '').slice(0, 200),
      reported_user_id: message.sender_id,
      reported_user_name: senderName || 'Unknown User',
      reported_by: user.id,
      reported_by_name: reporterProfile.name,
      reason,
      note: note || null,
    });

    if (insertError) throw new Error(insertError.message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('chat-cafe reports POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
