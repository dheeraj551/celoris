export async function fetchLiveKitToken(identity: string, room: string) {
    const endpoint = `/api/livekit/token?identity=${identity}&room=${room}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("Failed to fetch LiveKit token");
    return res.json();
}
