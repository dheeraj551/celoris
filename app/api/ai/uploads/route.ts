import { NextResponse } from 'next/server'
import { currentUserId } from '../_auth'
import { getWalletBalance, HiggsfieldError, PRO_REQUIRED_CREDITS, storeReferenceImage } from '@/lib/higgsfield-jobs'

// Receives one reference image (product photo, model photo, or a PhotoLite
// canvas layer), already downscaled in the browser, stores it in R2 and on
// Higgsfield, and returns the URL to pass as image_urls.

export const runtime = 'nodejs'
export const maxDuration = 60

const MAX_BYTES = 3_000_000 // Vercel request bodies top out around 4.5 MB (base64 adds ~33%)

export async function POST(request: Request) {
  try {
    const userId = await currentUserId()
    if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })

    const balance = await getWalletBalance(userId)
    if (balance === null) return NextResponse.json({ error: "Couldn't check your credits. Please try again." }, { status: 503 })
    if (balance < PRO_REQUIRED_CREDITS) {
      return NextResponse.json({ error: `This is a Pro feature (needs ${PRO_REQUIRED_CREDITS.toLocaleString('en-IN')} credits).` }, { status: 403 })
    }

    const { dataUrl } = await request.json().catch(() => ({}))
    const m = typeof dataUrl === 'string' ? dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/) : null
    if (!m) return NextResponse.json({ error: 'Please upload a JPG, PNG or WebP image.' }, { status: 400 })
    const bytes = Buffer.from(m[2], 'base64')
    if (bytes.length > MAX_BYTES) return NextResponse.json({ error: 'That image is too large. Please use one under 3 MB.' }, { status: 413 })

    const { publicUrl } = await storeReferenceImage(userId, bytes, m[1])
    return NextResponse.json({ url: publicUrl })
  } catch (err: any) {
    console.error('[AI uploads] error:', err)
    const status = err instanceof HiggsfieldError ? err.status : 500
    return NextResponse.json({ error: err?.message || 'Upload failed.' }, { status })
  }
}
