import { type Metadata } from "next"
import { createSupabaseClientForServer } from "@/lib/supabase-client"
import { TeachGate } from "@/components/teach-app/TeachGate"
import { TeachLanding, type TeachingSlot } from "@/components/teach-app/TeachLanding"

export const revalidate = 60

const TITLE = "Teach on Celoris: Online & Home Tutoring Jobs Delhi NCR (0% Commission)"
const DESCRIPTION =
    "Stop paying for coins or fake leads. Connect directly with students and verified batches across Delhi/NCR and Pan-India. 0% commission, keep 100% of your earnings."

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "https://celorisdesigns.com/teach" },
    openGraph: {
        title: "Teach on Celoris — 0% Commission, Keep 100% of Your Fees",
        description: DESCRIPTION,
        url: "https://celorisdesigns.com/teach",
        siteName: "Celoris",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: "https://celorisdesigns.com/trainer-ad-campaign-creative.jpg",
                width: 1024,
                height: 1024,
                alt: "Teach on Celoris — 0% Commission",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Teach on Celoris — 0% Commission, Keep 100% of Your Fees",
        description: DESCRIPTION,
        images: ["https://celorisdesigns.com/trainer-ad-campaign-creative.jpg"],
    },
}

const CURATED_FALLBACK_SLOTS: TeachingSlot[] = [
    {
        id: "slot-1",
        subject: "Video Editing (Premiere Pro & Reels Pacing)",
        category: "Creative Tech",
        location: "Noida Sector 62 / Online",
        mode: "Online",
        budget: "₹8,000 – ₹12,000 / mo",
        studentsCount: "1-on-1 (YouTube Creator)",
        timing: "Evenings (6:30 PM)",
        requirement: "Looking for an experienced video editor to mentor me on high-retention reel pacing, sound design, and Premiere Pro shortcuts.",
        timeAgo: "4m ago",
        status: "Urgent",
    },
    {
        id: "slot-2",
        subject: "Python & AI / Machine Learning Tutor",
        category: "Coding & AI",
        location: "Gurugram (Cyber City) / Hybrid",
        mode: "Hybrid",
        budget: "₹1,200 – ₹1,500 / hr",
        studentsCount: "Corporate Working Professional",
        timing: "Weekends (Sat & Sun)",
        requirement: "Need practical weekend mentoring in Python fundamentals, LangChain, API integrations, and hands-on AI model deployment.",
        timeAgo: "11m ago",
        status: "Open Slot",
    },
    {
        id: "slot-3",
        subject: "Advanced Microsoft Excel & Power BI",
        category: "Data & Finance",
        location: "Noida Sector 18 / Online",
        mode: "Online",
        budget: "₹950 / hr",
        studentsCount: "1-on-1 (Financial Analyst)",
        timing: "Weekday Mornings (7:30 AM)",
        requirement: "Need a corporate Excel expert to teach Power Query automation, advanced XLOOKUP, Index-Match, and interactive dashboard creation.",
        timeAgo: "19m ago",
        status: "1 Slot Left",
    },
    {
        id: "slot-4",
        subject: "Graphic & Social Media Design (Photoshop & Canva)",
        category: "Creative Tech",
        location: "South Delhi (Saket)",
        mode: "Home Tuition",
        budget: "₹6,500 – ₹8,500 / mo",
        studentsCount: "E-commerce Brand Owner",
        timing: "3 days a week",
        requirement: "In-person tutor needed in Saket to teach commercial product graphics, Instagram carousel templates, and aesthetic brand identity.",
        timeAgo: "28m ago",
        status: "Filling Fast",
    },
    {
        id: "slot-5",
        subject: "Full-Stack Next.js & TypeScript Mentor",
        category: "Coding & AI",
        location: "Remote / Pan-India",
        mode: "Online",
        budget: "₹1,500 / hr",
        studentsCount: "1-on-1 (Junior Developer)",
        timing: "Flexible Evenings",
        requirement: "Looking for a senior full-stack developer to review my code, explain clean server actions, Supabase database schemas, and Next.js 15+ patterns.",
        timeAgo: "35m ago",
        status: "Urgent",
    },
    {
        id: "slot-6",
        subject: "Spoken English & Corporate Communication",
        category: "Languages",
        location: "Connaught Place, Delhi / Online",
        mode: "Online",
        budget: "₹600 / hr",
        studentsCount: "Job Interview Candidate",
        timing: "Daily 30-min sessions",
        requirement: "Need personalized conversational fluency practice, grammatical corrections, and mock HR interview coaching.",
        timeAgo: "42m ago",
        status: "Open Slot",
    },
    {
        id: "slot-7",
        subject: "Class 11 & 12 CBSE Mathematics & Calculus",
        category: "Academics",
        location: "Indirapuram, Ghaziabad",
        mode: "Home Tuition",
        budget: "₹800 / hr",
        studentsCount: "Class 12 CBSE Student",
        timing: "Alternate Days (5:00 PM)",
        requirement: "Looking for a patient, experienced math tutor to strengthen calculus, vectors, 3D geometry, and board exam question solving.",
        timeAgo: "51m ago",
        status: "1 Slot Left",
    },
    {
        id: "slot-8",
        subject: "Digital Marketing & Meta Ads Campaign Mentorship",
        category: "Marketing",
        location: "Noida Sector 62 / Online",
        mode: "Online",
        budget: "₹10,000 / batch",
        studentsCount: "Small Business Founder",
        timing: "10 Structured Sessions",
        requirement: "Need step-by-step guidance setting up Facebook pixel, custom audience targeting, Advantage+ creative testing, and tracking ROAS.",
        timeAgo: "1h ago",
        status: "Open Slot",
    },
    {
        id: "slot-9",
        subject: "Classical Dance / Kathak Foundation",
        category: "Creative Arts",
        location: "Faridabad / Offline",
        mode: "Home Tuition",
        budget: "₹600 / hr",
        studentsCount: "Beginner Learner",
        timing: "Weekends (11:00 AM)",
        requirement: "Home tutor required for basic Kathak mudras, footwork, and rhythm training for a passionate beginner student.",
        timeAgo: "2h ago",
        status: "Open Slot",
    },
    {
        id: "slot-10",
        subject: "Class 10 CBSE Science & Foundation Physics",
        category: "Academics",
        location: "Dwarka, New Delhi",
        mode: "Home Tuition",
        budget: "₹700 / hr",
        studentsCount: "Class 10 CBSE Student",
        timing: "Tues / Thurs / Sat",
        requirement: "Looking for an engaging tutor to build clear conceptual foundation in electricity, magnetic effects, and chemical reactions.",
        timeAgo: "2h ago",
        status: "Filling Fast",
    },
]

