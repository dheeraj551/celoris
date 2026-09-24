import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { currentUserId } from '../_auth'
import { probeVideoDuration } from '@/lib/video-probe'
import {
  AiApp,
  APP_CREDIT_COST,
  APP_LABEL,
  GENJUTSU_RESOLUTIONS,
  GenjutsuInput,
  GenjutsuResolution,
  MAX_ACTIVE_VIDEO_JOBS_PER_USER,
  MOTION_SWAP_CREDITS_PER_SECOND,
  MOTION_SWAP_REQUIRED_CREDITS,
  motionSwapBilledSeconds,
  motionSwapPrice,
  referenceVideoUrlForKey,
  verifyVideoUrl,
  submitGenjutsu,
  VIDEO_MAX_SECONDS,
  VIDEO_MIN_SECONDS,
  getWalletBalance,
  HiggsfieldError,
  JobRow,
  MarketingStudioInput,
  MAX_ACTIVE_JOBS_PER_USER,
  PRO_REQUIRED_CREDITS,
  publicJob,
  refreshJob,
  submitMarketingStudioImage,
} from '@/lib/higgsfield-jobs'

// POST: start a generation (returns immediately with a job id).
//       ViO Studio / PhotoLite → Marketing Studio image;
//       Motion Swap Studio → Higgsfield Genjutsu video (motion transfer / object swap).
// GET:  the signed-in user's recent generations for one app (history).

export const runtime = 'nodejs'
export const maxDuration = 60

const RATIOS = new Set(['auto', '1:1', '3:2', '2:3', '4:3', '3:4', '16:9', '9:16', '21:9'])
const APPS = new Set(['vio', 'photolite', 'motion-swap'])

// Genjutsu needs an instruction; these are used when the user leaves the
// prompt switched off.
const GENJUTSU_DEFAULT_PROMPT: Record<'motion-transfer' | 'objects-swap', string> = {
  'motion-transfer':
    "Swap the video's main character with the attached character, keeping the original motion, timing, camera movement and scene.",
  'objects-swap':
    'Replace the matching object or clothing in the video with the attached one, keeping everything else in the video unchanged.',
}

