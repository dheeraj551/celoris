import { after } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { createR2SignedReadUrl, putR2Object } from '@/lib/r2-client'

// Shared server-side plumbing for Higgsfield image jobs (ViO Studio +
// PhotoLite). Everything here is fast: submit returns as soon as Higgsfield
// queues the job, and status checks are single short calls — nothing waits
// for a render to finish inside one request anymore.
//
// Higgsfield API facts this relies on (docs.higgsfield.ai):
//  - POST https://api.higgsfield.ai/marketing-studio/image → { request_id, status_url, ... }
//  - GET  https://api.higgsfield.ai/requests/{id}/status → { status, images: [{ url }], error }
//    statuses: queued, in_progress, completed, failed, nsfw, canceled
//  - POST https://api.higgsfield.ai/files/generate-upload-url → { upload_url, public_url, upload_headers }
//  - GET  https://api.higgsfield.ai/marketing-studio/image/presets
//  - Output URLs are kept ~7 days, so results are copied into R2.
//  - POST https://api.higgsfield.ai/higgsfiled/genjutsu/motion-transfer/v1.0
//    { prompt, video_url, image_urls[], resolution: '480p' | '720p' }
//    → same { request_id } / status flow; the result is { video: { url } }.
//    ("higgsfiled" is Higgsfield's own spelling of the model id.) The source
//    video must be at least 4 seconds long. Billed per output second.

const API = 'https://api.higgsfield.ai'

export const PRO_REQUIRED_CREDITS = 2000
export const APP_CREDIT_COST: Record<AiApp, number> = {
  vio: 0, // ViO Studio: Pro-gated (2,000 credits) but not charged per image
  photolite: 100, // PhotoLite: 100 credits per image, refunded if it fails
  'motion-swap': 1000, // Motion Swap Studio: 1,000 credits per video, refunded if it fails
}

/** Minimum wallet balance needed to use Motion Swap Studio at all. */
export const MOTION_SWAP_REQUIRED_CREDITS = 5000
export const MAX_ACTIVE_JOBS_PER_USER = 3
const STALE_AFTER_MS = 15 * 60 * 1000

export type AiApp = 'vio' | 'photolite' | 'motion-swap'
export const APP_LABEL: Record<AiApp, string> = { vio: 'ViO Studio', photolite: 'PhotoLite', 'motion-swap': 'Motion Swap Studio' }

// Genjutsu renders take minutes, so a video job is allowed longer before we
// give up on it than an image.
const VIDEO_STALE_AFTER_MS = 45 * 60 * 1000
export const GENJUTSU_MODEL_PATH = '/higgsfiled/genjutsu/motion-transfer/v1.0'
export const GENJUTSU_RESOLUTIONS = ['480p', '720p'] as const
export type GenjutsuResolution = (typeof GENJUTSU_RESOLUTIONS)[number]
export const VIDEO_MIN_SECONDS = 4
export const VIDEO_MAX_SECONDS = 30
export const MAX_ACTIVE_VIDEO_JOBS_PER_USER = 1
export type JobStatus = 'queued' | 'in_progress' | 'completed' | 'failed' | 'nsfw' | 'canceled'

export class HiggsfieldError extends Error {
  constructor(message: string, public status: number, public kind: 'auth' | 'account' | 'moderation' | 'input' | 'other' = 'other') {
    super(message)
  }
}

// ------------------------------------------------------------------ credentials

