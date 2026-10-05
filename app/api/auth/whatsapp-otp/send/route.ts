import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

function sanitizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (digits.length === 10) {
    return `91${digits}`
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits
  }
  if (digits.length >= 10 && digits.length <= 15) {
    return digits
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json().catch(() => ({}))

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    const formattedPhone = sanitizePhone(phone)
    if (!formattedPhone) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClientForServer()

    // 1. Check if WhatsApp OTP is enabled in auth_settings
    const { data: settings } = await supabase
      .from('auth_settings')
      .select('whatsapp_otp_enabled')
      .eq('id', 1)
      .maybeSingle()

    if (settings && settings.whatsapp_otp_enabled === false) {
      return NextResponse.json(
        { error: 'WhatsApp OTP verification is currently disabled by administrator' },
        { status: 403 }
      )
    }

    // 2. Rate limit: check if an OTP was sent in the last 30 seconds
    const thirtySecsAgo = new Date(Date.now() - 30 * 1000).toISOString()
    const { data: recentOtp } = await supabase
      .from('whatsapp_otps')
      .select('id, created_at')
      .eq('phone', formattedPhone)
      .gte('created_at', thirtySecsAgo)
      .limit(1)

    if (recentOtp && recentOtp.length > 0) {
      return NextResponse.json(
        { error: 'Please wait 30 seconds before requesting another OTP' },
        { status: 429 }
      )
    }

    // 3. Generate 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes

    // 4. Save OTP to database
    const { error: dbError } = await supabase.from('whatsapp_otps').insert({
      phone: formattedPhone,
      otp_code: otpCode,
      expires_at: expiresAt,
      verified: false,
      attempts: 0,
    })

    if (dbError) {
      console.error('Failed to store WhatsApp OTP:', dbError)
      return NextResponse.json({ error: 'Failed to initiate OTP. Please try again.' }, { status: 500 })
    }

    // 5. Send via WhatsApp Cloud API using approved 'celoris_otp' template
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID
    const token = process.env.WHATSAPP_ACCESS_TOKEN

    if (!phoneId || !token) {
      console.warn('WhatsApp API not configured - phoneId or token missing')
      return NextResponse.json(
        { error: 'WhatsApp Cloud API credentials not configured on server' },
        { status: 500 }
      )
    }

    // Try sending template with resilient fallback combinations (url, copy_code, body-only, en, en_US)
    const attempts = [
      // Attempt 1: Standard Authentication template with copy_code button (sub_type: url)
      {
        lang: 'en',
        components: [
          { type: 'body', parameters: [{ type: 'text', text: otpCode }] },
          { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: otpCode }] },
        ],
      },
      // Attempt 2: Standard Authentication template with copy_code button (sub_type: copy_code)
      {
        lang: 'en',
        components: [
          { type: 'body', parameters: [{ type: 'text', text: otpCode }] },
          { type: 'button', sub_type: 'copy_code', index: '0', parameters: [{ type: 'text', text: otpCode }] },
        ],
      },
      // Attempt 3: Just body component (no button component)
      {
        lang: 'en',
        components: [
          { type: 'body', parameters: [{ type: 'text', text: otpCode }] },
        ],
      },
      // Attempt 4: en_US with button
      {
        lang: 'en_US',
        components: [
          { type: 'body', parameters: [{ type: 'text', text: otpCode }] },
          { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: otpCode }] },
        ],
      },
      // Attempt 5: en_US body only
      {
        lang: 'en_US',
        components: [
          { type: 'body', parameters: [{ type: 'text', text: otpCode }] },
        ],
      },
    ]

    let waResponse: Response | null = null
    let waData: any = null
    let lastError: string = ''

    for (const attempt of attempts) {
      try {
        const payload = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: formattedPhone,
          type: 'template',
          template: {
            name: 'celoris_otp',
            language: { code: attempt.lang },
            components: attempt.components,
          },
        }

        waResponse = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })

        waData = await waResponse.json().catch(() => ({}))

        if (waResponse.ok && waData?.messages?.[0]?.id) {
          // Success! Break out of the loop
          break
        } else {
          lastError = waData?.error?.message || 'Meta API rejected template'
          console.warn(`WhatsApp attempt with lang=${attempt.lang} failed:`, lastError)
        }
      } catch (err: any) {
        lastError = err.message
      }
    }

    if (!waResponse?.ok || !waData?.messages?.[0]?.id) {
      console.error('WhatsApp Graph API all attempts failed:', waData)
      return NextResponse.json(
        {
          error: lastError || 'Failed to send WhatsApp OTP. Please ensure your number is on WhatsApp.',
        },
        { status: 502 }
      )
    }

    const waMessageId = waData.messages[0].id

    // Log to whatsapp_messages table
    try {
      await supabase.from('whatsapp_messages').insert({
        phone: formattedPhone,
        message: `OTP Verification Code: ${otpCode}`,
        status: 'sent',
        whatsapp_message_id: waMessageId,
        is_test: false,
      })
    } catch (logErr) {
      console.error('Error logging WhatsApp message:', logErr)
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your WhatsApp',
      phone: formattedPhone,
    })
  } catch (err: any) {
    console.error('WhatsApp OTP send exception:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
