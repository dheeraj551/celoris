"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, FileText, FlaskConical, Binary, Layers, Megaphone, Target, Share2, TrendingUp, TrendingDown, PieChart, Activity, Globe, Smartphone, Camera, Video, Monitor, Globe2, Sparkles } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import { Trophy } from "lucide-react"

export default function DigitalMarketingAICourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Digital Marketing using AI Tools | Celoris Mastery Course";

        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Master AI-powered digital marketing. From content creation with ChatGPT to running data-driven Meta & Google ads. Build automated funnels and rank faster with AI SEO. 2026 Mastery Course. celoris.in";
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
        title: "Digital Marketing using AI Tools",
        subtitle: "Using AI to Create, Automate, and Scale Your Marketing Mastery",
        description: "A comprehensive, hands-on course that equips you with cutting-edge AI-powered digital marketing skills. Go from generating compelling content to running data-driven ad campaigns with the most in-demand tools in the industry.",
        students: 850,
        rating: 4.8,
        duration: "12 Hours (Theory + Hands-on)",
        price: 4999,
        level: "Beginner to Intermediate",
        currency: "INR",
        provider: "Celoris Team",
        learning_outcomes: [
            "Use AI tools to create, automate, and scale digital marketing campaigns.",
            "Write high-converting copy, blogs, ads, and social media content with AI.",
            "Run and optimise paid ads on Google and Meta using AI-powered insights.",
            "Build and automate email marketing sequences using AI.",
            "Understand SEO fundamentals and use AI to rank content faster.",
            "Leverage analytics dashboards and AI to measure and improve ROI."
        ],
        requirements: [
            "No prior marketing or AI experience required.",
            "Basic computer literacy.",
            "Internet access and a device to practice on (Laptop/PC recommended)."
        ],
        chapters: [
            {
                number: 1,
                title: "Foundations of AI in Digital Marketing",
                icon: "Sparkles",
                topics: [
                    "What is AI? History & Generative AI for Marketers.",
                    "The AI Marketing Landscape: Content, Design, SEO & Ad Tools.",
                    "Prompt Engineering Mastery: The CARE Framework.",
                    "AI Ethics: Copyright, Privacy & Keeping the Human Touch."
                ],
                duration: "1.5 Hours"
            },
            {
                number: 2,
                title: "AI-Powered Content Creation",
                icon: "FileText",
                topics: [
                    "Writing with AI: Blogs, Product Descriptions & Brand Voice.",
                    "Ad Copywriting: AIDA, PAS, BAB Frameworks with ChatGPT.",
                    "Visual Content: Midjourney, Adobe Firefly & Canva AI Mastery.",
                    "Content Workflow: Repurposing 1 piece → 10 assets effortlessly."
                ],
                duration: "2 Hours"
            },
            {
                number: 3,
                title: "SEO & Blog Marketing with AI",
                icon: "Search",
                topics: [
                    "SEO Fundamentals: Crawling, Indexing & E-E-A-T in the AI Era.",
                    "Keyword Research: Search Intent & AI-Powered Cluster Mapping.",
                    "SEO Writing: Structure, H-tags & AI Content Guidelines.",
                    "Tracking Performance: Google Search Console & GA4 Insights."
                ],
                duration: "2 Hours"
            },
            {
                number: 4,
                title: "Social Media Marketing with AI",
                icon: "Share2",
                topics: [
                    "Strategy with AI: 30-day Content Calendars & Platform Choice.",
                    "Caption & Viral Script Writing: Instagram, LinkedIn & YouTube.",
                    "Automation & Scheduling: Batching Content with Metricool & Buffer.",
                    "Analytics & Optimization: Reading Reach & Engagement with AI tools."
                ],
                duration: "2 Hours"
            },
            {
                number: 5,
                title: "Paid Advertising & Email Marketing with AI",
                icon: "Target",
                topics: [
                    "Google Ads AI: Performance Max & Smart Bidding Mastery.",
                    "Meta Ads AI: Advantage+ Campaigns & Audience Generation.",
                    "AI Email Marketing: Automated Drip Funnels & Personalization.",
                    "Measuring ROI: CPA, ROAS & Conversion Rate Analysis."
                ],
                duration: "2 Hours"
            },
            {
                number: 6,
                title: "Analytics, Strategy & Capstone Project",
                icon: "PieChart",
                topics: [
                    "Data-Driven Marketing: Setting Goals & Conversions in GA4.",
                    "Holistic AI Strategy: The RACE Framework Integration.",
                    "Automation Deep Dive: Zapier, Make & CRM AI features.",
                    "Capstone Workshop: Building a full 90-day AI Marketing Roadmap."
                ],
                duration: "2.5 Hours"
            }
        ],
        faq_categories: [
            {
                title: "Getting Started & Course Details",
                icon: "Lightbulb",
                questions: [
                    {
                        question: "Do I need any prior experience in marketing or AI to join this course?",
                        answer: "No prior experience is needed. This course is built for complete beginners and intermediate learners. We start from the absolute basics — what AI is, how it works, and how it applies to marketing — before moving into hands-on tools and real campaign workflows. If you can use a browser and type a message, you are ready to begin.",
                        source: "r/learnmarketing & Celoris Guide"
                    },
                    {
                        question: "How much total time do I need to complete the course?",
                        answer: "The core course content is 12 hours. We recommend budgeting an additional 6–8 hours for module assignments and the capstone project. Most learners complete everything across 2–3 weeks, doing 2–3 hours per session. If you are attending an intensive weekend format, the full course fits comfortably into Saturday and Sunday with time for exercises.",
                        source: "Celoris Academic Schedule"
                    },
                    {
                        question: "I am a business owner, not a marketer. Will this course still be useful for me?",
                        answer: "Absolutely — and business owners are among the biggest beneficiaries of this course. If you currently spend money on agencies or freelancers for content, ads, or social media, this course will help you understand what they are doing, evaluate their work critically, and handle significant portions yourself using AI.",
                        source: "r/entrepreneur feedback"
                    },
                    {
                        question: "How is this different from a regular digital marketing course?",
                        answer: "Standard courses teach strategy and platforms. This course goes further by integrating AI tools into every single step of the process. Instead of just 'how to write a blog post', you learn how to brief ChatGPT, generate a draft, optimise it live with Surfer SEO, and publish it as part of an automated workflow — all in under an hour.",
                        source: "Celoris Methodology"
                    },
                    {
                        question: "Is the Celoris certificate recognised by employers?",
                        answer: "The Celoris certificate is a professional completion credential that validates your practical skills. While not a degree, it signals hands-on competency. Most hiring managers care more about the capstone project you build in this course, which serves as a portfolio piece.",
                        source: "Celoris Certification Policy"
                    }
                ]
            },
            {
                title: "AI, Career & The Future",
                icon: "Zap",
                questions: [
                    {
                        question: "Will AI replace digital marketers? Should I even bother learning this field?",
                        answer: "The honest answer: AI will not replace good marketers, but it will replace those who refuse to adapt. AI handles repetitive tasks, but lacks emotional intelligence, cultural nuance, and strategic judgment. This course teaches you to partner with AI as a force multiplier.",
                        source: "r/digitalmarketing trending discussion"
                    },
                    {
                        question: "Will I be able to get freelance clients or a marketing job after completing this?",
                        answer: "Yes. AI content creation, SEO, and email automation are among the highest-demand skills. You'll leave with a portfolio-ready capstone project, a Celoris certificate, and hands-on experience with 15+ industry-standard tools.",
                        source: "Upwork & LinkedIn job data 2026"
                    },
                    {
                        question: "AI tools are changing so fast. Will this course become outdated quickly?",
                        answer: "We focus on frameworks, mental models, and marketing fundamentals that remain relevant regardless of the tool. The CARE prompting framework and 80/20 editing rule work whether you use ChatGPT-5 or any future tool.",
                        source: "Future-proofing workshop notes"
                    },
                    {
                        question: "Is it ethical to use AI-generated content without disclosing it?",
                        answer: "For most marketing content (blogs, captions), disclosure is not legally mandatory, similar to using a ghostwriter. However, for journalism or first-person lived experience, transparency is increasingly expected. We cover these ethics fully in Module 1.",
                        source: "Marketing Ethics Forum"
                    }
                ]
            },
            {
                title: "Technical Strategy & Tools",
                icon: "Cpu",
                questions: [
                    {
                        question: "Which AI tools in this course are free, and which require paid subscriptions?",
                        answer: "A large portion uses free tiers: ChatGPT, Canva AI, GA4, Mailchimp, and Buffer. Paid tools like Jasper or Semrush are demonstrated, but free or low-cost alternatives are always provided. We recommend starting free and upgrading only when you see clear ROI.",
                        source: "Tool Stack Guide 2026"
                    },
                    {
                        question: "Can AI-generated content hurt my SEO? Will Google penalise it?",
                        answer: "Google rewards helpful, high-quality content regardless of how it's produced. However, generic AI-churned content is penalised. This course teaches the 80/20 rule: AI writes the draft (80%), you add the expertise and brand voice (20%).",
                        source: "r/SEO analysis of 2024-25 core updates"
                    },
                    {
                        question: "Can AI tools create content in Hindi, Hinglish, or other Indian regional languages?",
                        answer: "Yes. ChatGPT, Claude, and Gemini support major Indian languages. For Hinglish — dominant on Indian Instagram/YouTube — ChatGPT performs particularly well when prompted correctly. We have a dedicated lesson on this.",
                        source: "India Creator Economy Report"
                    },
                    {
                        question: "ChatGPT keeps giving me generic, boring outputs. How do I fix that?",
                        answer: "Generic output comes from generic prompts. We teach the CARE framework (Context, Action, Result, Examples) to encode your brand voice and chain prompts for progressively refined, high-quality output.",
                        source: "Prompt Engineering Workshop"
                    },
                    {
                        question: "How does AI actually help with paid ads on Google and Meta?",
                        answer: "Google's PMax and Meta's Advantage+ campaigns are now largely AI-managed. Your role shifts to feeding the AI high-quality inputs: strong creative assets, clear objectives, and structured tracking. We show you how to 'talk' to these algorithms.",
                        source: "Ad Platform Guidelines"
                    }
                ]
            }
        ],
        projects: [
            {
                title: "2-Week Content Pack",
                description: "Build a full social media strategy plus ad copy and graphics.",
                tools: "ChatGPT + Canva AI + Metricool",
                icon: "Megaphone"
            },
            {
                title: "SEO Audit & Strategy",
                description: "Complete keyword research and optimized blog strategy.",
                tools: "Google Keyword Planner + SEO AI",
                icon: "TrendingUp"
            },
            {
                title: "AI Marketing Roadmap",
                description: "A 90-day comprehensive digital strategy for a real brand.",
                tools: "Full AI Stack + Strategy Frameworks",
                icon: "Activity"
            }
        ],
        quiz_data: [
            {
                title: "AI Marketing Basics",
                questions: [
                    {
                        question: "What is the CARE framework in prompt engineering?",
                        options: ["Context, Action, Result, Examples", "Clear, Accurate, Relevant, Easy", "Create, Analyze, Refine, Edit", "Content, Advertising, Reach, Engagement"],
                        correctIndex: 0
                    }
                ]
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": courseData.title,
        "description": courseData.description,
        "provider": {
            "@type": "Organization",
            "name": "Celoris",
            "sameAs": "https://www.celoris.in"
        },
        "educationalLevel": courseData.level,
        "teaches": courseData.learning_outcomes
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6 font-medium uppercase tracking-wider italic">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic">{courseData.title}</span>
                </div>

                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-8 transition-all group font-black uppercase tracking-widest italic text-xs">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-16">
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">2026 Edition</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Marketing + AI</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Productivity</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-black italic uppercase tracking-tight">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {courseData.description}
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
                                        alt="Course Preview"
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                    <div className="absolute flex items-center justify-center">
                                        <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-3xl shadow-emerald-600/50 hover:scale-110 transition-transform cursor-pointer">
                                            <Play className="h-8 w-8 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                </div>
                                Mastery Roadmap
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <BookOpen className="h-8 w-8 text-purple-500" />
                                </div>
                                Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const IconMap: any = {
                                        Sparkles, FileText, Search, Share2, Target, PieChart
                                    };
                                    const Icon = IconMap[chapter.icon] || BookOpen;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-white/5 bg-[#0d1321]/40 rounded-[2rem] px-4 overflow-hidden shadow-xl">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 italic">Module {chapter.number}</div>
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{chapter.title}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest italic mr-6 bg-white/5 px-4 py-1.5 rounded-full">
                                                        <Clock className="h-4 w-4 text-emerald-500/50" />
                                                        {chapter.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400">
                                                <div className="pl-20 space-y-4 relative">
                                                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent" />
                                                    <ul className="grid grid-cols-1 gap-4">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-4 group">
                                                                <div className="h-2 w-2 rounded-full bg-emerald-500/40 mt-2.5 group-hover:bg-emerald-500 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                                <span className="text-sm font-bold uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors leading-relaxed">{topic}</span>
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

                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <FlaskConical className="h-8 w-8 text-blue-500" />
                                </div>
                                Project Assignments
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {courseData.projects.map((item, index) => {
                                    const IconMap: any = { Megaphone, TrendingUp, Activity };
                                    const Icon = IconMap[item.icon] || Server;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-[#0d1321] to-[#00120d] border-white/5 hover:border-emerald-500/30 transition-all duration-500 group rounded-[2.5rem] shadow-2xl">
                                            <CardContent className="pt-10 text-center h-full flex flex-col px-8">
                                                <div className="mx-auto bg-white/5 p-5 w-fit rounded-2xl border border-white/10 mb-8 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-500">
                                                    <Icon className="h-10 h-10 text-emerald-500" />
                                                </div>
                                                <h3 className="text-xl font-black text-white italic uppercase mb-3 tracking-tighter">{item.title}</h3>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6 flex-grow leading-relaxed italic">{item.description}</p>
                                                <div className="text-[9px] font-black bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-500 tracking-[0.2em] uppercase italic">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        <section className="space-y-12 bg-[#0d1321]/20 p-12 rounded-[3rem] border border-white/5 shadow-inner">
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Everything You Need to Know</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Sourced from Reddit, Quora & Developer Communities — 2026</p>
                            </div>

                            <div className="space-y-16">
                                {courseData.faq_categories.map((category, catIndex) => {
                                    const CatIconMap: any = { Lightbulb, Zap, Cpu };
                                    const CatIcon = CatIconMap[category.icon] || Cpu;
                                    return (
                                        <div key={catIndex} className="space-y-8">
                                            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                                <CatIcon className="h-6 w-6 text-emerald-500" />
                                                <h3 className="text-xl font-black text-emerald-400 italic uppercase tracking-widest">{category.title}</h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                {category.questions.map((faq, faqIndex) => (
                                                    <div key={faqIndex} className="group bg-[#0d1321]/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all shadow-lg hover:shadow-emerald-500/5">
                                                        <div className="flex gap-6">
                                                            <div className="text-2xl font-black text-white/10 group-hover:text-emerald-500/20 transition-colors italic">Q{faqIndex + 1}</div>
                                                            <div className="space-y-4">
                                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">{faq.question}</h4>
                                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{faq.answer}</p>
                                                                <div className="flex items-center gap-2 pt-2">
                                                                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Source: {faq.source}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Megaphone className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">AI-First Marketing</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10">
                                "The era of manual marketing is over. This course teaches you to leverage the world's most powerful AI models to work 10x faster and deliver better ROI than your competition."
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">₹{courseData.price.toLocaleString()}</div>
                                        <div className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Premium mastery bundle</div>
                                    </div>

                                    <div className="space-y-4 mb-10 text-slate-400">
                                        <CourseInquiryDialog
                                            courseTitle={courseData.title}
                                            buttonClassName="w-full h-16 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-[0.3em] rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all active:scale-95 italic"
                                        />
                                        <Link
                                            href="https://wa.me/919643579101"
                                            target="_blank"
                                            className="w-full h-14 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl flex items-center justify-center gap-3 group transition-all italic"
                                        >
                                            <Radio className="h-4 w-4 text-emerald-500 group-hover:animate-pulse" />
                                            Inquire on WhatsApp
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Official Celoris Certificate", color: "text-emerald-500" },
                                            { icon: Zap, text: "10+ AI Tools Covered", color: "text-blue-500" },
                                            { icon: Users, text: "Direct Expert Access", color: "text-purple-500" },
                                            { icon: Target, text: "ROI-Focused Learning", color: "text-orange-500" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic group">
                                                <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <CardHeader className="pb-4 px-10 pt-10">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Lead Instructor</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">{courseData.provider}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        The Celoris core team consists of marketing strategists and AI engineers who bridge the gap between creative storytelling and automated execution.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>{courseData.rating} Rating</span>
                                        </div>
                                        <div className="text-slate-500">
                                            {courseData.students}+ Students
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-10 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 shadow-xl">
                                <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-6 flex items-center gap-3">
                                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                                    Requirements
                                </h3>
                                <ul className="space-y-4">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 mt-1.5 flex-shrink-0 group-hover:bg-emerald-500 transition-colors" />
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
