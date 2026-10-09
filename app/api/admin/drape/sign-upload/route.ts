import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createR2SignedUploadUrl } from '@/lib/r2-client'

// Admin product photo upload, step 1: a short-lived signed R2 PUT URL. The
// browser uploads the file straight to R2, then saves the returned key on the
// product. Images only, up to 8 MB (checked again by the admin page).
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export async function POST(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) return NextResponse.json({ error: auth.error }, { status: auth.status })
  try {
    const { filename, contentType, size } = await request.json().catch(() => ({}))
    if (!ALLOWED.includes(contentType)) {
      return NextResponse.json({ error: 'Please upload a JPG, PNG, WebP or AVIF image' }, { status: 400 })
    }
    if (Number(size) > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'Images must be under 8 MB' }, { status: 400 })
    }
    const safe = String(filename || 'photo').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80)
    const key = `drape/products/${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safe}`
    const uploadUrl = await createR2SignedUploadUrl(key, contentType)
    return NextResponse.json({ uploadUrl, key })
  } catch (e: any) {
    console.error('[admin drape] sign-upload', e)
    return NextResponse.json({ error: e?.message || 'Could not start upload' }, { status: 500 })
  }
}
