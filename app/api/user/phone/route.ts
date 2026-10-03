import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export async function POST(request: Request) {
  try {
    const supabase = await createRouteClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const rawPhone = (body.phone || '').toString().trim()
    const digitsOnly = rawPhone.replace(/\D/g, '')

    // Must have at least 10 digits (standard Indian mobile or international)
    if (!rawPhone || digitsOnly.length < 10) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      )
    }

    // Standardize to clean format with +91 if 10 digits provided
    let formattedPhone = rawPhone
    if (digitsOnly.length === 10) {
      formattedPhone = `+91 ${digitsOnly}`
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      formattedPhone = `+91 ${digitsOnly.slice(2)}`
    }

    // Use service role client to guarantee sync across both users and profiles tables
    const adminClient = createSupabaseClientForServer()

    // 1. Update public.users
    await adminClient
      .from('users')
      .upsert(
        {
          id: user.id,
          phone: formattedPhone,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )

    // 2. Update public.profiles
    await adminClient
      .from('profiles')
      .upsert(
        {
          id: user.id,
          contact: formattedPhone,
          email: user.email,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )

    // 3. Update auth user metadata
    await adminClient.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        phone: formattedPhone,
        phone_verified: true,
      },
    })

    return NextResponse.json({
      success: true,
      phone: formattedPhone,
      message: 'Mobile number updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating phone number:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
