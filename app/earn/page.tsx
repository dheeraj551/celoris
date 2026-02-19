import { createServerClient } from "@/lib/supabase-server"
import EarnClient from "./EarnClient"
import { DashboardShell } from "@/components/home-new/DashboardShell"

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
