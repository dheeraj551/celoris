import { NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Celoris TV's own AppContext ships a mock "Alex Rivera" student profile as
// filler content (name, avatar, bio, institution) so the standalone app has
// something to render before real backend wiring existed. Real, signed-in
// identity for THIS Celoris account lives in public.users — this route
// hands back just the display fields (name/avatar) so Q&A posts, answers,
// etc. show the actual logged-in person instead of the mock persona.
export async function GET() {
  try {
    const supabase = await createRouteClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('full_name, username, profile_pic_url')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    const name =
      profile?.full_name || profile?.username || user.email?.split('@')[0] || 'Celoris Student';

    return NextResponse.json({
      id: user.id,
      name,
      avatar:
        profile?.profile_pic_url ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7F9172&color=fff`,
    });
  } catch (error) {
    console.error('Celoris TV profile fetch error:', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}
