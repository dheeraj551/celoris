// Live batch figures for a course page — shared by the server loader
// (lib/course-batch.ts), the /api/courses/batch route and the page widgets.
// Everything here comes from real data: the course's linked live classroom
// (Admin → Social → Café Rooms, matched by its "course URL"), the course's
// launch offer, and the applications students send from the page.

export interface CourseLaunchOffer {
  /** How many free passes the offer has. */
  passes: number
  /** Passes already given out (one per student). */
  claimed: number
  left: number
  /** When the offer closes (ISO). */
  endsAt: string
  /** Still open: before the deadline and passes left. */
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
  return !!offer && offer.left > 0 && Date.parse(offer.endsAt) > now
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
