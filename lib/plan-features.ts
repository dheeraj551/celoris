// Membership tiers (Free, Basic, Pro, Max) and what each one unlocks.
//
// This file is shared by the browser and the server, so it holds only plain
// data: the list of switchable features and the default settings. The live
// settings are stored in the database table `plan_tier_settings` and edited
// in Admin → Plans (/admin/plans). lib/plans.ts reads them on the server.

export type PlanTier = 'free' | 'basic' | 'pro' | 'max'
export const PLAN_TIERS: PlanTier[] = ['free', 'basic', 'pro', 'max']
export const PLAN_RANK: Record<PlanTier, number> = { free: 0, basic: 1, pro: 2, max: 3 }

export interface PlanFeatures {
  /** Seedance 2.0 video model */
  seedance_2_0: boolean
  /** Seedance 2.5 video model */
  seedance_2_5: boolean
  /** Motion Swap Studio (Higgsfield Genjutsu) */
  motion_swap: boolean
  /** Free Motion Swap renders each month (no credits charged) */
  motion_swap_free_gens: number
  /** A free render covers videos up to this many seconds */
  motion_swap_free_max_seconds: number
  /** Images that can generate at the same time */
  max_parallel_images: number
  /** Videos that can render at the same time */
  max_parallel_videos: number
  /** Start voice & video calls in Celoris Chat */
  chat_calls: boolean
}

export type FeatureKey = keyof PlanFeatures

export interface FeatureDef {
  key: FeatureKey
  label: string
  help: string
  group: 'AI video' | 'Motion Swap Studio' | 'Generations' | 'Celoris Chat'
  type: 'bool' | 'int'
  min?: number
  max?: number
  unit?: string
}

export const FEATURE_DEFS: FeatureDef[] = [
  { key: 'seedance_2_0', label: 'Seedance 2.0', help: 'Can use the Seedance 2.0 video model', group: 'AI video', type: 'bool' },
  { key: 'seedance_2_5', label: 'Seedance 2.5', help: 'Can use the Seedance 2.5 video model', group: 'AI video', type: 'bool' },
  { key: 'motion_swap', label: 'Motion Swap Studio', help: 'Can render videos in Motion Swap Studio', group: 'Motion Swap Studio', type: 'bool' },
  {
    key: 'motion_swap_free_gens',
    label: 'Free renders / month',
    help: 'Renders each month that cost no credits',
    group: 'Motion Swap Studio',
    type: 'int',
    min: 0,
    max: 100,
  },
  {
    key: 'motion_swap_free_max_seconds',
    label: 'Free render length',
    help: 'A free render covers videos up to this length; longer videos are charged normally',
    group: 'Motion Swap Studio',
    type: 'int',
    min: 4,
    max: 30,
    unit: 's',
  },
  { key: 'max_parallel_images', label: 'Images at once', help: 'Image generations that can run at the same time', group: 'Generations', type: 'int', min: 1, max: 20 },
  { key: 'max_parallel_videos', label: 'Videos at once', help: 'Video renders that can run at the same time', group: 'Generations', type: 'int', min: 1, max: 10 },
  { key: 'chat_calls', label: 'Voice & video calls', help: 'Can start calls in Celoris Chat (friends answer free)', group: 'Celoris Chat', type: 'bool' },
]

export interface TierSettings {
  tier: PlanTier
  label: string
  monthlyCredits: number
  features: PlanFeatures
}

export const DEFAULT_TIER_SETTINGS: Record<PlanTier, TierSettings> = {
  free: {
    tier: 'free',
    label: 'Free',
    monthlyCredits: 0,
    features: {
      seedance_2_0: false,
      seedance_2_5: false,
      motion_swap: false,
      motion_swap_free_gens: 0,
      motion_swap_free_max_seconds: 10,
      max_parallel_images: 1,
      max_parallel_videos: 1,
      chat_calls: false,
    },
  },
  basic: {
    tier: 'basic',
    label: 'Basic',
    monthlyCredits: 120,
    features: {
      seedance_2_0: true,
      seedance_2_5: false,
      motion_swap: false,
      motion_swap_free_gens: 0,
      motion_swap_free_max_seconds: 10,
      max_parallel_images: 2,
      max_parallel_videos: 1,
      chat_calls: true,
    },
  },
  pro: {
    tier: 'pro',
    label: 'Pro',
    monthlyCredits: 600,
    features: {
      seedance_2_0: true,
      seedance_2_5: true,
      motion_swap: true,
      motion_swap_free_gens: 3,
      motion_swap_free_max_seconds: 10,
      max_parallel_images: 3,
      max_parallel_videos: 2,
      chat_calls: true,
    },
  },
  max: {
    tier: 'max',
    label: 'Max',
    monthlyCredits: 1800,
    features: {
      seedance_2_0: true,
      seedance_2_5: true,
      motion_swap: true,
      motion_swap_free_gens: 3,
      motion_swap_free_max_seconds: 10,
      max_parallel_images: 8,
      max_parallel_videos: 3,
      chat_calls: true,
    },
  },
}

/** Fills in any missing/invalid feature with the tier's default and clamps numbers. */
export function normalizeFeatures(tier: PlanTier, raw: unknown): PlanFeatures {
  const base = DEFAULT_TIER_SETTINGS[tier].features
  const src = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const out: any = { ...base }
  for (let i = 0; i < FEATURE_DEFS.length; i++) {
    const def = FEATURE_DEFS[i]
    const v = src[def.key]
    if (def.type === 'bool') {
      if (typeof v === 'boolean') out[def.key] = v
    } else if (typeof v === 'number' && Number.isFinite(v)) {
      const n = Math.round(v)
      out[def.key] = Math.min(def.max ?? n, Math.max(def.min ?? n, n))
    }
  }
  return out as PlanFeatures
}

/** The lowest tier that has a boolean feature switched on (for "Upgrade to …" messages). */
export function lowestTierWith(settings: Record<PlanTier, TierSettings>, key: FeatureKey): PlanTier | null {
  for (let i = 0; i < PLAN_TIERS.length; i++) {
    const t = PLAN_TIERS[i]
    if (settings[t]?.features[key] === true) return t
  }
  return null
}

/** Video models that are plan-gated, by the model id a generator sends. */
export const VIDEO_MODEL_FEATURE: Record<string, FeatureKey> = {
  'seedance-2.0': 'seedance_2_0',
  'seedance-2.5': 'seedance_2_5',
}

export function canUseVideoModel(features: PlanFeatures, modelId: string): boolean {
  const key = VIDEO_MODEL_FEATURE[modelId]
  return key ? features[key] === true : true
}
