import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Brain, Database, Cpu, Layers, Workflow, ListTodo, Code2, Terminal,
    ArrowRight, Star, Shield, Zap, Info, HelpCircle,
    Share2, Users, Wand2, Phone, TrendingUp,
    Laptop, Search, Layout, Briefcase, Rocket, Palette, MousePointer2, Image as ImageIcon
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata } from 'next';
import ShareButtons from '@/components/ShareButtons';

export const metadata: Metadata = {
    title: 'Adobe Photoshop with AI: The Complete Guide for Designers in 2025 | Celoris',
    description: 'Master Generative Fill, Neural Filters, and Firefly integration in Photoshop CC 2024/2025. A complete guide for intermediate designers.',
    keywords: 'photoshop ai guide, adobe firefly photoshop, generative fill tutorial, neural filters photoshop, ai design tools 2025, photoshop training noida',
};

export default function PhotoshopAIBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-blue-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/photoshop-ai-hero.png")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-16 text-white px-4 mx-auto">
                    <Button
                        variant="ghost"
                        className="text-white w-fit mb-10 hover:bg-white/10 group bg-black/20 backdrop-blur-md border border-white/10 rounded-full pr-6"
                        asChild
                    >
                        <Link href="/blog">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </Link>
                    </Button>

                    <div className="max-w-5xl">
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="bg-blue-500/20 text-blue-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-blue-500/30 backdrop-blur-md">
                                Design • AI Tools • Photoshop
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-blue-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl text-balance">
                            Adobe Photoshop with AI: <span className="text-blue-400 italic block mt-2 text-balance">The Complete Guide for Designers in 2025</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-slate-300 mb-8 max-w-3xl">
                            Master Firefly, Generative Fill, and Neural Filters | Intermediate Level
                        </p>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    E
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Expert Trainer</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">May 2026</span>
                            </div>
                        </div>
                        <div className="mt-10">
                            <ShareButtons 
                                title="Adobe Photoshop with AI: The Complete Guide for Designers in 2025" 
                                slug="adobe-photoshop-ai-guide-2025" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-4 mb-12">
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Level</span>
                            <span className="text-white font-bold">Intermediate</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Prerequisites</span>
                            <span className="text-white font-bold">Basic Photoshop Knowledge</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Focus</span>
                            <span className="text-white font-bold">AI Workflow Efficiency</span>
                        </div>
                    </div>

                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-blue max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-blue-400 prose-strong:font-bold
                            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <section className="mb-20">
                                <p className="text-xl leading-relaxed">
                                    If you've been using Photoshop for a while, you already know the power it holds. But in 2025, Adobe has fundamentally changed what's possible — and if you're not using AI features like Generative Fill, Neural Filters, and Firefly integration, you're spending hours on work that could take minutes.
                                </p>
                                <p className="text-xl leading-relaxed">
                                    This guide breaks down every major AI tool inside Photoshop CC 2024, explains how designers can use them in real projects, and gives you a clear learning path if you want to go from 'I know the basics' to 'I can do this in my sleep.'
                                </p>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Why Photoshop + AI is a Game-Changer</h2>
                                <p>
                                    Adobe's AI engine, <strong>Firefly</strong>, is now deeply embedded inside Photoshop. Unlike third-party AI tools that require you to export, edit, and re-import, Firefly works directly inside your canvas — non-destructively, on a separate generated layer.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                                    {[
                                        "Background replacements that used to take 2 hours now take 5 minutes",
                                        "Complex product cutouts on hair or fur are accurate on the first try",
                                        "Extend banners to any ratio without distortion",
                                        "Delegate retouching to Neural Filters"
                                    ].map((item, i) => (
                                        <div key={i} className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-2xl flex gap-4">
                                            <Check className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
                                            <span className="text-slate-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-3xl text-blue-400 font-bold mb-10 text-center">
                                    The designers who learn these tools now will be significantly more competitive — both as freelancers and in-house.
                                </p>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">The 5 AI Features Every Designer Must Know</h2>
                                <div className="space-y-12">
                                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/20 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-500/30">
                                                <Wand2 className="h-8 w-8 text-blue-400" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white m-0">1. Generative Fill</h3>
                                        </div>
                                        <p className="mb-6 text-slate-400">
                                            Select any area and type a text prompt to fill it with AI-generated content that matches the lighting, perspective, and style. Built on Adobe Firefly, it's commercially safe.
                                        </p>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">
                                            {["Remove distracting people", "Add props to photos", "Replace skies", "Extend image ratios"].map((item, i) => (
                                                <li key={i} className="flex gap-2 items-center text-sm font-bold text-slate-300">
                                                    <Check className="h-4 w-4 text-blue-500" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/20 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-indigo-500/20 p-4 rounded-2xl border border-indigo-500/30">
                                                <Brain className="h-8 w-8 text-indigo-400" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white m-0">2. Neural Filters</h3>
                                        </div>
                                        <p className="mb-6 text-slate-400">
                                            AI-powered adjustments via Filter &gt; Neural Filters. Change expressions, colorize B&amp;W photos, or apply artistic styles.
                                        </p>
                                        <p className="text-xs font-bold text-blue-500 bg-blue-500/10 w-fit px-4 py-2 rounded-full">
                                            Pro tip: Smart Portrait is powerful for e-commerce variations.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-green-500/20 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-green-500/20 p-4 rounded-2xl border border-green-500/30">
                                                <MousePointer2 className="h-8 w-8 text-green-400" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white m-0">3. Remove Background (AI)</h3>
                                        </div>
                                        <p className="text-slate-400">
                                            One-click detection and masking. Refine Edge uses AI to trace complex boundaries like hair or translucent fabric in under a second.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-cyan-500/20 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-cyan-500/20 p-4 rounded-2xl border border-cyan-500/30">
                                                <ImageIcon className="h-8 w-8 text-cyan-400" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white m-0">4. Sky Replacement</h3>
                                        </div>
                                        <p className="text-slate-400">
                                            Automatically detects, masks, and replaces the sky while intelligently relighting the foreground to match the new color and brightness.
                                        </p>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-purple-500/20 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-purple-500/20 p-4 rounded-2xl border border-purple-500/30">
                                                <Palette className="h-8 w-8 text-purple-400" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white m-0">5. Content-Aware Fill with AI Sampling</h3>
                                        </div>
                                        <p className="text-slate-400">
                                            Define custom sampling regions for complex textures like brick, grass, or skin. The CC 2024 algorithm handles these far better than previous versions.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Real Designer Workflow</h2>
                                <p>How a typical designer might create a campaign banner from a single raw photo in under 30 minutes:</p>
                                <div className="bg-black/40 border border-white/10 p-8 rounded-3xl mt-8">
                                    <ol className="space-y-4 m-0 p-0 list-none">
                                        {[
                                            "Remove background using Select Subject + Remove Background",
                                            "Use Generative Expand to widen the canvas to 16:9",
                                            "Replace studio background with a vibrant scene via Generative Fill",
                                            "Apply Neural Filter (Smart Portrait) to brighten model's expression",
                                            "Export three sizes (1:1, 4:5, 16:9) using Artboards"
                                        ].map((step, i) => (
                                            <li key={i} className="flex gap-4 items-center text-slate-400 text-sm">
                                                <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-blue-500 border border-white/10 shrink-0">{i + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                                <p className="mt-8 text-indigo-400 font-bold italic">
                                    Total time with AI: &lt;30 mins. Manual workflow: 2–3 hours. That's the ROI.
                                </p>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Is AI Going to Replace Designers?</h2>
                                <div className="p-8 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
                                    <p className="text-lg leading-relaxed mb-6">
                                        The honest answer is: <strong>AI replaces specific tasks, not creative judgement.</strong>
                                    </p>
                                    <p className="text-slate-300">
                                        AI can generate a background — but it can't understand your client's brand guidelines, audience, and campaign strategy. It can smooth skin — but it can't decide what level of retouching feels authentic.
                                    </p>
                                    <p className="mt-6 text-white font-bold">
                                        Designers who use AI can handle more projects, deliver faster, and offer more value.
                                    </p>
                                </div>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Structured Learning Path</h2>
                                <div className="space-y-4">
                                    {[
                                        { w: "1-2", t: "Generative Fill and Expand", b: "Highest daily impact" },
                                        { w: "3", t: "Neural Filters", b: "Retouching (Smart Portrait, Colorize)" },
                                        { w: "4", t: "AI Selection & Masking", b: "Deep-dive into refined edges" },
                                        { w: "5", t: "Sky & Content-Aware Fill", b: "Environment manipulation" },
                                        { w: "6", t: "AI Text & Firefly", b: "Text effects and text-to-image" },
                                        { w: "7", t: "Automation", b: "Actions, Droplets, and batch processing" },
                                        { w: "8", t: "Capstone Project", b: "Full campaign from brief to delivery" },
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-black border border-blue-500/30">
                                                W{step.w}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-1">{step.t}</h4>
                                                <p className="text-sm text-slate-500 m-0">{step.b}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Frequently Asked Questions</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1" className="border-white/10">
                                        <AccordionTrigger className="text-white font-bold hover:text-blue-400">Do I need a paid Adobe subscription?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400">
                                            Yes. Photoshop CC requires a Creative Cloud subscription. Generative Fill credits are included with most plans.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2" className="border-white/10">
                                        <AccordionTrigger className="text-white font-bold hover:text-blue-400">Can I use Generative Fill images commercially?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400">
                                            Yes. Adobe Firefly is trained on licensed and public-domain images, making its outputs safe for commercial use.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3" className="border-white/10">
                                        <AccordionTrigger className="text-white font-bold hover:text-blue-400">How long does it take to become proficient?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400">
                                            If you already know Photoshop basics and put in 3 hours per week, you can be proficient with all major AI features in 8 weeks.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            <section className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Ready to Level Up?</h2>
                                <p className="text-lg leading-relaxed mb-10 text-balance">
                                    Celoris offers a structured 8-module course covering all of the above, with hands-on projects and live trainer feedback.
                                </p>
                                <div className="bg-blue-600/10 border border-blue-600/20 p-10 md:p-16 rounded-[3rem] my-16 text-center relative overflow-hidden">
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Join the Adobe Photoshop with AI Course</h3>
                                    <p className="text-slate-400 mb-10 text-lg">8 modules, real projects, expert feedback, and a certificate for your LinkedIn.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                            <Link href="/courses/adobe-photoshop-with-ai">
                                                Enroll Now
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl w-full sm:w-auto" asChild>
                                            <Link href="https://wa.me/919084718101">
                                                <Phone className="h-6 w-6 mr-3" /> WhatsApp Query
                                            </Link>
                                        </Button>
                                    </div>
                                    <Palette className="absolute bottom-[-20px] right-[-20px] h-40 w-40 text-blue-500/10 -rotate-12" />
                                </div>
                            </section>
                        </div>

                        {/* Internal Links & Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-blue-500" /> Explore More
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {[
                                    { t: "Best Photoshop Training in Noida", l: "/blog/best-photoshop-training-noida" },
                                    { t: "How to Use Canva for the First Time", l: "/blog/how-to-use-canva-for-the-first-time-beginner-guide" },
                                    { t: "Top 10 Free AI Video Editing Tools", l: "/blog/top-10-free-ai-video-editing-tools-india-2026" },
                                    { t: "Video Editing Trends 2026", l: "/blog/video-editing-trends-2026-premiere-pro-tips" }
                                ].map((link, i) => (
                                    <Link key={i} href={link.l} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{link.t}</span>
                                        <ArrowRight className="h-4 w-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-blue-500 mt-1" />
                                {['photoshop ai', 'adobe firefly', 'generative fill', 'neural filters', 'design tools', '2025 guide'].map((tag) => (
                                    <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-500/20 hover:text-blue-400 transition-all cursor-default border border-white/5 hover:border-blue-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris Expert Insights | Design the Future with AI
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • Professional AI Training
                </p>
            </footer>
        </div>
    );
}
