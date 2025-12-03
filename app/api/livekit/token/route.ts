import { AccessToken } from 'livekit-server-sdk';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const identity = searchParams.get('identity');
    const room = searchParams.get('room');

    if (!identity || !room) {
        return NextResponse.json({ error: 'Missing identity or room' }, { status: 400 });
    }

    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;

    if (!apiKey || !apiSecret) {
        return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    try {
        const at = new AccessToken(apiKey, apiSecret, { identity: identity });
        at.addGrant({ roomJoin: true, room: room });
        const token = await at.toJwt();

        return NextResponse.json({ token });
    } catch (error) {
        console.error('Error generating LiveKit token:', error);
        return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
    }
}
