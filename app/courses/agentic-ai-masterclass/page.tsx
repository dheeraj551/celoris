"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Layout, Heart, Calendar, Globe, Layers, Terminal, HardDrive } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function AgenticAIMasterclass() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Agentic AI Masterclass: Build, Deploy, and Scale | Celoris 2026 Edition";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Master Agentic AI from foundations to multi-agent pipelines. Build real-world agents with Python, LangChain, LangGraph, and more. 2026 Edition.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Master Agentic AI from foundations to multi-agent pipelines. Build real-world agents with Python, LangChain, LangGraph, and more. 2026 Edition.';
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "Agentic AI Masterclass",
        edition: "Celoris · 2026 Edition",
        subtitle: "Build, deploy, and scale real-world AI agents — from foundations to multi-agent pipelines.",
        description: "Designed for developers, product builders, and tech-forward professionals. This masterclass takes you from the core principles of Large Language Models to the orchestration of complex, autonomous multi-agent systems.",
        stats: [
            { label: "8 modules", icon: Layers },
            { label: "40+ lessons", icon: BookOpen },
            { label: "12 hands-on projects", icon: Code },
            { label: "~60 hrs total", icon: Clock },
            { label: "Hindi + English", icon: Globe }
        ],
        students: 250,
        rating: 4.9,
        duration: "12 Weeks",
        price: 4999,
        currency: "INR",
        provider: "Celoris Learning Platform",
        website: "https://celoris.in",
        url: "https://celoris.in/courses/agentic-ai-masterclass",
        modules: [
            {
                number: "01",
                title: "Foundations of Agentic AI",
                overview: "What makes an AI agent? LLMs vs agents vs bots. Understanding the core shift from completion to agency.",
                level: "Beginner",
                duration: "4 hrs",
                tags: ["Theory", "LLMs"],
                icon: Lightbulb
            },
            {
                number: "02",
                title: "Building Your First Agent",
                overview: "Code a working agent from scratch using Python. Learn the reasoning-acting loop (ReAct) implementation.",
                level: "Beginner",
                duration: "6 hrs",
                tags: ["Python", "LangChain"],
                icon: Bot
            },
            {
                number: "03",
                title: "Memory & Knowledge Systems",
                overview: "Give agents long-term memory using RAG and vector databases. Context management and state persistence.",
                level: "Intermediate",
                duration: "7 hrs",
                tags: ["RAG", "Vectors"],
                icon: Database
            },
            {
                number: "04",
                title: "Agentic Workflows & Orchestration",
                overview: "LangGraph, CrewAI, and stateful multi-step pipelines. Moving beyond simple sequences to complex graphs.",
                level: "Intermediate",
                duration: "8 hrs",
                tags: ["LangGraph", "CrewAI"],
                icon: Workflow
            },
            {
                number: "05",
                title: "Multi-Agent Systems",
                overview: "Supervisor agents, subagents, and agent communication. Collaborative intelligence patterns.",
                level: "Advanced",
                duration: "8 hrs",
                tags: ["Multi-agent", "AutoGen"],
                icon: Users
            },
            {
                number: "06",
                title: "Browser & Computer-Use Agents",
                overview: "Agents that browse, scrape, click, and fill forms. Automating the web and desktop tasks.",
                level: "Advanced",
                duration: "6 hrs",
                tags: ["Browser-Use", "Playwright"],
                icon: Globe
            },
            {
                number: "07",
                title: "Local AI Agents with Ollama",
                overview: "Run agents fully offline — no API costs, full privacy. Local model optimization and deployment.",
                level: "Intermediate",
                duration: "5 hrs",
                tags: ["Ollama", "Local LLMs"],
                icon: HardDrive
            },
            {
                number: "08",
                title: "Deployment, Safety & Production",
                overview: "Ship agents to production — reliably, safely, affordably. Monitoring, evaluation, and safety guardrails.",
                level: "Advanced",
                duration: "6 hrs",
                tags: ["Deploy", "Safety"],
                icon: Shield
            }
        ],
        tools: [
            "LangChain / LangGraph",
            "CrewAI",
            "AutoGen",
            "OpenAI Agents SDK",
            "Anthropic Claude API",
            "Ollama (local LLMs)",
            "MCP (Model Context Protocol)",
            "RAG + vector DBs",
            "Browser-Use",
            "Supabase / pgvector",
            "Python / TypeScript",
            "n8n / Zapier AI"
        ]
    }


    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": courseData.title,
        "description": courseData.description,
        "provider": {
            "@type": "Organization",
            "name": "Celoris Learning Platform",
            "sameAs": "https://celoris.in"
        },
        "educationalLevel": "Advanced"
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30 font-sans">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6 font-medium">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic font-bold">Agentic AI Masterclass</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-8 transition-all group font-bold tracking-tight uppercase italic">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Course Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    {courseData.edition}
                                </span>
                                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Professional Certification
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
                                    Agentic AI<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Masterclass</span>
                                </h1>
                            </div>

                            <p className="text-xl md:text-2xl text-slate-300 font-bold italic leading-relaxed max-w-2xl">
                                {courseData.subtitle}
                            </p>

                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                                <div className="relative bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden group">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                        <div className="space-y-4">
                                            <p className="text-lg text-slate-300 leading-relaxed italic font-medium relative z-10">
                                                {courseData.description}
                                            </p>
                                        </div>
                                        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                                            <img 
                                                src="/agentic-ai-masterclass-feature.jpg" 
                                                alt="Agentic AI Masterclass" 
                                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/50 to-transparent"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4">
                                {courseData.stats.map((stat, i) => (
                                    <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/40 border border-white/5 text-center group hover:bg-slate-800 transition-colors">
                                        <stat.icon className="h-5 w-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{stat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Curriculum Roadmap */}
                        <section className="space-y-8">
                            <div className="flex items-end justify-between border-b border-white/10 pb-4">
                                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                                    Course Modules
                                </h2>
                                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em] italic mb-1">
                                    Click to expand
                                </span>
                            </div>

                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.modules.map((module, index) => (
                                    <AccordionItem key={index} value={`module-${index}`} className="border border-white/5 bg-slate-900/40 rounded-[2rem] px-5 overflow-hidden transition-all hover:bg-slate-900/60 group">
                                        <AccordionTrigger className="hover:no-underline py-8">
                                            <div className="flex items-center gap-6 text-left w-full">
                                                <div className="text-3xl font-black text-emerald-500/20 italic tracking-tighter group-hover:text-emerald-500/40 transition-colors">
                                                    {module.number}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">{module.level}</span>
                                                        <span className="h-1 w-1 rounded-full bg-slate-700" />
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{module.duration}</span>
                                                    </div>
                                                    <div className="text-xl font-black text-white uppercase italic opacity-90 group-hover:opacity-100 transition-opacity">
                                                        {module.title}
                                                    </div>
                                                </div>
                                                <div className="hidden sm:flex gap-2 mr-4">
                                                    {module.tags.map((tag, ti) => (
                                                        <span key={ti} className="bg-slate-800 px-3 py-1 rounded-full text-[9px] font-black text-slate-400 uppercase italic border border-white/5">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-10 px-8">
                                            <div className="pl-14 space-y-8">
                                                <div className="flex gap-8 items-start">
                                                    <div className="p-5 rounded-[1.5rem] bg-emerald-500/10 border border-emerald-500/20">
                                                        <module.icon className="h-8 w-8 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1 space-y-4">
                                                        <p className="text-lg text-slate-300 italic font-medium leading-relaxed">
                                                            {module.overview}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 pt-2">
                                                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                                                <div className="h-full bg-emerald-500 w-1/3 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>

                        {/* Tools Covered */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                                Tools & Stack Covered
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {courseData.tools.map((tool, i) => (
                                    <div key={i} className="group p-5 rounded-[1.5rem] bg-slate-900/40 border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
                                        <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
                                            <Terminal className="h-4 w-4" />
                                        </div>
                                        <div className="text-sm font-black text-white uppercase italic tracking-tight">{tool}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-10">
                            {/* Premium Enrollment Card */}
                            <div className="relative group p-1 rounded-[3.5rem] bg-gradient-to-br from-emerald-500 via-blue-600 to-purple-600 shadow-[0_0_50px_rgba(16,185,129,0.1)] hover:shadow-[0_0_80px_rgba(16,185,129,0.2)] transition-all duration-700">
                                <div className="absolute inset-0 bg-[#020617] rounded-[3.4rem] m-[1px]"></div>
                                <Card className="relative bg-transparent border-0 rounded-[3.5rem] overflow-hidden">
                                    <CardContent className="p-10 space-y-10">
                                        <div className="text-center space-y-2">
                                            <div className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] italic">Mastery Path</div>
                                            <div className="text-4xl font-black text-white italic tracking-tighter leading-none">PROFESSIONAL</div>
                                        </div>

                                        <div className="space-y-6 pt-6 border-t border-white/10">
                                            {[
                                                { icon: <CheckCircle className="h-5 w-5 text-emerald-500" />, text: "Real-time Multi-Agent Labs" },
                                                { icon: <CheckCircle className="h-5 w-5 text-emerald-500" />, text: "Production API Keys Provided" },
                                                { icon: <CheckCircle className="h-5 w-5 text-emerald-500" />, text: "60+ Hours of Deep Content" },
                                                { icon: <CheckCircle className="h-5 w-5 text-emerald-500" />, text: "1-on-1 Mentorship (Elite)" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 text-slate-300 group/item">
                                                    <div className="transform transition-transform group-hover/item:scale-110">
                                                        {item.icon}
                                                    </div>
                                                    <span className="text-xs font-black uppercase italic tracking-tight">{item.text}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-4">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-20 text-xl font-black bg-white hover:bg-emerald-400 text-black rounded-[2rem] shadow-2xl transition-all uppercase italic tracking-widest hover:scale-[1.02] active:scale-95"
                                            />
                                        </div>

                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                                Join 250+ Professionals Scaling AI
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Provider Info */}
                            <div className="p-8 rounded-[3rem] bg-slate-900/60 border border-white/5 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-2xl border border-white/10 flex items-center justify-center">
                                        <img src="/celoris-logo.svg" alt="Celoris" className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-white italic uppercase tracking-tighter text-xl">Celoris</h4>
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest italic">Unified AI Platform</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed font-bold italic">
                                    We bridge the gap between AI theory and real-world execution. Our 2026 Edition courses are designed for the next wave of autonomous agents.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
