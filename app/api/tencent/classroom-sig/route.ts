import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { resolveRoomAccess } from '@/lib/cafe-room-access'
import { generateTrtcUserSig } from '@/lib/tencent-usersig'

// Tencent RTC credentials for the 2D whiteboard classrooms (voice + screen
// share). The 3D classrooms stay on Agora (/api/agora/token), so the two room
// types don't depend on the same provider.
//
// Same checks as the Agora classroom token: signed in, the credential is only
// for your own user id, and you must be admitted to the room (its trainer, or
// a student who entered the room's code / the room has no code).

export const dynamic = 'force-dynamic'

const SIG_SECONDS = 6 * 3600

export async function POST(request: Request) {
  try {
    const { roomId } = await request.json().catch(() => ({}))
    if (typeof roomId !== 'string' || !/^[0-9a-f-]{36}$/i.test(roomId)) {
      return NextResponse.json({ error: 'Invalid classroom' }, { status: 400 })
    }

    const routeClient = await createRouteClient()
    const {
      data: { user },
    } = await routeClient.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const admin = createSupabaseClientForServer()
    const access = await resolveRoomAccess(admin, roomId, user.id)
    if (!access.roomExists || access.role === 'none') {
      return NextResponse.json({ error: 'Not admitted to this classroom' }, { status: 403 })
    }

    const { userSig, sdkAppId } = generateTrtcUserSig(user.id, SIG_SECONDS)
    return NextResponse.json({
      sdkAppId,
      userId: user.id,
      userSig,
      roomId: `classroom_${roomId}`,
      role: access.role,
    })
  } catch (err: any) {
    console.error('[tencent classroom-sig] error:', err)
    return NextResponse.json({ error: 'Could not get voice credentials' }, { status: 500 })
  }
}
