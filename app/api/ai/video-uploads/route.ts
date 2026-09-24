import { NextResponse } from 'next/server'
import { createR2SignedUploadUrl } from '@/lib/r2-client'
import { currentUserId } from '../_auth'
import {
  createHiggsfieldUploadSlot,
  getWalletBalance,
  HiggsfieldError,
  MOTION_SWAP_REQUIRED_CREDITS,
  referenceVideoKeyPrefix,
  signVideoUrl,
} from '@/lib/higgsfield-jobs'

// Motion Swap Studio reference videos. Videos are far bigger than Vercel's
// ~4.5 MB request limit, so the browser uploads them directly:
//  - default: a 10-minute signed PUT URL into our private R2 bucket
//    (the job route later gives Higgsfield a 24-hour signed read link);
//  - { target: 'higgsfield' }: an upload slot in Higgsfield's own storage.
//    The browser falls back to this if the R2 upload is blocked (e.g. the
//    bucket's CORS rules don't allow the page's origin, like localhost).

export const runtime = 'nodejs'
export const maxDuration = 30

// MP4 / MOV only: the server reads their length to price the video.
const TYPES: Record<string, string> = { 'video/mp4': 'mp4', 'video/quicktime': 'mov' }
const MAX_BYTES = 200 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const userId = await currentUserId()
    if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })

    const balance = await getWalletBalance(userId)
    if (balance === null) return NextResponse.json({ error: "Couldn't check your credits. Please try again." }, { status: 503 })
    if (balance < MOTION_SWAP_REQUIRED_CREDITS) {
      return NextResponse.json(
        { error: `Motion Swap Studio needs at least ${MOTION_SWAP_REQUIRED_CREDITS.toLocaleString('en-IN')} credits in your wallet. Your balance is ${balance.toLocaleString('en-IN')} credits.` },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const contentType = String(body.contentType || '').toLowerCase()
    const size = Number(body.size)
    const ext = TYPES[contentType]
    if (!ext) return NextResponse.json({ error: 'Please upload an MP4 or MOV video.' }, { status: 400 })
    if (!Number.isFinite(size) || size <= 0) return NextResponse.json({ error: 'Invalid file.' }, { status: 400 })
    if (size > MAX_BYTES) return NextResponse.json({ error: 'That video is too large. Please keep it under 200 MB.' }, { status: 413 })

    if (body.target === 'higgsfield') {
      if (contentType !== 'video/mp4') {
        return NextResponse.json({ error: 'Please convert the video to MP4 and try again.' }, { status: 400 })
      }
      const slot = await createHiggsfieldUploadSlot(contentType)
      return NextResponse.json({
        target: 'higgsfield',
        uploadUrl: slot.uploadUrl,
        headers: slot.headers,
        videoUrl: slot.publicUrl,
        videoToken: signVideoUrl(userId, slot.publicUrl),
      })
    }

    const key = `${referenceVideoKeyPrefix(userId)}${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
    const uploadUrl = await createR2SignedUploadUrl(key, contentType, 600)
    return NextResponse.json({ target: 'r2', uploadUrl, headers: { 'Content-Type': contentType }, videoKey: key })
  } catch (err: any) {
    console.error('[AI video uploads] error:', err)
    const status = err instanceof HiggsfieldError ? err.status : 500
    return NextResponse.json({ error: err?.message || 'Could not prepare the upload.' }, { status })
  }
}
