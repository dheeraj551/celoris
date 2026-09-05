"use client"
import '@/components/skillverify/index.css'
import dynamic from 'next/dynamic'
import React from 'react'
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { Loader2 } from 'lucide-react'

const CandidateProfile = dynamic(
    () => import('@/components/skillverify/pages/CandidateProfile').then(mod => mod.CandidateProfile),
    {
        ssr: false,
        loading: () => <LoadingSpinner />
    }
)

function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
    )
}

// Public candidate profile page — no auth gate, so anyone with the link
// (or the QR code on the profile) can view it. This is the Job Center
// counterpart of app/teach/[[...slug]]/page.tsx's public trainer resume
// route, built as its own independent route (rather than folded into the
// existing app/job-center/page.tsx catch-all, which force-redirects signed
// out visitors to /login) so a candidate's profile stays visible whether or
// not the viewer is signed in.
export default function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
    // Next.js 15 passes `params` to a client page as a Promise, not a plain
    // object — it must be unwrapped with React.use() rather than accessed
    // directly (accessing params.id synchronously logs a console error and
    // will break in a future Next.js version).
    const { id } = React.use(params)
    return (
        <DashboardShell hideTopBar>
            <div className="w-full">
                <CandidateProfile id={id} />
            </div>
        </DashboardShell>
    )
}
