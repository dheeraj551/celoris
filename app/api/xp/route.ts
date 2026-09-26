import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Celoris XP for the signed-in member. Every rule (1 XP per active minute,
// daily cap, chest, streaks, plan multipliers, conversion limits) is enforced
// inside the database functions — see supabase/migrations/20260926_xp_currency.sql.
//
// GET              → current state (+ ?history=1 for the last 30 XP events)
// POST { action }  → 'tick' | 'claim' | 'checkin' | 'convert' (with { credits })

export const dynamic = 'force-dynamic'

async function currentUserId(): Promise<string | null> {
  try {
    const client: any = await createRouteClient()
    const {
      data: { user },
    } = await client.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ signedIn: false })
  try {
    const admin: any = createSupabaseClientForServer()
    const { data: state, error } = await admin.rpc('xp_state', { p_user: userId })
    if (error) throw error
    let history: any[] | undefined
    if (req.nextUrl.searchParams.get('history')) {
      const { data } = await admin
        .from('xp_ledger')
        .select('amount, kind, note, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30)
      history = data || []
    }
    return NextResponse.json({ signedIn: true, state, history })
  } catch (err) {
    console.error('[xp GET]', err)
    return NextResponse.json({ error: 'Could not load your XP.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'Please sign in to collect XP.' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const action = body?.action

  try {
    const admin: any = createSupabaseClientForServer()
    let rpc: { data: any; error: any }
    switch (action) {
      case 'tick':
        rpc = await admin.rpc('xp_tick', { p_user: userId })
        break
      case 'claim':
        rpc = await admin.rpc('xp_claim_chest', { p_user: userId })
        break
      case 'checkin':
        rpc = await admin.rpc('xp_daily_checkin', { p_user: userId })
        break
      case 'convert': {
        const credits = Math.floor(Number(body?.credits))
        if (!Number.isFinite(credits) || credits < 1 || credits > 1000) {
          return NextResponse.json({ error: 'Choose how many credits to convert.' }, { status: 400 })
        }
        rpc = await admin.rpc('xp_convert', { p_user: userId, p_credits: credits })
        if (!rpc.error && rpc.data && rpc.data.ok === false) {
          return NextResponse.json({ error: rpc.data.error }, { status: 400 })
        }
        break
      }
      default:
        return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    }
    if (rpc.error) throw rpc.error
    return NextResponse.json({ state: rpc.data })
  } catch (err) {
    console.error('[xp POST]', action, err)
    return NextResponse.json({ error: 'Something went wrong with XP. Please try again.' }, { status: 500 })
  }
}
