import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Film,
  Home,
  Laptop,
  Layers,
  MapPin,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const COURSE_TITLE = "CapCut Pro Desktop & Mobile — 14-Day 1-on-1 Practical Training";

const PRICING_PLANS = [
  {
    name: "14-Day Online Course (Full Payment)",
    badge: "Best Value",
    price: "₹10,500",
    rate: "₹750 / hr",
    format: "14 Days · 14 Live 1-on-1 Hours (Online)",
    highlight: true,
    details: [
      "Complete 14-day practical CapCut Desktop (Laptop/PC) + Mobile curriculum",
      "1-on-1 live screen-share training on your own projects",
      "Lowest hourly rate — save ₹1,400 vs. installment plan",
      "Celoris Completion Certificate + export presets",
    ],
  },
  {
    name: "14-Day Online Course (2 Installments)",
    badge: "Flexible Split",
    price: "2 × ₹5,950",
    rate: "₹850 / hr",
    format: "14 Days · Split in 2 Easy Installments",
    highlight: false,
    details: [
      "Pay ₹5,950 to start (Days 1–7) and ₹5,950 for Week 2 (Days 8–14)",
      "Same complete 14-hour 1-on-1 live practical syllabus",
      "Dedicated trainer feedback on every reel & desktop timeline",
      "Celoris Completion Certificate included",
    ],
  },
  {
    name: "Pay-As-You-Go (Daily Online Basis)",
    badge: "Zero Lock-In",
    price: "₹1,000",
    rate: "Flat ₹1,000 / hr",
    format: "Pay Per Session · Online 1-on-1",
    highlight: false,
    details: [
      "Ideal if you want targeted help on specific CapCut Desktop tools",
      "No upfront multi-week commitment — pay daily per class",
      "Hands-on troubleshooting, speed ramps, keyframes & captions",
      "Flexible scheduling for working professionals & creators",
    ],
  },
  {
    name: "Home Tuition (Delhi NCR — In-Person)",
    badge: "At Your Home",
    price: "₹1,500 – ₹2,000",
    rate: "Per Hour (Varies by Distance)",
    format: "1-on-1 In-Person · Delhi & NCR",
    highlight: false,
    details: [
      "Dedicated trainer visits your home/office in Delhi NCR",
      "Hands-on setup & practical editing directly on your laptop/PC",
      "Exact hourly fee (₹1,500–₹2,000/hr) confirmed by location distance",
      "Personalized pace tailored to your niche & workflow",
    ],
  },
];

const CURRICULUM_PHASES = [
  {
    phase: "Days 1–3",
    title: "CapCut Desktop (PC/Laptop) Foundation & Timeline Mastery",
    icon: Laptop,
    topics: [
      "Setting up CapCut Desktop workspace, media bins, proxies & keyboard shortcuts",
      "Precision cutting, J-cuts / L-cuts, multi-track layering & pacing for retention",
      "Aspect ratios (9:16 Reels/Shorts, 16:9 YouTube, 1:1) and safe-zone framing",
    ],
  },
  {
    phase: "Days 4–7",
    title: "Viral Transitions, Speed Ramps, Keyframes & Color Grading",
    icon: Wand2,
    topics: [
      "Smooth speed ramps, beat-synced cuts, dynamic zooms & motion blur",
      "Manual keyframing for smooth pan, scale, opacity & animated callouts",
      "Color correction, LUTs, skin-tone balance & masking / green screen removal",
    ],
  },
  {
    phase: "Days 8–11",
    title: "Kinetic Captions, Audio Design & CapCut AI Workflows",
    icon: Sparkles,
    topics: [
      "Auto-captions, custom fonts, word-by-word kinetic highlights & brand templates",
      "Vocal cleanup, background music ducking, whoosh/riser SFX layering",
      "AI background removal, auto-reframe, tracking & desktop-to-mobile cloud sync",
    ],
  },
  {
    phase: "Days 12–14",
    title: "Real-World Projects, Export Settings & Freelance Handoff",
    icon: Film,
    topics: [
      "Edit 3 portfolio-ready videos (Talking-Head Reel, B-Roll Promo, YouTube Short)",
      "Crisp 1080p / 4K high-bitrate export settings optimized for Instagram & YouTube",
      "Project archiving, reusable templates & client turnaround workflows",
    ],
  },
];

