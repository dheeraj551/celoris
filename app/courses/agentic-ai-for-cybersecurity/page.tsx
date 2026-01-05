"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, Music, Video, Mic, Image as ImageIcon, Lock, Activity, Target } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AgenticAICybersecurityCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Agentic AI for Cybersecurity: Building and Scaling Autonomous Defense & Automation Systems";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Build Agentic Systems for cybersecurity. Learn to reduce Tier 1 burnout by delegating triage, investigation, and remediation to specialized AI agents.";
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
        title: "Agentic AI for Cybersecurity",
        subtitle: "Building and Scaling Autonomous Defense & Automation Systems",
        description: "Move beyond simple Generative AI prompts to build Agentic Systems—AI that can reason, use security tools, and execute multi-step playbooks autonomously. Focus on reducing 'Tier 1 burnout' by delegating routine triage, investigation, and remediation to specialized AI agents.",
        students: 1250,
        rating: 4.95,
        duration: "6-8 Weeks (Self-paced)",
        price: 29999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/agentic-ai-for-cybersecurity",
        learning_outcomes: [
            "Transition from standard automation (SOAR) to Agentic SOC architectures.",
            "Master frameworks like LangGraph, CrewAI, and AutoGen for security workflows.",
            "Connect AI agents to SIEMs (Splunk/Sentinel), EDRs (CrowdStrike), and Threat Intel APIs.",
            "Build 'Swarms' of investigation agents that correlate multi-source data in parallel.",
            "Implement Human-in-the-Loop (HITL) design patterns for high-stakes remediation.",
            "Secure your agents against prompt injection and adversarial attacks.",
            "Deploy Agentic RAG systems for private security knowledge bases.",
            "Automate dark web searches and OSINT gathering using specialized agents.",
            "Monitor and measure MTTR and 'Hours Saved' as key ROI metrics.",
            "Build production-grade bots for leaked secret monitoring and vulnerability patching."
        ],
        requirements: [
            "Basic understanding of Cybersecurity concepts (SIEM, EDR, TTPs)",
            "Proficiency in Python programming",
            "Familiarity with LLM basics (GPT, Claude, or Llama)",
            "Experience with API integrations is helpful"
        ],
        chapters: [
            {
                number: 1,
                title: "The Agentic Shift in Defense",
                icon: "Zap",
                topics: [
                    "The Problem: Why SOAR and traditional automation failed to stop burnout.",
                    "The Solution: Definition of Agentic AI vs. GenAI vs. Standard Automation.",
                    "The 'Agentic SOC' Architecture: Moving from human-led triage to agent-led investigation.",
                    "Market Trends: Analysis of vendor adoption (Google SecOps, Microsoft Copilot, and open-source frameworks)."
                ],
                duration: "1 Week"
            },
            {
                number: 2,
                title: "The Technical Stack for Security Agents",
                icon: "Cpu",
                topics: [
                    "LLMs for Reasoning: GPT-4o, Claude 3.5, and local models (Llama 3) for privacy.",
                    "Frameworks: Hands-on with LangGraph, CrewAI, and AutoGen for security workflows.",
                    "Memory & State: How agents remember past incidents to improve future responses.",
                    "Tool Calling: Connecting AI to SIEMs, EDRs, and Threat Intel APIs."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 3,
                title: "Building Defensive Agents (The Blue Team)",
                icon: "Shield",
                topics: [
                    "The Triage Agent: Automating the 'False Positive vs. True Positive' decision loop.",
                    "Investigation Agents: Building 'Swarms' that gather logs and correlate identity data.",
                    "The Remediation Agent: Executing surgical containment based on reasoning.",
                    "Lab: Build an agent that investigates a Phishing alert from start to finish."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 4,
                title: "Autonomous Threat Intelligence & Hunting",
                icon: "Search",
                topics: [
                    "Agentic RAG: Building a private security knowledge base that agents can query.",
                    "Dark Web & OSINT Agents: Automating the search for leaked credentials.",
                    "Continuous Hunting: Deploying agents that look for 'Living off the Land' (LotL) techniques.",
                    "Hands-on: Engineering a multi-source threat intelligence aggregator."
                ],
                duration: "1 Week"
            },
            {
                number: 5,
                title: "Security of the Agents (Guardrails & Governance)",
                icon: "Lock",
                topics: [
                    "Prompt Injection in Security: Preventing attackers from 'hacking' defensive agents.",
                    "Human-in-the-Loop (HITL): Design patterns for high-stakes actions ('Human disposes').",
                    "Auditability: Maintaining a transparent 'chain of thought' for compliance.",
                    "Governance: Managing 'Agent Sprawl' and compute costs."
                ],
                duration: "1 Week"
            }
        ],
        faqs: [
            {
                question: "Do I need to be a Python expert?",
                answer: "Intermediate Python is required. We cover the specific libraries (LangChain/LangGraph) used for agents, but you should be comfortable with scripts and APIs."
            },
            {
                question: "Is this course relevant for Red Teamers?",
                answer: "While we focus on defense (Blue Team), the principles of building autonomous agents are directly applicable to offensive security automation and red team operations."
            },
            {
                question: "Can I run these agents locally?",
                answer: "Yes, we cover how to use local models like Llama 3 with Ollama or vLLM to ensure data privacy for security logs."
            },
            {
                question: "Will we get access to the code used in labs?",
                answer: "Absolutely. You get full access to the GitHub repository containing all agents, templates, and orchestration playbooks."
            }
        ],
        projects: [
            {
                title: "The 'Silent Guardian' Bot",
                description: "An agent that monitors GitHub for leaked secrets and automatically rotates them.",
                tools: "LangGraph + GitHub API + AWS Secrets Manager",
                icon: "Bot"
            },
            {
                title: "Multi-Agent War Room",
                description: "Agents (Researcher, Forensic Analyst, Responder) 'chat' to solve a ransom incident.",
                tools: "CrewAI + ELK Stack + Slack Integration",
                icon: "Shield"
            },
            {
                title: "Vulnerability Patcher",
                description: "An agent that reads scan reports, writes patches, and opens PRs for review.",
                tools: "AutoGen + Snyk + GitHub Actions",
                icon: "Activity"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Agentic AI for Cybersecurity",
        "description": "Building and Scaling Autonomous Defense & Automation Systems. Reduce SOC burnout with specialized AI agents.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Advanced",
        "teaches": [
            "Agentic SOC Architecture",
            "LangGraph for Security",
            "Autonomous Incident Response",
            "Threat Hunting Agents",
            "Security Agent Guardrails",
            "OSINT Automation"
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
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Agentic AI</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Cybersecurity</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Automation</span>
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
                                        src="/agentic-ai-cybersecurity-cover.png"
                                        alt="Agentic AI for Cybersecurity"
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
                                        chapter.icon === "Cpu" ? Cpu :
                                            chapter.icon === "Shield" ? Shield :
                                                chapter.icon === "Search" ? Search : Lock;
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

                        {/* Tech Stack Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Cpu className="h-6 w-6 text-green-400" />
                                </div>
                                The Autonomous SOC Stack
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Frameworks", value: "LangGraph, CrewAI" },
                                    { label: "LLMs", value: "GPT-4o, Claude 3.5, Llama 3" },
                                    { label: "Integrations", value: "Splunk, Sentinel, EDR" },
                                    { label: "Search", value: "Tavily, Firecrawl, Shodan" }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/50">
                                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</div>
                                        <div className="text-sm text-cyan-400 font-semibold">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Target className="h-6 w-6 text-blue-400" />
                                </div>
                                Practical Lab Projects
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Hands-on engineering projects designed to automate the drudgery of Tier 1 analysis and remediation.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "Bot" ? Bot : item.icon === "Shield" ? Shield : Activity;
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
                            <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Future-Proofing Your Career</h3>
                            <p className="text-lg text-slate-300 leading-relaxed italic relative z-10">
                                "The drudgery of Tier 1 analysis is being replaced by AI. This course doesn't just teach you to use AI; it teaches you to build the systems that will define the next decade of cybersecurity defense."
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
                                                <Activity className="h-5 w-5 text-purple-400" />
                                                <span>Real-world SOC Playbooks</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-blue-400" />
                                                <span>Intensive AI-Security Community</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>Practical Hacking Labs</span>
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
                                        <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg shadow-white/10 border border-slate-200 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Designs</h4>
                                            <p className="text-xs text-slate-400">Pioneering AI-First Development</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Specializing in advanced Agentic AI Systems and Cybersecurity Automation. We bridge the gap between traditional SOC workflows and autonomous AI-driven defense.
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
