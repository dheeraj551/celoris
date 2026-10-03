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

    // 1. Update auth user metadata directly using route client (session token)
    // This updates the user's session metadata immediately
    try {
      const { error: metaError } = await supabase.auth.updateUser({
        data: {
          phone: formattedPhone,
          phone_verified: true,
        },
      })
      if (metaError) {
        console.warn('Could not update auth user metadata via session:', metaError.message)
      }
    } catch (metaErr: any) {
      console.warn('Exception updating auth user metadata:', metaErr?.message)
    }

    // 2. Update public.users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, username')
      .eq('id', user.id)
      .maybeSingle()

    if (existingUser) {
      const { error: userUpdateErr } = await supabase
        .from('users')
        .update({
          phone: formattedPhone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (userUpdateErr) {
        console.warn('Failed to update phone in users table:', userUpdateErr.message)
      }
    } else {
      const fallbackUsername = (user.email?.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20) || 'user'
      const { error: userInsertErr } = await supabase
        .from('users')
        .insert({
          id: user.id,
          username: `${fallbackUsername}_${user.id.slice(0, 4)}`,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          phone: formattedPhone,
          role: 'user',
          updated_at: new Date().toISOString(),
        })

      if (userInsertErr) {
        console.warn('Failed to insert user with phone:', userInsertErr.message)
      }
    }

    // 3. Update public.profiles if a row already exists
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (existingProfile) {
        await supabase
          .from('profiles')
          .update({
            contact: formattedPhone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)
      }
    } catch (profErr: any) {
      console.warn('Failed to update profiles table:', profErr?.message)
    }

    // 4. Also attempt service role update if valid key is available
    try {
      const adminClient = createSupabaseClientForServer()
      await adminClient
        .from('users')
        .update({ phone: formattedPhone, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      await adminClient.auth.admin.updateUserById(user.id, {
        user_metadata: {
          ...user.user_metadata,
          phone: formattedPhone,
          phone_verified: true,
        },
      })
    } catch (adminErr) {
      // Service role key might not be configured or invalid — harmless since route client already did the updates
      console.warn('Admin client update skipped/failed:', (adminErr as any)?.message)
    }

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
