// Free live bootcamps ("Free online courses with certificate"): 7 one-hour live
// classes over two weeks on alternate evenings, then a final exam on the second
// Sunday. A new batch starts every 14 days.
// Single source of truth for the hub, the bootcamp pages and the enrollment API.

export type BootcampSlug = "social-media-reels" | "digital-marketing"

export interface BootcampDay {
    /** Session number, 1-based. */
    day: number
    title: string
    detail: string
}

/** One live session, relative to the batch's Monday (IST). */
export interface BootcampSession {
    offsetDays: number
    hour: number
    minute: number
    /** e.g. "Mon 8:00 PM" */
    label: string
}

export interface Bootcamp {
    slug: BootcampSlug
    title: string
    shortTitle: string
    tagline: string
    trainer: string
    /** Job Center badge this bootcamp prepares for (must match certified_jobs.required_badges). */
    badge: string
    /** Specific schedule for this course */
    scheduleLabel?: string
    /** Trainer credibility title/role */
    trainerRole?: string
    /** Matching paid course page, offered after the bootcamp. */
    fullCourseUrl: string
    whoFor: string
    outcomes: string[]
    days: BootcampDay[]
    /** Exact class times, in the same order as `days`. */
    sessions: BootcampSession[]
    /** Final certification exam (Sunday of week 2). */
    exam: BootcampSession
    keywords: string[]
    originalPrice: number
    offlineEnrolled: number
    totalSeats: number
    startTimeLabel?: string
}

/** First batch: Wednesday 28 Oct 2026. A new batch starts every 14 days. */
export const FIRST_BATCH_START = "2026-10-28"
export const BATCH_CYCLE_DAYS = 14
export const SESSION_TIME_LABEL = "Live Interactive Sessions"
export const SESSION_HOUR_IST = 12
export const SESSION_MINUTES = 60
/** Live one-hour classes per batch (7 hours in total). */
export const SESSIONS = 7
/** Kept for older imports: number of sessions, not calendar days. */
export const DAYS = SESSIONS
/** Certificate rule: attend at least this many of the SESSIONS, then pass the final exam. */
export const MIN_ATTENDANCE = 5
/** Seats per bootcamp per batch (enforced by the enrollment API). */
export const SEATS_PER_BATCH = 10

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000

function addDaysIso(isoDate: string, days: number): string {
    const [y, m, d] = isoDate.split("-").map(Number)
    const t = new Date(Date.UTC(y, m - 1, d + days))
    return t.toISOString().slice(0, 10)
}

/** UTC instant of an IST wall-clock time on an IST calendar date (YYYY-MM-DD). */
function istInstant(isoDate: string, hour: number, minute = 0): Date {
    const [y, m, d] = isoDate.split("-").map(Number)
    return new Date(Date.UTC(y, m - 1, d, hour, minute) - IST_OFFSET_MS)
}

/** UTC instant of 8 PM IST on a given IST calendar date (YYYY-MM-DD). */
export function sessionStartUtc(isoDate: string): Date {
    return istInstant(isoDate, SESSION_HOUR_IST)
}

/** Every live session of a bootcamp in a batch, as UTC instants. */
export function sessionInstants(b: Bootcamp, batchStart: string): Date[] {
    return b.sessions.map((s) => istInstant(addDaysIso(batchStart, s.offsetDays), s.hour, s.minute))
}

/** UTC instant of the final exam of a bootcamp in a batch. */
export function examInstant(b: Bootcamp, batchStart: string): Date {
    return istInstant(addDaysIso(batchStart, b.exam.offsetDays), b.exam.hour, b.exam.minute)
}

/** IST calendar dates (YYYY-MM-DD) of the first class and the exam day of a bootcamp in a batch. */
export function bootcampDates(b: Bootcamp, batchStart: string): { first: string; last: string; exam: string } {
    const offsets = b.sessions.map((s) => s.offsetDays)
    const exam = addDaysIso(batchStart, b.exam.offsetDays)
    return { first: addDaysIso(batchStart, Math.min(...offsets)), last: exam, exam }
}

/**
 * The batch someone joining now should be put in. Joining stays open until the
 * bootcamp's 2nd class starts (5 of 7 is still possible after missing class 1).
 * Without a bootcamp, the earliest cut-off of all bootcamps is used.
 */
export function currentBatchStart(now: Date = new Date(), b?: Bootcamp): string {
    const list = b ? [b] : BOOTCAMPS
    const cutoff = (start: string) => Math.min(...list.map((x) => sessionInstants(x, start)[1].getTime()))
    let start = FIRST_BATCH_START
    while (now.getTime() >= cutoff(start)) {
        start = addDaysIso(start, BATCH_CYCLE_DAYS)
    }
    return start
}

export function nextBatchStart(batchStart: string): string {
    return addDaysIso(batchStart, BATCH_CYCLE_DAYS)
}

