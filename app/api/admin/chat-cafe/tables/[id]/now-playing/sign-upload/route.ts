import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

// Step 1 of the café-radio upload flow: hands the browser a short-lived
// signed Supabase Storage upload URL so the mp3's bytes can go straight
// from the browser to Supabase, bypassing this Next.js server entirely
// (and with it, the hosting platform's request-body-size limit that was
// causing uploads to fail with a 413 before they even reached our own
// size check — see ../route.ts for the full story). The request/response
// here only ever carries a file name and a storage path, so it's tiny
// regardless of how large the mp3 itself is.
export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tableId } = await params;
    const body = await request.json().catch(() => null);
    const fileName = typeof body?.fileName === 'string' && body.fileName.trim() ? body.fileName : 'track.mp3';
    const contentType = typeof body?.contentType === 'string' && body.contentType ? body.contentType : 'audio/mpeg';

    if (!contentType.startsWith('audio/')) {
      return NextResponse.json({ error: 'File must be an audio file (mp3)' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
    const storagePath = `${tableId}/${Date.now()}-${safeName}`;

    const { data, error } = await admin.storage.from('cafe-music').createSignedUploadUrl(storagePath);
    if (error) throw new Error(error.message);

    return NextResponse.json({ path: data.path, token: data.token, signedUrl: data.signedUrl });
  } catch (error: any) {
    console.error('admin chat-cafe sign-upload POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
