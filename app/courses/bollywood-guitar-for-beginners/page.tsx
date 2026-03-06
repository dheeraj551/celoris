"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download, Music, Zap, Play, Layout, Heart, Calendar, Guitar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function BollywoodGuitarCourse() {
    const courseData = {
        title: "🎸 BOLLYWOOD GUITAR — Complete Beginners 8-Week Course",
        description: "8-Week Online Programme designed for complete beginners in India for 2026. Learn to play 15+ Bollywood songs from scratch.",
        summary: "This 8-week programme is designed specifically for complete beginners who want to play Bollywood and Hindi film songs on the acoustic guitar. No prior musical experience is needed — just a guitar, enthusiasm, and 30 minutes of daily practice.",
        students: 850,
        rating: 4.9,
        duration: "8 Weeks | 24 Live Lessons",
        price: 1999.00,
        currency: "INR",
        provider: "Celoris Designs LLP",
        instructor: "Celoris Music Academy",
        learning_outcomes: [
            "Play all essential open chords: C, D, Em, G, Am, F, A, E",
            "Execute clean chord transitions in real song context",
            "Apply 5 core strumming patterns used across Bollywood genres",
            "Read and use guitar chord charts and basic tabs independently",
            "Play 15+ Bollywood songs from beginner to intermediate level",
            "Perform a complete song confidently for the Week 8 showcase"
        ],
        requirements: [
            "An acoustic guitar (steel-string recommended)",
            "A tuner app (GuitarTuna or Fender Tune)",
            "30 minutes of daily practice commitment",
            "No prior music theory experience required"
        ],
        syllabus: [
            {
                unit: "Week 1 — HELLO, GUITAR!",
                focus: "Getting comfortable with the instrument",
                chapters: [
                    { title: "Lesson 1.1 — Meet Your Guitar", desc: "Parts of the guitar, how to hold it, posture, tuning with an app." },
                    { title: "Lesson 1.2 — Your First Chord — Em", desc: "Fretting hand position, Em chord, avoiding buzzing strings." },
                    { title: "Lesson 1.3 — Second Chord — Am", desc: "Am chord shape, switching between Em and Am, down strum rhythm." }
                ]
            },
            {
                unit: "Week 2 — CHORD FAMILY",
                focus: "Adding G, C, and D — the holy trinity of Bollywood",
                chapters: [
                    { title: "Lesson 2.1 — G and D Chords", desc: "G chord (3-finger shape), D chord, transition drills." },
                    { title: "Lesson 2.2 — C Chord", desc: "C chord shape, common buzzing fixes, 4-chord progression." },
                    { title: "Lesson 2.3 — First Full Song", desc: "Full verse + chorus using 4 chords, song structure." }
                ]
            },
            {
                unit: "Week 3 — STRUM LIKE YOU MEAN IT",
                focus: "Rhythm patterns that make songs sound real",
                chapters: [
                    { title: "Lesson 3.1 — Down-Up Strumming", desc: "D-DU strumming pattern, wrist motion, staying on beat." },
                    { title: "Lesson 3.2 — The DUDU Pattern", desc: "4/4 time signature, DUDU pattern, using a metronome." },
                    { title: "Lesson 3.3 — Bollywood Rhythm Pattern", desc: "DDUUDU — the most common Bollywood strum." }
                ]
            },
            {
                unit: "Week 4 — SONGS & MORE SONGS",
                focus: "Building your first Bollywood repertoire",
                chapters: [
                    { title: "Lesson 4.1 — Kahani Suno (Kaifi Khalil)", desc: "Intro to capo, capo at fret 4, playing easier chords in higher keys." },
                    { title: "Lesson 4.2 — Tera Ban Jaunga", desc: "Chord review in new song context, verse-chorus-bridge structure." },
                    { title: "Lesson 4.3 — Week 4 Mini Performance", desc: "Play any 2 songs learnt so far, feedback session." }
                ]
            },
            {
                unit: "Week 5 — THE F CHORD & BARRE BASICS",
                focus: "The milestone every beginner dreads — and conquers",
                chapters: [
                    { title: "Lesson 5.1 — Why F is Hard (And How to Fix It)", desc: "F chord anatomy, common grip mistakes, mini-barre technique." },
                    { title: "Lesson 5.2 — F Chord Mastery Drill", desc: "C → F → G → Am progression, strength-building exercises." },
                    { title: "Lesson 5.3 — A and E Chords", desc: "A major and E major shapes, major vs minor sound difference." }
                ]
            },
            {
                unit: "Week 6 — FINGERPICKING INTRO",
                focus: "Adding texture and emotion to your playing",
                chapters: [
                    { title: "Lesson 6.1 — Fingerpicking Basics", desc: "PIMA finger names, alternating bass pattern, thumb independence." },
                    { title: "Lesson 6.2 — Arpeggio Pattern", desc: "String-by-string arpeggio, 4-string pattern, smooth transitions." },
                    { title: "Lesson 6.3 — Strumming vs Fingerpicking", desc: "When to use which technique, combining both in one song." }
                ]
            },
            {
                unit: "Week 7 — STUDENT'S CHOICE WEEK",
                focus: "Learn the songs YOU love",
                chapters: [
                    { title: "Lesson 7.1 — Student Song 1 — Deep Dive", desc: "Full chord analysis, instructor-guided breakdown." },
                    { title: "Lesson 7.2 — Student Song 2 — Deep Dive", desc: "Full chord analysis, strum pattern identification." },
                    { title: "Lesson 7.3 — Performance Prep", desc: "Managing nerves, consistent tempo, recovery from mistakes." }
                ]
            },
            {
                unit: "Week 8 — GRAND FINALE & SHOWCASE",
                focus: "You've earned this moment",
                chapters: [
                    { title: "Lesson 8.1 — Full Course Revision", desc: "Chord library review, strum patterns recap, Q&A." },
                    { title: "Lesson 8.2 — Showcase Rehearsal", desc: "Final run-through of showcase song, stage presence tips." },
                    { title: "Lesson 8.3 — Live Showcase & Certificate", desc: "Student performs; instructor feedback; certificate awarded." }
                ]
            }
        ],
        songs: [
            { name: "Tum Hi Ho", artist: "Aashiqui 2", difficulty: "★☆☆ Beginner" },
            { name: "Kal Ho Na Ho", artist: "K3G / Shankar", difficulty: "★☆☆ Beginner" },
            { name: "Channa Mereya", artist: "Ae Dil Hai Mushkil", difficulty: "★☆☆ Beginner" },
            { name: "Tujh Mein Rab Dikhta Hai", artist: "RNBDJ", difficulty: "★☆☆ Beginner" },
            { name: "Jeena Jeena", artist: "Badlapur", difficulty: "★★☆ Easy" },
            { name: "Phir Mohabbat", artist: "Murder 2", difficulty: "★★☆ Easy" },
            { name: "Kahani Suno", artist: "Kaifi Khalil", difficulty: "★★☆ Easy" },
            { name: "Tera Ban Jaunga", artist: "Kabir Singh", difficulty: "★★☆ Easy" },
            { name: "Aankhon Mein Teri", artist: "Om Shanti Om", difficulty: "★★☆ Easy" },
            { name: "Mast Magan", artist: "2 States", difficulty: "★★☆ Easy" },
            { name: "Dil Dhadakne Do", artist: "Title Track", difficulty: "★★★ Intermediate" },
            { name: "Teri Deewani", artist: "Kailash Kher", difficulty: "★★★ Intermediate" },
            { name: "Zindagi Na Milegi Dobara", artist: "SEL", difficulty: "★★★ Intermediate" },
            { name: "Kun Faya Kun", artist: "Rockstar", difficulty: "★★★ Intermediate" },
            { name: "Raabta", artist: "Agent Sai Srinivasa", difficulty: "★★★ Intermediate" }
        ],
        faqs: [
            {
                question: "Do I need any prior music experience?",
                answer: "No. This course is designed for complete beginners. If you can tap your foot to a beat, you're ready to start."
            },
            {
                question: "Which guitar should I buy?",
                answer: "A steel-string acoustic guitar in the ₹3,000–₹6,000 range is perfect to start. Brands like Kadence, Juarez, and Yamaha are popular choices."
            },
            {
                question: "What if I miss a class?",
                answer: "All sessions are recorded. You'll receive the recording within 24 hours of each class."
            },
            {
                question: "How long before I can play a full song?",
                answer: "Most students play their first recognisable song by end of Week 2. By Week 4, you'll have 4–5 songs in your repertoire."
            },
            {
                question: "Is a capo required?",
                answer: "Not immediately. It's introduced in Week 4 and costs around ₹200–₹400. We'll guide you on when and why to use it."
            },
            {
                question: "Will I get a certificate?",
                answer: "Yes! All students who complete Week 8 and participate in the showcase receive a Celoris Course Completion Certificate."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Bollywood Guitar for Beginners",
        "description": "8-week Bollywood Guitar online course for complete beginners in India.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Music Academy",
            "sameAs": "https://celoris.in"
        },
        "educationalLevel": "Beginner",
        "offers": [
            {
                "@type": "Offer",
                "category": "MonthlySubscription",
                "price": "1999.00",
                "priceCurrency": "INR",
                "url": "https://celoris.in/courses/bollywood-guitar-for-beginners"
            }
        ]
    }

    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 py-8 selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-emerald-500">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-500">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-500">Courses</Link>
                    <span>/</span>
                    <span className="text-white line-clamp-1">{courseData.title}</span>
                </div>

                <Link href="/learn/courses" className="inline-flex items-center text-slate-500 hover:text-emerald-500 mb-6 group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-emerald-500/30">Music & Arts</span>
                                <span className="bg-white/5 px-4 py-1.5 rounded-full text-xs font-bold border border-white/5">8-Week Program</span>
                                <span className="bg-yellow-500/20 text-yellow-500 px-4 py-1.5 rounded-full text-xs font-bold border border-yellow-500/30">Hinglish</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tighter italic uppercase">
                                {courseData.title}
                            </h1>
                            <div className="bg-[#0a0f1d] p-8 rounded-[2.5rem] border-l-8 border-emerald-500 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Guitar size={120} />
                                </div>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Course Intent</h2>
                                <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-bold italic relative z-10">
                                    "{courseData.summary}"
                                </p>
                            </div>
                        </div>

                        {/* Course Image */}
                        <Card className="overflow-hidden border-none bg-transparent">
                            <div className="aspect-video relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
                                <img
                                    src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800"
                                    alt="Bollywood Guitar Beginners Course - Celoris"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-60" />
                            </div>
                        </Card>

                        {/* What You'll Learn */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-4 md:p-8">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3 text-white text-3xl font-black italic uppercase tracking-tighter">
                                    <Zap className="h-8 w-8 text-emerald-500" />
                                    <span>Learning Outcomes</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-4 group">
                                            <div className="mt-1 bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                <CheckCircle className="h-4 w-4" />
                                            </div>
                                            <span className="text-slate-300 font-bold leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Curriculum */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-4 md:p-8">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3 text-white text-3xl font-black italic uppercase tracking-tighter">
                                    <BookOpen className="h-8 w-8 text-emerald-500" />
                                    <span>Curriculum Roadmap</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="space-y-4">
                                    {courseData.syllabus.map((unit, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-white/5 bg-white/5 px-6 md:px-10 rounded-[2rem] overflow-hidden">
                                            <AccordionTrigger className="text-left font-black text-white hover:no-underline py-8 text-xl italic uppercase">
                                                {unit.unit}
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 space-y-6">
                                                <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4">Focus: {unit.focus}</p>
                                                <div className="space-y-4 pl-4 border-l-2 border-emerald-500/30">
                                                    {unit.chapters.map((chapter, cIndex) => (
                                                        <div key={cIndex} className="relative group">
                                                            <div className="absolute -left-[1.35rem] top-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors uppercase italic">{chapter.title}</h3>
                                                            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-medium italic">{chapter.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Song List */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                            <CardTitle className="flex items-center space-x-3 text-white text-3xl font-black italic uppercase tracking-tighter mb-8">
                                <Music className="h-8 w-8 text-emerald-500" />
                                <span>Master Repertoire (15+ Songs)</span>
                            </CardTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {courseData.songs.map((song, i) => (
                                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <h4 className="font-black text-white group-hover:text-emerald-400 transition-colors italic uppercase tracking-tight">{song.name}</h4>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{song.artist}</p>
                                        <span className="text-[10px] text-emerald-500/60 font-black uppercase mt-2 block">{song.difficulty}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Requirements */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                            <CardTitle className="flex items-center space-x-3 text-white text-2xl font-black uppercase tracking-tighter mb-8 italic">
                                <Layout className="h-6 w-6 text-emerald-500" />
                                <span>Prerequisites</span>
                            </CardTitle>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.requirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span className="font-bold text-sm italic">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* FAQs */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                            <CardTitle className="flex items-center space-x-3 text-white text-2xl font-black uppercase tracking-tighter mb-8 italic">
                                <HelpCircle className="h-6 w-6 text-emerald-500" />
                                <span>Common Queries</span>
                            </CardTitle>
                            <Accordion type="single" collapsible className="space-y-3">
                                {courseData.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border-white/5">
                                        <AccordionTrigger className="text-left font-bold text-white hover:no-underline uppercase italic tracking-tight">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 leading-relaxed text-base pt-2 font-medium italic">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Stats Card */}
                            <Card className="bg-[#0d1426] border-2 border-emerald-500/30 rounded-[3rem] p-8 shadow-3xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all" />
                                <div className="relative z-10">
                                    <div className="text-center mb-8">
                                        <div className="text-4xl font-black text-white mb-2 leading-none italic tracking-tighter">₹1,999<span className="text-sm">/mo</span></div>
                                        <div className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px] italic">Starting Price</div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {[
                                            { icon: <Clock className="h-4 w-4" />, text: "8 Weeks Program" },
                                            { icon: <Users className="h-4 w-4" />, text: "Live Sessions & Support" },
                                            { icon: <Music className="h-4 w-4" />, text: "15+ Bollywood Songs" },
                                            { icon: <CheckCircle className="h-4 w-4" />, text: "Verified Certificate" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 text-slate-300 font-bold text-sm bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors hover:bg-white/10 italic uppercase">
                                                <div className="text-emerald-500">{item.icon}</div>
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4 mb-8 border-t border-white/5 pt-8">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 italic">Plans Available:</div>
                                        <div className="text-xs font-bold text-white italic">BASIC: ₹1,999/mo (Group)</div>
                                        <div className="text-xs font-bold text-white italic">STANDARD: ₹3,499/mo (Semi-private)</div>
                                        <div className="text-xs font-bold text-white italic">PREMIUM: ₹5,999/mo (1-on-1)</div>
                                    </div>

                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest h-16 rounded-[1.5rem] shadow-xl shadow-emerald-500/25 text-lg"
                                    />
                                    <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-widest mt-4">India's First Creative Learning Platform</p>
                                </div>
                            </Card>

                            {/* Instructor Card */}
                            <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-8 italic">Verified Provider</CardTitle>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-black text-xl border-2 border-white/10 shadow-lg">C</div>
                                    <div>
                                        <h3 className="font-black text-white text-lg leading-none mb-1">Celoris Music Academy</h3>
                                        <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Verified Expert</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6 italic">
                                    Trained instructors specializing in Bollywood and Acoustic Guitar. Over 500+ students taught online.
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-white font-black text-sm">4.9</span>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastery Guaranteed</div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
