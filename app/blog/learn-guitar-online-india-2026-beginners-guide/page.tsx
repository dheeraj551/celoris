'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Music, Globe, Zap, ListChecks, HelpCircle,
    ArrowRight, Star, Shield, Info, Laptop, Headphones,
    BookOpen, GraduationCap, Timer, AlertCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function GuitarBlogPost() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-guitar-online-2026.png")'
                    }}
                />
                {/* Overlay */}
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
                                Lifestyle & Education
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter text-white drop-shadow-2xl">
                            Learn Guitar Online India 2026: <span className="text-emerald-400">The Complete Beginner's Guide</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 6, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative">
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
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg">
                                    "So you've finally decided to pick up the guitar. Whatever brought you here, one thing is clear: 2026 is genuinely one of the best times to learn guitar online in India."
                                </p>
                            </div>

                            <p>
                                The ecosystem has matured massively. You no longer have to hunt for a decent teacher in your city, adjust your schedule to fit theirs, or settle for someone teaching out of a cramped room with bad acoustics. Today, you can learn from some of India's finest guitarists — right from your bedroom, on a schedule that fits your life.
                            </p>
                            <p>
                                This guide covers everything you need to know: which type of guitar to start with, how online guitar classes in India actually work, what to look for in a course, and which platforms are worth your time in 2026.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <Globe className="h-10 w-10 text-emerald-500" />
                                Why Learn Online Instead of Offline?
                            </h2>
                            <p>
                                For most beginners in India, online learning has become the superior choice. The geographical barriers that once limited your education have vanished, replaced by a global classroom that fits in your pocket.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                {[
                                    {
                                        title: "Better Teachers",
                                        desc: "Learn from Trinity College certified instructors or Bollywood session players, regardless of your zip code.",
                                        icon: <GraduationCap className="h-6 w-6 text-emerald-400" />
                                    },
                                    {
                                        title: "Extreme Flexibility",
                                        desc: "Practice at 10 PM after work or on Sunday mornings. Your schedule, your rules.",
                                        icon: <Clock className="h-6 w-6 text-cyan-400" />
                                    },
                                    {
                                        title: "Cost Effective",
                                        desc: "No travel time or studio overheads. Structured courses often start under ₹1,000/month.",
                                        icon: <Zap className="h-6 w-6 text-yellow-400" />
                                    },
                                    {
                                        title: "Better Resources",
                                        desc: "Get 24/7 access to WhatsApp groups, class recordings, chord sheets, and interactive tabs.",
                                        icon: <BookOpen className="h-6 w-6 text-purple-400" />
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                        <div className="mb-4">{item.icon}</div>
                                        <h4 className="text-white font-black mb-2">{item.title}</h4>
                                        <p className="text-sm text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                Choosing Your <span className="text-emerald-500">First Guitar</span>
                            </h2>
                            <p>
                                Before you hit 'play' on your first lesson, you need the right tool. In India, you have three primary entry points:
                            </p>

                            <div className="space-y-6 my-12">
                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-emerald-500/30 transition-all">
                                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                                        <Music className="h-6 w-6 text-emerald-500" /> Acoustic (Steel String)
                                    </h3>
                                    <p className="text-slate-300 text-sm mb-0">
                                        The most popular choice for Bollywood, Pop, and Rock. Versatile and doesn't need an amp. Best for 90% of beginners.
                                    </p>
                                </div>
                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-cyan-500/30 transition-all">
                                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                                        <Music className="h-6 w-6 text-cyan-500" /> Classical (Nylon String)
                                    </h3>
                                    <p className="text-slate-300 text-sm mb-0">
                                        Softer on the fingertips. Ideal for Indian classical music and fingerstyle pieces.
                                    </p>
                                </div>
                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-purple-500/30 transition-all">
                                    <h3 className="text-xl font-black text-white mb-4 flex items-center gap-3">
                                        <Music className="h-6 w-6 text-purple-500" /> Electric Guitar
                                    </h3>
                                    <p className="text-slate-300 text-sm mb-0">
                                        Needs an amp. The go-to for Metal, Blues, and Jazz. More expensive starting cost but easier on fingers than steel string acoustic.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl mb-8">
                                <p className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Info className="h-5 w-5 text-emerald-500" /> Pro-Tip for 2026:
                                </p>
                                <p className="text-slate-400 text-sm italic mb-0">
                                    A decent beginner acoustic in India costs between ₹3,000–₹7,000. Look for brands like <strong>Kadence, Juârez, or Yamaha</strong>. Don't overspend on your first instrument — you can upgrade once you can play your favorite 5 songs.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                Top Online Platforms in India <span className="text-emerald-500">2026</span>
                            </h2>
                            <p>The market has matured with several high-quality options catering to different needs:</p>

                            <div className="space-y-12 my-16">
                                {[
                                    {
                                        name: "Artium Academy",
                                        desc: "Premium, polished platform with courses certified by Bollywood composer Raju Singh. Offers 1:1 live sessions.",
                                        best: "Structured certification"
                                    },
                                    {
                                        name: "Guitar Kaksha",
                                        desc: "Highly rated (4.9 on Google) offering affordable live classes via Zoom with WhatsApp community support.",
                                        best: "Community & Affordability"
                                    },
                                    {
                                        name: "GuitarMonk",
                                        desc: "Legacy platform with a massive 3-year 'Guitar Excellence Program'. Rare offering: 'Ragas on Guitar' for classical fans.",
                                        best: "Long-term depth"
                                    },
                                    {
                                        name: "Anubhav Kulshreshtha",
                                        desc: "Independent instructor specializing in Trinity College London certifications. Great for those seeking formal credentials.",
                                        best: "Academic Excellence"
                                    },
                                    {
                                        name: "ipassio / Superprof",
                                        desc: "Marketplace models where you can browse and pick teachers based on your budget and genre preference.",
                                        best: "Picking your own teacher"
                                    }
                                ].map((p, i) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-6 p-8 bg-[#12182b] rounded-3xl border border-white/5">
                                        <div className="md:w-1/3">
                                            <h4 className="text-emerald-400 font-black text-xl mb-2">{p.name}</h4>
                                            <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full border border-emerald-500/20">
                                                Best For: {p.best}
                                            </span>
                                        </div>
                                        <div className="md:w-2/3">
                                            <p className="text-slate-400 text-sm leading-relaxed mb-0">{p.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white">
                                Realistic <span className="text-emerald-500">Learning Timeline</span>
                            </h2>
                            <p>Assuming 30–45 minutes of daily practice, here is what your journey should look like:</p>

                            <div className="relative border-l-2 border-emerald-500/30 ml-4 pl-12 space-y-12 my-16">
                                {[
                                    { label: "1 Month", content: "Basic open chords (C, G, D, Em, Am), first simple strumming pattern, and your very first song." },
                                    { label: "3 Months", content: "Switching between chords feels smooth. You can now play 5–10 pop or Bollywood songs comfortably." },
                                    { label: "6 Months", content: "The dreaded 'Barre Chords' are finally conquered. You know basic scales and can play almost any radio hit." },
                                    { label: "1 Year", content: "A solid foundation. You can start improvising simple leads and feel confident playing in front of people." }
                                ].map((t, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[61px] top-1 w-6 h-6 rounded-full bg-emerald-500 border-4 border-[#0a0f1d] z-10" />
                                        <h4 className="text-white font-black text-xl mb-2">{t.label}</h4>
                                        <p className="text-slate-400 text-sm mb-0">{t.content}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <AlertCircle className="h-10 w-10 text-red-500" />
                                Common Mistakes to Avoid
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                                {[
                                    {
                                        title: "Skipping Music Theory",
                                        desc: "You don't need to read sheet music, but understanding rhythm and why chords work will make you learn 10x faster."
                                    },
                                    {
                                        title: "Learning Only Songs",
                                        desc: "Songs are fun, but finger exercises and scales build the muscle memory you need for complex pieces."
                                    },
                                    {
                                        title: "Quitting in the First Month",
                                        desc: "The first 30 days of sore fingertips and slow changes are the 'filter'. Push through, and it gets exponentially easier."
                                    },
                                    {
                                        title: "Not Recording Yourself",
                                        desc: "Video yourself every week. It's the most honest way to catch bad posture or timing issues early."
                                    }
                                ].map((m, i) => (
                                    <div key={i} className="bg-red-500/5 border border-red-500/10 p-8 rounded-3xl">
                                        <h4 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                                            <X className="h-5 w-5 text-red-500" /> {m.title}
                                        </h4>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-0">{m.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-32 text-center">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Ready to start your musical journey?</h2>
                                <p className="text-slate-400 mb-12 text-lg">Explore more creative skills including dance and content creation at Celoris.</p>
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" asChild>
                                    <Link href="/">Back to Home</Link>
                                </Button>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <HelpCircle className="h-10 w-10 text-emerald-500" />
                                FAQs
                            </h2>
                            <div className="mb-32">
                                <Accordion type="single" collapsible className="space-y-4">
                                    {[
                                        {
                                            q: "How many days a week should I practice?",
                                            a: "Consistency is better than intensity. 20 minutes every single day is much better than a 3-hour session once a week. Your brain needs repetitive sleep cycles to cement muscle memory."
                                        },
                                        {
                                            q: "Can I learn guitar at age 30 or 40?",
                                            a: "Absolutely. Adult learners often progress faster than kids because they have better focus and understand the logic behind music better. We see students starting at 50+ as well."
                                        },
                                        {
                                            q: "What is the best age for kids to start?",
                                            a: "Most instructors recommend starting around age 7–10, when their hands are large enough to hold a basic 3/4 size guitar comfortably."
                                        },
                                        {
                                            q: "Is it possible to learn only through YouTube?",
                                            a: "YouTube is great for tips, but it lacks feedback. A teacher can tell you if your thumb placement or pick angle is wrong — mistakes you might not notice on your own until they cause a plateau."
                                        }
                                    ].map((faq, i) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="border-white/10 bg-white/5 px-8 rounded-[2rem] overflow-hidden">
                                            <AccordionTrigger className="text-left text-white font-black py-8 hover:no-underline text-xl">{faq.q}</AccordionTrigger>
                                            <AccordionContent className="text-slate-400 pb-8 text-lg leading-relaxed">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>

                            <div className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts</h2>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    There has never been a better time to be a musician in India. With high-speed internet and world-class teachers available at the click of a button, your guitar journey is only waiting for one thing: your commitment.
                                </p>
                                <p className="text-lg leading-relaxed mb-12">
                                    Start with a trial class. Buy a basic acoustic. Practice every day — even if it's just for 15 minutes while your dinner cooks. <span className="text-emerald-400 font-black">2026 is your year to pick up the strings.</span>
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Learn Guitar Online', 'Music Classes India', 'Guitar for Beginners', 'Online Education 2026', 'Hobby Classes', 'Celoris Music'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris Designs LLP | India's Creative & Skills Ecosystem
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
