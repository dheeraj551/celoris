import { NextResponse } from 'next/server'
import { putR2Object, createR2SignedReadUrl, deleteR2Object } from '@/lib/r2-client'

// One-off connectivity check for the Cloudflare R2 integration. Writes a
// tiny test object, generates a signed read URL for it, fetches that URL
// server-side to confirm the round trip actually works end to end, then
// deletes the object — leaving nothing behind in the bucket. Visit
// /api/admin/r2-test in the browser (while signed in as admin, or just
// locally during setup) to confirm R2_ACCOUNT_ID / R2_ACCESS_KEY_ID /
// R2_SECRET_ACCESS_KEY / R2_BUCKET_NAME in .env.local are all correct and
// the API token has the right permissions.
export const dynamic = 'force-dynamic'

export async function GET() {
  const testKey = `_connectivity-test/${Date.now()}.txt`
  const testContent = `Celoris R2 connectivity test — ${new Date().toISOString()}`

  try {
    await putR2Object(testKey, testContent, 'text/plain')

    const signedUrl = await createR2SignedReadUrl(testKey, 60)
    const verifyRes = await fetch(signedUrl)
    if (!verifyRes.ok) {
      throw new Error(`Signed URL fetch failed with status ${verifyRes.status}`)
    }
    const fetchedContent = await verifyRes.text()

    await deleteR2Object(testKey)

    if (fetchedContent !== testContent) {
      return NextResponse.json(
        { ok: false, error: 'Fetched content did not match what was written' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ok: true,
      message:
        'R2 is connected: wrote a test object, generated a signed URL, fetched it back successfully, and cleaned up. Nothing was left in the bucket.',
    })
  } catch (error: any) {
    console.error('R2 connectivity test failed:', error)
    // Best-effort cleanup even on failure, in case the write succeeded but
    // a later step (signing, fetching, verifying) failed.
    await deleteR2Object(testKey).catch(() => {})
    return NextResponse.json({ ok: false, error: error.message || 'Unknown error' }, { status: 500 })
  }
}
