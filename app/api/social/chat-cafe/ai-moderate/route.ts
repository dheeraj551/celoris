import { NextResponse } from 'next/server';
import { zaiChatCompletion, isZaiConfigured } from '@/lib/zai';
import { getCallerUser, getOrCreateProfile, isModerator } from '@/lib/chat-cafe-server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';

// POST: moderator-only AI second opinion on a reported message, used by the
// Moderation Suite's "AI Opinion" button.
export async function POST(request: Request) {
  try {
    const user = await getCallerUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const admin = createSupabaseClientForServer();
    const profile = await getOrCreateProfile(admin, user.id, user.email?.split('@')[0] || 'New Patron');
    if (!isModerator(profile)) {
      return NextResponse.json({ error: 'Moderator access required' }, { status: 403 });
    }

    const { messageContent } = await request.json();
    if (!messageContent || typeof messageContent !== 'string') {
      return NextResponse.json({ error: 'messageContent is required' }, { status: 400 });
    }

    if (!isZaiConfigured()) {
      return NextResponse.json({ flagSeverity: 'low', reason: 'AI moderation is not configured on this server.', recommendation: 'Use human judgment.' });
    }

    const message = await zaiChatCompletion({
      messages: [
        {
          role: 'system',
          content:
            'You are a content-moderation assistant for a warm, friendly public chat café. Assess the message for harassment, hate speech, spam, or other violations. Respond with ONLY a JSON object matching exactly: {"flagSeverity": "none"|"low"|"medium"|"high", "reason": string (one sentence), "recommendation": string (one short phrase, e.g. "No action needed", "Mute 15 minutes", "Delete and warn", "Ban")}.',
        },
        { role: 'user', content: `Message to assess: "${messageContent}"` },
      ],
      max_tokens: 200,
      temperature: 0.2,
    });

    const raw = (message?.content || '').trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!parsed) {
      return NextResponse.json({ flagSeverity: 'low', reason: 'Could not parse AI response.', recommendation: 'Use human judgment.' });
    }

    return NextResponse.json({
      flagSeverity: parsed.flagSeverity || 'low',
      reason: String(parsed.reason || '').slice(0, 300),
      recommendation: String(parsed.recommendation || '').slice(0, 100),
    });
  } catch (error: any) {
    console.error('chat-cafe ai-moderate error:', error);
    return NextResponse.json({ flagSeverity: 'low', reason: 'AI moderation check failed.', recommendation: 'Use human judgment.' });
  }
}
