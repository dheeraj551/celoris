'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Zap, ListChecks, HelpCircle,
    ArrowRight, Star, Shield, Info,
    BookOpen, GraduationCap, Timer, AlertCircle,
    Music, Flame, User, Play, Heart, Trophy, Users, Move
} from "lucide-react";

export default function BollywoodZumbaBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-rose-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-bollywood-dance.png")'
                    }}
                />
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />

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
                            <span className="bg-rose-500/20 text-rose-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-rose-500/30 backdrop-blur-md">
                                Dance & Fitness
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-rose-500" /> 10 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-4 leading-[1] tracking-tighter text-white drop-shadow-2xl italic uppercase">
                            Dance Your Way — <span className="text-rose-500">Bollywood & Zumba</span> for Beginners
                        </h1>
                        <p className="text-xl md:text-2xl font-black text-rose-500/90 italic uppercase tracking-tight mb-8">
                            By Dheeraj Kushwaha | Celoris Exclusive
                        </p>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-400 to-orange-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-rose-500">Official Insight</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-rose-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 11, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-rose-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <article className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-rose max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-rose-400 prose-strong:font-bold
                            prose-a:text-rose-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-rose-500/10 border-l-8 border-rose-500 p-8 rounded-r-3xl shadow-lg">
                                    Have you always wanted to dance like your favourite Bollywood stars but never knew where to start? You are not alone. Thousands of Indians dream of moving confidently to Bollywood beats — at weddings, parties, or just for pure joy.
                                </p>
                            </div>

                            <p>The problem is most dance classes are either too expensive, too far, or too intimidating for a complete beginner. That is exactly why <strong>Dheeraj Kushwaha</strong> — a certified trainer with 8+ years of experience — designed <strong>Dance Your Way: Bollywood & Zumba for Complete Beginners</strong>, exclusively available on Celoris.</p>

                            <p>This is not just a course. It is a 6-week transformation that takes you from zero dance experience to performing a full Bollywood routine with confidence. In this blog, we break down everything you need to know — what the course covers, who it is for, why Bollywood + Zumba is the perfect fitness combo, and why Celoris is the best place to learn it.</p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Flame className="h-10 w-10 text-rose-500" />
                                Why Bollywood + Zumba is the Perfect Combo
                            </h2>
                            <p>Most people think of dance and fitness as separate things. Bollywood dance is expressive, emotional, and cultural. Zumba is energetic, rhythmic, and cardio-driven. When you combine both, something magical happens.</p>

                            <ul className="space-y-4 my-8">
                                <li className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-6 w-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3.5 w-3.5 text-rose-500" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-tight italic">Bollywood teaches you expressions, hand movements, and cultural rhythm.</span>
                                </li>
                                <li className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-6 w-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3.5 w-3.5 text-rose-500" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-tight italic">Zumba gives you the cardio stamina and body coordination to keep dancing.</span>
                                </li>
                                <li className="flex items-start gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-6 w-6 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3.5 w-3.5 text-rose-500" />
                                    </div>
                                    <span className="text-slate-300 font-bold uppercase tracking-tight italic">Together, they burn calories, build confidence, and make fitness actually fun.</span>
                                </li>
                            </ul>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <User className="h-10 w-10 text-rose-500" />
                                About the Trainer — Dheeraj Kushwaha
                            </h2>
                            <p>Dheeraj Kushwaha is one of India&apos;s most recognised online trainers, known for making complex skills simple and fun. With 8+ years of teaching experience and thousands of students trained, Dheeraj brings the same energy, clarity, and structure to this dance course that made his Excel training programs a national favourite.</p>

                            <div className="bg-rose-500/10 border border-rose-500/20 p-8 rounded-3xl my-12 shadow-inner">
                                <p className="text-rose-400 font-black mb-2 uppercase tracking-widest italic flex items-center gap-2">
                                    <Info className="h-5 w-5" /> Trainer Philosophy:
                                </p>
                                <p className="text-slate-300 text-lg font-bold italic leading-relaxed mb-0">
                                    &quot;Start from where the student is, not where the trainer wishes they were.&quot; Every lesson in this course is designed with that in mind — no jargon, no judgment, just progress.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white italic uppercase tracking-tighter">
                                What You Will Learn — Full Course Breakdown
                            </h2>
                            <p>The <strong>Dance Your Way</strong> course is 6 weeks long with 24 HD video lessons, taught in Hinglish so every Indian learner feels at home.</p>

                            <div className="space-y-6 my-12">
                                {[
                                    { week: "Week 1", title: "Foundations", desc: "Understanding beats, musical timing, posture, and your first 5 beginner moves." },
                                    { week: "Week 2", title: "Bollywood Essentials", desc: "Classic hand gestures (mudras), hip movements, and short choreography." },
                                    { week: "Week 3", title: "Zumba Fitness Blast", desc: "High energy cardio with salsa, cumbia, and merengue adapted for Indian learners." },
                                    { week: "Week 4", title: "Bollywood Intermediate", desc: "Faster-paced sequences and transitions between complex steps." },
                                    { week: "Week 5", title: "Zumba Advanced", desc: "Full-length routines combining Bollywood expressions with peak Zumba energy." },
                                    { week: "Week 6", title: "Final Performance", desc: "The graduation week — full 2-3 minute choreography and performance tips." }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 p-8 bg-[#121a2e] rounded-3xl border border-white/5 hover:border-rose-500/20 transition-all group">
                                        <div className="text-2xl font-black text-rose-500/20 group-hover:text-rose-500 transition-colors italic leading-none whitespace-nowrap">{step.week}</div>
                                        <div>
                                            <h4 className="text-white font-black mb-2 uppercase italic tracking-tight">{step.title}</h4>
                                            <p className="text-sm text-slate-400 font-medium italic mb-0 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white italic uppercase tracking-tighter">
                                Who Is This Course For?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                {[
                                    "Zero dance experience beginners",
                                    "People who hate boring gym routines",
                                    "Anyone preparing for an upcoming wedding",
                                    "Bollywood music lovers",
                                    "Working professionals seeking flexibility",
                                    "Students looking for a fun hobby"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/5">
                                        <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0">
                                            <Check className="h-4 w-4 text-rose-500" />
                                        </div>
                                        <span className="text-slate-200 font-bold uppercase tracking-tight italic text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white italic uppercase tracking-tighter">
                                Why Learn on Celoris?
                            </h2>
                            <p>Here is what makes Celoris the best place for your dance journey:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                <div className="bg-rose-500/5 p-8 rounded-[2.5rem] border border-rose-500/10">
                                    <h3 className="text-rose-500 font-black mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                        <Shield className="h-5 w-5" /> Transparency
                                    </h3>
                                    <p className="text-sm font-bold italic text-slate-400 leading-relaxed">
                                        Your trainer&apos;s identity is never hidden. You know exactly who is teaching you — a certified expert like Dheeraj Kushwaha.
                                    </p>
                                </div>
                                <div className="bg-orange-500/5 p-8 rounded-[2.5rem] border border-orange-500/10">
                                    <h3 className="text-orange-500 font-black mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                        <BookOpen className="h-5 w-5" /> Structure
                                    </h3>
                                    <p className="text-sm font-bold italic text-slate-400 leading-relaxed">
                                        Real curricula, not random videos. Every lesson builds on the last for guaranteed progress.
                                    </p>
                                </div>
                                <div className="bg-emerald-500/5 p-8 rounded-[2.5rem] border border-emerald-500/10">
                                    <h3 className="text-emerald-500 font-black mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                        <Zap className="h-5 w-5" /> Value
                                    </h3>
                                    <p className="text-sm font-bold italic text-slate-400 leading-relaxed">
                                        One-time payment of just ₹999. No subscriptions, no hidden charges, lifetime access to the 6-week program.
                                    </p>
                                </div>
                                <div className="bg-blue-500/5 p-8 rounded-[2.5rem] border border-blue-500/10">
                                    <h3 className="text-blue-500 font-black mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                        <Trophy className="h-5 w-5" /> Recognition
                                    </h3>
                                    <p className="text-sm font-bold italic text-slate-400 leading-relaxed">
                                        Receive a Celoris completion certificate, perfect for your profile or sharing your achievement on social media.
                                    </p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <HelpCircle className="h-10 w-10 text-rose-500" />
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4 my-12">
                                {[
                                    { q: "Do I need any dance experience?", a: "Absolutely not. The course starts from basics like rhythm and posture. If you can walk, you can start." },
                                    { q: "How much space do I need at home?", a: "Just a 6x6 feet clear area is enough. Your living room or bedroom is perfect." },
                                    { q: "What language is the course in?", a: "Hinglish — a natural mix of Hindi and English that most Indians are comfortable with." },
                                    { q: "Is ₹999 a monthly fee?", a: "No, it's a one-time enrolment fee for the full 6-week course access." }
                                ].map((item, i) => (
                                    <div key={i} className="p-8 bg-[#121a2e] rounded-3xl border border-white/5">
                                        <h4 className="text-white font-black mb-4 uppercase italic tracking-tight">{item.q}</h4>
                                        <p className="text-sm text-slate-400 font-medium italic mb-0 leading-relaxed">{item.a}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="my-24 p-12 rounded-[3.5rem] bg-gradient-to-br from-rose-500/10 to-orange-600/10 border border-white/5 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                                    <Music className="h-40 w-40 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 relative z-10">Ready to Dance?</h3>
                                <p className="text-lg text-slate-400 italic font-bold uppercase tracking-wider mb-12 relative z-10 max-w-2xl mx-auto">
                                    Your first lesson is waiting. Join Dheeraj Kushwaha and start your Bollywood & Zumba journey today.
                                </p>
                                <Button size="lg" className="bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl px-12 h-16 shadow-2xl shadow-rose-500/20 group/btn transition-all italic text-sm relative z-10" asChild>
                                    <Link href="/courses/bollywood-zumba-dance-for-beginners" className="flex items-center gap-3">
                                        Enroll for ₹999 <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Footer tags */}
                        <div className="mt-16 pt-16 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-rose-500 mt-1" />
                            {['Bollywood Dance', 'Zumba Fitness', 'Dance for Beginners', 'Dheeraj Kushwaha', 'Online Dance Classes', 'Fitness Motivation', 'Celoris Learning'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 hover:border-rose-500/30 hover:text-rose-400 transition-all cursor-default italic">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </article>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4 italic">
                    Published by Celoris | celoris.in | Skill-Guided Learning
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase italic">
                    © 2026 Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
