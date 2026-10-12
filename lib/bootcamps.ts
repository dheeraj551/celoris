// Free 7-day live bootcamps ("Free online courses with certificate").
// Single source of truth for the hub, the bootcamp pages and the enrollment API.

export type BootcampSlug = "social-media-reels" | "digital-marketing"

export interface BootcampDay {
    day: number
    title: string
    detail: string
}

export interface Bootcamp {
    slug: BootcampSlug
    title: string
    shortTitle: string
    tagline: string
    trainer: string
    /** Job Center badge this bootcamp prepares for (must match certified_jobs.required_badges). */
    badge: string
    /** Matching paid course page, offered after the bootcamp. */
    fullCourseUrl: string
    whoFor: string
    outcomes: string[]
    days: BootcampDay[]
    keywords: string[]
}

/** First batch: Monday 19 Oct 2026. A new 7-day batch starts every Monday. */
export const FIRST_BATCH_START = "2026-10-19"
export const SESSION_TIME_LABEL = "8:00 PM IST"
export const SESSION_HOUR_IST = 20
export const SESSION_MINUTES = 60
export const DAYS = 7
export const MIN_ATTENDANCE = 5

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

/** UTC instant of 8 PM IST on a given IST calendar date (YYYY-MM-DD). */
export function sessionStartUtc(isoDate: string): Date {
    const [y, m, d] = isoDate.split("-").map(Number)
    return new Date(Date.UTC(y, m - 1, d, SESSION_HOUR_IST, 0) - IST_OFFSET_MS)
}

function addDaysIso(isoDate: string, days: number): string {
    const [y, m, d] = isoDate.split("-").map(Number)
    const t = new Date(Date.UTC(y, m - 1, d + days))
    return t.toISOString().slice(0, 10)
}

/**
 * The batch someone joining now should be put in. A batch stays open until its
 * Day 2 session starts, since attending 5 of 7 is still possible after missing Day 1.
 */
export function currentBatchStart(now: Date = new Date()): string {
    let start = FIRST_BATCH_START
    // Joining closes when Day 2 begins (Day 1 start + 24h).
    while (now.getTime() >= sessionStartUtc(start).getTime() + 24 * 60 * 60 * 1000) {
        start = addDaysIso(start, 7)
    }
    return start
}

export function batchEndDate(batchStart: string): string {
    return addDaysIso(batchStart, DAYS - 1)
}

export function formatBatchDate(isoDate: string): string {
    const [y, m, d] = isoDate.split("-").map(Number)
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    })
}

/** ISO-8601 with IST offset, for schema.org. */
export function istDateTime(isoDate: string): string {
    return `${isoDate}T${String(SESSION_HOUR_IST).padStart(2, "0")}:00:00+05:30`
}

export const BOOTCAMPS: Bootcamp[] = [
    {
        slug: "social-media-reels",
        title: "Free Social Media Reels Course with Certificate",
        shortTitle: "Social Media Reels",
        tagline: "Plan, shoot and edit Reels that people actually watch, in 7 live evenings.",
        trainer: "Ananya Jairath",
        badge: "Instagram Reels Video Editor",
        fullCourseUrl: "/learn/course/master-youtube-shorts-instagram-reels",
        whoFor: "Students, job seekers, freelancers and small business owners who want to make Reels for themselves or for clients.",
        outcomes: [
            "Pick a niche and set up a profile that grows",
            "Write 1.5-second hooks and short scripts that hold attention",
            "Shoot clean video and audio on just a smartphone",
            "Edit in CapCut with captions, pacing and trending audio",
            "Read Instagram Insights and improve every next Reel",
            "Build a 3-Reel portfolio you can show clients and employers",
        ],
        days: [
            { day: 1, title: "Niche, audience and how Reels grow in India", detail: "Choose your niche and language, set up your profile, and see what the algorithm rewards." },
            { day: 2, title: "Hooks and scripting", detail: "The first 1.5 seconds, story structure for 15–60 seconds, and writing three scripts of your own." },
            { day: 3, title: "Shooting on a smartphone", detail: "Framing, natural light, clean audio in noisy places, and B-roll that keeps viewers watching." },
            { day: 4, title: "Editing in CapCut", detail: "Cuts, auto-captions, pacing for retention, transitions and colour basics." },
            { day: 5, title: "Trends, audio and AI tools", detail: "Using trending sounds well, AI for ideas and scripts, and cover frames in Canva." },
            { day: 6, title: "Posting and Insights", detail: "When and how to post, reading reach, watch time and shares, and fixing what didn't work." },
            { day: 7, title: "Portfolio, earning and final test", detail: "Assemble your 3-Reel portfolio, how freelancers price Reels, then the final skill test." },
        ],
        keywords: ["free reels course with certificate", "instagram reels course free", "free video editing course with certificate"],
    },
    {
        slug: "digital-marketing",
        title: "Free Digital Marketing Course with Certificate",
        shortTitle: "Digital Marketing",
        tagline: "From funnel basics to running your first campaign, in 7 live evenings.",
        trainer: "Dheeraj Kushwaha",
        badge: "Digital Marketing Executive",
        fullCourseUrl: "/learn/course/digital-marketing-mastery",
        whoFor: "Students, job seekers and business owners who want practical digital marketing skills for a job, freelancing or their own business.",
        outcomes: [
            "Understand the full marketing funnel and where each channel fits",
            "Set up SEO basics and a Google Business Profile",
            "Plan a month of social media content",
            "Launch simple Meta and Google Search ads with a small budget",
            "Track results with GA4, UTM links and conversions",
            "Present a mini campaign plan you can show employers",
        ],
        days: [
            { day: 1, title: "Digital marketing and the funnel", detail: "How people go from stranger to customer, and which channel does what at each step." },
            { day: 2, title: "SEO and Google Business Profile", detail: "Keywords, on-page basics, and getting a local business found on Google Maps." },
            { day: 3, title: "Social media marketing", detail: "Choosing platforms, a content calendar, and posts that get saved and shared." },
            { day: 4, title: "Meta Ads basics", detail: "Audiences, creatives and budgets for Facebook and Instagram ads." },
            { day: 5, title: "Google Search Ads basics", detail: "Keywords, match types, negative keywords and writing ads that get clicks." },
            { day: 6, title: "Analytics and tracking", detail: "GA4, UTM links and conversion tracking, so you know what's working." },
            { day: 7, title: "Your campaign plan and final test", detail: "Build a one-page campaign plan, how to start freelancing or job hunting, then the final skill test." },
        ],
        keywords: ["free digital marketing course with certificate", "digital marketing course free online", "free online courses with certificate"],
    },
]

export function getBootcamp(slug: string): Bootcamp | undefined {
    return BOOTCAMPS.find((b) => b.slug === slug)
}
