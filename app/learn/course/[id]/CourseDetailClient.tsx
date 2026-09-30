"use client"

// Course detail page (client part). The server page (./page.tsx) loads the
// course and its live batch figures and passes them in, so the full page —
// title, description, curriculum, FAQs, schedule — is in the HTML that
// Google and AI crawlers read. Batch figures then refresh live in the browser.

import { useState, useRef } from "react"
import {
  ArrowLeft,
  Play,
  CheckCircle,
  BookOpen,
  HelpCircle,
  Sparkles,
  Gift,
  Eye,
  X,
  MessageCircle,
  ShieldCheck,
  Flame,
  ExternalLink,
  Download,
  Copy,
  Check,
  Volume2,
  VolumeX
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"
import { CourseTrainerBooth } from "@/components/learn/CourseTrainerBooth"
import { CourseNoticeBoardMini } from "@/components/learn/CourseNoticeBoardMini"
import { CourseVideoStudioShowcase } from "@/components/learn/CourseVideoStudioShowcase"
import { LaunchOfferCard, useCourseBatch } from "@/components/learn/CourseLaunchOffer"
import { CourseReviews } from "@/components/reviews/CourseReviews"
import { getFaqsForCourse } from "@/lib/course-faqs"
import { COURSE_SEO } from "@/lib/course-slugs"
import { inr, istFullDate, istTime, type CourseBatchInfo } from "@/lib/course-batch-types"

interface CourseTopic {
  id: string
  order_in_module: number
  title: string
  short_description: string | null
}

interface Course {
  id: string
  title: string
  subject: string
  grade_level: string
  description: string
  target_audience: string
  instructor_name: string | null
  course_duration: string | null
  price: number
  course_image_url: string | null
  is_featured: boolean
  created_at: string
  course_modules?: CourseModule[]
  students_count?: number
  rating?: number
  instructor_bio?: string | null
  learning_outcomes?: string[] | null
  requirements?: string[] | null
  preview_video_url?: string | null
  syllabus_url?: string | null
}

interface CourseModule {
  id: string
  course_id: string
  module_number: number
  title: string
  description: string | null
  estimated_duration: number | null
  course_topics?: CourseTopic[]
}

const sectionTitle = "text-2xl font-semibold leading-none tracking-tight"

export default function CourseDetailClient({
  initialCourse,
  initialBatch,
  courseKey,
}: {
  initialCourse: Course
  initialBatch: CourseBatchInfo | null
  courseKey: string
}) {
  const course = initialCourse
  const { batch, refresh } = useCourseBatch(courseKey, initialBatch)
  const modules = [...(course.course_modules || [])].sort((a, b) => a.module_number - b.module_number)

  const webDevTestimonials = [
    { name: "Rohit Malhotra", time: "2 weeks ago", stars: 5, text: "Genuinely one of the better web dev courses I've taken. The way they've woven in AI tools like Copilot and ChatGPT for debugging and speeding up coding was a game changer. Went from zero to building a full portfolio site in about 6 weeks." },
    { name: "Priya Sharma", time: "1 month ago", stars: 4, text: "Solid course overall. HTML/CSS/JS fundamentals were taught really well and the trainer was patient with beginners like me. Only wish there was a bit more depth on backend/database stuff — felt slightly rushed in the last few sessions." },
    { name: "Amit Verma", time: "3 weeks ago", stars: 3, text: "Decent content but the pacing was uneven. Some weeks felt too slow (basic HTML tags) and then suddenly we jumped into AI-assisted workflows without much warm-up. Trainer was knowledgeable though, always answered doubts on time." },
    { name: "Neha Kapoor", time: "5 days ago", stars: 5, text: "Loved this! I run a small boutique business and wanted to build my own site instead of paying a developer. This course gave me exactly that confidence. Using AI tools alongside actual coding basics made it so much easier to understand what's happening under the hood." },
    { name: "Sahil Chaudhary", time: "2 months ago", stars: 4, text: "Good ROI for the price. Projects were practical and portfolio-ready. Would've liked more live coding sessions vs recorded content, but the trainer support on WhatsApp made up for it." },
    { name: "Karan Singh", time: "1 month ago", stars: 2, text: "Content is fine but I expected more structured mentorship. Felt like a lot of self-paced learning with occasional check-ins. If you're a complete beginner, be ready to put in extra hours outside class to actually keep up." },
    { name: "Ananya Gupta", time: "3 days ago", stars: 5, text: "Best decision I made this year. Switched careers from marketing to web dev and this course's AI-integrated approach made coding feel way less intimidating. Trainer explained concepts with real examples, not just theory." },
    { name: "Vikas Yadav", time: "6 weeks ago", stars: 4, text: "Pretty comprehensive — covered HTML, CSS, JS basics and then how to use AI tools to build faster. Support team was responsive when I had scheduling issues. Docking one star only because the certificate design/branding felt a bit basic." },
    { name: "Ritika Bansal", time: "2 weeks ago", stars: 3, text: "It's a good starting point if you're new to web dev, but if you already know some HTML/CSS, you might find the first couple of weeks a bit repetitive. The AI tools segment was the most valuable part for me." },
    { name: "Deepak Rana", time: "4 days ago", stars: 5, text: "Honestly didn't expect this much value for the price. The trainer clearly knows both coding and how to actually use AI tools in a real workflow, not just buzzwords. Built 3 projects by the end, which helped me land freelance gigs already." },
  ];

  const copilotTestimonials = [
    { name: "Priya Ramanathan", time: "1 week ago", stars: 5, text: "I've used Excel for years but never touched Copilot until this course. The module on prompt-writing best practices alone was worth it — I went from vague one-line prompts to getting exactly what I wanted on the first try. The capstone project tied everything together nicely." },
    { name: "Rohan Deshmukh", time: "3 weeks ago", stars: 3, text: "Solid course overall, but Module 6 on Agent Mode felt rushed compared to everything else. I had to rewatch it twice and still felt a little unsure setting checkpoints. Would love a longer walkthrough with a messier real-world example." },
    { name: "Sneha Iyer", time: "2 weeks ago", stars: 5, text: "I kept confusing Plan mode and Agent mode before taking this course. The side-by-side comparison in Module 5 made it click immediately. Also appreciated the honesty about verifying Copilot's output instead of just trusting it blindly." },
    { name: "Arjun Malhotra", time: "1 month ago", stars: 2, text: "The course itself is well structured, but Copilot's UI changed twice while I was going through it and some screenshots/references no longer matched what I saw in my own Excel. Not really the instructor's fault since Microsoft updates constantly, but frustrating as a learner." },
    { name: "Ananya Krishnan", time: "4 days ago", stars: 4, text: "If you already know basic Excel, this is a great next step. The data-cleaning prompts in Module 2 saved me real time this week at work. Docked one star because I wish there were more practice files — some exercises reused the same dataset." },
    { name: "Vikram Nair", time: "5 weeks ago", stars: 5, text: "A lot of Excel courses are just \"watch me click buttons.\" This one made me actually do the work with a messy dataset at the end, which is where the real learning happened. Highly recommend for anyone who learns by doing." },
    { name: "Kavya Reddy", time: "2 months ago", stars: 3, text: "Wish this had been clearer upfront about licensing costs before diving into features I couldn't actually try without paying more for a Copilot add-on. The content itself is fine, just wasn't fully prepared for that." },
    { name: "Aditya Chatterjee", time: "6 days ago", stars: 4, text: "Module 3 on natural-language formulas was excellent — I finally stopped Googling XLOOKUP syntax every time. Minor gripe: the debugging section could use one more example with a genuinely broken formula." },
    { name: "Meera Pillai", time: "3 days ago", stars: 2, text: "I wanted more time actually watching prompts being typed and results appearing in real time. Some lessons explain concepts well but don't show enough live examples inside the spreadsheet itself." },
    { name: "Karan Bhatia", time: "1 week ago", stars: 5, text: "I run reports every week for my team and this course cut my prep time nearly in half. The PivotTable and charting prompts in Module 4 alone paid for the course. Well organized from start to finish." },
  ];

  const shortFormVideoTestimonials = [
    {
      name: "Aakash Verma",
      role: "College Student, Delhi",
      time: "3 days ago",
      stars: 5,
      text: "I was extremely camera-shy and thought I needed an iPhone or expensive Sony camera to make Reels. In Week 3, the trainer showed how to shoot crisp video on my basic Redmi Note using natural window light. The 1.5-second hook formula changed everything — my 5th reel crossed 48k views after being stuck at 200 views for months. Worth every rupee."
    },
    {
      name: "Pooja Sundaram",
      role: "Handmade Jewelry Brand, Bengaluru",
      time: "1 week ago",
      stars: 5,
      text: "I was paying agencies ₹15,000/month with zero sales. This course taught me how to tell genuine product stories instead of boring ads. The Week 4 module on CapCut retention editing and sound design was pure gold. Last week, one of our packaging Reels hit 110k views and brought us 35 direct D2C orders in 48 hours."
    },
    {
      name: "Rahul Nair",
      role: "Software Engineer & Tech Creator, Pune",
      time: "2 weeks ago",
      stars: 5,
      text: "As a full-time IT professional, my biggest bottleneck was time. Week 2’s ideation framework and batch-shooting workflow allowed me to shoot 8 Reels in just 2 hours on a Sunday. The breakdown of the YouTube Shorts algorithm vs Instagram Reels algorithm was the clearest I've seen anywhere in India."
    },
    {
      name: "Simran Kaur",
      role: "Finance & Career Creator, Chandigarh",
      time: "5 days ago",
      stars: 5,
      text: "Most courses only teach editing. This masterclass actually taught monetization in Week 6. Using the brand pitch templates provided in the course, I closed my first paid brand sponsorship (₹4,500) within 3 weeks of finishing the classes. If you're serious about taking creator income seriously, don't think twice."
    },
    {
      name: "Tanmay Deshmukh",
      role: "Fitness Creator, Mumbai",
      time: "1 week ago",
      stars: 5,
      text: "I used to post randomly and blame the algorithm when videos flopped. The course made me realize my retention was dropping in the first 3 seconds because of slow intros. Once I applied the pacing and text overlay rules taught in Week 4, my average watch percentage jumped from 45% to 82%, and I gained 3,200 subscribers in 30 days."
    },
    {
      name: "Meghna Joshi",
      role: "Lifestyle & Food Creator, Jaipur",
      time: "4 days ago",
      stars: 5,
      text: "The B-roll techniques in Week 3 completely elevated my videos. You don't realize how much audio and multi-angle shooting matters until you see before-and-after comparisons. Also, the trainer WhatsApp support for feedback on our rough cuts was invaluable!"
    }
  ];

  // Reviews carried over from the earlier Celoris website — shown only on the
  // course they were written for (they used to appear on every course).
  const getTestimonialsForCourse = (courseTitle: string) => {
    const title = courseTitle.toLowerCase();
    if (title.includes("short-form") || title.includes("shorts") || title.includes("reels")) {
      return shortFormVideoTestimonials;
    }
    if (title.includes("copilot")) {
      return copilotTestimonials;
    }
    if (title.includes("web development")) {
      return webDevTestimonials;
    }
    return [];
  };

  const faqs = getFaqsForCourse(course.title, { batch, price: course.price, modules: modules.length });
  const testimonials = getTestimonialsForCourse(course.title);

  const whatYouWillLearn = course?.learning_outcomes && course.learning_outcomes.length > 0
    ? course.learning_outcomes
    : [
      "No learning outcomes specified yet.",
    ]

  const requirements = course?.requirements && course.requirements.length > 0
    ? course.requirements
    : [
      "No specific requirements listed.",
    ]

  // Calculate derived stats
  const totalDuration = modules.reduce((acc, curr) => acc + (curr.estimated_duration || 0), 0)
  const durationDisplay = course.course_duration || (totalDuration > 0 ? `${Math.ceil(totalDuration / 60)} hours` : "—")
  const heroImage = COURSE_SEO[course.id]?.heroImage || course.course_image_url
  const trainerNames = batch?.trainers?.length ? batch.trainers.map((t) => t.name) : [batch?.trainerName || course.instructor_name].filter(Boolean) as string[]
  const fee = Number(course.price) > 0 ? Number(course.price) : 0
  const offer = batch?.offer && batch.offer.active ? batch.offer : null

  // Bonus pack & interactive states
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [bonusActiveTab, setBonusActiveTab] = useState<"hooks" | "pitch" | "calendar" | "sfx">("hooks");
  const [copiedHookIndex, setCopiedHookIndex] = useState<number | null>(null);

  // Hero interactive video player
  const [heroMuted, setHeroMuted] = useState(true);
  const [heroPlaying, setHeroPlaying] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const isShortForm =
    course.title.toLowerCase().includes("short-form") ||
    course.title.toLowerCase().includes("shorts") ||
    course.title.toLowerCase().includes("reels");

  const copyToClipboard = (text: string, index: number) => {
    if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedHookIndex(index);
      setTimeout(() => setCopiedHookIndex(null), 2000);
    }
  };

  // Plain facts near the top — the quick answers people (and AI search) look for.
  const facts: { label: string; value: string }[] = [
    { label: "Format", value: batch?.roomId ? "Live online classes in Celoris Classrooms" : "Online, trainer-led" },
    ...(modules.length ? [{ label: "Length", value: `${modules.length} modules${course.course_duration ? ` · ${course.course_duration}` : ""}` }] : []),
    ...(batch?.scheduleLabel ? [{ label: "Schedule", value: `${batch.scheduleLabel}${batch.classMinutes ? ` · ${batch.classMinutes} min` : ""}` }] : []),
    ...(batch?.batchStart && !batch.batchStarted ? [{ label: "Batch starts", value: `${istFullDate(batch.batchStart)}, ${istTime(batch.batchStart)} IST` }] : []),
    ...(course.grade_level ? [{ label: "Level", value: course.grade_level }] : []),
    {
      label: "Fee",
      value: offer
        ? `Free pass — ${offer.left} of ${offer.passes} left this round${fee ? ` (worth ${inr(fee)})` : ""}`
        : batch?.offer?.state === "full"
          ? "Batch full — waitlist open for the next batch"
          : batch?.offer?.state === "round_full"
            ? "This round's free passes are claimed — next round opens at the next class"
            : fee
              ? inr(fee)
              : "Free",
    },
    ...(trainerNames.length ? [{ label: trainerNames.length > 1 ? "Trainers" : "Trainer", value: trainerNames.join(", ") }] : []),
    { label: "Certificate", value: "Yes, on completion" },
  ]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Breadcrumb (also sent as BreadcrumbList structured data by ./layout.tsx) */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary-500">Home</Link>
          <span>/</span>
          <Link href="/learn" className="hover:text-primary-500">Learn</Link>
          <span>/</span>
          <Link href="/learn/courses" className="hover:text-primary-500">Courses</Link>
          <span>/</span>
          <span className="text-text-primary line-clamp-1" aria-current="page">{course.title}</span>
        </nav>

        {/* Back Button */}
        <Link href="/learn/courses" className="inline-flex items-center text-muted-foreground hover:text-primary-500 mb-6 font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>

        {/* Course, breadcrumb and FAQ structured data are rendered on the server by ./layout.tsx */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Batch Status & Sold Out Notice */}
            {isShortForm && (
              <div className="rounded-2xl p-3.5 sm:p-4 border bg-[#111625] border-amber-500/40 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
                  </span>
                  <div className="text-sm font-medium flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="text-rose-400 line-through font-semibold text-xs sm:text-sm">Batch 03 (Sold Out)</span>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="font-bold text-amber-300 text-xs sm:text-sm">Batch 04: Starts Sunday, 11th Oct 2026</span>
                  </div>
                </div>
                <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-sm self-start sm:self-auto font-mono whitespace-nowrap">
                  15 Passes Open
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {course.subject}
                </span>
                <span className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {course.grade_level}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              {/* Course Stats Removed (Moved to Instructor Profile) */}
            </div>

            {/* Course Media: Interactive Video Player for Shorts/Reels, or Static Image for others */}
            {isShortForm ? (
              <Card className="overflow-hidden border-slate-800 bg-[#070b14] shadow-2xl relative group">
                <div className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[520px] flex items-center justify-center overflow-hidden p-3 sm:p-5">
                  {/* Ambient background glow and light effect */}
                  <div className="absolute inset-0 bg-radial from-amber-500/15 via-rose-500/10 to-transparent pointer-events-none" />
                  
                  {/* Subtle video backdrop blur for desktop */}
                  <div className="absolute inset-0 opacity-25 filter blur-3xl scale-125 pointer-events-none overflow-hidden">
                    <video
                      src="/courses/stickerposter.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Centered Vertical 9:16 Video Poster */}
                  <div className="relative z-10 max-w-[280px] sm:max-w-[310px] md:max-w-[330px] w-full rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.85)] border border-white/20 bg-black">
                    <video
                      ref={heroVideoRef}
                      src="/courses/stickerposter.mp4"
                      autoPlay
                      loop
                      muted={heroMuted}
                      playsInline
                      className="w-full h-auto aspect-[9/16] object-cover cursor-pointer"
                      onClick={() => {
                        if (heroVideoRef.current) {
                          if (heroVideoRef.current.paused) {
                            heroVideoRef.current.play();
                            setHeroPlaying(true);
                          } else {
                            heroVideoRef.current.pause();
                            setHeroPlaying(false);
                          }
                        }
                      }}
                    />

                    {/* Sound toggle button */}
                    <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (heroVideoRef.current) {
                            const newMuted = !heroMuted;
                            heroVideoRef.current.muted = newMuted;
                            setHeroMuted(newMuted);
                          }
                        }}
                        className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-[11px] font-semibold flex items-center gap-1.5 backdrop-blur-md border border-white/25 transition-all cursor-pointer shadow-lg active:scale-95"
                      >
                        {heroMuted ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                            <span>🔊 Unmute ASMR</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                            <span>Sound On</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Play/Pause indicator */}
                    {!heroPlaying && (
                      <div
                        className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 cursor-pointer"
                        onClick={() => {
                          if (heroVideoRef.current) {
                            heroVideoRef.current.play();
                            setHeroPlaying(true);
                          }
                        }}
                      >
                        <div className="w-14 h-14 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-xl">
                          <Play className="w-6 h-6 fill-current ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="overflow-hidden border-slate-200">
                <div className="aspect-video relative overflow-hidden bg-gray-100">
                  {heroImage ? (
                    <img
                      src={heroImage}
                      alt={`${course.title} — course banner`}
                      width={1280}
                      height={720}
                      fetchPriority="high"
                      decoding="async"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Play className="h-16 w-16 opacity-50" />
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Enrollment on phones (the sidebar sits at the very bottom there) */}
            <div className="lg:hidden rounded-2xl p-5 shadow-md" style={{ background: "#faf6ee", color: "#241c14" }} data-enroll>
              <LaunchOfferCard course={course} batch={batch} onChanged={refresh} />
            </div>

            {/* Course at a glance */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <h2 className={`${sectionTitle} text-slate-900`}>Course at a Glance</h2>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  {facts.map((f) => (
                    <div key={f.label} className="flex flex-col border-b border-slate-100 pb-2">
                      <dt className="text-xs font-bold uppercase tracking-wide text-slate-400">{f.label}</dt>
                      <dd className="text-slate-800 font-medium">{f.value}</dd>
                    </div>
                  ))}
                </dl>
                {course.target_audience && (
                  <p className="mt-4 text-sm text-slate-600">
                    <strong className="text-slate-800">Who it&apos;s for:</strong> {course.target_audience}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Tools & Apps You'll Master */}
            {isShortForm && (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <h2 className={`${sectionTitle} flex items-center space-x-2 text-slate-900`}>
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <span>Creator Tools &amp; Apps You&apos;ll Master</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Zero expensive gear needed — everything runs right on your smartphone or free tier apps</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { name: "CapCut & VN Editor", badge: "Mobile Video Editing", desc: "Fast pacing, auto captions, keyframes & retention cuts", color: "from-sky-500 to-blue-600" },
                      { name: "ChatGPT & Claude", badge: "AI Scripting", desc: "1.5s hook variations, story outlines & Indian trend angles", color: "from-emerald-500 to-green-600" },
                      { name: "Canva & Lightroom", badge: "Visuals & Covers", desc: "High-CTR YouTube Shorts cover frames & color grading", color: "from-purple-500 to-indigo-600" },
                      { name: "YouTube Studio", badge: "Shorts Analytics", desc: "Read watch percentage curves & swipe-away rates", color: "from-red-500 to-rose-600" },
                      { name: "Meta Creator Insights", badge: "Instagram Growth", desc: "Track non-follower reach, shares, and audio virality", color: "from-pink-500 to-rose-500" },
                      { name: "ElevenLabs & Audio FX", badge: "Audio & Voice", desc: "Trending sound design, swooshes, pops & voice cloning", color: "from-amber-500 to-orange-600" },
                    ].map((tool, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${tool.color}`} />
                          <h3 className="font-bold text-slate-900 text-sm">{tool.name}</h3>
                        </div>
                        <span className="inline-block text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">{tool.badge}</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{tool.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Viral Video Studio Timeline Showcase */}
            {isShortForm && <CourseVideoStudioShowcase />}

            {/* What You'll Learn */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <h2 className={`${sectionTitle} flex items-center space-x-2 text-slate-900`}>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>What You&apos;ll Learn</span>
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Free Bonus Pack (Value Stacking) */}
            {isShortForm && (
              <Card className="border-amber-200 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                  ₹12,500 Free Value
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🎁</span>
                    <h2 className={`${sectionTitle} text-slate-900`}>Exclusive Creator Bonus Pack</h2>
                  </div>
                  <p className="text-xs text-slate-600">
                    Included <strong className="text-emerald-700 font-semibold">100% FREE</strong> for students enrolling in this live batch.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      {
                        title: "50+ Viral Hook Templates Cheat Sheet",
                        val: "₹2,500",
                        desc: "Plug-and-play 1.5-second opening lines for curiosity, contrast, and relatable Indian humor.",
                        tag: "PDF Guide"
                      },
                      {
                        title: "2026 Indian Creator Viral Calendar",
                        val: "₹3,000",
                        desc: "Dates, trending audio triggers & video concepts for Diwali, IPL, Holi, Exams & Weddings.",
                        tag: "Calendar Sheet"
                      },
                      {
                        title: "Brand Pitch Kit & Rate Card Formula",
                        val: "₹4,000",
                        desc: "Ready-to-send email and Instagram DM pitch scripts to close your first paid brand sponsors.",
                        tag: "Templates & Calculator"
                      },
                      {
                        title: "Royalty-Free B-Roll & SFX Audio Vault",
                        val: "₹2,000",
                        desc: "Essential whoosh sounds, pop text effects, aesthetic lofi beats, and transition clips.",
                        tag: "Asset Pack"
                      },
                      {
                        title: "Private Batch WhatsApp Mastermind",
                        val: "₹1,000",
                        desc: "Get instant peer feedback and trainer reviews on your video rough cuts before you publish.",
                        tag: "VIP Community"
                      },
                    ].map((b, i) => (
                      <div key={i} className="flex items-start justify-between p-3 rounded-xl bg-white border border-amber-100/80 shadow-xs">
                        <div className="pr-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-xs font-bold text-slate-900">{b.title}</span>
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.5 rounded">{b.tag}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-700 whitespace-nowrap line-through opacity-70">{b.val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Preview Trigger */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-amber-100 mt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Instantly unlocked upon enrollment</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBonusModalOpen(true)}
                      className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-100/90 hover:bg-amber-200/90 px-3.5 py-2 rounded-lg border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Sneak Peek: View Sample Hooks &amp; Pitch Scripts</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <h2 className={`${sectionTitle} text-slate-900`}>Requirements</h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-slate-400 font-bold">•</span>
                      <span className="text-slate-700 font-medium">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Course Curriculum / Modules */}
            {modules.length > 0 && (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <h2 className={`${sectionTitle} text-slate-900 flex items-center space-x-2`}>
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span>Course Curriculum</span>
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {modules.map((mod) => (
                        <div key={mod.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-slate-800 text-base">
                                Module {mod.module_number}: {mod.title}
                              </h3>
                              {mod.description && (
                                <p className="text-sm text-slate-500 mt-1">{mod.description}</p>
                              )}
                            </div>
                            {mod.estimated_duration && (
                              <span className="text-xs bg-slate-200/80 text-slate-600 px-2 py-1 rounded font-semibold whitespace-nowrap">
                                {mod.estimated_duration} mins
                              </span>
                            )}
                          </div>
                          
                          {/* Topics List */}
                          {mod.course_topics && mod.course_topics.length > 0 && (
                            <ul className="mt-3 pl-4 border-l-2 border-slate-200 space-y-2">
                              {[...mod.course_topics]
                                .sort((a, b) => a.order_in_module - b.order_in_module)
                                .map((topic) => (
                                  <li key={topic.id} className="text-sm text-slate-700 font-medium flex items-start space-x-2">
                                    <span className="text-green-600 font-bold">•</span>
                                    <span>{topic.title}</span>
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* FAQs Section */}
            {faqs.length > 0 && (
              <Card className="bg-white border-slate-200">
                <CardHeader>
                  <h2 className={`${sectionTitle} text-slate-900 flex items-center space-x-2`}>
                    <HelpCircle className="h-5 w-5 text-green-600" />
                    <span>Frequently Asked Questions</span>
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                        <h3 className="font-bold text-slate-800 text-sm mb-1 flex items-start space-x-2">
                          <span className="text-green-600">Q:</span>
                          <span>{faq.question}</span>
                        </h3>
                        <p className="text-sm text-slate-600 pl-5 font-medium leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Trainer Booth */}
            <div className="mt-8">
              <CourseTrainerBooth courseId={course.id} />
            </div>

            {/* WhatsApp Instant Query Card */}
            {isShortForm && (
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Have questions before joining tomorrow?</h3>
                    <p className="text-xs text-slate-600">Ask about class timings, phone compatibility, or batch recordings directly on WhatsApp.</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/919084718101?text=Hi%20Celoris!%20I%20have%20a%20question%20about%20the%20YouTube%20Shorts%20%26%20Instagram%20Reels%20Masterclass%20batch%20starting%20tomorrow."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all whitespace-nowrap active:scale-95 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat with Coordinator</span>
                </a>
              </div>
            )}

            {/* Testimonials carried over from the earlier Celoris website */}
            {testimonials.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
                <span>⭐</span> Student Reviews
              </h2>
              <p className="text-xs text-slate-400 mb-5">From students of our earlier Celoris website</p>
              <div className="relative overflow-hidden">
                {/* Left fade */}
                <div className="pointer-events-none absolute top-0 left-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
                {/* Right fade */}
                <div className="pointer-events-none absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
                <style>{`
                  @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                  }
                  .testimonial-marquee {
                    animation: scroll-left 60s linear infinite;
                  }
                  .testimonial-marquee:hover {
                    animation-play-state: paused;
                  }
                `}</style>
                <div className="testimonial-marquee flex flex-row gap-4" style={{ width: 'max-content' }}>
                  {[...testimonials, ...testimonials].map((t, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex-shrink-0" style={{ width: '320px' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {t.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{t.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{(t as any).role || "Earlier Celoris student"}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          {Array.from({ length: 5 }).map((_, si) => (
                            <span key={si} className={`text-sm ${si < t.stars ? 'text-yellow-400' : 'text-slate-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">&quot;{t.text}&quot;</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            )}

            {/* Verified student reviews (written and checked on Celoris) */}
            <div className="mt-10">
              <CourseReviews courseKey={`learn-course:${course.id}`} courseTitle={course.title} theme="light" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Mini Notice Board — replaces the white card and fills the sidebar */}
              <CourseNoticeBoardMini course={course} durationDisplay={durationDisplay} batch={batch} onBatchChanged={refresh} />
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom CTA Bar */}
      {isShortForm && (
        <div className="lg:hidden fixed bottom-3 inset-x-3 z-40">
          <div className="bg-[#1c2340]/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 pl-1">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse flex-shrink-0" />
              <div className="leading-tight">
                <p className="text-xs font-bold text-white">
                  <span className="line-through text-rose-400 mr-1.5">Batch 03 Sold Out</span>
                  <span className="text-emerald-400">Batch 04 Open</span>
                </p>
                <p className="text-[10px] text-amber-300 font-medium">
                  {batch?.batchStart ? `Starts ${istFullDate(batch.batchStart)}` : "Starts 11 Oct"} • 15 Passes Open
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const el = document.querySelector('[data-enroll]');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
            >
              Claim Spot →
            </button>
          </div>
        </div>
      )}

      {/* Bonus Pack Interactive Preview Modal */}
      {bonusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  🎁
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Creator Bonus Pack — Sneak Peek</h3>
                  <p className="text-xs text-slate-600">Included 100% Free with tomorrow&apos;s live batch (Worth ₹12,500)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBonusModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200/80 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/80 px-4 pt-2 gap-1 overflow-x-auto text-xs font-semibold">
              {[
                { id: "hooks", label: "🔥 50+ Viral Hooks" },
                { id: "pitch", label: "💼 Brand Pitch Kit" },
                { id: "calendar", label: "📅 2026 Viral Calendar" },
                { id: "sfx", label: "🎵 Sound FX & B-Roll" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBonusActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
                    bonusActiveTab === tab.id
                      ? "bg-white text-amber-900 font-bold border-t-2 border-amber-500 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-sm text-slate-700">
              {bonusActiveTab === "hooks" && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                    <span>Here are 5 samples from the full 50-hook template sheet:</span>
                    <span className="font-bold text-[10px] bg-amber-200/80 px-2 py-0.5 rounded">Click to copy</span>
                  </div>
                  {[
                    "Stop posting Reels at [Time] — here is what the Indian algorithm actually looks for in 2026.",
                    "I tested 3 viral video formats on a ₹12,000 phone so you don't waste weeks guessing. Here is the winner.",
                    "If you also struggle with [Relatable Indian Daily Struggle], watch this 20-second hack before tomorrow.",
                    "Everyone tells you to buy a ₹10,000 wireless mic. You actually only need to toggle this 1 hidden phone setting.",
                    "The 1 mistake that cost our channel 80,000 views — and the simple 3-second fix to avoid it.",
                  ].map((hook, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-amber-50/40 transition-colors flex items-start justify-between gap-3 group"
                    >
                      <p className="text-xs text-slate-800 font-medium leading-relaxed">
                        <strong className="text-amber-700 mr-1.5">Hook #{idx + 1}:</strong>
                        &ldquo;{hook}&rdquo;
                      </p>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(hook, idx)}
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-all flex-shrink-0 cursor-pointer shadow-xs active:scale-90"
                        title="Copy Hook"
                      >
                        {copiedHookIndex === idx ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {bonusActiveTab === "pitch" && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                    <strong>Direct Email/DM Template for Indian D2C Brands &amp; Local Cafes:</strong>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono leading-relaxed text-slate-800 space-y-2 select-all">
                    <p className="font-bold text-slate-900">Subject: 30s Reel concept for [Brand Name] (Targeting Indian [Niche] Audience)</p>
                    <hr className="border-slate-200" />
                    <p>Hey [Founder/Marketing Lead],</p>
                    <p>Loved your recent launch of [Product Name] — the [Specific Feature] really stood out.</p>
                    <p>I create high-retention short-form video content around [Your Niche] for Indian viewers (averaging [Xk] views with [X]% watch time).</p>
                    <p>I scripted a quick 30-second storytelling Reel concept that introduces [Product] naturally through [Pain Point] without looking like a boring ad.</p>
                    <p>Would you be open if I send over the 3-line script outline for you to check out?</p>
                    <p>Best,<br />[Your Name] · [Your Instagram/YouTube Link]</p>
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    Includes pricing benchmark formula (e.g., ₹2,000–₹5,000 for accounts under 25k followers with high retention).
                  </p>
                </div>
              )}

              {bonusActiveTab === "calendar" && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs text-purple-900">
                    <strong>Sample Content Triggers from the 2026 Indian Creator Calendar:</strong>
                  </div>
                  <div className="space-y-2">
                    {[
                      { season: "IPL & Cricket Season (April–May)", idea: "Match day ritual humor, quick fan reaction reels, snack/match watch parties." },
                      { season: "Festival Rush (Diwali, Navratri, Eid)", idea: "Festive fashion transitions, last-minute gift guide, festive home makeovers on a budget." },
                      { season: "Monsoon & Travel Season (July–Aug)", idea: "Street food aesthetics, rainy day playlist reels, road trip packing checklist." },
                      { season: "Exam & Career Season (Feb–March)", idea: "Late night study desk setups, stress-buster hacks, career shortcut tutorials." },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                        <p className="text-xs font-bold text-slate-900 mb-0.5">{item.season}</p>
                        <p className="text-xs text-slate-600">{item.idea}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bonusActiveTab === "sfx" && (
                <div className="space-y-3">
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-sky-900">
                    <strong>Curated Sound FX &amp; Audio Retention Cues:</strong>
                  </div>
                  <ul className="text-xs space-y-2 text-slate-700">
                    <li className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                      <span>💨 <strong>High-Speed Whoosh</strong> (For text pops &amp; rapid scene cuts)</span>
                      <span className="text-[10px] text-slate-500 font-mono">0.4s WAV</span>
                    </li>
                    <li className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                      <span>📸 <strong>Vintage Camera Shutter</strong> (For freeze-frame B-roll)</span>
                      <span className="text-[10px] text-slate-500 font-mono">0.6s WAV</span>
                    </li>
                    <li className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                      <span>🔔 <strong>Soft Ding / Service Bell</strong> (For key takeaways &amp; stats)</span>
                      <span className="text-[10px] text-slate-500 font-mono">0.3s WAV</span>
                    </li>
                    <li className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                      <span>🎧 <strong>Copyright-Free Indian Lofi Pack</strong> (Chill ambient background)</span>
                      <span className="text-[10px] text-slate-500 font-mono">5 Tracks</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-600 font-medium text-center sm:text-left">
                Included automatically with your batch enrollment
              </span>
              <button
                type="button"
                onClick={() => {
                  setBonusModalOpen(false);
                  const el = document.querySelector('[data-enroll]');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer text-center"
              >
                Enroll &amp; Claim All Bonuses Free →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}