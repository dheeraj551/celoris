/**
 * Seedance video jobs (Video Studio → Seedance) on the Higgsfield API.
 * Called from POST /api/ai/jobs with { app: 'seedance', ... }.
 *
 * Checks, in order: plan (Seedance 2.5 / 2.0 switches in Admin → Plans),
 * inputs for the chosen mode, price (per second — lib/seedance-shared.ts),
 * wallet balance, and how many videos may render at once. Credits are taken
 * up front and refunded automatically if Higgsfield fails (refreshJob).
 */
import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { probeVideoDuration } from '@/lib/video-probe'
import {
  HiggsfieldError,
  JobRow,
  VIDEO_APPS,
  finishedVideoUrlForJob,
  getWalletBalance,
  publicJob,
  referenceVideoUrlForKey,
  submitHiggsfieldModel,
  verifyVideoUrl,
} from '@/lib/higgsfield-jobs'
import { getEntitlements, loadPlanSettings, upgradeLabelFor } from '@/lib/plans'
import {
  SEEDANCE_ASPECT_RATIOS,
  SEEDANCE_MODELS,
  SEEDANCE_MODE_LABEL,
  SOURCE_VIDEO_MODES,
  type SeedanceMode,
  type SeedanceModel,
  type SeedanceResolution,
  seedanceBilledSeconds,
  seedancePrice,
} from '@/lib/seedance-shared'

type Admin = ReturnType<typeof createSupabaseClientForServer>

/** What the member's plan allows in the Seedance studio (sent to the page). */
export async function seedancePlanInfo(admin: Admin, userId: string) {
  const [ent, settings] = await Promise.all([getEntitlements(admin, userId), loadPlanSettings(admin)])
  return {
    tier: ent.tier,
    label: ent.label,
    models: {
      'seedance-2.5': { allowed: ent.features.seedance_2_5, upgradeTo: upgradeLabelFor(settings, 'seedance_2_5') },
      'seedance-2.0': { allowed: ent.features.seedance_2_0, upgradeTo: upgradeLabelFor(settings, 'seedance_2_0') },
    },
    maxParallelVideos: ent.features.max_parallel_videos,
  }
}

const bad = (error: string, status = 400, extra: Record<string, unknown> = {}) => NextResponse.json({ error, ...extra }, { status })

/** Resolves an uploaded reference (video or audio) to a URL Higgsfield can download. */
async function resolveUpload(userId: string, item: any): Promise<string> {
  if (item && typeof item.key === 'string' && item.key) return referenceVideoUrlForKey(userId, item.key)
  if (item && typeof item.url === 'string' && item.url.length < 2048 && verifyVideoUrl(userId, item.url, item.token)) return item.url
  throw new HiggsfieldError('One of the uploaded files is missing — please add it again.', 400, 'input')
}

