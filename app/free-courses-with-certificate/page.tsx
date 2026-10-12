import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { FreeCoursesView } from "./FreeCoursesView"
import {
    BOOTCAMPS,
    DAYS,
    MIN_ATTENDANCE,
    SESSION_TIME_LABEL,
    currentBatchStart,
    formatBatchDate,
    istDateTime,
    batchEndDate,
} from "@/lib/bootcamps"

// Hub for the free 7-day live bootcamps. Targets "free online courses with
// certificate" searches. The next batch date is computed, so the page stays
// current on its own (refreshed hourly).

export const revalidate = 3600

const URL = "https://celorisdesigns.com/free-courses-with-certificate"
const TITLE = "Free Online Courses with Certificate: Live Classes"
const DESCRIPTION =
    "Free live online courses with certificate in Social Media Reels and Digital Marketing. Alternate evenings (Mon–Sat) plus Sunday sessions at 8 PM & 9 PM IST with real trainers. Earn a verified Celoris certificate and apply to jobs on the Celoris Job Center."

export const metadata: Metadata = {
    // The root layout adds " | Celoris".
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: URL },
    openGraph: {
        title: "Free Live Online Courses with Certificate | Celoris",
        description: DESCRIPTION,
        url: URL,
        siteName: "Celoris",
        locale: "en_IN",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Live Online Courses with Certificate | Celoris",
        description: DESCRIPTION,
    },
}

function getFaqs(batchLabel: string) {
    return [
        {
            q: "Are these courses really free?",
            a: "Yes. The live bootcamp, the final skill test and the certificate are 100% free. You only need to sign in with Google and attend.",
        },
        {
            q: "What is the schedule for both courses?",
            a: "To ensure no clashes between trainers, classes run on alternate evenings till Saturday, plus Sunday: Social Media Reels runs Mon, Wed, Fri at 8:00 PM IST & Sun at 8:00 PM IST. Digital Marketing runs Tue, Thu, Sat at 8:00 PM IST & Sun at 9:00 PM IST.",
        },
        {
            q: "What if I miss a live class on one evening?",
            a: "Because these classes are free and taught live with real trainers, we have no recordings. Students are responsible for being punctual and attending every live session. You must maintain attendance and complete the final skill test to qualify for the certificate.",
        },
        {
            q: "How do I get the certificate?",
            a: "Attend the live sessions, complete your practical assignments, and pass the final skill test. Your verified certificate is then automatically added to your Celoris profile.",
        },
        {
            q: "What can I do with the certificate?",
            a: "Certified students can apply free to certified roles on the Celoris Job Center, and bootcamp graduates are given preference there.",
        },
        {
            q: "Are the classes live or recorded?",
            a: "100% live. Every session is taught live by real industry trainers with real-time Q&A. Recordings are not provided, so students are expected to be punctual.",
        },
        {
            q: "Can I attend both courses at the same time?",
            a: "Yes! Because the schedules run on alternate evenings (Social Media Reels on Mon/Wed/Fri and Digital Marketing on Tue/Thu/Sat) and staggered on Sunday (8:00 PM vs 9:00 PM IST), you can enroll in both courses without any timing clashes and earn both verified certificates.",
        },
        {
            q: "When does the next batch start?",
            a: `A new batch starts every 14 days on Monday. The upcoming batch starts ${batchLabel}. Reserve your seat before the batch fills up.`,
        },
    ]
}

export default function FreeCoursesHubPage() {
    const batch = currentBatchStart()
    const batchLabel = formatBatchDate(batch)
    const faqs = getFaqs(batchLabel)

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ItemList",
                "@id": `${URL}#courses`,
                itemListElement: BOOTCAMPS.map((b, i) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `${URL}/${b.slug}`,
                    item: {
                        "@type": "Course",
                        name: b.title,
                        description: b.tagline,
                        url: `${URL}/${b.slug}`,
                        provider: { "@type": "Organization", name: "Celoris", sameAs: "https://celorisdesigns.com" },
                        offers: { "@type": "Offer", category: "Free", price: 0, priceCurrency: "INR" },
                        hasCourseInstance: {
                            "@type": "CourseInstance",
                            courseMode: "Online",
                            startDate: istDateTime(batch),
                            endDate: istDateTime(batchEndDate(batch)),
                            instructor: { "@type": "Person", name: b.trainer },
                            courseSchedule: { "@type": "Schedule", repeatFrequency: "Weekly", repeatCount: DAYS, duration: "PT1H" },
                        },
                    },
                })),
            },
            {
                "@type": "FAQPage",
                mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
        ],
    }

    return (
        <DashboardShell>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <FreeCoursesView batchLabel={batchLabel} batchIso={batch} faqs={faqs} />
        </DashboardShell>
    )
}
