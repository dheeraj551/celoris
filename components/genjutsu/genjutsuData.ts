import type { MotionSwapPlan } from '@/lib/ai-jobs-client';
export interface PresetMotion {
  id: string;
  title: string;
  category: 'higgsfield' | 'community';
  motionType: 'dance' | 'crowd' | 'action' | 'pet' | 'fashion' | 'commercial';
  thumbnailUrl: string;
  videoUrl?: string;
  duration: string;
  description: string;
  promptSuggestion: string;
  views: string;
  likes: string;
  author?: string;
  badge?: string;
  /**
   * A real clip (4–30 s, MP4, served from /public) that can be sent to
   * Higgsfield as the motion reference. Leave unset for showcase-only
   * presets: `videoUrl` above is just the preview shown on the stage.
   */
  referenceVideoUrl?: string;
  referenceSeconds?: number;
}

export interface ModelOption {
  id: string;
  name: string;
  badge?: string;
  subtitle: string;
  description: string;
  fps: number;
  creditCost: number;
  /** Shown instead of creditCost when the model is priced per second. */
  priceLabel?: string;
}

export interface GenerationHistoryItem {
  id: string;
  status: 'queued' | 'in_progress' | 'completed' | 'failed' | 'nsfw' | 'canceled';
  error?: string | null;
  mode: 'motion-transfer' | 'objects-swap';
  title: string;
  createdAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  model: string;
  quality: string;
  prompt?: string;
}

// Only Genjutsu is wired to a real API. (The other engines shown in the
// original design — "Genjutsu Turbo 60fps", "Kling 3.0 Motion", "Soul v2
// Recast" — don't exist as Higgsfield motion-transfer endpoints.)
/**
 * Wallet balance needed to use the studio, and the per-second price.
 * Keep in sync with lib/higgsfield-jobs.ts (the server is what charges).
 */
/** @deprecated Motion Swap access now comes from the member's plan (Admin → Plans), not a wallet minimum. */
export const MOTION_SWAP_MIN_BALANCE = 5000;

/** True when this video fits in one of the plan's free renders this month. */
export function isFreeRender(plan: MotionSwapPlan | null, seconds: number): boolean {
  return !!plan && plan.allowed && plan.freeGensLeft > 0 && seconds <= plan.freeMaxSeconds + 0.5;
}
export const MOTION_SWAP_CREDITS_PER_SECOND: Record<string, number> = { '480p': 50, '720p': 100 };

/** Billed on whole seconds, rounded up, minimum 4 s (same as the server). */
export function motionSwapPrice(seconds: number, resolution: string): number {
  const billed = Math.max(4, Math.ceil(Math.round(seconds * 100) / 100));
  return billed * (MOTION_SWAP_CREDITS_PER_SECOND[resolution] ?? MOTION_SWAP_CREDITS_PER_SECOND['720p']);
}

export const GENJUTSU_MODELS: ModelOption[] = [
  {
    id: 'higgsfield-genjutsu',
    name: 'Higgsfield Genjutsu',
    badge: 'New',
    subtitle: 'Motion transfer & object swap',
    description: 'Takes the motion, timing and camera movement of your reference video and recasts it with your characters, products or clothes.',
    fps: 30,
    creditCost: 50,
    priceLabel: '50–100 credits / sec',
  },
];

// Genjutsu renders at 480p or 720p (billed per output second).
export const QUALITY_OPTIONS = [
  { id: '720p', label: '720p', desc: 'HD (recommended) · 100 credits / sec', recommended: true },
  { id: '480p', label: '480p', desc: 'Half the price · 50 credits / sec' },
];

