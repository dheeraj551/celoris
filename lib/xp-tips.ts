// "Did you know?" cards that pop up now and then while someone uses Celoris.
// Keep each one short, true, and pointing somewhere useful. `audience`:
//   'all'     — everyone
//   'member'  — signed-in members only
//   'visitor' — signed-out visitors only

export interface XpTip {
  id: string
  text: string
  href?: string
  cta?: string
  audience: 'all' | 'member' | 'visitor'
}

export const XP_TIPS: XpTip[] = [
  {
    id: 'free-classes',
    text: 'Live classes on Celoris are free. The waiting line opens 30 minutes before class — come early to get a seat.',
    href: '/classrooms',
    cta: 'See classes',
    audience: 'all',
  },
  {
    id: 'checkin-streak',
    text: 'Check in every day to grow your streak. Day 7 gives you 100 XP.',
    audience: 'member',
  },
  {
    id: 'xp-to-credits',
    text: 'Every 1,000 XP you collect can be turned into 1 credit for AI tools.',
    audience: 'member',
  },
  {
    id: 'chest',
    text: 'Your XP chest fills while you learn. When it glows, tap Claim to collect it.',
    audience: 'member',
  },
  {
    id: 'chat-code',
    text: 'Add your batchmates on Celoris Chat with your share code — no phone numbers needed.',
    href: '/chat',
    cta: 'Open Celoris Chat',
    audience: 'member',
  },
  {
    id: 'job-center',
    text: 'Pass a free exam in the Job Center to earn a verified badge that unlocks real paid projects.',
    href: '/job-center',
    cta: 'Open Job Center',
    audience: 'all',
  },
  {
    id: 'celoris-tv',
    text: 'Missed a class? Recorded lectures are waiting on Celoris TV.',
    href: '/celoris-tv',
    cta: 'Watch now',
    audience: 'all',
  },
  {
    id: 'plans',
    text: 'Pro and Max members earn XP faster (1.5× and 2×) and get monthly credits.',
    href: '/pricing',
    cta: 'See plans',
    audience: 'member',
  },
  {
    id: 'signup-xp',
    text: 'Members collect XP just for learning here — and XP turns into credits. It’s free to join.',
    href: '/register',
    cta: 'Create free account',
    audience: 'visitor',
  },
  {
    id: 'since-2019',
    text: 'Celoris has been teaching design, video and web skills since 2019 — 50,000+ creators and counting.',
    href: '/about',
    cta: 'Our story',
    audience: 'visitor',
  },
]
