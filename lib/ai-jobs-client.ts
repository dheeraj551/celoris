"use client"

// Browser-side helpers for the async AI image jobs (ViO Studio + PhotoLite).
//
// Flow: shrink the reference photo in the browser -> POST /api/ai/uploads
// (stored in R2 + sent to Higgsfield) -> POST /api/ai/jobs (returns at once
// with a job id) -> poll GET /api/ai/jobs/{id} every few seconds until the
// image is ready -> show /api/ai/jobs/{id}/image (served from R2).
// No request ever waits for the render, so Vercel's timeouts can't kill it.

export type AiApp = 'vio' | 'photolite' | 'motion-swap' | 'seedance'
export type AiJobStatus = 'queued' | 'in_progress' | 'completed' | 'failed' | 'nsfw' | 'canceled'

export interface AiJob {
  id: string
  app: AiApp
  status: AiJobStatus
  error: string | null
  prompt: string
  presetName: string | null
  aspectRatio: string | null
  imageUrl: string | null
  /** Motion Swap Studio only */
  videoUrl?: string | null
  mode?: string | null
  /** Seedance only: 'seedance-2.5' | 'seedance-2.0' */
  model?: string | null
  generateAudio?: boolean | null
  resolution?: string | null
  durationSeconds?: number | null
  creditsCharged: number
  refunded: boolean
  createdAt: string
  completedAt: string | null
}

export interface MarketingPreset {
  id: string
  name: string
  category: string | null
  description: string | null
  previewUrl: string | null
}

export interface StartJobInput {
  app: AiApp
  prompt: string
  displayPrompt?: string
  presetId?: string | null
  presetName?: string | null
  imageUrls?: string[]
  aspectRatio?: string
  /** '1k' | '2k' | '4k' for images, '480p' | '720p' for Motion Swap videos */
  resolution?: '1k' | '2k' | '4k' | '480p' | '720p'
  quality?: 'low' | 'medium' | 'high'
  /** Motion Swap Studio ('motion-transfer' | 'objects-swap') or Seedance mode */
  mode?: string
  /** Seedance */
  model?: string
  duration?: number
  generateAudio?: boolean
  videos?: { key?: string; url?: string; token?: string }[]
  audios?: { key?: string; url?: string; token?: string }[]
  sourceJobId?: string
  videoKey?: string
  videoUrl?: string
  videoToken?: string
  videoName?: string
  durationSeconds?: number
}

/** What the member's plan allows in Motion Swap Studio (from GET /api/ai/jobs?app=motion-swap). */
export interface MotionSwapPlan {
  tier: 'free' | 'basic' | 'pro' | 'max'
  label: string
  allowed: boolean
  upgradeTo: string
  freeGensPerMonth: number
  freeGensLeft: number
  freeMaxSeconds: number
  maxParallelVideos: number
}

export class AiJobsError extends Error {
  constructor(message: string, public status: number, public data: any = null) {
    super(message)
  }
}

export const isPendingJob = (j: Pick<AiJob, 'status'>) => j.status === 'queued' || j.status === 'in_progress'

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, { ...init, cache: 'no-store', credentials: 'same-origin' })
  } catch {
    throw new AiJobsError('Could not reach Celoris. Check your connection and try again.', 0)
  }
  const data: any = await res.json().catch(() => null)
  if (!res.ok) {
    const message =
      data?.error ||
      (res.status === 401
        ? 'Please sign in first.'
        : res.status === 413
          ? 'That image is too large.'
          : res.status === 504
            ? 'The server took too long to answer. Please try again.'
            : `Request failed (error ${res.status}).`)
    throw new AiJobsError(message, res.status, data)
  }
  return data as T
}

// ------------------------------------------------------------------ images

const MAX_UPLOAD_BYTES = 2_600_000

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (/^https?:/i.test(src)) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new AiJobsError("Couldn't read that image. Please upload a JPG, PNG or WebP file.", 400))
    img.src = src
  })
}

function dataUrlBytes(dataUrl: string) {
  const i = dataUrl.indexOf(',')
  return Math.floor(((dataUrl.length - i - 1) * 3) / 4)
}

