import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { RtcTokenBuilder, RtcRole } from 'agora-token'
import { createRouteClient } from '@/lib/supabase-server'
import { resolveRoomAccess, roomIdFromClassroomChannel } from '@/lib/cafe-room-access'

// Initialize Supabase client for server-side operations
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Agora configuration
// Trim to ensure no accidental whitespace from copy-paste causes "invalid vendor key"
const AGORA_APP_ID = (process.env.AGORA_APP_ID || '').trim()
const AGORA_APP_CERTIFICATE = (process.env.AGORA_APP_CERTIFICATE || '').trim()

console.log('Agora Token Route Init:')
console.log('AGORA_APP_ID:', AGORA_APP_ID ? `Present (starts with ${AGORA_APP_ID.substring(0, 4)}..., length: ${AGORA_APP_ID.length})` : 'MISSING')
console.log('AGORA_APP_CERTIFICATE:', AGORA_APP_CERTIFICATE ? 'Present' : 'MISSING')

if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
  console.error('CRITICAL: Agora environment variables are missing or empty')
}

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
    if (!channelName.startsWith('interview_') && !channelName.startsWith('classroom_')) {
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

    // Café classrooms (3D room + whiteboard room): the caller must be
    // signed in, can only get a token for their OWN uid, must actually be
    // admitted to the room, and only the room's trainer gets a publisher
    // token. Previously anyone — even logged out — could mint a publisher
    // token for any classroom as any user id.
    let roleNum = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER
    if (channelName.startsWith('classroom_')) {
      const roomId = roomIdFromClassroomChannel(channelName)
      if (!roomId) {
        return NextResponse.json({ error: 'Invalid classroom channel' }, { status: 400 })
      }

      const routeClient = await createRouteClient()
      const { data: { user }, error: authError } = await routeClient.auth.getUser()
      if (authError || !user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
      }
      if (String(uid) !== user.id) {
        return NextResponse.json({ error: 'Token uid must match the signed-in user' }, { status: 403 })
      }

      const access = await resolveRoomAccess(supabase, roomId, user.id)
      if (!access.roomExists || access.role === 'none') {
        return NextResponse.json({ error: 'Not admitted to this classroom' }, { status: 403 })
      }
      if (!access.legacy) {
        roleNum = access.role === 'trainer' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER
      }
    }

    // Generate Token
    const expireTime = 3600 // 1 hour
    const currentTime = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTime + expireTime

    console.log(`Generating token for Channel: ${channelName}, UID: ${uid}, Role: ${roleNum}`)

    // Use buildTokenWithUid for numeric UIDs or buildTokenWithUserAccount for string UIDs
    // Since we are using Supabase UUIDs, we MUST use buildTokenWithUserAccount (String UID)
    // Signature: appId, appCertificate, channelName, account, role, tokenExpire, privilegeExpire
    const token = RtcTokenBuilder.buildTokenWithUserAccount(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channelName,
      uid.toString(),
      roleNum,
      privilegeExpiredTs,
      privilegeExpiredTs
    )

    // Log the call initiation
    // Log the call initiation only for standard matches (where channelName is a UUID match_id)
    if (!channelName.startsWith('interview_') && !channelName.startsWith('classroom_')) {
      await supabase
        .from('call_logs')
        .insert({
          match_id: channelName,
          caller_id: uid,
          call_type: 'video',
          status: 'initiated'
        })
    }

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
