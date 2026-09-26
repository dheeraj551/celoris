// Celoris XP — shared by the browser and the server (plain data only).
// The real numbers live in the database (xp_settings, xp_wallets, xp_ledger);
// see supabase/migrations/20260926_xp_currency.sql.

export interface XpRules {
  active_minute_xp: number
  active_daily_cap: number
  chest_size: number
  checkin_rewards: number[]
  credit_rate_xp: number
  monthly_convert_cap_credits: number
  convert_min_account_days: number
  multipliers: { free: number; basic: number; pro: number; max: number }
  tips_enabled: boolean
}

export const DEFAULT_XP_RULES: XpRules = {
  active_minute_xp: 1,
  active_daily_cap: 120,
  chest_size: 30,
  checkin_rewards: [10, 15, 20, 30, 40, 60, 100],
  credit_rate_xp: 1000,
  monthly_convert_cap_credits: 30,
  convert_min_account_days: 7,
  multipliers: { free: 1, basic: 1.2, pro: 1.5, max: 2 },
  tips_enabled: true,
}

/** What the server returns after every XP action. */
export interface XpState {
  lifetimeXp: number
  balanceXp: number
  chestXp: number
  chestSize: number
  activeXpToday: number
  activeDailyCap: number
  streakDays: number
  bestStreak: number
  checkedInToday: boolean
  checkinRewards: number[]
  multiplier: number
  creditRateXp: number
  convertedThisMonth: number
  monthlyConvertCap: number
  tipsEnabled: boolean
  // present on some actions
  added?: number
  reason?: string
  claimed?: number
  day?: number
  dayInCycle?: number
  walletBalance?: number
}

// Levels: going from level L to L+1 takes 100 + 50·(L−1) XP.
// Level 2 at 100 XP, 3 at 250, 4 at 450, 5 at 700, 10 at 2,700, 20 at 11,400.
export function xpForLevel(level: number): number {
  const n = Math.max(0, level - 1)
  return 100 * n + 25 * n * (n - 1)
}

export function levelInfo(lifetimeXp: number) {
  let level = 1
  while (xpForLevel(level + 1) <= lifetimeXp && level < 999) level++
  const start = xpForLevel(level)
  const next = xpForLevel(level + 1)
  return { level, into: lifetimeXp - start, needed: next - start, progress: (lifetimeXp - start) / (next - start) }
}

export const LEVEL_TITLES: [number, string][] = [
  [1, 'Newcomer'],
  [3, 'Explorer'],
  [5, 'Learner'],
  [8, 'Creator'],
  [12, 'Pro Creator'],
  [18, 'Mentor'],
  [25, 'Legend'],
]

export function levelTitle(level: number): string {
  let title = LEVEL_TITLES[0][1]
  for (let i = 0; i < LEVEL_TITLES.length; i++) if (level >= LEVEL_TITLES[i][0]) title = LEVEL_TITLES[i][1]
  return title
}

export function fmtXp(n: number): string {
  return Math.round(n).toLocaleString('en-IN')
}
