"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Layers, Filter, RefreshCw, Activity, Globe, ShieldCheck, TrendingDown, Terminal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DeployScaleAICourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Deploy & Scale AI Apps (Serverless + Edge) | Celoris Designs";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const desc = "Master the transition from local AI prototype to global production. Learn to deploy on Vercel, AWS, and Cloudflare with a focus on cost optimization and edge performance.";
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
        title: "Deploy & Scale AI Apps (Serverless + Edge)",
        subtitle: "Bridge the gap from local prototype to global production with high performance and zero-waste scaling.",
        description: "Stop paying for idle GPUs. Learn to deploy production-grade AI applications using Serverless and Edge architectures to ensure your project is lightning-fast, globally available, and cost-efficient from user #1 to user #1,000,000.",
        students: 1200,
        rating: 4.9,
        duration: "10 hours",
        price: 15000,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/deploy-scale-ai-apps-serverless-edge",
        learning_outcomes: [
            "Serverless & Edge Architecture Selection",
            "Global Deployment with Vercel & Next.js AI SDK",
            "Edge Computing with Cloudflare Workers (10ms latency)",
            "AWS Lambda & Fargate for Heavy Inference",
            "Model Routing (GPT-4o vs Claude 3.5 vs Llama 3)",
            "Precision Cost Optimization & Token Management",
            "AI Observability & Tracing (LangSmith/Helicone)",
            "Secure API Key & Environment Variable Management",
            "Prompt Injection Defense & Guardrails",
            "Production-Grade CI/CD for AI Infrastructure"
        ],
        requirements: [
            "Intermediate proficiency in JavaScript/TypeScript",
            "Basic understanding of AI/LLM APIs",
            "Familiarity with Cloud platforms is a plus",
            "A desire to ship production-ready applications"
        ],
        chapters: [
            {
                number: 1,
                title: "The Modern AI Infrastructure Stack",
                icon: "Server",
                topics: [
                    "Choosing the right home for your models and logic.",
                    "Vercel & Next.js AI SDK: Deploying \"wrapper\" apps and streaming LLM responses with zero configuration.",
                    "Cloudflare Workers: Executing AI logic at the Edge (10ms latency) using Wrangler and Vectorize.",
                    "AWS Lambda & Fargate: When to use serverless containers for heavy-duty inference and long-running tasks.",
                    "The Architecture Trade-off: Comparing Cold Starts, Regional Latency, and Execution Limits."
                ],
                duration: "2.5 hours"
            },
            {
                number: 2,
                title: "Precision Cost Optimization",
                icon: "TrendingDown",
                topics: [
                    "Scaling your impact, not your cloud bill.",
                    "Model Routing: Strategies for switching between models based on task complexity.",
                    "Caching Layers: Implementing Redis (Upstash) to save costs on redundant LLM queries.",
                    "Token Management: Optimizing context windows and prompt engineering to minimize \"token tax.\"",
                    "Billing Alarms & Hard Limits: Setting up programmatic kill-switches to prevent runaway API costs."
                ],
                duration: "2.5 hours"
            },
            {
                number: 3,
                title: "Observability (Monitoring & Logging)",
                icon: "Activity",
                topics: [
                    "Seeing what your AI is thinking in real-time.",
                    "Tracing AI Flows: Using tools like LangSmith, Helicone, or Arize Phoenix to debug multi-step chains.",
                    "Structured Logging: Setting up OpenTelemetry to track latency, token usage, and error rates.",
                    "Feedback Loops: Capturing user \"thumbs up/down\" data directly into your database for fine-tuning.",
                    "Semantic Monitoring: Detecting \"hallucinations\" or off-brand responses automatically."
                ],
                duration: "2.5 hours"
            },
            {
                number: 4,
                title: "Production Security & Compliance",
                icon: "ShieldCheck",
                topics: [
                    "Hardening your AI app against prompt injections and data leaks.",
                    "API Key Management: Securely handling environment variables in Vercel and AWS Secrets Manager.",
                    "Rate Limiting: Protecting your wallet from bot attacks using middleware and Fingerprinting.",
                    "Prompt Injection Defense: Implementing guardrails to prevent users from hijacking your system instructions.",
                    "Data Privacy (PII): Strategies for scrubbing sensitive user data before it hits external LLM providers."
                ],
                duration: "2.5 hours"
            }
        ],
        faqs: [
            {
                question: "Why should I use Serverless for AI instead of a dedicated GPU server?",
                answer: "Serverless is ideal for high-variability traffic. You only pay for what you use, avoiding the high cost of idle GPUs. It also allows for global scaling without complex infrastructure management."
            },
            {
                question: "Do I need to be an AWS expert?",
                answer: "No. We cover the essential AWS services (Lambda/Fargate) needed for AI, but also focus heavily on developer-friendly tools like Vercel and Cloudflare."
            },
            {
                question: "Will this help me reduce my OpenAI/Anthropic bills?",
                answer: "Yes, significantly. Module 2 is dedicated to cost optimization through caching, model routing, and token management."
            },
            {
                question: "Is this course practical or just theory?",
                answer: "It is 100% practical. You will be building and deploying real infrastructure throughout the course."
            }
        ],
        deliverables: [
            {
                title: "The Deployment Guide",
                description: "A step-by-step PDF checklist for moving from localhost to main.",
                icon: "Download"
            },
            {
                title: "Automation Scripts",
                description: "GitHub Actions workflows for CI/CD and automated infrastructure provisioning.",
                icon: "Terminal"
            },
            {
                title: "Boilerplate Repo",
                description: "A pre-configured Starter Kit featuring Next.js, Tailwind, and Cloudflare.",
                icon: "Code"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Deploy & Scale AI Apps (Serverless + Edge)",
        "description": "Master the transition from local AI prototype to global production. Learn to deploy on Vercel, AWS, and Cloudflare with a focus on cost optimization and edge performance.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs llp",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "courseCode": "AI-DEP-01",
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": "PT10H",
            "instructor": {
                "@type": "Person",
                "name": "Celoris AI Infrastructure Team",
                "description": "Specialist in AI Infrastructure and Serverless Architectures."
            }
        },
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "The Modern AI Stack",
                "description": "Vercel, AWS, and Cloudflare Edge infrastructure."
            },
            {
                "@type": "Syllabus",
                "name": "Cost & Performance",
                "description": "Model routing, token optimization, and global latency reduction."
            },
            {
                "@type": "Syllabus",
                "name": "Observability & Security",
                "description": "Monitoring AI flows and preventing prompt injections."
            }
        ],
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "price": "199.00",
            "priceCurrency": "USD"
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
                    <span className="text-slate-100 line-clamp-1">Deploy & Scale AI</span>
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
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Serverless AI</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Edge Computing</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Cost Optimization</span>
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
                                        src="/deploy-scale-ai-apps-cover.png"
                                        alt="Deploy & Scale AI Apps Course Cover"
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
                                    const icons: Record<string, any> = {
                                        Server,
                                        TrendingDown,
                                        Activity,
                                        ShieldCheck
                                    };
                                    const Icon = icons[chapter.icon] || BookOpen;
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
                                Deliverables & Outcomes
                            </h2>
                            <p className="text-slate-400 mb-8">
                                By the end of this course, you will have a production-ready toolkit to deploy and scale AI applications with confidence.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.deliverables.map((item, index) => {
                                    const icons: Record<string, any> = {
                                        Download,
                                        Terminal,
                                        Code
                                    };
                                    const Icon = icons[item.icon] || Bot;
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
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹15,000
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
                                                <span>2024-2025 Tech Stack (Edge/Serverless)</span>
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
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-2 border border-slate-700 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Team</h4>
                                            <p className="text-xs text-slate-400">Pioneering AI Architectures</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Expert engineering team specializing in AI Infrastructure and Serverless Architectures. We help developers bridge the gap from local prototype to global production.
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
