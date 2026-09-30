// Live batch figures for a course page — shared by the server loader
// (lib/course-batch.ts), the /api/courses/batch route and the page widgets.
// Everything here comes from real data: the course's linked live classroom
// (Admin → Social → Café Rooms, matched by its "course URL"), the course's
// launch offer, and the applications students send from the page.

/**
 * Free passes, released in rounds until the batch is full:
 *  • round 1 runs until the first class starts, each later round until the
 *    next class — so the countdown always points at a real class time
 *  • up to `launch_offer_passes` (10) passes per round, never more than the
 *    seats left
 *  • once every seat is taken (or the last class has started) it stops for good
 */
export type OfferState = 'open' | 'round_full' | 'full' | 'ended'

export interface CourseLaunchOffer {
  state: OfferState
  /** 1 = before the first class, 2 = before the second class, … */
  round: number
  /** Most passes any round can have (the course's launch_offer_passes). */
  perRound: number
  /** Passes in this round (claimed + left). */
  passes: number
  /** Passes already given out this round (one per student). */
  claimed: number
  left: number
  /** When this round closes (the next class start, ISO). Null once full/ended. */
  endsAt: string | null
  /** When this round opened (the previous class start). Null in round 1. */
  roundStart: string | null
  /** Open right now: passes left and the round hasn't closed. */
  active: boolean
}

export interface CourseTrainer {
  name: string
  avatarUrl: string | null
}

export interface CourseBatchInfo {
  roomId: string | null
  /** Lead trainer set on the live classroom. */
  trainerName: string | null
  /** Everyone teaching this course: the classroom's trainer plus the trainers
   *  with an active booth on the course page (lead trainer first). */
  trainers: CourseTrainer[]
  batchNumber: string | null
  /** The next (or current) class, ISO. Null when nothing is scheduled. */
  nextStart: string | null
  nextEnd: string | null
  isLive: boolean
  /** The batch's first class has already happened. */
  batchStarted: boolean
  /** When the batch's first class is/was (ISO). */
  batchStart: string | null
  repeatsWeekly: boolean
  classMinutes: number | null
  /** e.g. "Thursdays · 3:00 PM IST" */
  scheduleLabel: string | null
  /** Live classroom capacity (students). */
  seatsTotal: number | null
  /** Students who applied for this course (not rejected). */
  registered: number
  seatsLeft: number | null
  /** Regular course fee in ₹ (0 = free). */
  price: number
  offer: CourseLaunchOffer | null
  updatedAt: string
}

export function offerIsOpen(offer: CourseLaunchOffer | null, now = Date.now()): boolean {
  return !!offer && offer.state === 'open' && offer.left > 0 && !!offer.endsAt && Date.parse(offer.endsAt) > now
}

/** "Thu, 1 Oct · 3:00 PM" in India time. */
export function istDateTime(iso: string): string {
  const d = new Date(iso)
  const day = d.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true })
  return `${day} · ${time.toUpperCase()}`
}

/** "Thu, 1 Oct 2026" in India time. */
export function istFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
}

/** "3:00 PM" in India time. */
export function istTime(iso: string): string {
  return new Date(iso)
    .toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true })
    .toUpperCase()
}

export function inr(n: number): string {
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}
