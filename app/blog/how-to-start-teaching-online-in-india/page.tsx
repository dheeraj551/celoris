'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Zap, ListChecks, HelpCircle,
    ArrowRight, Star, Shield, Info,
    BookOpen, GraduationCap, Timer, AlertCircle,
    Layout, Database, PenTool, Box, Smartphone,
    Share2, IndianRupee, MapPin, Megaphone, Sparkles, TrendingUp, Users, Heart,
    CheckCircle2, AlertTriangle, ShieldCheck, CreditCard, FileText, MessageSquare
} from "lucide-react";

export default function TeachingOnlineBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[650px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{
                        backgroundImage: 'url("/blog-how-to-start-teaching-online-in-india.png")'
                    }}
                />
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-16 text-white px-4 mx-auto max-w-7xl">
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
                                Trainer Guide
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 7 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-6 leading-[1.05] tracking-tighter text-white drop-shadow-2xl">
                            How to Start Teaching Online in India: <span className="text-emerald-400 italic">The Complete Guide</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-black text-emerald-500/90 italic uppercase tracking-tight mb-8">
                            (And Why Your Platform Choice Matters More Than You Think)
                        </p>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Guide</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 22, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto max-w-7xl">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <article className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-24 prose-h2:mb-10
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <div className="mb-16">
                                <h2 className="text-2xl md:text-3xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg mt-0">
                                    "If You Are Thinking About Teaching Online, Read This First."
                                </h2>
                            </div>

                            <p>India has one of the largest and fastest-growing markets for online education in the world. With over 500 million internet users and a culture that deeply values skill development, there has never been a better time to start teaching online — whether your expertise is in dance, digital marketing, Excel, spoken English, guitar, Python, photography, or any other skill.</p>
                            
                            <p>But before you sign up for the first platform you find, there is something you need to understand: <strong>not all teaching platforms are built for trainers.</strong> Many are built for the platform itself — and they make money from you long before you make money from your students.</p>
                            
                            <p>This guide is written specifically for new trainers who are evaluating platforms for the first time. By the end, you will know exactly what to look for, what to avoid, and why Celoris is the platform built to help you grow from day one.</p>

                            <h2 className="flex items-center gap-4 italic uppercase tracking-tighter">
                                <IndianRupee className="h-10 w-10 text-emerald-500" />
                                What Does It Actually Cost to Teach on a Platform in India?
                            </h2>
                            <p>Most people assume that joining a teaching platform is free. And technically, registration usually is free. But the real costs appear once you start trying to connect with students.</p>

                            <div className="bg-red-500/5 border border-red-500/10 p-8 rounded-3xl my-10">
                                <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                                    <AlertTriangle className="h-5 w-5" /> The Coin System: A Hidden Per-Lead Charge
                                </h3>
                                <p>Many popular edtech marketplaces in India — including well-known names — use a "coin" system to monetise trainer activity. Here is how it works in practice:</p>
                                <ul className="space-y-4 my-6 list-none p-0">
                                    <li className="flex gap-3 text-slate-400">
                                        <X className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                                        <span>A student submits a learning request; the platform notifies several trainers.</span>
                                    </li>
                                    <li className="flex gap-3 text-slate-400">
                                        <X className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                                        <span>To view student's contact details, you <strong>must spend coins</strong> (real money).</span>
                                    </li>
                                    <li className="flex gap-3 text-slate-400">
                                        <X className="h-5 w-5 text-red-500 shrink-0 mt-1" />
                                        <span>Rs. 50 to Rs. 200 per lead contact. No guarantee of result.</span>
                                    </li>
                                </ul>
                                <p className="text-sm font-bold italic text-slate-400 mt-4 underline decoration-red-500/30 underline-offset-4">
                                    You are paying to participate in a bidding war for students — with no guarantee of a result.
                                </p>
                            </div>

                            <p>For a new trainer just starting out, this model is particularly punishing. You are spending money before you have established a reputation, before you have reviews, and before you know whether the platform's students are the right fit for your courses.</p>

                            <h2 className="flex items-center gap-4 italic uppercase tracking-tighter">
                                <ListChecks className="h-10 w-10 text-emerald-500" />
                                What Should a Good Teaching Platform Give You?
                            </h2>
                            <p>Before choosing any platform, here is a checklist of what every trainer deserves as a baseline — not as a premium add-on:</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                {[
                                    { icon: <Zap className="h-6 w-6 text-emerald-500" />, title: "Zero cost to connect", desc: "You should be able to respond to student enquiries without paying per conversation." },
                                    { icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />, title: "Verified student profiles", desc: "A good platform verifies student intent and location so that the leads you receive are real people." },
                                    { icon: <CreditCard className="h-6 w-6 text-emerald-500" />, title: "Automated payment collection", desc: "Your platform should handle fee collection via UPI and cards automatically." },
                                    { icon: <FileText className="h-6 w-6 text-emerald-500" />, title: "GST-compliant invoicing", desc: "A good platform generates GST-compliant invoices automatically — no manual paperwork." },
                                    { icon: <Users className="h-6 w-6 text-emerald-500" />, title: "Ownership of your audience", desc: "On many platforms, the student relationship belongs to the platform, not to you. You should own it." },
                                    { icon: <Sparkles className="h-6 w-6 text-emerald-500" />, title: "Custom branding", desc: "Your teaching brand is your identity. You shouldn't be forced to operate under their brand alone." }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                        <div className="mb-4">{item.icon}</div>
                                        <h4 className="text-white font-black mb-3 italic uppercase tracking-tight">{item.title}</h4>
                                        <p className="text-sm text-slate-400 italic font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-center italic uppercase tracking-tighter mt-24">Celoris vs. Traditional Platforms</h2>
                            
                            {/* Comparison Table */}
                            <div className="my-16 overflow-x-auto rounded-3xl border border-white/5 shadow-2xl">
                                <table className="w-full border-collapse text-left bg-[#0a0f1d]">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/10 italic font-black uppercase tracking-widest text-[10px]">
                                            <th className="p-6 text-slate-400">Feature</th>
                                            <th className="p-6 text-slate-400">Traditional Platforms</th>
                                            <th className="p-6 text-emerald-400 bg-emerald-500/5">Celoris Platform</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium">
                                        {[
                                            { f: "Per-lead cost", t: "Rs. 50–200 per contact", c: "Rs. 0 — Completely Free" },
                                            { f: "Course hosting", t: "Charged separately", c: "Included in platform" },
                                            { f: "Custom branding", t: "Not available", c: "Full branding control" },
                                            { f: "Direct student chat", t: "Coin-gated / Restricted", c: "Unlimited, no charges" },
                                            { f: "GST invoicing", t: "Manual or unavailable", c: "Automated on every sale" },
                                            { f: "Audience ownership", t: "Platform retains data", c: "You own your audience" },
                                            { f: "Payment collection", t: "Offline / Manual follow-up", c: "UPI & Cards, Automated" }
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 font-bold text-white">{row.f}</td>
                                                <td className="p-6 text-slate-400 italic">{row.t}</td>
                                                <td className="p-6 text-emerald-400 font-bold italic bg-emerald-500/5">{row.c}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-center text-sm font-bold text-slate-500 uppercase tracking-widest italic my-10">
                                Celoris operates on a transparent subscription and revenue-share model. There are no surprise charges.
                            </p>

                            <h2 className="flex items-center gap-4 italic uppercase tracking-tighter">
                                <ShieldCheck className="h-10 w-10 text-emerald-500" />
                                Why Celoris Is Designed Specifically for New Trainers
                            </h2>
                            <p>Most platforms are optimised for trainers who already have a large following and strong reviews. If you are new, you are competing against established trainers in a coin-based system where those with more resources can simply outspend you for leads. <strong>Celoris removes that dynamic entirely.</strong></p>

                            <ul className="space-y-6 my-12 list-none p-0">
                                <li className="bg-[#121a2e] p-8 rounded-[2.5rem] border border-white/5 group hover:border-emerald-500/20 transition-all">
                                    <h4 className="flex items-center gap-3 text-white font-black uppercase italic tracking-tight mb-4">
                                        <TrendingUp className="h-5 w-5 text-emerald-500" /> Start with zero financial risk
                                    </h4>
                                    <p className="text-slate-400 italic leading-relaxed m-0">No per-lead charges. Respond to enquiries, run trial classes, and build your profile without any upfront financial commitment. Your early costs are time and effort — not money.</p>
                                </li>
                                <li className="bg-[#121a2e] p-8 rounded-[2.5rem] border border-white/5 group hover:border-emerald-500/20 transition-all">
                                    <h4 className="flex items-center gap-3 text-white font-black uppercase italic tracking-tight mb-4">
                                        <MapPin className="h-5 w-5 text-emerald-500" /> Build your reputation with real students
                                    </h4>
                                    <p className="text-slate-400 italic leading-relaxed m-0">Connect with verified students in Delhi/NCR for in-person classes, and across India for online instruction. Targeted categories ensure high conversion.</p>
                                </li>
                                <li className="bg-[#121a2e] p-8 rounded-[2.5rem] border border-white/5 group hover:border-emerald-500/20 transition-all">
                                    <h4 className="flex items-center gap-3 text-white font-black uppercase italic tracking-tight mb-4">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Get paid professionally from day one
                                    </h4>
                                    <p className="text-slate-400 italic leading-relaxed m-0">Automated UPI/Card processing and auto-generated GST invoices. Look professional the moment you accept your first student.</p>
                                </li>
                            </ul>

                            <h2 className="flex items-center gap-4 italic uppercase tracking-tighter mt-32">
                                <Smartphone className="h-10 w-10 text-emerald-500" />
                                How to Get Started on Celoris
                            </h2>
                            <div className="space-y-4 my-12">
                                {[
                                    { step: "01", title: "Create Your Profile", desc: "Visit celoris.in — include your subject, experience, and intro." },
                                    { step: "02", title: "List Your Courses", desc: "Offer one-on-one sessions, group classes, or recorded content." },
                                    { step: "03", title: "Set Your Pricing", desc: "You have full control over your rates. No platform restrictions." },
                                    { step: "04", title: "Respond to Enquiries", desc: "Receive student messages at zero cost per lead." },
                                    { step: "05", title: "Collect Payments", desc: "Automated UPI/Card collection with instant invoices." }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 p-8 bg-[#121a2e] rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group">
                                        <div className="text-3xl font-black text-emerald-500/20 group-hover:text-emerald-500 transition-colors italic leading-none shrink-0">{step.step}</div>
                                        <div>
                                            <h4 className="text-white font-black mb-2 uppercase italic tracking-tight">{step.title}</h4>
                                            <p className="text-sm text-slate-400 font-medium italic mb-0 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="my-24 p-12 rounded-[3.5rem] bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/5 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000 pointer-events-none">
                                    <Megaphone className="h-40 w-40 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 relative z-10">Start Your Professional Journey</h3>
                                <p className="text-lg text-slate-400 italic font-bold uppercase tracking-wider mb-12 relative z-10 max-w-2xl mx-auto">
                                    Celoris gives you verified students, zero per-lead cost, automated payments, and full business ownership.
                                </p>
                                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl px-12 h-16 shadow-2xl shadow-emerald-500/20 group/btn transition-all italic text-sm relative z-10" asChild>
                                    <Link href="/become-trainer" className="flex items-center gap-3">
                                        Become a Celoris Trainer <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>

                            <h2 className="flex items-center gap-4 italic uppercase tracking-tighter mt-32">
                                <HelpCircle className="h-10 w-10 text-emerald-500" />
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-6 my-12">
                                {[
                                    { q: "Is Celoris free to join?", a: "Yes. Creating a trainer profile on Celoris is free. We operate on a subscription/revenue-share model — meaning you pay based on what you earn, not as an upfront cost." },
                                    { q: "Can I teach students outside Delhi/NCR?", a: "Yes. While we have a strong base in Delhi/NCR for in-person classes, online trainers can connect with students across all of India." },
                                    { q: "Does Celoris handle GST invoicing automatically?", a: "Yes. Every transaction processed through Celoris generates a GST-compliant invoice automatically for both parties." },
                                    { q: "What happen to my students if I leave?", a: "They are your students. We believe in complete trainer ownership — you retain your audience relationship regardless of the platform." }
                                ].map((faq, i) => (
                                    <div key={i} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
                                        <h4 className="text-white font-black mb-4 uppercase italic tracking-tight">{faq.q}</h4>
                                        <p className="text-slate-400 italic font-medium leading-relaxed m-0">{faq.a}</p>
                                    </div>
                                ))}
                            </div>

                        </div>

                        {/* Footer tags */}
                        <div className="mt-16 pt-16 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Online Teaching India', 'Trainer Platforms', 'Start Teaching Online', 'Celoris Trainers', 'Digital India', 'EdTech India'].map((tag) => (
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
                    Published by Celoris | celoris.in | Built for Indian Trainers
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase italic">
                    © 2026 Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
