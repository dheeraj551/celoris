import { createServerClient } from "@/lib/supabase-server"
import LearnClient from "./LearnClient"

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
        .from('notice_board_view') // Use a view if possible, or just notice_board
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

    // Fallback to notice_board if view missing (based on previous knowledge of project)
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
        <LearnClient
            initialCourses={dbCourses || []}
            initialNotices={notices || []}
        />
    )
}
