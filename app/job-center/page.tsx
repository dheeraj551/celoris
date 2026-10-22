import { type Metadata } from "next"
import { createSupabaseClientForServer } from "@/lib/supabase-client"
import { JobCenterGate } from "@/components/job-center/JobCenterGate"
import { JobCenterLanding, type PublicJob } from "@/components/job-center/JobCenterLanding"

// /job-center
// Signed-out visitors (and Google) get a public landing page: the tagline, how
// the free skill tests work and the open roles. Signed-in users get the
// SkillVerify app exactly as before. The open roles are read on the server and
// refreshed every 30 minutes, so the page stays fast and indexable.

export const revalidate = 1800

const TITLE = "Get Hired Online on Skills - Free Skill Test & Verified Employers | Celoris Job Center"
const DESCRIPTION =
    "Get hired online without a resume. Take a free 5-minute skill test, get your verified Celoris Skill ID and connect directly with verified employers. 0% commission."

const KEYWORDS = [
    "get hired online",
    "skill-based jobs",
    "online skill test for jobs",
    "jobs without resume",
    "verified employers India",
    "no commission job portal",
    "Celoris Job Center",
    "Celoris Skill ID",
]

export const metadata: Metadata = {
    title: {
        absolute: TITLE,
    },
    description: DESCRIPTION,
    keywords: KEYWORDS,
    alternates: { canonical: "https://celorisdesigns.com/job-center" },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: "https://celorisdesigns.com/job-center",
        siteName: "Celoris",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: "https://celorisdesigns.com/hero-banner.jpg",
                width: 1200,
                height: 630,
                alt: "Celoris Job Center — Free Skill Tests & Remote Jobs",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
        images: ["https://celorisdesigns.com/hero-banner.jpg"],
    },
}

async function loadOpenJobs(): Promise<PublicJob[]> {
    try {
        const supabase = createSupabaseClientForServer()
        // Only safe, public columns. Imported listings from other marketplaces
        // are left off the public page.
        const { data, error } = await supabase
            .from("certified_jobs")
            .select("id, title, company, location, salary_range, industry, work_mode, required_badges, created_at, source")
            .eq("status", "active")
            .order("featured", { ascending: false })
            .order("created_at", { ascending: false })
            .limit(24)
        if (error) throw error
        return ((data || []) as any[])
            .filter((r) => r.source !== "freelancer_import" && r.source !== "linkedin_import")
            .map((r) => ({
                id: String(r.id),
                title: String(r.title || "").trim(),
                company: (!r.company || /confidential/i.test(r.company)) ? "Celoris" : String(r.company).trim(),
                location: String(r.location || "").trim(),
                pay: String(r.salary_range || "").trim(),
                industry: String(r.industry || "").trim(),
                workMode: String(r.work_mode || "").trim(),
                badges: Array.isArray(r.required_badges) ? r.required_badges.map(String).slice(0, 3) : [],
                createdAt: String(r.created_at || ""),
            }))
            .filter((j) => j.title)
    } catch (e) {
        console.error("[job-center] open jobs", e)
        return []
    }
}

export default async function JobCenterPage() {
    const jobs = await loadOpenJobs()

    const webpageJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": "https://celorisdesigns.com/job-center#webpage",
        url: "https://celorisdesigns.com/job-center",
        name: TITLE,
        description: DESCRIPTION,
        keywords: KEYWORDS.join(", "),
        inLanguage: "en-IN",
        isPartOf: { "@type": "WebSite", name: "Celoris", url: "https://celorisdesigns.com" },
        publisher: { "@type": "Organization", name: "Celoris Designs LLP", url: "https://celorisdesigns.com" },
    }

    const jobPostingsJsonLd = jobs.map((job) => {
        const isRemote = /remote|online|work from home|anywhere/i.test(`${job.workMode} ${job.location}`)
        const postedDate = job.createdAt ? new Date(job.createdAt).toISOString() : new Date().toISOString()
        const validThroughDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()

        return {
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: `We are looking for a certified candidate for the role of ${job.title}. Requirements: Celoris Skill Verification (${job.badges.join(', ') || 'Certified'}). Compensation: ${job.pay || 'Competitive'}. Take the free skill test on Celoris Job Center to earn your badge and apply.`,
            identifier: {
                "@type": "PropertyValue",
                name: "Celoris Job Center",
                value: job.id,
            },
            datePosted: postedDate,
            validThrough: validThroughDate,
            employmentType: /intern/i.test(job.title) ? "INTERN" : /part/i.test(job.workMode) ? "PART_TIME" : "CONTRACTOR",
            hiringOrganization: {
                "@type": "Organization",
                name: job.company && !/confidential/i.test(job.company) ? job.company : "Celoris Partner",
                sameAs: "https://celorisdesigns.com",
            },
            ...(isRemote
                ? {
                      jobLocationType: "TELECOMMUTE",
                      applicantLocationRequirements: {
                          "@type": "Country",
                          name: "India",
                      },
                  }
                : {}),
            jobLocation: {
                "@type": "Place",
                address: {
                    "@type": "PostalAddress",
                    addressCountry: "IN",
                    addressLocality: job.location && !/remote/i.test(job.location) ? job.location : "New Delhi",
                    addressRegion: "Delhi NCR",
                },
            },
        }
    })

    const schemas = [webpageJsonLd, ...jobPostingsJsonLd]

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, '\\u003c') }} />
            <JobCenterGate landing={<JobCenterLanding jobs={jobs} />} />
        </>
    )
}
