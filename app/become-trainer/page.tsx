import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import {
    Sparkles, ArrowRight, BookOpen, Users, TrendingUp,
    CheckCircle2, XCircle, ShieldCheck, IndianRupee, Zap,
    HelpCircle, Laptop, PhoneCall, Award, Star, Video,
    Code, Palette, MessageSquare, Clock, MapPin, Download,
    Briefcase, FileText, Check, ChevronRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrainerEarningsCalculator } from "@/components/trainer/TrainerEarningsCalculator"
import { TrainerLiveInquiryTicker } from "@/components/trainer/TrainerLiveInquiryTicker"

export const metadata: Metadata = {
    title: "Online Teaching Jobs India & Home Tutors Delhi NCR (0% Commission) | Celoris",
    description: "Celoris is 100% FREE for trainers and educators. Stop paying for coin packages. Keep 100% of your student fees with 0% commission. Direct student enquiries across Noida, Delhi NCR, and Pan-India.",
    keywords: [
        'online teaching jobs India 2026',
        'home tutor jobs Delhi NCR',
        'become video editing trainer Noida',
        'python instructor jobs Delhi',
        'zero commission tutoring platform India',
        'free UrbanPro alternative for tutors',
        'TeacherOn free alternative 0 commission',
        'teach graphic design online India',
        'freelance instructor registration Celoris',
        'best tutor platform Noida Sector 62'
    ],
    alternates: {
        canonical: 'https://www.celorisdesigns.com/become-trainer',
    },
    openGraph: {
        title: "Join Celoris as a Verified Trainer — 100% Free, 0% Commission Forever",
        description: "Stop paying ₹2,000 for coins just to view a student's number. Celoris connects you directly with learners across Delhi NCR & India. Keep 100% of your fees.",
        url: "https://www.celorisdesigns.com/become-trainer",
        siteName: "Celoris",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: "https://www.celorisdesigns.com/trainer-ad-campaign-creative.jpg",
                width: 1024,
                height: 1024,
                alt: "Celoris Free Trainer Network 0 Percent Commission",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Online Teaching Jobs India — 100% Free for Trainers (0% Commission)",
        description: "Zero coin packages. Direct student contact. Keep 100% of your earnings. Join Celoris as a verified tutor today.",
        images: ["https://www.celorisdesigns.com/trainer-ad-campaign-creative.jpg"],
    },
    other: {
        "geo.region": "IN-UP",
        "geo.placename": "Noida, Delhi NCR, India",
        "geo.position": "28.5355;77.3910",
        "ICBM": "28.5355, 77.3910"
    }
}

const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebPage",
            "@id": "https://www.celorisdesigns.com/become-trainer#webpage",
            "url": "https://www.celorisdesigns.com/become-trainer",
            "name": "Online Teaching Jobs India & Home Tutors Delhi NCR (0% Commission) | Celoris",
            "description": "Join Celoris as a verified instructor or home tutor. Enjoy 0% commission, direct student UPI payments, and zero coin paywalls across Delhi NCR and India.",
            "inLanguage": "en-IN",
            "isPartOf": {
                "@type": "WebSite",
                "@id": "https://www.celorisdesigns.com/#website",
                "url": "https://www.celorisdesigns.com",
                "name": "Celoris Designs"
            }
        },
        {
            "@type": "EducationalOrganization",
            "@id": "https://www.celorisdesigns.com/#organization",
            "name": "Celoris",
            "url": "https://www.celorisdesigns.com",
            "logo": "https://www.celorisdesigns.com/favicon.svg",
            "description": "Next-generation creative learning ecosystem, AI creative studios, and zero-commission educator network in Delhi NCR and India.",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": "Noida",
                "addressRegion": "Uttar Pradesh",
                "addressCountry": "IN"
            },
            "areaServed": [
                { "@type": "City", "name": "Noida" },
                { "@type": "City", "name": "Delhi" },
                { "@type": "City", "name": "Gurugram" },
                { "@type": "City", "name": "Ghaziabad" },
                { "@type": "Country", "name": "India" }
            ]
        },
        {
            "@type": "HowTo",
            "name": "How to Register as a Zero-Commission Trainer on Celoris",
            "description": "Step-by-step guide to creating your verified trainer profile and connecting directly with students in India.",
            "step": [
                {
                    "@type": "HowToStep",
                    "position": 1,
                    "name": "Create Your Free Account",
                    "text": "Sign up on Celoris with your name, phone number, and email. No subscription fees or credit cards required."
                },
                {
                    "@type": "HowToStep",
                    "position": 2,
                    "name": "List Your Teaching Subjects & Rates",
                    "text": "Specify the subjects you teach (Video Editing, Python, Design, Academics), your hourly/monthly rates, and your teaching format (Online or Home Tuition)."
                },
                {
                    "@type": "HowToStep",
                    "position": 3,
                    "name": "Receive Direct Inquiries & Get Paid",
                    "text": "Students discover your profile and contact you directly. Receive 100% of student payments directly to your UPI."
                }
            ]
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Is Celoris really 100% free for trainers? Are there any hidden fees or coin packages?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes, Celoris is 100% free for trainers. Unlike platforms like UrbanPro or TeacherOn that charge ₹1,500–₹5,000 for coin packages, Celoris charges ₹0 registration fees, zero coin packages, and takes 0% commission from student fees."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do trainers receive payments from students?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Students pay trainers directly via UPI, Google Pay, PhonePe, or direct bank transfer. Celoris does not hold your payments or deduct platform fees, meaning trainers keep 100% of their earnings instantly."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Can I offer both online training and offline home tuitions in Delhi NCR?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. Trainers can set their service preference to Online (Pan-India) or Home Tuition in specific Delhi NCR hubs including Noida, South Delhi, Gurugram, Ghaziabad, and Faridabad."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What subjects can I teach on Celoris?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Trainers teach a wide range of subjects including Creative Tech (Video Editing, Animation), Programming & AI (Python, Web Dev), Business Tools (Excel, Digital Marketing), Spoken English, CBSE School Academics, and Performing Arts."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What free AI Creative Studios do Celoris trainers receive?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "All active Celoris trainers get free access to Celoris AI Creative Studios including PhotoLite (graphic design & poster creation), Video Studio (course clip editing), and PolyVault (3D models and digital assets)."
                    }
                }
            ]
        }
    ]
}

