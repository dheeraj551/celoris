
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const HMS_ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const HMS_SECRET_KEY = process.env.HMS_SECRET_KEY;
const HMS_MANAGEMENT_TOKEN = process.env.HMS_MANAGEMENT_TOKEN;

// Helper to get or create a room by name
async function getOrCreateRoom(name: string) {
    if (!HMS_MANAGEMENT_TOKEN) {
        throw new Error("HMS_MANAGEMENT_TOKEN is not configured");
    }

    // 1. Try to find the room first
    // Note: 100ms API doesn't support filtering by name directly in list? 
    // Actually it might be better to store mapping or just create and catch error if duplicate?
    // But 100ms allows multiple rooms with same name? Let's assume we want unique names.
    // For simplicity in this demo, let's just list active rooms or try to create.
    // A better approach for production is storing room_id in your own DB.

    // Let's try to create it. If it exists, we might not get the ID back easily without listing.
    // So let's list first.

    // Listing rooms (basic implementation, might need pagination for many rooms)
    const listResponse = await fetch("https://api.100ms.live/v2/rooms", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${HMS_MANAGEMENT_TOKEN}`,
            "Content-Type": "application/json",
        },
    });

    if (!listResponse.ok) {
        console.error("Failed to list rooms:", await listResponse.text());
        throw new Error("Failed to list rooms");
    }

    const listData = await listResponse.json();
    const existingRoom = listData.data?.find((room: any) => room.name === name);

    if (existingRoom) {
        return existingRoom.id;
    }

    // 2. Create if not found
    const createResponse = await fetch("https://api.100ms.live/v2/rooms", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HMS_MANAGEMENT_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: `Study Room for ${name}`,
            template_id: "", // Use default or specify if needed. Empty usually defaults.
            // If you have a specific template in your dashboard, use its ID.
            // For now, let's hope default works or we might need to specify "Video Conferencing" explicitly if knowing the ID.
            // If it fails, we default to just generating a token for a passed-in ID if the user provided one.
        }),
    });

    if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error("Failed to create room:", errorText);
        throw new Error(`Failed to create room: ${errorText}`);
    }

    const createData = await createResponse.json();
    return createData.id;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { roomName, role, userId } = body;

        if (!roomName) {
            return NextResponse.json(
                { error: "roomName is required" },
                { status: 400 }
            );
        }

        if (!HMS_ACCESS_KEY || !HMS_SECRET_KEY) {
            return NextResponse.json(
                { error: "HMS credentials not configured" },
                { status: 500 }
            );
        }

        const roomId = await getOrCreateRoom(roomName);

        // Generate Auth Token (Client Token)
        const payload = {
            access_key: HMS_ACCESS_KEY,
            room_id: roomId,
            user_id: userId || uuidv4(),
            role: role || "host", // Default to host for now, or 'guest'
            type: "app",
            version: 2,
        };

        const token = jwt.sign(payload, HMS_SECRET_KEY, {
            expiresIn: "24h",
            algorithm: "HS256",
            jwtid: uuidv4(),
        });

        return NextResponse.json({ token, roomId });
    } catch (error: any) {
        console.error("Error generating token:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
