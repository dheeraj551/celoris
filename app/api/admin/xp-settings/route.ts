import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { authenticateAdmin } from '@/lib/admin-auth'
import { DEFAULT_XP_RULES, type XpRules } from '@/lib/xp-shared'

// Admin → XP: the earning / conversion rules and a few numbers to watch.
// Protected by proxy.ts (admins only) and re-checked here.

export const dynamic = 'force-dynamic'

function int(v: unknown, min: number, max: number, fallback: number) {
  const n = Math.round(Number(v))
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback
}
function num(v: unknown, min: number, max: number, fallback: number) {
  const n = Number(v)
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n * 100) / 100)) : fallback
}

function cleanRules(raw: any): XpRules {
  const d = DEFAULT_XP_RULES
  const r = raw && typeof raw === 'object' ? raw : {}
  const rewards = Array.isArray(r.checkin_rewards) ? r.checkin_rewards.slice(0, 14) : d.checkin_rewards
  const m = r.multipliers && typeof r.multipliers === 'object' ? r.multipliers : {}
  return {
    active_minute_xp: int(r.active_minute_xp, 0, 10, d.active_minute_xp),
    active_daily_cap: int(r.active_daily_cap, 0, 1440, d.active_daily_cap),
    chest_size: int(r.chest_size, 1, 1000, d.chest_size),
    checkin_rewards: rewards.length ? rewards.map((x: unknown) => int(x, 0, 10000, 10)) : d.checkin_rewards,
    credit_rate_xp: int(r.credit_rate_xp, 1, 1_000_000, d.credit_rate_xp),
    monthly_convert_cap_credits: int(r.monthly_convert_cap_credits, 0, 100_000, d.monthly_convert_cap_credits),
    convert_min_account_days: int(r.convert_min_account_days, 0, 365, d.convert_min_account_days),
    multipliers: {
      free: num(m.free, 0, 10, d.multipliers.free),
      basic: num(m.basic, 0, 10, d.multipliers.basic),
      pro: num(m.pro, 0, 10, d.multipliers.pro),
      max: num(m.max, 0, 10, d.multipliers.max),
    },
    tips_enabled: typeof r.tips_enabled === 'boolean' ? r.tips_enabled : d.tips_enabled,
  }
}

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const admin: any = createSupabaseClientForServer()

  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const since = monthStart.toISOString()

  const [{ data: settings }, { data: earned }, { data: converted }, { count: members }, { data: top }] = await Promise.all([
    admin.from('xp_settings').select('rules, updated_at').eq('id', 1).maybeSingle(),
    admin.from('xp_ledger').select('amount').gt('amount', 0).gte('created_at', since).limit(100000),
    admin.from('xp_ledger').select('amount').eq('kind', 'convert').gte('created_at', since).limit(100000),
    admin.from('xp_wallets').select('user_id', { count: 'exact', head: true }).gt('lifetime_xp', 0),
    admin.from('xp_wallets').select('user_id, lifetime_xp, balance_xp, streak_days').order('lifetime_xp', { ascending: false }).limit(10),
  ])

  const topIds = (top || []).map((t: any) => t.user_id)
  const { data: names } = topIds.length
    ? await admin.from('users').select('id, full_name, email').in('id', topIds)
    : { data: [] }
  const nameOf = new Map<string, string>((names || []).map((n: any) => [n.id, n.full_name || n.email || 'Member']))

  const sum = (rows: any[] | null) => (rows || []).reduce((a, r) => a + Number(r.amount || 0), 0)
  const xpConverted = -sum(converted)
  const rules = cleanRules(settings?.rules)
  return NextResponse.json({
    rules,
    updatedAt: settings?.updated_at || null,
    stats: {
      membersWithXp: members || 0,
      xpEarnedThisMonth: sum(earned),
      creditsConvertedThisMonth: Math.floor(xpConverted / rules.credit_rate_xp),
    },
    top: (top || []).map((t: any) => ({
      userId: t.user_id,
      name: nameOf.get(t.user_id) || 'Member',
      lifetimeXp: Number(t.lifetime_xp),
      balanceXp: Number(t.balance_xp),
      streakDays: t.streak_days,
    })),
  })
}

export async function PUT(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const body = await request.json().catch(() => ({}))
  const rules = cleanRules(body?.rules)
  const admin: any = createSupabaseClientForServer()
  const { error } = await admin
    .from('xp_settings')
    .update({ rules, updated_at: new Date().toISOString(), updated_by: auth.user.id })
    .eq('id', 1)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ rules })
}
