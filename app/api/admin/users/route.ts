import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = createSupabaseClientForServer()

        console.log('Admin API: Fetching users from public.users...')
        const { data: users, error: usersError } = await (supabase as any)
            .from('users')
            .select('*')
            .order('created_at', { ascending: false })

        if (usersError) {
            console.error('Admin API: Error fetching users:', usersError)
            return NextResponse.json({ error: usersError.message }, { status: 500 })
        }

        console.log(`Admin API: Found ${users?.length || 0} users in public.users`)

        // If no users in public.users, let's check auth.users to see if we're out of sync
        if (!users || users.length === 0) {
            console.log('Admin API: public.users is empty, checking auth.users...')
            const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers()

            if (authError) {
                console.error('Admin API: Error listing auth users:', authError)
            } else {
                console.log(`Admin API: Found ${authUsers?.length || 0} users in auth.users`)
            }
        }

        return NextResponse.json({ users: users || [] })
    } catch (error: any) {
        console.error('Admin API: Unexpected error:', error)
        return NextResponse.json({
            error: error.message || 'Internal server error',
            details: 'Check if SUPABASE_SERVICE_ROLE_KEY is set in your environment.'
        }, { status: 500 })
    }
}

// POST method to sync users from auth.users to public.users
export async function POST() {
    try {
        const supabase = createSupabaseClientForServer()

        console.log('Admin API: Starting user sync...')
        const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers()

        if (authError) throw authError

        const syncResults = []
        for (const authUser of authUsers) {
            const { data, error } = await (supabase as any)
                .from('users')
                .upsert({
                    id: authUser.id,
                    email: authUser.email,
                    username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'user_' + authUser.id.substring(0, 5),
                    full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || 'User',
                    role: authUser.email === 'support@celorisdesigns.com' || authUser.email === 'celoris.designs@gmail.com' ? 'admin' : 'user',
                    is_active: true,
                    created_at: authUser.created_at,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'id' })
                .select()

            if (error) {
                console.error(`Admin API: Failed to sync user ${authUser.id}:`, error)
            } else {
                syncResults.push(data[0])
            }
        }

        return NextResponse.json({
            success: true,
            message: `Synced ${syncResults.length} users from auth to public table.`,
            count: syncResults.length
        })
    } catch (error: any) {
        console.error('Admin API: Sync error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
