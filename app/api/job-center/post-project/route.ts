import { NextRequest, NextResponse } from 'next/server'
import { EMAIL_RE, emailLayout, fieldRows, sendSupportEmail } from '@/lib/support-mail'
import { createRouteClient } from '@/lib/supabase-server'

// "Post a Project" form on the Job Center: emails the project brief to
// support@celorisdesigns.com. Open to everyone (clients don't need an
// account); signed-in posters are marked as such in the email.

export const dynamic = 'force-dynamic'

const PROJECT_TYPES = [
  'Video editing',
  'Web development',
  'Mobile app',
  'Graphic design',
  'Digital marketing',
  '3D / animation',
  'AI / automation',
  'Other',
]
const BUDGETS = ['Under ₹5,000', '₹5,000 – ₹20,000', '₹20,000 – ₹50,000', '₹50,000 – ₹1,00,000', 'Above ₹1,00,000', 'Not sure yet']
const WORK_MODES = ['Remote', 'On-site', 'Hybrid']

// Best-effort per-IP limit (per server instance) against form spam.
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()
function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) {
    hits.forEach((v, k) => {
      if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k)
    })
  }
  return recent.length > MAX_PER_WINDOW
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))

  // Honeypot: real people never see or fill this field.
  if (str(body?.website_url, 200)) return NextResponse.json({ ok: true })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many submissions. Please try again in a while.' }, { status: 429 })
  }

  const name = str(body?.name, 100)
  const email = str(body?.email, 200)
  const phone = str(body?.phone, 30)
  const company = str(body?.company, 150)
  const title = str(body?.title, 150)
  const projectType = PROJECT_TYPES.includes(body?.projectType) ? body.projectType : ''
  const budget = BUDGETS.includes(body?.budget) ? body.budget : ''
  const workMode = WORK_MODES.includes(body?.workMode) ? body.workMode : ''
  const timeline = str(body?.timeline, 100)
  const location = str(body?.location, 120)
  const skills = str(body?.skills, 300)
  const description = str(body?.description, 5000)
  const referenceLink = str(body?.referenceLink, 500)

  if (!name || !email || !title || !description || !projectType) {
    return NextResponse.json({ error: 'Please fill in your name, email, project title, type and description.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (phone && !/^[+\d][\d\s\-()]{6,}$/.test(phone)) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 })
  }
  if (description.length < 20) {
    return NextResponse.json({ error: 'Please describe the project in a little more detail.' }, { status: 400 })
  }

  let accountNote = 'Not signed in'
  try {
    const routeClient: any = await createRouteClient()
    const { data } = await routeClient.auth.getUser()
    if (data?.user) accountNote = `Signed in as ${data.user.email || data.user.id}`
  } catch {
    // ignore
  }

  const safeLink = /^https?:\/\//i.test(referenceLink) ? referenceLink : ''
  const rows = fieldRows([
    ['Project', title],
    ['Type', projectType],
    ['Budget', budget],
    ['Timeline', timeline],
    ['Work mode', workMode],
    ['Location', location],
    ['Skills needed', skills],
    ['Description', description, { pre: true }],
    ['Reference link', referenceLink, { href: safeLink || undefined }],
    ['Posted by', name],
    ['Company', company],
    ['Email', email, { href: `mailto:${email}` }],
    ['Phone', phone],
    ['Account', accountNote],
  ])

  try {
    await sendSupportEmail({
      subject: `New project posted: ${title} (${projectType})`,
      html: emailLayout('New project posted on Job Center', `${name} wants to post a project on Celoris Job Center.`, rows),
      replyTo: email,
    })
  } catch (err) {
    console.error('Post project email failed:', err)
    return NextResponse.json({ error: 'Could not send your project right now. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
