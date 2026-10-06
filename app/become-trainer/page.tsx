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

// High-Impact Interactive Client Components
import { TrainerHeroInteractive } from "@/components/trainer/TrainerHeroInteractive"
import { TrainerLiveInquiryTicker } from "@/components/trainer/TrainerLiveInquiryTicker"
import { TrainerCreativeShowcase } from "@/components/trainer/TrainerCreativeShowcase"
import { TrainerBattleCard } from "@/components/trainer/TrainerBattleCard"
import { TrainerEarningsCalculator } from "@/components/trainer/TrainerEarningsCalculator"

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
        canonical: 'https://celorisdesigns.com/become-trainer',
    },
    openGraph: {
        title: "Join Celoris as a Verified Trainer — 100% Free, 0% Commission Forever",
        description: "Stop paying ₹2,000 for coins just to view a student's number. Celoris connects you directly with learners across Delhi NCR & India. Keep 100% of your fees.",
        url: "https://celorisdesigns.com/become-trainer",
        siteName: "Celoris",
        locale: "en_IN",
        type: "website",
        images: [
            {
                url: "https://celorisdesigns.com/trainer-ad-campaign-creative.jpg",
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
        images: ["https://celorisdesigns.com/trainer-ad-campaign-creative.jpg"],
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
            "@id": "https://celorisdesigns.com/become-trainer#webpage",
            "url": "https://celorisdesigns.com/become-trainer",
            "name": "Online Teaching Jobs India & Home Tutors Delhi NCR (0% Commission) | Celoris",
            "description": "Join Celoris as a verified instructor or home tutor. Enjoy 0% commission, direct student UPI payments, and zero coin paywalls across Delhi NCR and India.",
            "inLanguage": "en-IN",
            "isPartOf": {
                "@type": "WebSite",
                "@id": "https://celorisdesigns.com/#website",
                "url": "https://celorisdesigns.com",
                "name": "Celoris Designs"
            }
        },
        {
            "@type": "EducationalOrganization",
            "@id": "https://celorisdesigns.com/#organization",
            "name": "Celoris",
            "url": "https://celorisdesigns.com",
            "logo": "https://celorisdesigns.com/favicon.svg",
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
            <div className="min-h-screen bg-[#050608] text-slate-200 selection:bg-emerald-500/30 pb-20">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
                />

                {/* 1. Cinematic Hero Section with Looping Classroom Video & Floating Badges */}
                <TrainerHeroInteractive />

                {/* 2. Real-Time Student Demand Ticker (GEO Localized) */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20">
                    <TrainerLiveInquiryTicker />
                </section>

                {/* 3. Key Proof Numbers Strip */}
                <section className="py-12 bg-[#050608] border-y border-white/[0.08] mt-6">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                                <p className="text-3xl md:text-5xl font-black text-white font-mono">₹0</p>
                                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium mt-1">Platform Commission</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-5xl font-black text-emerald-400 font-mono">100%</p>
                                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium mt-1">You Keep All Fees</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-5xl font-black text-cyan-400 font-mono">Direct</p>
                                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium mt-1">Student Contact &amp; UPI</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-5xl font-black text-purple-400 font-mono">5 Studios</p>
                                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium mt-1">Free Creative Tools</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Creative Studios Playground (User Request: Showcase Creativity) */}
                <TrainerCreativeShowcase />

                {/* 5. Interactive Earnings & Commission Savings Calculator (Dwell Time Multiplier) */}
                <section id="calculator" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20">
                    <TrainerEarningsCalculator />
                </section>

                {/* 6. The Visual "Battle Card" (UrbanPro vs Celoris) */}
                <TrainerBattleCard />

                {/* 7. Popular Subject Demand & Rates (Delhi NCR + Online) */}
                <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5">
                    <div className="text-center mb-14">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-white/[0.05] px-3.5 py-1.5 rounded-full border border-white/[0.1]">
                            High-Demand Subjects &amp; Earning Rates
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mt-4 tracking-tight">
                            Current Student Demand &amp; Average Rates
                        </h2>
                        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
                            Average market tuition and coaching fees charged by verified trainers across Delhi NCR and Online:
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
                                <div key={idx} className="p-6 rounded-3xl bg-[#08090d]/80 border border-white/[0.08] hover:border-white/[0.2] transition-all hover:-translate-y-1.5 group backdrop-blur-2xl">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform ${cat.color} border border-white/10`}>
                                            <IconComponent size={22} />
                                        </div>
                                        <span className="text-[11px] font-mono font-bold text-emerald-400 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.1]">
                                            {cat.rate}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-white text-base mb-1">{cat.title}</h4>
                                    <p className="text-xs text-neutral-400">{cat.subtitle}</p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* 8. Free Lead Magnet Toolkit: 2026 Tutor Growth Blueprint */}
                <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
                    <div className="p-8 sm:p-12 rounded-3xl bg-[#08090d]/90 border border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-3xl">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                            <div className="space-y-2 text-left">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-400 border border-purple-500/30">
                                    <Download className="w-3.5 h-3.5" />
                                    Free Educator Toolkit (PDF)
                                </span>
                                <h3 className="text-2xl sm:text-3xl font-semibold text-white">
                                    The 2026 High-Ticket Tutor Blueprint
                                </h3>
                                <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                                    Learn how top trainers in Delhi NCR close ₹1,500/hr private students, structure batch courses, and build a ₹1,00,000/month tutoring business without spending a rupee on ads.
                                </p>
                            </div>
                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 hover:border-purple-300/50 text-purple-200 hover:text-white font-medium text-sm sm:text-base backdrop-blur-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_20px_rgba(0,0,0,0.5)] shrink-0"
                            >
                                <Sparkles className="w-4 h-4 text-purple-400" />
                                <span>Get Free Blueprint &amp; Profile</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 9. Fast 3-Step Onboarding */}
                <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5">
                    <div className="text-center mb-14">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-white/[0.05] px-3.5 py-1.5 rounded-full border border-white/[0.1]">
                            Fast &amp; Simple
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mt-4 tracking-tight">
                            Start Connecting With Students in 3 Steps
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 relative">
                        <div className="p-8 rounded-3xl bg-[#08090d]/80 border border-white/[0.08] relative backdrop-blur-2xl">
                            <span className="text-4xl font-black text-emerald-500/40 font-mono mb-4 block">01</span>
                            <h3 className="text-xl font-bold text-white mb-2">Create Your Free Account</h3>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                Sign up with your name, phone number, and email. No subscription, no credit card, and zero setup fees.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-[#08090d]/80 border border-white/[0.08] relative backdrop-blur-2xl">
                            <span className="text-4xl font-black text-cyan-500/40 font-mono mb-4 block">02</span>
                            <h3 className="text-xl font-bold text-white mb-2">List Your Subjects &amp; Rates</h3>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                Choose what you teach, your teaching mode (Online or Home Tuition in NCR), and your preferred rates.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-[#08090d]/80 border border-white/[0.08] relative backdrop-blur-2xl">
                            <span className="text-4xl font-black text-purple-500/40 font-mono mb-4 block">03</span>
                            <h3 className="text-xl font-bold text-white mb-2">Teach &amp; Keep 100% Fees</h3>
                            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                                Students discover you and send enquiries directly. You set your schedule, deliver classes, and get paid directly via UPI.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 10. Frequently Asked Questions */}
                <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/5">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight flex items-center justify-center gap-2">
                            <HelpCircle className="w-7 h-7 text-emerald-400" />
                            Frequently Asked Questions
                        </h2>
                        <p className="text-neutral-400 text-xs sm:text-sm mt-2">
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
                                a: "When students view your verified trainer profile or course offerings, they send direct inquiries to your protected Celoris Trainer Inbox. You can discuss requirements, schedule trial sessions, and conduct live 1-on-1 audio/video classes directly inside Celoris live rooms."
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
                            <div key={idx} className="p-6 rounded-3xl bg-[#08090d]/80 border border-white/[0.08] backdrop-blur-2xl">
                                <h4 className="font-bold text-white text-base mb-2">{faq.q}</h4>
                                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 11. Celoris Loyalty & Community Trust Policy */}
                <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto">
                    <div className="p-8 sm:p-10 rounded-3xl bg-[#08090d]/90 border border-emerald-500/30 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                                <ShieldCheck size={24} />
                            </div>
                            <div className="space-y-2 text-left">
                                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-white/[0.05] px-3 py-1 rounded-full border border-white/[0.1]">
                                    Community Trust &amp; Loyalty Policy
                                </span>
                                <h3 className="text-xl sm:text-2xl font-semibold text-white">
                                    Why Celoris is 0% Commission: Our Mutual Loyalty Pledge
                                </h3>
                                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                                    Celoris is built to empower educators without parasite commissions. We survive and profit when you choose our in-house training rooms, creator studios, and premium Pro AI quotas. In return, we maintain a strictly trusted ecosystem: <strong className="text-white font-semibold">all student inquiries, discussions, scheduling, and live sessions must remain directly inside Celoris</strong>.
                                </p>
                                <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                                    Sharing off-platform phone numbers, personal emails, or external links in chat or profiles triggers automated shielding and revokes free trainer verification. By staying loyal to Celoris, you keep 100% of your earnings forever.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 12. Final High-Conversion Banner */}
                <section className="px-4 sm:px-6 max-w-6xl mx-auto my-14">
                    <div className="rounded-[2.5rem] bg-[#08090d]/95 border border-emerald-500/30 p-8 sm:p-14 text-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_60px_rgba(16,185,129,0.12)] backdrop-blur-3xl">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-white/[0.05] px-4 py-1.5 rounded-full border border-white/[0.1] inline-block mb-4">
                            Tonight's Special Offer
                        </span>
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 tracking-tight leading-tight">
                            Stop Paying to Teach. Join Celoris Tonight.
                        </h2>
                        <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                            Join hundreds of verified educators across India who have switched to a 0% commission, zero-coin platform. Create your free trainer profile in under 2 minutes.
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.18] hover:border-white/[0.3] text-white font-medium text-base sm:text-lg backdrop-blur-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
                        >
                            <span>Claim Your Free Trainer Profile Now</span>
                            <ArrowRight size={20} className="text-emerald-400" />
                        </Link>
                    </div>
                </section>

            </div>
        </DashboardShell>
    )
}
