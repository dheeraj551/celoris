"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function AgenticAISystemsCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Agentic AI Systems: Design, Build & Deploy | Master Multi-Agent Workflows";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Master modern agentic systems and build multi-agent AI workflows using OpenAI, LangChain, and LangGraph. Transition from simple prompting to building autonomous systems.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Master modern agentic systems and build multi-agent AI workflows using OpenAI, LangChain, and LangGraph. Transition from simple prompting to building autonomous systems.';
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "Agentic AI Systems: Design, Build & Deploy",
        subtitle: "Master the Art of Multi-Agent Orchestration and Autonomous Workflows",
        description: "Transition from simple prompting to building autonomous systems. You will learn to design, develop, and deploy Agentic AI workflows that think, use tools, and collaborate to solve complex, real-world problems.",
        students: 1250,
        rating: 4.9,
        duration: "15 hours",
        price: 15000,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/agentic-ai-systems-design-build-deploy",
        learning_outcomes: [
            "Transition from linear LLM calls to recursive agentic reasoning loops.",
            "Design sophisticated 'Plan-and-Execute' and 'Autonomous Loop' architectures.",
            "Master Multi-Agent Orchestration: Hierarchical and Peer-to-Peer patterns.",
            "Implement long-term and short-term memory management for agents.",
            "Deep dive into OpenAI's Tool Definitions and JSON schema for Function Calling.",
            "Master LangChain & LangGraph for building stateful, multi-agent graphs.",
            "Prototype collaborative agent teams using CrewAI and AutoGen.",
            "Connect agents to external APIs, SQL databases, and web search engines.",
            "Implement Human-in-the-loop (HITL) and output verification guardrails.",
            "Deploy production-ready agents using Docker, FastAPI, and Serverless environments."
        ],
        requirements: [
            "Intermediate proficiency in Python or JavaScript",
            "Familiarity with LLM basics (Prompt Engineering)",
            "Basic understanding of APIs and JSON",
            "Willingness to experiment with autonomous systems"
        ],
        chapters: [
            {
                number: 1,
                title: "The Evolution of Agentic AI",
                icon: "Zap",
                topics: [
                    "Moving from Chatbots to Autonomous Agents.",
                    "The Paradigm Shift: Linear LLM calls vs. Agentic Reasoning.",
                    "The Anatomy of an Agent: Perception, Planning, Memory, and Action.",
                    "Cognitive Frameworks: Chain-of-Thought (CoT), Self-Reflection, and ReAct patterns."
                ],
                videoUrl: "https://www.youtube.com/embed/Y46XgRfD4GU",
                duration: "3 hours"
            },
            {
                number: 2,
                title: "Architectures & Design Patterns",
                icon: "Workflow",
                topics: [
                    "Designing 'Plan-and-Execute' vs. 'Autonomous Loop' architectures.",
                    "Multi-Agent Orchestration: Hierarchical (Manager/Worker) models.",
                    "Peer-to-Peer Collaboration: Researchers, Writers, and Reviewers.",
                    "State Management: Handling persistence and memory in complex loops."
                ],
                duration: "4 hours"
            },
            {
                number: 3,
                title: "Tool Usage & The Technical Stack",
                icon: "Cpu",
                topics: [
                    "Deep dive into OpenAI’s Tool Definitions and JSON schema.",
                    "LangChain & LangGraph: Building stateful, multi-agent graphs.",
                    "CrewAI / AutoGen: Rapidly prototyping collaborative agent teams.",
                    "External Integration: Connecting agents to SQL, Search APIs, and Web Tools."
                ],
                duration: "4 hours"
            },
            {
                number: 4,
                title: "Real-World Use Cases & Deployment",
                icon: "Server",
                topics: [
                    "Case Study: Autonomous Customer Support (Logic → Tool Search → Resolution).",
                    "Case Study: Automated Market Research (Data Scraping → Analysis → Report).",
                    "Guardrails & Safety: Implementing Human-in-the-loop (HITL).",
                    "Cloud Deployment: Hosting agents with Docker, FastAPI, and Serverless."
                ],
                duration: "4 hours"
            }
        ],
        faqs: [
            {
                question: "What is the difference between a chatbot and an agent?",
                answer: "A chatbot typically follows a linear path of input and output. An AI Agent has 'agency'—it can use tools, reflect on its own output, and autonomously decide on the next series of steps to achieve a complex goal."
            },
            {
                question: "Do I need to be an expert coder?",
                answer: "You should have intermediate knowledge of Python or JavaScript. While the frameworks like LangChain simplify things, understanding logic flow and API integrations is crucial."
            },
            {
                question: "What frameworks will be covered?",
                answer: "We focus heavily on LangGraph for stateful orchestration, but also cover CrewAI for multi-agent teams and the native OpenAI Tool Calling API."
            },
            {
                question: "Is this course future-proof?",
                answer: "The AI landscape moves fast. This course teaches the 'Reasoning Patterns' (ReAct, Plan-and-Execute) which remain constant even as models improve."
            }
        ],
        deliverables: [
            {
                title: "Agent 1: The Researcher",
                description: "Scours live web data and documentation for specific queries.",
                icon: "Search"
            },
            {
                title: "Agent 2: The Analyst",
                description: "Critically evaluates data quality and extracts key insights.",
                icon: "BarChart"
            },
            {
                title: "Agent 3: The Executor",
                description: "Formats output into Email, Markdown, or Database entries.",
                icon: "Bot"
            }
        ],
        reviews: [
            {
                name: "Aman Verma",
                role: "Software Engineer",
                rating: 5,
                comment: "This is hands down one of the best courses I’ve taken on agentic AI. The way planning, tool calling, and multi-agent systems are explained is very practical. The capstone project alone is worth the price."
            },
            {
                name: "Sarah Mitchell",
                role: "AI Product Manager",
                rating: 4,
                comment: "Loved the architecture patterns and real-world focus. I would have liked a bit more on evaluation metrics, but overall it gave me clarity on how agentic systems are actually built in production."
            },
            {
                name: "Rohit Sharma",
                role: "Full-Stack Developer",
                rating: 5,
                comment: "Clear explanations, modern tooling, and no unnecessary theory. This course helped me move from “prompting” to actually building autonomous AI workflows."
            },
            {
                name: "Daniel Weber",
                role: "Data Scientist",
                rating: 4,
                comment: "Very well structured and up to date with the current agent ecosystem. Some parts assume prior familiarity with LangChain, but if you have basics, this course is excellent."
            },
            {
                name: "Neha Kulkarni",
                role: "ML Engineer",
                rating: 5,
                comment: "The multi-agent orchestration section was 🔥. I finally understood how agents collaborate and recover from failures. This feels like a course built by someone who has done this in real projects."
            },
            {
                name: "Jason Lee",
                role: "Computer Science Student",
                rating: 3,
                comment: "The content is high quality, but it’s not beginner friendly. I struggled initially with the terminology. Once I caught up, it made more sense."
            },
            {
                name: "Priya Singh",
                role: "Automation Consultant",
                rating: 4,
                comment: "Very useful for building client-ready AI systems. The deployment and guardrails section was particularly valuable. Could use more step-by-step walkthroughs in some lessons."
            },
            {
                name: "Mark Thompson",
                role: "Startup Founder",
                rating: 5,
                comment: "This course changed how we think about AI internally. We’re now building agents that plan and execute tasks instead of simple chatbots. Highly recommended for startups."
            },
            {
                name: "Ankit Jain",
                role: "Python Developer",
                rating: 3,
                comment: "Good concepts and solid examples, but pacing felt fast in the middle modules. Might need to rewatch some lessons if you’re new to agent frameworks."
            },
            {
                name: "Emily Carter",
                role: "Technical Consultant",
                rating: 4,
                comment: "Practical, modern, and relevant. I liked the focus on production deployment and safety. A few more real-world debugging examples would make it perfect."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Agentic AI Systems: Design, Build & Deploy",
        "description": "Master modern agentic systems and build multi-agent AI workflows using OpenAI, LangChain, and LangGraph.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris designs llp",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "courseCode": "AAI-001",
        "educationalLevel": "Intermediate to Advanced",
        "teaches": [
            "Agentic AI Architectures",
            "Multi-agent Orchestration",
            "Autonomous AI Workflows",
            "LangChain & LangGraph Integration",
            "OpenAI Tool Usage & Plugins"
        ],
        "about": [
            {
                "@type": "Thing",
                "name": "Artificial Intelligence"
            },
            {
                "@type": "Thing",
                "name": "Autonomous Agents"
            }
        ],
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "Introduction to Agentic AI",
                "description": "The shift from chatbots to autonomous reasoning systems."
            },
            {
                "@type": "Syllabus",
                "name": "Architectures & Patterns",
                "description": "Design patterns including ReAct, Plan-and-Execute, and Multi-agent loops."
            },
            {
                "@type": "Syllabus",
                "name": "Tool Usage & Frameworks",
                "description": "Technical implementation using OpenAI Function Calling and LangChain."
            },
            {
                "@type": "Syllabus",
                "name": "Deployment & Use Cases",
                "description": "Building and deploying a production-ready multi-agent automation workflow."
            }
        ],
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "priceCurrency": "INR",
            "price": "15000.00",
            "availability": "https://schema.org/InStock"
        }
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
                    <span className="text-slate-100 line-clamp-1">Agentic AI Systems</span>
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
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Multi-Agent Systems</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">LangGraph</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Advanced AI</span>
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

                        {/* Course Video with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/Y46XgRfD4GU"
                                        title="Agentic AI Systems Course Video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
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
                                        chapter.icon === "Workflow" ? Workflow :
                                            chapter.icon === "Cpu" ? Cpu : Server;
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
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-400 text-sm mr-4 bg-slate-800/50 px-3 py-1 rounded-full">
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

                                                    {(chapter as any).videoUrl && (
                                                        <div className="mt-6 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl">
                                                            <div className="aspect-video">
                                                                <iframe
                                                                    className="w-full h-full"
                                                                    src={(chapter as any).videoUrl}
                                                                    title={`${chapter.title} - Video Lesson`}
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                    allowFullScreen
                                                                ></iframe>
                                                            </div>
                                                        </div>
                                                    )}
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
                                Project: The \"Agentic Enterprise\" Workflow
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Participants will not just watch videos; they will build a Production-Ready Multi-Agent Workflow comprising three specialized agents and a central orchestrator.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.deliverables.map((item, index) => {
                                    const Icon = item.icon === "Search" ? Search : item.icon === "BarChart" ? BarChart : Bot;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-cyan-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-cyan-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                                                <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                            {/* Orchestrator Feature */}
                            <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex flex-col md:flex-row items-center gap-6 mt-6">
                                <div className="bg-cyan-500/20 p-4 rounded-full">
                                    <Workflow className="h-10 w-10 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Central Orchestrator</h3>
                                    <p className="text-slate-400">A central logic gate that manages the data flow between agents, handles error recovery, and ensures the final deliverable meets quality standards.</p>
                                </div>
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

                        {/* Student Reviews Section */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                                        <Star className="h-6 w-6 text-yellow-400" />
                                    </div>
                                    Student Reviews
                                </h2>
                                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-full border border-slate-700">
                                    <span className="text-white font-bold">{courseData.rating}</span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <span className="text-slate-500 text-sm ml-1">({courseData.students} total)</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.reviews.map((review, index) => (
                                    <Card key={index} className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all group">
                                        <CardContent className="p-6">
                                            <div className="flex gap-0.5 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                                                "{review.comment}"
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold border border-slate-700 group-hover:border-cyan-500/50 transition-colors">
                                                    {review.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{review.name}</div>
                                                    <div className="text-xs text-slate-500">{review.role}</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
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
                                                <span>2024-2025 Tech Stack (LangGraph)</span>
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
                                        <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg shadow-white/10 border border-slate-200 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris</h4>
                                            <p className="text-xs text-slate-400">Pioneering Agentic Workflows</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Expert engineering team specializing in multi-agent orchestration and autonomous LLM workflows. We build and deploy enterprise-grade AI systems.
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
