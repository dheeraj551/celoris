import { NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { resolveRoomAccess } from '@/lib/cafe-room-access'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { roomId } = await request.json().catch(() => ({}))
    if (typeof roomId !== 'string' || !/^[0-9a-f-]{36}$/i.test(roomId)) {
      return NextResponse.json({ error: 'Invalid classroom id' }, { status: 400 })
    }

    const routeClient = await createRouteClient()
    const {
      data: { user },
    } = await routeClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const admin = createSupabaseClientForServer()
    const access = await resolveRoomAccess(admin, roomId, user.id)
    if (!access.roomExists || access.role === 'none') {
      return NextResponse.json({ error: 'Not admitted to this classroom' }, { status: 403 })
    }

    const apiKey = (process.env.LIVEKIT_API_KEY || 'celoris_livekit_key').trim()
    const apiSecret = (process.env.LIVEKIT_API_SECRET || '2ad5f6c4ef74a31a8293c83524d5cd907703c814b954717a').trim()
    const serverUrl = (process.env.LIVEKIT_URL || process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://livekit.celoris.in').trim()

    const isTrainer = access.role === 'trainer'
    const at = new AccessToken(apiKey, apiSecret, {
      identity: user.id,
      name: user.user_metadata?.full_name || (isTrainer ? 'Trainer' : 'Student'),
      ttl: '6h',
    })

    at.addGrant({
      room: `classroom_${roomId}`,
      roomJoin: true,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    })

    const token = await at.toJwt()

    return NextResponse.json({
      token,
      serverUrl,
      roomName: `classroom_${roomId}`,
      identity: user.id,
      role: access.role,
      provider: 'livekit',
    })
  } catch (err: any) {
    console.error('[livekit classroom-token] error:', err)
    return NextResponse.json({ error: 'Could not generate LiveKit classroom token' }, { status: 500 })
  }
}
