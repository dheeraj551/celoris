import { NextResponse } from 'next/server'

// Retired (Sept 2026). This route waited for the whole Higgsfield render
// inside one request, which Vercel cut off (504 / "Failed to fetch") while
// Higgsfield still produced — and billed — the image. ViO Studio and
// PhotoLite now use the background job flow instead:
//   POST /api/ai/uploads      reference photo -> R2 + Higgsfield
//   POST /api/ai/jobs         start a generation (returns immediately)
//   GET  /api/ai/jobs/{id}    poll until ready
//   GET  /api/ai/jobs/{id}/image  the finished image, served from R2

export const runtime = 'nodejs'

function gone() {
  return NextResponse.json(
    { success: false, error: 'This version of the image generator was replaced. Please refresh the page to load the new one.' },
    { status: 410 }
  )
}

export const GET = gone
export const POST = gone
