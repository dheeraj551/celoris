import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, Tool, SchemaType } from '@google/generative-ai';
import { createRouteClient } from '@/lib/supabase-server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

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

        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
            tools: tools,
        });

        const chat = model.startChat({
            history: messages.slice(0, -1).map((m: any) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }],
            })),
        });

        const lastMessage = messages[messages.length - 1].content;
        let result = await chat.sendMessage(lastMessage);
        let response = result.response;
        let call = response.candidates?.[0].content.parts.find((p) => p.functionCall);

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

            // Send the function result back to Gemini
            result = await chat.sendMessage([
                {
                    functionResponse: {
                        name,
                        response: { content: functionResponse },
                    },
                },
            ]);
            response = result.response;
        }

        const text = response.text();

        return NextResponse.json({
            role: 'assistant',
            content: text,
            data: call ? { type: call.functionCall!.name, results: (result as any)._response?.candidates?.[0]?.content?.parts?.[0]?.functionResponse?.response?.content } : null,
        });
    } catch (error: any) {
        console.error('Gemini Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
