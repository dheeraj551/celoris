import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

// GET ?status=open|action_taken|dismissed|all — Celoris Chat reports for the
// admin panel. (proxy.ts already restricts /api/admin/* to admins; this
// repeats the check.)
export async function GET(req: NextRequest) {
  const auth = await authenticateAdmin(req)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const status = req.nextUrl.searchParams.get('status') || 'open'
  const admin: any = createSupabaseClientForServer()
  let q = admin
    .from('celoris_chat_reports')
    .select('id, reporter_id, reported_id, reason, details, snapshot, status, admin_note, reviewed_at, created_at')
    .order('created_at', { ascending: false })
    .limit(100)
  if (status !== 'all') q = q.eq('status', status)
  const { data: reports, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const ids = Array.from(new Set((reports || []).flatMap((r: any) => [r.reporter_id, r.reported_id])))
  const [{ data: profiles }, { data: users }] = await Promise.all([
    ids.length
      ? admin.from('celoris_chat_profiles').select('user_id, display_name, is_banned, ban_reason').in('user_id', ids)
      : Promise.resolve({ data: [] }),
    ids.length ? admin.from('users').select('id, email').in('id', ids) : Promise.resolve({ data: [] }),
  ])
  const info = new Map<string, any>()
  for (const p of profiles || []) info.set(p.user_id, { name: p.display_name, isBanned: p.is_banned, banReason: p.ban_reason })
  for (const u of users || []) info.set(u.id, { ...(info.get(u.id) || {}), email: u.email })

  const person = (id: string) => ({ id, name: 'Celoris member', email: null, isBanned: false, ...(info.get(id) || {}) })
  return NextResponse.json({
    reports: (reports || []).map((r: any) => ({
      ...r,
      reporter: person(r.reporter_id),
      reported: person(r.reported_id),
    })),
  })
}
