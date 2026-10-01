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
    const { phone, otp } = await request.json().catch(() => ({}))

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })
    }

    if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
      return NextResponse.json({ error: 'Please enter the 6-digit OTP code' }, { status: 400 })
    }

    const formattedPhone = sanitizePhone(phone)
    if (!formattedPhone) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseClientForServer()
    const nowIso = new Date().toISOString()

    // Find the latest active unverified OTP for this phone
    const { data: record, error: fetchError } = await supabase
      .from('whatsapp_otps')
      .select('id, otp_code, attempts, expires_at')
      .eq('phone', formattedPhone)
      .eq('verified', false)
      .gt('expires_at', nowIso)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError || !record) {
      return NextResponse.json(
        { error: 'OTP has expired or does not exist. Please request a new code.' },
        { status: 400 }
      )
    }

    // Check attempts
    if (record.attempts >= 5) {
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new OTP.' },
        { status: 429 }
      )
    }

    // Verify code match
    if (record.otp_code !== otp.trim()) {
      // Increment attempts
      await supabase
        .from('whatsapp_otps')
        .update({ attempts: record.attempts + 1 })
        .eq('id', record.id)

      const remainingAttempts = 5 - (record.attempts + 1)
      return NextResponse.json(
        {
          error: `Incorrect OTP. ${remainingAttempts > 0 ? `${remainingAttempts} attempt(s) remaining.` : 'Please request a new code.'}`,
        },
        { status: 400 }
      )
    }

    // Success: Mark as verified
    await supabase
      .from('whatsapp_otps')
      .update({ verified: true })
      .eq('id', record.id)

    return NextResponse.json({
      success: true,
      verified: true,
      phone: formattedPhone,
      message: 'Mobile number verified successfully via WhatsApp',
    })
  } catch (err: any) {
    console.error('WhatsApp OTP verify exception:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
