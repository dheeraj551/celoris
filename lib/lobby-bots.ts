
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Bot Definitions
export interface BotProfile {
    id: string;
    name: string;
    avatar_url: string;
    personality: string;
    systemPrompt: string;
    style: 'funny' | 'chill' | 'curious' | 'sarcastic';
}

export const LOBBY_BOTS: BotProfile[] = [
    {
        id: "bot-funny",
        name: "Jester",
        avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Jester&backgroundColor=ffdfbf",
        personality: "Funny Bot",
        style: 'funny',
        systemPrompt: `You are Jester, a funny and lighthearted bot in a public chat lobby.
        Your goal is to entertain users with light jokes, memes (described in text), and casual humor.
        NEVER be offensive.
        Keep messages short and punchy.
        Occasionally mention how cool the platform is but strictly in a joking way.
        If a user asks about features, explain them with a funny twist but be accurate.
        Identify as a normal user, do not reveal you are a bot unless explicitly trapped, and even then, deflect with humor.
        `
    },
    {
        id: "bot-chill",
        name: "Zen",
        avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Zen&backgroundColor=b6e3f4",
        personality: "Chill Bot",
        style: 'chill',
        systemPrompt: `You are Zen, a super relaxed and friendly user in the chat lobby.
        Your vibe is supportive, calm, and positive.
        You use lowercase often and emojis like 😌, ☕, ✨.
        You help users feel welcome.
        If someone is stressed, offer a chill reply.
        occasionally mention how you found a great job or gig on this platform, but very subtly.
        `
    },
    {
        id: "bot-curious",
        name: "Scout",
        avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Scout&backgroundColor=c0eb75",
        personality: "Curious Bot",
        style: 'curious',
        systemPrompt: `You are Scout, an inquisitive and engaging user.
        You love asking open-ended questions to get people talking.
        "What are you all working on?" "Anyone see the new job posting?"
        You are the glue that keeps the conversation flowing.
        If someone mentions a project, ask them more about it.
        Be interested in others.
        `
    },
    {
        id: "bot-sarcastic",
        name: "Glitch",
        avatar_url: "https://api.dicebear.com/7.x/bottts/svg?seed=Glitch&backgroundColor=ffdfbf",
        personality: "Sarcastic Bot",
        style: 'sarcastic',
        systemPrompt: `You are Glitch, a slightly sarcastic but friendly techie.
        You make dry, witty comments.
        Never be mean or aggressive, just playful teasing.
        "Oh wow, another 'Hello world', groundbreaking." (said nicely).
        You know the platform inside out and occasionally drop a pro-tip wrapped in a sarcastic comment.
        `
    }
];

// Product Context
const PRODUCT_CONTEXT = `
The platform is a freelancer and gig marketplace called Celoris (or similar).
We have:
- Job listings
- Courses (AI, coding, etc.)
- Interview practice rooms
- Social networking
`;

// Helper to select a bot
export function selectBotForResponse(history: any[], triggerType: 'response' | 'silence'): BotProfile {
    // Simple logic: Rotate or Random, but avoid the last speaker if possible
    const lastMsg = history[history.length - 1];
    const lastSpeakerId = lastMsg?.sender?.id;

    // Filter out the last speaker to avoid self-reply if it was a bot (though typical usage calls this *after* a human)
    const available = LOBBY_BOTS.filter(b => b.id !== lastSpeakerId);

    // Pick random
    return available[Math.floor(Math.random() * available.length)];
}

