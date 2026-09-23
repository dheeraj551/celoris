import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { currentUserId } from '../../_auth'
import { getWalletBalance, JobRow, publicJob, refreshJob } from '@/lib/higgsfield-jobs'

// Poll one generation. Each call is one short Higgsfield status check; when
// the image is ready it's copied into R2 on this call.

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const userId = await currentUserId()
    if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
    if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const admin = createSupabaseClientForServer()
    const { data, error } = await admin.from('ai_generations').select('*').eq('id', id).eq('user_id', userId).maybeSingle()
    if (error) throw error
    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const job = await refreshJob(data as JobRow)
    const done = job.status !== 'queued' && job.status !== 'in_progress'
    const balance = done && Number(job.credits_charged) > 0 ? await getWalletBalance(userId) : undefined
    return NextResponse.json({ job: publicJob(job), ...(balance !== undefined && balance !== null ? { balance } : {}) })
  } catch (err: any) {
    console.error('[AI jobs] poll error:', err)
    return NextResponse.json({ error: err?.message || 'Could not check the generation.' }, { status: 500 })
  }
}
