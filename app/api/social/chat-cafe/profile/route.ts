import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser, getOrCreateProfile, profileRowToUserProfile } from '@/lib/chat-cafe-server';

// GET: fetch (creating on first visit) the caller's Chat Café persona.
export async function GET() {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const admin = createSupabaseClientForServer();
    const fallbackName =
      (user.user_metadata?.full_name as string) ||
      (user.user_metadata?.name as string) ||
      user.email?.split('@')[0] ||
      'New User';

    const profile = await getOrCreateProfile(admin, user.id, fallbackName);
    return NextResponse.json({ profile: profileRowToUserProfile(profile) });
  } catch (error: any) {
    console.error('chat-cafe profile GET error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}

// PATCH: update the caller's own display fields (name/avatar/status/drink/bubble style).
// role, is_banned, ban_reason and muted_until are intentionally never accepted
// here — those only change via /api/social/chat-cafe/moderate or the admin panel.
export async function PATCH(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (typeof body.name === 'string' && body.name.trim()) updates.name = body.name.trim().slice(0, 40);
    if (typeof body.avatarId === 'string') updates.avatar_id = body.avatarId;
    if (typeof body.avatarColor === 'string') updates.avatar_color = body.avatarColor;
    if (typeof body.accessory === 'string') updates.accessory = body.accessory;
    if (typeof body.statusText === 'string') updates.status_text = body.statusText.slice(0, 120);
    if (typeof body.currentDrink === 'string') updates.current_drink = body.currentDrink;
    if (typeof body.bubbleStyle === 'string') updates.bubble_style = body.bubbleStyle;

    const admin = createSupabaseClientForServer();
    // Make sure the profile exists first (first save could arrive before any GET).
    await getOrCreateProfile(admin, user.id, (user.email?.split('@')[0] as string) || 'New User');

    const { data, error } = await admin
      .from('chat_cafe_profiles')
      .update(updates)
      .eq('id', user.id)
      .select('*')
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ profile: profileRowToUserProfile(data) });
  } catch (error: any) {
    console.error('chat-cafe profile PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
