import { NextResponse } from 'next/server'
import { createR2SignedUploadUrl } from '@/lib/r2-client'
import { currentUserId } from '../_auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import {
  createHiggsfieldUploadSlot,
  HiggsfieldError,
  referenceVideoKeyPrefix,
  signVideoUrl,
} from '@/lib/higgsfield-jobs'
import { getEntitlements, loadPlanSettings, upgradeLabelFor } from '@/lib/plans'
import { SEEDANCE_AUDIO_TYPES } from '@/lib/seedance-shared'

// Reference videos for Motion Swap Studio, and reference videos + audio for
// Seedance (Video Studio; { purpose: 'seedance' }). Videos are far bigger than Vercel's
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

    const body = await request.json().catch(() => ({}))
    const forSeedance = body.purpose === 'seedance'

    // Only members whose plan includes the tool can upload for it.
    const admin = createSupabaseClientForServer()
    const ent = await getEntitlements(admin, userId)
    const allowed = forSeedance ? ent.features.seedance_2_5 || ent.features.seedance_2_0 : ent.features.motion_swap
    if (!allowed) {
      const settings = await loadPlanSettings(admin)
      const upgradeTo = upgradeLabelFor(settings, forSeedance ? 'seedance_2_0' : 'motion_swap')
      return NextResponse.json(
        {
          error: `${forSeedance ? 'Seedance' : 'Motion Swap Studio'} is included with the ${upgradeTo} plan and above. You're on ${ent.label}.`,
          code: 'needs_plan',
        },
        { status: 403 }
      )
    }

    const contentType = String(body.contentType || '').toLowerCase()
    const size = Number(body.size)
    const isAudio = forSeedance && !!SEEDANCE_AUDIO_TYPES[contentType]
    const ext = TYPES[contentType] || (isAudio ? SEEDANCE_AUDIO_TYPES[contentType] : undefined)
    if (!ext) {
      return NextResponse.json(
        { error: forSeedance ? 'Please upload an MP4/MOV video or an MP3/WAV/M4A audio file.' : 'Please upload an MP4 or MOV video.' },
        { status: 400 }
      )
    }
    if (!Number.isFinite(size) || size <= 0) return NextResponse.json({ error: 'Invalid file.' }, { status: 400 })
    if (size > MAX_BYTES) return NextResponse.json({ error: 'That video is too large. Please keep it under 200 MB.' }, { status: 413 })

    if (body.target === 'higgsfield') {
      if (!isAudio && contentType !== 'video/mp4') {
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
