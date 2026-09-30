import { NextRequest, NextResponse } from 'next/server';
import { createR2SignedReadUrl } from '@/lib/r2-client';

// Homepage showcase videos stored in Cloudflare R2.
//
// The bucket is private, so the homepage points at this route and it
// hands the browser a short-lived signed R2 link (302). Only the files listed
// below can be requested — nothing else in the bucket is reachable from here.
// Upload / refresh them with:  node scripts/upload-vio-templates.mjs

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PREFIX = 'public/showcase/';

const ALLOWED = new Set([
  'celoris-tv-host-loop.mp4',
  'celoris-tv-host-loop.jpg',
  'trainer-pitch-reel.mp4',
  'trainer-pitch-reel.jpg',
  'character-turntable.mp4',
  'character-turntable.jpg',
  'video-studio-reel.mp4',
  'video-studio-reel.jpg',
  'video-studio-clip1.jpg',
  'video-studio-clip2.jpg',
  'video-studio-clip3.jpg',
  'video-studio-clip4.jpg',
  'photolite-pair1-before.jpg',
  'photolite-pair1-after.jpg',
  'photolite-pair2-before.jpg',
  'photolite-pair2-after.jpg',
  'support-avatar.mp4',
  'support-avatar.jpg',
  'classroom-live-loop.mp4',
  'classroom-live-loop.jpg',
  'motion-swap-suv.mp4',
  'motion-swap-suv.jpg',
  'motion-swap-suv-thumb.jpg',
  'stickerposter.mp4',
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
    console.error('[showcase media] sign error:', err);
    return NextResponse.json({ error: 'Media unavailable' }, { status: 503 });
  }
}