export default function BecomeTrainerPage() {
    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 pb-20">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
                />

                {/* Hero Section */}
                <section className="relative pt-14 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5 bg-gradient-to-b from-emerald-950/20 via-[#070d1a] to-[#050810]">
                    {/* Background Ambient Glows */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
                    <div className="absolute top-10 right-10 w-80 h-80 bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        {/* Live Announcement Pill */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-lg shadow-emerald-950/40">
                            <Sparkles size={14} className="animate-pulse text-emerald-400" />
                            Official Announcement • 100% Free for Educators & Tutors
                        </div>

                        {/* Main AIO/GEO Title */}
                        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-white leading-[1.08]">
                            The Free Student Platform is Now{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                100% Free for Trainers.
                            </span>
                        </h1>

                        {/* Value-Packed Subtitle */}
                        <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto text-slate-300 font-normal leading-relaxed">
                            Stop paying ₹2,000 for "coin packages" just to view a student's contact. On Celoris, enjoy <strong className="text-white">0% commission</strong>, <strong className="text-white">zero coin paywalls</strong>, and <strong className="text-white">direct student enquiries</strong> across Delhi NCR and India. Keep 100% of your earnings.
                        </p>

                        {/* CTA Cluster */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl px-9 h-14 text-base shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                                asChild
                            >
                                <Link href="/register" className="flex items-center gap-2 justify-center">
                                    Claim Your Free Trainer Profile
                                    <ArrowRight size={18} />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl px-8 h-14 text-base backdrop-blur-md"
                                asChild
                            >
                                <a href="#calculator">
                                    Calculate Your Savings
                                </a>
                            </Button>
                        </div>

                        {/* Micro Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ₹0 Registration Fee
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                0% Commission on All Student Fees
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                Direct Student WhatsApp & UPI
                            </span>
                        </div>
                    </div>
                </section>

                {/* Real-time GEO Inquiry Ticker */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative z-20">
                    <TrainerLiveInquiryTicker />
                </section>

                {/* Key Numbers / Trust Strip */}
                <section className="py-12 bg-slate-950/70 border-b border-white/5 mt-10">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-3xl md:text-4xl font-black text-white font-mono">₹0</p>
                                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">Platform Commission</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-black text-emerald-400 font-mono">100%</p>
                                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">You Keep All Fees</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-black text-white font-mono">Direct</p>
                                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">Student Contact & UPI</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-black text-purple-400 font-mono">Free AI</p>
                                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">Creative Studios Included</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Interactive Earnings & Commission Savings Calculator (Dwell Time Multiplier) */}
                <section id="calculator" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto scroll-mt-20">
                    <TrainerEarningsCalculator />
                </section>

                {/* AIO & GEO Comparison Table (UrbanPro / TeacherOn vs Celoris) */}
                <section id="comparison" className="py-16 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/5 scroll-mt-20">
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                            Transparent Side-By-Side Comparison
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
                            Why Tutors in Delhi NCR Are Moving Away from "Coin" Platforms
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3">
                            Here is the factual breakdown of traditional lead-selling directories vs the Celoris zero-commission model:
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-2xl mb-8">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-slate-950 text-slate-200 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 sm:p-5">Feature & Policy</th>
                                    <th className="p-4 sm:p-5 text-rose-400">Traditional Lead Platforms (UrbanPro, TeacherOn)</th>
                                    <th className="p-4 sm:p-5 text-emerald-400 font-bold">Celoris Educator Network</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80">
                                <tr>
                                    <td className="p-4 sm:p-5 font-bold text-white">Student Contact Access</td>
                                    <td className="p-4 sm:p-5 text-slate-300">Locked behind ₹1,500–₹5,000 coin packages</td>
                                    <td className="p-4 sm:p-5 text-emerald-400 font-bold">100% Free & Direct (No Coins)</td>
                                </tr>
                                <tr>
                                    <td className="p-4 sm:p-5 font-bold text-white">Platform Commission</td>
                                    <td className="p-4 sm:p-5 text-rose-400">15% to 30% cut on every fee</td>
                                    <td className="p-4 sm:p-5 text-emerald-400 font-bold">0% Commission Forever</td>
                                </tr>
                                <tr>
                                    <td className="p-4 sm:p-5 font-bold text-white">Lead Exclusivity</td>
                                    <td className="p-4 sm:p-5 text-slate-400">Same lead sold to 5–10 competing trainers</td>
                                    <td className="p-4 sm:p-5 text-emerald-400 font-bold">Direct student enquiries sent to you</td>
                                </tr>
                                <tr>
                                    <td className="p-4 sm:p-5 font-bold text-white">Payout Method</td>
                                    <td className="p-4 sm:p-5 text-slate-400">Delayed platform payouts (15–30 days)</td>
                                    <td className="p-4 sm:p-5 text-emerald-400 font-bold">Instant direct UPI / Bank Transfer</td>
                                </tr>
                                <tr>
                                    <td className="p-4 sm:p-5 font-bold text-white">Teaching Tooling</td>
                                    <td className="p-4 sm:p-5 text-slate-400">None provided</td>
                                    <td className="p-4 sm:p-5 text-purple-300 font-bold">Free AI Studios (PhotoLite, Video Studio, PolyVault)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Popular Categories & Market Rate Benchmarks in Delhi NCR */}
                <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5">
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
                            High-Demand Subjects & Earning Rates
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
                            Current Student Demand & Average Rates (Delhi NCR & Online)
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
                            Average market tuition and coaching fees charged by verified trainers on Celoris:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: "Video Editing", subtitle: "Premiere, DaVinci, CapCut", rate: "₹700 – ₹1,800/hr", icon: Video, color: "text-rose-400" },
                            { title: "Python & AI / Data", subtitle: "Machine Learning, Automation", rate: "₹900 – ₹2,200/hr", icon: Code, color: "text-emerald-400" },
                            { title: "Graphic Design", subtitle: "Photoshop, Canva, UI/UX", rate: "₹600 – ₹1,500/hr", icon: Palette, color: "text-purple-400" },
                            { title: "Digital Marketing", subtitle: "Meta Ads, Google Ads, SEO", rate: "₹800 – ₹2,000/hr", icon: TrendingUp, color: "text-blue-400" },
                            { title: "Microsoft Excel & AI", subtitle: "Formulas, Copilot, Dashboards", rate: "₹650 – ₹1,400/hr", icon: Award, color: "text-emerald-300" },
                            { title: "Spoken English & IELTS", subtitle: "Communication, Fluency", rate: "₹500 – ₹1,200/hr", icon: MessageSquare, color: "text-yellow-400" },
                            { title: "CBSE School Academics", subtitle: "Class 9-12 Maths, Physics", rate: "₹600 – ₹1,500/hr", icon: BookOpen, color: "text-pink-400" },
                            { title: "Dance & Zumba", subtitle: "Bollywood, Fitness, Classical", rate: "₹500 – ₹1,200/session", icon: Star, color: "text-amber-400" },
                        ].map((cat, idx) => {
                            const IconComponent = cat.icon
                            return (
                                <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-1 group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform ${cat.color}`}>
                                            <IconComponent size={20} />
                                        </div>
                                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                                            {cat.rate}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-white text-base mb-1">{cat.title}</h4>
                                    <p className="text-xs text-slate-400">{cat.subtitle}</p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Free Lead Magnet Box: 2026 Tutor Growth Blueprint (Dwell Time & Opt-in) */}
                <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
                    <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 shadow-2xl relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="space-y-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
                                    <Download className="w-3.5 h-3.5" />
                                    Free Educator Toolkit (PDF)
                                </span>
                                <h3 className="text-xl sm:text-2xl font-black text-white">
                                    The 2026 High-Ticket Tutor Blueprint
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                                    Learn how top trainers in Delhi NCR close ₹1,500/hr private students, structure batch courses, and build a ₹1,00,000/month tutoring business without spending on ads.
                                </p>
                            </div>
                            <Button
                                size="lg"
                                className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 h-12 rounded-xl text-sm shrink-0 shadow-lg shadow-purple-600/30"
                                asChild
                            >
                                <Link href="/register">
                                    Get Free Blueprint & Profile
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 3-Step Setup Process (HowTo Schema Section) */}
                <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/5">
                    <div className="text-center mb-14">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                            Fast & Simple Activation
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
                            Start Connecting With Students in 3 Steps
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 relative">
                        <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
                            <span className="text-3xl font-black text-emerald-500/40 font-mono mb-4 block">01</span>
                            <h3 className="text-lg font-bold text-white mb-2">Create Your Free Account</h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Sign up with your name, phone number, and email. No subscription, no credit card, and zero setup fee.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
                            <span className="text-3xl font-black text-cyan-500/40 font-mono mb-4 block">02</span>
                            <h3 className="text-lg font-bold text-white mb-2">List Your Subjects & Rates</h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Choose the subjects you teach, your teaching mode (Online or Home Tuition in Delhi NCR), and your preferred fee.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
                            <span className="text-3xl font-black text-purple-500/40 font-mono mb-4 block">03</span>
                            <h3 className="text-lg font-bold text-white mb-2">Teach & Keep 100% Fees</h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Students discover you and send enquiries directly. You set your schedule, deliver classes, and get paid directly via UPI.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section (Rich Snippet Eligible) */}
                <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/5">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                            <HelpCircle className="w-6 h-6 text-emerald-400" />
                            Frequently Asked Questions
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm mt-2">
                            Everything you need to know about joining Celoris as an independent educator.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Is Celoris really 100% free? Are there any hidden fees or coin packages later?",
                                a: "Yes, Celoris is 100% free for trainers. We do not charge registration fees, listing fees, coin packages, or any commission cuts from your student payments. You keep 100% of the money students pay you."
                            },
                            {
                                q: "How do students reach out to me?",
                                a: "When students view your verified trainer profile or course offerings, they can submit an enquiry directly to your Celoris Trainer Inbox or connect via WhatsApp/phone as agreed."
                            },
                            {
                                q: "How and when do I get paid?",
                                a: "Because Celoris does not hold your funds or take cuts, students pay you directly via UPI, Google Pay, PhonePe, or direct bank transfer. There are no 30-day payout delays."
                            },
                            {
                                q: "Can I offer both online classes and offline home tuitions in Delhi NCR?",
                                a: "Absolutely. You can specify your service area (e.g. Noida Sector 18/62, South Delhi, Gurugram, Ghaziabad, or Online Pan-India) so only relevant students in your preferred format contact you."
                            },
                            {
                                q: "What free AI Creative Studios are included for trainers?",
                                a: "As an active trainer on Celoris, you get free access to our built-in creator studios: PhotoLite (graphic & poster editing), Video Studio (video trimming & reels), and PolyVault (3D models & assets) to help prepare class materials."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                                <h4 className="font-bold text-white text-sm sm:text-base mb-2">{faq.q}</h4>
                                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final Call to Action Banner */}
                <section className="px-4 sm:px-6 max-w-5xl mx-auto my-12">
                    <div className="rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-800/50 inline-block mb-4">
                            Tonight's Special Offer
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                            Stop Paying to Teach. Join Celoris Tonight.
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                            Join hundreds of verified educators across India who have switched to a 0% commission, zero-coin platform. Create your free trainer profile in under 2 minutes.
                        </p>
                        <Button
                            size="lg"
                            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl px-10 h-14 text-base shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                            asChild
                        >
                            <Link href="/register" className="flex items-center gap-2 justify-center">
                                Claim Your Free Trainer Profile Now
                                <ArrowRight size={18} />
                            </Link>
                        </Button>
                    </div>
                </section>

            </div>
        </DashboardShell>
    )
}
