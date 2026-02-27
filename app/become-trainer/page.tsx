import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight, BookOpen, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Online Teaching Jobs India — Become a Trainer on Celoris",
    description: "Join Celoris as a trainer and teach online. Share your skills in video editing, AI tools, Excel, and more with students across India. Free to start. No credit card. celoris.in 🇮🇳",
    openGraph: {
        title: "Online Teaching Jobs India — Become a Trainer on Celoris",
        description: "Join Celoris as a trainer and teach online. Share your skills in video editing, AI tools, Excel, and more with students across India. Free to start. No credit card. celoris.in 🇮🇳",
    }
}

export default function BecomeTrainerPage() {
    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30">
                {/* Hero Section */}
                <section className="py-24 px-8 relative overflow-hidden z-10 border-b border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8">
                            <Sparkles size={12} className="animate-pulse" /> Trainer Network
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white italic uppercase">
                            Teach Online & Earn — Join Celoris as a Trainer
                        </h1>
                        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed italic">
                            Share your expertise with the next generation of creators. From video editing to AI, your knowledge is the blueprint for their success.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-10 h-14 font-bold text-sm shadow-xl shadow-emerald-500/20" asChild>
                                <Link href="/register" className="flex items-center gap-2">
                                    Join Now <ArrowRight size={16} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Why Join Section */}
                <section className="py-24 relative z-10">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Users className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Global Reach</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Connect with students from every corner of India and beyond.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <TrendingUp className="text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">High Earnings</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Set your own rates and keep a major share of your earnings.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <BookOpen className="text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Premium Tools</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Access 20+ AI models and creative tools to enhance your teaching.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardShell>
    )
}
