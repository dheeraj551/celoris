import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser, getOrCreateProfile, isModerator } from '@/lib/chat-cafe-server';

// PATCH: moderator resolves or dismisses a report.
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: reportId } = await params;
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { status } = await request.json();
    if (!['resolved', 'dismissed'].includes(status)) {
      return NextResponse.json({ error: 'status must be resolved or dismissed' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const profile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New User');
    if (!isModerator(profile)) {
      return NextResponse.json({ error: 'Moderator access required' }, { status: 403 });
    }

    const { error } = await admin.from('chat_cafe_reports').update({ status }).eq('id', reportId);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('chat-cafe report PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
