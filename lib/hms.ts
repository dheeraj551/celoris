
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const HMS_ACCESS_KEY = process.env.HMS_ACCESS_KEY;
const HMS_SECRET_KEY = process.env.HMS_SECRET_KEY;

// Generate a management token dynamically so it never expires (auto-refreshed)
export function getManagementToken() {
    if (!HMS_ACCESS_KEY || !HMS_SECRET_KEY) {
        throw new Error("HMS Credentials (ACCESS_KEY or SECRET_KEY) missing");
    }

    const payload = {
        access_key: HMS_ACCESS_KEY,
        type: "management",
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
        // Valid for 24 hours is enough for temporary operations
        exp: Math.floor(Date.now() / 1000) + (24 * 3600),
        jti: uuidv4()
    };

    return jwt.sign(payload, HMS_SECRET_KEY, { algorithm: "HS256" });
}

export async function getOrCreateRoom(name: string) {
    const managementToken = getManagementToken();

    // 1. Try to find the room first
    const listResponse = await fetch("https://api.100ms.live/v2/rooms", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${managementToken}`,
            "Content-Type": "application/json",
        },
        // We can't query by name easily, so we have to list.
        // Optimization: Cache this or use a DB map. For now, fetch is okay for low volume.
        cache: 'no-store'
    });

    if (!listResponse.ok) {
        console.error("Failed to list rooms:", await listResponse.text());
        throw new Error("Failed to list rooms");
    }

    const listData = await listResponse.json();
    // 100ms returns data: [...]
    const existingRoom = listData.data?.find((room: any) => room.name === name);

    if (existingRoom) {
        return existingRoom.id;
    }

    // 2. Create if not found
    const createResponse = await fetch("https://api.100ms.live/v2/rooms", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${managementToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: name,
            description: `Study Room for ${name}`,
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

export function generateAppToken(roomId: string, userId: string, role: string = "host") {
    if (!HMS_ACCESS_KEY || !HMS_SECRET_KEY) {
        throw new Error("HMS Credentials missing");
    }

    const payload = {
        access_key: HMS_ACCESS_KEY,
        room_id: roomId,
        user_id: userId,
        role: role,
        type: "app",
        version: 2,
    };

    const token = jwt.sign(payload, HMS_SECRET_KEY, {
        expiresIn: "24h",
        algorithm: "HS256",
        jwtid: uuidv4(),
    });

    return token;
}
