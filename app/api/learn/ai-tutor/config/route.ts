import { NextResponse } from 'next/server';

export async function GET() {
    // In a real app, you would verify the user session here
    return NextResponse.json({
        apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY
    });
}
