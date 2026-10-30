import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { putR2Object } from '@/lib/r2-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate mime type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json(
        { error: 'Only images and short videos are supported' },
        { status: 400 }
      );
    }

    // 25MB max size limit
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 25MB limit' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = extname(file.name) || (file.type.includes('png') ? '.png' : '.jpg');
    const safeBase = file.name
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${safeBase}${ext}`;

    let storedToR2 = false;

    // 1. Store to Cloudflare R2 (100% free permanent storage, 0 Supabase storage consumed)
    try {
      const r2Key = `social/${uniqueFileName}`;
      await putR2Object(r2Key, buffer, file.type);
      storedToR2 = true;
    } catch (r2Err) {
      console.warn('R2 upload failed or not configured, falling back to local VPS disk:', r2Err);
    }

    // 2. Also save to local / VPS disk if writable
    try {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'social');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, uniqueFileName);
      await writeFile(filePath, buffer);
    } catch (fsErr) {
      // Local disk might be read-only in serverless lambda; R2 takes precedence
      if (!storedToR2) {
        console.error('Both R2 and local filesystem storage failed:', fsErr);
        throw new Error('Failed to save file to permanent storage');
      }
    }

    // The media route permanently resolves either from local VPS or R2 signed CDN
    const publicUrl = `/api/social/media/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
      size: file.size,
      mimeType: file.type,
    });
  } catch (error: any) {
    console.error('Error uploading file to storage:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload image' },
      { status: 500 }
    );
  }
}
