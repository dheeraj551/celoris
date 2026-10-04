import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Admin-only view of course_applications (the record behind every "Enroll"
// submission on a course page now that it requires a student ID upload —
// see CourseInquiryDialog.tsx / /api/courses/inquiry). Same disclosed
// no-server-side-admin-check posture as every other app/api/admin/* route
// in this codebase — access is gated client-side via the admin_session
// localStorage flag, not re-checked here.
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const admin = createSupabaseClientForServer()

        const { data, error } = await admin
            .from('course_applications')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Admin course-applications GET error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ applications: data || [] })
    } catch (error: any) {
        console.error('Admin course-applications GET unexpected error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}

// Approve/reject or update pass/waitlist state — { id, status?, offer_pass?, intent? }.
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json()
        const { id, status, offer_pass, intent } = body

        if (!id) {
            return NextResponse.json({ error: 'id is required' }, { status: 400 })
        }

        const updates: Record<string, any> = {
            reviewed_at: new Date().toISOString(),
        }

        if (status) {
            if (!['pending', 'approved', 'rejected'].includes(status)) {
                return NextResponse.json({ error: 'invalid status' }, { status: 400 })
            }
            updates.status = status
        }

        if (typeof offer_pass === 'boolean') {
            updates.offer_pass = offer_pass
        }

        if (typeof intent === 'string') {
            updates.intent = intent
        }

        const admin = createSupabaseClientForServer()

        const { data, error } = await admin
            .from('course_applications')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Admin course-applications PATCH error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ application: data })
    } catch (error: any) {
        console.error('Admin course-applications PATCH unexpected error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