function categorizeCourse(course: string): string {
    const c = (course || "").toLowerCase()
    if (/video|premier|capcut|reel|youtube|after effects/i.test(c)) return "Creative Tech"
    if (/python|ai|machine learning|langchain|code|developer|web|react|next|javascript/i.test(c)) return "Coding & AI"
    if (/excel|power bi|power query|data|analytics|sql/i.test(c)) return "Data & Finance"
    if (/english|spoken|communication|ielts|accent/i.test(c)) return "Languages"
    if (/math|physics|chemistry|cbse|class 10|class 11|class 12|jee|neet|science/i.test(c)) return "Academics"
    if (/marketing|seo|meta ads|social media|smm/i.test(c)) return "Marketing"
    if (/dance|kathak|zumba|guitar|music|yoga/i.test(c)) return "Creative Arts"
    return "Creative Tech"
}

function estimateBudget(course: string, mode: "Online" | "Home Tuition" | "Hybrid"): string {
    const cat = categorizeCourse(course)
    if (cat === "Coding & AI") return mode === "Home Tuition" ? "₹1,500 / hr" : "₹1,200 – ₹1,500 / hr"
    if (cat === "Creative Tech") return "₹8,000 – ₹12,000 / mo"
    if (cat === "Data & Finance") return "₹950 / hr"
    if (cat === "Academics") return mode === "Home Tuition" ? "₹800 / hr" : "₹700 / hr"
    if (cat === "Languages") return "₹600 / hr"
    if (cat === "Marketing") return "₹10,000 / batch"
    return "₹800 / hr"
}

