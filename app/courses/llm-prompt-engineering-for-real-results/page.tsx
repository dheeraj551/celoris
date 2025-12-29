"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, Brain, MessageSquare, Layers } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function LLMPromptEngineeringCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "LLM Prompt Engineering for Real Results | Master Advanced Prompting";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Master advanced prompt strategies and custom model fine-tuning. Learn to build production-ready AI apps with a focus on ROI and performance.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Master advanced prompt strategies and custom model fine-tuning. Learn to build production-ready AI apps with a focus on ROI and performance.';
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "LLM Prompt Engineering for Real Results",
        subtitle: "Master Advanced Prompting & Custom Model Tuning for Production-Ready Applications.",
        description: "Stop \"chatting\" with AI and start engineering it. This course moves beyond basic instructions to help you build robust, predictable, and scalable LLM implementations. You will learn to bridge the gap between a prompt that \"sometimes works\" and a system that delivers consistent, high-quality output for real-world apps.",
        students: 850,
        rating: 4.9,
        duration: "12 hours",
        price: 499,
        currency: "USD",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/llm-prompt-engineering-for-real-results",
        learning_outcomes: [
            "Move beyond \"Act as a...\" to multi-variable framing.",
            "Use few-shot & many-shot learning to force model alignment.",
            "Ensure LLMs return valid JSON/Markdown every single time.",
            "Manage prompts as code in a production environment.",
            "Implement Zero-Shot CoT and Self-Consistency strategies.",
            "Build reflection loops where the AI critiques its own output.",
            "Optimize RAG (Retrieval-Augmented Generation) context windows.",
            "Reduce costs and latency with Token Optimization.",
            "Create high-quality JSONL training pairs for fine-tuning.",
            "Validate tuned models using BLEU, ROUGE, and \"LLM-as-a-judge\"."
        ],
        requirements: [
            "Basic understanding of AI and LLMs",
            "Familiarity with JSON and data structures",
            "Basic coding knowledge (Python/JavaScript helper)",
            "Access to an LLM API (OpenAI, Anthropic, or similar)"
        ],
        chapters: [
            {
                number: 1,
                title: "Strategic Prompt Architecture",
                icon: "Layers",
                topics: [
                    "The Anatomy of a Perfect Prompt: Moving beyond basic instructions.",
                    "Few-Shot & Many-Shot Learning: Pattern recognition for alignment.",
                    "Delimiters & Structured Output: Valid JSON/Markdown guarantee.",
                    "Prompt Versioning: Managing prompts as code."
                ],
                duration: "3 hours"
            },
            {
                number: 2,
                title: "Reasoning & Chain-of-Thought (CoT)",
                icon: "Brain",
                topics: [
                    "Zero-Shot CoT: The \"Let’s think step-by-step\" method.",
                    "Self-Consistency & Tree of Thoughts: Complex logic strategies.",
                    "Automated Reasoning: Reflection loops for self-critique.",
                    "Debugging Logic: Identifying hallucinations in reasoning."
                ],
                duration: "3 hours"
            },
            {
                number: 3,
                title: "Context Engineering & Token Management",
                icon: "Database",
                topics: [
                    "The Context Window Challenge: RAG vs. Long-Context models.",
                    "Token Optimization: Reducing costs without sacrificing quality.",
                    "Information Density: Semantic compression techniques.",
                    "Window Sliding: Managing long-form conversations."
                ],
                duration: "3 hours"
            },
            {
                number: 4,
                title: "Fine-Tuning Essentials",
                icon: "Cpu",
                topics: [
                    "When to Tune vs. When to Prompt: Cost-benefit analysis.",
                    "Dataset Curation: Creating high-quality JSONL training pairs.",
                    "PEFT & LoRA: Parameter-Efficient Fine-Tuning basics.",
                    "Evaluation Metrics: BLEU, ROUGE, and LLM-as-a-judge."
                ],
                duration: "3 hours"
            }
        ],
        faqs: [
            {
                question: "Is this course for beginners?",
                answer: "This course is designed for intermediate to advanced learners. While we cover some foundations, we quickly move to production-grade strategies."
            },
            {
                question: "Do I need to know how to code?",
                answer: "Basic coding knowledge is recommended to implement the concepts in a real application, but the core focus is on the engineering of the prompts and logic."
            },
            {
                question: "Which models do you use?",
                answer: "The principles apply to all major LLMs (GPT-4, Claude 3, Llama 3, Gemini). We focus on universal patterns."
            },
            {
                question: "What is the fine-tuning project?",
                answer: "You will prepare a dataset and walk through the process of fine-tuning a specialized model variant using PEFT/LoRA techniques."
            }
        ],
        deliverables: [
            {
                title: "Master Prompt Library",
                description: "A plug-and-play collection of production-tested templates for 10+ industries.",
                icon: "Code"
            },
            {
                title: "Fine-Tuning Capstone",
                description: "A documented project where you prepare, train, and deploy a specialized model.",
                icon: "Cpu"
            },
            {
                title: "LLM Performance Dashboard",
                description: "A framework for tracking accuracy, latency, and cost per request.",
                icon: "BarChart"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "LLM Prompt Engineering for Real Results",
        "description": "Master advanced prompt strategies and custom model fine-tuning. Learn to build production-ready AI apps with a focus on ROI and performance.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "courseCode": "PROMPT-ENG-2024",
        "educationalLevel": "Intermediate to Advanced",
        "about": [
            "Large Language Models",
            "Prompt Engineering",
            "Fine-tuning",
            "Token Management"
        ],
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "Prompt Architecture",
                "description": "Strategic framing and multi-variable prompt engineering."
            },
            {
                "@type": "Syllabus",
                "name": "Chain-of-Thought (CoT)",
                "description": "Implementing logic loops and automated reasoning."
            },
            {
                "@type": "Syllabus",
                "name": "Fine-Tuning Essentials",
                "description": "Dataset curation and PEFT/LoRA implementation."
            },
            {
                "@type": "Syllabus",
                "name": "Token & Context Management",
                "description": "Optimizing RAG and reducing inference costs."
            }
        ],
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "price": "499.00",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        },
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "educationalCredentialAwarded": "Certificate of LLM Engineering Mastery"
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
                    <span className="text-slate-100 line-clamp-1">LLM Prompt Engineering</span>
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
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Prompt Engineering</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Fine-Tuning</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Production AI</span>
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
                                        src="/llm-prompt-engineering-cover.png"
                                        alt="LLM Prompt Engineering"
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
                                    const Icon = chapter.icon === "Layers" ? Layers :
                                        chapter.icon === "Brain" ? Brain :
                                            chapter.icon === "Database" ? Database : Cpu;
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
                                Real Results Guarantee
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Every module concludes with a &quot;Production Stress Test&quot; to ensure your solutions don&apos;t break in the real world. You will build tangible assets.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.deliverables.map((item, index) => {
                                    const Icon = item.icon === "Code" ? Code : item.icon === "Cpu" ? Cpu : BarChart;
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
                                                ${courseData.price}
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
                                                <span>Certificate of Mastery</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Code className="h-5 w-5 text-purple-400" />
                                                <span>Prompt Templates</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-blue-400" />
                                                <span>Private Discord</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>Production Ready Strategies</span>
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
                                            <h4 className="font-bold text-white">{courseData.provider}</h4>
                                            <p className="text-xs text-slate-400">Pioneering Agentic Workflows</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Expert engineering team specializing in multi-agent orchestration and autonomous LLM workflows.
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
