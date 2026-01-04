import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
    try {
        const { message, history, subject } = await req.json();

        const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

        // Shared System Prompt
        const systemPrompt = `You are a helpful and encouraging AI ${subject} Tutor on the platform "Celoris". 
        Your goal is to help the student understand concepts, solve problems, and stay motivated.
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
            // Attempt Gemini with the exact model from your AI Studio
            const genAI = new GoogleGenerativeAI(apiKey);

            // Note: We use gemini-1.5-flash which is generally the most stable.
            // If the SDK defaults to v1beta and fails, we'll catch it and go to Ollama.
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

            const result = await chat.sendMessage([
                { text: `SYSTEM: ${systemPrompt}\n\nUSER MESSAGE: ${message}` }
            ]);
            const responseText = result.response.text();

            return NextResponse.json({ content: responseText });

        } catch (geminiError: any) {
            console.error('Gemini failed, trying Ollama:', geminiError.message);
            // If Gemini fails (Quota, 404, etc.), silently fallback to Ollama
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
