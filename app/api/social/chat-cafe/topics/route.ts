import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser, getOrCreateProfile, isMuted } from '@/lib/chat-cafe-server';

// POST: launch a discussion topic (curated or AI-generated) at a table.
// Any signed-in, non-banned/muted patron can host one — matches the
// original prototype, which never gated "Host a Guided Discussion" behind
// a role check.
export async function POST(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const { tableId, title, prompt, category, starterQuestions, source } = body || {};
    if (!tableId || !title || !prompt) {
      return NextResponse.json({ error: 'tableId, title and prompt are required' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();
    const profile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New Patron');

    if (profile.is_banned) {
      return NextResponse.json({ error: 'You have been barred from Chat Café.' }, { status: 403 });
    }
    if (isMuted(profile)) {
      return NextResponse.json({ error: 'You are currently muted.' }, { status: 403 });
    }

    const { data: topic, error: topicError } = await admin
      .from('chat_cafe_topics')
      .insert({
        table_id: tableId,
        title,
        prompt,
        category: category || 'General',
        starter_questions: Array.isArray(starterQuestions) ? starterQuestions : [],
        hosted_by: profile.name,
        phase: 'opening',
        source: source === 'ai_generated' ? 'ai_generated' : 'curated',
      })
      .select('*')
      .single();

    if (topicError) throw new Error(topicError.message);

    const { error: tableError } = await admin
      .from('chat_cafe_tables')
      .update({ active_topic_id: topic.id, updated_at: new Date().toISOString() })
      .eq('id', tableId);

    if (tableError) throw new Error(tableError.message);

    // Announcement message so the topic launch shows up in the transcript too.
    await admin.from('chat_cafe_messages').insert({
      table_id: tableId,
      sender_id: user.id,
      content: `🎙️ Launched a new discussion: "${title}"`,
      is_discussion_topic: true,
      discussion_data: {
        title,
        category: category || 'General',
        starterPrompts: Array.isArray(starterQuestions) ? starterQuestions : [],
      },
    });

    return NextResponse.json({ topic });
  } catch (error: any) {
    console.error('chat-cafe topics POST error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
