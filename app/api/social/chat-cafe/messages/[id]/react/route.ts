import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser } from '@/lib/chat-cafe-server';

// POST: toggle the caller's reaction (an emoji) on a message.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: messageId } = await params;
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { emoji } = await request.json();
    if (!emoji || typeof emoji !== 'string') {
      return NextResponse.json({ error: 'emoji is required' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const { data: existing } = await admin
      .from('chat_cafe_message_reactions')
      .select('id')
      .eq('message_id', messageId)
      .eq('emoji', emoji)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      const { error } = await admin.from('chat_cafe_message_reactions').delete().eq('id', existing.id);
      if (error) throw new Error(error.message);
      return NextResponse.json({ reacted: false });
    }

    const { error } = await admin.from('chat_cafe_message_reactions').insert({ message_id: messageId, emoji, user_id: user.id });
    if (error) throw new Error(error.message);
    return NextResponse.json({ reacted: true });
  } catch (error: any) {
    console.error('chat-cafe reaction POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