let cachedAuth: string | null = null
export function higgsfieldAuthHeader(): string {
  if (cachedAuth) return cachedAuth
  let keyId: string | undefined
  let keySecret: string | undefined
  const combined = process.env.HF_CREDENTIALS || process.env.HIGGSFIELD_CREDENTIALS || process.env.HF_KEY
  if (combined) {
    let clean = combined.trim().replace(/^["']|["']$/g, '').trim()
    if (clean.toLowerCase().startsWith('hf_credentials=')) clean = clean.slice('hf_credentials='.length).trim()
    if (/^key /i.test(clean)) clean = clean.slice(4).trim()
    const i = clean.indexOf(':')
    if (i > 0 && i < clean.length - 1) {
      keyId = clean.slice(0, i).trim()
      keySecret = clean.slice(i + 1).trim()
    }
  }
  if (!keyId || !keySecret) {
    keyId = (process.env.HIGGSFIELD_KEY_ID || process.env.HF_API_KEY || '').trim() || undefined
    keySecret = (process.env.HIGGSFIELD_KEY_SECRET || process.env.HF_API_SECRET || '').trim() || undefined
  }
  if (!keyId || !keySecret) {
    throw new HiggsfieldError("AI generation isn't configured on the server (HF_CREDENTIALS is missing).", 500)
  }
  cachedAuth = `Key ${keyId}:${keySecret}`
  return cachedAuth
}

async function hf(path: string, init: RequestInit = {}): Promise<any> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: higgsfieldAuthHeader(),
      'Content-Type': 'application/json',
      'User-Agent': 'celoris-server/1.0',
      ...(init.headers || {}),
    },
    cache: 'no-store',
    signal: init.signal ?? AbortSignal.timeout(25_000),
  })
  const text = await res.text()
  let body: any = null
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = { detail: text }
  }
  if (!res.ok) {
    const detail = typeof body?.detail === 'string' ? body.detail : JSON.stringify(body?.detail ?? body ?? '').slice(0, 300)
    console.warn(`[Higgsfield] ${init.method || 'GET'} ${path} → ${res.status}: ${detail}`)
    if (res.status === 401) throw new HiggsfieldError('Higgsfield rejected the API key. Check HF_CREDENTIALS in Vercel.', 502, 'auth')
    if (res.status === 402 || res.status === 403)
      throw new HiggsfieldError(`Higgsfield refused the request (${res.status}): ${detail}`, 402, 'account')
    if (res.status === 422 || res.status === 400) throw new HiggsfieldError(`Higgsfield couldn't use these settings: ${detail}`, 400, 'input')
    throw new HiggsfieldError(`Higgsfield error ${res.status}: ${detail}`, 502)
  }
  return body
}

// ------------------------------------------------------------------ jobs

export function extractImageUrl(result: any): string | null {
  if (!result) return null
  const first = (arr: any) => (Array.isArray(arr) && arr.length ? (typeof arr[0] === 'string' ? arr[0] : arr[0]?.url || null) : null)
  return (
    first(result.images) ||
    first(result.output?.images) ||
    result.image?.url ||
    result.output?.url ||
    result.jobs?.[0]?.results?.raw?.url ||
    (typeof result.url === 'string' ? result.url : null)
  )
}

export function extractVideoUrl(result: any): string | null {
  if (!result) return null
  const v = result.video ?? result.output?.video
  if (typeof v === 'string') return v
  if (v?.url) return String(v.url)
  const vids = result.videos ?? result.output?.videos
  if (Array.isArray(vids) && vids.length) return typeof vids[0] === 'string' ? vids[0] : vids[0]?.url || null
  return null
}

export interface GenjutsuInput {
  prompt: string
  video_url: string
  image_urls: string[]
  resolution: GenjutsuResolution
}

export async function submitGenjutsu(input: GenjutsuInput): Promise<{ requestId: string; status: JobStatus }> {
  const body = await hf(GENJUTSU_MODEL_PATH, { method: 'POST', body: JSON.stringify(input) })
  const requestId = body?.request_id || body?.id
  if (!requestId) {
    console.warn('[Higgsfield] Genjutsu submit returned no request_id. Keys:', Object.keys(body || {}))
    throw new HiggsfieldError('Higgsfield accepted the video job but returned no request id.', 502)
  }
  return { requestId: String(requestId), status: normalizeStatus(body?.status) }
}

