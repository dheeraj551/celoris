"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Layers, Filter, RefreshCw, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function RAGUnlockedCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "RAG Unlocked: Production-Grade Search & Answer Systems | Celoris Designs";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const desc = "Master the architecture of Enterprise LLM applications. Learn to build and deploy scalable Retrieval-Augmented Generation (RAG) systems using Pinecone, Milvus, and advanced embedding strategies.";
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
        title: "RAG Unlocked: Production-Grade Search & Answer Systems",
        subtitle: "Transition from simple \"Hello World\" tutorials to building scalable, enterprise-ready RAG pipelines.",
        description: "Enterprise AI is moving past chatty bots into Knowledge Management. Developers are no longer asking \"how do I use an API?\" but \"how do I make this work with 10,000 internal documents safely?\" This course answers the latter.",
        students: 850,
        rating: 4.9,
        duration: "10 hours",
        price: 15000, // Matching the price in the template or user request? User JSON-LD says 199 USD. 199 USD is approx 16000 INR. Let's use 15000 to be consistent with Agentic AI course or stick to 199 USD converted.
        // Actually, the user's JSON-LD says price: 199.00 and currency USD.
        // However, previous courses used INR. Let's stick to INR 15000 as per common pattern in this app unless specified otherwise.
        // Wait, the user provided JSON-LD has 199 USD. I should probably follow that or adapt to the platform's currency.
        // Looking at the template, Agentic AI was 15000 INR.
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/rag-unlocked-production-grade-search-answer-systems",
        learning_outcomes: [
            "Vector Database Implementation (Pinecone/Milvus)",
            "Embedding Model Selection & Optimization",
            "Production RAG Pipeline Orchestration",
            "RAG vs. Fine-tuning Trade-offs",
            "Hybrid Search & Reranking Techniques",
            "Advanced Chunking Strategies (Semantic & Recursive)",
            "Metadata Filtering for Precise Retrieval",
            "Query Expansion with LLMs",
            "Evaluation Frameworks (RAGAS / TruLens)",
            "Production Deployment with FastAPI"
        ],
        requirements: [
            "Basic proficiency in Python",
            "Understanding of LLM basics (OpenAI/Claude APIs)",
            "Familiarity with Vector Databases is a plus but not required",
            "Desire to build production-grade AI systems"
        ],
        chapters: [
            {
                number: 1,
                title: "The RAG Landscape & Architectural Foundations",
                icon: "Layers",
                topics: [
                    "Understanding why RAG is the backbone of Enterprise AI.",
                    "The Problem Space: Dealing with LLM hallucinations and data freshness.",
                    "RAG vs. Fine-Tuning: A cost-benefit analysis. When to update weights vs. context.",
                    "The Standard RAG Stack: Document loaders, splitters, embedders, and vector stores."
                ],
                videoUrl: "https://www.youtube.com/embed/WPLkuo2ZgZQ",
                duration: "2 hours"
            },
            {
                number: 2,
                title: "Deep Dive into Embeddings & Vector Representation",
                icon: "Cpu",
                topics: [
                    "Vector Embeddings 101: Converting text to high-dimensional math.",
                    "Choosing Your Model: OpenAI text-embedding-3 vs. open-source alternatives (HuggingFace, Cohere).",
                    "Chunking Strategies: Fixed-size vs. Semantic vs. Recursive Character splitting.",
                    "Dimensionality & Distance: Understanding Cosine Similarity, Euclidean Distance, and Dot Product."
                ],
                videoUrl: "https://www.youtube.com/embed/6Bs41TdnbGw",
                duration: "2 hours"
            },
            {
                number: 3,
                title: "Mastering the Vector Database (Pinecone & Milvus)",
                icon: "Database",
                topics: [
                    "Vector DB Landscape: Managed (Pinecone) vs. Self-hosted/Open-source (Milvus/Zilliz).",
                    "Indexing for Speed: HNSW (Hierarchical Navigable Small Worlds) vs. IVF (Inverted File Index).",
                    "Metadata Filtering: Combining semantic search with hard filters.",
                    "Upserting & Namespacing: Managing multi-tenant data environments."
                ],
                duration: "2 hours"
            },
            {
                number: 4,
                title: "The Retrieval Engine: Beyond Basic Search",
                icon: "Search",
                topics: [
                    "Hybrid Search: Combining Keyword (BM25) with Semantic (Vector) search.",
                    "Reranking: Using Cross-Encoders (like Cohere Rerank) to refine top-K results.",
                    "Query Expansion: Using the LLM to rewrite user queries for better retrieval.",
                    "Context Window Management: Balancing retrieval depth with token costs."
                ],
                duration: "2 hours"
            },
            {
                number: 5,
                title: "Putting RAG into Production",
                icon: "Server",
                topics: [
                    "The Orchestration Layer: Building with LangChain or LlamaIndex.",
                    "Evaluation Frameworks: Using RAGAS or TruLens to measure Faithfulness and Relevancy.",
                    "Caching Strategies: Using GPTCache to reduce LLM costs and latency.",
                    "Monitoring & Observability: Tracking retrieval quality in real-time."
                ],
                duration: "2 hours"
            }
        ],
        faqs: [
            {
                question: "Why should I use RAG instead of Fine-Tuning?",
                answer: "Fine-tuning is great for learning a specific style or tone, but it's hard to update with new data quickly. RAG allows your AI to access the most up-to-date information without constantly retraining the model."
            },
            {
                question: "Which Vector Database is best for starters?",
                answer: "Pinecone is excellent for starting due to its managed nature and ease of use. For larger, self-hosted enterprise needs, Milvus or Zilliz are powerful alternatives."
            },
            {
                question: "Do I need to be a math expert to understand embeddings?",
                answer: "No. While we cover the concepts of high-dimensional math, the focus is on practical implementation and choosing the right models for your data."
            },
            {
                question: "Is this course suitable for beginners?",
                answer: "This is an intermediate to advanced course. You should have a basic understanding of Python and how to use AI APIs before starting."
            }
        ],
        deliverables: [
            {
                title: "FastAPI Backend",
                description: "A production-ready API connected to a vector database.",
                icon: "Server"
            },
            {
                title: "Hybrid Pipeline",
                description: "Semantic search combined with keyword filtering and re-ranking.",
                icon: "RefreshCw"
            },
            {
                title: "Evaluation Script",
                description: "Automated framework to measure search accuracy and relevancy.",
                icon: "Activity"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "RAG Unlocked: Production-Grade Search & Answer Systems",
        "description": "Master the architecture of Enterprise LLM applications. Learn to build and deploy scalable Retrieval-Augmented Generation (RAG) systems using Pinecone, Milvus, and advanced embedding strategies.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "courseCode": "RAG-PRO-01",
        "educationalLevel": "Intermediate to Advanced",
        "teaches": [
            "Vector Database Implementation (Pinecone/Milvus)",
            "Embedding Model Selection & Optimization",
            "Production RAG Pipeline Orchestration",
            "RAG vs. Fine-tuning Trade-offs",
            "Hybrid Search & Reranking Techniques"
        ],
        "occupationalCredentialAwarded": "Deployable RAG Engine Portfolio Project",
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": "PT10H",
            "instructor": {
                "@type": "Person",
                "name": "Celoris AI Team",
                "jobTitle": "AI Engineers"
            }
        },
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "priceCurrency": "USD",
            "price": "199.00",
            "availability": "https://schema.org/InStock"
        },
        "keywords": "RAG, LLM, Vector DB, Pinecone, Milvus, Semantic Search, AI Engineering, Production AI"
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
                    <span className="text-slate-100 line-clamp-1">RAG Unlocked</span>
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
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Enterprise RAG</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Vector DB</span>
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
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/WPLkuo2ZgZQ"
                                        title="RAG Unlocked: Production-Grade Search & Answer Systems"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        className="w-full h-full"
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
                                    const icons: Record<string, any> = {
                                        Layers,
                                        Cpu,
                                        Database,
                                        Search,
                                        Server
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
                                Project: The \"Enterprise-Ready\" RAG Engine
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Students will deploy a fully functional RAG system that includes a FastAPI backend, hybrid search pipeline, and automated evaluation scripts.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.deliverables.map((item, index) => {
                                    const icons: Record<string, any> = {
                                        Server,
                                        RefreshCw,
                                        Activity
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
                                                <span>2024-2025 Tech Stack (Pinecone/Milvus)</span>
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
                                            <h4 className="font-bold text-white">Celoris Team</h4>
                                            <p className="text-xs text-slate-400">Pioneering AI Architectures</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Expert engineering team specializing in Retrieval-Augmented Generation and enterprise-grade LLM applications. We help developers bridge the gap from prototype to production.
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
