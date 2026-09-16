"use client"
import dynamic from 'next/dynamic'
import React from 'react'
import { Loader2 } from 'lucide-react'

const PublicExamRunner = dynamic(
    () => import('@/components/skillverify-public/PublicExamRunner').then((mod) => mod.PublicExamRunner),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        ),
    }
)

// Public, unauthenticated exam-taking page — no auth gate, same pattern as
// app/job-center/candidates/[id]/page.tsx's public profile route, built as
// its own independent route so it isn't caught by app/job-center/page.tsx's
// force-redirect-to-/login for signed-out visitors. This is the link sent
// via /api/exam/invite (or shared directly) so a job candidate can take a
// screening assessment without creating a Celoris account.
export default function PublicExamPage({ params }: { params: Promise<{ examId: string }> }) {
    const { examId } = React.use(params)
    return <PublicExamRunner examId={examId} />
}
