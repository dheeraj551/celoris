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

const API = 'https://api.higgsfield.ai'

export const PRO_REQUIRED_CREDITS = 2000
export const APP_CREDIT_COST: Record<'vio' | 'photolite', number> = {
  vio: 0, // ViO Studio: Pro-gated (2,000 credits) but not charged per image
  photolite: 100, // PhotoLite: 100 credits per image, refunded if it fails
}
export const MAX_ACTIVE_JOBS_PER_USER = 3
const STALE_AFTER_MS = 15 * 60 * 1000

export type AiApp = 'vio' | 'photolite'
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
    throw new HiggsfieldError("Image generation isn't configured on the server (HF_CREDENTIALS is missing).", 500)
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

export async function getRequestStatus(requestId: string): Promise<{ status: JobStatus; imageUrl: string | null; error: string | null }> {
  const body = await hf(`/requests/${encodeURIComponent(requestId)}/status`, { signal: AbortSignal.timeout(15_000) })
  return { status: normalizeStatus(body?.status), imageUrl: extractImageUrl(body), error: body?.error ? String(body.error) : null }
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
 * Stores a reference photo (product / model / canvas layer) in R2 for the
 * record, then uploads it to Higgsfield's own storage and returns the
 * public_url Higgsfield wants in image_urls.
 */
export async function storeReferenceImage(userId: string, bytes: Buffer, contentType: string): Promise<{ key: string; publicUrl: string }> {
  const ext = REF_TYPES[contentType]
  if (!ext) throw new HiggsfieldError('Please use a JPG, PNG or WebP image.', 400, 'input')
  const key = `ai-inputs/${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
  await putR2Object(key, bytes, contentType)

  const slot = await hf('/files/generate-upload-url', { method: 'POST', body: JSON.stringify({ content_type: contentType }) })
  if (!slot?.upload_url || !slot?.public_url) throw new HiggsfieldError('Higgsfield did not return an upload slot.', 502)
  const put = await fetch(slot.upload_url, {
    method: 'PUT',
    headers: { 'Content-Type': contentType, ...(slot.upload_headers || {}) },
    body: new Uint8Array(bytes),
    signal: AbortSignal.timeout(30_000),
  })
  if (!put.ok) {
    console.warn('[Higgsfield] reference upload failed:', put.status, await put.text().catch(() => ''))
    throw new HiggsfieldError("Couldn't send your image to Higgsfield. Please try again.", 502)
  }
  return { key, publicUrl: String(slot.public_url) }
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
  return err ? `Generation failed: ${err.slice(0, 200)}` : 'Higgsfield could not generate this image. Please try again.'
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

  let remote
  try {
    remote = await getRequestStatus(job.provider_request_id)
  } catch (err: any) {
    // Temporary network trouble: keep waiting unless the job is very old.
    if (Date.now() - new Date(job.created_at).getTime() > STALE_AFTER_MS) {
      return markFailed('failed', 'Timed out waiting for Higgsfield.')
    }
    console.warn('[AI jobs] status check failed (will retry):', err?.message)
    return job
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
    const key = `ai-outputs/${job.user_id}/${job.id}.${ext}`
    await putR2Object(key, Buffer.from(await img.arrayBuffer()), contentType)
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

  if (Date.now() - new Date(job.created_at).getTime() > STALE_AFTER_MS) {
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
    imageUrl: job.status === 'completed' && job.result_key ? `/api/ai/jobs/${job.id}/image` : null,
    creditsCharged: Number(job.credits_charged) || 0,
    refunded: !!job.refunded,
    createdAt: job.created_at,
    completedAt: job.completed_at,
  }
}

export async function signedResultUrl(key: string) {
  return createR2SignedReadUrl(key, 300)
}