/** An upload slot in Higgsfield's own storage (used for reference videos). */
export async function createHiggsfieldUploadSlot(contentType: string): Promise<{ uploadUrl: string; publicUrl: string; headers: Record<string, string> }> {
  const slot = await hf('/files/generate-upload-url', { method: 'POST', body: JSON.stringify({ content_type: contentType }) })
  if (!slot?.upload_url || !slot?.public_url) {
    throw new HiggsfieldError(`Higgsfield returned no upload slot (keys: ${Object.keys(slot || {}).join(', ') || 'none'}).`, 502)
  }
  return { uploadUrl: String(slot.upload_url), publicUrl: String(slot.public_url), headers: slot.upload_headers || {} }
}

export interface MarketingStudioInput {
  prompt: string
  aspect_ratio: string
  resolution: '1k' | '2k' | '4k'
  quality: 'low' | 'medium' | 'high'
  image_urls?: string[]
  enhance_prompt?: boolean
  preset_id?: string
}

export async function submitMarketingStudioImage(input: MarketingStudioInput): Promise<{ requestId: string; status: JobStatus }> {
  const body = await hf('/marketing-studio/image', { method: 'POST', body: JSON.stringify(input) })
  const requestId = body?.request_id || body?.id
  if (!requestId) {
    console.warn('[Higgsfield] submit returned no request_id. Keys:', Object.keys(body || {}))
    throw new HiggsfieldError('Higgsfield accepted the job but returned no request id.', 502)
  }
  return { requestId: String(requestId), status: normalizeStatus(body?.status) }
}

export async function getRequestStatus(
  requestId: string
): Promise<{ status: JobStatus; imageUrl: string | null; videoUrl: string | null; error: string | null }> {
  const body = await hf(`/requests/${encodeURIComponent(requestId)}/status`, { signal: AbortSignal.timeout(15_000) })
  return {
    status: normalizeStatus(body?.status),
    imageUrl: extractImageUrl(body),
    videoUrl: extractVideoUrl(body),
    error: body?.error ? String(typeof body.error === 'string' ? body.error : JSON.stringify(body.error)) : null,
  }
}

function normalizeStatus(s: any): JobStatus {
  const v = String(s || 'queued').toLowerCase()
  if (v === 'completed' || v === 'failed' || v === 'nsfw' || v === 'canceled' || v === 'in_progress' || v === 'queued') return v
  if (v === 'cancelled') return 'canceled'
  if (v === 'processing' || v === 'running') return 'in_progress'
  return 'queued'
}

// ------------------------------------------------------------------ reference images

const REF_TYPES: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

/**
 * Makes a reference photo (product / model / canvas layer) available to
 * Higgsfield and returns the URL to put in image_urls.
 *
 *  1. Keep a copy in our R2 bucket (best effort — never blocks generation).
 *  2. Preferred: upload the bytes into Higgsfield's own storage
 *     (/files/generate-upload-url) and use its public_url.
 *  3. Fallback: if that fails, give Higgsfield a 24-hour signed link to the
 *     R2 copy so it can download the image itself.
 */
export async function storeReferenceImage(userId: string, bytes: Buffer, contentType: string): Promise<{ key: string | null; publicUrl: string }> {
  const ext = REF_TYPES[contentType]
  if (!ext) throw new HiggsfieldError('Please use a JPG, PNG or WebP image.', 400, 'input')

  let key: string | null = `ai-inputs/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
  try {
    await putR2Object(key, bytes, contentType)
  } catch (err: any) {
    console.warn('[AI uploads] R2 copy failed (continuing without it):', err?.message)
    key = null
  }

  let hfProblem = ''
  try {
    const slot = await hf('/files/generate-upload-url', { method: 'POST', body: JSON.stringify({ content_type: contentType }) })
    if (!slot?.upload_url || !slot?.public_url) {
      hfProblem = `no upload slot returned (keys: ${Object.keys(slot || {}).join(', ') || 'none'})`
    } else {
      const put = await fetch(slot.upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': contentType, ...(slot.upload_headers || {}) },
        body: new Uint8Array(bytes),
        signal: AbortSignal.timeout(30_000),
      })
      if (put.ok) return { key, publicUrl: String(slot.public_url) }
      hfProblem = `storage PUT ${put.status}: ${(await put.text().catch(() => '')).slice(0, 200)}`
    }
  } catch (err: any) {
    hfProblem = err?.message || 'unknown error'
  }
  console.warn('[AI uploads] Higgsfield upload failed:', hfProblem)

  if (key) {
    // Higgsfield downloads the image straight from our private bucket.
    const signed = await createR2SignedReadUrl(key, 24 * 60 * 60)
    console.log('[AI uploads] using signed R2 link for Higgsfield instead')
    return { key, publicUrl: signed }
  }
  throw new HiggsfieldError(
    `Couldn't hand your image to Higgsfield (${hfProblem}) and the R2 backup also failed — check the R2_* settings in Vercel.`,
    502
  )
}

