import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { celorisTvStudioAccess } from '@/lib/celoris-tv-access'

// Can the signed-in member use Celoris TV's Teacher Studio? (Plan-based —
// see lib/celoris-tv-access.ts.)
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const client: any = await createRouteClient()
    const {
      data: { user },
    } = await client.auth.getUser()
    if (!user) return NextResponse.json({ allowed: false, signedIn: false, planLabel: 'Free', requiredPlan: 'Pro' })
    const access = await celorisTvStudioAccess(createSupabaseClientForServer(), user.id)
    return NextResponse.json({ signedIn: true, ...access })
  } catch (err) {
    console.error('[celoris-tv studio-access]', err)
    return NextResponse.json({ error: 'Could not check Teacher Studio access.' }, { status: 500 })
  }
}
