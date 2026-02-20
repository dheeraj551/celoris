import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, Tool, SchemaType } from '@google/generative-ai';
import { createRouteClient } from '@/lib/supabase-server';

const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || '');

const tools: Tool[] = [
    {
        functionDeclarations: [
            {
                name: 'search_courses',
                description: 'Search for educational courses available on the Celoris platform.',
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        query: {
                            type: SchemaType.STRING,
                            description: 'The search query or keyword (e.g., "physics", "react", "class 10").',
                        },
                        limit: {
                            type: SchemaType.NUMBER,
                            description: 'Maximum number of results to return (default 5).',
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'search_jobs',
                description: 'Search for job openings and career opportunities.',
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        query: {
                            type: SchemaType.STRING,
                            description: 'The job title, location, or skill (e.g., "software engineer", "mumbai").',
                        },
                        limit: {
                            type: SchemaType.NUMBER,
                            description: 'Maximum number of results to return (default 5).',
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'search_blog',
                description: 'Search for articles, news, and tutorials on the Celoris blog.',
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        query: {
                            type: SchemaType.STRING,
                            description: 'The topic or keyword (e.g., "ai trends", "how to study").',
                        },
                        limit: {
                            type: SchemaType.NUMBER,
                            description: 'Maximum number of results to return (default 5).',
                        },
                    },
                    required: ['query'],
                },
            },
            {
                name: 'get_contact_info',
                description: 'Get contact details for Celoris support and services.',
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {},
                },
            },
        ],
    },
];

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const supabase = createRouteClient();

        if (!apiKey) {
            return NextResponse.json({ error: "API Key not configured." }, { status: 500 });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-3-flash-preview',
            tools: tools,
        });

        const chat = model.startChat({
            history: messages.slice(0, -1).map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
            })),
        });

        const lastMessage = messages[messages.length - 1].content;

        // Step 1: Check for tool calls first (non-streaming for tool detection is often more reliable)
        const initialResult = await chat.sendMessage(initialUserPrompt(lastMessage));
        const initialResponse = initialResult.response;
        let call = initialResponse.candidates?.[0].content.parts.find((p) => p.functionCall);
        let toolData = null;

        if (call) {
            const { name, args } = call.functionCall!;
            const functionArgs = args as any;
            let functionResponse: any;

            if (name === 'search_courses') {
                const { data } = await supabase
                    .from('courses')
                    .select('*')
                    .ilike('title', `%${functionArgs.query}%`)
                    .eq('is_published', true)
                    .limit(functionArgs.limit || 5);
                functionResponse = data;
            } else if (name === 'search_jobs') {
                const { data } = await supabase
                    .from('jobs')
                    .select('*')
                    .ilike('title', `%${functionArgs.query}%`)
                    .eq('is_published', true)
                    .limit(functionArgs.limit || 5);
                functionResponse = data;
            } else if (name === 'search_blog') {
                const { data } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .ilike('title', `%${functionArgs.query}%`)
                    .eq('is_published', true)
                    .limit(functionArgs.limit || 5);
                functionResponse = data;
            } else if (name === 'get_contact_info') {
                functionResponse = {
                    email: 'support@celorisdesigns.com',
                    website: 'https://www.celorisdesigns.com',
                    location: 'Remote / Virtual Offices',
                    description: 'Celoris is an AI-powered ecosystem for digital transformation, education, and social connectivity.',
                };
            }

            toolData = { type: name, results: functionResponse };

            // Start streaming the FINAL response after tool execution
            const streamingResult = await chat.sendMessageStream([
                {
                    functionResponse: {
                        name,
                        response: { content: functionResponse },
                    },
                },
            ]);

            return createStreamResponse(streamingResult.stream, toolData);
        } else {
            // No tool call, just stream the response directly
            // We need to re-send or use the result we already got?
            // To maintain speed, we'll start a fresh stream for the message.
            const streamingResult = await chat.sendMessageStream(lastMessage);
            return createStreamResponse(streamingResult.stream, null);
        }

    } catch (error: any) {
        console.error('Gemini Stream Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function initialUserPrompt(msg: string) {
    return msg;
}

function createStreamResponse(stream: any, toolData: any) {
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
        async start(controller) {
            // If we have tool data, send it as the first item
            if (toolData) {
                const dataStr = `__DATA__${JSON.stringify(toolData)}__END_DATA__\n`;
                controller.enqueue(encoder.encode(dataStr));
            }

            try {
                for await (const chunk of stream) {
                    const chunkText = chunk.text();
                    if (chunkText) {
                        controller.enqueue(encoder.encode(chunkText));
                    }
                }
            } catch (err) {
                console.error("Stream processing error:", err);
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
