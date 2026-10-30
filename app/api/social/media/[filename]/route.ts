import { NextRequest, NextResponse } from 'next/server';
import { createR2SignedReadUrl } from '@/lib/r2-client';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // 1. Check if file is stored locally on VPS / local disk
    const localPath = join(process.cwd(), 'public', 'uploads', 'social', filename);
    if (existsSync(localPath)) {
      try {
        const fileBuffer = await readFile(localPath);
        const ext = filename.split('.').pop()?.toLowerCase();
        const mimeTypes: Record<string, string> = {
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          png: 'image/png',
          webp: 'image/webp',
          gif: 'image/gif',
          mp4: 'video/mp4',
        };
        const contentType = mimeTypes[ext || ''] || 'application/octet-stream';

        return new NextResponse(new Uint8Array(fileBuffer), {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } catch (readErr) {
        console.warn('Local read failed, falling back to R2:', readErr);
      }
    }

    // 2. Fetch via Cloudflare R2 signed URL (0 Supabase Storage used)
    const r2Key = `social/${filename}`;
    const signedUrl = await createR2SignedReadUrl(r2Key, 86400);

    // Redirect browser directly to signed CDN URL with cache headers
    return NextResponse.redirect(signedUrl, {
      status: 307,
      headers: {
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error: any) {
    console.error('Error serving social media:', error);
    return NextResponse.json(
      { error: 'Media not found or failed to load: ' + error.message },
      { status: 404 }
    );
  }
}
