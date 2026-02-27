"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import { Trophy } from "lucide-react"

export default function VibeCodingMasteryCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Vibe Coding Mastery: Build Apps Using AI-First Development Workflows";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Learn to 10x your output by mastering the 2026 paradigm of Vibe Coding. Ship production-ready apps with 95% AI-generated code. Free to start. No credit card. celoris.in 🇮🇳";
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
        ],
        quiz_data: [
            {
                title: "The Karpathy Paradigm & Philosophy",
                questions: [
                    {
                        question: "According to the sources, what is the primary role of a developer in 2026?",
                        options: ["Writing manual syntax", "Managing the AI agents writing the code", "Designing physical hardware", "Writing SQL queries"],
                        correctIndex: 1
                    },
                    {
                        question: "The \"Karpathy Paradigm\" represents a shift from Deductive programming to which type?",
                        options: ["Inductive", "Abductive", "Reductive", "Conductive"],
                        correctIndex: 1
                    },
                    {
                        question: "In a Vibe-Coded environment, what percentage of code should be written manually?",
                        options: ["Less than 50%", "Exactly 20%", "Less than 5%", "0%"],
                        correctIndex: 2
                    },
                    {
                        question: "What does \"Programming in English\" imply in the context of Vibe Coding?",
                        options: ["Translating Python to English", "Using natural language to describe high-level intent or \"vibes\"", "Only using English-speaking AI models", "Writing comments in English only"],
                        correctIndex: 1
                    },
                    {
                        question: "Vibe Coding is defined as what kind of workflow?",
                        options: ["Manual-first", "Cloud-only", "AI-First Development", "Syntax-heavy"],
                        correctIndex: 2
                    },
                    {
                        question: "What is the core focus of \"Abductive\" programming in this context?",
                        options: ["Strictly following logical syntax", "Inferring the best path to a result from high-level intent", "Removing agents from the workflow", "Writing code for offline systems"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the target development velocity increase for those adopting these methods?",
                        options: ["2x", "5x", "10x", "100x"],
                        correctIndex: 2
                    },
                    {
                        question: "According to the 2026 Manual, the developer's job is to move away from being a writer to being a what?",
                        options: ["Manager", "Salesperson", "Hardware engineer", "Manual tester"],
                        correctIndex: 0
                    },
                    {
                        question: "The shift to Vibe Coding is described as a transition toward which reality?",
                        options: ["No-code only", "AI-First Development Workflows", "Purely physical prototyping", "Manual database management"],
                        correctIndex: 1
                    },
                    {
                        question: "What mindset is listed as a prerequisite for Vibe Coding?",
                        options: ["Strict adherence to C++", "An open mind to 'Programming in English'", "Rejection of AI tools", "Expertise in manual assembly language"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Command Centres & Tools",
                questions: [
                    {
                        question: "Which of the following is considered a \"2026 Command Centre\" for Vibe Coding?",
                        options: ["Notepad++", "Windsurf", "Eclipse", "Vim"],
                        correctIndex: 1
                    },
                    {
                        question: "Which tool is specifically paired with v0 for rapid prototyping?",
                        options: ["Cursor", "Replit Agent", "GitHub Copilot", "AutoGen"],
                        correctIndex: 1
                    },
                    {
                        question: "For the \"Full-Stack SaaS\" project, which two tools are recommended?",
                        options: ["Replit + v0", "Cursor + Windsurf", "CrewAI + Copilot", "SQL + Notepad"],
                        correctIndex: 1
                    },
                    {
                        question: "Which tool is used for deploying Multi-Agent Systems (MAS)?",
                        options: ["v0", "Stripe", "CrewAI", "Notepad"],
                        correctIndex: 2
                    },
                    {
                        question: "Along with CrewAI, which other framework is mentioned for MAS?",
                        options: ["AutoGen", "AutoCode", "GenAI", "AgenticSQL"],
                        correctIndex: 0
                    },
                    {
                        question: "What does MCP stand for in the Vibe Coding ecosystem?",
                        options: ["Manual Code Process", "Model Context Protocol", "Multi-Core Programming", "Master Command Program"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the purpose of the Model Context Protocol (MCP)?",
                        options: ["Writing unit tests", "High-level context injection", "Managing Stripe payments", "Compiling C code"],
                        correctIndex: 1
                    },
                    {
                        question: "Which tool is integrated with CrewAI for building the \"Multi-Agent Tool\" project?",
                        options: ["Windsurf", "GitHub Copilot", "Replit", "v0"],
                        correctIndex: 1
                    },
                    {
                        question: "Which Command Centre is mentioned alongside Windsurf and Replit?",
                        options: ["IntelliJ", "Cursor", "Sublime", "Xcode"],
                        correctIndex: 1
                    },
                    {
                        question: "What type of IDEs are specifically used in the 2026 tech stack?",
                        options: ["Manual IDEs", "Legacy IDEs", "Agentic IDEs", "Cloud-only IDEs"],
                        correctIndex: 2
                    }
                ]
            },
            {
                title: "Project Types & Deliverables",
                questions: [
                    {
                        question: "The \"Weekend MVP\" focuses on rapid prototyping from what inputs?",
                        options: ["500 lines of Java", "A sketch or voice note", "A 50-page technical document", "Manual SQL schemas"],
                        correctIndex: 1
                    },
                    {
                        question: "In the \"Full-Stack SaaS\" project, how much manual SQL is required?",
                        options: ["50%", "100%", "Zero", "5%"],
                        correctIndex: 2
                    },
                    {
                        question: "What are the three core features included in the Full-Stack SaaS project?",
                        options: ["HTML, CSS, JS", "Auth, Database, and Stripe integration", "Voice notes, Sketches, and Images", "Python, Ruby, and Perl"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the definition of a \"Multi-Agent Tool\" project?",
                        options: ["A tool used by a single developer", "An app that manages other AI agents to perform complex tasks", "A manual debugging tool", "A compiler for assembly language"],
                        correctIndex: 1
                    },
                    {
                        question: "How many production-ready apps are shipped in the Vibe Coding Mastery course?",
                        options: ["One", "Two", "Three", "Five"],
                        correctIndex: 2
                    },
                    {
                        question: "Which project type uses \"Replit Agent + v0\"?",
                        options: ["The Full-Stack SaaS", "The 'Weekend MVP'", "The Multi-Agent Tool", "The manual SQL project"],
                        correctIndex: 1
                    },
                    {
                        question: "What kind of templates are provided with the Vibe Coding Mastery course?",
                        options: ["Word templates", "Production Ready GitHub Templates", "PowerPoint templates", "Manual CSS templates"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the goal of \"Vibe-to-Production\" projects?",
                        options: ["To write as much code as possible", "To ship production-ready apps with minimal manual coding", "To learn manual assembly", "To avoid using AI agents"],
                        correctIndex: 1
                    },
                    {
                        question: "Which project involves managing \"complex tasks\" through multiple agents?",
                        options: ["Weekend MVP", "Full-Stack SaaS", "The Multi-Agent Tool", "The Stripe Integration project"],
                        correctIndex: 2
                    },
                    {
                        question: "Which project emphasizes \"Zero manual SQL\"?",
                        options: ["Weekend MVP", "The Full-Stack SaaS", "Multi-Agent Tool", "Replit sketches"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Methodologies & Governance",
                questions: [
                    {
                        question: "What is the focus of \"Spec-Driven Development\"?",
                        options: ["Writing code first", "Architecture before code", "Manual debugging", "Deleting all documentation"],
                        correctIndex: 1
                    },
                    {
                        question: "What strategy is used to navigate \"advanced debugging\"?",
                        options: ["Manual line-by-line reading", "The 'Error Loop' feedback strategy", "Restarting the computer", "Deleting the repository"],
                        correctIndex: 1
                    },
                    {
                        question: "How are \"hallucinated vulnerabilities\" addressed in Vibe Coding?",
                        options: ["By ignoring them", "By securing AI-generated code against them", "By writing more manual code", "By disabling AI"],
                        correctIndex: 1
                    },
                    {
                        question: "What does \"Agentic Governance\" involve?",
                        options: ["Hiring more human managers", "Mastering the oversight and management of agent outputs", "Manual unit testing for every line", "Eliminating agents from the workflow"],
                        correctIndex: 1
                    },
                    {
                        question: "\"Automated testing vibes\" refers to what?",
                        options: ["Testing how a developer feels", "Implementing testing within agentic workflows", "Manual QA testing", "Skipping testing entirely"],
                        correctIndex: 1
                    },
                    {
                        question: "How should \"technical debt\" be handled in this new paradigm?",
                        options: ["By ignoring it until the project fails", "By managing it within a vibe-coded environment", "By only writing manual code to avoid it", "Technical debt does not exist in 2026"],
                        correctIndex: 1
                    },
                    {
                        question: "High-level context injection is achieved through which protocol?",
                        options: ["HTTP", "MCP (Model Context Protocol)", "FTP", "SMTP"],
                        correctIndex: 1
                    },
                    {
                        question: "In Spec-Driven Development, what must be defined before the code?",
                        options: ["The marketing plan", "The architecture", "The final price", "The manual syntax"],
                        correctIndex: 1
                    },
                    {
                        question: "The 'Error Loop' feedback strategy is primarily used for what?",
                        options: ["Designing sketches", "Advanced debugging", "Stripe integration", "SQL management"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the result of applying \"Agentic Governance\"?",
                        options: ["Uncontrolled AI code", "Secured and managed AI-generated code", "Slower development speed", "Manual code reviews only"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Course Logistics & Prerequisites",
                questions: [
                    {
                        question: "Who is the provider of the Vibe Coding Mastery course?",
                        options: ["OpenAI", "Celoris Designs", "Microsoft", "Replit"],
                        correctIndex: 1
                    },
                    {
                        question: "What is a listed prerequisite for the course regarding AI tools?",
                        options: ["Mastery of C++", "Familiarity with using AI chat tools (ChatGPT/Claude)", "Having never used AI before", "Experience in manual server rack mounting"],
                        correctIndex: 1
                    },
                    {
                        question: "What level of software development understanding is required as a prerequisite?",
                        options: ["Advanced PhD level", "Basic understanding of software development concepts", "No understanding required", "Expert level in 10+ languages"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the duration of the self-paced Vibe Coding course?",
                        options: ["1 week", "4-6 weeks", "1 year", "2 days"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the cost of \"Full Lifetime Access\" for the course?",
                        options: ["₹ 5000", "₹ 19999", "₹ 999", "Free"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the current rating of the Celoris AI-Powered Ecosystem course?",
                        options: ["3.5", "4.95", "2.0", "5.0"],
                        correctIndex: 1
                    },
                    {
                        question: "Where can students join the \"Exclusive Community\" for this course?",
                        options: ["Facebook", "Discord", "LinkedIn", "Slack"],
                        correctIndex: 1
                    },
                    {
                        question: "How many people have rated/joined the course according to the source?",
                        options: ["100+", "2450+", "10,000+", "500+"],
                        correctIndex: 1
                    },
                    {
                        question: "What type of certification is offered upon completion?",
                        options: ["No certification", "Professional Certification", "Attendance only", "Manual Coding License"],
                        correctIndex: 1
                    },
                    {
                        question: "The Celoris platform enables developers to build at what speed?",
                        options: ["The speed of light", "The speed of thought", "10 lines of code per hour", "Manual typing speed"],
                        correctIndex: 1
                    }
                ]
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

                        {/* Course Preview Video with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        className="absolute inset-0 w-full h-full border-0"
                                        src="https://www.youtube.com/embed/zDqkf2pLWXQ"
                                        title="Vibe Coding Mastery"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
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

                        {/* Interactive Quiz Section */}
                        <section id="quiz" className="pt-12 border-t border-slate-800/50">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-cyan-500/20 rounded-lg">
                                        <Trophy className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    Vibe Coding Mastery Assessment
                                </h2>
                                <p className="text-slate-400 mt-2">Validate your expertise in AI-First development, agentic workflows, and the Karpathy paradigm.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="Vibe Coding Mastery Assessment"
                                quizDescription="50 questions covering the Karpathy paradigm, command centers, and multi-agent development methodologies."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score) => {
                                    if (score >= 45) return "Vibe Master Grade! You have an exceptional grasp of AI-First development. You're ready to ship at the speed of thought.";
                                    if (score >= 35) return "Expert Developer! You have a solid understanding of agentic workflows. Focus on refining your Spec-Driven Development.";
                                    return "Good attempt! Review the Karpathy paradigm and command center modules to sharpen your vibe coding skills.";
                                }}
                            />
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
                                            
                                            <div className="text-cyan-400 font-bold tracking-widest uppercase text-xs">Full Lifetime Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-2xl shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
                                            />
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center gap-2 group transition-all"
                                                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                <Trophy className="h-4 w-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                                                Take Assessment Quiz
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
