import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { allLanes, laneForUser } from '@/lib/polyvault-lanes'

// Your PolyVault download lane (from your plan) plus every plan's lane.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = createSupabaseClientForServer()
    const lanes = await allLanes(admin)
    let lane = lanes[0]
    try {
      const client = await createRouteClient()
      const {
        data: { user },
      } = await client.auth.getUser()
      if (user) lane = await laneForUser(admin, user.id)
    } catch {
      // Signed out → the Free lane.
    }
    return NextResponse.json({ lane, lanes })
  } catch (err) {
    console.error('[polyvault lane] error:', err)
    return NextResponse.json({ error: 'Could not load download speeds.' }, { status: 500 })
  }
}
