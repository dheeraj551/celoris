import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createR2SignedUploadUrl } from '@/lib/r2-client'

// PolyVault "Publish Model" flow, step 1: the browser asks us for a
// short-lived signed PUT URL so it can upload the model file straight to
// Cloudflare R2 (same pattern as Chat Café's mp3 uploads / the Celoris 3D
// R2 test route) — the file's bytes never pass through this server.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to publish an asset' }, { status: 401 })
    }

    const { filename, contentType } = await request.json()

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 })
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-150)
    const key = `polyvault/${user.id}/${Date.now()}_${safeName}`

    const uploadUrl = await createR2SignedUploadUrl(key, contentType || 'application/octet-stream')

    return NextResponse.json({ uploadUrl, key })
  } catch (error: any) {
    console.error('polyvault sign-upload error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create upload URL' }, { status: 500 })
  }
}
