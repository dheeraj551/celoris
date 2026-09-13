import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

// Admin-only: post a line directly to a table's chat as one of its AI
// characters. This is the only way an AI character speaks now — there's no
// automatic/AI-generated dialogue, just a moderator or admin typing the
// line themselves (here, or from the live Staff Console's "AI Characters"
// tab, which does the same insert via a different auth path).
export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: characterId } = await params;
    const body = await request.json();
    const content = typeof body?.content === 'string' ? body.content.trim() : '';

    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    // A private whisper reply — {id, name} snapshot of the real patron this
    // character is replying to. Row-level security on chat_cafe_messages
    // is what actually keeps this private (see the
    // chat_cafe_messages_whisper_support migration): only the named
    // recipient, the sender, or staff can ever select the row back out.
    let whisperToRow: { id: string; name: string } | undefined;
    const whisperTo = body?.whisperTo;
    if (whisperTo && typeof whisperTo === 'object' && typeof whisperTo.id === 'string' && whisperTo.id) {
      whisperToRow = { id: whisperTo.id, name: String(whisperTo.name || 'Someone').slice(0, 40) };
    }

    const admin = createSupabaseClientForServer();

    const { data: character, error: charError } = await admin
      .from('chat_cafe_ai_characters')
      .select('id, table_id')
      .eq('id', characterId)
      .maybeSingle();

    if (charError) throw new Error(charError.message);
    if (!character) {
      return NextResponse.json({ error: 'AI character not found' }, { status: 404 });
    }

    const insertRow: Record<string, any> = {
      table_id: character.table_id,
      sender_type: 'ai',
      ai_character_id: character.id,
      content: content.slice(0, 500),
    };
    if (whisperToRow) insertRow.whisper_to = whisperToRow;

    const { data: inserted, error: insertError } = await admin
      .from('chat_cafe_messages')
      .insert(insertRow)
      .select('*, ai_character:chat_cafe_ai_characters(*)')
      .single();

    if (insertError) throw new Error(insertError.message);
    return NextResponse.json({ message: inserted });
  } catch (error: any) {
    console.error('admin chat-cafe ai-character speak error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