export const PRESET_MOTIONS: PresetMotion[] = [
  {
    id: 'duo-dance-lipsync',
    title: 'Duo Vocal Groove',
    category: 'community',
    motionType: 'dance',
    thumbnailUrl: '/images/genjutsu/preset-duo.png',
    videoUrl: '/vid/marketing-studio-slider-poster-UGC.mp4',
    duration: '0:12',
    description: 'Energetic studio vocal duo performance with hand gestures and head swaying.',
    promptSuggestion: 'Two futuristic cyborgs singing into a glowing retro microphone, vibrant studio backdrop',
    views: '48.2K',
    likes: '3.8K',
    author: '@marcus_vfx',
    badge: 'Trending'
  },
  {
    id: 'clone-syndicate-white',
    title: 'The Syndicate (White Suits)',
    category: 'community',
    motionType: 'crowd',
    thumbnailUrl: '/images/genjutsu/preset-white-suits.png',
    videoUrl: '/vid/marketing-studio-slider-poster-Ads.mp4',
    duration: '0:16',
    description: 'Synchronized crowd of agents in white bespoke suits looking up in disciplined formation.',
    promptSuggestion: 'An army of android clones in crisp white suits, symmetrical formation, sci-fi dystopian lighting',
    views: '92.5K',
    likes: '8.4K',
    author: '@neo_films',
    badge: 'Popular'
  },
  {
    id: 'matrix-black-formation',
    title: 'Shadow Council (Black Suits)',
    category: 'community',
    motionType: 'crowd',
    thumbnailUrl: '/images/genjutsu/preset-black-suits.png',
    videoUrl: '/vid/marketing-studio-slider-poster-Marketplace.mp4',
    duration: '0:18',
    description: 'Cinematic low-angle camera pan across an army of agents in black tailored attire.',
    promptSuggestion: 'Secret agent formation in sleek obsidian tailored suits, cinematic film grain, moody overcast day',
    views: '76.1K',
    likes: '6.9K',
    author: '@cipher_motion'
  },
  {
    id: 'pet-head-bob',
    title: 'Puppy Ear Flap & Head Tilt',
    category: 'community',
    motionType: 'pet',
    thumbnailUrl: '/images/genjutsu/preset-pet.png',
    videoUrl: '/vid/marketing-studio-slider-poster-Product.mp4',
    duration: '0:07',
    description: 'Curious puppy raising ears and tilting head with expressive micro-movements.',
    promptSuggestion: 'Cartoon animated fox pup raising plush ears, 3D Pixar aesthetic, warm cozy room',
    views: '124K',
    likes: '14.2K',
    author: '@pawsome_ai',
    badge: 'Viral'
  },
  {
    id: 'tokyo-street-walk',
    title: 'Tokyo Street Follow Walk',
    category: 'higgsfield',
    motionType: 'fashion',
    thumbnailUrl: '/images/genjutsu/hero-showcase.png',
    videoUrl: '/vid/marketing-studio-slider-poster-poster.mp4',
    duration: '0:14',
    description: 'Over-the-shoulder tracking walk moving towards a colorful party courtyard with characters.',
    promptSuggestion: 'Streetwear fashion icon walking towards futuristic Shibuya festival, neon reflections',
    views: '156K',
    likes: '18.9K',
    author: '@higgsfield_official',
    badge: 'Staff Pick'
  },
  {
    id: 'levitating-sneaker-spin',
    title: '360° Commercial Object Spin',
    category: 'higgsfield',
    motionType: 'commercial',
    thumbnailUrl: '/images/genjutsu/preset-black-suits.png',
    videoUrl: '/vid/marketing-studio-slider-poster-Product.mp4',
    duration: '0:09',
    description: 'Smooth axial product rotation with dramatic studio key-light reflections.',
    promptSuggestion: 'Futuristic iridescent running sneaker floating and spinning in void studio',
    views: '64.3K',
    likes: '5.1K',
    author: '@higgsfield_official'
  }
];

export const SAMPLE_PROMPT_CHIPS = [
  'Cyberpunk streetwear & neon hair',
  'Anime studio Ghibli aesthetic',
  'Photorealistic 8K cinematic lighting',
  'Luxury haute couture editorial',
  'Surreal claymation sculpture',
  'Retro 90s VHS tape texture',
  'Hyper-detailed sci-fi exoskeleton'
];

// History now comes from the user's real generations (GET /api/ai/jobs?app=motion-swap).
export const INITIAL_HISTORY: GenerationHistoryItem[] = [];
