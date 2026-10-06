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
      let friendlyError = result.error || 'Failed to send OTP'
      if (
        friendlyError.toLowerCase().includes('trial') ||
        friendlyError.toLowerCase().includes('verified tester')
      ) {
        friendlyError =
          'Twilio Trial Notice: In trial mode, SMS can only be sent to numbers added as a "Verified Caller ID / Tester" in your Twilio Console (Verify > Try it out). To send OTPs to all users without restrictions, please click "Upgrade Account" in Twilio.'
      }
      return NextResponse.json(
        { error: friendlyError },
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
