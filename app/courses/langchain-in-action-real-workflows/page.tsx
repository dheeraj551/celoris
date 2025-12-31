"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Layers, Filter, RefreshCw, Activity, Terminal, MessageSquare, Link as LinkIcon, GitBranch, Cpu as Brain } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LangChainCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "LangChain in Action: Real Workflows | Celoris Designs";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const desc = "Master LLM orchestration by building autonomous AI agents and automation pipelines using LangChain, Tools, and Vector Databases.";
        if (metaDescription) {
            metaDescription.setAttribute('content', desc);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = desc;
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "LangChain in Action: Real Workflows",
        subtitle: "Master LLM Orchestration—Build, Chain, and Deploy Intelligent Automation Bots.",
        description: "Move beyond simple chat prompts. Learn to build autonomous \"reasoning loops\" that use external tools, remember user history, and execute complex business logic using the industry-standard framework: LangChain.",
        students: 1250,
        rating: 4.9,
        duration: "12 hours",
        price: 15000,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/langchain-in-action-real-workflows",
        learning_outcomes: [
            "Mastering LCEL (LangChain Expression Language)",
            "Unified model management (OpenAI, Anthropic, Llama 3)",
            "Dynamic Output Parsing (JSON, Pydantic)",
            "Advanced Memory & State Management",
            "Redis & PostgreSQL for Persistent AI Memory",
            "Custom Tool & Connector Development",
            "RAG Pipelines with Vector Databases",
            "Autonomous ReAct & Zero-Shot Agents",
            "Multi-Step Automation Workflows",
            "Production Debugging with LangSmith"
        ],
        requirements: [
            "Basic Python programming knowledge",
            "Familiarity with API integrations",
            "Understanding of LLM concepts (prompts, completion)",
            "Desire to build production-ready AI automation"
        ],
        chapters: [
            {
                number: 1,
                title: "LangChain Core & Expression Language (LCEL)",
                icon: "Layers",
                topics: [
                    "Prompts & Models: Mastering ChatPromptTemplates and the unified interface.",
                    "The Power of LCEL: Using the pipe operator (|) to create declarative chains.",
                    "Output Parsers: Converting raw LLM strings into structured JSON or Pydantic objects.",
                    "Debugging with LangSmith: Visualizing every step of your chain execution."
                ],
                duration: "3 hours"
            },
            {
                number: 2,
                title: "State & Memory Management",
                icon: "Brain",
                topics: [
                    "Memory Types: Comparing ChatMessageHistory, ConversationBuffer, and WindowMemory.",
                    "External State Storage: Persisting conversation threads using Redis or PostgreSQL.",
                    "Entity Memory: Teaching your agent to remember specific user facts.",
                    "Context Window Management: Summarization strategies to save tokens."
                ],
                duration: "3 hours"
            },
            {
                number: 3,
                title: "Tools, Connectors & RAG",
                icon: "GitBranch",
                topics: [
                    "Defining Tools: Turning any Python function into an AI tool.",
                    "Dynamic Data (RAG): Building pipelines with Vector Databases (Pinecone/Chroma).",
                    "Built-in Toolkits: Integrating SQL, Google Search, and Gmail.",
                    "Document Loaders & Splitters: Handling PDFs, Notion, and Markdown."
                ],
                duration: "3 hours"
            },
            {
                number: 4,
                title: "Building Real-World Workflows & Agents",
                icon: "Workflow",
                topics: [
                    "Zero-Shot vs. ReAct Agents: Understanding reasoning loops.",
                    "Multi-Step Automation: Designing a research agent that emails reports.",
                    "Error Handling: Building retry logic for LLM and tool failures.",
                    "Human-in-the-Loop: Inserting approval checkpoints into workflows."
                ],
                duration: "3 hours"
            }
        ],
        faqs: [
            {
                question: "Is this course for beginners?",
                answer: "This is an intermediate course. You should know basic Python, but we guide you through the LangChain specifics from the ground up."
            },
            {
                question: "Do I need paid AI accounts?",
                answer: "While we use OpenAI and Anthropic, we also show how to use open-source models like Llama 3 via local providers."
            },
            {
                question: "What is the 'Universal Assistant' project?",
                answer: "It's a capstone project where you build a bot that connects to a knowledge base, executes database queries, and maintains long-term memory."
            },
            {
                question: "Will I get a certificate?",
                answer: "Yes, upon completion of the course and the final project, you will receive a professional certificate from Celoris Designs."
            }
        ],
        deliverables: [
            {
                title: "Universal Assistant Bot",
                description: "End-to-end automation bot with RAG and long-term memory.",
                icon: "Bot"
            },
            {
                title: "Tool Integration Kit",
                description: "Custom connectors for SQL, Gmail, and Search APIs.",
                icon: "LinkIcon"
            },
            {
                title: "LangSmith Trace Dashboard",
                description: "Ready-to-use debugging setup for complex LLM chains.",
                icon: "Activity"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "LangChain in Action: Real Workflows",
        "description": "Master LLM orchestration by building autonomous AI agents and automation pipelines using LangChain, Tools, and Vector Databases.",
        "provider": {
            "@type": "Organization",
            "name": "celoris designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "courseCode": "LC-ACT-02",
        "educationalLevel": "Intermediate",
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": "PT12H",
            "instructor": {
                "@type": "Person",
                "name": "Expert AI Engineer",
                "jobTitle": "LLM Orchestration Specialist"
            }
        },
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "LangChain Core & LCEL",
                "description": "Mastering the LangChain Expression Language for composable AI chains."
            },
            {
                "@type": "Syllabus",
                "name": "State & Memory",
                "description": "Managing conversation history and persistent state across LLM sessions."
            },
            {
                "@type": "Syllabus",
                "name": "Tools & RAG",
                "description": "Connecting LLMs to external APIs, SQL databases, and Vector stores."
            },
            {
                "@type": "Syllabus",
                "name": "Autonomous Agents",
                "description": "Building ReAct agents that plan and execute multi-step automation tasks."
            }
        ],
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "price": "149.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-blue-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-blue-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-blue-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">LangChain in Action</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-blue-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">AI Orchestration</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Agents</span>
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Python</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-400/90 font-medium">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Image with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src="/langchain-in-action-cover.png"
                                        alt="LangChain Course Cover"
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
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-blue-400" />
                                </div>
                                What You Will Master
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-blue-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-blue-400" />
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
                                    const icons: Record<string, any> = {
                                        Layers,
                                        Brain,
                                        GitBranch,
                                        Workflow
                                    };
                                    const Icon = icons[chapter.icon] || BookOpen;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-blue-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
                                                        <div className="text-lg font-semibold text-white">{chapter.title}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm mr-4 bg-slate-800/50 px-3 py-1 rounded-full">
                                                        <Clock className="h-4 w-4" />
                                                        {chapter.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6 px-4">
                                                <div className="pl-14 space-y-4">
                                                    <div className="h-px bg-gradient-to-r from-blue-500/30 to-transparent mb-4"></div>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40 mt-2 group-hover:bg-blue-500 transition-colors" />
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

                        {/* Deliverables / Feature Grid */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Bot className="h-6 w-6 text-blue-400" />
                                </div>
                                Project: The \"Universal Assistant\" Bot
                            </h2>
                            <p className="text-slate-400 mb-8">
                                By the end of this course, you will build and deploy an End-to-End Automation Bot that connects to your company's knowledge base (RAG), executes tasks via Tools, and maintains long-term memory.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.deliverables.map((item, index) => {
                                    const icons: Record<string, any> = {
                                        Bot,
                                        LinkIcon,
                                        Activity
                                    };
                                    const Icon = icons[item.icon] || Bot;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-blue-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-blue-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                                                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

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
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹15,000
                                            </div>
                                            <div className="text-blue-400 font-bold tracking-widest uppercase text-xs">Full Lifetime Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white rounded-2xl shadow-lg shadow-blue-500/25 transition-all active:scale-95" size="lg">
                                                Enroll in Course
                                            </Button>
                                            <Button variant="outline" className="w-full h-12 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl">
                                                <Download className="mr-2 h-4 w-4" />
                                                Get Syllabus PDF
                                            </Button>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-blue-400" />
                                                <span>Professional Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Code className="h-5 w-5 text-purple-400" />
                                                <span>Production Ready GitHub Templates</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-indigo-400" />
                                                <span>Exclusive Discord Community</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>2024-2025 Tech Stack (LangChain v0.3+)</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Instructor</div>
                                    <CardTitle className="text-xl text-white">Celoris</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-2 border border-slate-700 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Expert AI Engineer</h4>
                                            <p className="text-xs text-slate-400">LLM Orchestration Specialist</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Senior AI engineer with extensive experience in LangChain, autonomous agents, and RAG architectures. Building the next generation of intelligent automation.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-blue-400 text-blue-400" />
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
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40 mt-1.5 flex-shrink-0" />
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
