import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser, getOrCreateProfile } from '@/lib/chat-cafe-server';

// POST: sign the Wall of Fame guestbook.
export async function POST(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { message, motto, origin, stamp, plaqueStyle, tableId } = body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }
    if (!stamp || !plaqueStyle) {
      return NextResponse.json({ error: 'stamp and plaqueStyle are required' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const profile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New Patron');

    const { data: entry, error } = await admin
      .from('chat_cafe_guestbook_entries')
      .insert({
        table_id: tableId || null,
        user_id: user.id,
        user_name: profile.name,
        user_avatar_id: profile.avatar_id,
        user_avatar_color: profile.avatar_color,
        user_role: profile.role,
        message: message.trim().slice(0, 320),
        motto: motto ? String(motto).slice(0, 60) : null,
        origin: origin ? String(origin).slice(0, 50) : null,
        stamp,
        plaque_style: plaqueStyle,
      })
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ entry });
  } catch (error: any) {
    console.error('chat-cafe guestbook POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