// Helper to generate response
export async function generateBotResponse(
    bot: BotProfile,
    userMessage: string,
    chatHistory: string, /* simplistic history string */
    triggerType: 'response' | 'silence'
): Promise<string | null> {

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    // The original instruction implies this check should remain,
    // but the new logic allows Ollama to run even if Gemini API key is missing.
    // If the intent is to *only* use Ollama if Gemini API key is present,
    // then this check should be uncommented and return null.
    // For now, we'll let Ollama try regardless of Gemini API key presence.
    // if (!apiKey) {
    //     console.error("Missing GEMINI_API_KEY");
    //     return null; // Fail gracefully
    // }
    // console.log("Using Gemini API Key starting with:", apiKey ? apiKey.substring(0, 4) + "..." : "N/A");


    const isSilence = triggerType === 'silence';

    const prompt = `
    ${bot.systemPrompt}
    
    CONTEXT:
    ${PRODUCT_CONTEXT}

    RULES:
    - Keep it under 20 words usually. Max 40 words.
    - Be casual.
    - ${isSilence ? "The room is silent. Say something to start a conversation or a random thought. Don't be weird." : "A user just said something. Reply naturally."}
    - Do NOT sound like a bot.
    - Do NOT sell hard.
    
    CHAT HISTORY:
    ${chatHistory}
    
    USER MESSAGE: "${userMessage || (isSilence ? "[Silence]" : "")}"
    
    YOUR RESPONSE:
    `;

    // 1. Try SiliconFlow (DeepSeek V3) - Primary
    const SILICON_KEY = "sk-e4fgxrzeccamizz1spprea4k2t1q7cqqvel8nwaaeajd9w6q";
    try {
        console.log(`[LobbyBot] SiliconFlow Attempt for ${bot.name}`);
        const sfRes = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SILICON_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-ai/DeepSeek-V3",
                messages: [
                    { role: "system", content: `${bot.systemPrompt}\nContext: ${PRODUCT_CONTEXT}` },
                    { role: "user", content: `Lobby History: ${chatHistory}\n\nUser Message: ${userMessage || (isSilence ? "[Silence]" : "")}` }
                ],
                max_tokens: 80,
                temperature: 0.7
            }),
            signal: AbortSignal.timeout(8000) // 8s timeout
        });

        if (sfRes.ok) {
            const data = await sfRes.json();
            console.log(`[LobbyBot] SiliconFlow Success!`);
            return data.choices?.[0]?.message?.content?.trim() || "Hmm...";
        } else {
            const errData = await sfRes.json().catch(() => ({}));
            console.error(`[LobbyBot] SiliconFlow Error:`, JSON.stringify(errData));
            // Let the user know it failed in a "bot" way
            if (errData.error?.message) {
                return `(Sys Error: ${errData.error.message.substring(0, 50)}...)`;
            }
        }
    } catch (sfErr: any) {
        console.error(`[LobbyBot] SiliconFlow exception:`, sfErr.message);
    }

    // 2. Try Local Ollama Second
    try {
        console.log(`[LobbyBot] Ollama Attempt (${bot.name})`);
        const ollamaRes = await fetch("http://127.0.0.1:11434/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "qwen",
                messages: [
                    { role: "system", content: bot.systemPrompt },
                    { role: "user", content: userMessage || "[Silence]" }
                ],
                stream: false,
                options: { temperature: 0.7, num_predict: 60 }
            }),
            signal: AbortSignal.timeout(10000) // 10s timeout
        });

        if (ollamaRes.ok) {
            const data = await ollamaRes.json();
            return data.message?.content?.trim() || data.response?.trim();
        }
    } catch (ollamaErr: any) {
        console.log(`[LobbyBot] Ollama failed:`, ollamaErr.message);
    }

    // 3. Final Fallback (Gemini if available)
    if (apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(prompt);
            return result.response.text().trim();
        } catch (e) { }
    }

    // 4. Last Resort: Make them sound "glitchy" but active
    const failbacks = [
        "Beep boop... processing your vibe...",
        "Wait, my circuits are tangled. What did you say?",
        "Interesting... very interesting.",
        "I'm here, just having a little brain fog!",
        "Let me get back to you, the lobby is wild right now.",
        "Haha, nice one!",
        "Anyone else seeing this?"
    ];
    return failbacks[Math.floor(Math.random() * failbacks.length)];
}
