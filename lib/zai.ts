/**
 * Shared Z.ai (GLM) client.
 *
 * Z.ai exposes an OpenAI-compatible Chat Completions API, so we talk to it
 * directly with fetch (no extra dependency). Configure via environment:
 *   ZAI_API_KEY   - Bearer token
 *   ZAI_BASE_URL  - e.g. https://api.z.ai/api/paas/v4/
 *   ZAI_MODEL     - e.g. glm-4.5-flash (limited-time free) or glm-4.6 (paid)
 */

const ZAI_BASE_URL = (process.env.ZAI_BASE_URL || 'https://api.z.ai/api/paas/v4/').replace(/\/+$/, '');
const ZAI_API_KEY = process.env.ZAI_API_KEY || '';

// Default to glm-4.5-flash: it is the limited-time-free tier that works out of
// the box. glm-4.6 requires a paid balance (error 1113 otherwise).
export const ZAI_MODEL = (() => {
    let model = (process.env.ZAI_MODEL || 'glm-4.5-flash').toLowerCase();
    if (model === 'glm-4.5') model = 'glm-4.5-flash';
    return model;
})();

export interface ZaiMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
    tool_call_id?: string;
    tool_calls?: any[];
    name?: string;
}

export interface ZaiTool {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: any;
    };
}

export function isZaiConfigured(): boolean {
    return !!ZAI_API_KEY;
}

interface ZaiRequestOptions {
    messages: ZaiMessage[];
    tools?: ZaiTool[];
    tool_choice?: string;
    max_tokens?: number;
    temperature?: number;
}

function buildBody(opts: ZaiRequestOptions, stream = false) {
    return JSON.stringify({
        model: ZAI_MODEL,
        messages: opts.messages,
        ...(stream ? { stream: true } : {}),
        ...(opts.tools ? { tools: opts.tools } : {}),
        ...(opts.tool_choice ? { tool_choice: opts.tool_choice } : {}),
        ...(opts.max_tokens ? { max_tokens: opts.max_tokens } : {}),
        ...(opts.temperature != null ? { temperature: opts.temperature } : {}),
    });
}

function headers() {
    return {
        Authorization: `Bearer ${ZAI_API_KEY}`,
        'Content-Type': 'application/json',
    };
}

/**
 * Non-streaming completion. Returns the assistant message object
 * (includes `content` and optional `tool_calls`).
 */
export async function zaiChatCompletion(opts: ZaiRequestOptions): Promise<any> {
    const res = await fetch(`${ZAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: headers(),
        body: buildBody(opts, false),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Z.ai error ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message;
}

/**
 * Streaming completion. Yields content-string deltas only.
 * (GLM emits a separate `reasoning_content` field, which we intentionally
 * do not surface to the client.)
 */
export async function* zaiChatStream(opts: ZaiRequestOptions): AsyncGenerator<string> {
    const res = await fetch(`${ZAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: headers(),
        body: buildBody(opts, true),
    });

    if (!res.ok || !res.body) {
        const text = await res.text().catch(() => '');
        throw new Error(`Z.ai stream error ${res.status}: ${text}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data:')) continue;

            const payload = trimmed.slice(5).trim();
            if (payload === '[DONE]') return;

            try {
                const json = JSON.parse(payload);
                const delta = json.choices?.[0]?.delta?.content;
                if (delta) yield delta;
            } catch {
                // Partial JSON across chunks — ignore; it'll complete on the next read.
            }
        }
    }
}

/**
 * Helper to create the standard SSE Response around a Zai stream.
 * Optionally emits a leading `__DATA__{json}__END_DATA__` envelope so the
 * client can render tool-result cards before the streamed answer.
 */
export function createZaiStreamResponse(
    stream: AsyncGenerator<string>,
    toolData: any = null,
): Response {
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
        async start(controller) {
            if (toolData) {
                const dataStr = `__DATA__${JSON.stringify(toolData)}__END_DATA__\n`;
                controller.enqueue(encoder.encode(dataStr));
            }

            try {
                for await (const chunk of stream) {
                    if (chunk) controller.enqueue(encoder.encode(chunk));
                }
            } catch (err) {
                console.error('Z.ai stream processing error:', err);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(readableStream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
