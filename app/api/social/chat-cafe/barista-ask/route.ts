import { NextResponse } from 'next/server';
import { zaiChatCompletion, isZaiConfigured } from '@/lib/zai';
import { getCallerUser } from '@/lib/chat-cafe-server';

// POST: "Ask Barista Nora" — a warm, in-character AI café host.
// The prototype's README called for a dedicated GEMINI_API_KEY; this app
// already has a configured text-AI backend (Z.ai/GLM, used by
// app/api/ai/chat and app/api/learn/ai-tutor), so we reuse that instead of
// requiring a new secret.
export async function POST(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!isZaiConfigured()) {
      return NextResponse.json({ reply: "Nora stepped away from the espresso machine for a moment — try again shortly! In the meantime, take a slow sip of your drink and enjoy the ambience. ☕" });
    }

    const { question, userContext } = await request.json();
    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'question is required' }, { status: 400 });
    }

    const message = await zaiChatCompletion({
      messages: [
        {
          role: 'system',
          content:
            "You are Barista Nora, the warm and whimsical AI host of Celoris Chat Café — a cozy retro online coffeehouse. Answer in 2-4 short sentences, in character: gentle, encouraging, a little playful, coffee-themed where it fits naturally. Never break character or mention being an AI model.",
        },
        {
          role: 'user',
          content: `A user named ${userContext?.name || 'a guest'} at the "${userContext?.table || 'café'}" table (currently enjoying a ${userContext?.currentDrink || 'warm drink'}) asks: ${question}`,
        },
      ],
      max_tokens: 220,
      temperature: 0.9,
    });

    const reply = message?.content?.trim() || 'Enjoy your calm moments at the café!';
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error('chat-cafe barista-ask error:', error);
    return NextResponse.json({ reply: "Nora's coffee grinder is buzzing loudly! Take three slow sips of your drink and be kind to yourself today." });
  }
}
