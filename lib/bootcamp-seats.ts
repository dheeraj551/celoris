// Live seat numbers for the free bootcamps (server only: uses the service-role client).
// Used by the hub and the course pages so the "seats left" counter is always real.

import { createServiceRoleClient } from "@/lib/supabase-client"
import { APPLIED_STATUS, BOOTCAMPS, SELECTED_STATUSES, type BootcampSlug, currentBatchStart, freeSeatsFor } from "@/lib/bootcamps"

export interface SeatStats {
    batchStart: string
    /** Free seats in this batch (after offline paid students). */
    freeSeats: number
    /** Applicants already picked for a free seat. */
    selected: number
    /** Free seats still open. */
    seatsLeft: number
    /** Applications received for this batch (all statuses). */
    applications: number
}

export async function getSeatStats(now: Date = new Date()): Promise<Record<BootcampSlug, SeatStats>> {
    const out = {} as Record<BootcampSlug, SeatStats>
    let rows: { bootcamp: string; batch_start: string; status: string }[] = []
    try {
        const admin: any = createServiceRoleClient()
        const starts = BOOTCAMPS.map((b) => currentBatchStart(now, b))
        const { data } = await admin
            .from("bootcamp_enrollments")
            .select("bootcamp,batch_start,status")
            .in("batch_start", Array.from(new Set(starts)))
        rows = data || []
    } catch (e) {
        console.error("[bootcamp-seats]", e)
    }
    for (const b of BOOTCAMPS) {
        const batchStart = currentBatchStart(now, b)
        const mine = rows.filter((r) => r.bootcamp === b.slug && r.batch_start === batchStart)
        const selected = mine.filter((r) => (SELECTED_STATUSES as readonly string[]).includes(r.status)).length
        const applications = mine.filter((r) => r.status === APPLIED_STATUS || (SELECTED_STATUSES as readonly string[]).includes(r.status)).length
        const freeSeats = freeSeatsFor(b, batchStart)
        out[b.slug] = { batchStart, freeSeats, selected, seatsLeft: Math.max(0, freeSeats - selected), applications }
    }
    return out
}
