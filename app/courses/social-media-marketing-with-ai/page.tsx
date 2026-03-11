"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, FileText, FlaskConical, Binary, Layers, Megaphone, Target, Share2, TrendingUp, TrendingDown, PieChart, Activity, Globe, Smartphone, Camera, Video, Monitor, Globe2, Sparkles, MessageSquare, PenTool, Trophy, Instagram, Linkedin, Youtube, Twitter } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"

export default function SocialMediaMarketingAICourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Social Media Marketing with AI | Celoris Learning Platform";

        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Master Social Media Marketing with AI. Build and execute a complete AI-powered strategy. Generate content at scale, run data-driven ads, and stay ahead of trends. 2025 Edition. celoris.in";
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
        title: "Social Media Marketing with Artificial Intelligence",
        subtitle: "8 Modules | 32 Lessons | ~40 Hours | Beginner to Pro",
        description: "Social Media Marketing with AI is a comprehensive, hands-on course designed for marketers, entrepreneurs, content creators, and business owners who want to harness the power of Artificial Intelligence to supercharge their social media presence.",
        students: 1250,
        rating: 4.9,
        duration: "40 Hours (Theory + Hands-on)",
        price: 1999,
        level: "Beginner to Pro",
        currency: "INR",
        provider: "Celoris Team",
        learning_outcomes: [
            "Build and execute a complete AI-powered social media strategy from scratch",
            "Use AI tools to generate, repurpose, and schedule high-quality content at scale",
            "Analyse social media performance using AI-assisted analytics and reporting",
            "Run data-driven ad campaigns with AI targeting and creative optimisation",
            "Build a personal or brand voice that stays consistent with AI assistance",
            "Stay ahead of trends using AI-powered social listening and competitor research"
        ],
        requirements: [
            "Basic familiarity with social media platforms (Instagram, LinkedIn, etc.)",
            "No coding or technical background required",
            "Access to a laptop/desktop with internet connection",
            "Free accounts on ChatGPT, Canva, and Buffer (setup covered in Module 1)"
        ],
        chapters: [
            {
                number: 1,
                title: "AI Tools & Setup for Social Media Marketers",
                icon: "Zap",
                topics: [
                    "The AI Revolution in Social Media - What Has Changed",
                    "Your AI Toolkit: ChatGPT, Claude, Gemini & Perplexity",
                    "Visual AI: Canva AI, Adobe Firefly & Midjourney Basics",
                    "Scheduling & Automation: Buffer, Later, and Hootsuite AI Features"
                ],
                duration: "4 Hours"
            },
            {
                number: 2,
                title: "Content Strategy & Brand Voice with AI",
                icon: "Layout",
                topics: [
                    "Audience Research with AI: Personas, Pain Points & Trends",
                    "Defining Your Niche & Positioning Using AI Frameworks",
                    "Building Your Brand Voice: AI-Assisted Style Guides",
                    "90-Day Content Calendar with AI Planning Tools"
                ],
                duration: "5 Hours"
            },
            {
                number: 3,
                title: "AI-Powered Content Creation",
                icon: "PenTool",
                topics: [
                    "Writing Viral Captions & Hooks with AI",
                    "Designing Carousels & Infographics with Canva AI",
                    "Scripting & Editing Short-Form Video (Reels, Shorts, TikTok)",
                    "Repurposing Content Across Platforms at Scale"
                ],
                duration: "6 Hours"
            },
            {
                number: 4,
                title: "Platform Mastery with AI",
                icon: "Globe",
                topics: [
                    "Instagram & Threads: AI for Growth and Engagement",
                    "LinkedIn: AI-Powered Thought Leadership & B2B Content",
                    "YouTube Shorts & Long-Form: AI Scripts, Titles & SEO",
                    "X (Twitter) & Emerging Platforms: Real-Time AI Tactics"
                ],
                duration: "5 Hours"
            },
            {
                number: 5,
                title: "AI for Paid Social & Advertising",
                icon: "Target",
                topics: [
                    "AI-Powered Audience Targeting & Research for Paid Social",
                    "Ad Creative with AI: Copy, Visuals & Video Ads",
                    "A/B Testing Frameworks Using AI-Generated Variants",
                    "Budgeting & Bid Strategy Optimisation with AI"
                ],
                duration: "5 Hours"
            },
            {
                number: 6,
                title: "Analytics, Reporting & Optimisation",
                icon: "BarChart",
                topics: [
                    "Social Media KPIs That Actually Matter",
                    "AI-Assisted Analytics: Interpreting Native Platform Data",
                    "Automated Reporting with AI: Google Sheets & Notion Workflows",
                    "Building a Data-Driven Optimisation Loop"
                ],
                duration: "5 Hours"
            },
            {
                number: 7,
                title: "Community Management & Social Listening",
                icon: "MessageSquare",
                topics: [
                    "Social Listening with AI: Tools & Techniques",
                    "AI-Powered Community Engagement & Comment Management",
                    "Brand Reputation Monitoring & Crisis Management with AI",
                    "Trend Forecasting: Spotting Viral Moments Before They Happen"
                ],
                duration: "5 Hours"
            },
            {
                number: 8,
                title: "Capstone: Build Your AI-Powered Strategy",
                icon: "Trophy",
                topics: [
                    "Capstone Briefing & Framework Introduction",
                    "Strategy Development Workshop (Part 1)",
                    "Strategy Development Workshop (Part 2)",
                    "Final Presentation, Peer Review & Course Wrap-Up"
                ],
                duration: "5 Hours"
            }
        ],
        faq_categories: [
            {
                title: "Course Overview",
                icon: "Lightbulb",
                questions: [
                    {
                        question: "Who is this course for?",
                        answer: "This course is for social media managers, entrepreneurs, content creators, small business owners, and students who want to upgrade their skills with AI.",
                        source: "Celoris Course Guide"
                    },
                    {
                        question: "What makes this course different?",
                        answer: "AI-first approach, platform-specific strategies, ready-to-use templates, and India-first context.",
                        source: "Celoris Methodology"
                    }
                ]
            },
            {
                title: "Pricing Tiers",
                icon: "Zap",
                questions: [
                    {
                        question: "What are the pricing options?",
                        answer: "Starter (Rs. 1,999) - Video lessons + assignments + community access. Pro (Rs. 3,999) - Starter + live Q&A + project reviews. Mentorship (Rs. 7,999) - Pro + 4 one-on-one coaching calls + placement support.",
                        source: "Celoris Pricing"
                    }
                ]
            }
        ],
        recommended_tools: [
            { tool: "ChatGPT (OpenAI)", category: "AI Writing", free: "Yes", best_for: "Copy, strategy, analysis" },
            { tool: "Claude (Anthropic)", category: "AI Writing", free: "Yes", best_for: "Long-form, nuanced content" },
            { tool: "Canva AI", category: "Visual Design", free: "Yes", best_for: "Graphics, carousels, reels" },
            { tool: "Adobe Firefly", category: "Image Gen", free: "Limited", best_for: "Brand-safe AI images" },
            { tool: "Buffer", category: "Scheduling", free: "3 channels free", best_for: "Post scheduling & analytics" },
            { tool: "Perplexity AI", category: "Research", free: "Yes", best_for: "Real-time trend research" }
        ],
        projects: [
            {
                title: "AI Tools Setup",
                description: "Set up your full AI marketing toolkit and create your first posts.",
                tools: "ChatGPT + Canva AI",
                icon: "Zap"
            },
            {
                title: "Brand Voice Guide",
                description: "Develop a full audience persona and a one-page Brand Voice Guide.",
                tools: "ChatGPT + Notion AI",
                icon: "Layout"
            },
            {
                title: "90-Day Content Calendar",
                description: "Build a 90-day content calendar with AI planning tools.",
                tools: "ChatGPT + Buffer",
                icon: "Activity"
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
                {/* Breadcrumbs */}
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
                        {/* Hero Section */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">2025 Edition</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Social Media + AI</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Mastery Course</span>
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

                        {/* Featured Image / Video Placeholder */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/social-media-ai-hero.png"
                                        alt="Social Media Marketing AI"
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

                        {/* Learning Outcomes */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                </div>
                                Learning Outcomes
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

                        {/* Curriculum */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <BookOpen className="h-8 w-8 text-purple-500" />
                                </div>
                                Course Structure
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const IconMap: any = {
                                        Zap, Layout, PenTool, Globe, Target, BarChart, MessageSquare, Trophy
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

                        {/* Projects */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <FlaskConical className="h-8 w-8 text-blue-500" />
                                </div>
                                Assignment Roadmap
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {courseData.projects.map((item, index) => {
                                    const IconMap: any = { Zap, Layout, Activity };
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

                        {/* Recommended Tools Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                                    <Cpu className="h-8 w-8 text-yellow-500" />
                                </div>
                                AI Tool Stack
                            </h2>
                            <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/5">
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Tool</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Category</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Free Tier</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Best For</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courseData.recommended_tools.map((item, idx) => (
                                            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                <td className="p-6 text-sm font-bold text-white italic uppercase tracking-tight">{item.tool}</td>
                                                <td className="p-6 text-xs font-bold text-slate-400 italic uppercase">{item.category}</td>
                                                <td className="p-6">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase italic ${item.free === 'Yes' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                        {item.free}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-xs font-bold text-slate-500 italic uppercase">{item.best_for}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="space-y-12 bg-[#0d1321]/20 p-12 rounded-[3rem] border border-white/5 shadow-inner">
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Everything You Need to Know</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Course Details & Common Queries</p>
                            </div>

                            <div className="space-y-16">
                                {courseData.faq_categories.map((category, catIndex) => {
                                    const CatIconMap: any = { Lightbulb, Zap };
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
                                <Sparkles className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">AI-Powered Growth</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10">
                                "The hardest part of social media is consistency. With AI, we solve the creation bottleneck, allowing you to focus on strategy and connection."
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
                                        <div className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Starting from</div>
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
                                            { icon: Sparkles, text: "AI-First Approach", color: "text-blue-500" },
                                            { icon: Users, text: "Vibrant Community", color: "text-purple-500" },
                                            { icon: Instagram, text: "Platform Specific Tactics", color: "text-rose-500" }
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
                                        Team of social media experts and AI engineers dedicated to teaching the next generation of digital marketers.
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
