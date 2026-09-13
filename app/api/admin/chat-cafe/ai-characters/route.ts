import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

// Admin-only AI character roster (create + list). Like every other route
// under app/api/admin/*, gated client-side via the "admin_session" flag —
// see app/api/admin/cafe/rooms for the disclosed convention this follows.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = createSupabaseClientForServer();
    const { data, error } = await admin
      .from('chat_cafe_ai_characters')
      .select('*')
      .order('table_id')
      .order('name');

    if (error) throw new Error(error.message);
    return NextResponse.json({ characters: data || [] });
  } catch (error: any) {
    console.error('admin chat-cafe ai-characters GET error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, name, avatarId, avatarColor, accessory, backstory, personality } = body || {};

    if (!tableId || typeof tableId !== 'string') {
      return NextResponse.json({ error: 'tableId is required' }, { status: 400 });
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const { data, error } = await admin
      .from('chat_cafe_ai_characters')
      .insert({
        table_id: tableId,
        name: name.trim().slice(0, 40),
        avatar_id: typeof avatarId === 'string' && avatarId ? avatarId : 'cat_barista',
        avatar_color: typeof avatarColor === 'string' && avatarColor ? avatarColor : 'from-amber-400 to-orange-500',
        accessory: typeof accessory === 'string' ? accessory : null,
        backstory: typeof backstory === 'string' ? backstory.slice(0, 2000) : '',
        personality: typeof personality === 'string' ? personality.slice(0, 1000) : '',
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);
    return NextResponse.json({ character: data });
  } catch (error: any) {
    console.error('admin chat-cafe ai-characters POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
