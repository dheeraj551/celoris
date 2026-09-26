/**
 * Server-side membership plans: which tier someone is on and what it unlocks.
 * Tier settings live in the `plan_tier_settings` table (edited in
 * Admin → Plans); who has which tier lives in `user_plans` (set in
 * Admin → Users). Never trust the browser for any of this.
 */
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import {
  DEFAULT_TIER_SETTINGS,
  PLAN_TIERS,
  type PlanFeatures,
  type PlanTier,
  type TierSettings,
  normalizeFeatures,
} from '@/lib/plan-features'

type AdminClient = ReturnType<typeof createSupabaseClientForServer>

export interface Entitlements {
  tier: PlanTier
  label: string
  /** When the paid plan ends (null = no end date, or free) */
  expiresAt: string | null
  /** When the next monthly credits are added (paid plans only) */
  nextCreditsAt: string | null
  monthlyCredits: number
  features: PlanFeatures
}

// Settings change rarely; cache them briefly per server instance.
let cache: { at: number; value: Record<PlanTier, TierSettings> } | null = null
const CACHE_MS = 60_000

export function clearPlanSettingsCache() {
  cache = null
}

export async function loadPlanSettings(admin?: AdminClient): Promise<Record<PlanTier, TierSettings>> {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value
  const client: any = admin || createSupabaseClientForServer()
  const out: Record<PlanTier, TierSettings> = {
    free: { ...DEFAULT_TIER_SETTINGS.free },
    basic: { ...DEFAULT_TIER_SETTINGS.basic },
    pro: { ...DEFAULT_TIER_SETTINGS.pro },
    max: { ...DEFAULT_TIER_SETTINGS.max },
  }
  const { data, error } = await client.from('plan_tier_settings').select('tier, label, monthly_credits, features')
  if (error) {
    console.warn('[plans] could not load plan settings, using defaults:', error.message)
    return out
  }
  for (const row of (data || []) as any[]) {
    const tier = row.tier as PlanTier
    if (PLAN_TIERS.indexOf(tier) === -1) continue
    out[tier] = {
      tier,
      label: row.label || DEFAULT_TIER_SETTINGS[tier].label,
      monthlyCredits: Number(row.monthly_credits) || 0,
      features: normalizeFeatures(tier, row.features),
    }
  }
  cache = { at: Date.now(), value: out }
  return out
}

/** The tier someone is on right now. An expired plan counts as Free. */
export async function getUserTier(
  admin: AdminClient,
  userId: string
): Promise<{ tier: PlanTier; expiresAt: string | null; nextCreditsAt: string | null }> {
  const { data } = await (admin as any)
    .from('user_plans')
    .select('plan_tier, expires_at, next_credit_grant_at')
    .eq('user_id', userId)
    .maybeSingle()
  if (!data) return { tier: 'free', expiresAt: null, nextCreditsAt: null }
  const tier = String(data.plan_tier) as PlanTier
  if (PLAN_TIERS.indexOf(tier) === -1 || tier === 'free') return { tier: 'free', expiresAt: null, nextCreditsAt: null }
  if (data.expires_at && Date.parse(data.expires_at) <= Date.now()) return { tier: 'free', expiresAt: null, nextCreditsAt: null }
  return { tier, expiresAt: data.expires_at || null, nextCreditsAt: data.next_credit_grant_at || null }
}

export async function getEntitlements(admin: AdminClient, userId: string): Promise<Entitlements> {
  const [{ tier, expiresAt, nextCreditsAt }, settings] = await Promise.all([getUserTier(admin, userId), loadPlanSettings(admin)])
  const s = settings[tier]
  return { tier, label: s.label, expiresAt, nextCreditsAt, monthlyCredits: s.monthlyCredits, features: s.features }
}

/** "Pro" — the cheapest tier that has a boolean feature on, for upgrade messages. */
export function upgradeLabelFor(settings: Record<PlanTier, TierSettings>, key: keyof PlanFeatures): string {
  for (let i = 0; i < PLAN_TIERS.length; i++) {
    const t = PLAN_TIERS[i]
    if (settings[t].features[key] === true) return settings[t].label
  }
  return 'a paid plan'
}

/** Start of the current month in India (IST), as an ISO string — for monthly allowances. */
export function istMonthStartIso(now = new Date()): string {
  const IST_MS = 5.5 * 60 * 60 * 1000
  const ist = new Date(now.getTime() + IST_MS)
  const startIst = Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), 1)
  return new Date(startIst - IST_MS).toISOString()
}
