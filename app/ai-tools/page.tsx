import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { Sparkles, ArrowRight, Bot, Zap, Cpu } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Free AI Tools India 2025 — 20 AI Models",
    description: "Access 20+ free AI models for content creation, image generation, and workflow automation. Built for Indian creators. Free to start. No credit card. celoris.in 🇮🇳",
    openGraph: {
        title: "Free AI Tools India 2025 — 20 AI Models",
        description: "Access 20+ free AI models for content creation, image generation, and workflow automation. Built for Indian creators. Free to start. No credit card. celoris.in 🇮🇳",
    }
}

export default function AiToolsPage() {
    return (
        <DashboardShell>
            <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30">
                {/* Hero Section */}
                <section className="py-24 px-8 relative overflow-hidden z-10 border-b border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
                    <div className="max-w-6xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8">
                            <Zap size={12} className="animate-pulse" /> AI Infrastructure
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white italic uppercase">
                            20+ Free AI Models for Indian Creators
                        </h1>
                        <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed italic">
                            Unleash the power of the latest AI models. From text generation to neural rendering, access 20+ cutting-edge tools optimized for your workflow.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-10 h-14 font-bold text-sm shadow-xl shadow-emerald-500/20" asChild>
                                <Link href="/ai-explorer" className="flex items-center gap-2">
                                    Explore Models <ArrowRight size={16} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* AI Stack Section */}
                <section className="py-24 relative z-10">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Bot className="text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Text Intelligence</h3>
                                <p className="text-slate-400 text-sm font-medium italic">Advanced LLMs for content writing, code generation, and strategic planning.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
                                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Sparkles className="text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Visual Synthesis</h3>
                                <p className="text-slate-400 text-sm font-medium italic">State-of-the-art diffusion models for high-fidelity image and video generation.</p>
                            </div>
                            <div className="p-8 rounded-[2rem] bg-purple-500/5 border border-white/5 hover:border-purple-500/30 transition-all group">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Cpu className="text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Neural Automation</h3>
                                <p className="text-slate-400 text-sm font-medium italic">AI agents that handle repetitive tasks and synchronize your creative pipeline.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </DashboardShell>
    )
}
