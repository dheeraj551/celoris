import { NextResponse } from 'next/server';
import { zaiChatCompletion, isZaiConfigured } from '@/lib/zai';
import { getCallerUser } from '@/lib/chat-cafe-server';

function fallbackTopic(category: string) {
  return {
    id: `ai_${Date.now()}`,
    title: 'A Question Worth Lingering On',
    prompt: `What is something about ${category || 'everyday life'} that you wish more people paused to appreciate?`,
    category: category || 'Daily Reflections & Mind',
    starterQuestions: [
      'What first made you think about this?',
      'Has your view on it changed over time?',
      'What would you tell someone just discovering this?',
    ],
    hostedBy: 'AI Barista',
    startedAt: Date.now(),
    phase: 'opening' as const,
  };
}

// POST: AI-generate a discussion-topic card for the Guided Discussion modal.
export async function POST(request: Request) {
  const { category, mood } = await request.json().catch(() => ({ category: '', mood: '' }));

  if (!isZaiConfigured()) {
    return NextResponse.json({ topic: fallbackTopic(category) });
  }

  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const message = await zaiChatCompletion({
      messages: [
        {
          role: 'system',
          content:
            'You design warm, inclusive discussion-starter cards for a cozy online café chat room. Respond with ONLY a JSON object (no markdown, no commentary) matching exactly this shape: {"title": string, "prompt": string, "category": string, "starterQuestions": [string, string, string]}. Keep the tone friendly, thoughtful and accessible to a general audience.',
        },
        {
          role: 'user',
          content: `Category/interest: ${category || 'anything welcoming'}. Desired mood/atmosphere: ${mood || 'warm and thoughtful'}.`,
        },
      ],
      max_tokens: 400,
      temperature: 0.95,
    });

    const raw = (message?.content || '').trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!parsed || !parsed.title || !parsed.prompt) {
      return NextResponse.json({ topic: fallbackTopic(category) });
    }

    return NextResponse.json({
      topic: {
        id: `ai_${Date.now()}`,
        title: String(parsed.title).slice(0, 100),
        prompt: String(parsed.prompt).slice(0, 400),
        category: String(parsed.category || category || 'General').slice(0, 60),
        starterQuestions: Array.isArray(parsed.starterQuestions) ? parsed.starterQuestions.slice(0, 4).map((q: any) => String(q)) : [],
        hostedBy: 'AI Barista',
        startedAt: Date.now(),
        phase: 'opening',
      },
    });
  } catch (error: any) {
    console.error('chat-cafe discussion-prompt error:', error);
    return NextResponse.json({ topic: fallbackTopic(category) });
  }
}
