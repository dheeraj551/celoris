import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Smartphone, Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee,
    Search, Layout, Share2, Users, Wand2, Phone, TrendingUp
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Digital Marketing Course in Noida (2026) — Complete Guide | Celoris',
    description: 'Looking for the best digital marketing course in Noida? This guide covers top institutes, fees, modules, and career scope. Free demo available. Book now!',
    keywords: 'digital marketing course noida, digital marketing training noida, digital marketing classes noida, digital marketing institute noida, digital marketing fees noida',
};

export default function DigitalMarketingBlogNoida() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/digimarck.png")'
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
                            <span className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md">
                                Digital Marketing • Noida • Career Guide
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl text-balance">
                            Best Digital Marketing Course in Noida (2026) — <span className="text-emerald-400 italic block mt-2 text-balance">Complete Guide</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Team</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">May 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <p className="text-xl leading-relaxed mb-10">
                                Digital marketing is no longer a niche skill — it is the backbone of every business in Noida, from startups in Sector 62 to retail shops in Sector 18. Whether you want to run Facebook ads, rank a website on Google, or grow a brand on Instagram, digital marketing skills are what make it happen.
                            </p>
                            <p>
                                But with dozens of institutes, YouTube courses, and online platforms all claiming to be the best, how do you choose the right digital marketing course in Noida? This guide cuts through the noise and tells you exactly what to look for, how much it costs, and what a genuinely useful curriculum looks like.
                            </p>

                            <div className="my-16 bg-emerald-500/10 border-l-8 border-emerald-500 p-8 md:p-12 rounded-r-3xl shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-emerald-400 text-xl font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info className="h-6 w-6" /> Quick Answer
                                    </h3>
                                    <p className="text-xl md:text-2xl text-slate-100 font-bold leading-relaxed mb-6 text-balance">
                                        For expert-led, practical digital marketing training in Noida with real campaign experience and a free demo — visit <Link href="/digital-marketing-course-noida">celorisdesigns.com/digital-marketing-course-noida</Link>.
                                    </p>
                                    <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-full px-8 py-6" asChild>
                                        <Link href="/digital-marketing-course-noida">View Digital Marketing Course</Link>
                                    </Button>
                                    <p className="mt-4 text-sm text-slate-400">Courses start at ₹2,500.</p>
                                </div>
                                <Zap className="absolute top-1/2 right-10 -translate-y-1/2 h-40 w-40 text-emerald-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            </div>

                            <section className="mt-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Why Digital Marketing is the Hottest Skill in Noida Right Now</h2>
                                <p>
                                    Noida's business landscape has transformed dramatically. The Expressway belt, Sectors 62, 63, and 125 are home to thousands of IT companies, D2C brands, and SMEs — all of which need digital marketers to grow their online presence. At the same time, the rise of content creators, freelancers, and personal brands has made digital marketing skills valuable even outside traditional employment.
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 my-10">
                                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Market Demand in Noida
                                    </h4>
                                    <ul className="space-y-4 list-none p-0 m-0">
                                        {[
                                            "Over 15,000 digital marketing job openings in Delhi NCR at any given time on Naukri and LinkedIn",
                                            "Every e-commerce brand, SaaS startup, and local business now runs paid ads — and needs someone to manage them",
                                            "Freelance digital marketers in Noida earn ₹30,000–80,000 per month working with 3–5 clients",
                                            "Content creators and influencers in NCR are building full-time businesses on Instagram and YouTube",
                                            "Traditional businesses — coaching institutes, clinics, restaurants — now run Google and Meta ads"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
                                                <span className="text-slate-300 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p>
                                    If you are a fresher, a working professional looking to switch, or a business owner who wants to market their own brand — digital marketing is one of the highest ROI skills you can learn in 2026.
                                </p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">What a Good Digital Marketing Course Should Cover</h2>
                                <p className="mb-12">Before you enroll anywhere, check if the course covers these core modules. A good digital marketing training in Noida should include all of the following:</p>
                                
                                <div className="space-y-6">
                                    {[
                                        {
                                            module: "Module 1: Digital Marketing Fundamentals",
                                            topics: "Channels overview (SEO, SEM, Social Media, Email), digital strategy, buyer personas, and key metrics (CPC, CPM, CTR, ROAS)."
                                        },
                                        {
                                            module: "Module 2: Search Engine Optimization (SEO)",
                                            topics: "On-page, Off-page, and Technical SEO. Keyword research, Local SEO (Google Business Profile), and rank tracking."
                                        },
                                        {
                                            module: "Module 3: Google Ads (Search + Display + YouTube)",
                                            topics: "Account structure, search ads, display ads, YouTube ads, and conversion tracking with Google Tag Manager."
                                        },
                                        {
                                            module: "Module 4: Meta Ads (Facebook + Instagram)",
                                            topics: "Business Manager setup, campaign objectives, audience targeting (lookalike, custom), and A/B testing."
                                        },
                                        {
                                            module: "Module 5: Social Media Marketing (Organic)",
                                            topics: "Platform strategy (Insta, LinkedIn, YT), content calendar, Reels/Shorts strategy, and community management."
                                        },
                                        {
                                            module: "Module 6: Content Marketing & Copywriting",
                                            topics: "SEO blogging, copywriting frameworks (AIDA, PAS), email marketing sequences, and landing page optimization."
                                        },
                                        {
                                            module: "Module 7: Analytics & Reporting",
                                            topics: "Google Analytics 4, Google Search Console, attribution models, and building client-ready dashboards."
                                        },
                                        {
                                            module: "Module 8: Freelancing & Agency Skills (Bonus)",
                                            topics: "Getting clients in Noida, pricing services, portfolio creation, and management tools (Notion, Slack, Canva)."
                                        }
                                    ].map((m, i) => (
                                        <div key={i} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black border border-emerald-500/30">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-2">{m.module}</h4>
                                                <p className="text-sm text-slate-400 m-0">{m.topics}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Digital Marketing Course Fees in Noida — 2026 Price Guide</h2>
                                <p>Pricing in Noida varies wildly — from ₹5,000 certificate programs at local institutes to ₹80,000+ at large branded academies. Here is a realistic breakdown:</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
                                    {[
                                        {
                                            title: "Basic Plan",
                                            price: "₹2,500",
                                            duration: "4 Weeks",
                                            target: "Beginners, Students",
                                            focus: "SEO, Social Media, Content Basics"
                                        },
                                        {
                                            title: "Advanced Plan",
                                            price: "₹4,999",
                                            duration: "8 Weeks",
                                            target: "Working Professionals",
                                            focus: "SEO + Google Ads + Meta Ads + Analytics"
                                        },
                                        {
                                            title: "Mastery (1-on-1)",
                                            price: "₹8,000",
                                            duration: "8 Weeks",
                                            target: "Freelancers, Business Owners",
                                            focus: "Full stack + Live campaign management"
                                        }
                                    ].map((plan, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-emerald-500/50 transition-all group relative overflow-hidden">
                                            <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                                                {plan.duration}
                                            </div>
                                            <h3 className="text-2xl font-black text-white mb-2">{plan.title}</h3>
                                            <p className="text-4xl font-black text-emerald-400 mb-6">{plan.price}</p>
                                            <p className="text-xs text-slate-400 mb-6 font-bold italic">Best for: {plan.target}</p>
                                            <p className="text-sm text-slate-300 mb-8 border-t border-white/5 pt-6 flex items-center gap-2">
                                                <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
                                                {plan.focus}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl">
                                    <p className="text-slate-200 font-bold mb-4">All plans include:</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            "10+ practice assignments",
                                            "Live ad campaign experience",
                                            "Celoris completion certificate",
                                            "Lifetime WhatsApp support"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                                                <Check className="h-4 w-4 text-emerald-500" /> {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">How to Choose the Right Digital Marketing Institute in Noida</h2>
                                <div className="space-y-12">
                                    {[
                                        {
                                            title: "1. Check If They Run Live Ad Campaigns",
                                            desc: "Theory alone will not get you a job or clients. The best digital marketing training in Noida gives you hands-on experience managing real Google and Meta ad campaigns. At Celoris, students work on live campaigns during the course."
                                        },
                                        {
                                            title: "2. Verify Trainer's Industry Experience",
                                            desc: "A trainer who has never managed a brand's digital marketing will teach you outdated tactics. Our trainers at Celoris have managed campaigns for real businesses in Delhi NCR with combined ad spends of ₹50L+."
                                        },
                                        {
                                            title: "3. Check the Tool Coverage",
                                            desc: "A good course should teach you industry-standard tools: Google Ads, Meta Business Manager, GA4, Search Console, Semrush/Ahrefs, Canva, and Mailchimp."
                                        },
                                        {
                                            title: "4. Ask About Placement Support",
                                            desc: "Look for institutes that help you build a portfolio and connect with local businesses. At Celoris, we help students connect with small businesses in Noida who need digital marketing support."
                                        },
                                        {
                                            title: "5. Demand a Free Demo First",
                                            desc: "Never pay without attending a free demo session. Celoris offers a free 30-minute demo — no payment, no pressure."
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                            <h4 className="text-xl font-black text-white mb-4">{item.title}</h4>
                                            <p className="text-slate-400 mb-0">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white flex items-center gap-4 text-balance">
                                    <Layout className="h-10 w-10 text-emerald-500 shrink-0" />
                                    Celoris vs Other Options in Noida
                                </h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Feature</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Celoris</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Large Academy</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">YouTube</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { f: "Live Campaign Practice", c: "✅ Yes", l: "⚠️ Limited", y: "❌ No" },
                                                { f: "Batch Size", c: "✅ Max 5 / 1-on-1", l: "❌ 20-30 students", y: "❌ No interaction" },
                                                { f: "Home Visit Option", c: "✅ Yes", l: "❌ No", y: "❌ No" },
                                                { f: "Lifetime Support", c: "✅ WhatsApp", l: "❌ No", y: "❌ No" },
                                                { f: "Price", c: "₹2,500–8,000", l: "₹15k–50k", y: "Free" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.f}</td>
                                                    <td className="p-6 text-emerald-400 font-bold">{row.c}</td>
                                                    <td className="p-6 text-slate-500">{row.l}</td>
                                                    <td className="p-6 text-slate-500">{row.y}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Digital Marketing Jobs After This Course in Noida</h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Job Role</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Avg Salary (Noida)</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Key Skills</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { r: "Digital Marketing Executive", s: "₹2.5L – ₹4.5L", k: "SEO, Social Media, Google Ads basics" },
                                                { r: "SEO Analyst", s: "₹2.5L – ₹5L", k: "On-page, Off-page, Technical SEO" },
                                                { r: "Social Media Manager", s: "₹2.5L – ₹5L", k: "Content, Meta Ads, Analytics" },
                                                { r: "PPC / Google Ads Manager", s: "₹3.5L – ₹7L", k: "Google Ads, Meta Ads, Analytics" },
                                                { r: "Growth Marketer", s: "₹4L – ₹10L", k: "Paid + Organic + Analytics" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.r}</td>
                                                    <td className="p-6 text-emerald-400 font-black">{row.s}</td>
                                                    <td className="p-6 text-slate-400">{row.k}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="mt-32">
                                <h2 className="text-3xl md:text-5xl font-black mb-12 text-white flex items-center gap-4">
                                    <HelpCircle className="h-10 w-10 text-emerald-500" /> Frequently Asked Questions
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    <AccordionItem value="item-1" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Is digital marketing a good career in 2026?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes — digital marketing is one of the fastest growing career fields in India. Every business, from a local Noida restaurant to a Nasdaq-listed IT firm, needs digital marketing.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">How long does it take to learn digital marketing?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            You can learn the basics in 4 weeks. A comprehensive course covering SEO, Google Ads, Meta Ads, and Analytics typically takes 8 weeks.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Which digital marketing skill pays the most in Noida?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Google Ads and Meta Ads specialists are the highest paid because they directly manage ad budgets and ROI is measurable.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Can a Celoris trainer come to my home in Noida?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes. Celoris trainers offer home-visit sessions across all Noida sectors and Greater Noida. You can also choose fully online sessions via Zoom.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            <section className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts</h2>
                                <p className="text-lg leading-relaxed mb-10">
                                    The brand name of the institute matters far less than the quality of the trainer and the hands-on experience you get. Celoris digital marketing training in Noida gives you real practitioners, small batches, and live campaign experience.
                                </p>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-16 text-center">
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Book Your FREE Demo Today</h3>
                                    <p className="text-slate-400 mb-10 text-lg">Talk to an expert trainer who has handled real client accounts. No commitment required.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                            <Link href="https://wa.me/919084718101">
                                                <Phone className="h-6 w-6 mr-3" /> WhatsApp Demo
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl w-full sm:w-auto" asChild>
                                            <Link href="/digital-marketing-course-noida">Course Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Internal Links & Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-emerald-500" /> Related Articles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {[
                                    { t: "Best Microsoft Excel Training in Noida", l: "/blog/best-microsoft-excel-training-noida" },
                                    { t: "Best Digital Marketing Course in Gurgaon", l: "/blog/best-digital-marketing-course-gurgaon" },
                                    { t: "Social Media Marketing Course Noida", l: "/blog/social-media-marketing-course-noida" },
                                    { t: "All Trainers in Noida", l: "/learn?location=noida" }
                                ].map((link, i) => (
                                    <Link key={i} href={link.l} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{link.t}</span>
                                        <ArrowRight className="h-4 w-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                                {['digital marketing course noida', 'digital marketing training noida', 'digital marketing classes noida', 'digital marketing institute noida', 'digital marketing fees noida', 'SEO training noida', 'Google Ads training noida'].map((tag) => (
                                    <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce sm:hidden">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl shadow-emerald-500/40 border-4 border-black/20" asChild>
                    <Link href="https://wa.me/919084718101">Book Demo</Link>
                </Button>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris Designs LLP | Noida's Leading Creative Skills Platform
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