export async function startSeedanceJob(userId: string, body: any) {
  const admin = createSupabaseClientForServer()

  const model = (body.model === 'seedance-2.0' ? 'seedance-2.0' : 'seedance-2.5') as SeedanceModel
  const spec = SEEDANCE_MODELS[model]
  const mode = body.mode as SeedanceMode
  if (spec.modes.indexOf(mode) === -1) return bad(`${spec.label} can't do ${SEEDANCE_MODE_LABEL[mode] || 'that'}.`)

  // Plan
  const plan = await seedancePlanInfo(admin, userId)
  if (!plan.models[model].allowed) {
    return bad(`${spec.label} is included with the ${plan.models[model].upgradeTo} plan and above. You're on ${plan.label}.`, 403, {
      code: 'needs_plan',
      plan,
    })
  }

  // Settings
  const resolution: SeedanceResolution = body.resolution === '480p' ? '480p' : '720p'
  const aspectRatio = (SEEDANCE_ASPECT_RATIOS as readonly string[]).indexOf(body.aspectRatio) !== -1 ? String(body.aspectRatio) : '16:9'
  const duration = Math.round(Number(body.duration) || 5)
  if (duration < spec.minSeconds || duration > spec.maxSeconds) {
    return bad(`Length must be ${spec.minSeconds}–${spec.maxSeconds} seconds for ${spec.label}.`)
  }
  const generateAudio = body.generateAudio !== false
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 4000) : ''
  if (!prompt && (mode === 'text-to-video' || mode === 'video-edit' || mode === 'video-extend')) {
    return bad('Describe what you want in the prompt.')
  }

  // References
  const imageUrls: string[] = Array.isArray(body.imageUrls)
    ? body.imageUrls.filter((u: unknown) => typeof u === 'string' && /^https:\/\//i.test(u as string) && (u as string).length < 4096)
    : []
  let videoUrls: string[] = []
  let audioUrls: string[] = []
  let sourceUrl: string | null = null
  let sourceSeconds: number | null = null
  try {
    const vids = Array.isArray(body.videos) ? body.videos.slice(0, 12) : []
    const auds = Array.isArray(body.audios) ? body.audios.slice(0, 12) : []
    videoUrls = await Promise.all(vids.map((v: any) => resolveUpload(userId, v)))
    audioUrls = await Promise.all(auds.map((a: any) => resolveUpload(userId, a)))
    if (SOURCE_VIDEO_MODES.indexOf(mode) !== -1) {
      if (typeof body.sourceJobId === 'string' && body.sourceJobId) {
        const src = await finishedVideoUrlForJob(userId, body.sourceJobId)
        sourceUrl = src.url
        sourceSeconds = src.seconds
      } else if (videoUrls.length) {
        sourceUrl = videoUrls.shift() as string
      }
      if (!sourceUrl) return bad(mode === 'video-edit' ? 'Add the video you want to edit.' : 'Add the video you want to extend.')
    }
  } catch (err: any) {
    return bad(err?.message || 'Could not read the uploaded files.', err?.status || 400)
  }

  if (imageUrls.length > spec.maxImages) return bad(`${spec.label} takes up to ${spec.maxImages} images.`)
  const videoLimit = SOURCE_VIDEO_MODES.indexOf(mode) !== -1 ? spec.maxVideos - 1 : spec.maxVideos
  if (videoUrls.length > videoLimit) return bad(`${spec.label} takes up to ${videoLimit} extra videos here.`)
  if (audioUrls.length > spec.maxAudios) return bad(`${spec.label} takes up to ${spec.maxAudios} audio clips.`)
  if (imageUrls.length + videoUrls.length + audioUrls.length > spec.maxTotalRefs) {
    return bad(`Too many references (max ${spec.maxTotalRefs} in total).`)
  }
  if (mode === 'image-to-video' && imageUrls.length === 0) return bad('Add the image to animate.')
  if (mode === 'reference-to-video' && imageUrls.length + videoUrls.length + audioUrls.length === 0) {
    return bad('Add at least one image, video or audio reference.')
  }
  if (mode === 'reference-to-video' && !spec.imagesAndVideosTogether && imageUrls.length && videoUrls.length) {
    return bad(`${spec.label} takes image references or video references, not both. Remove one kind, or switch to Seedance 2.5.`)
  }

  // Video Edit keeps the source length, so measure it (it's what we charge for).
  if (mode === 'video-edit') {
    if (!sourceSeconds) {
      try {
        sourceSeconds = await probeVideoDuration(sourceUrl as string)
      } catch {
        return bad("Couldn't read the source video's length. Please upload it as a standard MP4.")
      }
    }
    if (sourceSeconds < 2 || sourceSeconds > 30.5) return bad(`The video to edit must be up to 30 seconds (this one is ${sourceSeconds.toFixed(1)} s).`)
  }

  // Higgsfield request body for this mode
  const input: Record<string, unknown> = { resolution, generate_audio: generateAudio }
  if (model === 'seedance-2.5') input.bitrate_mode = 'high'
  if (prompt) input.prompt = prompt
  switch (mode) {
    case 'text-to-video':
      Object.assign(input, { duration, aspect_ratio: aspectRatio })
      break
    case 'image-to-video':
      Object.assign(input, { duration, image_url: imageUrls[0] })
      if (imageUrls[1]) input.end_image_url = imageUrls[1]
      break
    case 'reference-to-video':
      Object.assign(input, { duration, aspect_ratio: aspectRatio })
      if (imageUrls.length) input.image_urls = imageUrls
      if (videoUrls.length) input.video_urls = videoUrls
      if (audioUrls.length) input.audio_urls = audioUrls
      break
    case 'video-edit':
      input.video_url = sourceUrl
      if (imageUrls.length) input.image_urls = imageUrls
      if (videoUrls.length) input.video_urls = videoUrls
      if (audioUrls.length) input.audio_urls = audioUrls
      break
    case 'video-extend':
      Object.assign(input, { duration, video_url: sourceUrl })
      if (imageUrls.length) input.image_urls = imageUrls
      if (videoUrls.length) input.video_urls = videoUrls
      if (audioUrls.length) input.audio_urls = audioUrls
      break
  }

  const hasVideoInput = videoUrls.length > 0 || !!sourceUrl
  const cost = seedancePrice({ model, mode, resolution, duration, sourceSeconds, hasVideoInput })
  const billedSeconds = seedanceBilledSeconds(mode, duration, sourceSeconds)

  const balance = await getWalletBalance(userId)
  if (balance === null) return bad("Couldn't check your credits. Please try again.", 503)
  if (balance < cost) {
    return bad(`This video costs ${cost.toLocaleString('en-IN')} credits. Your balance is ${balance.toLocaleString('en-IN')}.`, 402, {
      code: 'needs_credits',
      price: cost,
      currentBalance: balance,
    })
  }

  const { count } = await admin
    .from('ai_generations')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .in('app', VIDEO_APPS)
    .in('status', ['queued', 'in_progress'])
    .gte('created_at', new Date(Date.now() - 45 * 60 * 1000).toISOString())
  if ((count || 0) >= plan.maxParallelVideos) {
    return bad(
      plan.maxParallelVideos === 1
        ? 'You already have a video rendering. Please wait for it to finish.'
        : `Your ${plan.label} plan renders ${plan.maxParallelVideos} videos at a time. Please wait for one to finish.`,
      429,
      { code: 'parallel_limit' }
    )
  }

  const { data: row, error: insertErr } = await admin
    .from('ai_generations')
    .insert({
      user_id: userId,
      app: 'seedance',
      model: `bytedance/${model}/${mode}`,
      status: 'queued',
      params: {
        // Signed links expire, so only keep what's useful for history.
        model,
        mode,
        prompt,
        displayPrompt: typeof body.displayPrompt === 'string' ? body.displayPrompt.slice(0, 500) : prompt,
        resolution,
        aspect_ratio: mode === 'text-to-video' || mode === 'reference-to-video' ? aspectRatio : null,
        durationSeconds: mode === 'video-edit' ? Math.round((sourceSeconds || 0) * 10) / 10 : duration,
        outputSeconds: mode === 'video-extend' && sourceSeconds ? Math.round((sourceSeconds + duration) * 10) / 10 : mode === 'video-edit' ? sourceSeconds : duration,
        billedSeconds,
        generate_audio: generateAudio,
        imageCount: imageUrls.length,
        videoCount: videoUrls.length + (sourceUrl ? 1 : 0),
        audioCount: audioUrls.length,
        sourceJobId: typeof body.sourceJobId === 'string' ? body.sourceJobId : null,
      },
    })
    .select('*')
    .single()
  if (insertErr || !row) throw new Error(insertErr?.message || 'Could not create the job.')

  let newBalance = balance
  if (cost > 0) {
    const { data: after, error: chargeErr } = await (admin as any).rpc('charge_ai_credits', {
      p_user_id: userId,
      p_amount: cost,
      p_description: `${spec.label} ${SEEDANCE_MODE_LABEL[mode]} (${billedSeconds} s, ${resolution})`,
    })
    if (chargeErr) {
      await admin.from('ai_generations').update({ status: 'failed', error: 'Not enough credits.' }).eq('id', row.id)
      return bad(`Not enough credits (this video costs ${cost.toLocaleString('en-IN')}).`, 402, { code: 'needs_credits' })
    }
    newBalance = Number(after)
    await admin.from('ai_generations').update({ credits_charged: cost }).eq('id', row.id)
  }

  try {
    const submitted = await submitHiggsfieldModel(`/bytedance/${model}/${mode}`, input)
    const { data: updated } = await admin
      .from('ai_generations')
      .update({ provider_request_id: submitted.requestId, status: submitted.status, updated_at: new Date().toISOString() })
      .eq('id', row.id)
      .select('*')
      .single()
    console.log('[AI jobs] submitted seedance', model, mode, row.id, '→', submitted.requestId)
    return NextResponse.json({ job: publicJob(updated as JobRow), balance: newBalance, price: cost })
  } catch (err: any) {
    const message = err instanceof HiggsfieldError ? err.message : `Couldn't reach Higgsfield: ${err?.message || 'unknown error'}`
    await admin.from('ai_generations').update({ status: 'failed', error: message, completed_at: new Date().toISOString() }).eq('id', row.id)
    let refundedBalance: number | null = null
    if (cost > 0) {
      const { data } = await (admin as any).rpc('refund_ai_generation', { p_generation_id: row.id })
      refundedBalance = data === null || data === undefined ? null : Number(data)
    }
    return NextResponse.json({ error: message, balance: refundedBalance ?? balance }, { status: err instanceof HiggsfieldError ? err.status : 502 })
  }
}
