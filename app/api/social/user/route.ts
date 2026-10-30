import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { createRouteClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, name, userId: explicitUserId } = body;

    let userId = explicitUserId;
    try {
      const client = await createRouteClient();
      const { data: { user } } = await client.auth.getUser();
      if (user?.id) userId = user.id;
    } catch {
      // Non-blocking
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const cleanUsername = (username || '').toLowerCase().trim().replace(/[^a-z0-9_]/g, '');
    const cleanName = (name || '').trim();

    const admin = createSupabaseClientForServer();

    // 1. Update public.users
    const updatesUsers: Record<string, any> = {};
    if (cleanUsername) updatesUsers.username = cleanUsername;
    if (cleanName) updatesUsers.full_name = cleanName;

    if (Object.keys(updatesUsers).length > 0) {
      await admin
        .from('users')
        .update(updatesUsers)
        .eq('id', userId);
    }

    // 2. Update public.profiles
    const updatesProfiles: Record<string, any> = {};
    if (cleanName) {
      updatesProfiles.full_name = cleanName;
      updatesProfiles.name = cleanName;
    }
    if (Object.keys(updatesProfiles).length > 0) {
      await admin
        .from('profiles')
        .update(updatesProfiles)
        .eq('id', userId);
    }

    return NextResponse.json({
      success: true,
      username: cleanUsername,
      name: cleanName,
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
