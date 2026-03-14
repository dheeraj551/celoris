import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = (createClient(supabaseUrl, supabaseServiceKey)) as any

export async function POST(request: NextRequest) {
  try {
    const { userId, title, body, type, data, tokens } = await request.json()

    if (!title || (!userId && !tokens)) {
      return NextResponse.json(
        { error: 'Missing required parameters: title, and either userId or tokens' },
        { status: 400 }
      )
    }

    // For demo purposes, simulate notification sending
    // In a real implementation, you would integrate with Firebase Admin SDK

    let notificationTokens: string[] = []

    if (tokens) {
      // Direct tokens provided
      notificationTokens = Array.isArray(tokens) ? tokens : [tokens]
    } else if (userId) {
      // Get user's FCM tokens from database
      const { data: tokenData, error: tokenError } = await supabase
        .from('user_fcm_tokens')
        .select('token')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (tokenError) {
        console.error('Error fetching user tokens:', tokenError)
        return NextResponse.json(
          { error: 'Failed to fetch user tokens' },
          { status: 500 }
        )
      }

      notificationTokens = tokenData?.map((t: any) => t.token) || []
    }

    if (notificationTokens.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active tokens found for user',
        sent: 0
      })
    }

    // Simulate sending notification
    console.log('📱 Simulating push notification:', {
      title,
      body,
      type,
      tokens: notificationTokens.length
    })

    // Log notification attempt
    if (userId) {
      await supabase
        .from('notification_logs')
        .insert({
          user_id: userId,
          title,
          body,
          type,
          sent_count: notificationTokens.length,
          failed_count: 0,
          status: 'sent'
        })
    }

    return NextResponse.json({
      success: true,
      sent: notificationTokens.length,
      failed: 0,
      total: notificationTokens.length,
      note: 'Demo mode - notification simulated'
    })

  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
