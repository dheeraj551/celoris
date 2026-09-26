// Seedance (ByteDance, via the Higgsfield API) — shared by the Video Studio
// page and the server. Plain data only.
//
// Higgsfield endpoints (docs.higgsfield.ai/docs/models/seedance-2-5/*):
//   POST /bytedance/seedance-2.5/{text-to-video|image-to-video|reference-to-video|video-edit|video-extend}
//   POST /bytedance/seedance-2.0/{text-to-video|image-to-video|reference-to-video}
// Then the usual GET /requests/{id}/status → { status, video: { url } }.

export type SeedanceModel = 'seedance-2.5' | 'seedance-2.0'
export type SeedanceMode = 'text-to-video' | 'image-to-video' | 'reference-to-video' | 'video-edit' | 'video-extend'
export type SeedanceResolution = '480p' | '720p'

export const SEEDANCE_ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:3', '3:4', '21:9'] as const
export type SeedanceAspect = (typeof SEEDANCE_ASPECT_RATIOS)[number]

export interface SeedanceModelSpec {
  id: SeedanceModel
  label: string
  /** Plan feature that unlocks it (see lib/plan-features.ts) */
  feature: 'seedance_2_5' | 'seedance_2_0'
  modes: SeedanceMode[]
  minSeconds: number
  maxSeconds: number
  maxImages: number
  maxVideos: number
  maxAudios: number
  maxTotalRefs: number
  /** 2.0 takes either images or videos as references, not both */
  imagesAndVideosTogether: boolean
}

export const SEEDANCE_MODELS: Record<SeedanceModel, SeedanceModelSpec> = {
  'seedance-2.5': {
    id: 'seedance-2.5',
    label: 'Seedance 2.5',
    feature: 'seedance_2_5',
    modes: ['text-to-video', 'image-to-video', 'reference-to-video', 'video-edit', 'video-extend'],
    minSeconds: 4,
    maxSeconds: 30,
    maxImages: 30,
    maxVideos: 10,
    maxAudios: 10,
    maxTotalRefs: 50,
    imagesAndVideosTogether: true,
  },
  'seedance-2.0': {
    id: 'seedance-2.0',
    label: 'Seedance 2.0',
    feature: 'seedance_2_0',
    modes: ['text-to-video', 'image-to-video', 'reference-to-video'],
    minSeconds: 4,
    maxSeconds: 15,
    maxImages: 9,
    maxVideos: 3,
    maxAudios: 3,
    maxTotalRefs: 15,
    imagesAndVideosTogether: false,
  },
}

export const SEEDANCE_MODE_LABEL: Record<SeedanceMode, string> = {
  'text-to-video': 'Text to Video',
  'image-to-video': 'Image to Video',
  'reference-to-video': 'Reference to Video',
  'video-edit': 'Video Edit',
  'video-extend': 'Video Extend',
}

/** Modes that need a source video (the first video, or a previous result). */
export const SOURCE_VIDEO_MODES: SeedanceMode[] = ['video-edit', 'video-extend']

/**
 * Celoris credits per second of output (1 credit ≈ ₹1.11; ₹500 → 450 credits).
 * Based on Higgsfield's API list price for Seedance 2.5 (≈ $0.25/s at 480p,
 * ≈ $0.56/s at 720p before their discounts) with a margin, like Motion Swap.
 * Jobs that feed a video in (reference with videos, edit, extend) cost more
 * on Higgsfield because the input video is processed too.
 * ⚠ Estimates — compare with the Higgsfield bill after the first renders and
 * adjust here.
 */
export const SEEDANCE_CREDITS_PER_SECOND: Record<SeedanceModel, Record<SeedanceResolution, number>> = {
  'seedance-2.5': { '480p': 40, '720p': 90 },
  'seedance-2.0': { '480p': 30, '720p': 70 },
}
export const SEEDANCE_VIDEO_INPUT_MULTIPLIER = 1.5

/** Seconds that are billed: the chosen length, or the source length for Video Edit. */
export function seedanceBilledSeconds(mode: SeedanceMode, duration: number, sourceSeconds?: number | null): number {
  if (mode === 'video-edit') return Math.max(4, Math.ceil(sourceSeconds || 0))
  return Math.max(4, Math.ceil(duration))
}

export function seedancePrice(opts: {
  model: SeedanceModel
  mode: SeedanceMode
  resolution: SeedanceResolution
  duration: number
  sourceSeconds?: number | null
  hasVideoInput: boolean
}): number {
  const rate = SEEDANCE_CREDITS_PER_SECOND[opts.model][opts.resolution]
  const seconds = seedanceBilledSeconds(opts.mode, opts.duration, opts.sourceSeconds)
  const videoIn = opts.hasVideoInput || SOURCE_VIDEO_MODES.indexOf(opts.mode) !== -1
  return Math.ceil(seconds * rate * (videoIn ? SEEDANCE_VIDEO_INPUT_MULTIPLIER : 1))
}

export const SEEDANCE_AUDIO_TYPES: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/mp3': 'mp3',
  'audio/wav': 'wav',
  'audio/x-wav': 'wav',
  'audio/wave': 'wav',
  'audio/mp4': 'm4a',
  'audio/x-m4a': 'm4a',
  'audio/aac': 'aac',
}