async function loadTeachingSlots(): Promise<TeachingSlot[]> {
    try {
        const supabase = createSupabaseClientForServer()
        const { data, error } = await supabase
            .from("leads")
            .select("id, created_at, course, mode, location, requirement, budget, name")
            .order("created_at", { ascending: false })
            .limit(35)

        if (error) throw error

        const rawRows = ((data || []) as any[]).filter(
            (r) => r.course && String(r.course).trim()
        )

        // Prioritize actual real-world student requirements submitted by learners
        const sortedRows = rawRows.sort((a, b) => {
            const aHasReq = Boolean(a.requirement && String(a.requirement).trim().length > 5)
            const bHasReq = Boolean(b.requirement && String(b.requirement).trim().length > 5)
            if (aHasReq && !bHasReq) return -1
            if (!aHasReq && bHasReq) return 1
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })

        const dbSlots: TeachingSlot[] = sortedRows.map((r, i) => {
            const modeStr = (r.mode || "").toLowerCase()
            let cleanMode: "Online" | "Home Tuition" | "Hybrid" = "Online"
            if (modeStr.includes("home") || modeStr.includes("offline")) cleanMode = "Home Tuition"
            else if (modeStr.includes("hybrid") || modeStr.includes("both")) cleanMode = "Hybrid"

            const diffMin = Math.max(3, Math.round((Date.now() - new Date(r.created_at).getTime()) / 60000))
            const timeAgo = diffMin < 60 ? `${diffMin}m ago` : `${Math.round(diffMin / 60)}h ago`

            const firstName = r.name ? String(r.name).trim().split(" ")[0] : ""
            const studentLabel = firstName ? `${firstName} (Verified Student)` : "Verified Student"

            return {
                id: String(r.id || `lead-${i}`),
                subject: String(r.course),
                category: categorizeCourse(r.course),
                location: r.location ? String(r.location).trim().replace(/,+$/, "") : (cleanMode === "Online" ? "Pan-India / Remote" : "Delhi NCR"),
                mode: cleanMode,
                budget: r.budget || estimateBudget(r.course, cleanMode),
                studentsCount: "1-on-1 Student",
                timing: "Flexible Evenings",
                requirement: r.requirement || `Student looking for verified 1-on-1 guidance in ${r.course}.`,
                timeAgo,
                status: i % 2 === 0 ? "Urgent" : "Open Slot",
                studentName: studentLabel,
            }
        })

        // Merge DB rows with curated fallback slots so the slots grid is always full and rich
        const combined = [...dbSlots, ...CURATED_FALLBACK_SLOTS]
        return combined.slice(0, 16)
    } catch (e) {
        // Fallback gracefully to curated slots without throwing dev overlay
        return CURATED_FALLBACK_SLOTS
    }
}

export default async function TeachPage({
    params,
}: {
    params: Promise<{ slug?: string[] }>
}) {
    const resolvedParams = await params
    const slug = resolvedParams?.slug
    const slots = await loadTeachingSlots()

    const webpageJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://celorisdesigns.com/teach#webpage",
        url: "https://celorisdesigns.com/teach",
        name: `${TITLE} | Celoris`,
        description: DESCRIPTION,
        inLanguage: "en-IN",
        isPartOf: { "@type": "WebSite", name: "Celoris", url: "https://celorisdesigns.com" },
        publisher: { "@type": "Organization", name: "Celoris Designs LLP", url: "https://celorisdesigns.com" },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageJsonLd) }}
            />
            <TeachGate
                initialSlug={slug}
                landing={<TeachLanding slots={slots} />}
            />
        </>
    )
}
