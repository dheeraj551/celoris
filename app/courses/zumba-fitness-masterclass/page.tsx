"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, FileText, FlaskConical, Binary, Layers, Megaphone, Target, Share2, TrendingUp, TrendingDown, PieChart, Activity, Globe, Smartphone, Camera, Video, Monitor, Globe2, Sparkles, MessageSquare, PenTool, Trophy, Instagram, Linkedin, Youtube, Twitter, Heart, Music, Smile, Zap as Flash } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ZumbaFitnessMasterclass() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Zumba Fitness Masterclass | Jatin Arora | Celoris";

        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Master Zumba Fitness from Basics to Trainer-Ready. Led by Jatin Arora, this course blends international Zumba rhythms with Bollywood fusion. 30 Hours of expert training. celoris.in";
        if (metaDescription) {
            metaDescription.setAttribute('content', descriptionText);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = descriptionText;
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "Zumba Fitness Masterclass",
        subtitle: "From Basics to Trainer-Ready — Dance Your Way to Fitness",
        description: "The Zumba Fitness Masterclass is a comprehensive, structured program designed to take students from zero fitness background to confident Zumba practitioners — and even aspiring trainers. Led by Jatin Arora, a South Delhi-based certified Zumba and fitness trainer with 3+ years of experience, this course blends international Zumba rhythms with Bollywood and Indian dance fitness styles.",
        students: 850,
        rating: 4.9,
        duration: "Approx. 28–30 Hours",
        price: 1999,
        level: "Beginner to Intermediate",
        currency: "INR",
        provider: "Jatin Arora",
        learning_outcomes: [
            "Master core Zumba rhythms: Salsa, Merengue, Cumbia, Reggaeton, and Cha Cha",
            "Learn Bollywood and Bhangra fusion choreography tailored for Indian audiences",
            "Build full 10-minute Zumba routines from scratch with proper music matching",
            "Understand cardio, HIIT, strength, and flexibility fundamentals for dance fitness",
            "Develop cueing, class management, and motivation skills for teaching",
            "Prepare for your first demo class and earn a Celoris Certificate of Completion"
        ],
        requirements: [
            "Comfortable workout clothes and sports shoes",
            "A clear floor space of approx 6x6 feet",
            "Water bottle and towel",
            "Passion for dance and fitness!"
        ],
        chapters: [
            {
                number: 1,
                title: "Introduction to Zumba & Fitness Foundations",
                icon: "Zap",
                topics: [
                    "What is Zumba? History & Philosophy — Origin, fitness benefits, and Zumba vs. traditional aerobics",
                    "Understanding the Body: Muscles & Movement — Major muscle groups, joints, and how dance activates them",
                    "Warm-Up Science & Techniques — Dynamic stretching, mobility drills, and injury prevention",
                    "Breathing, Posture & Core Alignment — Proper posture cues, diaphragmatic breathing, and core engagement",
                    "Setting Fitness Goals & Tracking Progress — Goal-setting framework, tracking sheets, and motivation tools"
                ],
                duration: "Approx. 4 Hours"
            },
            {
                number: 2,
                title: "Core Zumba Rhythms & Footwork",
                icon: "Music",
                topics: [
                    "Salsa Basics: Timing & Basic Steps — On1/On2 timing, basic step, side step, and cross body lead",
                    "Merengue: March Beat & Hip Motion — Merengue march, hip pendulum, turns, and partner arms",
                    "Cumbia: Gliding Steps & Latin Feel — Cumbia step, back step, and smooth hip transitions",
                    "Reggaeton: Urban Groove & Bounce — Perreo bounce, body roll, and urban cardio combos",
                    "Cha Cha: Syncopated Steps & Style — Cha cha basic, lock step, and forward-back patterns"
                ],
                duration: "Approx. 5 Hours"
            },
            {
                number: 3,
                title: "Bollywood & Indian Fitness Fusion",
                icon: "Sparkles",
                topics: [
                    "Bollywood Dance Basics: Mudras & Expressions — Hand gestures, facial expressions, and Bollywood stylization",
                    "Classic Bollywood Moves: Thumka, Jhatka, Ghoomar — Shoulder, hip, and spin-based signature Bollywood movements",
                    "Bhangra Fusion: High-Energy Punjabi Moves — Bhangra steps, jhummar, and cardio-intensive dhol beat patterns",
                    "Garba & Dandiya: Festive Rhythm Workout — Circular patterns, claps, and stick coordination drills",
                    "Creating a Bollywood Zumba Routine — Combining moves into a 5-minute Bollywood Zumba choreography"
                ],
                duration: "Approx. 5.5 Hours"
            },
            {
                number: 4,
                title: "Fitness Training & Body Conditioning",
                icon: "Heart",
                topics: [
                    "Cardiovascular Fitness: Zones & Intensity — Heart rate zones, RPE scale, and cardio programming for classes",
                    "Strength Training for Dancers: Bodyweight Basics — Squats, lunges, push-ups, and plank variations",
                    "HIIT Integration in Zumba Classes — Interval design, work-rest ratios, and tabata-style Zumba drills",
                    "Flexibility & Cool-Down Routines — Static stretching sequences, PNF stretching, and yoga-inspired cool-downs",
                    "Nutrition Basics for Fitness Enthusiasts — Macronutrients, hydration, pre/post-workout fueling"
                ],
                duration: "Approx. 4.5 Hours"
            },
            {
                number: 5,
                title: "Choreography Design & Routine Building",
                icon: "PenTool",
                topics: [
                    "Anatomy of a Zumba Class: Structure & Flow — Class arc: warm-up, peak, cool-down, and transitions",
                    "Music Selection: BPM, Genre & Energy Matching — How to match music tempo to movement intensity",
                    "Building a 4-Count Combo from Scratch — Phrase-building techniques, 32-count music structure",
                    "Creating a 10-Minute Routine: Salsa + Reggaeton — Step-by-step choreography workshop",
                    "Creating a 10-Minute Bollywood Cardio Routine — Full Bollywood fusion choreography with transitions"
                ],
                duration: "Approx. 5.5 Hours"
            },
            {
                number: 6,
                title: "Teaching Skills & Trainer Certification Prep",
                icon: "Trophy",
                topics: [
                    "Verbal & Non-Verbal Cueing Techniques — Voice projection, countdown cues, visual cues, and mirroring",
                    "Class Management & Student Motivation — Handling mixed fitness levels and modifications",
                    "Safety, Injury Prevention & First Aid Basics — Common Zumba injuries and emergency protocols",
                    "Demo Class: Teaching Your First 20-Minute Session — Live teach-back with peer feedback",
                    "Certification Assessment & Career Roadmap — Final evaluation and career growth roadmap"
                ],
                duration: "Approx. 4.5 Hours"
            }
        ],
        faq_categories: [
            {
                title: "Course Overview",
                icon: "Lightbulb",
                questions: [
                    {
                        question: "Who is this course for?",
                        answer: "This course is for fitness beginners, dance enthusiasts, working professionals, and anyone aspiring to become a Zumba trainer.",
                        source: "Celoris Course Guide"
                    },
                    {
                        question: "Is this course live or recorded?",
                        answer: "The session format is a mix of Live Online sessions and Recorded Practice Sessions for flexible learning.",
                        source: "Celoris Platform"
                    }
                ]
            },
            {
                title: "Certification",
                icon: "Award",
                questions: [
                    {
                        question: "Will I get a certificate?",
                        answer: "Yes, you will receive an official Celoris Certificate of Completion after completing the assessment in Module 6.",
                        source: "Certification Program"
                    }
                ]
            }
        ],
        assessment: [
            { title: "Practical Demo", details: "20-minute live teach-back session in Module 6" },
            { title: "Choreography Project", details: "Submit a self-choreographed 5-minute routine video" },
            { title: "Theory Quiz", details: "25-question MCQ covering fitness, anatomy, and Zumba basics" }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": courseData.title,
        "description": courseData.description,
        "provider": {
            "@type": "Person",
            "name": "Jatin Arora",
            "sameAs": "https://www.celoris.in"
        },
        "educationalLevel": courseData.level,
        "teaches": courseData.learning_outcomes
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-rose-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6 font-medium uppercase tracking-wider italic">
                    <Link href="/" className="hover:text-rose-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-rose-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-rose-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic">{courseData.title}</span>
                </div>

                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-rose-400 mb-8 transition-all group font-black uppercase tracking-widest italic text-xs">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-16">
                        {/* Hero Section */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Masterclass</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Trainer Ready</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Fitness Fusion</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-rose-400/90 font-black italic uppercase tracking-tight">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Featured Image */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-orange-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/zumba-fitness-masterclass.png"
                                        alt="Zumba Fitness Masterclass Celoris"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                    <div className="absolute flex items-center justify-center">
                                        <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center shadow-3xl shadow-rose-600/50 hover:scale-110 transition-transform cursor-pointer">
                                            <Play className="h-8 w-8 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Learning Outcomes */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                                    <CheckCircle className="h-8 w-8 text-rose-500" />
                                </div>
                                What You Will Learn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 hover:border-rose-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-rose-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-rose-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-rose-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <BookOpen className="h-8 w-8 text-purple-500" />
                                </div>
                                Module-wise Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const IconMap: any = {
                                        Zap, Music, Sparkles, Heart, PenTool, Trophy
                                    };
                                    const Icon = IconMap[chapter.icon] || BookOpen;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-white/5 bg-[#0d1321]/40 rounded-[2rem] px-4 overflow-hidden shadow-xl">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-[#1a1c2e] p-4 rounded-2xl border border-rose-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-rose-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em] mb-1 italic">Module {chapter.number}</div>
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{chapter.title}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest italic mr-6 bg-white/5 px-4 py-1.5 rounded-full">
                                                        <Clock className="h-4 w-4 text-rose-500/50" />
                                                        {chapter.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400">
                                                <div className="pl-20 space-y-4 relative">
                                                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/30 via-rose-500/10 to-transparent" />
                                                    <ul className="grid grid-cols-1 gap-4">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-4 group">
                                                                <div className="h-2 w-2 rounded-full bg-rose-500/40 mt-2.5 group-hover:bg-rose-500 transition-colors shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                                                                <span className="text-sm font-bold uppercase tracking-widest italic group-hover:text-rose-400 transition-colors leading-relaxed">{topic}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </section>

                        {/* Assessment */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Trophy className="h-8 w-8 text-blue-500" />
                                </div>
                                Assessment & Certification
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {courseData.assessment.map((item, index) => (
                                    <Card key={index} className="bg-gradient-to-br from-[#0d1321] to-[#1a1c2e] border-white/5 hover:border-rose-500/30 transition-all duration-500 group rounded-[2.5rem] shadow-2xl">
                                        <CardContent className="pt-10 text-center h-full flex flex-col px-8">
                                            <div className="mx-auto bg-white/5 p-5 w-fit rounded-2xl border border-white/10 mb-8 group-hover:scale-110 group-hover:border-rose-500/30 transition-all duration-500">
                                                <Target className="h-10 w-10 text-rose-500" />
                                            </div>
                                            <h3 className="text-xl font-black text-white italic uppercase mb-3 tracking-tighter">{item.title}</h3>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider flex-grow leading-relaxed italic">{item.details}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* CTA Section */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-rose-500/10 to-orange-600/10 border border-white/5 relative overflow-hidden group shadow-3xl text-center">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Music className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Your Fitness Journey Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 max-w-2xl mx-auto">
                                "Zumba is not just a workout, it's a celebration. Join me and dance your way to a healthier, happier you."
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">₹{courseData.price.toLocaleString()}</div>
                                        <div className="text-rose-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Starting from</div>
                                    </div>

                                    <div className="space-y-4 mb-10 text-slate-400">
                                        <CourseInquiryDialog
                                            courseTitle={courseData.title}
                                            buttonClassName="w-full h-16 text-xs font-black bg-rose-600 hover:bg-rose-500 text-white uppercase tracking-[0.3em] rounded-2xl shadow-3xl shadow-rose-600/30 transition-all active:scale-95 italic"
                                        />
                                        <Link
                                            href="https://wa.me/919084718101"
                                            target="_blank"
                                            className="w-full h-14 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl flex items-center justify-center gap-3 group transition-all italic"
                                        >
                                            <Radio className="h-4 w-4 text-rose-500 group-hover:animate-pulse" />
                                            Inquire on WhatsApp
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Official Celoris Certificate", color: "text-rose-500" },
                                            { icon: Clock, text: "28-30 Hours Content", color: "text-blue-500" },
                                            { icon: Users, text: "Community Support", color: "text-purple-500" },
                                            { icon: Smartphone, text: "Access on any device", color: "text-orange-500" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic group">
                                                <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Trainer Profile */}
                            <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <CardHeader className="pb-4 px-10 pt-10">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Lead Instructor</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">{courseData.provider}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        Certified Zumba & Fitness Trainer based in South Delhi with over 3+ years of experience in helping people achieve their fitness goals through dance.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-rose-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>{courseData.rating} Rating</span>
                                        </div>
                                        <div className="text-slate-500">
                                            {courseData.students}+ Students
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Requirements */}
                            <div className="p-10 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 shadow-xl">
                                <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-6 flex items-center gap-3">
                                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                                    Requirements
                                </h3>
                                <ul className="space-y-4">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                            <div className="h-1.5 w-1.5 rounded-full bg-rose-500/40 mt-1.5 flex-shrink-0 group-hover:bg-rose-500 transition-colors" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
