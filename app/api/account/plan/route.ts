import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { getEntitlements, loadPlanSettings } from '@/lib/plans'
import { PLAN_TIERS } from '@/lib/plan-features'

export const dynamic = 'force-dynamic'

// GET: the signed-in member's plan and what it unlocks, plus every tier's
// settings (so the app can say "available from Pro"). Signed-out visitors
// get the Free tier.
export async function GET() {
  try {
    const admin = createSupabaseClientForServer()
    const routeClient: any = await createRouteClient()
    const {
      data: { user },
    } = await routeClient.auth.getUser()
    const settings = await loadPlanSettings(admin)
    const tiers = PLAN_TIERS.map((t) => ({
      tier: t,
      label: settings[t].label,
      monthlyCredits: settings[t].monthlyCredits,
      features: settings[t].features,
    }))
    if (!user) {
      return NextResponse.json({
        signedIn: false,
        plan: { tier: 'free', label: settings.free.label, expiresAt: null, nextCreditsAt: null, monthlyCredits: 0, features: settings.free.features },
        tiers,
      })
    }
    const plan = await getEntitlements(admin, user.id)
    return NextResponse.json({ signedIn: true, plan, tiers })
  } catch (err) {
    console.error('[account/plan]', err)
    return NextResponse.json({ error: 'Could not load your plan.' }, { status: 500 })
  }
}