// ------------------------------------------------------------------ presets

export interface MarketingPreset {
  id: string
  name: string
  category: string | null
  description: string | null
  previewUrl: string | null
}

let presetCache: { at: number; presets: MarketingPreset[] } | null = null

export async function listMarketingPresets(): Promise<MarketingPreset[]> {
  if (presetCache && Date.now() - presetCache.at < 60 * 60 * 1000) return presetCache.presets
  const body = await hf('/marketing-studio/image/presets')
  // The response shape isn't documented in detail — accept the common ones.
  const raw: any[] = Array.isArray(body)
    ? body
    : body?.presets || body?.items || body?.data || body?.results || []
  if (!Array.isArray(raw) || raw.length === 0) {
    console.warn('[Higgsfield] presets response had no list. Keys:', Object.keys(body || {}))
  }
  const pick = (o: any, keys: string[]) => {
    for (const k of keys) {
      const v = k.split('.').reduce((a, p) => (a == null ? a : a[p]), o)
      if (typeof v === 'string' && v.trim()) return v.trim()
    }
    return null
  }
  const presets: MarketingPreset[] = (Array.isArray(raw) ? raw : [])
    .map((p) => ({
      id: pick(p, ['id', 'preset_id', 'uuid']) || '',
      name: pick(p, ['name', 'title', 'label']) || 'Preset',
      category: pick(p, ['category', 'category_name', 'group', 'type', 'category.name']),
      description: pick(p, ['description', 'subtitle', 'prompt_hint']),
      previewUrl: pick(p, ['preview_url', 'thumbnail_url', 'thumbnail', 'image_url', 'cover_url', 'preview', 'example_url', 'media.url']),
    }))
    .filter((p) => /^[0-9a-f-]{8,}$/i.test(p.id))
  presetCache = { at: Date.now(), presets }
  return presets
}

// ------------------------------------------------------------------ wallet

export async function getWalletBalance(userId: string): Promise<number | null> {
  const admin = createSupabaseClientForServer()
  const { data: u, error: ue } = await admin.from('users').select('wallet_balance').eq('id', userId).maybeSingle()
  if (!ue && u && u.wallet_balance !== null && u.wallet_balance !== undefined) return Number(u.wallet_balance) || 0
  const { data: p, error: pe } = await admin.from('profiles').select('wallet_balance').eq('id', userId).maybeSingle()
  if (!pe && p) return Number(p.wallet_balance) || 0
  if (ue || pe) return null
  return 0
}

// ------------------------------------------------------------------ job refresh

export interface JobRow {
  id: string
  user_id: string
  app: AiApp
  provider_request_id: string | null
  status: JobStatus
  params: any
  result_key: string | null
  error: string | null
  credits_charged: number
  refunded: boolean
  created_at: string
  completed_at: string | null
}

const TERMINAL: JobStatus[] = ['completed', 'failed', 'nsfw', 'canceled']
export const isTerminal = (s: JobStatus) => TERMINAL.includes(s)

