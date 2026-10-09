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

    // Send the approved Authentication template "celoris_otp" (language "en",
    // copy-code button). There is deliberately NO plain-text fallback: WhatsApp
    // only delivers free text to people who messaged us in the last 24 hours,
    // so a text "OTP" gets a message id from Meta but never arrives — which is
    // why earlier OTPs were logged as sent but nobody received them.
    const templateName = process.env.WHATSAPP_OTP_TEMPLATE || 'celoris_otp'
    const templateLang = process.env.WHATSAPP_OTP_TEMPLATE_LANG || 'en'

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: templateLang },
        components: [
          { type: 'body', parameters: [{ type: 'text', text: otpCode }] },
          // Copy-code buttons on authentication templates take the code as a "url" button parameter.
          { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: otpCode }] },
        ],
      },
    }

    let waData: any = null
    let ok = false
    try {
      const waResponse = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      waData = await waResponse.json().catch(() => ({}))
      ok = waResponse.ok && !!waData?.messages?.[0]?.id
    } catch (err: any) {
      waData = { error: { message: err?.message || 'Network error' } }
    }

    // Log the attempt — never the code itself.
    try {
      await supabase.from('whatsapp_messages').insert({
        phone: formattedPhone,
        message: `OTP template ${templateName}`,
        status: ok ? 'sent' : 'failed',
        whatsapp_message_id: ok ? waData.messages[0].id : null,
        error_message: ok ? null : String(waData?.error?.message || 'Meta API rejected the message').slice(0, 500),
        is_test: false,
      })
    } catch (logErr) {
      console.error('Error logging WhatsApp message:', logErr)
    }

    if (!ok) {
      console.error('WhatsApp OTP template send failed:', waData?.error)
      // The code can't be delivered, so don't leave it usable.
      await supabase.from('whatsapp_otps').update({ expires_at: new Date().toISOString() }).eq('phone', formattedPhone).eq('otp_code', otpCode)
      return NextResponse.json(
        { error: 'Could not send the WhatsApp code. Please check the number is on WhatsApp and try again.' },
        { status: 502 }
      )
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
