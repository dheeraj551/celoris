// PolyVault download speed by plan (server side).
//
// Each plan has a download queue in seconds (Admin → Plans → PolyVault →
// "Download queue"). Files themselves come straight from Cloudflare R2 at
// full speed; the plan decides how long a download waits before it starts.

import { getEntitlements, loadPlanSettings } from '@/lib/plans'
import { PLAN_TIERS, polyvaultLaneName, type PlanTier } from '@/lib/plan-features'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

type AdminClient = ReturnType<typeof createSupabaseClientForServer>

export interface PolyvaultLane {
  tier: PlanTier
  planLabel: string
  laneName: string
  waitSeconds: number
}

export async function laneForUser(admin: AdminClient, userId: string): Promise<PolyvaultLane> {
  const ent = await getEntitlements(admin, userId)
  const wait = Math.max(0, ent.features.polyvault_download_wait_seconds)
  return { tier: ent.tier, planLabel: ent.label, laneName: polyvaultLaneName(wait), waitSeconds: wait }
}

/** Every plan's lane, for the "Download speeds" comparison. */
export async function allLanes(admin?: AdminClient): Promise<PolyvaultLane[]> {
  const settings = await loadPlanSettings(admin)
  return PLAN_TIERS.map((t) => {
    const wait = Math.max(0, settings[t].features.polyvault_download_wait_seconds)
    return { tier: t, planLabel: settings[t].label, laneName: polyvaultLaneName(wait), waitSeconds: wait }
  })
}