function friendlyFailure(status: JobStatus, err: string | null) {
  if (status === 'nsfw') return "Higgsfield's safety filter blocked this. Try a different prompt or image."
  if (status === 'canceled') return 'This generation was canceled.'
  return err ? `Generation failed: ${err.slice(0, 200)}` : 'Higgsfield could not generate this. Please try again.'
}

/**
 * Brings a pending job up to date with Higgsfield. When it has finished,
 * copies the image into R2 (permanent) and marks the row completed. Failed
 * jobs are refunded once. Safe to call repeatedly / concurrently.
 */
export async function refreshJob(job: JobRow): Promise<JobRow> {
  if (isTerminal(job.status)) return job
  const admin = createSupabaseClientForServer()

  const markFailed = async (status: JobStatus, message: string) => {
    const { data } = await admin
      .from('ai_generations')
      .update({ status, error: message, updated_at: new Date().toISOString(), completed_at: new Date().toISOString() })
      .eq('id', job.id)
      .in('status', ['queued', 'in_progress'])
      .select('*')
      .maybeSingle()
    if (job.credits_charged > 0) await admin.rpc('refund_ai_generation', { p_generation_id: job.id })
    return (data as JobRow) || { ...job, status, error: message }
  }

  if (!job.provider_request_id) {
    return markFailed('failed', 'The job was never accepted by Higgsfield.')
  }

  const isVideo = job.app === 'motion-swap'
  const staleAfter = isVideo ? VIDEO_STALE_AFTER_MS : STALE_AFTER_MS

  let remote
  try {
    remote = await getRequestStatus(job.provider_request_id)
  } catch (err: any) {
    // Temporary network trouble: keep waiting unless the job is very old.
    if (Date.now() - new Date(job.created_at).getTime() > staleAfter) {
      return markFailed('failed', 'Timed out waiting for Higgsfield.')
    }
    console.warn('[AI jobs] status check failed (will retry):', err?.message)
    return job
  }

  if (remote.status === 'completed' && isVideo) {
    if (!remote.videoUrl) return markFailed('failed', 'Higgsfield finished but returned no video.')
    // Show the result straight away from Higgsfield's link (kept 7+ days),
    // then copy it into R2 after the response has been sent — a video is
    // too big to download and re-upload inside a status check.
    const { data } = await admin
      .from('ai_generations')
      .update({ status: 'completed', result_key: `ext:${remote.videoUrl}`, error: null, updated_at: new Date().toISOString(), completed_at: new Date().toISOString() })
      .eq('id', job.id)
      .in('status', ['queued', 'in_progress'])
      .select('*')
      .maybeSingle()
    if (data) {
      const sourceUrl = remote.videoUrl
      after(() => copyVideoToR2(job.id, job.user_id, sourceUrl))
    }
    return (data as JobRow) || { ...job, status: 'completed', result_key: `ext:${remote.videoUrl}` }
  }

  if (remote.status === 'completed') {
    if (!remote.imageUrl) return markFailed('failed', 'Higgsfield finished but returned no image.')
    const img = await fetch(remote.imageUrl, { signal: AbortSignal.timeout(40_000) })
    if (!img.ok) {
      console.warn('[AI jobs] could not download result:', img.status)
      return job // try again on the next poll
    }
    const contentType = (img.headers.get('content-type') || 'image/png').split(';')[0]
    const ext = contentType.includes('jpeg') ? 'jpg' : contentType.includes('webp') ? 'webp' : 'png'
    let key = `ai-outputs/${job.user_id}/${job.id}.${ext}`
    try {
      await putR2Object(key, Buffer.from(await img.arrayBuffer()), contentType)
    } catch (err: any) {
      // Don't lose a finished (already paid-for) image because storage hiccuped:
      // serve it from Higgsfield's link for now (kept ~7 days).
      console.warn('[AI jobs] R2 save failed, using Higgsfield URL:', err?.message)
      key = `ext:${remote.imageUrl}`
    }
    const { data } = await admin
      .from('ai_generations')
      .update({ status: 'completed', result_key: key, error: null, updated_at: new Date().toISOString(), completed_at: new Date().toISOString() })
      .eq('id', job.id)
      .select('*')
      .maybeSingle()
    return (data as JobRow) || { ...job, status: 'completed', result_key: key }
  }

  if (remote.status === 'failed' || remote.status === 'nsfw' || remote.status === 'canceled') {
    return markFailed(remote.status, friendlyFailure(remote.status, remote.error))
  }

  if (Date.now() - new Date(job.created_at).getTime() > staleAfter) {
    return markFailed('failed', 'Timed out waiting for Higgsfield.')
  }

  if (remote.status !== job.status) {
    await admin.from('ai_generations').update({ status: remote.status, updated_at: new Date().toISOString() }).eq('id', job.id)
    return { ...job, status: remote.status }
  }
  return job
}

