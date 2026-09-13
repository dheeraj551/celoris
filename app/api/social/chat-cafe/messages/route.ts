import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser, getOrCreateProfile, isMuted, isModerator } from '@/lib/chat-cafe-server';

// POST: send a chat message (plain text, a drink gift, or a discussion-topic
// announcement all flow through here). Reads happen directly from the
// browser via Supabase + RLS + Realtime — this route only needs to handle
// the write, because that's the one place ban/mute/slow-mode have to be
// enforced no matter which client is talking.
export async function POST(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { tableId, content, replyTo, drinkGift, isDiscussionTopic, discussionData } = body || {};

    if (!tableId || typeof tableId !== 'string') {
      return NextResponse.json({ error: 'tableId is required' }, { status: 400 });
    }
    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const profile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New Patron');

    if (profile.is_banned) {
      return NextResponse.json({ error: 'You have been barred from Chat Café.', banned: true }, { status: 403 });
    }
    if (isMuted(profile)) {
      return NextResponse.json({ error: 'You are currently muted and cannot send messages.', muted: true }, { status: 403 });
    }

    // Slow mode: staff are exempt, everyone else has to wait between messages.
    if (!isModerator(profile)) {
      const { data: table } = await admin
        .from('chat_cafe_tables')
        .select('slow_mode_seconds')
        .eq('id', tableId)
        .maybeSingle();

      const slowSeconds = table?.slow_mode_seconds || 0;
      if (slowSeconds > 0) {
        const { data: lastMsg } = await admin
          .from('chat_cafe_messages')
          .select('created_at')
          .eq('table_id', tableId)
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastMsg) {
          const elapsedMs = Date.now() - new Date(lastMsg.created_at).getTime();
          const remaining = slowSeconds - Math.floor(elapsedMs / 1000);
          if (remaining > 0) {
            return NextResponse.json(
              { error: `Slow mode is on — wait ${remaining}s before sending another message.`, slowMode: true, remaining },
              { status: 429 }
            );
          }
        }
      }
    }

    const insertRow: Record<string, any> = {
      table_id: tableId,
      sender_id: user.id,
      content: content.slice(0, 1000),
    };
    if (replyTo && typeof replyTo === 'object') {
      insertRow.reply_to = {
        id: replyTo.id,
        senderName: replyTo.senderName,
        content: String(replyTo.content || '').slice(0, 120),
      };
    }
    if (drinkGift && typeof drinkGift === 'object') insertRow.drink_gift = drinkGift;
    if (isDiscussionTopic) insertRow.is_discussion_topic = true;
    if (discussionData && typeof discussionData === 'object') insertRow.discussion_data = discussionData;

    const { data: inserted, error: insertError } = await admin
      .from('chat_cafe_messages')
      .insert(insertRow)
      .select('*, sender:chat_cafe_profiles(*)')
      .single();

    if (insertError) throw new Error(insertError.message);

    return NextResponse.json({ message: inserted });
  } catch (error: any) {
    console.error('chat-cafe messages POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
