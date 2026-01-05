"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, TrendingUp, DollarSign, Rocket, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function BuildAIProductsCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Build AI Products That Make Money (Practical Guide) | Monetize Your AI Apps";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Stop building cool demos. Start building profitable businesses. A blueprint for validating, launching, and monetizing AI tools.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Stop building cool demos. Start building profitable businesses. A blueprint for validating, launching, and monetizing AI tools.';
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "Build AI Products That Make Money (Practical Guide)",
        subtitle: "Stop building cool demos. Start building profitable businesses. A blueprint for validating, launching, and monetizing AI tools.",
        description: "Most AI projects die in the \"cool prototype\" phase. This course teaches the missing half of the equation: the business strategy. We provide a step-by-step framework to identify genuine market needs, validate them before writing a single line of code, structure pricing that guarantees profit margins, and acquire your first 100 paying customers.",
        students: 850,
        rating: 4.9,
        duration: "12 hours",
        price: 15000,
        currency: "INR",
        provider: "Celoris designs llp",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/build-ai-products-that-make-money-practical-guide",
        learning_outcomes: [
            "Avoid the 'AI Hammer' Trap: Why starting with 'I want to use GPT-4' fails.",
            "Techniques for mining Reddit, G2, and forums for expensive, boring problems.",
            "Run 'Smoke Test' pre-sale campaigns to gauge willingness to pay.",
            "Define your MSP (Minimum Sellable Product) beyond the traditional MVP.",
            "Anatomy of high-converting AI SaaS landing pages focused on outcomes.",
            "Master 'Token Tax' and unit economics to ensure profit margins.",
            "Implement Credit-Based, Hybrid Tier, and BYOK pricing models.",
            "Tactical checklist for Product Hunt, Hacker News, and niche launches.",
            "Programmatic SEO: Using LLMs ethically to attract organic search traffic.",
            "Building in Public: Leveraging X and LinkedIn for day-one traction."
        ],
        requirements: [
            "Basic understanding of AI/LLM capabilities",
            "No advanced coding required (though helpful)",
            "Entrepreneurial mindset and willingness to validate ideas",
            "A desire to build a sustainable business, not just a tool"
        ],
        chapters: [
            {
                number: 1,
                title: "Idea Validation & Market Signals",
                icon: "Target",
                topics: [
                    "The AI Hammer Trap: Pain-first vs. Tech-first development.",
                    "Mining Pain Points: Reddit, G2 reviews, and industry forums research.",
                    "Competitive Analysis: Differentiating via vertical integration.",
                    "The Smoke Test: Running pre-sale campaigns and fake door tests."
                ],
                duration: "3 hours"
            },
            {
                number: 2,
                title: "The Pitch, The Page, and The MSP",
                icon: "Zap",
                topics: [
                    "Defining the MSP: Minimal feature set that people will pay for.",
                    "High-Converting Landing Pages: Anatomy of an outcome-focused SaaS page.",
                    "The Waitlist Fallacy: When to collect emails vs. demanding payment.",
                    "Rapid Deployment Tools: Levering Framer, Webflow, or Carrd."
                ],
                duration: "3 hours"
            },
            {
                number: 3,
                title: "AI Pricing Models & Unit Economics",
                icon: "DollarSign",
                topics: [
                    "The Token Tax Reality: Navigating high API costs.",
                    "Pricing Architectures: Credit-Based vs. Hybrid Tiers vs. BYOK.",
                    "Protecting Your Margins: Hard caps, rate limiting, and caching.",
                    "Modeling Profitability: API costs vs. user revenue calculations."
                ],
                duration: "3 hours"
            },
            {
                number: 4,
                title: "User Growth & The First 100 Customers",
                icon: "TrendingUp",
                topics: [
                    "The Launch Sequence: Product Hunt, Hacker News, and Niche Communities.",
                    "Programmatic SEO with AI: Ethical long-tail content generation.",
                    "Influencer & Affiliate Strategy: Approaching AI space creators.",
                    "Building in Public: Strategy for X (Twitter) and LinkedIn."
                ],
                duration: "3 hours"
            }
        ],
        faqs: [
            {
                question: "Do I need to be a developer to take this course?",
                answer: "No. While having technical skills is a plus for building the product, this course focuses on the business strategy, validation, and marketing. We cover tools that allow non-technical founders to launch MVPs."
            },
            {
                question: "Is this course relevant for B2B or B2C?",
                answer: "Both. We cover strategies for finding pain points in niche industries (B2B) as well as mass-market consumer tools (B2C)."
            },
            {
                question: "Will I learn how to build an AI app?",
                answer: "The focus is on the 'Minimum Sellable Product'. We discuss the architecture and tools for rapid deployment, but the primary goal is business validation and monetization."
            },
            {
                question: "What is GEO (Generative Engine Optimization)?",
                answer: "GEO is the 2026 standard for ensuring your product is discoverable by AI search engines and LLM crawlers. We include structured data strategies for this."
            }
        ],
        deliverables: [
            {
                title: "Monetization Roadmap",
                description: "4-stage timeline from Idea to $1k MRR.",
                icon: "Rocket"
            },
            {
                title: "Validation Checklist",
                description: "10-point scorecard to determine idea viability.",
                icon: "CheckCircle"
            },
            {
                title: "Pricing Calculator",
                description: "Template to model API costs vs. revenue.",
                icon: "BarChart"
            },
            {
                title: "Launch Day Swipe File",
                description: "Templates for emails, social posts, and announcements.",
                icon: "Mail"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Build AI Products That Make Money",
        "description": "A practical guide for entrepreneurs to identify AI ideas, validate market demand, and launch profitable AI SaaS products.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris  designs llp",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "courseCode": "AI-BIZ-2026",
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "instructor": {
                "@type": "Person",
                "name": "Expert Name",
                "description": "AI Product Strategist and Multi-exit Founder."
            }
        },
        "educationalCredentialAwarded": "AI Product Monetization Certificate",
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "Idea Validation",
                "description": "Reddit mining and pre-sale strategies to prove demand."
            },
            {
                "@type": "Syllabus",
                "name": "Pricing & Economics",
                "description": "Credit-based vs subscription models for AI token management."
            }
        ],
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "price": "15000",
            "priceCurrency": "INR"
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
                    <span className="text-slate-100 line-clamp-1">Build AI Products That Make Money</span>
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
                                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Monetization</span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">SaaS Blueprint</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Business Strategy</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-amber-200">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-amber-400/90 font-medium">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Image with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src="/build-ai-products-cover.png"
                                        alt="Build AI Products That Make Money"
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
                                <div className="p-2 bg-amber-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-amber-400" />
                                </div>
                                What You Will Master
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-amber-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-amber-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-amber-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Course Curriculum */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-emerald-400" />
                                </div>
                                Curriculum Overview
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Target" ? Target :
                                        chapter.icon === "Zap" ? Zap :
                                            chapter.icon === "DollarSign" ? DollarSign : TrendingUp;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-amber-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
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
                                                    <div className="h-px bg-gradient-to-r from-amber-500/30 to-transparent mb-4"></div>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-500/40 mt-2 group-hover:bg-amber-500 transition-colors" />
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
                                    <Rocket className="h-6 w-6 text-blue-400" />
                                </div>
                                Deliverables & Actionable Toolkit
                            </h2>
                            <p className="text-slate-400 mb-8">
                                By the end of this course, you will leave with professional-grade assets to launch and scale your AI business.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {courseData.deliverables.map((item, index) => {
                                    const Icon = item.icon === "Rocket" ? Rocket :
                                        item.icon === "CheckCircle" ? CheckCircle :
                                            item.icon === "BarChart" ? BarChart : Mail;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-amber-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-amber-400" />
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
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-emerald-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹{courseData.price}
                                            </div>
                                            <div className="text-amber-400 font-bold tracking-widest uppercase text-xs">Full Lifetime Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-white rounded-2xl shadow-lg shadow-amber-500/25 transition-all active:scale-95"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-amber-400" />
                                                <span>Professional Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Code className="h-5 w-5 text-emerald-400" />
                                                <span>Monetization Templates</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-blue-400" />
                                                <span>Exclusive Founder Community</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>2026 Tech Stack (GEO Ready)</span>
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
                                            <p className="text-xs text-slate-400">AI Product Strategists</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Expert engineering team specializing in AI product development and market monetization. We help founders transition from ideas to profitable SaaS.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
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
                                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500/40 mt-1.5 flex-shrink-0" />
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