/**
 * Turns a File, Blob, data URL, http URL or <canvas> into a compact data URL
 * (longest side <= maxSide). Keeps PNG (transparency) when small enough,
 * otherwise falls back to JPEG on a white background.
 */
export async function toUploadDataUrl(source: string | Blob | HTMLCanvasElement, maxSide = 2048): Promise<string> {
  let srcCanvas: HTMLCanvasElement | HTMLImageElement
  let objectUrl: string | null = null
  try {
    if (typeof source === 'string') {
      srcCanvas = await loadImage(source)
    } else if ('getContext' in source) {
      srcCanvas = source
    } else {
      objectUrl = URL.createObjectURL(source)
      srcCanvas = await loadImage(objectUrl)
    }
    const w0 = srcCanvas instanceof HTMLImageElement ? srcCanvas.naturalWidth : srcCanvas.width
    const h0 = srcCanvas instanceof HTMLImageElement ? srcCanvas.naturalHeight : srcCanvas.height
    if (!w0 || !h0) throw new AiJobsError('That image is empty.', 400)
    const scale = Math.min(1, maxSide / Math.max(w0, h0))
    const w = Math.max(1, Math.round(w0 * scale))
    const h = Math.max(1, Math.round(h0 * scale))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new AiJobsError('Your browser could not process the image.', 400)
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(srcCanvas, 0, 0, w, h)

    let out: string
    try {
      out = canvas.toDataURL('image/png')
    } catch {
      throw new AiJobsError("This sample image can't be used. Please upload your own photo.", 400)
    }
    if (dataUrlBytes(out) <= MAX_UPLOAD_BYTES) return out

    // Too big as PNG: flatten onto white and use JPEG.
    const flat = document.createElement('canvas')
    flat.width = w
    flat.height = h
    const fctx = flat.getContext('2d')!
    fctx.fillStyle = '#ffffff'
    fctx.fillRect(0, 0, w, h)
    fctx.drawImage(canvas, 0, 0)
    for (const q of [0.92, 0.85, 0.75, 0.65]) {
      out = flat.toDataURL('image/jpeg', q)
      if (dataUrlBytes(out) <= MAX_UPLOAD_BYTES) return out
    }
    return toUploadDataUrl(flat, Math.round(maxSide * 0.75))
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl)
  }
}

// Same source image -> reuse its uploaded URL for this page session.
const uploadCache = new Map<string, Promise<string>>()

/** Uploads a reference image and returns the URL to pass as imageUrls. */
export function uploadReferenceImage(source: string | Blob | HTMLCanvasElement, cacheKey?: string): Promise<string> {
  const key = cacheKey ?? (typeof source === 'string' && source.length < 4096 ? source : undefined)
  if (key && uploadCache.has(key)) return uploadCache.get(key)!
  const p = (async () => {
    const dataUrl = await toUploadDataUrl(source)
    const { url } = await call<{ url: string }>('/api/ai/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dataUrl }),
    })
    return url
  })()
  if (key) {
    uploadCache.set(key, p)
    p.catch(() => uploadCache.delete(key))
  }
  return p
}

// ------------------------------------------------------------------ jobs

export function startAiJob(input: StartJobInput) {
  return call<{ job: AiJob; balance?: number; freeGen?: boolean; plan?: MotionSwapPlan }>('/api/ai/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
}

export function getAiJob(id: string) {
  return call<{ job: AiJob; balance?: number }>(`/api/ai/jobs/${encodeURIComponent(id)}`)
}

export async function listAiJobs(app: AiApp): Promise<AiJob[]> {
  const { jobs } = await call<{ jobs: AiJob[] }>(`/api/ai/jobs?app=${app}`)
  return jobs || []
}

/** History plus the current wallet balance (null if it couldn't be read). */
export async function listAiJobsWithBalance(
  app: AiApp
): Promise<{ jobs: AiJob[]; balance: number | null; plan: MotionSwapPlan | null }> {
  const res = await call<{ jobs: AiJob[]; balance?: number | null; plan?: MotionSwapPlan | null }>(`/api/ai/jobs?app=${app}`)
  return { jobs: res.jobs || [], balance: typeof res.balance === 'number' ? res.balance : null, plan: res.plan || null }
}

// ------------------------------------------------------------------ videos

/** Reads a local video's length (seconds) without uploading it. */
export function readVideoDuration(file: Blob): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const v = document.createElement('video')
    v.preload = 'metadata'
    v.muted = true
    const done = (fn: () => void) => {
      URL.revokeObjectURL(url)
      fn()
    }
    v.onloadedmetadata = () => done(() => (Number.isFinite(v.duration) ? resolve(v.duration) : reject(new AiJobsError("Couldn't read the video's length.", 400))))
    v.onerror = () => done(() => reject(new AiJobsError("Your browser couldn't open this video. Please use an MP4 file.", 400)))
    v.src = url
  })
}

