import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import {
    ArrowRight, BookOpen, Users, TrendingUp,
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
    // The root layout adds " | Celoris" automatically.
    title: "Online Teaching Jobs India — 0% Commission, Keep 100%",
    description: "Celoris is 100% FREE for trainers and educators. Stop paying for coin packages. Keep 100% of your student fees with 0% commission. Direct student enquiries across Noida, Delhi NCR, and Pan-India.",
    keywords: [
        'online teaching jobs India 2026',
        'home tutor jobs Delhi NCR',
        'become video editing trainer Noida',
        'python instructor jobs Delhi',
        'zero commission tutoring platform India',
        'tutor platform without coins',
        'keep 100% tuition fees',
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
        description: "Zero coin packages. Direct student enquiries. Keep 100% of your earnings. Join Celoris as a verified tutor today.",
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
            "name": "Online Teaching Jobs India — 0% Commission, Keep 100% | Celoris",
            "description": "Join Celoris as a verified instructor or home tutor. 0% commission and zero coin paywalls: students pay into your Celoris wallet and you withdraw to your own UPI. Delhi NCR and Pan-India.",
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
                    "text": "Students discover your profile and send enquiries inside Celoris. They pay into your Celoris wallet, and you withdraw 100% of it to your own UPI."
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
                        "text": "Yes. Celoris charges no registration fee, no coin packages, no membership and 0% commission on student fees. Celoris earns only when trainers choose to use its classrooms and AI tools."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do trainers receive payments from students?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Students pay for classes inside Celoris, and the money goes into the trainer's Celoris wallet with 0% deducted. Trainers then withdraw their balance to their own UPI ID."
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
                        "text": "Trainers can use Celoris creative studios: PhotoLite (graphics and posters), Video Studio (course clips and reels), Motion Swap (character animation) and PolyVault (3D models and assets). Editing tools are free; AI generations are pay-per-use with Celoris credits."
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
                                <p className="text-3xl md:text-5xl font-black text-cyan-400 font-mono">UPI</p>
                                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium mt-1">Wallet Withdrawals</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-5xl font-black text-purple-400 font-mono">4 Studios</p>
                                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium mt-1">Creative Tools Built In</p>
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

                {/* 6. The Visual "Battle Card" (lead-selling platforms vs Celoris) */}
                <TrainerBattleCard />

                {/* 7. Popular Subject Demand & Rates (Delhi NCR + Online) */}
                <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5">
                    <div className="text-center mb-14">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-white/[0.05] px-3.5 py-1.5 rounded-full border border-white/[0.1]">
                            High-Demand Subjects &amp; Earning Rates
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white mt-4 tracking-tight">
                            Popular Subjects &amp; Typical Rates
                        </h2>
                        <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
                            Indicative hourly fees for these subjects in Delhi NCR and online. You always set your own rate.
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
                                Students discover you and send enquiries inside Celoris. You set your schedule and teach; fees land in your Celoris wallet and you withdraw them to your UPI.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 9b. Built by a trainer */}
                <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/5">
                    <div className="p-8 rounded-3xl bg-[#08090d]/80 border border-white/[0.08] backdrop-blur-2xl text-left space-y-3">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
                            Built by a trainer, for trainers
                        </span>
                        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                            Celoris was founded by Dheeraj, who has trained students in design and technology for 12 years.
                            He spent years on lead-based tutor platforms: paying for leads, losing 20–30% of every fee and waiting a week or a month to get paid.
                            Celoris is built so you never have to do any of that.
                        </p>
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
                                a: "Yes. No registration fee, no listing fee, no coin packages, no membership and no commission on your student fees. You keep 100% of what students pay you. Celoris only earns when you choose to use our classrooms and AI tools."
                            },
                            {
                                q: "How do students reach out to me?",
                                a: "When students view your verified trainer profile or course offerings, they send direct inquiries to your protected Celoris Trainer Inbox. You can discuss requirements, schedule trial sessions, and conduct live 1-on-1 audio/video classes directly inside Celoris live rooms. Students on Celoris are verified by our team, so enquiries come from real learners."
                            },
                            {
                                q: "How and when do I get paid?",
                                a: "Students pay for your classes inside Celoris, and the full amount goes into your Celoris wallet with 0% deducted. You then withdraw your balance to your own UPI ID. Your UPI details never need to be shared with students."
                            },
                            {
                                q: "Can I offer both online classes and offline home tuitions in Delhi NCR?",
                                a: "Absolutely. You can specify your service area (e.g. Noida Sector 18/62, South Delhi, Gurugram, Ghaziabad, or Online Pan-India) so only relevant students in your preferred format contact you."
                            },
                            {
                                q: "What free AI Creative Studios are included for trainers?",
                                a: "You can use our built-in studios to prepare class material: PhotoLite (graphics & posters), Video Studio (lesson clips & reels), Motion Swap (character animation) and PolyVault (3D models & assets). Editing tools are free; AI generations are pay-per-use with Celoris credits."
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
                                    Celoris takes no commission from your fees. We earn when you choose our training rooms, creator studios and AI tools. In return, we keep a trusted space: <strong className="text-white font-semibold">student enquiries, chats, scheduling, live sessions and payments all stay inside Celoris</strong>. Students pay into your Celoris wallet and you withdraw to your own UPI, so there&apos;s never a reason to swap numbers.
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
                            Free to join
                        </span>
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-white mb-4 tracking-tight leading-tight">
                            Stop Paying to Teach. Join Celoris Today.
                        </h2>
                        <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
                            Join the verified educators across India who switched to a 0% commission, zero-coin platform. Create your free trainer profile in under 2 minutes.
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
