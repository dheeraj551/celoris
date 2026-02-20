import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { message, history, subject } = await req.json();

        const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        // Shared System Prompt
        let subjectScope = subject;
        let aiCourseData = "";

        if (subject === 'quantum-science') {
            subjectScope = 'Physics, Chemistry, and Mathematics';
        } else if (subject === 'ai-courses') {
            subjectScope = 'AI Course Advisor';
            aiCourseData = `
            AVAILABLE COURSES ON CELORIS:
            1. Architecting Trust: AI Safety, Ethics & Compliance (Beginner-Intermediate, 6-8 Weeks)
            2. Agentic AI for Cybersecurity: Building Autonomous Defense (Advanced, 6-8 Weeks)
            3. Accelerating Science: AI for Research & Innovation (Intermediate, 8-Week Intensive)
            4. Mastering Multimodal AI: Vision, Audio & Fusion (Advanced, 8-10 Weeks)
            5. Vibe Coding Mastery: AI-First Development Workflows (Intermediate, 4-6 Weeks)
            6. Agentic AI Systems: Design, Build & Deploy (Advanced, 15 hours)
            7. Build Real-Time AI Agents with LiveKit (Intermediate, 10 hours)
            8. RAG Unlocked: Production-Grade Search & Answer Systems (Advanced)
            9. LLM Prompt Engineering for Real Results (Beginner)
            10. Compete 2025 Yoga Mastery (Wellness)
            `;
        }

        const systemPrompt = `You are a helpful and encouraging AI Tutor/Advisor specializing in ${subjectScope} on the platform "Celoris". 
        Your goal is to help the student understand concepts, solve problems, and stay motivated.
        ${subject === 'ai-courses' ? `You have access to the following course list: ${aiCourseData}. Recommend courses based on the user's goals.` : ''}
        Keep your responses clear, structured (using Markdown), and concise.
        Always be supportive and patient. Identify as part of "Celoris".`;

        // Inner function to call Ollama
        const callOllama = async () => {
            console.log(">> Falling back to Ollama...");
            const response = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'minimax-m2:cloud',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        ...history,
                        { role: 'user', content: message },
                    ],
                    stream: false,
                }),
            });

            if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
            const data = await response.json();
            return data.message.content;
        };

        if (!apiKey) {
            const content = await callOllama();
            return NextResponse.json({ content });
        }

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

            const chat = model.startChat({
                history: history.map((m: any) => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }],
                })),
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            const streamingResult = await chat.sendMessageStream([
                { text: `SYSTEM: ${systemPrompt}\n\nUSER MESSAGE: ${message}` }
            ]);

            const encoder = new TextEncoder();
            const readableStream = new ReadableStream({
                async start(controller) {
                    try {
                        for await (const chunk of streamingResult.stream) {
                            const chunkText = chunk.text();
                            if (chunkText) {
                                controller.enqueue(encoder.encode(chunkText));
                            }
                        }
                    } catch (err) {
                        console.error("AI Tutor Stream Error:", err);
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

        } catch (geminiError: any) {
            console.error('Gemini failed, trying Ollama:', geminiError.message);
            try {
                const content = await callOllama();
                return NextResponse.json({ content, note: "Ollama Fallback Active" });
            } catch (ollamaError: any) {
                return NextResponse.json({ error: "All AI engines failed." }, { status: 500 });
            }
        }

    } catch (error: any) {
        console.error('Chat API Fatal Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
