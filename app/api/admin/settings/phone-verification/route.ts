import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin } from '@/lib/admin-auth'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase
      .from('auth_settings')
      .select('phone_verification_enabled, phone_email_client_id, whatsapp_otp_enabled, twilio_otp_enabled, updated_at')
      .eq('id', 1)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      enabled: Boolean(data?.phone_verification_enabled),
      clientId: data?.phone_email_client_id || '',
      whatsappOtpEnabled: Boolean(data?.whatsapp_otp_enabled ?? false),
      twilioOtpEnabled: Boolean(data?.twilio_otp_enabled ?? false),
      updatedAt: data?.updated_at || null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await authenticateAdmin(request)
  if (!auth.success) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const supabase = createSupabaseClientForServer()

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (typeof body.enabled === 'boolean') {
      updatePayload.phone_verification_enabled = body.enabled
    }

    if (typeof body.whatsappOtpEnabled === 'boolean') {
      updatePayload.whatsapp_otp_enabled = body.whatsappOtpEnabled
    }

    if (typeof body.clientId === 'string') {
      updatePayload.phone_email_client_id = body.clientId.trim()
    }

    if (typeof body.twilioOtpEnabled === 'boolean') {
      updatePayload.twilio_otp_enabled = body.twilioOtpEnabled
    }

    const { data, error } = await supabase
      .from('auth_settings')
      .upsert({
        id: 1,
        ...updatePayload,
      })
      .select('phone_verification_enabled, phone_email_client_id, whatsapp_otp_enabled, twilio_otp_enabled, updated_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      enabled: Boolean(data?.phone_verification_enabled),
      clientId: data?.phone_email_client_id || '',
      whatsappOtpEnabled: Boolean(data?.whatsapp_otp_enabled ?? false),
      twilioOtpEnabled: Boolean(data?.twilio_otp_enabled ?? false),
      updatedAt: data?.updated_at || null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 })
  }
}
