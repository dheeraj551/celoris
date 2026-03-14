'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Smartphone, Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee, Video, Music, Users
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-dance-classes-2026.png")'
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
                                <Clock className="h-4 w-4 text-emerald-500" /> 10 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter text-white drop-shadow-2xl">
                            Online Dance Classes India 2026 — <span className="text-emerald-400">Find the Best Classes Near You</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Insights</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 4, 2026</span>
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
                                    "Want to learn dance but can't find good classes near you? Here's why thousands of Indians are switching to online dance classes in 2026 — and how to find the best one."
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <Info className="h-10 w-10 text-emerald-500" />
                                Why "Dance Classes Near Me" Is the Wrong Search in 2026
                            </h2>
                            <p>
                                You open Google, type "dance classes near me" — and what do you get? A list of studios 10 km away. Odd timings. ₹3,000/month fees. And a 45-minute commute both ways.
                            </p>
                            <p>
                                <strong>That's not learning dance. That's a logistics problem.</strong>
                            </p>
                            <p>
                                In 2026, the smartest students in India are searching differently. They're finding world-class dance trainers online — flexible timings, affordable fees, and zero commute. From their bedroom, hostel room, or living room. And they're getting better results.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                What Dance Styles Can You Learn Online in India?
                            </h2>
                            <p>More than you think. Here's what's trending right now:</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                                <div className="bg-[#121a2e] p-8 rounded-[2rem] border border-white/5">
                                    <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-3">
                                        <Music className="h-6 w-6" /> 1. Bollywood Dance
                                    </h3>
                                    <p className="text-sm">The most searched dance style in India. High energy, expressive, and perfect for beginners. Online classes are ideal because you can rewatch moves frame by frame.</p>
                                </div>
                                <div className="bg-[#121a2e] p-8 rounded-[2rem] border border-white/5">
                                    <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
                                        <Star className="h-6 w-6" /> 2. Classical Dance
                                    </h3>
                                    <p className="text-sm">Many Kathak and Bharatnatyam gurus now teach globally via video. Students in the US, Singapore, and the UK are learning Indian classical dance from Indian trainers on platforms like Celoris.</p>
                                </div>
                                <div className="bg-[#121a2e] p-8 rounded-[2rem] border border-white/5">
                                    <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-3">
                                        <Zap className="h-6 w-6" /> 3. Western Dance
                                    </h3>
                                    <p className="text-sm">Huge demand for Hip Hop, Contemporary, and Jazz. YouTube got you started — but a real trainer gives you corrections and a structured learning path.</p>
                                </div>
                                <div className="bg-[#121a2e] p-8 rounded-[2rem] border border-white/5">
                                    <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
                                        <Users className="h-6 w-6" /> 4. Zumba & Fitness
                                    </h3>
                                    <p className="text-sm">Zumba online blew up post-2020 and never came back down. Housewives, office workers, seniors — everyone's doing it for fun and fitness.</p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                Online vs Offline — <span className="text-emerald-400">Honest Comparison</span>
                            </h2>
                            <div className="overflow-x-auto my-12 bg-[#0d1426] rounded-[2.5rem] border border-white/10 p-4 shadow-inner">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                            <th className="py-6 px-6">Feature</th>
                                            <th className="py-6 px-6">Offline Classes</th>
                                            <th className="py-6 px-6 text-emerald-400">Online Classes (2026)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-300 font-bold text-sm">
                                        {[
                                            { f: "Location", off: "Fixed studio", on: "Anywhere in India" },
                                            { f: "Timing", off: "Fixed batches", on: "Flexible slots" },
                                            { f: "Monthly Cost", off: "₹2,000–₹8,000", on: "₹500–₹3,000" },
                                            { f: "Trainer Quality", off: "Local only", on: "Best in India" },
                                            { f: "Replay", off: "❌ No", on: "✅ Yes" },
                                            { f: "Travel Time", off: "30–90 min/day", on: "Zero" },
                                            { f: "Performance", off: "Studio only", on: "Home + studio" }
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="py-6 px-6 text-slate-400">{row.f}</td>
                                                <td className="py-6 px-6">{row.off}</td>
                                                <td className="py-6 px-6 text-emerald-400">{row.on}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-center font-black text-xl mb-12">Verdict: <span className="text-emerald-500 uppercase">Online wins</span> on cost, flexibility, and access.</p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white flex items-center gap-4">
                                <Users className="h-10 w-10 text-emerald-500" />
                                How to Find the Best Online Class (2026 Guide)
                            </h2>
                            <div className="space-y-8 my-12">
                                <div className="flex gap-6 items-start">
                                    <span className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl shrink-0 border border-emerald-500/30">1</span>
                                    <div>
                                        <h4 className="text-white font-black text-xl mb-2">Define your goal</h4>
                                        <p className="text-slate-400">Are you learning for fun? Fitness? A wedding? To become professional? Your goal changes the trainer and style you need.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <span className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl shrink-0 border border-emerald-500/30">2</span>
                                    <div>
                                        <h4 className="text-white font-black text-xl mb-2">Check trainer credentials</h4>
                                        <p className="text-slate-400">Look for performance videos, real student testimonials, and a structured curriculum — not just random videos.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <span className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl shrink-0 border border-emerald-500/30">3</span>
                                    <div>
                                        <h4 className="text-white font-black text-xl mb-2">Do a free demo first</h4>
                                        <p className="text-slate-400">Never pay upfront without a demo. Check their teaching style, video quality, and how they give corrections.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start">
                                    <span className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl shrink-0 border border-emerald-500/30">4</span>
                                    <div>
                                        <h4 className="text-white font-black text-xl mb-2">Check the platform</h4>
                                        <p className="text-slate-400">Platforms like <strong>Celoris</strong> verify trainers and let students leave genuine reviews, so you know who you're booking.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-32 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Music className="w-32 h-32" />
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Find a Dance Trainer on Celoris</h2>
                                <p className="text-slate-400 mb-12 text-lg">Whether you want to learn Bollywood, Classical, Hip Hop, or Zumba — Celoris connects you with the best verified trainers across India. Free demos available!</p>
                                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-2xl px-12 py-8 text-lg" asChild>
                                        <Link href="/learn">Find a Trainer</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 font-black uppercase tracking-widest rounded-2xl px-12 py-8 text-lg" asChild>
                                        <Link href="/become-trainer">Become a Trainer</Link>
                                    </Button>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <HelpCircle className="h-10 w-10 text-emerald-500" />
                                FAQs
                            </h2>
                            <div className="mb-32">
                                <Accordion type="single" collapsible className="space-y-4">
                                    {[
                                        {
                                            q: "Can I really learn dance properly online?",
                                            a: "Absolutely. Thousands of students in India are doing it right now. The key is live 1-on-1 or small group classes with a real trainer — not just watching YouTube videos."
                                        },
                                        {
                                            q: "What equipment do I need?",
                                            a: "Just a phone or laptop, a decent internet connection, and 6x6 feet of clear floor space. That's all!"
                                        },
                                        {
                                            q: "Is online dance class good for kids?",
                                            a: "Yes — kids adapt to online learning very fast. Many parents prefer it because they can watch the class and there's no travel involved."
                                        },
                                        {
                                            q: "How long does it take to learn basics?",
                                            a: "With 2 classes per week, most beginners can perform a basic routine within 4–6 weeks. Classical forms take slightly longer for a solid foundation."
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
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Dance Classes India', 'Online Learning', 'Celoris', 'Bollywood Dance', 'Bharatnatyam Online', 'Zumba 2026'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl shadow-emerald-500/40 border-4 border-black/20" asChild>
                    <Link href="https://wa.me/919084718101?text=Hi%20Celoris%2C%20I%20saw%20your%20blog%20about%20Online%20Dance%20Classes%20and%20I'd%20like%20to%20book%20a%20free%20demo%20session.">
                        Book Free Demo via WhatsApp
                    </Link>
                </Button>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris Designs LLP | India's Free Creative Studio
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
