import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { Sparkles, ArrowRight, Briefcase, DollarSign, Rocket } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Earn Online India — Daily Freelance Jobs",
    description: "Discover fresh freelance opportunities daily. Video editing, design, content writing, and AI gigs for Indian creators. Free to start. No credit card. celoris.in 🇮🇳",
    openGraph: {
        title: "Earn Online India — Daily Freelance Jobs",
        description: "Discover fresh freelance opportunities daily. Video editing, design, content writing, and AI gigs for Indian creators. Free to start. No credit card. celoris.in 🇮🇳",
    }
}

export default function EarnOnlinePage() {
    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30">
                {/* Hero Section */}
                <section className="py-24 px-8 relative overflow-hidden z-10 border-b border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8">
                            <Sparkles size={12} className="animate-pulse" /> Global Career Nexus
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white italic uppercase">
                            Earn Online India — Find Freelance Work Daily
                        </h1>
                        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed italic">
                            Connect with industry-leading organizations and unlock career architectures that redefine your professional destiny. Fresh gigs updated every 24 hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-10 h-14 font-bold text-sm shadow-xl shadow-emerald-500/20" asChild>
                                <Link href="/earn" className="flex items-center gap-2">
                                    Browse Jobs <ArrowRight size={16} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-24 relative z-10">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Briefcase className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Verified Clients</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Work with screened businesses and agencies across India ensuring secure payments.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-white/5 hover:border-amber-500/30 transition-all group">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <DollarSign className="text-amber-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Daily Payouts</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Simple wallet system for quick withdrawal of your hard-earned professional fees.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-blue-500/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Rocket className="text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Fast Onboarding</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Create your profile in 2 minutes and start applying for projects immediately.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardShell>
    )
}
