import { NextResponse } from 'next/server';
import { createR2SignedReadUrl } from '@/lib/r2-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const R2_KEY = 'software/photolite/PhotoLite-Windows-x64.zip';
const LINK_SECONDS = 3600; // 1 hour valid link
const FILENAME = 'PhotoLite-Windows-x64.zip';

export async function GET() {
  try {
    const downloadUrl = await createR2SignedReadUrl(
      R2_KEY,
      LINK_SECONDS,
      `attachment; filename="${FILENAME}"`
    );

    const res = NextResponse.redirect(downloadUrl, 302);
    // Cache the redirect for 15 minutes so rapid clicks don't hit the signing server repeatedly
    res.headers.set('Cache-Control', 'public, max-age=900, stale-while-revalidate=1800');
    return res;
  } catch (err) {
    console.error('[PhotoLite R2 Download Error]:', err);
    return NextResponse.json(
      { error: 'Failed to generate download link for PhotoLite desktop software' },
      { status: 500 }
    );
  }
}