/** What the browser gets back for a job (never the raw R2 key). */
export function publicJob(job: JobRow) {
  return {
    id: job.id,
    app: job.app,
    status: job.status,
    error: job.error,
    prompt: job.params?.displayPrompt ?? job.params?.prompt ?? '',
    presetName: job.params?.presetName ?? null,
    aspectRatio: job.params?.aspect_ratio ?? null,
    imageUrl: job.status === 'completed' && job.result_key && job.app !== 'motion-swap' ? `/api/ai/jobs/${job.id}/image` : null,
    videoUrl: job.status === 'completed' && job.result_key && job.app === 'motion-swap' ? `/api/ai/jobs/${job.id}/video` : null,
    mode: job.params?.mode ?? null,
    resolution: job.params?.resolution ?? null,
    durationSeconds: typeof job.params?.durationSeconds === 'number' ? job.params.durationSeconds : null,
    creditsCharged: Number(job.credits_charged) || 0,
    refunded: !!job.refunded,
    createdAt: job.created_at,
    completedAt: job.completed_at,
  }
}

export async function signedResultUrl(key: string, expiresInSeconds = 300, contentDisposition?: string) {
  return createR2SignedReadUrl(key, expiresInSeconds, contentDisposition)
}

/**
 * Copies a finished Genjutsu video from Higgsfield into R2 so it outlives
 * Higgsfield's 7-day retention. Runs after the response (next/server
 * `after`); on any problem the job simply keeps using Higgsfield's link.
 */
async function copyVideoToR2(jobId: string, userId: string, sourceUrl: string) {
  try {
    const res = await fetch(sourceUrl, { signal: AbortSignal.timeout(50_000) })
    if (!res.ok) throw new Error(`download ${res.status}`)
    const contentType = (res.headers.get('content-type') || 'video/mp4').split(';')[0]
    const ext = contentType.includes('webm') ? 'webm' : contentType.includes('quicktime') ? 'mov' : 'mp4'
    const key = `ai-outputs/${userId}/${jobId}.${ext}`
    await putR2Object(key, Buffer.from(await res.arrayBuffer()), contentType)
    const admin = createSupabaseClientForServer()
    await admin.from('ai_generations').update({ result_key: key, updated_at: new Date().toISOString() }).eq('id', jobId)
    console.log('[AI jobs] video copied to R2', jobId)
  } catch (err: any) {
    console.warn('[AI jobs] video R2 copy failed (keeping Higgsfield link):', err?.message)
  }
}

/** Reference videos uploaded to our R2 bucket live under this prefix. */
export function referenceVideoKeyPrefix(userId: string) {
  return `ai-inputs/${userId}/video-`
}

/**
 * Lets Higgsfield download a reference video from our private bucket. The
 * key must be one of this user's own uploads.
 */
export async function referenceVideoUrlForKey(userId: string, key: string): Promise<string> {
  if (!key.startsWith(referenceVideoKeyPrefix(userId)) || key.includes('..')) {
    throw new HiggsfieldError('That reference video does not belong to your account.', 403, 'input')
  }
  return createR2SignedReadUrl(key, 24 * 60 * 60)
}
