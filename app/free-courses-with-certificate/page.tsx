import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { FreeCoursesView } from "./FreeCoursesView"
import {
    BOOTCAMPS,
    MIN_ATTENDANCE,
    SESSIONS,
    bootcampDates,
    currentBatchStart,
    formatBatchDate,
    istDateTime,
} from "@/lib/bootcamps"

// Hub for the free live bootcamps (4 sessions per batch). Targets "free online courses with
// certificate" searches. The next batch date is computed, so the page stays
// current on its own (refreshed hourly).

export const revalidate = 3600

const URL = "https://celorisdesigns.com/free-courses-with-certificate"
const TITLE = "Free Online Courses with Certificate: Live Classes (₹1,500 Giveaway)"
const DESCRIPTION =
    "Free live online courses with certificate in Social Media Reels (12:00 PM) and Digital Marketing (3:00 PM) starting 28 Oct 2026. Normally ₹1,500, now 100% free giveaway for a strictly limited 10-seat cohort. Taught live in Hinglish by Celoris mentors with verified certificate and Job Center hiring preference."

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
        images: [
            {
                url: "https://celorisdesigns.com/free-courses/hub.jpg",
                width: 1734,
                height: 907,
                alt: "Free online courses with certificate: live classes, real trainers, Job Center access",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Free Live Online Courses with Certificate | Celoris",
        description: DESCRIPTION,
        images: ["https://celorisdesigns.com/free-courses/hub.jpg"],
    },
}

function getFaqs(batchLabel: string) {
    return [
        {
            q: "Are these courses really free?",
            a: "Yes. Both bootcamps carry an official price of ₹1,500 each, but remaining cohort seats are released as a 100% Free Giveaway. You get all 7 live sessions, personal trainer feedback, the final exam, and verified certificate at zero cost.",
        },
        {
            q: "What is the schedule for both courses?",
            a: "Both bootcamps start on Wednesday, 28 Oct 2026. Social Media Reels runs at 12:00 PM IST (Noon), and Digital Marketing runs at 3:00 PM IST (Afternoon). Each course consists of 7 live one-hour classes with zero timing clashes.",
        },
        {
            q: "Why are seats capped at 10 students per batch?",
            a: "To ensure each student gets individual attention and practical review from the mentor. Our offline marketing has already registered students (5 in Reels, 6 in Digital Marketing), leaving only 4 to 5 free giveaway seats open for online applicants.",
        },
        {
            q: "What if I miss a live class on one day?",
            a: "Because these classes are free and taught live with real trainers, we have no recordings. Students are responsible for being punctual and attending every live session. You must maintain attendance (at least 5 of 7 classes) and complete the final skill test to qualify for the certificate.",
        },
        {
            q: "How do I get the certificate?",
            a: `Attend at least ${MIN_ATTENDANCE} of the ${SESSIONS} live sessions, complete your practical assignments, and pass the final skill test. Your verified certificate is then added to your Celoris profile.`,
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
            q: "When is the final exam?",
            a: `On the second Sunday of your batch, online on Celoris (12:00 PM for Social Media Reels, 3:00 PM for Digital Marketing). Attend at least ${MIN_ATTENDANCE} of the ${SESSIONS} classes to sit the exam.`,
        },
        {
            q: "Can I get extra help outside class?",
            a: "Yes. For a quick doubt or enquiry, you can book a free short call with the team on Google Meet. Private one-to-one sessions with a trainer are paid.",
        },
        {
            q: "Can I attend both courses at the same time?",
            a: "Yes! Because the schedules run at separate hours (Social Media Reels at 12:00 PM IST Noon and Digital Marketing at 3:00 PM IST Afternoon), you can enroll in both courses without any timing clashes and earn dual verified certificates.",
        },
        {
            q: "When does the next batch start?",
            a: `The upcoming batch starts on ${batchLabel}. With only 4 to 5 giveaway seats remaining per track, claim your free seat before the batch closes.`,
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
                itemListElement: BOOTCAMPS.map((b, i) => {
                    const { first, last } = bootcampDates(b, currentBatchStart(new Date(), b))
                    const s0 = b.sessions[0]
                    return {
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
                            startDate: istDateTime(first, s0.hour, s0.minute),
                            endDate: istDateTime(last, b.exam.hour + 1, b.exam.minute),
                            instructor: { "@type": "Person", name: b.trainer },
                            inLanguage: ["hi", "en"],
                            courseWorkload: `PT${SESSIONS}H`,
                            courseSchedule: { "@type": "Schedule", repeatFrequency: "P2D", repeatCount: SESSIONS, duration: "PT1H" },
                        },
                    },
                    }
                }),
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
