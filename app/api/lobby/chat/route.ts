
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClientForServer } from "@/lib/supabase-client";
import { generateBotResponse, LOBBY_BOTS, selectBotForResponse } from "@/lib/lobby-bots";

// Global in-memory store for rudimentary rate limiting (Not perfect in serverless but helps)
// In Vercel/Serverless, this might reset, but it's better than nothing.
// Ideally, use Redis or DB. For this scale, we'll rely on client-side cooldowns + reasonable chance.
const RECENT_BOT_MESSAGES: number[] = [];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history, triggerType, user } = body; // user is the sender

        // 1. Basic Validation
        if (!triggerType) return NextResponse.json({ error: "Missing triggerType" }, { status: 400 });

        // 2. Rate Limit / Logic Check
        const now = Date.now();
        // Clean up old timestamps (> 2 mins)
        while (RECENT_BOT_MESSAGES.length > 0 && RECENT_BOT_MESSAGES[0] < now - 120000) {
            RECENT_BOT_MESSAGES.shift();
        }

        // Limit: Max 1 message every 30s roughly
        if (RECENT_BOT_MESSAGES.length > 0 && RECENT_BOT_MESSAGES[RECENT_BOT_MESSAGES.length - 1] > now - 20000) {
            // Too soon for a bot to speak
            console.log("Bot rate limit hit");
            return NextResponse.json({ skipped: true, reason: "rate_limit" });
        }

        // Probability Check (Not every user message needs a reply)
        // If trigger is 'response', maybe 40% chance?
        // If trigger is 'silence', 100% chance (since client decided strictly)
        if (triggerType === 'response' && Math.random() > 0.9) {
            console.log("Bot decided to skip response (chance)");
            return NextResponse.json({ skipped: true, reason: "chance" });
        }

        // 3. Select Bot
        const bot = selectBotForResponse(history || [], triggerType);

        // 4. Generate AI Response
        // Format history for AI
        const historyText = (history || [])
            .map((m: any) => `${m.sender.name}: ${m.content}`)
            .join("\n");

        const aiResponse = await generateBotResponse(bot, message || "", historyText, triggerType);

        if (!aiResponse) {
            return NextResponse.json({ skipped: true, reason: "ai_failed" });
        }

        // 5. Broadcast Message via Supabase Admin
        const supabase = createSupabaseClientForServer();

        const botMessage = {
            id: crypto.randomUUID(),
            sender: {
                id: bot.id,
                name: bot.name,
                avatar_url: bot.avatar_url,
                is_verified: true, // Bots look verified
                is_bot: true
            },
            content: aiResponse.trim(),
            timestamp: Date.now(),
            type: 'text'
        };

        const channel = supabase.channel('room:lobby');
        // Note: In server-side, we can publish directly if we have the channel ref, 
        // but 'channel.send' requires being subscribed? 
        // Supabase REST API for Realtime is 'POST /v1/realtime' but the JS SDK handles it if we connect.
        // However, connecting in a serverless route is slow/flaky.
        // BETTER WAY: Use the `supabase.realtime` (REST) or just rely on the fact the JS SDK socket might work if we wait.
        // Actually, the standard way in Supabase Serverless to broadcast:

        await channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
                await channel.send({
                    type: 'broadcast',
                    event: 'message',
                    payload: botMessage
                });
                // We need to unsubscribe/disconnect to let the lambda finish?
                // Usually await send is enough.
                // channel.unsubscribe(); 
            }
        });

        // Wait a tiny bit for the socket to flush? 
        // The `subscribe` callback might not run fast enough in the lambda lifetime if we don't await properly.
        // The `subscribe` method is async in v2? No, `subscribe(callback)` returns Subscription.
        // `subscribe()` (no args) returns channel but async behavior on connection.

        // Alternative: The standard JS SDK might be tricky in pure Edge functions for *sending* if connection takes time.
        // But let's try this. If it fails, we might need a dedicated "send" helper using fetch.
        // Re-reading docs: `channel.send` is the way. We assume it connects fast.

        // Actually, to ensure it works, we wrap it:
        await new Promise<void>((resolve, reject) => {
            const tempChannel = supabase.channel('room:lobby');
            tempChannel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await tempChannel.send({
                        type: 'broadcast',
                        event: 'message',
                        payload: botMessage
                    });
                    await supabase.removeChannel(tempChannel);
                    resolve();
                } else if (status === 'CHANNEL_ERROR') {
                    reject("Channel Error");
                }
            });
            // Timeout safety
            setTimeout(() => {
                supabase.removeChannel(tempChannel);
                resolve(); // resolve anyway to not crash caller
            }, 2000);
        });

        RECENT_BOT_MESSAGES.push(now);

        return NextResponse.json({ success: true, message: botMessage });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
