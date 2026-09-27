// Live class Q&A — shared by the browser and the server (plain data only).
//
//  - Free members get a few typed questions per class (Admin → Plans →
//    Live classes → "Questions per class"; 100 = unlimited).
//  - Pro/Max can be let to speak, their questions sit above free ones, and
//    they can send Super Questions: credits attached, shown on everyone's
//    screen, paid in full to the trainer.
//  - The trainer's "Lecture mode" lowers every hand and keeps new questions
//    quietly in the list until they switch back to Q&A.

export type QaMode = 'qa' | 'lecture'
export type QuestionStatus = 'open' | 'answered' | 'removed'

export interface ClassQuestion {
  id: number
  roomId: string
  askerId: string
  askerName: string
  askerTier: string
  body: string
  credits: number
  status: QuestionStatus
  createdAt: string
  handledAt: string | null
}

export interface QaMe {
  tier: string
  planLabel: string
  isTrainer: boolean
  /** Plan lets them be called on to speak (trainers always can). */
  canSpeak: boolean
  /** Typed questions allowed this class (null = unlimited). */
  freeLimit: number | null
  freeUsed: number
  superAllowed: boolean
  balance: number
  /** Cheapest plan with speaking / Super Questions, e.g. "Pro". */
  speakPlan: string
  superPlan: string
}

export const QUESTION_MAX_CHARS = 300
export const UNLIMITED_QUESTIONS = 100
export const SUPER_AMOUNTS = [10, 25, 50, 100, 250]
export const SUPER_MIN = 10
export const SUPER_MAX = 5000
/** How long a Super Question stays on screen. */
export const SUPER_SPOTLIGHT_MS = 15000

export function rowToQuestion(r: any): ClassQuestion {
  return {
    id: Number(r.id),
    roomId: String(r.room_id),
    askerId: String(r.asker_id),
    askerName: String(r.asker_name || 'Student'),
    askerTier: String(r.asker_tier || 'free'),
    body: String(r.body || ''),
    credits: Number(r.credits) || 0,
    status: (r.status as QuestionStatus) || 'open',
    createdAt: String(r.created_at),
    handledAt: r.handled_at ? String(r.handled_at) : null,
  }
}

const TIER_RANK: Record<string, number> = { free: 0, basic: 1, pro: 2, max: 3 }

/** Open questions first; within them Super Questions (bigger first), then paid plans, then oldest first. */
export function sortQuestions(list: ClassQuestion[]): ClassQuestion[] {
  const statusRank = (q: ClassQuestion) => (q.status === 'open' ? 0 : 1)
  return list
    .filter((q) => q.status !== 'removed')
    .slice()
    .sort((a, b) => {
      const s = statusRank(a) - statusRank(b)
      if (s) return s
      if (a.status !== 'open') return Date.parse(b.handledAt || b.createdAt) - Date.parse(a.handledAt || a.createdAt)
      if ((b.credits > 0 ? 1 : 0) !== (a.credits > 0 ? 1 : 0)) return (b.credits > 0 ? 1 : 0) - (a.credits > 0 ? 1 : 0)
      if (b.credits !== a.credits) return b.credits - a.credits
      const t = (TIER_RANK[b.askerTier] || 0) - (TIER_RANK[a.askerTier] || 0)
      if (t) return t
      return Date.parse(a.createdAt) - Date.parse(b.createdAt)
    })
}

export function isPaidTier(tier: string) {
  return (TIER_RANK[tier] || 0) >= TIER_RANK.pro
}
