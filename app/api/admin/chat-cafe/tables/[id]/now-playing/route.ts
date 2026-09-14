import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

// Admin-only: the shared "café radio" for one table. POST finalizes an mp3
// upload (already sent straight to Supabase Storage by the client via the
// signed URL from ./sign-upload — see that route) and makes it the track
// playing for everyone currently at this table; DELETE stops it. Every
// listener's client computes its own seek offset from
// `now_playing.started_at`, so this route only has to persist that one row
// — the sync-on-join logic lives entirely client-side in
// RetroArcadeCabinetWrapper.
//
// This used to accept the mp3 itself as multipart form data, uploading it
// to Supabase from inside this handler. That meant the file's bytes had to
// pass through the hosting platform's own request-body-size limit before
// this code ever ran, which rejected anything but the smallest mp3s with a
// plain-text 413 the client's res.json() then choked on. Now the browser
// uploads directly to Supabase Storage and this route only ever receives a
// small JSON payload (the resulting storage path + a title).
export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tableId } = await params;
    const body = await request.json().catch(() => null);
    const path = typeof body?.path === 'string' ? body.path : null;
    const titleField = typeof body?.title === 'string' ? body.title : '';

    if (!path) {
      return NextResponse.json({ error: 'Missing uploaded file path' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();

    const { data: publicUrlData } = admin.storage.from('cafe-music').getPublicUrl(path);

    const title = titleField.trim()
      ? titleField.trim().slice(0, 80)
      : (path.split('/').pop() || 'Untitled Track').replace(/\.[^/.]+$/, '').slice(0, 80);

    const nowPlaying = {
      url: publicUrlData.publicUrl,
      title,
      startedAt: Date.now(),
    };

    const { error: updateError } = await admin
      .from('chat_cafe_tables')
      .update({ now_playing: nowPlaying })
      .eq('id', tableId);

    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ nowPlaying });
  } catch (error: any) {
    console.error('admin chat-cafe now-playing POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tableId } = await params;
    const admin = createSupabaseClientForServer();

    const { error } = await admin.from('chat_cafe_tables').update({ now_playing: null }).eq('id', tableId);
    if (error) throw new Error(error.message);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('admin chat-cafe now-playing DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
