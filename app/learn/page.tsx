import { type Metadata } from "next"
import { createServerClient } from "@/lib/supabase-server"
import LearnClient from "./LearnClient"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { nextSession } from "@/lib/class-schedule"
import type { UpcomingClass } from "@/components/learn/FreeOnlineClasses"

export const metadata: Metadata = {
    title: "Celoris Academy — Online Courses & Skill Training in India",
    description: "Learn video editing, AI tools, web development, Excel, and creative skills from real industry trainers. Certified batches and a free tier for students. celorisdesigns.com 🇮🇳",
    openGraph: {
        title: "Celoris Academy — Online Courses & Skill Training in India",
        description: "Learn video editing, AI tools, web development, Excel, and creative skills from real industry trainers. Certified batches and a free tier for students. celorisdesigns.com 🇮🇳",
    }
}

const SITE = "https://www.celorisdesigns.com"
const UPCOMING_WINDOW_MS = 21 * 24 * 60 * 60 * 1000

// Real scheduled classes from Classrooms (Admin → Social → Café Rooms).
async function loadUpcomingClasses(supabase: any): Promise<UpcomingClass[]> {
    const { data, error } = await supabase
        .from('cafe_classrooms')
        .select('id, name, description, category, trainer_name, max_students, current_students, course_url, course_title, course_description, next_class_at, class_duration_minutes, repeats_weekly')
        .eq('is_active', true)
        .not('next_class_at', 'is', null)
    if (error || !data) return []

    const now = new Date()
    return (data as any[])
        .map((room) => {
            const session = nextSession(room, now)
            if (!session || session.start.getTime() - now.getTime() > UPCOMING_WINDOW_MS) return null
            const seats = typeof room.max_students === 'number'
                ? Math.max(0, room.max_students - (room.current_students || 0))
                : null
            const courseUrl = typeof room.course_url === 'string' && /^(\/|https?:\/\/)/.test(room.course_url) ? room.course_url : null
            return {
                id: room.id,
                title: room.name,
                courseTitle: room.course_title || null,
                description: (room.course_description || room.description || '').trim(),
                trainerName: room.trainer_name || null,
                kind: room.category === 'whiteboard' ? 'whiteboard' : 'classroom',
                start: session.start.toISOString(),
                end: session.end.toISOString(),
                isLive: session.isLive,
                seatsLeft: seats,
                courseUrl,
            } as UpcomingClass
        })
        .filter((c): c is UpcomingClass => !!c)
        .sort((a, b) => a.start.localeCompare(b.start))
        .slice(0, 6)
}

// Google "Event" structured data — only for classes that are really scheduled.
function eventsJsonLd(classes: UpcomingClass[]) {
    return classes.map((c) => ({
        "@context": "https://schema.org",
        "@type": "EducationEvent",
        name: c.title,
        ...(c.description ? { description: c.description.slice(0, 500) } : {}),
        startDate: c.start,
        endDate: c.end,
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
        location: { "@type": "VirtualLocation", url: `${SITE}/classrooms?tab=cafe` },
        organizer: { "@type": "Organization", name: "Celoris Designs", url: SITE },
        ...(c.trainerName ? { performer: { "@type": "Person", name: c.trainerName } } : {}),
        url: `${SITE}/learn`,
    }))
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

    const upcomingClasses = await loadUpcomingClasses(supabase)
    const events = eventsJsonLd(upcomingClasses)

    return (
        <DashboardShell>
            {events.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(events).replace(/</g, '\\u003c') }}
                />
            )}
            <LearnClient
                initialCourses={dbCourses || []}
                initialNotices={notices || []}
                upcomingClasses={upcomingClasses}
            />
        </DashboardShell>
    )
}
