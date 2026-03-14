import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Register FCM token
export async function POST(request: NextRequest) {
  try {
    const { token, userId, platform } = await request.json()

    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: token, userId' },
        { status: 400 }
      )
    }

    // Store token in database
    const { error } = await supabase
      .from('user_fcm_tokens')
      .upsert({
        user_id: userId,
        token,
        platform: platform || 'web',
        is_active: true,
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error storing FCM token:', error)
      return NextResponse.json(
        { error: 'Failed to store token' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token registered successfully'
    })

  } catch (error) {
    console.error('Error registering FCM token:', error)
    return NextResponse.json(
      { error: 'Failed to register token' },
      { status: 500 }
    )
  }
}

// Unregister FCM token
export async function DELETE(request: NextRequest) {
  try {
    const { token, userId } = await request.json()

    if (!token || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: token, userId' },
        { status: 400 }
      )
    }

    // Mark token as inactive
    const { error } = await supabase
      .from('user_fcm_tokens')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('token', token)

    if (error) {
      console.error('Error deactivating FCM token:', error)
      return NextResponse.json(
        { error: 'Failed to deactivate token' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Token deactivated successfully'
    })

  } catch (error) {
    console.error('Error deactivating FCM token:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate token' },
      { status: 500 }
    )
  }
}