export async function POST(request: Request) {
  const admin = createSupabaseClientForServer()
  let jobId: string | null = null
  try {
    const userId = await currentUserId()
    if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const app = body.app as AiApp
    if (!APPS.has(app)) return NextResponse.json({ error: 'Unknown app.' }, { status: 400 })
    if (app === 'motion-swap') return await startGenjutsuJob(userId, body)

    const presetId = typeof body.presetId === 'string' && /^[0-9a-f-]{8,64}$/i.test(body.presetId) ? body.presetId : null
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 5000) : ''
    const imageUrls: string[] = Array.isArray(body.imageUrls)
      ? body.imageUrls.filter((u: unknown) => typeof u === 'string' && /^https:\/\//i.test(u)).slice(0, presetId ? 2 : 16)
      : []
    const aspectRatio = RATIOS.has(body.aspectRatio) ? body.aspectRatio : 'auto'
    const resolution = ['1k', '2k', '4k'].includes(body.resolution) ? body.resolution : '2k'
    const quality = presetId ? 'high' : ['low', 'medium', 'high'].includes(body.quality) ? body.quality : 'high'

    if (presetId && imageUrls.length === 0) {
      return NextResponse.json({ error: 'Templates need your product photo — please upload one.' }, { status: 400 })
    }
    if (!presetId && !prompt) {
      return NextResponse.json({ error: 'Describe what you want to create.' }, { status: 400 })
    }

    // Pro gate + concurrency limit
    const balance = await getWalletBalance(userId)
    if (balance === null) return NextResponse.json({ error: "Couldn't check your credits. Please try again." }, { status: 503 })
    if (balance < PRO_REQUIRED_CREDITS) {
      return NextResponse.json(
        {
          error: `This is a Pro feature that needs at least ${PRO_REQUIRED_CREDITS.toLocaleString('en-IN')} credits in your wallet. Your balance is ${balance.toLocaleString('en-IN')} credits.`,
          currentBalance: balance,
          requiredCredits: PRO_REQUIRED_CREDITS,
        },
        { status: 403 }
      )
    }
    const { count } = await admin
      .from('ai_generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['queued', 'in_progress'])
      .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
    if ((count || 0) >= MAX_ACTIVE_JOBS_PER_USER) {
      return NextResponse.json({ error: `You already have ${count} images generating. Please wait for one to finish.` }, { status: 429 })
    }

    const input: MarketingStudioInput = {
      prompt: prompt || 'Create a high-converting marketing image of this product.',
      aspect_ratio: aspectRatio,
      resolution,
      quality,
      ...(imageUrls.length ? { image_urls: imageUrls } : {}),
      ...(presetId ? { enhance_prompt: true, preset_id: presetId } : {}),
    }
    const cost = APP_CREDIT_COST[app]

    const { data: row, error: insertErr } = await admin
      .from('ai_generations')
      .insert({
        user_id: userId,
        app,
        status: 'queued',
        params: {
          ...input,
          displayPrompt: typeof body.displayPrompt === 'string' ? body.displayPrompt.slice(0, 500) : prompt,
          presetName: typeof body.presetName === 'string' ? body.presetName.slice(0, 120) : null,
        },
      })
      .select('*')
      .single()
    if (insertErr || !row) throw new Error(insertErr?.message || 'Could not create the job.')
    jobId = row.id

    let newBalance = balance
    if (cost > 0) {
      const { data: after, error: chargeErr } = await admin.rpc('charge_ai_credits', {
        p_user_id: userId,
        p_amount: cost,
        p_description: `${APP_LABEL[app]} AI image`,
      })
      if (chargeErr) {
        await admin.from('ai_generations').update({ status: 'failed', error: 'Not enough credits.' }).eq('id', row.id)
        return NextResponse.json({ error: `Not enough credits (this costs ${cost}).` }, { status: 402 })
      }
      newBalance = Number(after)
      await admin.from('ai_generations').update({ credits_charged: cost }).eq('id', row.id)
    }

    try {
      const submitted = await submitMarketingStudioImage(input)
      const { data: updated } = await admin
        .from('ai_generations')
        .update({ provider_request_id: submitted.requestId, status: submitted.status, updated_at: new Date().toISOString() })
        .eq('id', row.id)
        .select('*')
        .single()
      console.log('[AI jobs] submitted', app, row.id, '→', submitted.requestId)
      return NextResponse.json({ job: publicJob(updated as JobRow), balance: newBalance })
    } catch (err: any) {
      const message = err instanceof HiggsfieldError ? err.message : `Couldn't reach Higgsfield: ${err?.message || 'unknown error'}`
      await admin.from('ai_generations').update({ status: 'failed', error: message, completed_at: new Date().toISOString() }).eq('id', row.id)
      let refundedBalance: number | null = null
      if (cost > 0) {
        const { data } = await admin.rpc('refund_ai_generation', { p_generation_id: row.id })
        refundedBalance = data === null || data === undefined ? null : Number(data)
      }
      return NextResponse.json(
        { error: message, balance: refundedBalance ?? balance },
        { status: err instanceof HiggsfieldError ? err.status : 502 }
      )
    }
  } catch (err: any) {
    console.error('[AI jobs] create error:', err)
    if (jobId) await admin.from('ai_generations').update({ status: 'failed', error: 'Server error' }).eq('id', jobId).in('status', ['queued'])
    return NextResponse.json({ error: err?.message || 'Could not start the generation.' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const userId = await currentUserId()
    if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
    const app = new URL(request.url).searchParams.get('app')
    if (!app || !APPS.has(app)) return NextResponse.json({ error: 'Unknown app.' }, { status: 400 })

    const admin = createSupabaseClientForServer()
    const { data, error } = await admin
      .from('ai_generations')
      .select('*')
      .eq('user_id', userId)
      .eq('app', app)
      .order('created_at', { ascending: false })
      .limit(24)
    if (error) throw error

    const rows = (data || []) as JobRow[]
    // Bring a few pending ones up to date so the history is accurate on load.
    const pending = rows.filter((r) => r.status === 'queued' || r.status === 'in_progress').slice(0, 3)
    const refreshed = await Promise.all(pending.map((r) => refreshJob(r).catch(() => r)))
    const byId = new Map(refreshed.map((r) => [r.id, r]))
    const balance = await getWalletBalance(userId).catch(() => null)
    return NextResponse.json({ jobs: rows.map((r) => publicJob(byId.get(r.id) || r)), balance })
  } catch (err: any) {
    console.error('[AI jobs] list error:', err)
    return NextResponse.json({ error: err?.message || 'Could not load your history.' }, { status: 500 })
  }
}

// ------------------------------------------------------------------ Motion Swap Studio

async function startGenjutsuJob(userId: string, body: any) {
  const admin = createSupabaseClientForServer()
  const app: AiApp = 'motion-swap'

  const mode: 'motion-transfer' | 'objects-swap' = body.mode === 'objects-swap' ? 'objects-swap' : 'motion-transfer'
  const resolution: GenjutsuResolution = GENJUTSU_RESOLUTIONS.includes(body.resolution) ? body.resolution : '720p'
  const userPrompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 3000) : ''
  const imageUrls: string[] = Array.isArray(body.imageUrls)
    ? body.imageUrls.filter((u: unknown) => typeof u === 'string' && /^https:\/\//i.test(u)).slice(0, 30)
    : []

  if (imageUrls.length === 0) {
    return NextResponse.json(
      { error: mode === 'motion-transfer' ? 'Add at least one character, product or clothing photo.' : 'Add a photo of the replacement object or clothing.' },
      { status: 400 }
    )
  }

  // Reference video: one of this user's uploads in our R2 bucket (preferred),
  // or the Higgsfield-storage URL from the upload fallback (see
  // /api/ai/video-uploads).
  let videoUrl: string
  try {
    if (typeof body.videoKey === 'string' && body.videoKey) {
      videoUrl = await referenceVideoUrlForKey(userId, body.videoKey)
    } else if (
      typeof body.videoUrl === 'string' &&
      body.videoUrl.length < 2048 &&
      (verifyVideoUrl(userId, body.videoUrl, body.videoToken) || /^https:\/\/(www\.)?celorisdesigns\.com\//i.test(body.videoUrl))
    ) {
      // A Higgsfield-storage upload we issued, or a preset clip on our own site.
      videoUrl = body.videoUrl
    } else {
      return NextResponse.json({ error: 'Add a reference video first.' }, { status: 400 })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Invalid reference video.' }, { status: err?.status || 400 })
  }

  // Price is per second, so measure the real video length here instead of
  // trusting the browser.
  let durationSeconds: number
  try {
    durationSeconds = await probeVideoDuration(videoUrl)
  } catch (err: any) {
    console.warn('[AI jobs] could not read video length:', err?.message)
    return NextResponse.json(
      { error: "Couldn't read the video's length. Please export it as a standard MP4 and upload it again." },
      { status: 400 }
    )
  }
  if (durationSeconds < VIDEO_MIN_SECONDS - 0.05 || durationSeconds > VIDEO_MAX_SECONDS + 0.5) {
    return NextResponse.json(
      { error: `The reference video must be ${VIDEO_MIN_SECONDS}–${VIDEO_MAX_SECONDS} seconds long (this one is ${durationSeconds.toFixed(1)} s).` },
      { status: 400 }
    )
  }
  const cost = motionSwapPrice(durationSeconds, resolution)

  // Needs 5,000 credits in the wallet to use, and enough for this video;
  // the price is charged up front and refunded automatically if the render
  // fails. One video at a time.
  const balance = await getWalletBalance(userId)
  if (balance === null) return NextResponse.json({ error: "Couldn't check your credits. Please try again." }, { status: 503 })
  const needed = Math.max(MOTION_SWAP_REQUIRED_CREDITS, cost)
  if (balance < needed) {
    return NextResponse.json(
      {
        error:
          balance < MOTION_SWAP_REQUIRED_CREDITS
            ? `Motion Swap Studio needs at least ${MOTION_SWAP_REQUIRED_CREDITS.toLocaleString('en-IN')} credits in your wallet. This video costs ${cost.toLocaleString('en-IN')} credits; your balance is ${balance.toLocaleString('en-IN')}.`
            : `This video costs ${cost.toLocaleString('en-IN')} credits (${motionSwapBilledSeconds(durationSeconds)} s × ${MOTION_SWAP_CREDITS_PER_SECOND[resolution]} credits at ${resolution}). Your balance is ${balance.toLocaleString('en-IN')}.`,
        currentBalance: balance,
        requiredCredits: needed,
        price: cost,
      },
      { status: 403 }
    )
  }
  const { count } = await admin
    .from('ai_generations')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('app', app)
    .in('status', ['queued', 'in_progress'])
    .gte('created_at', new Date(Date.now() - 45 * 60 * 1000).toISOString())
  if ((count || 0) >= MAX_ACTIVE_VIDEO_JOBS_PER_USER) {
    return NextResponse.json({ error: 'You already have a video rendering. Please wait for it to finish.' }, { status: 429 })
  }

  const input: GenjutsuInput = {
    prompt: userPrompt || GENJUTSU_DEFAULT_PROMPT[mode],
    video_url: videoUrl,
    image_urls: imageUrls,
    resolution,
  }

  const { data: row, error: insertErr } = await admin
    .from('ai_generations')
    .insert({
      user_id: userId,
      app,
      model: 'genjutsu/motion-transfer/v1.0',
      status: 'queued',
      params: {
        // The signed video link expires; keep only what's useful for history.
        prompt: input.prompt,
        displayPrompt: userPrompt || (mode === 'motion-transfer' ? 'Motion transfer' : 'Object swap'),
        mode,
        resolution,
        imageCount: imageUrls.length,
        durationSeconds: Math.round(durationSeconds * 10) / 10,
        billedSeconds: motionSwapBilledSeconds(durationSeconds),
        creditsPerSecond: MOTION_SWAP_CREDITS_PER_SECOND[resolution],
        videoKey: typeof body.videoKey === 'string' ? body.videoKey : null,
        videoName: typeof body.videoName === 'string' ? body.videoName.slice(0, 120) : null,
      },
    })
    .select('*')
    .single()
  if (insertErr || !row) throw new Error(insertErr?.message || 'Could not create the job.')

  let newBalance = balance
  if (cost > 0) {
    const { data: after, error: chargeErr } = await admin.rpc('charge_ai_credits', {
      p_user_id: userId,
      p_amount: cost,
      p_description: `Motion Swap Studio video (${motionSwapBilledSeconds(durationSeconds)} s, ${resolution})`,
    })
    if (chargeErr) {
      await admin.from('ai_generations').update({ status: 'failed', error: 'Not enough credits.' }).eq('id', row.id)
      return NextResponse.json({ error: `Not enough credits (this video costs ${cost.toLocaleString('en-IN')}).` }, { status: 402 })
    }
    newBalance = Number(after)
    await admin.from('ai_generations').update({ credits_charged: cost }).eq('id', row.id)
  }

  try {
    const submitted = await submitGenjutsu(input)
    const { data: updated } = await admin
      .from('ai_generations')
      .update({ provider_request_id: submitted.requestId, status: submitted.status, updated_at: new Date().toISOString() })
      .eq('id', row.id)
      .select('*')
      .single()
    console.log('[AI jobs] submitted motion-swap', row.id, '→', submitted.requestId)
    return NextResponse.json({ job: publicJob(updated as JobRow), balance: newBalance })
  } catch (err: any) {
    const message = err instanceof HiggsfieldError ? err.message : `Couldn't reach Higgsfield: ${err?.message || 'unknown error'}`
    await admin.from('ai_generations').update({ status: 'failed', error: message, completed_at: new Date().toISOString() }).eq('id', row.id)
    let refundedBalance: number | null = null
    if (cost > 0) {
      const { data } = await admin.rpc('refund_ai_generation', { p_generation_id: row.id })
      refundedBalance = data === null || data === undefined ? null : Number(data)
    }
    return NextResponse.json(
      { error: message, balance: refundedBalance ?? balance },
      { status: err instanceof HiggsfieldError ? err.status : 502 }
    )
  }
}
