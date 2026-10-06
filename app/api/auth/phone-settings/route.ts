import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase
      .from('auth_settings')
      .select('phone_verification_enabled, phone_email_client_id, whatsapp_otp_enabled, twilio_otp_enabled')
      .eq('id', 1)
      .maybeSingle()

    if (error) {
      console.error('Error reading auth_settings:', error)
      return NextResponse.json({
        enabled: false,
        clientId: '',
        whatsappOtpEnabled: false,
        twilioOtpEnabled: false,
      })
    }

    const envForced = process.env.REQUIRE_PHONE_OTP === 'true'
    const twilioOtpEnabled = envForced || Boolean(data?.twilio_otp_enabled)

    return NextResponse.json({
      enabled: Boolean(data?.phone_verification_enabled),
      clientId: data?.phone_email_client_id || '',
      whatsappOtpEnabled: Boolean(data?.whatsapp_otp_enabled ?? false),
      twilioOtpEnabled,
    })
  } catch (err: any) {
    console.error('Phone settings exception:', err)
    return NextResponse.json({
      enabled: false,
      clientId: '',
      whatsappOtpEnabled: false,
      twilioOtpEnabled: false,
    })
  }
}
