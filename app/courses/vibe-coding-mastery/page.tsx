"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function VibeCodingMasteryCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Vibe Coding Mastery: Build Apps Using AI-First Development Workflows";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Learn to 10x your output by mastering the 2026 paradigm of Vibe Coding. Ship production-ready apps with 95% AI-generated code.";
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
        title: "Vibe Coding Mastery",
        subtitle: "Build Apps Using AI-First Development Workflows",
        description: "The developer's job in 2026 isn't to write code; it's to manage the agents writing it. This course is your manual for that new reality. Learn the Karpathy Paradigm of 'Abductive' programming and ship three production-ready apps while writing less than 5% of the code manually.",
        students: 2450,
        rating: 4.95,
        duration: "4-6 Weeks (Self-paced)",
        price: 19999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/vibe-coding-mastery",
        learning_outcomes: [
            "Master the Karpathy Paradigm: Moving from Deductive to Abductive programming.",
            "Choose and master your 2026 Command Center (Cursor, Windsurf, or Replit).",
            "Learn Spec-Driven Development: Architecture before code.",
            "Deploy Multi-Agent Systems (MAS) using CrewAI and AutoGen.",
            "Master Agentic Governance and automated testing vibes.",
            "Implement high-level context injection with Model Context Protocol (MCP).",
            "Navigate advanced debugging with the 'Error Loop' feedback strategy.",
            "Secure AI-generated code against hallucinated vulnerabilities.",
            "Manage technical debt in a vibe-coded environment.",
            "Ship three production-ready MVPs with minimal manual coding."
        ],
        requirements: [
            "Basic understanding of software development concepts",
            "Familiarity with using AI chat tools (ChatGPT/Claude)",
            "A desire to 10x development velocity",
            "An open mind to 'Programming in English'"
        ],
        chapters: [
            {
                number: 1,
                title: "The Vibe Coding Mindset & Fundamentals",
                icon: "Zap",
                topics: [
                    "The Karpathy Paradigm: Deductive vs. Abductive solutions.",
                    "Taste vs. Syntax: Why 'Programming in English' is the new standard.",
                    "Pure vs. Responsible Vibe Coding: Prototypes vs. Rigorous Production.",
                    "2026 Stack Overview: Cursor, Windsurf, Replit, or Copilot."
                ],
                duration: "1 Week"
            },
            {
                number: 2,
                title: "The Command Centers (Tools of the Trade)",
                icon: "Terminal",
                topics: [
                    "Cursor Deep-Dive: Composer Mode, @codebase indexing, & refactoring.",
                    "The Windsurf 'Cascade': Agentic IDEs with real-time dependency graphs.",
                    "Replit Agent 3: Single-prompt full-stack deployments.",
                    "Context Injection: Connecting IDEs to Docs, Slack, and Jira via MCP."
                ],
                duration: "1 Week"
            },
            {
                number: 3,
                title: "Spec-Driven Development",
                icon: "Layout",
                topics: [
                    "Prompting as a Product Manager: Writing execute-perfect Intent Docs.",
                    "The /specify and /plan Workflow: Architecting before file creation.",
                    "Iterative Refinement: The Observe -> Critique -> Prompt -> Verify loop.",
                    "Voice-First Development: Using SuperWhisper to talk your app into existence."
                ],
                duration: "1 Week"
            },
            {
                number: 4,
                title: "Agentic Workflows & Multi-Agent Systems",
                icon: "Workflow",
                topics: [
                    "CrewAI & AutoGen: Setting up your Virtual Dev Shop (Architect, Coder, QA).",
                    "Agentic Governance: Managing an army of agents for bugs and refactors.",
                    "Automated Testing Vibes: Prompting for Playwright/Cypress tests.",
                    "Scaling with Agentic Workflows: Handling complex features autonomously."
                ],
                duration: "1 Week"
            },
            {
                number: 5,
                title: "Advanced Debugging & Security",
                icon: "Shield",
                topics: [
                    "The 'Error Loop' Strategy: Feeding logs back into the LLM.",
                    "Security for Vibe Coders: Identifying Hallucinated Vulnerabilities.",
                    "AI-Driven Security scanners (Snyk/DeepCode) integration.",
                    "Technical Debt Management: Stopping the 'Spaghetti Vibe'."
                ],
                duration: "1 Week"
            }
        ],
        faqs: [
            {
                question: "What exactly is 'Vibe Coding'?",
                answer: "Vibe Coding is a paradigm shift where the developer focuses on describing the high-level 'vibe' or intent of the software while AI agents handle the low-level implementation, syntax, and boilerplate."
            },
            {
                question: "Do I need to be an expert coder?",
                answer: "No. While understanding logic is helpful, Vibe Coding prioritizes 'Taste' and 'Architecture' over syntax. If you can describe it, you can build it."
            },
            {
                question: "Which IDE should I use?",
                answer: "We cover Cursor, Windsurf, and Replit. You'll learn which one fits your specific workflow best—whether it's agentic IDEs or mobile-first prompt building."
            },
            {
                question: "Is this practical for production apps?",
                answer: "Absolutely. We emphasize 'Responsible Vibe Coding'—using AI for speed but keeping humans in the loop for security, performance, and architecture."
            }
        ],
        projects: [
            {
                title: "The 'Weekend MVP'",
                description: "Rapid prototyping from a sketch or voice note.",
                tools: "Replit Agent + v0",
                icon: "Zap"
            },
            {
                title: "The Full-Stack SaaS",
                description: "Auth, Database, and Stripe integration with zero manual SQL.",
                tools: "Cursor + Windsurf",
                icon: "Database"
            },
            {
                title: "The Multi-Agent Tool",
                description: "An app that manages other AI agents to perform complex tasks.",
                tools: "CrewAI + GitHub Copilot",
                icon: "Bot"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Vibe Coding Mastery",
        "description": "Learn the 2026 paradigm of AI-First Development. Move from writing rules to steering solutions.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Intermediate",
        "teaches": [
            "AI-First Architecting",
            "Agentic Workflows",
            "Prompt-Driven Development",
            "Vibe Coding Paradigms",
            "Model Context Protocol (MCP)"
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-cyan-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-cyan-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-cyan-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-cyan-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Vibe Coding</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">AI-First</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Cursor & Windsurf</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-cyan-400/90 font-medium">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Image with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src="/vibe-coding-mastery-cover.png"
                                        alt="Vibe Coding Mastery"
                                        className="w-full h-full object-cover transform transition duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Button size="lg" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 rounded-full h-20 w-20 p-0 flex items-center justify-center group/btn" asChild>
                                            <Link href="#">
                                                <Play className="h-8 w-8 fill-white group-hover/btn:scale-110 transition-transform ml-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Core Promise / Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-cyan-400" />
                                </div>
                                What You Will Master
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-cyan-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-cyan-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Course Curriculum */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-purple-400" />
                                </div>
                                Curriculum Overview
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Zap" ? Zap :
                                        chapter.icon === "Terminal" ? Terminal :
                                            chapter.icon === "Layout" ? Layout :
                                                chapter.icon === "Workflow" ? Workflow : Shield;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-cyan-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
                                                        <div className="text-lg font-semibold text-white">{chapter.title}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm mr-4 bg-slate-800/50 px-3 py-1 rounded-full text-nowrap">
                                                        <Clock className="h-4 w-4" />
                                                        {chapter.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6 px-4">
                                                <div className="pl-14 space-y-4">
                                                    <div className="h-px bg-gradient-to-r from-cyan-500/30 to-transparent mb-4"></div>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500/40 mt-2 group-hover:bg-cyan-500 transition-colors" />
                                                                <span className="text-sm leading-relaxed">{topic}</span>
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

                        {/* Projects Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Bot className="h-6 w-6 text-blue-400" />
                                </div>
                                Vibe-to-Production Projects
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Ship three production-ready applications without writing more than 5% of the code manually.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "Zap" ? Zap : item.icon === "Database" ? Database : Bot;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-cyan-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center h-full flex flex-col">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-cyan-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-slate-400 mb-4 flex-grow">{item.description}</p>
                                                <div className="text-xs font-mono bg-slate-950/50 p-2 rounded border border-slate-700 text-cyan-500">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Why This Course Sells */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Zap className="h-24 w-24 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">The 2026 Manual</h3>
                            <p className="text-lg text-slate-300 leading-relaxed italic relative z-10">
                                "In 2026, the developer's job isn't to write the code; it's to manage the agents writing the code. This course is the manual for that new reality."
                            </p>
                        </div>

                        {/* FAQ Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-orange-400" />
                                </div>
                                Frequently Asked Questions
                            </h2>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {courseData.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border-slate-800">
                                        <AccordionTrigger className="text-slate-200 hover:text-white transition-colors text-left">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 leading-relaxed">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Enrollment Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹{courseData.price}
                                            </div>
                                            <div className="text-cyan-400 font-bold tracking-widest uppercase text-xs">Full Lifetime Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95" size="lg">
                                                Enroll in Course
                                            </Button>
                                            <Button variant="outline" className="w-full h-12 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl">
                                                <Download className="mr-2 h-4 w-4" />
                                                Get Syllabus PDF
                                            </Button>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-cyan-400" />
                                                <span>Professional Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Code className="h-5 w-5 text-purple-400" />
                                                <span>Production Ready GitHub Templates</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-blue-400" />
                                                <span>Exclusive Discord Community</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>2026 Tech Stack (Agentic IDEs)</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instructor</div>
                                    <CardTitle className="text-xl text-white">Celoris Designs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-2 border border-slate-700 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Designs</h4>
                                            <p className="text-xs text-slate-400">Pioneering AI-First Development</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Specializing in Agentic Workflows and Vibe Coding paradigms. We enable developers to build at the speed of thought using the most advanced AI tools available.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-cyan-400 text-cyan-400" />
                                            <span className="font-bold">{courseData.rating}</span>
                                            <span className="text-slate-500">({courseData.students}+)</span>
                                        </div>
                                        <div className="text-slate-400">
                                            {courseData.duration} Content
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prerequisites */}
                            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                                    Prerequisites
                                </h3>
                                <ul className="space-y-3">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500/40 mt-1.5 flex-shrink-0" />
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
