import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Same Vercel AI Gateway setup as /api/chat (Celo AI) — see that route for
// the full model catalog. This bot only ever needs one cheap, fast model.
const gateway = createOpenAI({
  apiKey: process.env.VERCEL_AI_GATEWAY_KEY || '',
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

// Same handful of seed/test rows the public /api/courses route excludes.
const TEST_COURSE_TITLES = [
  'Agentic AI for Beginners: From Prompts to Action',
  'Mastering Nano Banana Pro',
  'My new ai course will be here',
];

async function buildCourseCatalogText(): Promise<string> {
  const supabase = (createClient() as any);

  const { data: courses, error } = await supabase
    .from('courses')
    .select(
      'title, subject, grade_level, difficulty_level, description, target_audience, course_duration, price, is_featured'
    )
    .eq('is_published', true)
    .order('is_featured', { ascending: false });

  if (error || !courses) {
    console.error('[Support Bot] Failed to load course catalog:', error);
    return '(Course catalog is temporarily unavailable — apologize and offer to have the team follow up instead of guessing at course names or prices.)';
  }

  const rows = (courses as any[]).filter(
    c => !TEST_COURSE_TITLES.some(t => t.toLowerCase() === String(c.title || '').toLowerCase())
  );

  if (rows.length === 0) {
    return '(No published courses found — apologize and offer to have the team follow up.)';
  }

  return rows
    .map(c => {
      const price = c.price === null || c.price === undefined ? 'Free' : `₹${c.price}`;
      const bits = [
        c.subject,
        c.grade_level,
        c.difficulty_level,
      ].filter(Boolean).join(', ');
      const desc = (c.description || '').trim().slice(0, 220);
      return `- "${c.title}"${bits ? ` (${bits})` : ''} — ${price}${c.course_duration ? `, ${c.course_duration}` : ''}${c.is_featured ? ' [featured]' : ''}\n  ${desc}${c.target_audience ? `\n  Best for: ${c.target_audience}` : ''}`;
    })
    .join('\n');
}

type Intent = 'student' | 'teacher' | 'jobseeker' | 'customer' | null | undefined;

const INTENT_FOCUS: Record<string, string> = {
  student: `This visitor identified themselves as a student looking to learn. Keep "Learn" (/learn/courses) as your primary lens — recommend 1-2 relevant courses from the catalog below based on what they say, unless they steer the conversation elsewhere.`,
  teacher: `This visitor identified themselves as a teacher. Keep "Teach" (/teach) as your primary lens — explain that they can sign up as an instructor and publish video lectures through Teacher Studio inside Celoris TV, unless they steer the conversation elsewhere.`,
  jobseeker: `This visitor identified themselves as looking for a job. Keep "Job Center" (/job-center) as your primary lens — SkillVerify Pro: job alerts and skill-verification exams — unless they steer the conversation elsewhere.`,
  customer: `This visitor identified themselves as an existing Celoris customer. Point them to their "Dashboard" (/dashboard) to manage their account, wallet, and enrolled courses. You don't have access to their account or order details, so for anything account-specific tell them to use "Talk to our team".`,
};

function buildSystemPrompt(catalogText: string, intent: Intent): string {
  const focusLine = intent && INTENT_FOCUS[intent] ? INTENT_FOCUS[intent] : '';

  return `You are Celoris Support — a friendly, concise chat assistant embedded on the Celoris website (celorisdesigns.com) that helps visitors find the right part of Celoris for them and answers quick questions about courses, teaching, freelance work, and their account.

Celoris has these visitor-facing sections. Only ever recommend a section/link from this list — never invent a page or URL:
- Learn (/learn/courses) — browse and enroll in courses. See the live course catalog below for exact titles, subjects, prices and durations.
- Teach (/teach) — become an instructor: sign up, then publish video lectures via Teacher Studio inside Celoris TV.
- Job Center (/job-center) — SkillVerify Pro: job alerts and skill-verification exams for job seekers.
- Dashboard (/dashboard) — where a signed-in user manages their account, wallet, enrolled courses, and activity.

${focusLine}

Ground rules:
- Only recommend or describe courses from the catalog below. Never invent a course, price, or duration that isn't listed.
- If nothing fits what the visitor is asking for, say so honestly instead of stretching something to fit.
- Ask one short clarifying question when the visitor's goal is vague rather than guessing.
- Keep replies short — 2-4 sentences, chat-widget length, not an essay. Use a friendly, plain tone, minimal formatting.
- If the visitor wants to enroll, sign up, talk to a real person, ask something you can't answer from here, or seems ready to take the next step, tell them to use the "WhatsApp us" or "Email our team" buttons in this chat — don't try to collect their contact info yourself in the conversation.
- Prices are in Indian Rupees (₹).

Current course catalog (for Learn / course questions):
${catalogText}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const rawIntent = typeof body?.intent === 'string' ? body.intent : undefined;
    const intent: Intent = (['student', 'teacher', 'jobseeker', 'customer'] as const).includes(rawIntent as any)
      ? (rawIntent as Intent)
      : undefined;

    if (messages.length === 0) {
      return Response.json({ error: 'messages is required' }, { status: 400 });
    }

    // Keep only the fields streamText expects, and cap history length so a
    // long-running widget conversation can't blow up the prompt.
    const trimmedMessages = messages
      .slice(-20)
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m: any) => ({ role: m.role, content: m.content }));

    if (trimmedMessages.length === 0) {
      return Response.json({ error: 'messages is required' }, { status: 400 });
    }

    const catalogText = await buildCourseCatalogText();
    const gatewayKey = process.env.VERCEL_AI_GATEWAY_KEY;
    const selectedModel = gatewayKey ? gateway('google/gemini-2.5-flash-lite') : google('gemini-2.5-flash');

    const result = streamText({
      model: selectedModel,
      system: buildSystemPrompt(catalogText, intent),
      messages: trimmedMessages,
      temperature: 0.5,
      // See app/api/chat/route.ts for why this matters: streamText() streams
      // the model call asynchronously, so a failure here (bad key, quota,
      // retired model id) would otherwise just end the stream with zero
      // bytes and no visible error. Same fix applied here.
      onError: ({ error: streamError }) => {
        console.error('[Support Bot] streamText error:', streamError);
      },
    });

    const encoder = new TextEncoder();
    let sawAnyOutput = false;
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            sawAnyOutput = true;
            controller.enqueue(encoder.encode(chunk));
          }
          if (!sawAnyOutput) {
            controller.enqueue(
              encoder.encode(
                "Sorry, I couldn't put a response together just now. Please try again, or use the \"Talk to our team\" button and we'll get back to you directly."
              )
            );
          }
        } catch (streamErr: any) {
          console.error('[Support Bot] Stream consumption error:', streamErr);
          controller.enqueue(
            encoder.encode(
              "Sorry, something went wrong on my end. Please try again, or use the \"Talk to our team\" button and we'll get back to you directly."
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    console.error('[Support Bot] Full error:', error);
    return Response.json({ error: 'Failed to generate a response' }, { status: 500 });
  }
}
