import { NextRequest, NextResponse } from 'next/server'
import { createClientForBrowser, createSupabaseClientForServer } from '@/lib/supabase-client'
import { createRouteClient } from '@/lib/supabase-server'
import { maskContactInfo } from '@/lib/contact-shield'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { notice_id, name, email, phone, message } = body

        if (!notice_id || !name || !email || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = await createRouteClient()
        const { data: { user } } = await supabase.auth.getUser()

        const adminSupabase = createSupabaseClientForServer() as any

        // 1. Create interest entry with masked message against off-platform leakage
        const { data, error } = await adminSupabase
            .from('notice_interests')
            .insert({
                notice_id,
                user_name: name,
                user_email: email,
                user_phone: phone,
                message: message ? maskContactInfo(message) : null,
                user_id: user?.id || null
            } as any)
            .select()
            .single()

        if (error) {
            console.error('Error submitting interest:', error)
            return NextResponse.json(
                { error: 'Failed to submit interest' },
                { status: 500 }
            )
        }

        return NextResponse.json({ data }, { status: 201 })
    } catch (error: any) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const sessionSupabase = await createRouteClient()
        const { data: { user } } = await sessionSupabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized: Admin session required' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const noticeId = searchParams.get('noticeId')

        const supabase = createClientForBrowser()

        let query = supabase
            .from('notice_interests')
            .select(`
        *,
        notice_board (
          title
        )
      `)
            .order('created_at', { ascending: false })

        if (noticeId) {
            query = query.eq('notice_id', noticeId)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching interests:', error)
            return NextResponse.json(
                { error: 'Failed to fetch interests' },
                { status: 500 }
            )
        }

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Server error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
