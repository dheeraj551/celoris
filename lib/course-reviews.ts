// Verified course reviews — shared by the browser and the server (plain data).

export type ReviewVerifiedReason = 'attended_class' | 'paid_plan' | 'passed_exam' | 'admin_verified'

export const REVIEW_REASON_LABEL: Record<ReviewVerifiedReason, string> = {
  attended_class: 'Attended a live class',
  paid_plan: 'Celoris member',
  passed_exam: 'Passed a Celoris exam',
  admin_verified: 'Celoris student',
}

export const REVIEW_MIN_CHARS = 20
export const REVIEW_MAX_CHARS = 1200

/** A course is identified by its page path, e.g. "video-editing-course-noida". */
export function isValidCourseKey(key: unknown): key is string {
  return typeof key === 'string' && /^[a-z0-9][a-z0-9\-/:]{2,119}$/.test(key)
}

export interface PublicReview {
  id: string
  name: string
  rating: number
  text: string
  createdAt: string
  verifiedLabel: string
}

export interface ReviewSummary {
  count: number
  average: number | null
}

/** "12 Sep 2026" */
export function reviewDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}
