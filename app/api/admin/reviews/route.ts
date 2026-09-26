import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { authenticateAdmin } from '@/lib/admin-auth'

// Admin → Reviews (admins only — proxy.ts gates every /api/admin/* route,
// and authenticateAdmin below gives us the admin's id for the audit fields).
//
//   GET  ?status=pending|approved|rejected   → reviews + verified students
//   POST { action: 'approve' | 'reject' | 'delete', id, note? }
//   POST { action: 'verify_student', email, note? }   → allow an offline student to review
//   POST { action: 'unverify_student', userId }

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const status = new URL(request.url).searchParams.get('status') || 'pending'
    const admin: any = createSupabaseClientForServer()

    const [{ data: reviews, error }, { data: students }, counts] = await Promise.all([
      admin
        .from('course_reviews')
        .select('id, course_key, course_title, user_id, reviewer_name, rating, review_text, status, verified_reason, admin_note, created_at, updated_at, reviewed_at')
        .eq('status', ['pending', 'approved', 'rejected'].indexOf(status) === -1 ? 'pending' : status)
        .order('updated_at', { ascending: false })
        .limit(300),
      admin.from('verified_students').select('user_id, note, created_at').order('created_at', { ascending: false }).limit(500),
      Promise.all(
        ['pending', 'approved', 'rejected'].map((s) =>
          admin.from('course_reviews').select('id', { count: 'exact', head: true }).eq('status', s).then((r: any) => [s, r.count || 0])
        )
      ),
    ])
    if (error) throw error

    const ids = Array.from(
      new Set([...(reviews || []).map((r: any) => r.user_id), ...(students || []).map((s: any) => s.user_id)])
    )
    const emails: Record<string, string> = {}
    if (ids.length) {
      const { data: rows } = await admin.rpc('admin_emails_for_users', { p_ids: ids })
      for (const r of (rows || []) as any[]) emails[r.id] = r.email
    }

    return NextResponse.json({
      reviews: (reviews || []).map((r: any) => ({ ...r, email: emails[r.user_id] || null })),
      students: (students || []).map((s: any) => ({ ...s, email: emails[s.user_id] || null })),
      counts: (counts as any[]).reduce((acc: Record<string, number>, [k, v]: [string, number]) => ((acc[k] = v), acc), {}),
    })
  } catch (err: any) {
    console.error('[admin reviews] GET error:', err)
    return NextResponse.json({ error: err?.message || 'Could not load reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })

  try {
    const body = await request.json().catch(() => ({}))
    const action = String(body?.action || '')
    const admin: any = createSupabaseClientForServer()
    const now = new Date().toISOString()

    if (action === 'approve' || action === 'reject') {
      const id = String(body?.id || '')
      if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
      const note = typeof body?.note === 'string' ? body.note.slice(0, 300) : null
      const { error } = await admin
        .from('course_reviews')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          admin_note: action === 'reject' ? note : null,
          reviewed_at: now,
          reviewed_by: auth.user.id,
        })
        .eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'delete') {
      const id = String(body?.id || '')
      if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })
      const { error } = await admin.from('course_reviews').delete().eq('id', id)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'verify_student') {
      const email = String(body?.email || '').trim()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email' }, { status: 400 })
      const { data: userId } = await admin.rpc('admin_user_id_by_email', { p_email: email })
      if (!userId) {
        return NextResponse.json({ error: 'No Celoris account uses that email yet. Ask the student to sign up first.' }, { status: 404 })
      }
      const note = typeof body?.note === 'string' ? body.note.slice(0, 200) : null
      const { error } = await admin
        .from('verified_students')
        .upsert({ user_id: userId, note, granted_by: auth.user.id }, { onConflict: 'user_id' })
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    if (action === 'unverify_student') {
      const userId = String(body?.userId || '')
      if (!userId) return NextResponse.json({ error: 'userId is required' }, { status: 400 })
      const { error } = await admin.from('verified_students').delete().eq('user_id', userId)
      if (error) throw error
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err: any) {
    console.error('[admin reviews] POST error:', err)
    return NextResponse.json({ error: err?.message || 'Action failed' }, { status: 500 })
  }
}
