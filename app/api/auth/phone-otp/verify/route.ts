import { NextResponse } from 'next/server'
import { verifyTwilioOtp } from '@/lib/twilio'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { phone, code } = body

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Phone number and 6-digit OTP code are required' },
        { status: 400 }
      )
    }

    const digitsOnly = String(phone).replace(/\D/g, '')
    let formattedPhone = String(phone).trim()
    if (!formattedPhone.startsWith('+')) {
      if (digitsOnly.length === 10) {
        formattedPhone = `+91${digitsOnly}`
      } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
        formattedPhone = `+${digitsOnly}`
      } else {
        formattedPhone = `+91${digitsOnly.slice(-10)}`
      }
    }

    const trimmedCode = String(code).trim()
    if (trimmedCode.length !== 6) {
      return NextResponse.json(
        { error: 'OTP must be exactly 6 digits' },
        { status: 400 }
      )
    }

    const result = await verifyTwilioOtp(formattedPhone, trimmedCode)

    if (!result.success || !result.valid) {
      return NextResponse.json(
        { error: result.error || 'Invalid or expired OTP code. Please try again.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      valid: true,
      phone: formattedPhone,
      message: 'Phone verified successfully',
    })
  } catch (err: any) {
    console.error('Phone OTP verify error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error while verifying OTP' },
      { status: 500 }
    )
  }
}
