
import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

// Admin client for wallet operations
const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            application_ref_id,
            job_id,
            job_title,
            full_name,
            email,
            mobile_number,
            ...otherData
        } = body

        if (!full_name || !email || !mobile_number) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        const supabase = createRouteClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Create Application Entry
        const dbPayload = {
            user_id: user.id,
            application_ref_id,
            job_id,
            job_title,

            full_name,
            email,
            mobile_number,

            date_of_birth: otherData.date_of_birth,
            gender: otherData.gender,
            current_city: otherData.current_city,
            current_address: otherData.current_address,

            department: otherData.department,
            employment_type_preferred: otherData.employment_type_preferred,
            work_mode_preference: otherData.work_mode_preference,

            professional_summary: otherData.professional_summary,

            education_details: otherData.education_details,

            primary_skills: otherData.primary_skills,
            secondary_skills: otherData.secondary_skills,
            tools_known: otherData.tools_known,
            skill_level: otherData.skill_level,

            total_experience: otherData.total_experience,
            last_job_company: otherData.last_job_company,
            last_job_role: otherData.last_job_role,
            last_job_duration: otherData.last_job_duration,
            last_job_responsibilities: otherData.last_job_responsibilities
        }

        const { error: insertError } = await adminSupabase
            .from('job_applications')
            .insert(dbPayload)

        if (insertError) {
            console.error('Job Application insert error:', insertError)
            return NextResponse.json(
                { error: 'Failed to submit application' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (error: any) {
        console.error('Job App error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '50')
        const offset = parseInt(searchParams.get('offset') || '0')

        const { data, error, count } = await adminSupabase
            .from('job_applications')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1)

        if (error) {
            console.error('Error fetching job applications:', error)
            return NextResponse.json(
                { error: 'Failed to fetch applications' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data,
            count,
            limit,
            offset
        })

    } catch (error: any) {
        console.error('Job App GET error:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
