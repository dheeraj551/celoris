import { NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'

// Backs the admin-only "Candidate Results" list (app/job-center/exam-results).
// Uses the service-role client because exam_candidate_submissions has RLS
// enabled with no policies — it's intentionally unreachable via the anon key.
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const examId = searchParams.get('examId')

        const supabase = createSupabaseClientForServer()
        let query = (supabase as any)
            .from('exam_candidate_submissions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200)

        if (examId) {
            query = query.eq('exam_id', examId)
        }

        const { data, error } = await query

        if (error) {
            console.error('Error fetching exam submissions:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ submissions: data || [] })
    } catch (error: any) {
        console.error('Exam results error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to fetch results' },
            { status: 500 }
        )
    }
}
