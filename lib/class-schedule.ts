// Class schedule helpers shared by the admin panel, /learn, the classroom
// lobby and the phone app. Times are stored in UTC (timestamptz) and always
// shown and entered in India time (Asia/Kolkata, UTC+5:30).

export interface ScheduledRoom {
  next_class_at?: string | null
  class_duration_minutes?: number | null
  repeats_weekly?: boolean | null
}

const IST_OFFSET_MS = 330 * 60 * 1000
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/**
 * The next (or current) session for a room. Weekly classes roll forward
 * automatically, so the admin only sets the first date once. Returns null
 * when no date is set, or when a one-off class has already finished.
 */
export function nextSession(room: ScheduledRoom, now: Date = new Date()) {
  if (!room.next_class_at) return null
  const first = new Date(room.next_class_at)
  if (Number.isNaN(first.getTime())) return null
  const durationMs = Math.max(15, room.class_duration_minutes || 60) * 60 * 1000

  let start = first.getTime()
  if (start + durationMs <= now.getTime()) {
    if (!room.repeats_weekly) return null
    const weeksBehind = Math.ceil((now.getTime() - (start + durationMs)) / WEEK_MS)
    start += Math.max(1, weeksBehind) * WEEK_MS
    if (start + durationMs <= now.getTime()) start += WEEK_MS
  }
  const end = start + durationMs
  return {
    start: new Date(start),
    end: new Date(end),
    isLive: start <= now.getTime() && now.getTime() < end,
  }
}

/** "Wed, 30 Sep · 7:00 PM" in India time. */
export function formatClassTime(date: Date): string {
  const day = date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'short', day: 'numeric', month: 'short' })
  const time = date.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true })
  return `${day} · ${time.toUpperCase()}`
}

/** ISO/UTC → "YYYY-MM-DDTHH:mm" in India time, for <input type="datetime-local">. */
export function toIstInputValue(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Date(d.getTime() + IST_OFFSET_MS).toISOString().slice(0, 16)
}

/** "YYYY-MM-DDTHH:mm" typed in India time → ISO string (or null when empty/invalid). */
export function fromIstInputValue(value: string | null | undefined): string | null {
  if (!value) return null
  const m = String(value).match(/^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/)
  if (!m) return null
  const d = new Date(`${m[1]}T${m[2]}:00+05:30`)
  return Number.isNaN(d.getTime()) ? null : d.toISOString()
}
