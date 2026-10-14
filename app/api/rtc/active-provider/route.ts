import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { resolveRoomRtcProvider, getActiveRtcProvider } from '@/lib/rtc-settings'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return NextResponse.json({ provider: getActiveRtcProvider() })
    }

    const admin = createSupabaseClientForServer()
    const { data: room } = await admin
      .from('cafe_classrooms')
      .select('category, tags')
      .eq('id', roomId)
      .maybeSingle()

    const provider = resolveRoomRtcProvider(room || undefined)
    return NextResponse.json({ provider })
  } catch {
    return NextResponse.json({ provider: getActiveRtcProvider() })
  }
}
