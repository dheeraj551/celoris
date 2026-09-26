// Interest tags for Celoris Chat's Discover. Shared by the server (to
// validate) and the browser (to show the chips). Keep it short: people pick
// up to MAX_INTERESTS of these.

export const CHAT_INTERESTS = [
  'Web Development',
  'App Development',
  'Digital Marketing',
  'Social Media',
  'Graphic Design',
  'UI/UX Design',
  'Video Editing',
  '3D & Animation',
  'Photography',
  'Python',
  'Excel & Data',
  'AI Tools',
  'WordPress',
  'Freelancing',
  'Job Hunting',
] as const

export const MAX_INTERESTS = 5
export const MAX_BIO_LENGTH = 140

export function cleanInterests(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  const allowed = new Set<string>(CHAT_INTERESTS)
  const out: string[] = []
  for (let i = 0; i < input.length; i++) {
    const v = input[i]
    if (typeof v === 'string' && allowed.has(v) && out.indexOf(v) === -1) out.push(v)
    if (out.length >= MAX_INTERESTS) break
  }
  return out
}
