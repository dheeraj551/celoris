import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { createR2SignedReadUrl } from '@/lib/r2-client'
import { laneForUser } from '@/lib/polyvault-lanes'

// PolyVault download flow, with download speed by plan.
//
//   POST { action: 'queue', key, filename }
//        → { ready: true, downloadUrl }                 (no wait on this plan)
//        → { ready: false, ticketId, readyAt, waitSeconds, laneName, planLabel }
//   POST { action: 'preview', key }  → { downloadUrl } for the 3D viewer (no queue)
//   POST { action: 'claim', ticketId }
//        → { ready: true, downloadUrl }   once the wait is over
//        → 425 { readyAt }                if asked too early
//
// The wait comes from the member's plan (Admin → Plans → PolyVault →
// "Download queue"), and the real file link only leaves the server after it,
// so the queue can't be skipped from the browser. The link is short-lived
// and carries a Content-Disposition header so the browser saves the file
// under the asset's real filename.

const LINK_SECONDS = 300
const MAX_OPEN_TICKETS = 5

function dispositionFor(key: string, filename?: unknown) {
  const safe = (typeof filename === 'string' && filename.trim()) || key.split('/').pop() || 'model'
  return `attachment; filename="${safe.replace(/["\r\n]/g, '').slice(0, 180)}"`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to download' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const action = body?.action === 'claim' ? 'claim' : body?.action === 'preview' ? 'preview' : 'queue'
    const admin: any = createSupabaseClientForServer()

    if (action === 'preview') {
      // The 3D viewer needs the file to show the model, so previews aren't queued.
      const key = body?.key
      if (!key || typeof key !== 'string' || !key.startsWith('polyvault/') || key.indexOf('..') !== -1) {
        return NextResponse.json({ error: 'Invalid asset key' }, { status: 400 })
      }
      const downloadUrl = await createR2SignedReadUrl(key, 600)
      return NextResponse.json({ downloadUrl })
    }

    if (action === 'claim') {
      const ticketId = typeof body?.ticketId === 'string' ? body.ticketId : ''
      if (!ticketId) return NextResponse.json({ error: 'ticketId is required' }, { status: 400 })
      const { data: t } = await admin
        .from('polyvault_download_tickets')
        .select('id, object_key, filename, ready_at, used_at, created_at')
        .eq('id', ticketId)
        .eq('user_id', user.id)
        .maybeSingle()
      if (!t) return NextResponse.json({ error: 'Download not found. Please start it again.' }, { status: 404 })
      if (t.used_at) return NextResponse.json({ error: 'This download was already started. Please start it again.' }, { status: 409 })
      if (Date.now() - Date.parse(t.created_at) > 30 * 60_000) {
        return NextResponse.json({ error: 'This download expired. Please start it again.' }, { status: 410 })
      }
      if (Date.now() + 1000 < Date.parse(t.ready_at)) {
        return NextResponse.json({ error: 'Still in the queue', readyAt: t.ready_at }, { status: 425 })
      }
      const { data: claimed } = await admin
        .from('polyvault_download_tickets')
        .update({ used_at: new Date().toISOString() })
        .eq('id', t.id)
        .is('used_at', null)
        .select('id')
      if (!claimed || claimed.length === 0) {
        return NextResponse.json({ error: 'This download was already started. Please start it again.' }, { status: 409 })
      }
      const downloadUrl = await createR2SignedReadUrl(t.object_key, LINK_SECONDS, dispositionFor(t.object_key, t.filename))
      return NextResponse.json({ ready: true, downloadUrl })
    }

    // Queue a download
    const { key, filename } = body || {}
    if (!key || typeof key !== 'string' || !key.startsWith('polyvault/') || key.indexOf('..') !== -1) {
      return NextResponse.json({ error: 'Invalid asset key' }, { status: 400 })
    }

    const lane = await laneForUser(admin, user.id)
    if (lane.waitSeconds <= 0) {
      const downloadUrl = await createR2SignedReadUrl(key, LINK_SECONDS, dispositionFor(key, filename))
      return NextResponse.json({ ready: true, downloadUrl, laneName: lane.laneName, planLabel: lane.planLabel })
    }

    // A few queued downloads at a time.
    const since = new Date(Date.now() - 30 * 60_000).toISOString()
    const { count } = await admin
      .from('polyvault_download_tickets')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('used_at', null)
      .gte('created_at', since)
    if ((count || 0) >= MAX_OPEN_TICKETS) {
      return NextResponse.json({ error: 'You already have several downloads waiting. Please finish those first.' }, { status: 429 })
    }

    const readyAt = new Date(Date.now() + lane.waitSeconds * 1000).toISOString()
    const { data: ticket, error } = await admin
      .from('polyvault_download_tickets')
      .insert({
        user_id: user.id,
        object_key: key,
        filename: typeof filename === 'string' ? filename.slice(0, 200) : null,
        wait_seconds: lane.waitSeconds,
        ready_at: readyAt,
      })
      .select('id')
      .single()
    if (error) throw error

    return NextResponse.json({
      ready: false,
      ticketId: ticket.id,
      readyAt,
      waitSeconds: lane.waitSeconds,
      laneName: lane.laneName,
      planLabel: lane.planLabel,
    })
  } catch (error: any) {
    console.error('polyvault sign-download error:', error)
    return NextResponse.json({ error: 'Failed to create download link' }, { status: 500 })
  }
}
