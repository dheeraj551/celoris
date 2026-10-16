import { NextResponse } from 'next/server';
import { getR2Object } from '@/lib/r2-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const R2_KEY = 'software/photolite/PhotoLite-Windows-x64.zip';
const FILENAME = 'PhotoLite-Windows-x64.zip';

export async function GET() {
  try {
    const object = await getR2Object(R2_KEY);

    if (!object.Body) {
      return NextResponse.json({ error: 'File not found in storage' }, { status: 404 });
    }

    // Transform AWS SDK v3 stream to Web-compatible ReadableStream
    const webStream = (object.Body as any).transformToWebStream
      ? (object.Body as any).transformToWebStream()
      : (object.Body as any);

    return new Response(webStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${FILENAME}"`,
        'Content-Length': object.ContentLength ? String(object.ContentLength) : '',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err) {
    console.error('[PhotoLite Stream Download Error]:', err);
    return NextResponse.json(
      { error: 'Failed to stream download for PhotoLite' },
      { status: 500 }
    );
  }
}
