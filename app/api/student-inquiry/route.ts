
import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

// Admin client for inserting without RLS if needed, or stick to user context
const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            inquiry_ref_id,
            full_name,
            email,
            contact_number,
            ...otherData
        } = body

        if (!full_name || !email || !contact_number) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = createRouteClient()
        const { data: { user } } = await supabase.auth.getUser()

        // We allow anonymous inquiries, but if logged in, link it.
        const userId = user ? user.id : null

        const dbPayload = {
            user_id: userId,
            inquiry_ref_id,
            full_name,
            email,
            contact_number,

            // Map remaining fields
            age_class: otherData.age_class,
            gender: otherData.gender,
            parent_name: otherData.parent_name,
            alternate_number: otherData.alternate_number,

            city: otherData.city,
            area_locality: otherData.area_locality,
            address: otherData.address,

            requirement_type: otherData.requirement_type,
            learning_mode: otherData.learning_mode,

            subject_course_needed: otherData.subject_course_needed,
            class_level: otherData.class_level,
            board_exam: otherData.board_exam,

            primary_goal: otherData.primary_goal,
            specific_topics: otherData.specific_topics,

            tutor_preference: otherData.tutor_preference,
            experience_preference: otherData.experience_preference,
            language_preference: otherData.language_preference,

            days_required: otherData.days_required,
            preferred_time_slot: otherData.preferred_time_slot,
            classes_per_week: otherData.classes_per_week,

            budget_range: otherData.budget_range,
            negotiable: otherData.negotiable,

            demo_interested: otherData.demo_interested,
            demo_mode: otherData.demo_mode,

            urgency_level: otherData.urgency_level,
            additional_notes: otherData.additional_notes
        }

        const { error: insertError } = await adminSupabase
            .from('student_inquiries')
            .insert(dbPayload)

        if (insertError) {
            console.error('Student Inquiry insert error:', insertError)
            return NextResponse.json(
                { error: 'Failed to submit inquiry' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Inquiry error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
