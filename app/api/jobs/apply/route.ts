
import { NextRequest, NextResponse } from 'next/server'
import { createClientForBrowser, createSupabaseClientForServer } from '@/lib/supabase-client'
import { createRouteClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { job_id, name, email, phone, message } = body

        if (!job_id || !name || !email || !phone) {
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
            .from('job_applications')
            .insert({
                job_id,
                user_name: name,
                user_email: email,
                user_phone: phone,
                message,
                user_id: user?.id || null,
                status: 'pending'
            } as any)
            .select()
            .single()

        if (error) {
            console.error('Error submitting application:', error)
            return NextResponse.json(
                { error: 'Failed to submit application' },
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
