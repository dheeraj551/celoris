import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

// Vercel AI Gateway — single endpoint for all models
const gateway = createOpenAI({
  apiKey: process.env.VERCEL_AI_GATEWAY_KEY || '',
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

// Exact display name (from components/celo-ai/constants/models.ts, the
// dropdown the user actually picks from) -> Vercel AI Gateway model ID.
// Verified against each model's own page at vercel.com/ai-gateway/models/
// <slug> as of Sept 2026 — the previous version of this file used loose
// substring matching against a much shorter, older model list, so most of
// the 37 models the dropdown now actually offers had NO matching branch at
// all and silently fell through to Gemini regardless of what was picked
// (worse than an error — the student had no idea their choice was ignored).
// Keys are normalized (trimmed, lowercased, whitespace collapsed) so stray
// double-spaces in the dropdown list (e.g. "fast  no reasoning") still match.
const MODEL_ID_MAP: Record<string, string> = {
  'deepseek v3.2': 'deepseek/deepseek-v3.2-exp',
  'deepseek v4 flash': 'deepseek/deepseek-v4-flash',
  'devstral small 2': 'mistral/devstral-small-2',
  'gemini 2.5 flash lite': 'google/gemini-2.5-flash-lite',
  'gemma 4 26b a4b it': 'google/gemma-4-26b-a4b-it',
  'glm 4.7 flash': 'zai/glm-4.7-flash',
  'glm 4.7 flashx': 'zai/glm-4.7-flashx',
  'google gemm 4 31b': 'google/gemma-4-31b-it',
  'google gemm 4 26b a4b': 'google/gemma-4-26b-a4b-it',
  'gpt oss safeguard 120b': 'openai/gpt-oss-safeguard-120b',
  'gpt-4.1 nano': 'openai/gpt-4.1-nano',
  'gpt 5 nano': 'openai/gpt-5-nano',
  'grok 4.1 fast reasoning': 'xai/grok-4.1-fast-reasoning',
  'grok 4.1 fast no reasoning': 'xai/grok-4.1-fast-non-reasoning',
  'hy3': 'tencent/hy3',
  'kat coder air v2.5': 'kwaipilot/kat-coder-air-v2.5',
  'laguna s 2.1': 'poolside/laguna-s-2.1',
  'ling 3.0 flash': 'inclusionai/ling-3.0-flash',
  'llama 4 maverick 17b': 'meta/llama-4-maverick',
  'llama 4 scout 17b': 'meta/llama-4-scout',
  'mercury 2': 'inception/mercury-2',
  'mercury coder': 'inception/mercury-coder-small',
  'minimax m2.7': 'minimax/minimax-m2.7',
  'ministral 14b': 'mistral/ministral-14b',
  'nemotron 3 nano 30b': 'nvidia/nemotron-3-nano-30b-a3b',
  'nvideo nemotron 3 super': 'nvidia/nemotron-3-super-120b-a12b',
  'qwen 3 coder 30 b': 'alibaba/qwen3-coder-30b-a3b',
  'qwen 3.5 flash': 'alibaba/qwen3.5-flash',
  'qwen 3.7 flash': 'alibaba/qwen3.7-flash',
  'qwen 3 235b a22b instruction': 'alibaba/qwen-3-235b',
  'qwen 3 14 b': 'alibaba/qwen-3-14b',
  'qwen 3 30 b': 'alibaba/qwen-3-30b',
  'stepfun 3.5 flash': 'stepfun/step-3.5-flash',
  // Unverified — no page for this exact model turned up on Vercel's
  // gateway during the Sept 2026 audit; slug is inferred from the naming
  // pattern every other model in this table followed. If picking this one
  // shows the "didn't return anything" fallback message, that's why.
  'tencent hy-mt2-pro': 'tencent/hy-mt2-pro',
  'tencent hy3': 'tencent/hy3',
  'trinity large thinking': 'arcee-ai/trinity-large-thinking',
};

function normalizeModelName(modelName: string): string {
  return modelName.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Maps a display model name (from the Celo AI dropdown) to a Vercel AI
 * Gateway model instance. Falls back to Gemini 2.5 Flash — logged loudly —
 * for anything not in MODEL_ID_MAP, e.g. a model added to the dropdown
 * without updating this table.
 */
function getGatewayModel(modelName: string) {
  const key = normalizeModelName(modelName);
  const gatewayId = MODEL_ID_MAP[key];

  if (!gatewayId) {
    console.warn(`[Celo AI] No Gateway mapping for model "${modelName}" — falling back to Gemini 2.5 Flash.`);
    return gateway('google/gemini-2.5-flash');
  }

  return gateway(gatewayId);
}

const DEFAULT_SYSTEM = `You are Celo AI — an intelligent learning assistant built into the Celoris education platform.
You help students understand concepts, solve problems, and learn more effectively.
- Explain clearly with real-world examples relevant to students.
- Use Markdown: bullet points, **bold**, \`code blocks\`, and tables where helpful.
- Be encouraging, warm, and student-friendly.
- Keep responses focused and not overly long.
- Suggest 2 follow-up questions the student could explore at the end of each response.`;

export async function POST(req: Request) {
  try {
    const { prompt, model = 'Gemini 2.5 Flash Lite', systemInstruction } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const gatewayKey = process.env.VERCEL_AI_GATEWAY_KEY;
    console.log('[Celo AI] Model selected:', model);
    console.log('[Celo AI] Gateway key present:', !!gatewayKey);

    // Use Vercel AI Gateway if key is available, otherwise fall back to direct Google AI
    const selectedModel = gatewayKey
      ? getGatewayModel(model)
      : google('gemini-2.5-flash');

    const result = streamText({
      model: selectedModel,
      system: systemInstruction || DEFAULT_SYSTEM,
      prompt,
      temperature: 0.7,
      // streamText() returns immediately and streams the model call
      // asynchronously — if the model call itself fails (bad/retired model
      // id, invalid key, quota, etc.) that happens *after* this function has
      // already returned, so the outer try/catch below never sees it. By
      // default the SDK just ends the stream with zero bytes and no HTTP
      // error, which is why a broken model previously showed up as a
      // silently empty chat bubble instead of any kind of error. This at
      // least gets it into the server console.
      onError: ({ error: streamError }) => {
        console.error('[Celo AI] streamText error:', streamError);
      },
    });

    // Wrap the text stream ourselves instead of returning
    // result.toTextStreamResponse() directly, so a failed generation
    // reaches the student as a real message instead of an empty bubble.
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
                "I couldn't generate a response just now — the AI model didn't return anything. Please try again in a moment, or switch models from the dropdown above."
              )
            );
          }
        } catch (streamErr: any) {
          console.error('[Celo AI] Stream consumption error:', streamErr);
          controller.enqueue(
            encoder.encode(
              `I ran into an error generating a response (${streamErr?.message || 'unknown error'}). Please try again.`
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
    console.error('[Celo AI] Full error:', error);
    console.error('[Celo AI] Error message:', error?.message);
    console.error('[Celo AI] Error cause:', error?.cause);

    // Last resort: try direct Google AI
    try {
      const { prompt, systemInstruction } = await new Request(req.url, { method: 'GET' }).json().catch(() => ({})) as any;
      console.log('[Celo AI] Attempting direct Google AI fallback...');
      const fallbackResult = streamText({
        model: google('gemini-2.5-flash'),
        system: systemInstruction || DEFAULT_SYSTEM,
        prompt: prompt || 'Hello',
        temperature: 0.7,
      });
      return fallbackResult.toTextStreamResponse();
    } catch (fallbackErr) {
      return Response.json(
        { error: error?.message || 'Failed to generate AI response', cause: String(error?.cause || '') },
        { status: 500 }
      );
    }
  }
}
