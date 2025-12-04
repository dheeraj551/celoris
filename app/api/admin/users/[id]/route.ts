import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            )
        }

        // Get environment variables directly
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY

        console.log('Environment check:', {
            hasUrl: !!supabaseUrl,
            hasServiceKey: !!serviceRoleKey,
            urlStart: supabaseUrl?.substring(0, 20),
            keyStart: serviceRoleKey?.substring(0, 10)
        })

        if (!supabaseUrl) {
            console.error('Missing SUPABASE_URL')
            return NextResponse.json(
                { error: 'Server configuration error: Missing Supabase URL' },
                { status: 500 }
            )
        }

        if (!serviceRoleKey) {
            console.error('Missing SERVICE_ROLE_KEY')
            return NextResponse.json(
                { error: 'Server configuration error: Missing Service Role Key' },
                { status: 500 }
            )
        }

        // Create admin client with service role key
        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        })

        console.log('Attempting to delete user:', userId)

        // 1. Delete user from auth.users (this should cascade to public.users if configured)
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

        if (authError) {
            console.error('Error deleting user from auth:', authError)
            return NextResponse.json(
                { error: `Failed to delete user: ${authError.message}` },
                { status: 500 }
            )
        }

        console.log('User deleted from auth successfully')

        // 2. Explicitly delete from public.users just in case cascade isn't set up
        const { error: dbError } = await supabaseAdmin
            .from('users')
            .delete()
            .eq('id', userId)

        if (dbError) {
            console.warn('Error deleting user from public table (might have cascaded):', dbError)
        } else {
            console.log('User deleted from public.users table')
        }

        return NextResponse.json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
        console.error('Unexpected error deleting user:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
