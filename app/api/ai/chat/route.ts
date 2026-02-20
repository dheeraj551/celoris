import { NextRequest, NextResponse } from 'next/server';
import { createRouteClient } from '@/lib/supabase-server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

const tools: any[] = [
    {
        type: 'function',
        function: {
            name: 'search_courses',
            description: 'Search for educational courses available on the Celoris platform.',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'The search query or keyword (e.g., "physics", "react", "class 10").',
                    },
                    limit: {
                        type: 'number',
                        description: 'Maximum number of results to return (default 5).',
                    },
                },
                required: ['query'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'search_jobs',
            description: 'Search for job openings and career opportunities.',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'The job title, location, or skill (e.g., "software engineer", "mumbai").',
                    },
                    limit: {
                        type: 'number',
                        description: 'Maximum number of results to return (default 5).',
                    },
                },
                required: ['query'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'search_blog',
            description: 'Search for articles, news, and tutorials on the Celoris blog.',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'The topic or keyword (e.g., "ai trends", "how to study").',
                    },
                    limit: {
                        type: 'number',
                        description: 'Maximum number of results to return (default 5).',
                    },
                },
                required: ['query'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'get_contact_info',
            description: 'Get contact details for Celoris support and services.',
            parameters: {
                type: 'object',
                properties: {},
            },
        },
    },
];

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();
        const supabase = createRouteClient();

        if (!process.env.GROQ_API_KEY) {
            console.error("GROQ_API_KEY is missing from environment variables.");
            return new Response("Error: GROQ_API_KEY is not configured on the server. Please add it to your environment variables.", { status: 500 });
        }

        // Format messages for Groq
        const groqMessages = messages.map((m: any) => ({
            role: m.role,
            content: m.content,
        }));

        // Step 1: Tool detection
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            tools: tools,
            tool_choice: "auto",
            max_tokens: 1024,
        });

        const responseMessage = completion.choices[0].message;
        const toolCalls = responseMessage.tool_calls;

        if (toolCalls && toolCalls.length > 0) {
            const toolCall = toolCalls[0]; // Take the first one for now
            const { name } = toolCall.function;
            const args = JSON.parse(toolCall.function.arguments);
            let functionResponse: any;

            if (name === 'search_courses') {
                const { data } = await supabase
                    .from('courses')
                    .select('*')
                    .ilike('title', `%${args.query}%`)
                    .eq('is_published', true)
                    .limit(args.limit || 5);
                functionResponse = data;
            } else if (name === 'search_jobs') {
                const { data } = await supabase
                    .from('jobs')
                    .select('*')
                    .ilike('title', `%${args.query}%`)
                    .eq('is_published', true)
                    .limit(args.limit || 5);
                functionResponse = data;
            } else if (name === 'search_blog') {
                const { data } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .ilike('title', `%${args.query}%`)
                    .eq('is_published', true)
                    .limit(args.limit || 5);
                functionResponse = data;
            } else if (name === 'get_contact_info') {
                functionResponse = {
                    email: 'support@celorisdesigns.com',
                    website: 'https://www.celorisdesigns.com',
                    location: 'Remote / Virtual Offices',
                    description: 'Celoris is an AI-powered ecosystem for digital transformation, education, and social connectivity.',
                };
            }

            const toolData = { type: name, results: functionResponse };

            // Step 2: Final response with tool results (Streaming)
            const secondResponseMessages = [
                ...groqMessages,
                responseMessage,
                {
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: name,
                    content: JSON.stringify(functionResponse),
                }
            ];

            const stream = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: secondResponseMessages,
                stream: true,
            });

            return createStreamResponse(stream, toolData);
        } else {
            // No tool call, just stream directly
            const stream = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: groqMessages,
                stream: true,
            });
            return createStreamResponse(stream, null);
        }

    } catch (error: any) {
        console.error('Groq Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function createStreamResponse(stream: any, toolData: any) {
    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
        async start(controller) {
            if (toolData) {
                const dataStr = `__DATA__${JSON.stringify(toolData)}__END_DATA__\n`;
                controller.enqueue(encoder.encode(dataStr));
            }

            try {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) {
                        controller.enqueue(encoder.encode(content));
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
