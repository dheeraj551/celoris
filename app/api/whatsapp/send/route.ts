import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// WhatsApp configuration
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN

export async function POST(request: NextRequest) {
  try {
    const { phone, message, userId, isTest } = await request.json()

    if (!phone || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters: phone, message' },
        { status: 400 }
      )
    }

    // Format phone number (remove + and ensure it's digits only)
    const formattedPhone = phone.replace(/\D/g, '')

    // Check if WhatsApp is configured
    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      console.log('WhatsApp not configured - simulating message send')
      
      // For demo purposes, simulate a successful send
      const mockMessageId = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Log the message attempt
      await logWhatsAppMessage({
        phone: formattedPhone,
        message,
        userId,
        status: 'mock_sent',
        messageId: mockMessageId,
        isTest
      })

      return NextResponse.json({
        success: true,
        messageId: mockMessageId,
        status: 'mock_sent',
        note: 'WhatsApp integration not configured - message simulated'
      })
    }

    try {
      // Send WhatsApp message via Graph API
      const whatsappUrl = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`
      
      const response = await fetch(whatsappUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: formattedPhone,
          type: 'text',
          text: {
            body: message
          }
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to send WhatsApp message')
      }

      const messageId = data.messages?.[0]?.id

      // Log successful message
      await logWhatsAppMessage({
        phone: formattedPhone,
        message,
        userId,
        status: 'sent',
        messageId,
        isTest
      })

      return NextResponse.json({
        success: true,
        messageId,
        status: 'sent',
        whatsappResponse: data
      })

    } catch (whatsappError: any) {
      console.error('WhatsApp API error:', whatsappError)
      
      // Log failed message
      await logWhatsAppMessage({
        phone: formattedPhone,
        message,
        userId,
        status: 'failed',
        error: whatsappError.message,
        isTest
      })

      return NextResponse.json(
        { 
          error: 'Failed to send WhatsApp message',
          details: whatsappError.message 
        },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('WhatsApp send error:', error)
    return NextResponse.json(
      { error: 'Failed to process WhatsApp request' },
      { status: 500 }
    )
  }
}

// Handle WhatsApp webhook (for receiving messages)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  // Webhook verification
  if (mode === 'subscribe') {
    if (token === WHATSAPP_VERIFY_TOKEN) {
      return NextResponse.json({ challenge })
    } else {
      return NextResponse.json({ error: 'Invalid verify token' }, { status: 403 })
    }
  }

  return NextResponse.json({ ok: true })
}

// Handle incoming WhatsApp messages
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Process incoming message
    console.log('Incoming WhatsApp message:', body)
    
    // Here you would:
    // 1. Extract message data
    // 2. Match with user phone number
    // 3. Store message in database
    // 4. Send notification to user
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function logWhatsAppMessage({
  phone,
  message,
  userId,
  status,
  messageId,
  error,
  isTest
}: {
  phone: string
  message: string
  userId?: string
  status: string
  messageId?: string
  error?: string
  isTest?: boolean
}) {
  try {
    await supabase
      .from('whatsapp_messages')
      .insert({
        phone,
        message,
        user_id: userId,
        status,
        whatsapp_message_id: messageId,
        error_message: error,
        is_test: isTest || false,
        created_at: new Date().toISOString()
      })
  } catch (logError) {
    console.error('Error logging WhatsApp message:', logError)
  }
}