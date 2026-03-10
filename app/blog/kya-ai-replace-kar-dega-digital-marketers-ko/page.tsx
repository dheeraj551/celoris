'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Zap, ListChecks, HelpCircle,
    ArrowRight, Star, Shield, Info,
    BookOpen, GraduationCap, Timer, AlertCircle,
    Layout, Database, PenTool, Box, Smartphone,
    Share2, IndianRupee, MapPin, Megaphone, Sparkles, TrendingUp, Users, Heart
} from "lucide-react";

export default function AIReplaceMarketersBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200")'
                    }}
                />
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-16 text-white px-4">
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
                            <span className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md">
                                Digital Marketing
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-4 leading-[1] tracking-tighter text-white drop-shadow-2xl italic uppercase">
                            Kya AI Replace Kar Dega <span className="text-emerald-400">Digital Marketers Ko?</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-black text-emerald-500/90 italic uppercase tracking-tight mb-8">
                            The Real Answer — Bina Bakwaas Ke
                        </p>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Insight</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 10, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <article className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg">
                                    "Agar aap digital marketing mein ho — ya is field mein aana chahte ho — toh ek sawaal zaroor aaya hoga dimag mein: 'Yaar, ab ChatGPT aur sab AI tools aa gaye hain... kya hum log jobless ho jaayenge?'"
                                </p>
                            </div>

                            <p>Baat seedhi karte hain. Honestly? Yeh sawaal valid hai. Aur Reddit pe, Quora pe, LinkedIn pe — ye debate chal rahi hai full speed mein.</p>
                            <p>Toh aaj hum isko properly address karte hain — bina drama ke, bina false hope ke, aur bina unnecessary panic ke. Let's get into it. 👇</p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Zap className="h-10 w-10 text-emerald-500" />
                                Pehle Samjho: AI Actually Karta Kya Hai?
                            </h2>
                            <p>AI — specifically Generative AI tools like ChatGPT, Claude, Gemini — basically karte kya hain? Simple words mein:</p>
                            <ul className="space-y-4 my-8">
                                <li className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-tight italic">Text generate karta hai — blogs, captions, ad copies, emails</span>
                                </li>
                                <li className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-tight italic">Images banata hai — Canva AI, Midjourney, Adobe Firefly</span>
                                </li>
                                <li className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-tight italic">Data analyse karta hai — GA4 AI insights, HubSpot AI</span>
                                </li>
                                <li className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-tight italic">Repetitive tasks automate karta hai — scheduling, reporting</span>
                                </li>
                            </ul>
                            <p>In sab cheezein AI fast karta hai, cheap karta hai, aur 24/7 karta hai. Lekin... yahan ek bahut bada <strong>"but"</strong> hai.</p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <X className="h-10 w-10 text-red-500" />
                                AI Kya Nahi Kar Sakta — Abhi Tak
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                {[
                                    { title: "Emotional Storytelling", desc: "Brand ki real emotional story samajhna aur usse genuinely convey karna AI ke bas ki baat nahi." },
                                    { title: "Cultural Nuance", desc: "Hinglish tone, regional humour, trending memes — AI copy kar sakta hai, originate nahi." },
                                    { title: "Real Strategy", desc: "ChatGPT content likh sakta hai — par kab aur kiske liye likhna hai, woh decision humara hai." },
                                    { title: "Client Trust", desc: "Relationship building aur negotiation purely human game hai. Client AI se pitch nahi sunna chahta." }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                        <h4 className="text-white font-black mb-3 italic uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-sm text-slate-400 italic font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl my-12 shadow-inner">
                                <p className="text-emerald-400 font-black mb-2 uppercase tracking-widest italic flex items-center gap-2">
                                    <Info className="h-5 w-5" /> Key Insight:
                                </p>
                                <p className="text-slate-300 text-lg font-bold italic leading-relaxed mb-0">
                                    AI ek bahut powerful tool hai — but tool hi hai. Carpenter ko replace nahi karta hammer, same tarah AI marketer ko replace nahi karega.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white italic uppercase tracking-tighter">
                                Toh Kaun Replace Hoga? Honest Jawab.
                            </h2>
                            <p>Seedha bolein toh — kuch specific roles aur marketers ko khatra hai. Digital marketers who <strong>don't</strong> use AI will be replaced by those who <strong>do</strong>.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                <div className="bg-red-500/5 p-8 rounded-[2.5rem] border border-red-500/10">
                                    <h3 className="text-red-500 font-black mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5" /> At Risk:
                                    </h3>
                                    <ul className="space-y-4 text-sm font-bold italic text-slate-400 list-none p-0">
                                        <li className="flex items-center gap-2"><X className="h-3 w-3 text-red-500" /> Basic content writers (no strategy)</li>
                                        <li className="flex items-center gap-2"><X className="h-3 w-3 text-red-500" /> Manual scheduling repetitive tasks</li>
                                        <li className="flex items-center gap-2"><X className="h-3 w-3 text-red-500" /> Generic SEO volume-churners</li>
                                        <li className="flex items-center gap-2"><X className="h-3 w-3 text-red-500" /> Low-level data entry staff</li>
                                    </ul>
                                </div>
                                <div className="bg-emerald-500/5 p-8 rounded-[2.5rem] border border-emerald-500/10">
                                    <h3 className="text-emerald-500 font-black mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5" /> Safe & Growing:
                                    </h3>
                                    <ul className="space-y-4 text-sm font-bold italic text-slate-400 list-none p-0">
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Effective AI Power-Users</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Strategy & Psychology Experts</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> Brand Storytellers & Connectors</li>
                                        <li className="flex items-center gap-2"><Check className="h-3 w-3 text-emerald-500" /> High-level Decision Makers</li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white italic uppercase tracking-tighter">
                                Future-Proof Kaise Bane?
                            </h2>
                            <div className="space-y-4 my-12">
                                {[
                                    { step: "01", title: "AI Tools Ko Dost Banao", desc: "ChatGPT se daro mat, use karo roz. Marketing prompts likhna seekho." },
                                    { step: "02", title: "Prompt Engineering Seekho", desc: "Generic prompt = generic output. Specificity is the new currency." },
                                    { step: "03", title: "Basics Pe Focus Karо", desc: "Psychology aur Strategy kabhi nahi badlegi. Inhe strong karo." },
                                    { step: "04", title: "Hybrid Workflow Banao", desc: "AI for speed + Human for quality = Unstoppable combination." }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 p-8 bg-[#121a2e] rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group">
                                        <div className="text-3xl font-black text-emerald-500/20 group-hover:text-emerald-500 transition-colors italic leading-none">{step.step}</div>
                                        <div>
                                            <h4 className="text-white font-black mb-2 uppercase italic tracking-tight">{step.title}</h4>
                                            <p className="text-sm text-slate-400 font-medium italic mb-0 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="my-24 p-12 rounded-[3.5rem] bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/5 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                                    <Megaphone className="h-40 w-40 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 relative z-10">Stop Panic, Start Learning</h3>
                                <p className="text-lg text-slate-400 italic font-bold uppercase tracking-wider mb-12 relative z-10 max-w-2xl mx-auto">
                                    Future unka hai jo AI ko use karte hain — jo AI se darte hain unka nahi. Celoris ka Digital Marketing using AI Tools course exactly isi ke liye hai.
                                </p>
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl px-12 h-16 shadow-2xl shadow-emerald-500/20 group/btn transition-all italic text-sm relative z-10" asChild>
                                    <Link href="/courses/digital-marketing-using-ai-tools" className="flex items-center gap-3">
                                        Join the AI Revolution <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Footer tags */}
                        <div className="mt-16 pt-16 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['AI Marketing', 'Digital Marketing 2026', 'ChatGPT for Business', 'Career Advice', 'Future of Work', 'Celoris Learning'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-default italic">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </article>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4 italic">
                    Published by Celoris | celoris.in | AI-Powered Learning
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase italic">
                    © 2026 Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
