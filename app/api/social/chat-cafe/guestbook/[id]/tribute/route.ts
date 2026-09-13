import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser } from '@/lib/chat-cafe-server';

// POST: toggle the caller's tribute (⭐ / ☕ / ❤️) on a guestbook plaque.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: entryId } = await params;
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { tributeType } = await request.json();
    if (!tributeType || typeof tributeType !== 'string') {
      return NextResponse.json({ error: 'tributeType is required' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const { data: existing } = await admin
      .from('chat_cafe_guestbook_tributes')
      .select('id')
      .eq('entry_id', entryId)
      .eq('user_id', user.id)
      .eq('tribute_type', tributeType)
      .maybeSingle();

    if (existing) {
      const { error } = await admin.from('chat_cafe_guestbook_tributes').delete().eq('id', existing.id);
      if (error) throw new Error(error.message);
      return NextResponse.json({ tributed: false });
    }

    const { error } = await admin
      .from('chat_cafe_guestbook_tributes')
      .insert({ entry_id: entryId, user_id: user.id, tribute_type: tributeType });
    if (error) throw new Error(error.message);

    return NextResponse.json({ tributed: true });
  } catch (error: any) {
    console.error('chat-cafe tribute POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
