import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Agora configuration
const AGORA_APP_ID = process.env.AGORA_APP_ID!
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE!

export async function POST(request: NextRequest) {
  try {
    const { channelName, uid, role } = await request.json()

    // Validate input
    if (!channelName || !uid) {
      return NextResponse.json(
        { error: 'Missing required parameters: channelName, uid' },
        { status: 400 }
      )
    }

    // Verify user is authorized (check if match exists)
    // Allow public interview rooms to bypass match verification
    if (!channelName.startsWith('interview_')) {
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', channelName)
        .or(`user1_id.eq.${uid},user2_id.eq.${uid}`)
        .maybeSingle()

      if (matchError) {
        console.error('Error verifying match:', matchError)
        return NextResponse.json(
          { error: 'Failed to verify authorization' },
          { status: 500 }
        )
      }

      if (!match) {
        return NextResponse.json(
          { error: 'Unauthorized: User not part of this match' },
          { status: 403 }
        )
      }
    }

    // For demo purposes, generate a simple token
    // In production, you would use Agora's token generator
    const generateToken = (channelName: string, uid: string, role: string) => {
      // This is a simplified token generation for demonstration
      // In production, use: const token = RtcTokenBuilder.buildTokenWithUid(
      //   AGORA_APP_ID, AGORA_APP_CERTIFICATE, channelName, parseInt(uid), 1, 3600
      // )

      const base64Token = Buffer.from(
        JSON.stringify({
          appId: AGORA_APP_ID,
          channelName: channelName,
          uid: parseInt(uid),
          role: role === 'publisher' ? 1 : 2,
          expireTime: Math.floor(Date.now() / 1000) + 3600 // 1 hour
        })
      ).toString('base64')

      return base64Token
    }

    const token = generateToken(channelName, uid, role)

    // Log the call initiation
    await supabase
      .from('call_logs')
      .insert({
        match_id: channelName,
        caller_id: uid,
        call_type: 'video',
        status: 'initiated'
      })

    return NextResponse.json({
      token,
      appId: AGORA_APP_ID,
      channelName,
      uid
    })

  } catch (error) {
    console.error('Agora token generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate token' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')
    const userId = searchParams.get('userId')

    if (!matchId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: matchId, userId' },
        { status: 400 }
      )
    }

    // Get call history for this match
    const { data: callLogs, error } = await supabase
      .from('call_logs')
      .select('*')
      .eq('match_id', matchId)
      .or(`caller_id.eq.${userId},callee_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching call history:', error)
      return NextResponse.json(
        { error: 'Failed to fetch call history' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      callLogs: callLogs || []
    })

  } catch (error) {
    console.error('Error fetching call history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch call history' },
      { status: 500 }
    )
  }
}