// What to learn next when someone doesn't pass a Job Center exam.
//
// Shown on the result screen (and on the exam card while they wait for their
// next attempt). `live` is the paid live course (book a free demo), `free` is
// a free recorded course. Change the links here any time — nothing else needs
// to change. Exams not listed fall back to browsing all courses.

export interface CourseLink {
  title: string
  href: string
}

export interface ExamCourseSuggestion {
  live?: CourseLink
  free?: CourseLink
}

const LIVE = {
  videoEditing: { title: 'Video Editing course (live classes)', href: '/video-editing-course-noida' },
  digitalMarketing: { title: 'Digital Marketing course (live classes)', href: '/digital-marketing-course-noida' },
  graphicDesign: { title: 'Graphic Designing course (live classes)', href: '/graphic-designing-course-noida' },
  socialMedia: { title: 'Social Media Marketing course (live classes)', href: '/social-media-marketing-course-noida' },
  webDev: { title: 'Web Development course (live classes)', href: '/web-development-course-noida' },
  python: { title: 'Python training (live classes)', href: '/python-training-noida' },
}

const FREE = {
  capcut: { title: 'CapCut Pro: Create Viral Reels in 30 Days', href: '/courses/capcut-pro-viral-reels' },
  premiere: { title: 'Master Premiere Pro with AI', href: '/courses/master-premiere-pro-ai' },
  dmAi: { title: 'Digital Marketing Using AI Tools', href: '/courses/digital-marketing-using-ai-tools' },
  smmAi: { title: 'Social Media Marketing with AI', href: '/courses/social-media-marketing-with-ai' },
  contentAi: { title: 'AI Tools for Content Creation', href: '/courses/ai-tools-for-content-creation' },
  retouching: { title: 'Professional Retouching in Photoshop', href: '/courses/professional-retouching-in-photoshop' },
  vibeCoding: { title: 'Vibe Coding Mastery', href: '/courses/vibe-coding-mastery' },
  prompting: { title: 'LLM Prompt Engineering for Real Results', href: '/courses/llm-prompt-engineering-for-real-results' },
  aiSecurity: { title: 'Agentic AI for Cybersecurity', href: '/courses/agentic-ai-for-cybersecurity' },
  deployAi: { title: 'Deploy & Scale AI Apps (Serverless & Edge)', href: '/courses/deploy-scale-ai-apps-serverless-edge' },
}

export const EXAM_COURSES: Record<string, ExamCourseSuggestion> = {
  'exam-react-ts': { live: LIVE.webDev, free: FREE.vibeCoding },
  'exam-cloud-ai': { live: LIVE.python, free: FREE.prompting },
  'exam-cybersec': { free: FREE.aiSecurity },
  'exam-fintech': { live: LIVE.webDev, free: FREE.deployAi },
  'exam-creative-content': { live: LIVE.graphicDesign, free: FREE.contentAi },
  'exam-gtm-brand-positioning': { live: LIVE.digitalMarketing, free: FREE.dmAi },
  'exam-b2b-export-sales': { live: LIVE.digitalMarketing, free: FREE.dmAi },
  'exam-short-form-video-ads': { live: LIVE.videoEditing, free: FREE.capcut },
  'exam-real-estate-reel-editing': { live: LIVE.videoEditing, free: FREE.capcut },
  'exam-fashion-content-product-editor': { live: LIVE.socialMedia, free: FREE.retouching },
  'exam-social-media-motion-design': { live: LIVE.graphicDesign, free: FREE.premiere },
  'exam-digital-marketing-executive': { live: LIVE.digitalMarketing, free: FREE.dmAi },
  'exam-instagram-video-engagement': { live: LIVE.socialMedia, free: FREE.smmAi },
  'exam-instagram-reels-video-editor': { live: LIVE.videoEditing, free: FREE.capcut },
  'exam-instagram-fashion-marketing-specialist': { live: LIVE.socialMedia, free: FREE.smmAi },
}

const FALLBACK: ExamCourseSuggestion = { free: { title: 'Browse free Celoris courses', href: '/learn' } }

export function courseSuggestionFor(examId: string): ExamCourseSuggestion {
  return EXAM_COURSES[examId] || FALLBACK
}

/** "in 5 days", "tomorrow", "in 3 hours" — for the next attempt. */
export function timeUntil(iso: string, now = Date.now()): string {
  const ms = Date.parse(iso) - now
  if (!Number.isFinite(ms) || ms <= 0) return 'now'
  const hours = Math.ceil(ms / 3_600_000)
  if (hours < 24) return hours <= 1 ? 'in about an hour' : `in ${hours} hours`
  const days = Math.ceil(ms / 86_400_000)
  return days === 1 ? 'tomorrow' : `in ${days} days`
}
