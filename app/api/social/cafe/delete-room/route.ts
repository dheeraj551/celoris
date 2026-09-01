import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Deletes (soft-deletes) a Celoris Cafe room on behalf of its host.
//
// This intentionally goes through the service-role client instead of relying
// on client-side RLS. Ownership is verified here, server-side, before the
// write happens, so it's just as safe as an RLS policy — it just sidesteps
// the "new row violates row-level security policy" issue we were hitting
// when the browser tried to do this update directly against cafe_classrooms.
export async function POST(request: Request) {
  try {
    const { roomId } = await request.json()

    if (!roomId) {
      return NextResponse.json({ error: 'roomId is required' }, { status: 400 })
    }

    // Identify the caller from their session cookie (same session the rest of the app uses)
    const routeClient = await createRouteClient()
    const { data: { user }, error: authError } = await routeClient.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Service-role client bypasses RLS — we do the ownership check ourselves below
    const admin = createSupabaseClientForServer()

    // maybeSingle() (not single()) so a genuine 0-row result and an actual
    // Supabase/auth error are distinguishable instead of both looking like
    // "not found".
    const { data: room, error: fetchError } = await admin
      .from('cafe_classrooms')
      .select('id, host_id')
      .eq('id', roomId)
      .maybeSingle()

    if (fetchError) {
      console.error('cafe_classrooms delete-room lookup error:', fetchError)
      return NextResponse.json(
        { error: `Lookup failed: ${fetchError.message}` },
        { status: 500 }
      )
    }

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (room.host_id !== user.id) {
      return NextResponse.json(
        { error: 'You are not the host of this room' },
        { status: 403 }
      )
    }

    const { error: updateError } = await admin
      .from('cafe_classrooms')
      .update({ is_active: false })
      .eq('id', roomId)

    if (updateError) {
      console.error('cafe_classrooms delete-room update error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting cafe room:', error)
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
