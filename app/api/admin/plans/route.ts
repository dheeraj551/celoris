import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { authenticateAdmin } from '@/lib/admin-auth'

// Admin: look up / set a member's plan (Free, Basic, Pro, Max) by email.
// Plans drive the café class queue priority (lib/cafe-class-queue.ts).
// Protected by proxy.ts (admins only) and re-checked here.

export const dynamic = 'force-dynamic'
const TIERS = ['free', 'basic', 'pro', 'max']

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  const email = new URL(request.url).searchParams.get('email')?.trim()
  if (!email) return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
  const admin: any = createSupabaseClientForServer()
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
  const planTier = typeof body.planTier === 'string' ? body.planTier : ''
  if (!email || !TIERS.includes(planTier)) {
    return NextResponse.json({ error: 'Email and a valid plan are required.' }, { status: 400 })
  }
  let expiresAt: string | null = null
  if (body.expiresAt) {
    const ms = Date.parse(String(body.expiresAt))
    if (!Number.isFinite(ms)) return NextResponse.json({ error: 'Invalid expiry date.' }, { status: 400 })
    expiresAt = new Date(ms).toISOString()
  }
  const note = typeof body.note === 'string' ? body.note.slice(0, 300) : null
  const admin: any = createSupabaseClientForServer()
  const { data, error } = await admin.rpc('admin_set_user_plan', {
    p_email: email,
    p_plan_tier: planTier,
    p_expires_at: expiresAt,
    p_note: note ? `${note} (by ${auth.user.email})` : `Set by ${auth.user.email}`,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data?.ok) return NextResponse.json({ error: data?.error || 'Could not save.' }, { status: 404 })
  return NextResponse.json(data)
}
