import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check,
    ArrowRight, Star, Zap, Leaf, Heart, Wind,
    BookOpen, Users, TrendingUp, Sparkles
} from "lucide-react";

export const metadata: Metadata = {
    title: "Yoga for beginners: your complete guide to starting a practice that actually sticks | Celoris",
    description: "Learn how to start your yoga journey today. From essential poses to building a home routine, this guide covers everything beginners need to know.",
    keywords: ['Yoga for beginners', 'start yoga at home', 'yoga benefits', 'hatha yoga', 'vinyasa flow', 'yoga poses for beginners'],
    openGraph: {
        title: "Yoga for beginners: your complete guide to starting a practice that actually sticks | Celoris",
        description: "Everything you need to confidently roll out your mat for the first time.",
        images: ['/blog-yoga-beginners-guide.png'],
        type: 'article',
    },
};

export default function YogaBeginnersBlogPage() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[650px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{
                        backgroundImage: 'url("/blog-yoga-beginners-guide.png")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />

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
                                <Leaf className="h-3 w-3" /> Wellness · Yoga
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl max-w-4xl">
                            Yoga for beginners: your <span className="text-emerald-400 italic">complete guide</span> to starting a practice that actually sticks
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    KS
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Kushum Singh</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Certified Yoga Trainer</p>
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
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[150px] -z-10" />

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
                                    "I want to try yoga, but I don't know where to begin." — I hear this from almost every new student. If that's you, you're in the right place.
                                </p>
                            </div>

                            <p>
                                This guide covers everything you need to confidently roll out your mat for the first time.
                                Yoga is one of the oldest wellness practices in the world, originating in ancient India over 5,000 years ago. Yet its relevance today is stronger than ever. In a world of constant screens, sitting jobs, and rising stress levels, yoga offers something rare: a practice that simultaneously trains your body, quiets your mind, and builds self-awareness — all at the same time.
                            </p>

                            <p>
                                The good news? You don't need to be flexible, strong, or spiritually inclined to start. You just need a mat and willingness to show up.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <Sparkles className="h-10 w-10 text-emerald-500" />
                                What exactly is yoga?
                            </h2>
                            <p>
                                Yoga is far more than physical stretching. The word "yoga" comes from the Sanskrit root "yuj," meaning to unite or join — the idea being that yoga unifies the body, mind, and breath into one conscious experience. While modern yoga is often practiced as physical exercise (asana), traditional yoga also includes breathing techniques (pranayama), meditation (dhyana), and ethical principles.
                            </p>
                            <p>
                                Yoga is not a competition. There is no "perfect pose." Every body is different, and the goal is always progress over perfection — meeting yourself exactly where you are today.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white">
                                Science-backed benefits of yoga
                            </h2>
                            <p>
                                Research consistently shows that a regular yoga practice delivers measurable physical and mental health benefits. Here's what the science says:
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                                    <TrendingUp className="h-8 w-8 text-emerald-500 mb-4" />
                                    <h4 className="text-white font-black text-3xl mb-2">35%</h4>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Improvement in Flexibility in 8 weeks</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                                    <Wind className="h-8 w-8 text-blue-400 mb-4" />
                                    <h4 className="text-white font-black text-3xl mb-2">27%</h4>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Reduction in Cortisol (Stress)</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                                    <Star className="h-8 w-8 text-yellow-500 mb-4" />
                                    <h4 className="text-white font-black text-3xl mb-2">83%</h4>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Report Better Sleep within 1 month</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                                    <Heart className="h-8 w-8 text-red-400 mb-4" />
                                    <h4 className="text-white font-black text-3xl mb-2">Back Pain</h4>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Significantly Redues Chronic Lower Back Pain</p>
                                </div>
                            </div>

                            <p>
                                Beyond the numbers, students also report improved posture, better digestion, increased lung capacity, and a general sense of emotional resilience. Many of my students say they feel "lighter" — not just physically, but mentally — after just a few weeks of consistent practice.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white">
                                Types of yoga — which style is right for you?
                            </h2>
                            <p>
                                There are dozens of yoga styles, but as a beginner, it helps to start with the most accessible ones:
                            </p>
                            <div className="space-y-6 my-10">
                                <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-8 rounded-3xl border border-emerald-500/20">
                                    <h4 className="text-white font-black mb-2 flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-emerald-500" /> Hatha yoga
                                    </h4>
                                    <p className="text-slate-300">Slow-paced, great for beginners. Focuses on holding poses and building body awareness. This is where most students start with me.</p>
                                </div>
                                <div className="bg-gradient-to-r from-blue-500/10 to-transparent p-8 rounded-3xl border border-blue-500/20">
                                    <h4 className="text-white font-black mb-2 flex items-center gap-3">
                                        <Wind className="h-5 w-5 text-blue-400" /> Vinyasa flow
                                    </h4>
                                    <p className="text-slate-300">More dynamic, linking breath to movement in a flowing sequence. Builds strength and cardiovascular endurance.</p>
                                </div>
                                <div className="bg-gradient-to-r from-purple-500/10 to-transparent p-8 rounded-3xl border border-purple-500/20">
                                    <h4 className="text-white font-black mb-2 flex items-center gap-3">
                                        <Heart className="h-5 w-5 text-purple-400" /> Yin yoga
                                    </h4>
                                    <p className="text-slate-300">Deeply relaxing. Poses are held for 3–5 minutes, targeting deep connective tissue. Excellent for stress relief.</p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white">
                                6 essential poses every beginner should learn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-10">
                                {[
                                    { title: "Mountain pose (Tadasana)", desc: "The foundation of all standing poses. Builds posture and body awareness." },
                                    { title: "Downward dog (Adho Mukha)", desc: "Stretches the entire back body. Builds arm and shoulder strength." },
                                    { title: "Warrior I (Virabhadrasana)", desc: "Builds leg strength, hip flexibility, and mental focus." },
                                    { title: "Tree pose (Vrikshasana)", desc: "Develops balance, concentration, and ankle strength." },
                                    { title: "Child's pose (Balasana)", desc: "A resting pose. Relieves back tension, calms the nervous system." },
                                    { title: "Corpse pose (Savasana)", desc: "Final relaxation. Allows the body to absorb the practice fully." }
                                ].map((pose, i) => (
                                    <div key={i} className="bg-black/40 p-6 rounded-2xl border border-white/5 flex flex-col">
                                        <h4 className="text-emerald-400 font-black mb-2">{pose.title}</h4>
                                        <p className="text-sm text-slate-400">{pose.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white flex items-center gap-4">
                                <BookOpen className="h-10 w-10 text-emerald-500" />
                                How to build a beginner routine at home
                            </h2>
                            <p>
                                You don't need a studio to start. A simple home practice 3–4 times per week is more than enough to see meaningful results. Here's a structure I recommend to my new students:
                            </p>
                            <div className="bg-[#12182b] p-10 rounded-[3rem] border border-white/5 my-12">
                                <ul className="space-y-6 list-none p-0">
                                    <li className="flex gap-4">
                                        <div className="bg-emerald-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0">1</div>
                                        <div>
                                            <strong className="text-white">5 minutes:</strong> Sit quietly, observe your breath (pranayama). This sets the tone for the entire session.
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-emerald-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0">2</div>
                                        <div>
                                            <strong className="text-white">10 minutes:</strong> Gentle warm-up: neck rolls, cat-cow, seated twists.
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-emerald-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0">3</div>
                                        <div>
                                            <strong className="text-white">20 minutes:</strong> Main practice: 6–8 postures held for 5–8 breaths each.
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <div className="bg-emerald-500 text-black w-8 h-8 rounded-full flex items-center justify-center font-black shrink-0">4</div>
                                        <div>
                                            <strong className="text-white">5 minutes:</strong> Savasana (final relaxation). Never skip this — it's where the magic happens.
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <p className="italic text-emerald-400">
                                Consistency matters more than duration. A 30-minute practice done 4 days a week will transform your body and mind faster than a 90-minute class done once a week.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white">
                                Common beginner mistakes to avoid
                            </h2>
                            <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl my-10">
                                <ul className="space-y-4 list-none p-0 m-0 text-slate-300">
                                    <li className="flex gap-3 items-start"><Check className="h-5 w-5 text-red-500 mt-1" /> <strong>Holding your breath</strong> — breath is the anchor of every pose.</li>
                                    <li className="flex gap-3 items-start"><Check className="h-5 w-5 text-red-500 mt-1" /> <strong>Comparing yourself to others</strong> — your range of motion is yours alone.</li>
                                    <li className="flex gap-3 items-start"><Check className="h-5 w-5 text-red-500 mt-1" /> <strong>Skipping warm-up</strong> — cold muscles are injury-prone.</li>
                                    <li className="flex gap-3 items-start"><Check className="h-5 w-5 text-red-500 mt-1" /> <strong>Forcing flexibility</strong> — flexibility comes with time.</li>
                                </ul>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white">
                                Yoga and mental health
                            </h2>
                            <p>
                                One of the most profound — and often unexpected — gifts of yoga is its effect on mental wellbeing. The combination of mindful movement, deep breathing, and present-moment awareness activates the parasympathetic nervous system, shifting the body from "fight or flight" to "rest and digest."
                            </p>
                            <blockquote>
                                "Over time, regular practitioners report reduced anxiety, better emotional regulation, and improved self-confidence. The mat becomes a space where you learn to observe your thoughts without judgment."
                            </blockquote>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white">
                                Final words from Kushum
                            </h2>
                            <p>
                                Yoga met me when I needed it most — and it has been my most loyal companion ever since. It's not about perfect poses or Instagram-worthy flexibility. It's about showing up for yourself, breath by breath, day by day.
                            </p>
                            <p className="text-xl font-bold text-white">
                                Start small. Start today. Your mat is waiting.
                            </p>

                            <div className="mt-40 bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] text-center">
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Ready to begin your yoga journey?</h2>
                                <p className="text-slate-400 mb-12 text-lg max-w-2xl mx-auto">
                                    Book a free trial session with Kushum Singh on Celoris — online & in-person available.
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                        <Link href="/courses/complete-2025-yoga-mastery-course">Book Free Trial</Link>
                                    </Button>
                                    <Button variant="outline" size="lg" className="border-white/20 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] rounded-full px-12 py-8 text-lg w-full sm:w-auto" asChild>
                                        <Link href="/courses/complete-2025-yoga-mastery-course">See Full Curriculum ↗</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                                {['Yoga For Beginners', 'Wellness', 'Hatha Yoga', 'Home Practice', 'Mental Health', 'Kushum Singh'].map((tag) => (
                                    <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-12 text-center text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                                Published by Celoris — India's Skill Learning Marketplace
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
