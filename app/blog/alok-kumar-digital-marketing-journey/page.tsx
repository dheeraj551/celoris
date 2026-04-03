import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check,
    ArrowRight, Star, Zap, Leaf, Heart, Wind,
    BookOpen, Users, TrendingUp, Sparkles,
    Target, LineChart, Globe, Search
} from "lucide-react";

export const metadata: Metadata = {
    title: "From Zero to Campaign Hero: How Alok Kumar's 12-Year Digital Marketing Journey Can Transform Your Career | Celoris Trainer Spotlight",
    description: "Meet Alok Kumar, a digital marketing veteran with 12 years of experience and 500+ students trained. Learn how his expertise can help you master Google Ads, SEO, and Meta Ads.",
    keywords: ['Digital Marketing Course India', 'Alok Kumar Trainer', 'Google Ads Mastery', 'SEO Training India', 'Meta Ads Course', 'Learn Digital Marketing'],
    openGraph: {
        title: "Trainer Spotlight: Alok Kumar - Digital Marketing Masterclass",
        description: "12 Years. 500+ Students. 30+ Brand Campaigns. Learn from the best.",
        images: ['/alok-kumar-digital-marketing-spotlight.png'],
        type: 'article',
    },
};

export default function AlokKumarSpotlightPage() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[700px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{
                        backgroundImage: 'url("/alok-kumar-digital-marketing-spotlight.png")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />

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
                            <span className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md flex items-center gap-2">
                                <Target className="h-3 w-3" /> Trainer Spotlight
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl max-w-4xl">
                            From Zero to <span className="text-emerald-400 italic">Campaign Hero</span>: How Alok Kumar's 12-Year Journey Can Transform Your Career
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-indigo-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    CE
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Editorial Team</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Expert Insight</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">April 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl
                        ">
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg">
                                    "Digital marketing isn't about knowing every tool — it's about knowing which tool to use, when, and why. That's what I teach." — Alok Kumar
                                </p>
                            </div>

                            <p>
                                If you've been trying to break into digital marketing — or level up from basic posting to running real, revenue-generating campaigns — you already know how overwhelming it feels. Every platform has changed. Google Ads looks different. Meta keeps updating its algorithm. And the free YouTube tutorials you've been watching are already a year out of date.
                            </p>

                            <p>
                                That's exactly why learning from someone who lives and breathes this industry — not just teaches from a textbook — makes all the difference. Meet Alok Kumar. 12 years. 500+ students. 30+ brand campaigns. And now, teaching full-time on Celoris.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <Sparkles className="h-10 w-10 text-emerald-500" />
                                Why 12 Years Still Matters
                            </h2>
                            <p>
                                Digital marketing changes every year. New platforms, new ad formats, new algorithms. A lot of people assume that means experience doesn't count — that a fresh course will always be more relevant than a veteran.
                            </p>
                            <p>
                                They're wrong. Here's why. Alok Kumar started his career in 2012, when Facebook Ads were just becoming a serious channel and Google AdWords (now Google Ads) was the wild west of digital budgets. Since then, he has:
                            </p>

                            <div className="bg-[#12182b] p-10 rounded-[3rem] border border-white/5 my-12">
                                <ul className="space-y-4 list-none p-0 m-0">
                                    <li className="flex gap-3 items-start"><Check className="h-5 w-5 text-emerald-500 mt-1" /> Managed campaigns through every major Google algorithm update</li>
                                    <li className="flex gap-3 items-start"><Check className="h-5 w-5 text-emerald-500 mt-1" /> Adapted Meta strategies from organic reach to a paid-first world</li>
                                    <li className="flex gap-3 items-start"><Check className="h-5 w-5 text-emerald-500 mt-1" /> Rebuilt analytics workflows from Universal Analytics to GA4</li>
                                    <li className="flex gap-3 items-start"><Check className="h-5 w-5 text-emerald-500 mt-1" /> Helped businesses pivot digital spend during COVID-19 disruptions</li>
                                </ul>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                                    <h4 className="text-white font-black text-2xl mb-1">12+</h4>
                                    <p className="text-slate-400 text-[10px] uppercase font-black">Years Exp</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                                    <h4 className="text-white font-black text-2xl mb-1">500+</h4>
                                    <p className="text-slate-400 text-[10px] uppercase font-black">Students</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                                    <h4 className="text-white font-black text-2xl mb-1">30+</h4>
                                    <p className="text-slate-400 text-[10px] uppercase font-black">Brands</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                                    <h4 className="text-white font-black text-2xl mb-1">4.9★</h4>
                                    <p className="text-slate-400 text-[10px] uppercase font-black">Rating</p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white">
                                What Alok Actually Teaches
                            </h2>
                            <p>
                                Alok's courses on Celoris are not passive video lectures. Every session is live, every walkthrough is on a real platform, and every lesson ends with a task you can apply that same week. Here's what his curriculum covers:
                            </p>

                            <div className="space-y-6 my-10">
                                <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-8 rounded-3xl border border-emerald-500/20">
                                    <h4 className="text-white font-black mb-2 flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-emerald-500" /> Digital Marketing Bootcamp
                                    </h4>
                                    <p className="text-slate-300">A 40-hour deep dive covering the full funnel. SEO, Google Ads, Meta Ads, Email, and GA4 Analytics.</p>
                                </div>
                                <div className="bg-gradient-to-r from-indigo-500/10 to-transparent p-8 rounded-3xl border border-indigo-500/20">
                                    <h4 className="text-white font-black mb-2 flex items-center gap-3">
                                        <Target className="h-5 w-5 text-indigo-400" /> Google Ads Mastery
                                    </h4>
                                    <p className="text-slate-300">16-hour focused course on Search, Display, Shopping, and YouTube with real account walkthroughs.</p>
                                </div>
                                <div className="bg-gradient-to-r from-cyan-500/10 to-transparent p-8 rounded-3xl border border-cyan-500/20">
                                    <h4 className="text-white font-black mb-2 flex items-center gap-3">
                                        <Search className="h-5 w-5 text-cyan-400" /> SEO for Professionals
                                    </h4>
                                    <p className="text-slate-300">On-page, off-page, and technical SEO using live site audits and professional tools like Ahrefs and SEMrush.</p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white flex items-center gap-4">
                                <Users className="h-10 w-10 text-emerald-500" />
                                Who Should Learn from Alok?
                            </h2>
                            <p>
                                Alok's students come from all walks of life. Whether you're starting from zero or looking to fill gaps in your existing knowledge, the structure is designed to meet you where you are.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
                                {[
                                    { title: "Fresh Graduates", desc: "Build a high-income career path in India's booming digital economy." },
                                    { title: "Working Professionals", desc: "Upskill for a promotion or pivot into a more strategic marketing role." },
                                    { title: "Business Owners", desc: "Stop paying agencies and start running your own high-ROAS campaigns." },
                                    { title: "Freelancers", desc: "Package your skills into high-ticket services for global clients." }
                                ].map((item, i) => (
                                    <div key={i} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col">
                                        <h4 className="text-emerald-400 font-black mb-2">{item.title}</h4>
                                        <p className="text-sm text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white">
                                A Day in Alok's Classroom
                            </h2>
                            <p>
                                Students consistently highlight a few things that set his sessions apart:
                            </p>
                            <div className="space-y-12 my-12">
                                <div className="flex gap-6">
                                    <div className="bg-white/5 p-4 rounded-2xl h-fit border border-white/5">
                                        <Globe className="h-6 w-6 text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-xl mb-2">Live Platform Walkthroughs</h4>
                                        <p className="text-slate-400">No pre-recorded demos. See exactly what Google Ads Manager or Meta Business Suite looks like in a working environment.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="bg-white/5 p-4 rounded-2xl h-fit border border-white/5">
                                        <LineChart className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-xl mb-2">Campaign Case Studies</h4>
                                        <p className="text-slate-400">Insight into real decisions under budget pressure. Learn what worked, what failed, and why.</p>
                                    </div>
                                </div>
                            </div>

                            <blockquote>
                                "One student, a startup founder from Noida, reported a 3x increase in qualified leads within 8 weeks of completing Alok's course — after years of managing campaigns without formal training."
                            </blockquote>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white">
                                Why Celoris — and Why Now
                            </h2>
                            <p>
                                Alok chose Celoris for one simple reason: he wanted to focus on teaching, not on chasing leads. Celoris works differently. Trainers subscribe once and connect directly with serious, paying students. No per-lead charges. No bidding for visibility. Just teaching.
                            </p>
                            <p className="italic text-emerald-400">
                                This is your sign if you've been putting off that digital marketing course. You're not just learning tools. You're learning how a professional thinks.
                            </p>

                            <div className="mt-40 bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] text-center">
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Ready to learn from Alok?</h2>
                                <p className="text-slate-400 mb-12 text-lg max-w-2xl mx-auto">
                                    Book your first session on Celoris and start your journey to becoming a campaign hero today.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                        <Link href="/learn">Find Alok on Celoris</Link>
                                    </Button>
                                    <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] rounded-full px-12 py-8 text-lg w-full sm:w-auto" asChild>
                                        <Link href="/blog">More Insights ↗</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                                {['Digital Marketing', 'Trainer Spotlight', 'Alok Kumar', 'Google Ads', 'SEO Training', 'Meta Ads', 'Celoris Blog'].map((tag) => (
                                    <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-12 text-center text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                                Published by Celoris — India's Skills Marketplace
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
