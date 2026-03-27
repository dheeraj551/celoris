"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, FileText, FlaskConical, Binary, Layers, Globe, Brain, ListChecks, MessageSquare, Briefcase, BarChart3, PenTool, FolderOpen, Smartphone, Send, Monitor, Receipt, Newspaper, MessageCircle, FileUser, SearchCode } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import { Trophy } from "lucide-react"

export default function PythonMegaCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Python Mega Course: Build 20 Real-World Apps & AI Agents | Celoris";

        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Master Python from zero to AI Developer. Build 20 real-world apps and 5 intelligent AI agents using OpenAI, LangChain, and Ollama. 80+ hours of hands-on content with Trainer Dheeraj.";
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
        title: "Python Mega Course",
        subtitle: "Build 20 Real-World Apps & AI Agents",
        tagline: "From Zero to AI Developer — Complete Course Curriculum",
        description: "A comprehensive, project-driven program designed for beginners who want to become confident Python developers capable of building production-ready applications and intelligent AI agents. Every concept is immediately applied in a real-world project.",
        students: 2450,
        rating: 5.0,
        duration: "80+ Hours (Self-paced)",
        lessons: "200+ Video Lessons",
        price: 19999,
        apps: 20,
        agents: 5,
        currency: "INR",
        provider: "Trainer: Dheeraj",
        version: "1.0",
        learning_outcomes: [
            "Learn Python from scratch with a hands-on, project-first approach.",
            "Build 20 fully functional applications across multiple domains.",
            "Create 5 real AI Agents using OpenAI, LangChain, and Ollama.",
            "Master web scraping, automation, APIs, databases, and GUIs.",
            "Deploy your apps to the cloud (Vercel, Heroku, Render).",
            "Get lifetime access with free updates as Python evolves."
        ],
        requirements: [
            "A computer (Windows, Mac, or Linux).",
            "Basic computer literacy (file management, internet browsing).",
            "No prior programming knowledge required."
        ],
        tech_covered: [
            "Languages & Frameworks: Python 3.12, Flask, FastAPI, Tkinter, Streamlit",
            "AI/ML: OpenAI API, LangChain, Ollama, HuggingFace Transformers, FAISS",
            "Databases: SQLite, PostgreSQL, SQLAlchemy, Supabase",
            "Automation: Selenium, Playwright, PyAutoGUI, Schedule",
            "Data: Pandas, NumPy, Matplotlib, Seaborn",
            "DevOps: Git, GitHub, Docker basics, Render/Heroku deployment"
        ],
        modules: [
            {
                number: 1,
                title: "Python Foundations",
                icon: "Terminal",
                apps: ["App 1: CLI Calculator"],
                topics: [
                    "Installing Python 3.12 and VS Code",
                    "Python Syntax Basics: Variables, Types, Formatting",
                    "Control Flow: If/Else, Loops, Break/Continue",
                    "Functions & Scope: Parameters, Lambda, *args/**kwargs",
                    "Data Structures: Lists, Tuples, Dictionaries, Sets",
                    "Error Handling: Try/Except, Custom Exceptions"
                ],
                duration: "8 Hours"
            },
            {
                number: 2,
                title: "File Handling & Modules",
                icon: "FolderOpen",
                apps: ["App 2: Personal Expense Tracker (CSV)", "App 3: Bulk File Organizer & Renamer"],
                topics: [
                    "Reading and writing text, CSV, and JSON files",
                    "Context managers (with statement)",
                    "Creating modules and packages (__init__.py)",
                    "pip and requirements.txt management",
                    "Regular Expressions (re module)",
                    "Date & Time (datetime, pytz)"
                ],
                duration: "8 Hours"
            },
            {
                number: 3,
                title: "Object-Oriented Python",
                icon: "Layers",
                apps: ["App 4: Library Book Management System", "App 5: Bank Account Simulator"],
                topics: [
                    "Classes, Objects, and Instance attributes",
                    "Inheritance, Polymorphism, and super()",
                    "Abstract classes (abc module)",
                    "Advanced OOP: Properties, Class/Static methods",
                    "Iterators and Generators (yield)"
                ],
                duration: "10 Hours"
            },
            {
                number: 4,
                title: "Working with APIs & Web",
                icon: "Globe",
                apps: ["App 6: Weather Dashboard", "App 7: Job Board Scraper", "App 8: WhatsApp Automation Bot"],
                topics: [
                    "HTTP Methods & requests library",
                    "Handling JSON & Bearer tokens",
                    "Web Scraping with BeautifulSoup4",
                    "Browser Automation with Playwright",
                    "SMTP & Email automation"
                ],
                duration: "10 Hours"
            },
            {
                number: 5,
                title: "Databases & Data Handling",
                icon: "Database",
                apps: ["App 9: Sales Analytics Dashboard", "App 10: Student Grade Management System"],
                topics: [
                    "SQL Foundations: Joins, Aggregations with SQLite",
                    "SQLAlchemy ORM & Alembic migrations",
                    "Data Analysis with Pandas DataFrames",
                    "Data Visualization with Matplotlib, Seaborn, and Plotly"
                ],
                duration: "10 Hours"
            },
            {
                number: 6,
                title: "GUI Applications with Tkinter & Streamlit",
                icon: "Layout",
                apps: ["App 11: Pomodoro Timer Desktop App", "App 12: AI Image Caption Generator"],
                topics: [
                    "Tkinter Widgets and Layouts (pack, grid)",
                    "Streamlit Web Components und Forms",
                    "Session state and caching",
                    "Deploying to Streamlit Community Cloud"
                ],
                duration: "8 Hours"
            },
            {
                number: 7,
                title: "Web Development with Flask & FastAPI",
                icon: "Server",
                apps: ["App 13: Personal Blog CMS", "App 14: REST API for Todo App", "App 15: URL Shortener Service"],
                topics: [
                    "Flask: Routes, Jinja2 Templates, Flask-Login",
                    "FastAPI: Path operations, Pydantic, Async endpoints",
                    "JWT Authentication & Middleware",
                    "Docker containerization basics"
                ],
                duration: "10 Hours"
            },
            {
                number: 8,
                title: "Automation & Productivity Scripts",
                icon: "Zap",
                apps: ["App 16: Invoice PDF Generator", "App 17: Daily News Briefing Bot"],
                topics: [
                    "os and subprocess for shell commands",
                    "Scheduling tasks with schedule/APScheduler",
                    "PDF manipulation (PyPDF2, reportlab)",
                    "Excel automation with openpyxl"
                ],
                duration: "6 Hours"
            },
            {
                number: 9,
                title: "Introduction to AI & Machine Learning",
                icon: "Brain",
                apps: ["App 18: Movie Review Sentiment Analyzer"],
                topics: [
                    "ML Workflow: data → features → train → evaluate",
                    "scikit-learn: Linear Regression, Decision Trees",
                    "NLP Basics: Tokenization, Stemming, Sentiment Analysis",
                    "Feature Engineering and Scaling"
                ],
                duration: "8 Hours"
            },
            {
                number: 10,
                title: "AI Agents — The Future of Python",
                icon: "Bot",
                apps: ["App 19: AI-Powered Resume Analyzer", "App 20: Full-Stack AI Chatbot with RAG"],
                topics: [
                    "OpenAI API: Function calling, Embeddings",
                    "Prompt Engineering: Few-shot, Chain-of-thought",
                    "LangChain: Chains, Agents, Memory",
                    "RAG (Retrieval Augmented Generation) pipeline",
                    "Vector Databases: FAISS, Supabase pgvector",
                    "Multi-Agent orchestration with CrewAI"
                ],
                duration: "12 Hours"
            }
        ],
        ai_agents: [
            {
                name: "Agent 01: Research Agent",
                tech: "LangChain + DuckDuckGo Search",
                desc: "Autonomously searches the web and produces structured research reports.",
                icon: "SearchCode"
            },
            {
                name: "Agent 02: Coding Assistant Agent",
                tech: "OpenAI + Python REPL Tool",
                desc: "Writes, executes, and debugs Python code to solve tasks.",
                icon: "Code"
            },
            {
                name: "Agent 03: Email Management Agent",
                tech: "LangChain + Gmail API",
                desc: "Reads, categorizes, and drafts replies for your inbox.",
                icon: "Mail"
            },
            {
                name: "Agent 04: Data Analysis Agent",
                tech: "LangChain + Pandas + Code Interpreter",
                desc: "Generates charts and insights from CSVs using natural language.",
                icon: "BarChart3"
            },
            {
                name: "Agent 05: Personal Task Planner Agent",
                tech: "CrewAI + Ollama (local)",
                desc: "Creates structured task lists and sends reminders — runs 100% locally.",
                icon: "ListChecks"
            }
        ],
        faq_categories: [
            {
                title: "Course Basics",
                icon: "Lightbulb",
                questions: [
                    {
                        question: "Who is this course for?",
                        answer: "Complete beginners, professionals wanting to automate tasks, developers learning Python, entrepreneurs building AI products, and students looking for strong portfolio projects.",
                        source: "Celoris Training FAQ"
                    },
                    {
                        question: "Do I need prior programming experience?",
                        answer: "No, we start from zero. Basic computer literacy like file management and internet browsing is all you need.",
                        source: "Celoris Training FAQ"
                    },
                    {
                        question: "What Python version is covered?",
                        answer: "We use the latest stable versions, specifically Python 3.12 for all projects.",
                        source: "Celoris Training FAQ"
                    }
                ]
            },
            {
                title: "Content & Support",
                icon: "HelpCircle",
                questions: [
                    {
                        question: "How is the course delivered?",
                        answer: "It's a mix of 200+ video lessons and 50+ coding exercises. We offer live 1-on-1 sessions, recorded batches, or self-paced options.",
                        source: "Platform details"
                    },
                    {
                        question: "What support do I get?",
                        answer: "You get access to a WhatsApp group, regular doubt sessions, and code reviews by the trainer (Dheeraj).",
                        source: "Student Support"
                    }
                ]
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Python Mega Course: Build 20 Real-World Apps & AI Agents",
        "description": "Master Python from zero to AI Developer. Build 20 real-world apps and 5 AI agents.",
        "provider": {
            "@type": "Person",
            "name": "Dheeraj (Celoris Training)",
            "sameAs": "https://www.celoris.in"
        },
        "educationalLevel": "Beginner to Advanced",
        "teaches": [
            "Python Foundations",
            "OOP and Design Patterns",
            "Web Automation and Scraping",
            "Database Management",
            "Flask and FastAPI Web Development",
            "Machine Learning Fundamentals",
            "Agentic AI Development with LangChain"
        ]
    }

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Terminal": return Terminal;
            case "FolderOpen": return FolderOpen;
            case "Layers": return Layers;
            case "Globe": return Globe;
            case "Database": return Database;
            case "Layout": return Layout;
            case "Server": return Server;
            case "Zap": return Zap;
            case "Brain": return Brain;
            case "Bot": return Bot;
            case "SearchCode": return SearchCode;
            case "Code": return Code;
            case "Mail": return Mail;
            case "BarChart3": return BarChart3;
            case "ListChecks": return ListChecks;
            default: return HelpCircle;
        }
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
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Version {courseData.version}</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">{courseData.apps} Real-World Apps</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">{courseData.agents} AI Agents</span>
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
                                        src="/python-mega-course-hero.png"
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

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 text-center">
                                <div className="text-3xl font-black text-white italic h-8">{courseData.apps}</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Apps Built</div>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 text-center">
                                <div className="text-3xl font-black text-white italic h-8">{courseData.agents}</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">AI Agents</div>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 text-center">
                                <div className="text-3xl font-black text-white italic h-8">200+</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Video Lessons</div>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 text-center">
                                <div className="text-3xl font-black text-white italic h-8">80+</div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Hours Content</div>
                            </div>
                        </div>

                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                </div>
                                Course Highlights
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
                                Full Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.modules.map((module, index) => {
                                    const Icon = getIcon(module.icon);
                                    return (
                                        <AccordionItem key={index} value={`module-${index}`} className="border border-white/5 bg-[#0d1321]/40 rounded-[2rem] px-4 overflow-hidden shadow-xl">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 italic">Module {module.number}</div>
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{module.title}</div>
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {module.apps.map((app, i) => (
                                                                <span key={i} className="text-[8px] font-black text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10 uppercase italic">{app}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest italic mr-6 bg-white/5 px-4 py-1.5 rounded-full">
                                                        <Clock className="h-4 w-4 text-emerald-500/50" />
                                                        {module.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400">
                                                <div className="pl-20 space-y-4 relative">
                                                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent" />
                                                    <ul className="grid grid-cols-1 gap-4">
                                                        {module.topics.map((topic, topicIndex) => (
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
                                <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                                    <Bot className="h-8 w-8 text-rose-500" />
                                </div>
                                5 Intelligent AI Agents
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.ai_agents.map((agent, index) => {
                                    const Icon = getIcon(agent.icon);
                                    return (
                                        <div key={index} className="p-8 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                                <Icon className="h-24 w-24 text-white" />
                                            </div>
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                                    <Icon className="h-6 w-6 text-emerald-500" />
                                                </div>
                                                <h3 className="text-lg font-black text-white italic uppercase tracking-tight">{agent.name}</h3>
                                            </div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-4 leading-relaxed italic">{agent.desc}</p>
                                            <div className="text-[9px] font-black bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-500 tracking-[0.2em] uppercase italic">
                                                {agent.tech}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Cpu className="h-8 w-8 text-blue-500" />
                                </div>
                                Tools & Tech Covered
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.tech_covered.map((tech, index) => (
                                    <div key={index} className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{tech}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-12 bg-[#0d1321]/20 p-12 rounded-[3rem] border border-white/5 shadow-inner">
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Frequently Asked questions</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Clear your doubts before you start</p>
                            </div>

                            <div className="space-y-16">
                                {courseData.faq_categories.map((category, catIndex) => {
                                    const CatIcon = getIcon(category.icon === "Lightbulb" ? "Lightbulb" : "HelpCircle");
                                    return (
                                        <div key={catIndex} className="space-y-8">
                                            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                                <CatIcon className="h-6 w-6 text-emerald-400" />
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
                                <Trophy className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Get Certified</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10">
                                "Upon completing all 20 apps and passing the final AI project, students receive a Celoris Python Developer Certificate — shareable on LinkedIn and valid proof of hands-on expertise."
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">₹{courseData.price.toLocaleString()}</div>
                                        <div className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Complete Professional Bundle</div>
                                    </div>

                                    <div className="space-y-4 mb-10 text-slate-400">
                                        <CourseInquiryDialog
                                            courseTitle={courseData.title}
                                            buttonClassName="w-full h-16 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-[0.3em] rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all active:scale-95 italic"
                                        />
                                        <Link
                                            href="https://wa.me/919084718101"
                                            target="_blank"
                                            className="w-full h-14 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl flex items-center justify-center gap-3 group transition-all italic"
                                        >
                                            <Radio className="h-4 w-4 text-emerald-500 group-hover:animate-pulse" />
                                            Inquire on WhatsApp
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Course Certificate", color: "text-emerald-500" },
                                            { icon: Code, text: "20 Real-World Apps", color: "text-blue-500" },
                                            { icon: Bot, text: "5 AI Agents", color: "text-purple-500" },
                                            { icon: Users, text: "Trainer Support", color: "text-orange-500" }
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
                                        Dheeraj is a seasoned developer and AI enthusiast, dedicated to teaching the next generation of Python developers with a strictly hands-on approach.
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
