import { NextRequest, NextResponse } from 'next/server'
import { createR2SignedUploadUrl } from '@/lib/r2-client'

// Admin PolyVault "Upload Model" flow, step 1 — same short-lived signed R2
// PUT URL pattern as /api/polyvault/sign-upload, but reached only from the
// admin-gated /admin/polyvault page, so it doesn't require (and can't check)
// a real signed-in marketplace user the way the creator-facing route does.
// Objects are stored under polyvault/admin/ rather than polyvault/<user id>/
// since there's no real user id behind an admin-panel upload.
export async function POST(request: NextRequest) {
  try {
    const { filename, contentType } = await request.json()

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 })
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-150)
    const key = `polyvault/admin/${Date.now()}_${safeName}`

    const uploadUrl = await createR2SignedUploadUrl(key, contentType || 'application/octet-stream')

    return NextResponse.json({ uploadUrl, key })
  } catch (error: any) {
    console.error('admin polyvault sign-upload error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create upload URL' }, { status: 500 })
  }
}
