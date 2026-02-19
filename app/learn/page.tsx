import { createServerClient } from "@/lib/supabase-server"
import LearnClient from "./LearnClient"
import { DashboardShell } from "@/components/home-new/DashboardShell"

export default async function LearnPage() {
    const supabase = createServerClient()

    // Fetch courses on server
    const { data: dbCourses } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(4);

    // Fetch notices on server
    const { data: dbNotices } = await supabase
        .from('notice_board_view')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

    let notices = dbNotices;
    if (!notices) {
        const { data: altNotices } = await supabase
            .from('notice_board')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(6);
        notices = altNotices;
    }

    return (
        <DashboardShell>
            <LearnClient
                initialCourses={dbCourses || []}
                initialNotices={notices || []}
            />
        </DashboardShell>
    )
}
