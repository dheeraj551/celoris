import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { authenticateAdmin } from '@/lib/admin-auth'

// Admin: look up / set a member's plan (Free, Basic, Pro, Max).
//   GET ?email=…   one member's plan (by email)
//   GET ?list=1    every member who has (or had) a paid plan, for the users table
//   POST { email | userId, planTier, expiresAt?, note? }
// Awarding a new paid plan (or an upgrade) adds that tier's monthly credits
// right away and then every month while the plan is active — see
// admin_set_user_plan_by_id in supabase/migrations/20260926_plan_tiers.sql.
// Protected by proxy.ts (admins only) and re-checked here.

export const dynamic = 'force-dynamic'
const TIERS = ['free', 'basic', 'pro', 'max']
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const params = new URL(request.url).searchParams
  const admin: any = createSupabaseClientForServer()

  if (params.get('list')) {
    const { data, error } = await admin
      .from('user_plans')
      .select('user_id, plan_tier, expires_at, next_credit_grant_at, started_at, note, updated_at')
      .neq('plan_tier', 'free')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ plans: data || [] })
  }

  const email = params.get('email')?.trim()
  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  const { data, error } = await admin.rpc('admin_get_user_plan', { p_email: email })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data?.ok) return NextResponse.json({ error: data?.error || 'Not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const body = await request.json().catch(() => ({}))
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const userId = typeof body.userId === 'string' && UUID_RE.test(body.userId) ? body.userId : ''
  const planTier = typeof body.planTier === 'string' ? body.planTier : ''
  if ((!email && !userId) || !TIERS.includes(planTier)) {
    return NextResponse.json({ error: 'A member and a valid plan are required.' }, { status: 400 })
  }
  let expiresAt: string | null = null
  if (body.expiresAt && planTier !== 'free') {
    const ms = Date.parse(String(body.expiresAt))
    if (!Number.isFinite(ms)) return NextResponse.json({ error: 'Invalid expiry date.' }, { status: 400 })
    if (ms <= Date.now()) return NextResponse.json({ error: 'The end date must be in the future.' }, { status: 400 })
    expiresAt = new Date(ms).toISOString()
  }
  const note = typeof body.note === 'string' && body.note.trim() ? body.note.trim().slice(0, 300) : null
  const fullNote = note ? `${note} (by ${auth.user.email})` : `Set by ${auth.user.email}`

  const admin: any = createSupabaseClientForServer()
  let targetId = userId
  if (!targetId) {
    const { data: found, error: findErr } = await admin.rpc('admin_get_user_plan', { p_email: email })
    if (findErr) return NextResponse.json({ error: findErr.message }, { status: 500 })
    if (!found?.ok) return NextResponse.json({ error: found?.error || 'No account with that email.' }, { status: 404 })
    targetId = found.user_id
  }
  const { data, error } = await admin.rpc('admin_set_user_plan_by_id', {
    p_user_id: targetId,
    p_plan_tier: planTier,
    p_expires_at: expiresAt,
    p_note: fullNote,
    p_admin: auth.user.id,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data?.ok) return NextResponse.json({ error: data?.error || 'Could not save.' }, { status: 404 })
  return NextResponse.json(data)
}
