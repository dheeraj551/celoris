import { NextResponse } from 'next/server'
import { sendTwilioOtp } from '@/lib/twilio'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    const digitsOnly = phone.replace(/\D/g, '')

    if (digitsOnly.length < 10) {
      return NextResponse.json(
        { error: 'Please provide a valid 10-digit mobile number' },
        { status: 400 }
      )
    }

    // Format phone to E.164
    let formattedPhone = phone.trim()
    if (!formattedPhone.startsWith('+')) {
      if (digitsOnly.length === 10) {
        formattedPhone = `+91${digitsOnly}`
      } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
        formattedPhone = `+${digitsOnly}`
      } else {
        formattedPhone = `+91${digitsOnly.slice(-10)}`
      }
    }

    const result = await sendTwilioOtp(formattedPhone, 'sms')

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send OTP' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      phone: formattedPhone,
      status: result.status,
      message: 'OTP sent successfully via SMS',
    })
  } catch (err: any) {
    console.error('Phone OTP send error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error while sending OTP' },
      { status: 500 }
    )
  }
}
