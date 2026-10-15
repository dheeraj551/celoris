import { NextResponse } from 'next/server';
import { AccessToken } from 'livekit-server-sdk';
import { createRouteClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { roomId, participantName, role = 'interviewer' } = await request.json().catch(() => ({}));
    
    if (!roomId || typeof roomId !== 'string') {
      return NextResponse.json({ error: 'Invalid interview room id' }, { status: 400 });
    }

    // Attempt to resolve logged-in user if available
    let identity = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let displayName = participantName || (role === 'interviewer' ? 'Interviewer' : 'Candidate');

    try {
      const routeClient = await createRouteClient();
      const { data: { user } } = await routeClient.auth.getUser();
      if (user) {
        identity = user.id;
        displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || displayName;
      }
    } catch {
      // Allow unauthenticated candidates to join with passcode/link
    }

    const apiKey = (process.env.LIVEKIT_API_KEY || 'celoris_livekit_key').trim();
    const apiSecret = (process.env.LIVEKIT_API_SECRET || '2ad5f6c4ef74a31a8293c83524d5cd907703c814b954717a').trim();
    const serverUrl = (process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://livekit.celoris.in').trim();

    const cleanRoomName = `interview_${roomId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    const at = new AccessToken(apiKey, apiSecret, {
      identity,
      name: displayName,
      ttl: '4h',
    });

    at.addGrant({
      room: cleanRoomName,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      serverUrl,
      roomName: cleanRoomName,
      identity,
      displayName,
      role,
      provider: 'livekit',
    });
  } catch (err: any) {
    console.error('[livekit interview-token] error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to issue interview token' },
      { status: 500 }
    );
  }
}
