import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createR2SignedReadUrl } from '@/lib/r2-client'

// PolyVault download flow: the browser asks us for a short-lived signed GET
// URL for a published asset's R2 object key. We also set a
// Content-Disposition header on the signed URL so the browser downloads it
// under the asset's real filename rather than R2's internal object key.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to download' }, { status: 401 })
    }

    const { key, filename } = await request.json()

    if (!key || typeof key !== 'string' || !key.startsWith('polyvault/')) {
      return NextResponse.json({ error: 'Invalid asset key' }, { status: 400 })
    }

    const safeFilename = (typeof filename === 'string' && filename.trim()) || key.split('/').pop() || 'model'
    const disposition = `attachment; filename="${safeFilename.replace(/"/g, '')}"`

    const downloadUrl = await createR2SignedReadUrl(key, 3600, disposition)

    return NextResponse.json({ downloadUrl })
  } catch (error: any) {
    console.error('polyvault sign-download error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to create download URL' }, { status: 500 })
  }
}