/** Last calendar day of a batch: the exam Sunday of week 2. */
export function batchEndDate(batchStart: string): string {
    return addDaysIso(batchStart, 13)
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

/** ISO-8601 with IST offset, for schema.org. Defaults to 8 PM IST. */
export function istDateTime(isoDate: string, hour: number = SESSION_HOUR_IST, minute = 0): string {
    return `${isoDate}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+05:30`
}

export const BOOTCAMPS: Bootcamp[] = [
    {
        slug: "social-media-reels",
        title: "Free Social Media Reels Course with Certificate",
        shortTitle: "Social Media Reels",
        tagline: "Plan, shoot and edit Reels that people actually watch: 7 live hours over two weeks.",
        trainer: "Ananya Jairath",
        trainerRole: "Commercial Video Creator & Content Mentor",
        badge: "Instagram Reels Video Editor",
        scheduleLabel: "Starts Wed 28 Oct at 12:00 PM IST (Noon) · 7 Live Sessions",
        startTimeLabel: "12:00 PM IST (Noon)",
        originalPrice: 1500,
        offlineEnrolled: 5,
        totalSeats: 10,
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
            { day: 1, title: "Niche, audience and the Reels algorithm", detail: "How Reels grow in India in 2026, choosing a niche and language, and setting up your profile." },
            { day: 2, title: "Hooks and scripting", detail: "The first 1.5 seconds, story structure for 15–60 seconds, and writing three scripts of your own." },
            { day: 3, title: "Shooting on a smartphone", detail: "Framing, natural light, clean audio in noisy places, and B-roll that keeps viewers watching." },
            { day: 4, title: "Editing in CapCut", detail: "Cuts, auto-captions, pacing for retention, transitions and colour basics." },
            { day: 5, title: "Trends, audio and AI tools", detail: "Using trending sounds well, AI for ideas and scripts, and cover frames in Canva." },
            { day: 6, title: "Posting and Insights", detail: "When and how to post, reading reach, watch time and shares, and fixing what didn't work." },
            { day: 7, title: "Portfolio and freelancing", detail: "Assemble your 3-Reel portfolio, find clients, and price your Reels work." },
        ],
        sessions: [
            { offsetDays: 0, hour: 12, minute: 0, label: "Week 1 · Wed 12:00 PM" },
            { offsetDays: 2, hour: 12, minute: 0, label: "Week 1 · Fri 12:00 PM" },
            { offsetDays: 4, hour: 12, minute: 0, label: "Week 1 · Sun 12:00 PM" },
            { offsetDays: 7, hour: 12, minute: 0, label: "Week 2 · Wed 12:00 PM" },
            { offsetDays: 9, hour: 12, minute: 0, label: "Week 2 · Fri 12:00 PM" },
            { offsetDays: 11, hour: 12, minute: 0, label: "Week 2 · Sun 12:00 PM" },
            { offsetDays: 12, hour: 12, minute: 0, label: "Week 2 · Mon 12:00 PM" },
        ],
        exam: { offsetDays: 13, hour: 12, minute: 0, label: "Week 2 · Tue 12:00 PM" },
        keywords: ["free reels course with certificate", "instagram reels course free", "free video editing course with certificate"],
    },
    {
        slug: "digital-marketing",
        title: "Free Digital Marketing Course with Certificate",
        shortTitle: "Digital Marketing",
        tagline: "From funnel basics to your first campaign plan: 7 live hours over two weeks.",
        trainer: "Dheeraj Kushwaha",
        trainerRole: "Performance Marketing & Growth Strategist",
        badge: "Digital Marketing Executive",
        scheduleLabel: "Starts Wed 28 Oct at 3:00 PM IST (Afternoon) · 7 Live Sessions",
        startTimeLabel: "3:00 PM IST (Afternoon)",
        originalPrice: 1500,
        offlineEnrolled: 6,
        totalSeats: 10,
        fullCourseUrl: "/learn/course/digital-marketing-mastery",
        whoFor: "Students, job seekers and business owners who want practical digital marketing skills for a job, freelancing or their own business.",
        outcomes: [
            "Understand the full marketing funnel and where each channel fits",
            "Set up SEO basics and a Google Business Profile",
            "Plan a month of social media content",
            "Launch simple Meta and Google Search ads with a small budget",
            "Track results with GA4, UTM links and conversions",
            "Present a one-page campaign plan you can show employers",
        ],
        days: [
            { day: 1, title: "Digital marketing and the funnel", detail: "Customer journey mapping, buyer personas, and which channel does what at each step." },
            { day: 2, title: "SEO and Google Business Profile", detail: "Keyword research, on-page basics, and getting a local business found on Google Maps." },
            { day: 3, title: "Social media marketing", detail: "Choosing platforms, a content calendar, and posts that get saved and shared." },
            { day: 4, title: "Meta Ads basics", detail: "The Meta Pixel, audiences, creatives and budgets for Facebook and Instagram ads." },
            { day: 5, title: "Google Search Ads basics", detail: "Keywords, match types, negative keywords and writing ads that get clicks." },
            { day: 6, title: "Analytics and tracking", detail: "GA4, UTM links and conversion tracking, so you know what's working." },
            { day: 7, title: "Your campaign plan", detail: "Build a one-page client campaign plan, and how to start freelancing or job hunting." },
        ],
        sessions: [
            { offsetDays: 0, hour: 15, minute: 0, label: "Week 1 · Wed 3:00 PM" },
            { offsetDays: 2, hour: 15, minute: 0, label: "Week 1 · Fri 3:00 PM" },
            { offsetDays: 4, hour: 15, minute: 0, label: "Week 1 · Sun 3:00 PM" },
            { offsetDays: 7, hour: 15, minute: 0, label: "Week 2 · Wed 3:00 PM" },
            { offsetDays: 9, hour: 15, minute: 0, label: "Week 2 · Fri 3:00 PM" },
            { offsetDays: 11, hour: 15, minute: 0, label: "Week 2 · Sun 3:00 PM" },
            { offsetDays: 12, hour: 15, minute: 0, label: "Week 2 · Mon 3:00 PM" },
        ],
        exam: { offsetDays: 13, hour: 15, minute: 0, label: "Week 2 · Tue 3:00 PM" },
        keywords: ["free digital marketing course with certificate", "digital marketing course free online", "free online courses with certificate"],
    },
]

export function getBootcamp(slug: string): Bootcamp | undefined {
    return BOOTCAMPS.find((b) => b.slug === slug)
}
