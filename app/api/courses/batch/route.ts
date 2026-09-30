import { NextResponse } from 'next/server'
import { computeCourseBatch, loadCoursePageData } from '@/lib/course-batch'

// GET /api/courses/batch?course=<slug or id>
// Live batch figures for a course page (next class, seats, launch-offer
// passes left). Counts only — no names or emails ever leave the server.
// The course page polls this so the numbers stay current while it's open.

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const course = new URL(request.url).searchParams.get('course') || ''
  const data = await loadCoursePageData(course)
  if (!data) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  try {
    const batch = await computeCourseBatch(data)
    return NextResponse.json(batch, {
      headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' },
    })
  } catch (err) {
    console.error('[courses/batch] error:', err)
    return NextResponse.json({ error: 'Could not load batch details' }, { status: 500 })
  }
}
