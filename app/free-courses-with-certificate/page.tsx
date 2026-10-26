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
import { getSeatStats } from "@/lib/bootcamp-seats"
import { getBootcampClassrooms } from "@/lib/bootcamp-classrooms"

// Hub for the free live bootcamps (7 sessions per batch). Targets "free online courses with
// certificate" searches. The next batch date is computed and the seat numbers are read
// live from the applications, so the page stays current on its own (refreshed every 5 minutes).

export const revalidate = 300

const URL = "https://celorisdesigns.com/free-courses-with-certificate"
const TITLE = "Festive Offer: Free Giveaways with Certificate | Live Online Courses"
const DESCRIPTION =
    "Festive Offer: free seats for selected students in Social Media Reels (12:00 PM) and Digital Marketing (3:00 PM) live courses, starting 28 Oct 2026. Normally ₹1,500 each, 10 seats per batch. Taught live in Hinglish by Celoris trainers, with a verified certificate and Job Center preference."

export const metadata: Metadata = {
    // The root layout adds " | Celoris".
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: URL },
    openGraph: {
        title: "Festive Offer: Free Course Giveaways with Certificate | Celoris",
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
            a: "Yes, for selected students. Both courses normally cost ₹1,500 each. Paid students fill part of every batch, and the remaining seats are given free to the applicants we select. A free seat gets you all 7 live classes, trainer feedback, the final exam and the verified certificate at zero cost.",
        },
        {
            q: "What is the schedule for both courses?",
            a: "Both bootcamps start on Wednesday, 28 Oct 2026. Social Media Reels runs at 12:00 PM IST (Noon), and Digital Marketing runs at 3:00 PM IST (Afternoon). Each course consists of 7 live one-hour classes with zero timing clashes.",
        },
        {
            q: "Why are seats capped at 10 students per batch?",
            a: "So that every student gets individual attention and practical review from the trainer. In this batch, paid students already took 5 seats in Reels and 6 in Digital Marketing, which leaves 9 free seats in total for the applicants we select.",
        },
        {
            q: "How are the free seats given out?",
            a: "Sign in with Google and answer one question: what will you do with this skill in the next 3 months? Our team reads every application and picks the students who are most likely to use the skill. Selected students get a WhatsApp message with the class link before Class 1. If you are not picked, you can join at the normal fee or apply again for the next batch.",
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
            a: `On the last day of your batch, the Tuesday of week 2, online on Celoris (12:00 PM for Social Media Reels, 3:00 PM for Digital Marketing). Attend at least ${MIN_ATTENDANCE} of the ${SESSIONS} classes to sit the exam.`,
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
            a: `The upcoming batch starts on ${batchLabel}, and a new batch starts every 14 days after that. Apply for a free seat before the batch starts.`,
        },
    ]
}

export default async function FreeCoursesHubPage() {
    const batch = currentBatchStart()
    const batchLabel = formatBatchDate(batch)
    const faqs = getFaqs(batchLabel)
    const [seats, classrooms] = await Promise.all([getSeatStats(), getBootcampClassrooms()])
    // "Wed, 28 Oct 2026, 12:00 PM IST" for each bootcamp's first class
    const firstClassLabels = Object.fromEntries(
        BOOTCAMPS.map((b) => {
            const { first } = bootcampDates(b, currentBatchStart(new Date(), b))
            return [b.slug, `${formatBatchDate(first)}, ${(b.startTimeLabel || "").replace(/\s*\(.*\)\s*$/, "")}`]
        })
    )

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
            <FreeCoursesView batchLabel={batchLabel} batchIso={batch} faqs={faqs} seats={seats} classrooms={classrooms} firstClassLabels={firstClassLabels} />
        </DashboardShell>
    )
}
