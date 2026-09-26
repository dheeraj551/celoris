import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { authenticateAdmin } from '@/lib/admin-auth'
import { clearPlanSettingsCache, loadPlanSettings } from '@/lib/plans'
import { PLAN_TIERS, type PlanTier, normalizeFeatures } from '@/lib/plan-features'

// Admin → Plans: read and change what each tier includes (monthly credits and
// feature switches). Protected by proxy.ts (admins only) and re-checked here.

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  clearPlanSettingsCache()
  const admin = createSupabaseClientForServer()
  const settings = await loadPlanSettings(admin)
  const { data: counts } = await (admin as any)
    .from('user_plans')
    .select('plan_tier, expires_at')
    .neq('plan_tier', 'free')
  const members: Record<string, number> = { free: 0, basic: 0, pro: 0, max: 0 }
  for (const row of (counts || []) as any[]) {
    if (!row.expires_at || Date.parse(row.expires_at) > Date.now()) members[row.plan_tier] = (members[row.plan_tier] || 0) + 1
  }
  return NextResponse.json({ tiers: PLAN_TIERS.map((t) => ({ ...settings[t], activeMembers: members[t] || 0 })) })
}

// PUT { tier, label?, monthlyCredits, features }
export async function PUT(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const body = await request.json().catch(() => ({}))
  const tier = body?.tier as PlanTier
  if (PLAN_TIERS.indexOf(tier) === -1) return NextResponse.json({ error: 'Unknown tier.' }, { status: 400 })

  const monthlyCredits = Math.round(Number(body?.monthlyCredits))
  if (!Number.isFinite(monthlyCredits) || monthlyCredits < 0 || monthlyCredits > 1_000_000) {
    return NextResponse.json({ error: 'Monthly credits must be between 0 and 1,000,000.' }, { status: 400 })
  }
  if (tier === 'free' && monthlyCredits !== 0) {
    return NextResponse.json({ error: 'The Free tier has no monthly credits (it is never awarded).' }, { status: 400 })
  }
  const label = typeof body?.label === 'string' && body.label.trim() ? body.label.trim().slice(0, 30) : null
  const features = normalizeFeatures(tier, body?.features)

  const admin = createSupabaseClientForServer()
  const update: Record<string, unknown> = {
    monthly_credits: monthlyCredits,
    features,
    updated_at: new Date().toISOString(),
    updated_by: auth.user.id,
  }
  if (label) update.label = label
  const { error } = await (admin as any).from('plan_tier_settings').update(update).eq('tier', tier)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  clearPlanSettingsCache()
  const settings = await loadPlanSettings(admin)
  return NextResponse.json({ tier: settings[tier] })
}
