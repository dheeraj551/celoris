import { NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { getCallerUser, getOrCreateProfile } from '@/lib/chat-cafe-server';
import { zaiChatCompletion, isZaiConfigured } from '@/lib/zai';

// POST: advance the AI-character autopilot loop for one table by (at most)
// one line, if a turn is actually due.
//
// Every patron with a table open runs a client-side timer that calls this
// route every so often — see ChatCafeApp.tsx. Rather than trying to elect a
// single "leader" tab, every caller is allowed to try, and Postgres itself
// arbitrates: the UPDATE below only succeeds for whichever request gets to
// chat_cafe_tables.next_ai_turn_at first (a compare-and-swap via the WHERE
// clause), so only one request per turn actually generates and posts a
// message even when many patrons have the same room open at once.
const MIN_SECONDS_BETWEEN_TURNS = 25;
const MEMORY_COMPRESS_EVERY = 6;
const CONTEXT_MESSAGE_LIMIT = 14;

export async function POST(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { tableId } = await request.json();
    if (!tableId || typeof tableId !== 'string') {
      return NextResponse.json({ error: 'tableId is required' }, { status: 400 });
    }

    const admin = createSupabaseClientForServer();

    // A caller just needs to be a real, non-banned patron to nudge the loop
    // forward — they aren't posting on their own behalf.
    const profile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New Patron');
    if (profile.is_banned) {
      return NextResponse.json({ skipped: true, reason: 'banned' });
    }

    if (!isZaiConfigured()) {
      return NextResponse.json({ skipped: true, reason: 'ai_not_configured' });
    }

    const nowIso = new Date().toISOString();
    const claimUntilIso = new Date(Date.now() + MIN_SECONDS_BETWEEN_TURNS * 1000).toISOString();

    const { data: claimedTable, error: claimError } = await admin
      .from('chat_cafe_tables')
      .update({ next_ai_turn_at: claimUntilIso })
      .eq('id', tableId)
      .or(`next_ai_turn_at.is.null,next_ai_turn_at.lte.${nowIso}`)
      .select('id, is_locked')
      .maybeSingle();

    if (claimError) throw new Error(claimError.message);
    if (!claimedTable) {
      // Someone else already claimed (or won) this turn slot.
      return NextResponse.json({ skipped: true, reason: 'not_due' });
    }
    if (claimedTable.is_locked) {
      return NextResponse.json({ skipped: true, reason: 'table_locked' });
    }

    const { data: characters, error: charError } = await admin
      .from('chat_cafe_ai_characters')
      .select('*')
      .eq('table_id', tableId)
      .eq('is_active', true);

    if (charError) throw new Error(charError.message);
    if (!characters || characters.length === 0) {
      return NextResponse.json({ skipped: true, reason: 'no_characters' });
    }

    const { data: recentRows, error: recentError } = await admin
      .from('chat_cafe_messages')
      .select(
        'id, content, sender_type, ai_character_id, is_deleted, sender:chat_cafe_profiles(name), ai_character:chat_cafe_ai_characters(name)'
      )
      .eq('table_id', tableId)
      .order('created_at', { ascending: false })
      .limit(CONTEXT_MESSAGE_LIMIT);

    if (recentError) throw new Error(recentError.message);
    const recent = (recentRows || []).filter((r: any) => !r.is_deleted).reverse();

    // Avoid the same character replying to itself twice in a row when more
    // than one voice is available at the table.
    const lastAiSpeakerId = [...recent].reverse().find((r: any) => r.sender_type === 'ai')?.ai_character_id;
    const pool = characters.length > 1 ? characters.filter((c: any) => c.id !== lastAiSpeakerId) : characters;
    const character = pool[Math.floor(Math.random() * pool.length)];

    const { data: memoryRow } = await admin
      .from('chat_cafe_ai_character_memories')
      .select('*')
      .eq('character_id', character.id)
      .maybeSingle();

    const memorySummary: string = memoryRow?.summary || '';
    const turnCount: number = memoryRow?.turn_count || 0;

    const transcriptText = recent.length
      ? recent
          .map((r: any) => {
            const speaker = r.sender_type === 'ai' ? r.ai_character?.name || 'AI' : r.sender?.name || 'Patron';
            return `${speaker}: ${r.content}`;
          })
          .join('\n')
      : '(no recent messages yet)';

    const systemPrompt = [
      `You are ${character.name}, a regular at Celoris Chat Café — a cozy retro-internet online coffeehouse. You hang out at this table and chat naturally with whoever's around.`,
      character.backstory ? `Backstory: ${character.backstory}` : '',
      character.personality ? `Personality & speaking style: ${character.personality}` : '',
      memorySummary ? `What you remember from this conversation so far: ${memorySummary}` : '',
      'Stay fully in character. Write ONE short chat message: 1-3 sentences, casual, like a real message in a retro chat room. No markdown, no asterisked stage directions, no quotation marks wrapping the whole message. React naturally to the recent conversation below when it makes sense, or start a small new thread if nothing needs a direct reply. Never say or imply you are an AI, a bot, or a language model.',
    ]
      .filter(Boolean)
      .join('\n\n');

    const message = await zaiChatCompletion({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Recent conversation:\n${transcriptText}\n\nWrite ${character.name}'s next message.` },
      ],
      max_tokens: 160,
      temperature: 1.0,
    });

    const replyText: string | undefined = message?.content?.trim();
    if (!replyText) {
      return NextResponse.json({ skipped: true, reason: 'empty_generation' });
    }

    const { data: inserted, error: insertError } = await admin
      .from('chat_cafe_messages')
      .insert({
        table_id: tableId,
        sender_type: 'ai',
        ai_character_id: character.id,
        content: replyText.slice(0, 500),
      })
      .select('*, ai_character:chat_cafe_ai_characters(*)')
      .single();

    if (insertError) throw new Error(insertError.message);

    // Fold the exchange into the character's memory. Every turn we at least
    // bump turn_count; every MEMORY_COMPRESS_EVERY turns we actually ask the
    // model to re-summarize, so prompts stay short no matter how long the
    // conversation runs.
    const newTurnCount = turnCount + 1;
    let newSummary = memorySummary;
    if (newTurnCount % MEMORY_COMPRESS_EVERY === 0) {
      try {
        const compressionMessage = await zaiChatCompletion({
          messages: [
            {
              role: 'system',
              content: `You maintain a short rolling memory for the chat character ${character.name}. Combine the previous memory with the recent conversation into an updated memory: 2-4 sentences, third person, covering only what's worth remembering (relationships formed, running jokes, things patrons told them, promises made). Output only the memory text, nothing else.`,
            },
            {
              role: 'user',
              content: `Previous memory: ${memorySummary || '(none yet)'}\n\nRecent conversation:\n${transcriptText}\n${character.name}: ${replyText}`,
            },
          ],
          max_tokens: 180,
          temperature: 0.5,
        });
        newSummary = compressionMessage?.content?.trim() || memorySummary;
      } catch (compressError) {
        console.error('chat-cafe ai-turn memory compression error:', compressError);
      }
    }

    await admin.from('chat_cafe_ai_character_memories').upsert({
      character_id: character.id,
      summary: newSummary.slice(0, 1000),
      turn_count: newTurnCount,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ message: inserted });
  } catch (error: any) {
    console.error('chat-cafe ai-turn error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
