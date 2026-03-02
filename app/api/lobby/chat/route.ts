
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClientForServer } from "@/lib/supabase-client";
import { generateBotResponse, LOBBY_BOTS, selectBotForResponse } from "@/lib/lobby-bots";

// Global in-memory store for rudimentary rate limiting (Not perfect in serverless but helps)
// In Vercel/Serverless, this might reset, but it's better than nothing.
// Ideally, use Redis or DB. For this scale, we'll rely on client-side cooldowns + reasonable chance.
const RECENT_BOT_MESSAGES: number[] = [];


export async function POST(req: NextRequest) {
    // 1. Diagnostics & Key Check
    if (!process.env.GOOGLE_GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
        console.error("[LobbyBot] Missing Gemini API Key");
        return NextResponse.json({ error: "Configuration Error: Missing API Key" }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { message, history, triggerType, user } = body;

        console.log(`[LobbyBot] Request: ${triggerType} from ${user?.name}`);

        const now = Date.now();
        // Limit: Max 1 message every 10s roughly
        // Remove old entries from RECENT_BOT_MESSAGES
        while (RECENT_BOT_MESSAGES.length > 0 && RECENT_BOT_MESSAGES[0] < now - 10000) {
            RECENT_BOT_MESSAGES.shift();
        }

        if (RECENT_BOT_MESSAGES.length > 0 && RECENT_BOT_MESSAGES[RECENT_BOT_MESSAGES.length - 1] > now - 10000) {
            // Too soon for a bot to speak
            console.log("Bot rate limit hit");
            return NextResponse.json({ skipped: true, reason: "rate_limit" });
        }

        // Probability Check (Not every user message needs a reply)
        // Set to 0.7 chance to reply (30% skip)
        if (triggerType === 'response' && Math.random() > 0.7) {
            console.log("Bot decided to skip response (chance)");
            return NextResponse.json({ skipped: true, reason: "chance" });
        }

        // 2. Select Bot & Generate
        const bot = selectBotForResponse(history || [], triggerType);

        const historyText = (history || [])
            .map((m: any) => `${m.sender.name}: ${m.content}`)
            .join("\n");

        console.log(`[LobbyBot] Asking ${bot.name} (Gemini)...`);
        const aiResponse = await generateBotResponse(bot, message || "", historyText, triggerType);

        if (!aiResponse) {
            console.error("[LobbyBot] Gemini returned null/empty");
            return NextResponse.json({ skipped: true, reason: "ai_failed" });
        }

        console.log(`[LobbyBot] Generated: "${aiResponse.substring(0, 50)}..."`);

        const botMessage = {
            id: crypto.randomUUID(),
            sender: {
                id: bot.id,
                name: bot.name,
                avatar_url: bot.avatar_url,
                is_verified: true,
                is_bot: true
            },
            content: aiResponse.trim(),
            timestamp: Date.now(),
            type: 'text'
        };

        // 3. Attempt Broadcast (Best Effort)
        // We wrap this in a separate try/catch so it never crashes the response
        try {
            const supabase = createSupabaseClientForServer();
            const channel = supabase.channel('room:lobby');

            console.log("[LobbyBot] Broadcasting via Socket...");

            // Short timeout broadcast attempt
            await new Promise<void>((resolve) => {
                let resolved = false;

                channel.subscribe(async (status: any) => {
                    if (status === 'SUBSCRIBED' && !resolved) {
                        await channel.send({
                            type: 'broadcast',
                            event: 'message',
                            payload: botMessage
                        });
                        if (!resolved) {
                            resolved = true;
                            // Clean up
                            supabase.removeChannel(channel);
                            resolve();
                        }
                    }
                });

                // 3s Timeout - proceed if socket hangs
                setTimeout(() => {
                    if (!resolved) {
                        console.warn("[LobbyBot] Broadcast timed out (proceeding with fallback)");
                        resolved = true;
                        resolve();
                    }
                }, 3000);
            });
        } catch (broadcastError) {
            console.error("[LobbyBot] Broadcast failed (harmless):", broadcastError);
        }

        RECENT_BOT_MESSAGES.push(Date.now());

        // 4. Return Data to Client (Primary Method)
        return NextResponse.json({
            success: true,
            message: botMessage,
            via: "api_response"
        });

    } catch (e: any) {
        console.error("[LobbyBot] Fatal Error:", e);
        return NextResponse.json({ error: "Internal Server Error", details: e.message }, { status: 500 });
    }
}

