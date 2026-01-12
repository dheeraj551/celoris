"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, HelpCircle, BookOpen, Zap, Lightbulb, Shield, Bot, Database, Mail, Brain, History, UserCheck, Layers, Share2, ShieldCheck, Fingerprint, Lock, Trash2, Sliders, MessageSquare } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PersonalizedAICourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Personalized AI Experiences with RAG & Agents | Celoris Designs";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Build AI that knows your users, remembers their history, and anticipates their needs. Master RAG, memory systems, and agentic workflows for hyper-personalization.";
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
        title: "Personalized AI Experiences",
        subtitle: "with RAG & Agents",
        tagline: "Build AI that knows your users, remembers their history, and anticipates their needs.",
        description: "Escape the generic chatbot trap. This course teaches you how to build AI systems that provide truly 'magical' experiences by deeply understanding user context, maintaining long-term memory, and adapting dynamically to individual vibes and needs.",
        students: 850,
        rating: 4.95,
        duration: "6-Week Self-Paced",
        level: "Intermediate to Advanced",
        price: 19999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/personalized-ai-experiences-with-rag-and-agents",
        learning_outcomes: [
            "Design sophisticated user profiles for explicit and implicit traits.",
            "Implement user-centric RAG with metadata filtering and re-ranking.",
            "Build robust memory systems using sliding windows and vector-based archival.",
            "Develop agents that plan and act based on user habits and constraints.",
            "Master tone and style transfer for dynamic output adaptation.",
            "Implement feedback loops for continuous AI improvement.",
            "Architect privacy-first systems with PII management and 'Right to be Forgotten'.",
            "Mitigate bias and prevent AI-driven echo chambers.",
            "Integrate LangGraph for stateful, multi-actor applications.",
            "Use Graph RAG (Neo4j) to map complex user-entity relationships."
        ],
        requirements: [
            "Proficiency in Python",
            "Familiarity with LLM APIs (OpenAI/Anthropic)",
            "Basic understanding of vector databases (Pinecone, Weaviate, etc.)",
            "Desire to build next-generation personalized AI products"
        ],
        chapters: [
            {
                number: 1,
                title: "The Personalization Paradigm",
                icon: "Brain",
                topics: [
                    "Why generic chatbots are failing and how context wins users.",
                    "The Hierarchy of Context: From zero-shot to few-shot to fully personalized state.",
                    "Defining the 'User Profile': Designing schema for user preferences, history, and explicit vs. implicit traits.",
                    "Architecture Patterns: Where personalization lives (Prompt vs. Context Window vs. Fine-tuning vs. RAG).",
                    "Case Study: Deconstructing Netflix or Spotify’s recommendation engines and mapping them to LLM architectures."
                ],
                duration: "Week 1"
            },
            {
                number: 2,
                title: "User-Centric RAG",
                icon: "Database",
                topics: [
                    "Moving beyond semantic search to user-weighted retrieval.",
                    "Metadata Filtering Strategies: Injecting user IDs, role permissions, and temporal constraints into vector queries.",
                    "Recursive Retrieval & Re-ranking: Using user history to re-rank search results for relevance.",
                    "Graph RAG for Personalization: Using Knowledge Graphs (Neo4j) to map relationships between users and entities."
                ],
                duration: "Week 2"
            },
            {
                number: 3,
                title: "Memory Systems & State Management",
                icon: "History",
                topics: [
                    "Giving the AI a hippocampus: Short-term vs. Long-term Memory.",
                    "Entity Extraction for Memory: Automatically detecting and storing facts into structured SQL/NoSQL databases.",
                    "Summarization Strategies: Compressing conversation history into 'episodic memories' without losing nuance.",
                    "Lab: Building a persistent 'User Bio' that updates automatically after every conversation."
                ],
                duration: "Week 3"
            },
            {
                number: 4,
                title: "Agentic Planning & Sequential Tasks",
                icon: "Bot",
                topics: [
                    "Profile-Driven Planning: Modifying agent system prompts based on user sophistication.",
                    "Tool Selection Bias: Configuring agents to prefer specific tools based on user constraints.",
                    "Multi-Agent Hand-offs: Routing users to specific sub-agents based on tone analysis.",
                    "Using LangGraph for stateful, multi-actor applications."
                ],
                duration: "Week 4"
            },
            {
                number: 5,
                title: "Dynamic Adaptation & Style Transfer",
                icon: "Sliders",
                topics: [
                    "Tone & Style Matching: Analyzing user input to mirror syntax, complexity, and formality.",
                    "Format Personalization: Generating outputs in preferred formats (JSON, Markdown, Bullet points) automatically.",
                    "Feedback Loops: Implementing reinforcement mechanisms that update vector stores to avoid repeating mistakes.",
                    "Real-time adaptation without explicit user instructions."
                ],
                duration: "Week 5"
            },
            {
                number: 6,
                title: "Privacy, Security & Ethics",
                icon: "ShieldCheck",
                topics: [
                    "The risks of knowing too much: PII Management and anonymization techniques.",
                    "The 'Right to be Forgotten': Architecting systems for memory deletion and profile resets.",
                    "Bias & Echo Chambers: Preventing over-optimization and reinforcing harmful biases.",
                    "Ethics of persuasion in personalized AI."
                ],
                duration: "Week 6"
            }
        ],
        faqs: [
            {
                question: "What tech stack is recommended for this course?",
                answer: "We primarily use LangChain/LlamaIndex for orchestration, LangGraph for agents, Pinecone/Weaviate for vector storage, and Zep for memory. Experiments use GPT-4o and Claude 3.5 Sonnet."
            },
            {
                question: "Is this course suitable for beginners in AI?",
                answer: "This is an intermediate to advanced course. We recommend being comfortable with Python and basic LLM usage before enrolling."
            },
            {
                question: "Will I build a real project?",
                answer: "Yes, the capstone project is 'The Concierge', a Personal Travel & Lifestyle Assistant that incorporates all modules (Memory, RAG, Agents, and Personalization)."
            },
            {
                question: "How does personalization affect user retention?",
                answer: "Personalization creates high switching costs and 'magical' moments, which directly correlates to significantly lower churn rates in AI products."
            }
        ],
        projects: [
            {
                title: "The Concierge",
                description: "Build a Personal Travel & Lifestyle Assistant that remembers preferences and suggests tailored itineraries.",
                tools: "LangGraph + Pinecone + Zep",
                icon: "UserCheck"
            },
            {
                title: "Dynamic Style Mirror",
                description: "An AI agent that automatically adapts its communication style and format to match the user's vibe.",
                tools: "Claude 3.5 + Prompt Engineering",
                icon: "MessageSquare"
            },
            {
                title: "Safe Memory System",
                description: "A memory architecture that automatically scrubs PII and supports 'Right to be Forgotten' requests.",
                tools: "SQL + Anonymization APIs",
                icon: "Lock"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Personalized AI Experiences with RAG & Agents",
        "description": "Master the art of building AI that deeply understands and adapts to individual users using RAG, Memory, and Agents.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Intermediate to Advanced",
        "teaches": [
            "User Profiling for AI",
            "User-Centric RAG",
            "Long-term AI Memory",
            "Agentic Personalization",
            "Dynamic Style Transfer",
            "AI Privacy & Ethics"
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-purple-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-purple-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-purple-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-purple-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Advanced AI</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">RAG & Agents</span>
                                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Celoris Designs</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                {courseData.title} <span className="text-purple-500">{courseData.subtitle}</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-purple-400/90 font-medium">
                                {courseData.tagline}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Image */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src="/personalized-ai-rag-agents-cover.png"
                                        alt="Personalized AI Experiences"
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

                        {/* Market Hook */}
                        <div className="p-8 rounded-3xl bg-purple-500/5 border border-purple-500/10">
                            <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Escape the Generic
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                Most AI wrappers perform exactly the same for every user. Learn how to create sticky products that feel "magical" because they truly know the user. Personalization directly correlates to lower churn and higher user satisfaction.
                            </p>
                        </div>

                        {/* Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-purple-400" />
                                </div>
                                What You Will Master
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-purple-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-purple-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-purple-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Course Curriculum */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Layers className="h-6 w-6 text-blue-400" />
                                </div>
                                Curriculum Syllabus
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Brain" ? Brain :
                                        chapter.icon === "Database" ? Database :
                                            chapter.icon === "History" ? History :
                                                chapter.icon === "Bot" ? Bot :
                                                    chapter.icon === "Sliders" ? Sliders : ShieldCheck;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-purple-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
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
                                                    <div className="h-px bg-gradient-to-r from-purple-500/30 to-transparent mb-4"></div>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-purple-500/40 mt-2 group-hover:bg-purple-500 transition-colors" />
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
                                <div className="p-2 bg-indigo-500/20 rounded-lg">
                                    <Award className="h-6 w-6 text-indigo-400" />
                                </div>
                                Hands-On Capstone Project
                            </h2>
                            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 mb-8">
                                <h3 className="text-xl font-bold text-white mb-2">Project: "The Concierge"</h3>
                                <p className="text-slate-400 leading-relaxed">
                                    Build a Personal Travel & Lifestyle Assistant that demonstrates onboarding, stateful memory across sessions, user-weighted RAG, and multi-agent tool usage in a variety of communication tones.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "UserCheck" ? UserCheck : item.icon === "MessageSquare" ? MessageSquare : Lock;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-purple-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center h-full flex flex-col">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-purple-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-slate-400 mb-4 flex-grow">{item.description}</p>
                                                <div className="text-xs font-mono bg-slate-950/50 p-2 rounded border border-slate-700 text-purple-500">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-purple-400" />
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
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹{courseData.price}
                                            </div>
                                            <div className="text-purple-400 font-bold tracking-widest uppercase text-xs">Self-Paced Mastery</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white rounded-2xl shadow-lg shadow-purple-500/25 transition-all active:scale-95"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-purple-400" />
                                                <span>AI Personalization Certificate</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-yellow-400" />
                                                <span>6 Deep-Dive Modules</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Bot className="h-5 w-5 text-blue-400" />
                                                <span>LangGraph Mastery</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-indigo-400" />
                                                <span>Lifetime Community Access</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Presented by</div>
                                    <CardTitle className="text-xl text-white italic tracking-tight">Celoris Designs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-2 border border-slate-700 flex items-center justify-center">
                                            <Brain className="h-8 w-8 text-purple-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Designs</h4>
                                            <p className="text-xs text-slate-400">Pioneers in Agentic Personalization</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Bridging the gap between generic AI and truly personalized user experiences. We focus on building systems that feel human-like and contextually aware.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-purple-400 text-purple-400" />
                                            <span className="font-bold">{courseData.rating}</span>
                                            <span className="text-slate-500">({courseData.students}+)</span>
                                        </div>
                                        <div className="text-slate-400">
                                            {courseData.duration}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Target Profile */}
                            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Fingerprint className="h-5 w-5 text-purple-400" />
                                    Target Profile
                                </h3>
                                <ul className="space-y-3">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                                            <div className="h-1.5 w-1.5 rounded-full bg-purple-500/40 mt-1.5 flex-shrink-0" />
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
