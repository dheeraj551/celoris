import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

// POST { status?: 'open'|'action_taken'|'dismissed', note?, ban?: true|false, banReason? }
// Updates a report and can pause (ban) or restore the reported person's
// Celoris Chat access.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await authenticateAdmin(req)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const admin: any = createSupabaseClientForServer()

  const { data: report } = await admin.from('celoris_chat_reports').select('id, reported_id').eq('id', id).maybeSingle()
  if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 })

  const update: Record<string, any> = {}
  if (['open', 'action_taken', 'dismissed'].includes(body?.status)) {
    update.status = body.status
    update.reviewed_by = auth.user.id
    update.reviewed_at = new Date().toISOString()
  }
  if (typeof body?.note === 'string') update.admin_note = body.note.slice(0, 2000)
  if (Object.keys(update).length) {
    const { error } = await admin.from('celoris_chat_reports').update(update).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (typeof body?.ban === 'boolean') {
    const { error } = await admin
      .from('celoris_chat_profiles')
      .update({
        is_banned: body.ban,
        ban_reason: body.ban ? (typeof body?.banReason === 'string' ? body.banReason.slice(0, 500) : 'Reported in Celoris Chat') : null,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', report.reported_id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