const FAQS = [
  {
    q: "Is this training practical on CapCut Desktop (Laptop / PC) or only mobile?",
    a: "Yes — this 14-day 1-on-1 course is fully hands-on for CapCut Desktop on Windows/Mac laptops and PCs, and also covers mobile workflow sync if you edit on both.",
  },
  {
    q: "What are the exact fee options for the 14-day online 1-on-1 course?",
    a: "Full payment upfront is ₹10,500 (₹750/hr). If you prefer splitting payment, you can pay in 2 installments of ₹5,950 each (₹850/hr). If you want to pay daily per session, it is a flat ₹1,000/hr.",
  },
  {
    q: "Do you offer 1-on-1 home tuition in Delhi NCR?",
    a: "Yes. We provide in-person 1-on-1 home tuition across Delhi NCR at ₹1,500 to ₹2,000 per hour, depending on your exact location and travel distance.",
  },
  {
    q: "Do I need prior video editing experience?",
    a: "No prior experience is required. Because every session is 1-on-1 live practical training, your trainer starts at your current level and builds up to professional Reels, Shorts, and YouTube edits.",
  },
];

export default function CapCutProViralReelsPage() {
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: COURSE_TITLE,
    description:
      "14-day 1-on-1 practical CapCut Desktop (Laptop/PC) and Mobile video editing training in Delhi NCR and online across India.",
    datePublished: "2025-01-15",
    dateModified: "2026-11-26",
    provider: {
      "@type": "Organization",
      "@id": "https://celorisdesigns.com/#organization",
      name: "Celoris Designs LLP",
      url: "https://celorisdesigns.com",
    },
    educationalLevel: "Beginner to Intermediate",
    timeRequired: "P14D",
    offers: [
      {
        "@type": "Offer",
        name: "14-Day 1-on-1 Online Course (Full Upfront)",
        price: "10500",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "14-Day 1-on-1 Online Course (2 Installments)",
        price: "11900",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "Daily Pay-As-You-Go Online Session",
        price: "1000",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
      },
    ],
  };

  const whatsappHref =
    "https://wa.me/919084718101?text=" +
    encodeURIComponent(
      "Hi Celoris! I am interested in the 14-day 1-on-1 practical CapCut Desktop training (Online / Delhi NCR Home Tuition)."
    );

  return (
    <div className="min-h-screen bg-[#05070A] text-white py-10 px-4 sm:px-6 selection:bg-emerald-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Top Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/learn/courses"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Courses
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            1-on-1 Live Practical · Updated Nov 26, 2026
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Content (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Hero Section */}
            <header className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-yellow-400/15 border border-yellow-400/35 text-yellow-300 text-xs font-bold">
                  CapCut Desktop (Laptop / PC) + Mobile
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold">
                  14 Days · 1-on-1 Live
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-xs font-semibold">
                  Online + Delhi NCR Home Tuition
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.1]">
                CapCut Pro Desktop &amp; Mobile:{" "}
                <span className="text-emerald-400">14-Day 1-on-1</span> Practical Training
              </h1>

              {/* Direct 2-Sentence Opening (What, Who, Where, Price) */}
              <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-3xl">
                Celoris offers hands-on 1-on-1 practical CapCut Desktop (Laptop/PC) and Mobile
                video editing training for creators, freelancers, and business owners across
                India and Delhi NCR. Complete the 14-day live online course for{" "}
                <strong className="text-white">₹10,500 (₹750/hr)</strong>, split into{" "}
                <strong className="text-white">2 installments of ₹5,950 (₹850/hr)</strong>, pay
                daily at <strong className="text-white">₹1,000/hr</strong>, or book Delhi NCR
                home tuition at <strong className="text-white">₹1,500–₹2,000/hr</strong>.
              </p>

              {/* Quick Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { icon: Clock, label: "Duration", value: "14 Days (14 Hrs)" },
                  { icon: Laptop, label: "Platform", value: "Desktop PC & Mobile" },
                  { icon: Users, label: "Format", value: "1-on-1 Practical" },
                  { icon: Star, label: "Rating", value: "4.9 / 5 (1,200+)" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-zinc-900/70 border border-white/10 p-4"
                  >
                    <stat.icon className="w-4 h-4 text-emerald-400 mb-2" />
                    <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                      {stat.label}
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">{stat.value}</div>
                  </div>
                ))}
              </div>

              {/* Course Hero Banner Image */}
              <div className="relative group pt-2">
                <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-emerald-500/35 to-yellow-400/25 blur-sm opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="relative aspect-video overflow-hidden rounded-3xl bg-zinc-950 border border-white/15 shadow-2xl">
                  <img
                    src="/capcut.jpg"
                    alt="CapCut Pro Desktop & Mobile 1-on-1 Video Editing Training"
                    fetchPriority="high"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
                      Live 1-on-1 Screen-Share · Laptop/PC &amp; Mobile
                    </span>
                    <span className="px-3 py-1 rounded-full bg-yellow-400 text-zinc-950 text-xs font-extrabold">
                      14-Day Practical Bootcamp
                    </span>
                  </div>
                </div>
              </div>
            </header>

            {/* Transparent Fee Plans Grid */}
            <section className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  CapCut 1-on-1 Training Fee Plans (Online &amp; Delhi NCR)
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Choose the payment mode that fits your schedule — from the best-value 14-day
                  bundle to flexible installments, daily sessions, or in-person home tuition.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRICING_PLANS.map((plan) => (
                  <div
                    key={plan.name}
                    className={`rounded-2xl p-6 border flex flex-col justify-between gap-4 ${
                      plan.highlight
                        ? "bg-emerald-500/[0.08] border-emerald-500/45 shadow-[0_0_40px_rgba(16,185,129,0.12)]"
                        : "bg-zinc-900/70 border-white/10"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            plan.highlight
                              ? "bg-yellow-400 text-zinc-950"
                              : "bg-white/10 text-zinc-200"
                          }`}
                        >
                          {plan.badge}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">{plan.rate}</span>
                      </div>

                      <h3 className="text-base font-bold text-white">{plan.name}</h3>

                      <div>
                        <div className="text-3xl font-black text-white tracking-tight">
                          {plan.price}
                        </div>
                        <div className="text-xs text-zinc-400 mt-0.5">{plan.format}</div>
                      </div>

                      <ul className="space-y-2 pt-2 border-t border-white/10">
                        {plan.details.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-xs text-zinc-300 leading-relaxed"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Semantic HTML Comparison Table */}
              <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-5 overflow-x-auto">
                <h3 className="text-sm font-bold text-white mb-3">
                  Quick Fee &amp; Mode Comparison Table
                </h3>
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-zinc-400 uppercase text-[11px] tracking-wider">
                      <th className="py-2.5 pr-4">Training Option</th>
                      <th className="py-2.5 px-4">Total / Session Fee</th>
                      <th className="py-2.5 px-4">Effective Hourly Rate</th>
                      <th className="py-2.5 pl-4">Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] text-zinc-200">
                    <tr>
                      <td className="py-3 pr-4 font-semibold text-white">
                        14-Day Full Course (Upfront)
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400">₹10,500</td>
                      <td className="py-3 px-4">₹750 / hr</td>
                      <td className="py-3 pl-4">1-on-1 Live Online</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-semibold text-white">
                        14-Day Course (2 Installments)
                      </td>
                      <td className="py-3 px-4 font-bold text-white">2 × ₹5,950 (₹11,900)</td>
                      <td className="py-3 px-4">₹850 / hr</td>
                      <td className="py-3 pl-4">1-on-1 Live Online</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-semibold text-white">Daily Basis (Pay-as-you-go)</td>
                      <td className="py-3 px-4 font-bold text-white">₹1,000 / session</td>
                      <td className="py-3 px-4">₹1,000 / hr (Flat)</td>
                      <td className="py-3 pl-4">1-on-1 Live Online</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-semibold text-white">
                        Home Tuition (Delhi NCR)
                      </td>
                      <td className="py-3 px-4 font-bold text-yellow-400">₹1,500 – ₹2,000 / hr</td>
                      <td className="py-3 px-4">Varies by distance</td>
                      <td className="py-3 pl-4">In-Person at Home</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 14-Day Practical Syllabus */}
            <section className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  14-Day Practical CapCut Desktop Curriculum
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Every class is 100% hands-on — you edit live on your laptop/PC with direct
                  guidance from your Celoris trainer.
                </p>
              </div>

              <div className="space-y-4">
                {CURRICULUM_PHASES.map((mod) => (
                  <div
                    key={mod.phase}
                    className="rounded-2xl bg-zinc-900/70 border border-white/10 p-6 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                          <mod.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                            {mod.phase}
                          </span>
                          <h3 className="text-base font-bold text-white">{mod.title}</h3>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2 pl-1 pt-1">
                      {mod.topics.map((topic) => (
                        <li
                          key={topic}
                          className="flex items-start gap-2.5 text-sm text-zinc-300"
                        >
                          <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-1" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`faq-${idx}`}
                    className="rounded-2xl bg-zinc-900/70 border border-white/10 px-5"
                  >
                    <AccordionTrigger className="text-left text-sm font-bold text-white hover:no-underline py-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-zinc-300 pb-4 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          </div>

          {/* Right Sticky Enrollment Sidebar (4 cols) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-5">
            <div className="rounded-3xl bg-zinc-900/90 border border-white/15 p-6 sm:p-7 shadow-[0_24px_60px_rgba(0,0,0,0.6)] space-y-6">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  <Zap className="w-3.5 h-3.5" /> 14-Day 1-on-1 Live Online
                </span>
                <div className="flex items-baseline gap-2.5 mt-2">
                  <span className="text-4xl font-black text-white tracking-tight">₹10,500</span>
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/15 border border-yellow-400/30 px-2 py-0.5 rounded-full">
                    ₹750 / hr
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1.5">
                  Or 2 installments of <strong className="text-zinc-200">₹5,950</strong> (₹850/hr) ·
                  Daily <strong className="text-zinc-200">₹1,000/hr</strong>
                </p>
              </div>

              <div className="space-y-3">
                <CourseInquiryDialog
                  courseTitle={COURSE_TITLE}
                  buttonClassName="w-full h-12 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-extrabold text-sm transition-colors shadow-lg shadow-yellow-400/15"
                />

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Book on WhatsApp (+91 90847 18101)
                </a>
              </div>

              <div className="pt-5 border-t border-white/10 space-y-3">
                {[
                  { icon: Laptop, text: "CapCut Desktop (Windows / Mac) + Mobile" },
                  { icon: Users, text: "100% 1-on-1 Personal Practical Training" },
                  { icon: Home, text: "Delhi NCR Home Tuition: ₹1,500–₹2,000/hr" },
                  { icon: Layers, text: "Real Reels, Shorts & Promo Projects" },
                  { icon: Award, text: "Celoris Verified Completion Certificate" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-xs text-zinc-300">
                    <item.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-900/60 border border-white/10 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" /> Delhi NCR Home Tuition
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Based in Delhi, Noida, Gurugram, or Ghaziabad? Share your locality on WhatsApp
                for exact home-tuition availability (₹1,500–₹2,000/hr based on distance).
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
