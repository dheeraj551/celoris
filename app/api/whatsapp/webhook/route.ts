import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// WhatsApp Cloud API webhook.
//
// Meta accepts a message right away (we get a message id), but whether it was
// actually DELIVERED — or why it failed — only arrives later through this
// webhook. Each status update is written onto the matching row in
// whatsapp_messages (status: sent → delivered → read, or failed + the reason),
// so a failed OTP shows its real cause in the same log.
//
// Setup in developers.facebook.com → your app → WhatsApp → Configuration:
//   Callback URL:  https://www.celorisdesigns.com/api/whatsapp/webhook
//   Verify token:  the value of WHATSAPP_WEBHOOK_VERIFY_TOKEN (any long random string you choose)
//   Subscribe to the "messages" field.
// Optional but recommended: WHATSAPP_APP_SECRET (App settings → Basic → App secret)
// so every incoming call is checked as genuinely coming from Meta.

export const dynamic = 'force-dynamic'

// Meta calls this once to confirm the URL when you press "Verify and save".
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams
  const expected = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
  if (expected && p.get('hub.mode') === 'subscribe' && p.get('hub.verify_token') === expected) {
    return new NextResponse(p.get('hub.challenge') || '', { status: 200, headers: { 'Content-Type': 'text/plain' } })
  }
  return new NextResponse('Forbidden', { status: 403 })
}

function signatureOk(raw: string, header: string | null): boolean {
  const secret = process.env.WHATSAPP_APP_SECRET
  if (!secret) return true // not configured yet — accept (status updates only, nothing sensitive is changed)
  if (!header?.startsWith('sha256=')) return false
  const expected = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('hex')
  const given = header.slice(7)
  if (given.length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(given, 'hex'), Buffer.from(expected, 'hex'))
}

export async function POST(request: NextRequest) {
  const raw = await request.text()
  if (!signatureOk(raw, request.headers.get('x-hub-signature-256'))) {
    return new NextResponse('Bad signature', { status: 401 })
  }

  let body: any = null
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ ok: true })
  }

  const supabase: any = createSupabaseClientForServer()
  const updates: Promise<any>[] = []

  for (const entry of body?.entry || []) {
    for (const change of entry?.changes || []) {
      for (const st of change?.value?.statuses || []) {
        const id = st?.id
        const status = String(st?.status || '').slice(0, 20) // sent | delivered | read | failed
        if (!id || !status) continue
        const err = Array.isArray(st?.errors) && st.errors[0]
        const errorText = err
          ? `${err.code ?? ''} ${err.title || err.message || ''}${err.error_data?.details ? ` — ${err.error_data.details}` : ''}`.trim().slice(0, 500)
          : null
        const patch: Record<string, unknown> = { status }
        if (errorText) patch.error_message = errorText
        updates.push(supabase.from('whatsapp_messages').update(patch).eq('whatsapp_message_id', id))
      }
    }
  }

  try {
    await Promise.all(updates)
  } catch (e) {
    console.error('[whatsapp webhook] update failed:', e)
  }
  // Always 200 so Meta doesn't keep retrying.
  return NextResponse.json({ ok: true })
}
