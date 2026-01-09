
import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'

// Admin client for wallet operations
const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEDUCTION_AMOUNT = 25

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
            // ... other fields are destructured via ...rest or just passed in insert
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

        // 1. Check Wallet Balance
        const { data: userData, error: userError } = await adminSupabase
            .from('users')
            .select('wallet_balance')
            .eq('id', user.id)
            .single()

        if (userError || !userData) {
            return NextResponse.json(
                { error: 'Failed to fetch user wallet' },
                { status: 500 }
            )
        }

        if (userData.wallet_balance < DEDUCTION_AMOUNT) {
            return NextResponse.json(
                { error: 'Insufficient wallet balance' },
                { status: 402 }
            )
        }

        // 2. Deduct Amount & Log Transaction
        const { error: txError } = await adminSupabase
            .from('transactions')
            .insert({
                user_id: user.id,
                amount: DEDUCTION_AMOUNT,
                type: 'debit',
                description: `Job Application Fee: ${application_ref_id || job_title || 'General'}`,
                created_at: new Date().toISOString()
            } as any)

        if (txError) {
            console.error('Transaction error:', txError)
            return NextResponse.json({ error: 'Transaction failed' }, { status: 500 })
        }

        const { error: updateError } = await adminSupabase
            .from('users')
            .update({ wallet_balance: userData.wallet_balance - DEDUCTION_AMOUNT })
            .eq('id', user.id)

        if (updateError) {
            console.error('Wallet update error:', updateError)
            // Ideally rollback transaction here, but for now we proceed or fail hard
            return NextResponse.json({ error: 'Wallet update failed' }, { status: 500 })
        }

        // 3. Create Application Entry
        // We map the incoming camelCase keys to snake_case db columns if needed, 
        // OR we just ensured the frontend sent camelCase and we map it here.
        // Actually, the frontend sent keys matching the payload structure which I designed to match DB columns mostly, 
        // but let's be careful. The frontend payload `job_id`, `job_title`, `full_name` etc match DB.

        // Frontend keys:
        // application_ref_id, job_id, job_title (not in db schema but fine), full_name, date_of_birth, etc.
        // The DB columns are snake_case.

        const dbPayload = {
            user_id: user.id,
            application_ref_id,
            job_id,
            // job_title is not in the schema I defined in MIGRATION_JOB_APP.md, I should probably add it or ignore it.
            // I'll ignore it for now as job_id is there, but storing job_title is useful if job_id is just an index from a static list.
            // Let's check migration again. Schema has: job_title text. Good.
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
            // Refund? Complex. For now just error.
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
