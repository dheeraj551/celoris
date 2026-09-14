import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

// Admin-only: the shared "café radio" for one table. POST uploads an mp3
// and makes it the track playing for everyone currently at this table;
// DELETE stops it. Every listener's client computes its own seek offset
// from `now_playing.started_at`, so this route only has to persist that
// one row — the sync-on-join logic lives entirely client-side in
// RetroArcadeCabinetWrapper.
export const dynamic = 'force-dynamic';

const MAX_BYTES = 20 * 1024 * 1024; // 20MB, matches the cafe-music bucket's file_size_limit

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: tableId } = await params;
    const formData = await request.formData();
    const file = formData.get('file');
    const titleField = formData.get('title');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'An mp3 file is required' }, { status: 400 });
    }
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'File must be an audio file (mp3)' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File is too large — 20MB max' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
    const storagePath = `${tableId}/${Date.now()}-${safeName}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage
      .from('cafe-music')
      .upload(storagePath, bytes, { contentType: file.type || 'audio/mpeg', upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicUrlData } = admin.storage.from('cafe-music').getPublicUrl(storagePath);

    const title =
      typeof titleField === 'string' && titleField.trim()
        ? titleField.trim().slice(0, 80)
        : file.name.replace(/\.[^/.]+$/, '').slice(0, 80);

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
