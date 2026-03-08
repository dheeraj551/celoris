import { type Metadata } from "next"
import { createServerClient } from "@/lib/supabase-server"
import LearnClient from "./LearnClient"
import { DashboardShell } from "@/components/home-new/DashboardShell"

export const metadata: Metadata = {
    title: "Free Online Classes India — Learn from Real Trainers",
    description: "Book free online classes in India. Learn video editing, AI tools, Excel, spoken English and more from real trainers. Celoris — free to start. Free to start. No credit card. celoris.in 🇮🇳",
    openGraph: {
        title: "Free Online Classes India",
        description: "Book free online classes in India. Learn video editing, AI tools, Excel, spoken English and more from real trainers. Celoris — free to start. Free to start. No credit card. celoris.in 🇮🇳",
    }
}

export default async function LearnPage() {
    const supabase = (await createServerClient()) as any

    // Fetch courses on server for featured and daily live sections
    const { data: dbCourses } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

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
