// Server side of verified course reviews: who counts as a real student.
//
// Someone can review when ANY of these is true:
//   • an admin marked them as a student (Admin → Reviews → Verified students)
//   • they sat in a live Celoris class for 10+ minutes
//   • they have or had a paid plan (Basic / Pro / Max)
//   • they passed a Job Center exam
// Every review still waits for admin approval before it is shown.

import { createSupabaseClientForServer } from '@/lib/supabase-client'
import type { ReviewVerifiedReason } from '@/lib/course-reviews'

type AdminClient = ReturnType<typeof createSupabaseClientForServer>

const MIN_CLASS_MS = 10 * 60 * 1000

export async function reviewEligibility(admin: AdminClient, userId: string): Promise<ReviewVerifiedReason | null> {
  const db: any = admin

  const { data: granted } = await db.from('verified_students').select('user_id').eq('user_id', userId).maybeSingle()
  if (granted) return 'admin_verified'

  const { data: classes } = await db
    .from('class_attendance')
    .select('first_seen_at, last_seen_at')
    .eq('user_id', userId)
    .limit(50)
  for (const c of (classes || []) as any[]) {
    if (Date.parse(c.last_seen_at) - Date.parse(c.first_seen_at) >= MIN_CLASS_MS) return 'attended_class'
  }

  const { data: plan } = await db.from('user_plans').select('plan_tier, started_at').eq('user_id', userId).maybeSingle()
  if (plan && plan.plan_tier && plan.plan_tier !== 'free') return 'paid_plan'
  const { count: grants } = await db
    .from('plan_credit_grants')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  if ((grants || 0) > 0) return 'paid_plan'

  const { count: badges } = await db
    .from('job_center_badges')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
  if ((badges || 0) > 0) return 'passed_exam'

  return null
}

/** First name + last initial ("Priya S."), from the profile. */
export async function reviewerDisplayName(admin: AdminClient, userId: string, email?: string | null): Promise<string> {
  const db: any = admin
  let full = ''
  try {
    const { data } = await db.from('profiles').select('full_name').eq('id', userId).maybeSingle()
    full = String(data?.full_name || '').trim()
  } catch {
    // ignore
  }
  if (!full) {
    try {
      const { data } = await db.from('users').select('full_name').eq('id', userId).maybeSingle()
      full = String(data?.full_name || '').trim()
    } catch {
      // ignore
    }
  }
  if (!full && email) full = email.split('@')[0]
  const parts = full.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'Celoris student'
  const first = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
  return parts.length > 1 ? `${first} ${parts[parts.length - 1].charAt(0).toUpperCase()}.` : first
}

/** Removes phone numbers, emails and links so reviews can't be used for contact sharing / spam. */
export function cleanReviewText(raw: string): string {
  return raw
    .replace(/\s+/g, ' ')
    .replace(/https?:\/\/\S+|www\.\S+/gi, '[link removed]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email removed]')
    .replace(/(\+?\d[\d\s-]{8,}\d)/g, '[number removed]')
    .trim()
}