function putWithProgress(url: string, file: Blob, headers: Record<string, string>, onProgress?: (fraction: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', url)
    Object.entries(headers || {}).forEach(([k, v]) => {
      if (k.toLowerCase() !== 'content-length' && k.toLowerCase() !== 'host') xhr.setRequestHeader(k, String(v))
    })
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total)
    }
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new AiJobsError(`Upload failed (error ${xhr.status}).`, xhr.status)))
    // Network errors here are usually the storage bucket's CORS rules.
    xhr.onerror = () => reject(new AiJobsError('Upload was blocked by the storage server.', 0, { network: true }))
    xhr.send(file)
  })
}

/**
 * Uploads a Motion Swap reference video straight from the browser.
 * Tries our R2 bucket first, then Higgsfield's storage if R2 blocks it.
 * Returns what to pass to startAiJob (videoKey or videoUrl).
 */
export async function uploadReferenceVideo(
  file: File,
  onProgress?: (fraction: number) => void,
  purpose?: 'seedance'
): Promise<{ videoKey?: string; videoUrl?: string; videoToken?: string }> {
  const contentType = file.type || 'video/mp4'
  const r2 = await call<{ uploadUrl: string; headers: Record<string, string>; videoKey: string }>('/api/ai/video-uploads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType, size: file.size, purpose }),
  })
  try {
    await putWithProgress(r2.uploadUrl, file, r2.headers, onProgress)
    return { videoKey: r2.videoKey }
  } catch (err: any) {
    if (!(err instanceof AiJobsError && err.data?.network)) throw err
    console.warn('[Motion Swap] R2 upload blocked, trying Higgsfield storage instead')
  }
  const hf = await call<{ uploadUrl: string; headers: Record<string, string>; videoUrl: string; videoToken: string }>('/api/ai/video-uploads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contentType, size: file.size, target: 'higgsfield', purpose }),
  })
  await putWithProgress(hf.uploadUrl, file, { 'Content-Type': contentType, ...hf.headers }, onProgress)
  return { videoUrl: hf.videoUrl, videoToken: hf.videoToken }
}

export async function listMarketingPresets(): Promise<MarketingPreset[]> {
  const { presets } = await call<{ presets: MarketingPreset[] }>('/api/marketing/presets')
  return presets || []
}

/**
 * Polls one job until it finishes (or the signal aborts). Calls onUpdate on
 * every change. Network blips are retried; only a finished job resolves.
 */
export async function waitForAiJob(
  id: string,
  opts: { onUpdate?: (job: AiJob, balance?: number) => void; signal?: AbortSignal; intervalMs?: number; timeoutMs?: number } = {}
): Promise<{ job: AiJob; balance?: number }> {
  const interval = opts.intervalMs ?? 3000
  const deadline = Date.now() + (opts.timeoutMs ?? 16 * 60 * 1000)
  let failures = 0
  while (true) {
    if (opts.signal?.aborted) throw new AiJobsError('Stopped waiting.', 0)
    await new Promise((r) => setTimeout(r, interval))
    if (opts.signal?.aborted) throw new AiJobsError('Stopped waiting.', 0)
    try {
      const res = await getAiJob(id)
      failures = 0
      opts.onUpdate?.(res.job, res.balance)
      if (!isPendingJob(res.job)) return res
    } catch (err: any) {
      if (err instanceof AiJobsError && (err.status === 401 || err.status === 404)) throw err
      failures += 1
      if (failures >= 8) throw err
    }
    if (Date.now() > deadline) throw new AiJobsError('This is taking unusually long. It will appear in your history when it finishes.', 0)
  }
}
