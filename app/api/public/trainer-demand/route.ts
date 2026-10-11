import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Public, aggregated view of real student enquiries (the `leads` table) for the
// /become-trainer page. No names, phones or emails ever leave the server: only a
// subject bucket, the learning mode, a short area/city and how long ago it came in.
// Cached at the edge for 30 minutes so the page stays fast and the DB stays quiet.

export const dynamic = 'force-dynamic'

const SUBJECT_BUCKETS: { name: string; match: RegExp }[] = [
  { name: 'Microsoft Excel', match: /excel|power\s*bi|power\s*query/i },
  { name: 'Python', match: /python/i },
  { name: 'Digital Marketing', match: /digital\s*market|seo|google\s*ads/i },
  { name: 'Social Media Marketing', match: /social\s*media|smm|instagram/i },
  { name: 'Video Editing', match: /video|premier|after\s*effects|capcut|youtube/i },
  { name: 'Graphic Design', match: /graphic|photoshop|illustrator|canva|corel/i },
  { name: 'AI & Agentic AI', match: /\bai\b|agentic|machine\s*learning|data\s*science/i },
  { name: 'Web Development', match: /web|shopify|wordpress|full\s*stack|react|javascript/i },
  { name: 'BTech Tuition', match: /b\.?\s*tech/i },
  { name: 'MBA Tuition', match: /mba/i },
  { name: 'Spoken English', match: /english/i },
  { name: 'Fashion Design', match: /fashion/i },
]

function bucketOf(course: string | null): string {
  const c = (course || '').trim()
  if (!c) return 'Other'
  for (const b of SUBJECT_BUCKETS) if (b.match.test(c)) return b.name
  return 'Other'
}

// Keep at most two comma parts of the area ("Rohini, Delhi"), never anything that
// looks like a phone number, PIN or house number.
function cleanArea(raw: string | null): string {
  const parts = (raw || '')
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p && !/\d{3,}/.test(p) && !/@/.test(p))
    .slice(0, 2)
  const area = parts.join(', ')
  return area.length > 32 ? area.slice(0, 32).trim() : area
}

function cleanMode(raw: string | null): 'Online' | 'Home Tuition' | 'Hybrid' {
  const m = (raw || '').toLowerCase()
  if (m.includes('home') || m.includes('offline')) return 'Home Tuition'
  if (m.includes('hybrid') || m.includes('both')) return 'Hybrid'
  return 'Online'
}

export async function GET() {
  try {
    const supabase = createSupabaseClientForServer()
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('leads')
      .select('created_at, course, mode, location')
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(500)
    if (error) throw error

    const rows: any[] = data || []
    const counts = new Map<string, number>()
    for (const r of rows) {
      const b = bucketOf(r.course)
      if (b === 'Other') continue
      counts.set(b, (counts.get(b) || 0) + 1)
    }
    const subjects = Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    const recent = rows
      .filter((r) => bucketOf(r.course) !== 'Other')
      .slice(0, 12)
      .map((r, i) => ({
        id: String(i),
        subject: bucketOf(r.course),
        mode: cleanMode(r.mode),
        area: cleanArea(r.location),
        createdAt: r.created_at as string,
      }))

    return NextResponse.json(
      { total30: rows.length, subjects, recent },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
    )
  } catch (e) {
    console.error('[trainer-demand]', e)
    return NextResponse.json({ total30: 0, subjects: [], recent: [] }, { status: 200 })
  }
}
