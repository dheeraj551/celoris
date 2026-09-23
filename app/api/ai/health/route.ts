import { NextResponse } from 'next/server'
import { currentUserId } from '../_auth'
import { getWalletBalance, higgsfieldAuthHeader, PRO_REQUIRED_CREDITS } from '@/lib/higgsfield-jobs'
import { createR2SignedReadUrl, putR2Object } from '@/lib/r2-client'

// Diagnostics for the AI image pipeline. Open /api/ai/health in the browser
// while signed in: each step says "ok" or the exact error, so a failure can be
// pinned to R2, the Higgsfield key, or Higgsfield's upload storage.

export const runtime = 'nodejs'
export const maxDuration = 30

async function step(fn: () => Promise<string>) {
  try {
    return { ok: true, detail: await fn() }
  } catch (err: any) {
    return { ok: false, detail: String(err?.message || err).slice(0, 300) }
  }
}

export async function GET() {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'Please sign in first.' }, { status: 401 })
  const balance = await getWalletBalance(userId)
  if (balance === null || balance < PRO_REQUIRED_CREDITS) return NextResponse.json({ error: 'Pro only.' }, { status: 403 })

  const env = {
    HF_CREDENTIALS: !!(process.env.HF_CREDENTIALS || process.env.HIGGSFIELD_CREDENTIALS || process.env.HF_KEY || process.env.HIGGSFIELD_KEY_ID),
    R2_ACCOUNT_ID: !!process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: !!process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: !!process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: !!process.env.R2_BUCKET_NAME,
  }

  const r2 = await step(async () => {
    const key = `ai-inputs/_health/${userId}.txt`
    await putR2Object(key, `ok ${new Date().toISOString()}`, 'text/plain')
    const res = await fetch(await createR2SignedReadUrl(key, 60))
    if (!res.ok) throw new Error(`signed read returned ${res.status}`)
    return 'write + signed read ok'
  })

  const hfFetch = async (path: string, init: RequestInit = {}) => {
    const res = await fetch(`https://api.higgsfield.ai${path}`, {
      ...init,
      headers: { Authorization: higgsfieldAuthHeader(), 'Content-Type': 'application/json', ...(init.headers || {}) },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    })
    const text = await res.text()
    if (!res.ok) throw new Error(`${res.status}: ${text.slice(0, 250)}`)
    return text ? JSON.parse(text) : null
  }

  const higgsfieldKey = await step(async () => {
    const body = await hfFetch('/marketing-studio/image/presets')
    const n = Array.isArray(body) ? body.length : (body?.presets || body?.items || body?.data || []).length
    return `key accepted (presets: ${n})`
  })

  const higgsfieldUpload = await step(async () => {
    const slot = await hfFetch('/files/generate-upload-url', { method: 'POST', body: JSON.stringify({ content_type: 'image/png' }) })
    if (!slot?.upload_url || !slot?.public_url) throw new Error(`unexpected reply keys: ${Object.keys(slot || {}).join(', ')}`)
    // 1x1 PNG
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64')
    const put = await fetch(slot.upload_url, {
      method: 'PUT',
      headers: { 'Content-Type': 'image/png', ...(slot.upload_headers || {}) },
      body: new Uint8Array(png),
      signal: AbortSignal.timeout(15_000),
    })
    if (!put.ok) throw new Error(`storage PUT ${put.status}: ${(await put.text().catch(() => '')).slice(0, 200)}`)
    return 'upload slot + PUT ok'
  })

  return NextResponse.json({ env, r2, higgsfieldKey, higgsfieldUpload })
}
