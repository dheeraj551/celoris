import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { currentUserId } from '../_auth'
import {
  AiApp,
  APP_CREDIT_COST,
  getWalletBalance,
  HiggsfieldError,
  JobRow,
  MarketingStudioInput,
  MAX_ACTIVE_JOBS_PER_USER,
  PRO_REQUIRED_CREDITS,
  publicJob,
  refreshJob,
  submitMarketingStudioImage,
} from '@/lib/higgsfield-jobs'

// POST: start an image generation (returns immediately with a job id).
// GET:  the signed-in user's recent generations for one app (history).

export const runtime = 'nodejs'
export const maxDuration = 60

const RATIOS = new Set(['auto', '1:1', '3:2', '2:3', '4:3', '3:4', '16:9', '9:16', '21:9'])
const APPS = new Set(['vio', 'photolite'])

export async function POST(request: Request) {
  const admin = createSupabaseClientForServer()
  let jobId: string | null = null
  try {
    const userId = await currentUserId()
    if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const app = body.app as AiApp
    if (!APPS.has(app)) return NextResponse.json({ error: 'Unknown app.' }, { status: 400 })

    const presetId = typeof body.presetId === 'string' && /^[0-9a-f-]{8,64}$/i.test(body.presetId) ? body.presetId : null
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, 5000) : ''
    const imageUrls: string[] = Array.isArray(body.imageUrls)
      ? body.imageUrls.filter((u: unknown) => typeof u === 'string' && /^https:\/\//i.test(u)).slice(0, presetId ? 2 : 16)
      : []
    const aspectRatio = RATIOS.has(body.aspectRatio) ? body.aspectRatio : 'auto'
    const resolution = ['1k', '2k', '4k'].includes(body.resolution) ? body.resolution : '2k'
    const quality = presetId ? 'high' : ['low', 'medium', 'high'].includes(body.quality) ? body.quality : 'high'

    if (presetId && imageUrls.length === 0) {
      return NextResponse.json({ error: 'Templates need your product photo — please upload one.' }, { status: 400 })
    }
    if (!presetId && !prompt) {
      return NextResponse.json({ error: 'Describe what you want to create.' }, { status: 400 })
    }

    // Pro gate + concurrency limit
    const balance = await getWalletBalance(userId)
    if (balance === null) return NextResponse.json({ error: "Couldn't check your credits. Please try again." }, { status: 503 })
    if (balance < PRO_REQUIRED_CREDITS) {
      return NextResponse.json(
        {
          error: `This is a Pro feature that needs at least ${PRO_REQUIRED_CREDITS.toLocaleString('en-IN')} credits in your wallet. Your balance is ${balance.toLocaleString('en-IN')} credits.`,
          currentBalance: balance,
          requiredCredits: PRO_REQUIRED_CREDITS,
        },
        { status: 403 }
      )
    }
    const { count } = await admin
      .from('ai_generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .in('status', ['queued', 'in_progress'])
      .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
    if ((count || 0) >= MAX_ACTIVE_JOBS_PER_USER) {
      return NextResponse.json({ error: `You already have ${count} images generating. Please wait for one to finish.` }, { status: 429 })
    }

    const input: MarketingStudioInput = {
      prompt: prompt || 'Create a high-converting marketing image of this product.',
      aspect_ratio: aspectRatio,
      resolution,
      quality,
      ...(imageUrls.length ? { image_urls: imageUrls } : {}),
      ...(presetId ? { enhance_prompt: true, preset_id: presetId } : {}),
    }
    const cost = APP_CREDIT_COST[app]

    const { data: row, error: insertErr } = await admin
      .from('ai_generations')
      .insert({
        user_id: userId,
        app,
        status: 'queued',
        params: {
          ...input,
          displayPrompt: typeof body.displayPrompt === 'string' ? body.displayPrompt.slice(0, 500) : prompt,
          presetName: typeof body.presetName === 'string' ? body.presetName.slice(0, 120) : null,
        },
      })
      .select('*')
      .single()
    if (insertErr || !row) throw new Error(insertErr?.message || 'Could not create the job.')
    jobId = row.id

    let newBalance = balance
    if (cost > 0) {
      const { data: after, error: chargeErr } = await admin.rpc('charge_ai_credits', {
        p_user_id: userId,
        p_amount: cost,
        p_description: `${app === 'photolite' ? 'PhotoLite' : 'ViO Studio'} AI image`,
      })
      if (chargeErr) {
        await admin.from('ai_generations').update({ status: 'failed', error: 'Not enough credits.' }).eq('id', row.id)
        return NextResponse.json({ error: `Not enough credits (this costs ${cost}).` }, { status: 402 })
      }
      newBalance = Number(after)
      await admin.from('ai_generations').update({ credits_charged: cost }).eq('id', row.id)
    }

    try {
      const submitted = await submitMarketingStudioImage(input)
      const { data: updated } = await admin
        .from('ai_generations')
        .update({ provider_request_id: submitted.requestId, status: submitted.status, updated_at: new Date().toISOString() })
        .eq('id', row.id)
        .select('*')
        .single()
      console.log('[AI jobs] submitted', app, row.id, '→', submitted.requestId)
      return NextResponse.json({ job: publicJob(updated as JobRow), balance: newBalance })
    } catch (err: any) {
      const message = err instanceof HiggsfieldError ? err.message : `Couldn't reach Higgsfield: ${err?.message || 'unknown error'}`
      await admin.from('ai_generations').update({ status: 'failed', error: message, completed_at: new Date().toISOString() }).eq('id', row.id)
      let refundedBalance: number | null = null
      if (cost > 0) {
        const { data } = await admin.rpc('refund_ai_generation', { p_generation_id: row.id })
        refundedBalance = data === null || data === undefined ? null : Number(data)
      }
      return NextResponse.json(
        { error: message, balance: refundedBalance ?? balance },
        { status: err instanceof HiggsfieldError ? err.status : 502 }
      )
    }
  } catch (err: any) {
    console.error('[AI jobs] create error:', err)
    if (jobId) await admin.from('ai_generations').update({ status: 'failed', error: 'Server error' }).eq('id', jobId).in('status', ['queued'])
    return NextResponse.json({ error: err?.message || 'Could not start the generation.' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const userId = await currentUserId()
    if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
    const app = new URL(request.url).searchParams.get('app')
    if (!app || !APPS.has(app)) return NextResponse.json({ error: 'Unknown app.' }, { status: 400 })

    const admin = createSupabaseClientForServer()
    const { data, error } = await admin
      .from('ai_generations')
      .select('*')
      .eq('user_id', userId)
      .eq('app', app)
      .order('created_at', { ascending: false })
      .limit(24)
    if (error) throw error

    const rows = (data || []) as JobRow[]
    // Bring a few pending ones up to date so the history is accurate on load.
    const pending = rows.filter((r) => r.status === 'queued' || r.status === 'in_progress').slice(0, 3)
    const refreshed = await Promise.all(pending.map((r) => refreshJob(r).catch(() => r)))
    const byId = new Map(refreshed.map((r) => [r.id, r]))
    return NextResponse.json({ jobs: rows.map((r) => publicJob(byId.get(r.id) || r)) })
  } catch (err: any) {
    console.error('[AI jobs] list error:', err)
    return NextResponse.json({ error: err?.message || 'Could not load your history.' }, { status: 500 })
  }
}
