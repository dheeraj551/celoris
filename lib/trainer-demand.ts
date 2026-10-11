// Client helper for /api/public/trainer-demand (real, anonymised student enquiries).
// One shared request per page view, however many components ask for it.

export interface DemandSubject {
  name: string
  count: number
}

export interface DemandEnquiry {
  id: string
  subject: string
  mode: 'Online' | 'Home Tuition' | 'Hybrid'
  area: string
  createdAt: string
}

export interface TrainerDemand {
  total30: number
  subjects: DemandSubject[]
  recent: DemandEnquiry[]
}

const EMPTY: TrainerDemand = { total30: 0, subjects: [], recent: [] }
let pending: Promise<TrainerDemand> | null = null

export function loadTrainerDemand(): Promise<TrainerDemand> {
  if (!pending) {
    pending = fetch('/api/public/trainer-demand')
      .then((r) => (r.ok ? r.json() : EMPTY))
      .then((d) => ({
        total30: Number(d?.total30) || 0,
        subjects: Array.isArray(d?.subjects) ? d.subjects : [],
        recent: Array.isArray(d?.recent) ? d.recent : [],
      }))
      .catch(() => EMPTY)
  }
  return pending
}

export function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  const d = Math.round(s / 86400)
  return d === 1 ? '1 day ago' : `${d} days ago`
}
