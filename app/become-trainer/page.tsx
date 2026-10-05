import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import {
    Sparkles, ArrowRight, BookOpen, Users, TrendingUp,
    CheckCircle2, XCircle, ShieldCheck, IndianRupee, Zap,
    HelpCircle, Laptop, PhoneCall, Award, Star, Video,
    Code, Palette, MessageSquare, Clock, ChevronRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Join as a Verified Trainer — 100% Free, 0% Commission | Celoris",
    description: "Celoris was built as a free learning platform for students. Now it is 100% free for trainers too. No coin paywalls, 0% commission, and direct student enquiries across Delhi NCR and India.",
    openGraph: {
        title: "Join as a Verified Trainer — 100% Free, 0% Commission | Celoris",
        description: "Stop paying for coin packages just to contact students. Celoris is 100% free for trainers. Keep 100% of your earnings with direct student contacts.",
        url: "https://www.celorisdesigns.com/become-trainer",
        siteName: "Celoris",
        locale: "en_IN",
        type: "website",
    }
}

export default function BecomeTrainerPage() {
    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 pb-20">

                {/* Hero Section */}
                <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5 bg-gradient-to-b from-emerald-950/20 via-[#070d1a] to-[#050810]">
                    {/* Background Glows */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
                    <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        {/* Live Campaign Pill */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in shadow-lg shadow-emerald-950/40">
                            <Sparkles size={14} className="animate-pulse text-emerald-400" />
                            Official Announcement • 100% Free for Educators
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-white leading-[1.08]">
                            The Free Learning Platform for Students is Now{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                100% Free for Trainers.
                            </span>
                        </h1>

                        {/* Value-Packed Subtitle */}
                        <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto text-slate-300 font-normal leading-relaxed">
                            Stop paying ₹2,000 for "coin packages" just to view a student's phone number. On Celoris, enjoy <strong className="text-white">0% commission</strong>, <strong className="text-white">zero coin paywalls</strong>, and <strong className="text-white">direct student enquiries</strong>. You keep 100% of what you earn.
                        </p>

                        {/* CTA Cluster */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl px-9 h-14 text-base shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                                asChild
                            >
                                <Link href="/register" className="flex items-center gap-2 justify-center">
                                    Claim Free Trainer Profile
                                    <ArrowRight size={18} />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl px-8 h-14 text-base backdrop-blur-md"
                                asChild
                            >
                                <a href="#comparison">
                                    Why Celoris vs Others
                                </a>
                            </Button>
                        </div>

                        {/* Micro Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                No Credit Card Required
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                0% Commission Forever
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                2-Minute Activation
                            </span>
                        </div>
                    </div>
                </section>

                {/* Key Numbers / Trust Strip */}
                <section className="py-8 bg-slate-950/70 border-b border-white/5">
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

                {/* Pain Point Comparison (Why Celoris is Better) */}
                <section id="comparison" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto scroll-mt-20">
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                            Transparent Comparison
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
                            Tired of Paying Just to Talk to Students?
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-3">
                            Here is the honest truth about traditional lead-generation platforms vs the Celoris educator model:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Other Platforms */}
                        <div className="rounded-2xl p-6 sm:p-8 bg-rose-950/15 border border-rose-900/30 relative">
                            <div className="flex items-center gap-2 mb-6">
                                <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                                <h3 className="text-xl font-bold text-white">Traditional Tutor Platforms</h3>
                            </div>
                            <ul className="space-y-4 text-xs sm:text-sm text-slate-300">
                                <li className="flex items-start gap-3">
                                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                    <span>Force you to buy <strong>₹2,000–₹5,000 coin packages</strong> just to view a single phone number.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                    <span>Sell the same student lead to <strong>5 to 10 different trainers</strong>, creating cutthroat price wars.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                    <span>Charge a <strong>15% to 30% recurring cut</strong> on your hard-earned tuition or course fees.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                                    <span>Heavy restrictions on sharing direct phone numbers or WhatsApp contact.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Celoris Model */}
                        <div className="rounded-2xl p-6 sm:p-8 bg-emerald-950/20 border border-emerald-500/40 relative shadow-2xl shadow-emerald-950/30">
                            <div className="flex items-center gap-2 mb-6">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                                <h3 className="text-xl font-bold text-white">The Celoris Educator Network</h3>
                            </div>
                            <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>₹0 Registration Fee:</strong> Never buy a "coin" or pay to unlock a student requirement.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>0% Commission:</strong> Students pay you directly via UPI or Bank Transfer. Celoris takes ₹0 cut.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Direct Student Inquiries:</strong> Genuine students discover your profile and message you directly.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                    <span><strong>Free AI Tools Suite:</strong> Access Celoris AI Studios (PhotoLite, Video Studio, PolyVault) to supercharge your teaching.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Popular Categories / Subjects */}
                <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-white/5">
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/40">
                            High Demand Subjects
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
                            Students Are Searching For Trainers in These Fields
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
                            Whether you teach online across India or offer home tuitions in Delhi NCR:
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[
                            { title: "Video Editing", subtitle: "Premiere, DaVinci, CapCut", icon: Video, color: "text-rose-400" },
                            { title: "Python & Coding", subtitle: "AI, ML, Web Development", icon: Code, color: "text-emerald-400" },
                            { title: "Graphic Design", subtitle: "Photoshop, Canva, Figma", icon: Palette, color: "text-purple-400" },
                            { title: "Digital Marketing", subtitle: "Meta Ads, Google Ads, SEO", icon: TrendingUp, color: "text-blue-400" },
                            { title: "Microsoft Excel", subtitle: "Formulas, Dashboards, AI", icon: Award, color: "text-emerald-300" },
                            { title: "Spoken English", subtitle: "Fluency, Public Speaking", icon: MessageSquare, color: "text-yellow-400" },
                            { title: "CBSE & School Tutors", subtitle: "Maths, Science, Commerce", icon: BookOpen, color: "text-pink-400" },
                            { title: "Dance & Performing Arts", subtitle: "Bollywood, Zumba, Classical", icon: Star, color: "text-amber-400" },
                        ].map((cat, idx) => {
                            const IconComponent = cat.icon
                            return (
                                <div key={idx} className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all hover:-translate-y-1 group">
                                    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${cat.color}`}>
                                        <IconComponent size={20} />
                                    </div>
                                    <h4 className="font-bold text-white text-sm sm:text-base mb-1">{cat.title}</h4>
                                    <p className="text-xs text-slate-400">{cat.subtitle}</p>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* 3-Step Setup Process */}
                <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-white/5">
                    <div className="text-center mb-14">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                            Fast & Simple
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
                            Start Receiving Inquiries in 3 Steps
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
                                Choose the subjects you teach, your teaching mode (Online or Home Tuition in NCR), and your preferred fee.
                            </p>
                        </div>

                        <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
                            <span className="text-3xl font-black text-purple-500/40 font-mono mb-4 block">03</span>
                            <h3 className="text-lg font-bold text-white mb-2">Teach & Keep 100% Fees</h3>
                            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                Students discover you and send enquiries directly. You set your schedule, deliver classes, and get paid directly.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto border-t border-white/5">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
                            <HelpCircle className="w-6 h-6 text-emerald-400" />
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "Is it really 100% free? Are there any hidden fees later?",
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
                                a: "Absolutely. You can specify your service area (e.g. Noida, South Delhi, Gurugram, or Online Pan-India) so only relevant students in your preferred format contact you."
                            },
                            {
                                q: "What are the free AI Creative Studios included?",
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
