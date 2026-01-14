import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { createRouteClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            full_name,
            email,
            mobile_number,
            declaration_accepted
        } = body

        if (!full_name || !email || !mobile_number || !declaration_accepted) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = createRouteClient()
        const { data: { user } } = await supabase.auth.getUser()

        const adminSupabase = createSupabaseClientForServer() as any

        // 1. Create application entry
        const { data, error } = await adminSupabase
            .from('trainer_applications')
            .insert({
                ...body,
                user_id: user?.id || null, // Allow null for guests, but wait for DB update
            } as any)
            .select()
            .single()

        if (error) {
            console.error('Error submitting application:', error)

            // If it's a constraint error on user_id, it means DB still has NOT NULL
            return NextResponse.json(
                { error: 'Failed to submit application: ' + error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ data }, { status: 201 })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const adminSupabase = createSupabaseClientForServer() as any

        // Simple fetch all for now, similar to job-applications
        const { data, error } = await adminSupabase
            .from('trainer_applications')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching trainer applications:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Server error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
