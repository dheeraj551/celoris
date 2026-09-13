import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

// Admin-only: the last handful of private whispers addressed to this AI
// character "officer" persona, so the dashboard can show them without the
// operator needing to also have the live café open. Uses the service-role
// client (bypasses RLS) the same way every other route on this dashboard
// does — the chat_cafe_messages_whisper_support RLS policy is what keeps
// whispers private from other *patrons*, not from this admin surface.
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: characterId } = await params;
    const admin = createSupabaseClientForServer();
    const characterUserId = `ai_${characterId}`;

    const { data, error } = await admin
      .from('chat_cafe_messages')
      .select('id, content, created_at, sender_id, sender_type, ai_character_id, sender:chat_cafe_profiles(id, name), ai_character:chat_cafe_ai_characters(name)')
      .eq('whisper_to->>id', characterUserId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw new Error(error.message);

    const whispers = (data || []).map((row: any) => {
      const isFromOfficer = row.sender_type === 'ai';
      return {
        id: row.id,
        content: row.content,
        createdAt: row.created_at,
        senderId: isFromOfficer ? `ai_${row.ai_character_id}` : row.sender_id,
        senderName: isFromOfficer ? row.ai_character?.name || 'AI regular' : row.sender?.name || 'Someone',
      };
    });

    return NextResponse.json({ whispers });
  } catch (error: any) {
    console.error('admin chat-cafe ai-character whispers GET error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
