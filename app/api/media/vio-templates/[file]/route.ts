import { NextRequest, NextResponse } from 'next/server';
import { createR2SignedReadUrl } from '@/lib/r2-client';

// ViO Studio → Explore Templates media stored in Cloudflare R2.
//
// The bucket is private, so the template cards point at this route and it
// hands the browser a short-lived signed R2 link (302). Only the files listed
// below can be requested — nothing else in the bucket is reachable from here.
// Upload / refresh them with:  node scripts/upload-vio-templates.mjs

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PREFIX = 'public/vio-templates/';

const ALLOWED = new Set([
  'ame-kaze-green-tea.mp4',
  'ame-kaze-green-tea.jpg',
  'wallet-lightweight-poster.mp4',
  'wallet-lightweight-poster.jpg',
  'watch-exploded-view.mp4',
  'watch-exploded-view.jpg',
  'campus-walk-ugc.mp4',
  'campus-walk-ugc.jpg',
  'podcast-creator-ugc.mp4',
  'podcast-creator-ugc.jpg',
  'skincare-ugc-hold.jpg',
  'blender-social-media-town.jpg',
  'claude-certified-developer.jpg',
]);

// Signed links live for an hour; the redirect itself is cached for 30 minutes,
// so a cached redirect always points at a link that is still valid.
const LINK_SECONDS = 3600;
const REDIRECT_CACHE_SECONDS = 1800;

export async function GET(_request: NextRequest, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!file || !ALLOWED.has(file)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const url = await createR2SignedReadUrl(PREFIX + file, LINK_SECONDS);
    const res = NextResponse.redirect(url, 302);
    res.headers.set(
      'Cache-Control',
      `public, max-age=${REDIRECT_CACHE_SECONDS}, s-maxage=${REDIRECT_CACHE_SECONDS}`
    );
    return res;
  } catch (err) {
    console.error('[vio-templates media] sign error, redirecting to local static fallback:', err);
    return NextResponse.redirect(new URL(`/templates/vio/${file}`, _request.url), 307);
  }
}
