import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { Sparkles, ArrowRight, Video, Scissors, Film } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Free Online Video Editor India 2025 — No Watermark",
    description: "Use Celoris's free online video editor. No downloads, no watermarks. Professional tools for Indian creators. Free to start. No credit card. celoris.in 🇮🇳",
    openGraph: {
        title: "Free Online Video Editor India 2025 — No Watermark",
        description: "Use Celoris's free online video editor. No downloads, no watermarks. Professional tools for Indian creators. Free to start. No credit card. celoris.in 🇮🇳",
    }
}

export default function FreeVideoEditorPage() {
    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30">
                {/* Hero Section */}
                <section className="py-24 px-8 relative overflow-hidden z-10 border-b border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8">
                            <Sparkles size={12} className="animate-pulse" /> Creative Studio
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white italic uppercase">
                            Free Online Video Editor — No Download, No Watermark
                        </h1>
                        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed italic">
                            Create professional-grade videos directly in your browser. No watermark, no installation, just pure creativity. Build for Indian creators.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-10 h-14 font-bold text-sm shadow-xl shadow-emerald-500/20" asChild>
                                <Link href="/video-studio" className="flex items-center gap-2">
                                    Start Editing <ArrowRight size={16} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 relative z-10">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Video className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">No Watermark</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Export your videos in high resolution without any distracting watermarks.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Scissors className="text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Smooth Editing</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Intuitive timeline and drag-and-drop tools for effortless video creation.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Film className="text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Built-in Assets</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Library of royalty-free music, stock footage, and premium transitions.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardShell>
    )
}
