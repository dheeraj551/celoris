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

    const { data: inserted, error: insertError } = await admin
      .from('chat_cafe_messages')
      .insert({
        table_id: character.table_id,
        sender_type: 'ai',
        ai_character_id: character.id,
        content: content.slice(0, 500),
      })
      .select('*, ai_character:chat_cafe_ai_characters(*)')
      .single();

    if (insertError) throw new Error(insertError.message);
    return NextResponse.json({ message: inserted });
  } catch (error: any) {
    console.error('admin chat-cafe ai-character speak error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
