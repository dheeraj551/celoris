import { NextResponse, after } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { emailLayout, fieldRows, sendSupportEmail } from '@/lib/support-mail'

// Records a Job Center application server-side and awards the one-time
// +25 XP for it.
//
// Previously, "applying" only ever touched components/skillverify's local
// React state (appliedJobIds), persisted solely to the browser's own
// localStorage — Dheeraj had no real, server-side record of who applied to
// which job at all, and the +25 XP that came with it was just added to
// local state with nothing stopping it from being replayed. The unique
// (user_id, job_id) constraint on job_center_applications means a second
// call for the same job is a harmless no-op for XP (the row insert simply
// conflicts), and now gives a genuine applications record to work from.
//
// Every NEW application also emails support@celorisdesigns.com with the job
// and the candidate's details (sent after the response, so applying stays
// instant; a mail failure never blocks the application).

const APPLY_XP = 25
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.celorisdesigns.com').replace(/\/$/, '')

async function emailSupportAboutApplication(
  supabase: any,
  user: { id: string; email?: string | null; user_metadata?: Record<string, any> },
  jobId: string,
  jobTier: 'public' | 'certified'
) {
  const table = jobTier === 'certified' ? 'certified_jobs' : 'public_jobs'
  const [{ data: job }, { data: u }, { data: p }, { data: cp }, { data: progress }, { data: badges }] = await Promise.all([
    supabase.from(table).select('title, company, location, salary_range, work_mode, industry').eq('id', jobId).maybeSingle(),
    supabase.from('users').select('full_name, email').eq('id', user.id).maybeSingle(),
    supabase.from('profiles').select('full_name, name, contact').eq('id', user.id).maybeSingle(),
    supabase.from('job_center_candidate_profiles').select('headline, location, experience_years, linkedin, slug').eq('id', user.id).maybeSingle(),
    supabase.from('job_center_progress').select('current_xp, honor_score').eq('id', user.id).maybeSingle(),
    supabase.from('job_center_badges').select('badge_title').eq('user_id', user.id).limit(20),
  ])

  const name = u?.full_name || p?.full_name || p?.name || user.user_metadata?.full_name || 'Celoris member'
  const email = u?.email || user.email || ''
  const jobTitle = job?.title || `Job ${jobId}`
  const tierLabel = jobTier === 'certified' ? 'Certified Role' : 'Public Job'

  const rows = fieldRows([
    ['Job', jobTitle],
    ['Company', job?.company],
    ['Type', tierLabel],
    ['Location', [job?.location, job?.work_mode].filter(Boolean).join(' · ')],
    ['Salary', job?.salary_range],
    ['Candidate', name],
    ['Email', email, { href: email ? `mailto:${email}` : undefined }],
    ['Phone', p?.contact],
    ['Headline', cp?.headline],
    ['Candidate location', cp?.location],
    ['Experience', cp?.experience_years],
    ['LinkedIn', cp?.linkedin, { href: cp?.linkedin && /^https?:\/\//i.test(cp.linkedin) ? cp.linkedin : undefined }],
    ['Verified badges', (badges || []).map((b: any) => b.badge_title).filter(Boolean).join(', ') || 'None yet'],
    ['XP / Honor score', progress ? `${progress.current_xp ?? 0} XP · Honor ${progress.honor_score ?? 100}` : undefined],
    ['Candidate profile', cp?.slug ? `${SITE}/job-center/candidates/${cp.slug}` : undefined, { href: cp?.slug ? `${SITE}/job-center/candidates/${cp.slug}` : undefined }],
  ])

  await sendSupportEmail({
    subject: `New Job Center application: ${jobTitle} — ${name}`,
    html: emailLayout('New Job Center application', `${name} just applied for "${jobTitle}".`, rows),
    replyTo: email,
  })
}

export async function POST(request: Request) {
  try {
    const routeClient = await createRouteClient()
    const {
      data: { user },
    } = await routeClient.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { jobId, jobTier } = body as { jobId?: string; jobTier?: 'public' | 'certified' }

    if (!jobId || (jobTier !== 'public' && jobTier !== 'certified')) {
      return NextResponse.json({ error: 'jobId and a valid jobTier are required' }, { status: 400 })
    }

    const supabase = createSupabaseClientForServer()

    const { data: inserted, error: insertError } = await supabase
      .from('job_center_applications')
      .insert({ user_id: user.id, job_id: jobId, job_tier: jobTier, xp_awarded: APPLY_XP })
      .select('id')
      .maybeSingle()

    // A unique-violation (23505) just means this user already applied to
    // this job before — expected, not an error, and no XP this time. Any
    // other error is logged but still shouldn't block the "Applied" state
    // the user already sees in the UI.
    const alreadyApplied = !!insertError && (insertError as any).code === '23505'
    if (insertError && !alreadyApplied) {
      console.error('Job Center apply insert error:', insertError)
    }

    let currentXP: number | undefined
    let honorScore: number | undefined

    if (inserted) {
      const { data: existingProgress } = await supabase
        .from('job_center_progress')
        .select('current_xp, honor_score')
        .eq('id', user.id)
        .maybeSingle()

      currentXP = (existingProgress?.current_xp ?? 0) + APPLY_XP
      honorScore = existingProgress?.honor_score ?? 100

      await supabase.from('job_center_progress').upsert({
        id: user.id,
        current_xp: currentXP,
        honor_score: honorScore,
        updated_at: new Date().toISOString(),
      })

      // Only new applications are emailed (re-clicking Apply sends nothing).
      after(async () => {
        try {
          await emailSupportAboutApplication(supabase, user, jobId, jobTier)
        } catch (mailError) {
          console.error('Job Center application email failed:', mailError)
        }
      })
    }

    return NextResponse.json({
      success: true,
      xpAwarded: inserted ? APPLY_XP : 0,
      currentXP,
      honorScore,
    })
  } catch (error: any) {
    console.error('Job Center apply error:', error)
    return NextResponse.json({ error: error.message || 'Failed to record application' }, { status: 500 })
  }
}
