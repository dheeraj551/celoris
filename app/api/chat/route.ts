import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';

// Vercel AI Gateway — single endpoint for all models
const gateway = createOpenAI({
  apiKey: process.env.VERCEL_AI_GATEWAY_KEY || '',
  baseURL: 'https://ai-gateway.vercel.sh/v1',
});

/**
 * Maps display model names (from the Celo AI dropdown) to Vercel AI Gateway model IDs.
 */
function getGatewayModel(modelName: string) {
  const lower = modelName.toLowerCase();

  if (lower.includes('gemini 2.5 flash lite')) return gateway('google/gemini-2.5-flash-lite-preview-06-17');
  if (lower.includes('gemini 2.5 flash'))      return gateway('google/gemini-2.5-flash');
  if (lower.includes('gemma'))                  return gateway('google/gemma-3-27b-it');
  if (lower.includes('google gemm'))            return gateway('google/gemini-2.5-flash');
  if (lower.includes('llama 4 maverick'))       return gateway('meta/llama-4-maverick-17b-128e-instruct');
  if (lower.includes('llama 4 scout'))          return gateway('meta/llama-4-scout-17b-16e-instruct');
  if (lower.includes('llama'))                  return gateway('meta/llama-3.3-70b-instruct');
  if (lower.includes('deepseek'))               return gateway('deepseek/deepseek-chat');
  if (lower.includes('qwen 3 coder'))           return gateway('qwen/qwen-2.5-coder-32b-instruct');
  if (lower.includes('qwen'))                   return gateway('qwen/qwen2.5-72b-instruct');
  if (lower.includes('devstral'))               return gateway('mistral/devstral-small-2505');
  if (lower.includes('ministral'))              return gateway('mistral/ministral-8b-2410');
  if (lower.includes('grok'))                   return gateway('xai/grok-3-mini');
  if (lower.includes('glm'))                    return gateway('zhipu/glm-4-flash');
  if (lower.includes('mercury coder'))          return gateway('inception/mercury-coder-small-beta');
  if (lower.includes('mercury'))                return gateway('inception/mercury-small-beta');

  // Fallback
  return gateway('google/gemini-2.5-flash');
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
    });

    return result.toDataStreamResponse();
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
      return fallbackResult.toDataStreamResponse();
    } catch (fallbackErr) {
      return Response.json(
        { error: error?.message || 'Failed to generate AI response', cause: String(error?.cause || '') },
        { status: 500 }
      );
    }
  }
}
