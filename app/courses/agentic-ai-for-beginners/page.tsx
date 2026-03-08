"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Layout, Heart, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function AgenticAIBeginnersCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Agentic AI for Beginners: From Prompts to Action | No-Code AI Agent Course";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Learn how AI agents think, plan, and act. Build your first AI agent using no-code tools. No coding experience required. 6-week comprehensive course.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Learn how AI agents think, plan, and act. Build your first AI agent using no-code tools. No coding experience required. 6-week comprehensive course.';
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "Agentic AI for Beginners: From Prompts to Action",
        subtitle: "Understand how AI agents think, plan, and act — no coding required.",
        description: "AI is no longer just about chatbots that answer questions. The next wave — Agentic AI — is about systems that set goals, make decisions, use tools, and complete multi-step tasks on your behalf. This course gives you a clear, jargon-free foundation to understand, use, and work alongside these powerful systems.",
        summary: "By the end of 6 weeks, you won't just understand the theory — you'll have built and run your own simple AI agent using free tools, and you'll know how to evaluate, prompt, and manage agents in real-world workflows.",
        students: 120,
        rating: 4.8,
        duration: "6 Weeks",
        lessons: "24 Lessons",
        effort: "~3 hrs/week",
        price: 1500,
        currency: "INR",
        provider: "Celoris Learning Platform",
        website: "https://celoris.in",
        url: "https://celoris.in/courses/agentic-ai-for-beginners",
        learning_outcomes: [
            "A mental model of how AI agents work: perception, memory, reasoning, and action",
            "Hands-on experience building and running a simple agent using no-code tools",
            "Ability to write effective prompts that guide agents toward your goals",
            "Understanding of where agents succeed, fail, and need human oversight",
            "A personal project to showcase in a portfolio or resume"
        ],
        requirements: [
            "No prior AI or coding experience needed",
            "Curiosity and a willingness to experiment",
            "A modern web browser",
            "Access to free tiers of tools (ChatGPT/Claude, Zapier, Notion)"
        ],
        tools: [
            { name: "ChatGPT (GPT-4o) or Claude.ai", desc: "Primary AI interfaces" },
            { name: "Zapier AI / Make.com", desc: "No-code agent automation" },
            { name: "Notion AI", desc: "Memory and knowledge management" },
            { name: "Google Colab", desc: "Optional for exploring code" }
        ],
        chapters: [
            {
                number: 1,
                title: "What is Agentic AI?",
                icon: "Zap",
                duration: "Week 1 · 4 Lessons",
                theme: "Foundation",
                overview: "Build a solid mental model of what AI agents are and why they matter now. Distinguish between chatbots and AI that pursues goals and takes actions.",
                topics: [
                    "AI, Then and Now: From rule-based systems to LLMs",
                    "Defining Agentic AI: Goal-directedness, Autonomy, Tool use, Reasoning",
                    "Real-World Agents in 2024–25: Perplexity, Copilot, AutoGPT, Devin",
                    "The Leverage Effect: Job augmentation vs. displacement"
                ],
                assignment: "Write a 200-word description of one agent you'd want to exist in your life or work."
            },
            {
                number: 2,
                title: "How Agents Think",
                icon: "Cpu",
                duration: "Week 2 · 4 Lessons",
                theme: "Architecture",
                overview: "Explore the cognitive architecture of AI agents — the perception-memory-reasoning-action loop — in approachable terms.",
                topics: [
                    "The Perception-Action Loop: How agents process environments",
                    "Memory: In-context, External, Episodic, and Semantic memory",
                    "Reasoning: Chain of Thought and ReAct (Reasoning + Acting)",
                    "Failure Modes: Hallucination, Goal drift, Context overflow, Looping"
                ],
                assignment: "Document where an AI reasoned well and where it lost track during a multi-step task."
            },
            {
                number: 3,
                title: "Talking to Agents: Prompting",
                icon: "Mail",
                duration: "Week 3 · 4 Lessons",
                theme: "Interaction",
                overview: "Master the skill of communicating with AI agents clearly, precisely, and effectively. Move beyond 'telling' to 'structuring' guidance.",
                topics: [
                    "The 5 Elements of a Strong Prompt: Role, Context, Task, Format, Constraints",
                    "Prompting Patterns: Few-shot, Step-back, and Self-critique",
                    "Engineering for Tasks vs. Roles: Compound prompts and personas",
                    "Debugging Bad Outputs: A systematic approach to fixing prompt failures"
                ],
                assignment: "Take a real task and write three iterations of a prompt, documented improvements."
            },
            {
                number: 4,
                title: "Agents Using Tools",
                icon: "Workflow",
                duration: "Week 4 · 4 Lessons",
                theme: "Capabilities",
                overview: "An agent without tools is just a text generator. Explore how agents connect to the web, files, calendars, and databases.",
                topics: [
                    "What is Tool Use? The function call pattern explained",
                    "Search and Retrieval: RAG (Retrieval-Augmented Generation)",
                    "Automation: Building workflows with Zapier AI and Make.com",
                    "Minimal Footprint: Knowing when NOT to use a tool"
                ],
                assignment: "Design the tool set and 'agent spec' for your Week 1 agent idea."
            },
            {
                number: 5,
                title: "Building Your First Agent",
                icon: "Bot",
                duration: "Week 5 · 4 Lessons",
                theme: "Hands-on",
                overview: "Design and deploy a simple but real AI agent that automates a task from your own life or work using no-code tools.",
                topics: [
                    "From Idea to Agent Specification: Using the Agent Brief template",
                    "Building with No-Code Tools: Step-by-step Zapier/Make walkthrough",
                    "Testing and Iteration: Systematic testing and edge cases",
                    "Showcasing Your Agent: Recording demos and documenting value"
                ],
                assignment: "Submit your working agent, spec document, and test results."
            },
            {
                number: 6,
                title: "Responsibility & the Future",
                icon: "Shield",
                duration: "Week 6 · 4 Lessons",
                theme: "Ethics & Growth",
                overview: "Explore the ethics, risks, and emerging possibilities of agentic AI. Learn safe agent design and future directions like multi-agent systems.",
                topics: [
                    "Human Oversight: Designing for reversibility and safety",
                    "Bias, Privacy, and Unintended Consequences in autonomous AI",
                    "Multi-Agent Systems: Orchestrators, sub-agents, and pipelines",
                    "Your Learning Path: LangChain, AI Strategy, and Career Paths"
                ],
                assignment: "Final Project submission: Agent build + 500-word reflection."
            }
        ],
        faqs: [
            {
                question: "Do I really need zero coding experience?",
                answer: "Exactly. We focus on the 'cognitive' layer and no-code tools. If you can use a web browser and write an email, you have the technical skills needed for this course."
            },
            {
                question: "Will I need to pay for AI tools?",
                answer: "No. All exercises are designed to work within the free tiers of ChatGPT, Claude, Zapier, and Notion. We'll show you how to maximize these free resources."
            },
            {
                question: "How long do I have access to the materials?",
                answer: "You get lifetime access to all video lessons, reading materials, and future updates to the course content."
            },
            {
                question: "Is there a certificate?",
                answer: "Yes, students who score 70% or above across assignments and the final project receive a verified Certificate of Completion from Celoris."
            }
        ],
        glossary: [
            { term: "Agent", definition: "An AI system that perceives its environment, plans actions, uses tools, and works toward a goal with limited human input per step." },
            { term: "Chain of Thought", definition: "A technique that asks the model to reason step-by-step before giving a final answer." },
            { term: "RAG", definition: "Retrieval-Augmented Generation — retrieving relevant documents before generating a response." },
            { term: "Minimal Footprint", definition: "A safety principle: agents should request only necessary permissions and prefer reversible actions." }
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
        "educationalLevel": "Beginner"
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">Agentic AI for Beginners</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase italic">Computer Science</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase italic">BCA</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase italic">Beginner Friendly</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight uppercase italic">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400 font-bold italic">
                                {courseData.subtitle}
                            </p>
                            <div className="bg-slate-900/50 p-8 rounded-[2rem] border-l-4 border-emerald-500 shadow-xl">
                                <p className="text-lg text-slate-300 leading-relaxed italic font-medium">
                                    "{courseData.description}"
                                </p>
                            </div>
                        </div>

                        {/* Summary / Who is this for */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-2">
                                    <Users className="h-5 w-5 text-emerald-500" />
                                    Who Is This For?
                                </h2>
                                <ul className="space-y-3">
                                    {[
                                        "Professionals looking to automate repetitive workflows",
                                        "Business owners exploring AI adoption",
                                        "Students eyeing AI product management careers",
                                        "Content creators and freelancers",
                                        "Anyone curious to go beyond simple ChatGPT prompts"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-400 font-medium italic">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-xl font-black text-white uppercase italic flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-emerald-500" />
                                    The Outcome
                                </h2>
                                <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                                    {courseData.summary}
                                </p>
                            </div>
                        </section>

                        {/* Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                                </div>
                                What You Will Walk Away With
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-5 rounded-2xl bg-slate-800/20 border border-slate-700/50 hover:border-emerald-500/30 transition-all group">
                                        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-emerald-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold italic leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum Roadmap */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-blue-400" />
                                </div>
                                Course Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Zap" ? Zap :
                                        chapter.icon === "Cpu" ? Cpu :
                                            chapter.icon === "Mail" ? Mail :
                                                chapter.icon === "Workflow" ? Workflow :
                                                    chapter.icon === "Bot" ? Bot : Shield;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-[2rem] px-4 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-inner group-hover:bg-emerald-500/10 transition-colors">
                                                        <Icon className="h-7 w-7 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Module {chapter.number}</span>
                                                            <span className="h-1 w-1 rounded-full bg-slate-700" />
                                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{chapter.theme}</span>
                                                        </div>
                                                        <div className="text-xl font-black text-white uppercase italic">{chapter.title}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase italic mr-4 bg-slate-800/50 px-4 py-1.5 rounded-full border border-white/5">
                                                        <Clock className="h-3.3 w-3.5" />
                                                        {chapter.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6">
                                                <div className="pl-[4.5rem] space-y-6">
                                                    <p className="text-slate-400 text-sm italic font-medium leading-relaxed">
                                                        {chapter.overview}
                                                    </p>
                                                    <div className="h-px bg-gradient-to-r from-emerald-500/30 to-transparent"></div>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, tIndex) => (
                                                            <li key={tIndex} className="flex items-start gap-3 text-slate-300 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 mt-1.5 group-hover:bg-emerald-500 transition-colors" />
                                                                <span className="text-sm font-bold italic">{topic}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <div className="mt-8 p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                                        <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-2 italic">Assignment:</h4>
                                                        <p className="text-sm text-slate-400 font-medium italic">{chapter.assignment}</p>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </section>

                        {/* Assessment & Certification */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <Star className="h-6 w-6 text-yellow-400" />
                                </div>
                                Assessment & Certification
                            </h2>
                            <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 shadow-2xl space-y-8">
                                <p className="text-slate-400 font-medium italic italic">
                                    This course uses project-based assessment. There are no multiple-choice tests. Learning is demonstrated through doing.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Weekly Assignments (60%)</h3>
                                        <ul className="space-y-4">
                                            {[
                                                { w: "Week 1", t: "Describe your ideal agent", p: "10%" },
                                                { w: "Week 2", t: "Multi-step task reflection", p: "10%" },
                                                { w: "Week 3", t: "Prompt iteration exercise", p: "10%" },
                                                { w: "Week 4", t: "Agent specification document", p: "10%" },
                                                { w: "Week 5", t: "Working agent + test cases", p: "20%" },
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center justify-between text-xs font-bold italic">
                                                    <span className="text-slate-400">{item.w}: <span className="text-white">{item.t}</span></span>
                                                    <span className="text-emerald-500">{item.p}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Final Project (40%)</h3>
                                        <div className="bg-white/5 p-4 rounded-2xl space-y-2">
                                            <p className="text-[10px] text-slate-400 font-bold italic">Requirements:</p>
                                            <ul className="text-xs text-slate-300 space-y-1 font-bold italic">
                                                <li>• 90-second agent walkthrough</li>
                                                <li>• Full Technical Documentation</li>
                                                <li>• 500-word written reflection</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5 text-center">
                                    <p className="text-xs font-black text-emerald-500 uppercase tracking-widest italic">
                                        Certificate issued upon scoring 70% or higher.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Glossary Snippet */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-purple-400" />
                                </div>
                                Key Terms to Master
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {courseData.glossary.map((item, i) => (
                                    <div key={i} className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                                        <div className="text-emerald-400 font-black uppercase text-xs mb-2 italic tracking-tighter">{item.term}</div>
                                        <p className="text-xs text-slate-500 font-medium italic leading-relaxed">{item.definition}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Enrollment Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[3rem] blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-[#0d1426] border-0 rounded-[3rem] overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-6">
                                            <div className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[12px] italic">Enrollment Open</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-16 text-lg font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] shadow-xl shadow-emerald-500/20 transition-all uppercase italic tracking-widest"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-white/5 font-black uppercase italic text-[10px]">
                                            {[
                                                { icon: <Users className="h-4 w-4 text-emerald-500" />, text: "Opportunity to work with us" },
                                                { icon: <Clock className="h-4 w-4 text-blue-500" />, text: "Lifetime access" },
                                                { icon: <Award className="h-4 w-4 text-purple-500" />, text: "Certificate of completion" },
                                                { icon: <CheckCircle className="h-4 w-4 text-emerald-500" />, text: "2026 Ready Content" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 text-slate-400">
                                                    {item.icon}
                                                    <span>{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tools Used */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-[2.5rem] overflow-hidden p-8">
                                <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-6 italic">Tools You'll Master</h3>
                                <div className="space-y-4">
                                    {courseData.tools.map((tool, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                                                <Zap className="h-4 w-4 text-emerald-500" />
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-white uppercase italic tracking-tight">{tool.name}</div>
                                                <p className="text-[10px] text-slate-500 font-bold italic">{tool.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Instructor Card */}
                            <Card className="bg-[#0a0f1d] border-white/5 rounded-[2.5rem] p-8">
                                <CardHeader className="p-0 mb-6">
                                    <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic mb-4">Course Provider</div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white p-3 shadow-xl border border-white/10 flex items-center justify-center">
                                            <img src="/celoris-logo.svg" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white italic uppercase tracking-tighter">Celoris</h4>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Course Instructor</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <p className="text-xs text-slate-400 leading-relaxed font-bold italic mb-6">
                                        Celoris is an unified platform for learn, earn or just to be social. We bridge the gap between AI theory and real-world execution.
                                    </p>
                                    <div className="space-y-3 text-[10px] font-black uppercase italic text-slate-500">
                                        <div className="flex items-center gap-3">
                                            <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                                            <span className="text-white">4.8</span>
                                            <span className="">(120 ratings)</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-3.5 w-3.5 text-emerald-500" />
                                            <span>6 Weeks Content</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="h-3.5 w-3.5 text-blue-500" />
                                            <span>120 Students Enrolled</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prerequisites */}
                            <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800">
                                <h3 className="text-xs font-black text-white mb-6 flex items-center gap-3 uppercase italic tracking-widest">
                                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                                    Is This You?
                                </h3>
                                <ul className="space-y-4">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3 text-xs text-slate-400 font-bold italic">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 mt-1.5 flex-shrink-0" />
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
