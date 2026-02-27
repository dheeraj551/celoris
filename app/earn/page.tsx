import { type Metadata } from "next"
import { createServerClient } from "@/lib/supabase-server"
import EarnClient from "./EarnClient"
import { DashboardShell } from "@/components/home-new/DashboardShell"

export const metadata: Metadata = {
    title: "Earn Online India — Daily Freelance Opportunities",
    description: "Find fresh freelance jobs daily on Celoris. Video editing, design, content writing, teaching and AI gigs for Indian students and creators. Free to start. No credit card. celoris.in 🇮🇳",
    openGraph: {
        title: "Earn Online India — Daily Freelance Opportunities",
        description: "Find fresh freelance jobs daily on Celoris. Video editing, design, content writing, teaching and AI gigs for Indian students and creators. Free to start. No credit card. celoris.in 🇮🇳",
    }
}

export default async function EarnPage() {
    const supabase = createServerClient()

    // Fetch jobs on server
    const { data: dbJobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(6);

    return (
        <DashboardShell>
            <EarnClient initialJobs={dbJobs || []} />
        </DashboardShell>
    )
}
