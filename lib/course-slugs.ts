// Clean URLs for the flagship course pages under /learn/course/[id], plus
// optional search titles/descriptions for them. Shared by the page, its
// layout (metadata + structured data) and the live-batch loader.

export const COURSE_SLUG_TO_ID: Record<string, string> = {
  'digital-marketing-mastery': 'e7698318-7f57-421f-866e-0101ee239c01',
  'web-development-bootcamp': '48713643-694c-491f-86d6-5b6e713c1cf3',
  'ai-web-development': '879e499f-5517-413a-bd6a-76e2911b8331',
  'master-copilot-excel': 'f00459e9-20a0-4866-ba05-79aa574f7dff',
  'master-youtube-shorts-instagram-reels': 'f5badaa4-3ca2-4c70-96c3-a1ed97ee9ead',
}

export const COURSE_ID_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(COURSE_SLUG_TO_ID).map(([slug, id]) => [id, slug])
)

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Slug or UUID → course UUID (null when it is neither). */
export function resolveCourseId(idOrSlug: string): string | null {
  const id = COURSE_SLUG_TO_ID[idOrSlug] || idOrSlug
  return UUID.test(id) ? id : null
}

/** The public path of a course page: its clean URL when it has one. */
export function coursePagePath(id: string): string {
  return `/learn/course/${COURSE_ID_TO_SLUG[id] || id}`
}

/**
 * Search-result title/description for courses whose full title is too long
 * for Google (titles over ~60 characters get cut off). The site adds
 * " | Celoris" after the title. heroImage replaces the page banner with a
 * lighter file when the stored one is too heavy.
 */
export const COURSE_SEO: Record<string, { title: string; description: string; image?: string; heroImage?: string }> = {
  'f5badaa4-3ca2-4c70-96c3-a1ed97ee9ead': {
    title: 'YouTube Shorts & Instagram Reels Course in India',
    description:
      'Live 6-week online course for Indian creators: script, shoot on a phone, edit for retention, grow with the Shorts & Reels algorithms and earn from your videos.',
    // 1200×630 share image and a 108 KB WebP banner (the original PNG is 2.6 MB).
    image: '/courses/short-form-video-masterclass-og.jpg',
    heroImage: '/courses/short-form-video-masterclass.webp',
  },
}

export interface CourseBatchDefault {
  batchNumber: string
  soldOutBatch?: string
  batchStart: string
  scheduleLabel: string
  seatsTotal: number
  registered: number
}

export const COURSE_BATCH_DEFAULTS: Record<string, CourseBatchDefault> = {
  'f5badaa4-3ca2-4c70-96c3-a1ed97ee9ead': {
    batchNumber: '04',
    soldOutBatch: 'Batch 03 (Sold Out)',
    batchStart: '2026-10-11T15:00:00.000+05:30',
    scheduleLabel: 'Sundays · 3:00 PM IST',
    seatsTotal: 25,
    registered: 11,
  },
}

