import { NextResponse } from 'next/server'

// Replaced by the real Higgsfield Genjutsu integration: Motion Swap Studio
// now starts jobs with POST /api/ai/jobs { app: 'motion-swap', ... } and
// polls GET /api/ai/jobs/{id}. This old endpoint only ever returned a fake
// "queued" response.
export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has moved. Please refresh the page.' },
    { status: 410 }
  )
}
