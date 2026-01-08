"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, Microscope, FlaskConical, Dna, Atom, Binary } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AcceleratingScienceCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Accelerating Science: Generative AI for Research & Innovation | IntuitionLabs";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Equip scientists and research engineers with tactical skills to integrate advanced AI agents into the scientific method. From literature review to experiment automation.";
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
        title: "Accelerating Science",
        subtitle: "Generative AI for Research & Innovation",
        description: "Presented by IntuitionLabs. To equip scientists and research engineers with the tactical skills to integrate advanced AI agents (GPT-4o, Claude 3.5, and upcoming GPT-5 class models) into the scientific method—from accelerating literature review to automating experiment protocols and predicting molecular properties.",
        students: 1250,
        rating: 4.98,
        duration: "8-Week Intensive",
        price: 24999,
        currency: "INR",
        provider: "IntuitionLabs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/accelerating-science-generative-ai-for-research-innovation",
        learning_outcomes: [
            "Integrate advanced AI agents (GPT-4o, Claude 3.5) into the scientific method.",
            "Accelerate literature reviews using semantic search and knowledge graphs.",
            "Automate experiment protocols and liquid handling robot scripts.",
            "Predict molecular properties and design de novo proteins.",
            "Build autonomous research agents and 'Self-Driving Labs'.",
            "Master AI-driven data analysis for messy lab exports.",
            "Navigate ethics, hallucinations, and IP in AI-driven science.",
            "Translate vague goals into optimized wet lab protocols.",
            "Screen libraries of small molecules using virtual AI pipelines.",
            "Automate microscopy and cell counting with vision models."
        ],
        requirements: [
            "Background in Science (Biology, Chemistry, Materials) or Research Engineering",
            "Basic understanding of lab protocols and experimental design",
            "Interest in leveraging AI to accelerate R&D workflows",
            "No prior coding experience required (we use low-code tools)"
        ],
        chapters: [
            {
                number: 1,
                title: "The New Research Assistant – LLMs as Scientific Reasoning Engines",
                icon: "Microscope",
                topics: [
                    "Architecture of Transformer models in the context of scientific data (Text vs. Sequences vs. SMILES).",
                    "Prompt Engineering for Scientists: Chain-of-Thought (CoT) prompting for complex problem solving.",
                    "Lab: Setting up a secure, local RAG system to 'chat' with 1,000+ PDFs of internal lab data."
                ],
                duration: "Week 1"
            },
            {
                number: 2,
                title: "Automated Literature Review & Hypothesis Generation",
                icon: "BookOpen",
                topics: [
                    "Using Semantic Search to find connections between disparate papers.",
                    "Knowledge Graphs: Extracting entities (proteins, chemicals, metrics) from unstructured text.",
                    "Case Study: How AI predicted new battery materials by reading 2 million abstracts.",
                    "Lab: Build a 'Hypothesis Generator' agent that proposes novel research directions."
                ],
                duration: "Week 2"
            },
            {
                number: 3,
                title: "Generative Design of Experiments (DoE) & Protocols",
                icon: "FlaskConical",
                topics: [
                    "Translating vague scientific goals into step-by-step wet lab protocols.",
                    "Optimizing reagent concentrations and incubation times using Bayesian Optimization + LLMs.",
                    "Troubleshooting: Feeding error logs and failed gel images to AI for root-cause analysis.",
                    "Lab: Use an LLM to generate a Python script for an Opentrons liquid handling robot."
                ],
                duration: "Week 3"
            },
            {
                number: 4,
                title: "AI for Biotech – Sequences and Structure",
                icon: "Dna",
                topics: [
                    "Beyond AlphaFold: Understanding Protein Language Models (ESM-2, ProGen).",
                    "De Novo Protein Design: Generating sequences that do not exist in nature.",
                    "CRISPR guide RNA design using deep learning models."
                ],
                duration: "Week 4"
            },
            {
                number: 5,
                title: "AI for Material Science & Chemistry",
                icon: "Atom",
                topics: [
                    "Inverse Design: Inputting desired properties to output molecular structures.",
                    "SMILES strings and Molecular Graphs representation.",
                    "Predicting synthesis pathways (Retrosynthesis) with AI."
                ],
                duration: "Week 5"
            },
            {
                number: 6,
                title: "Autonomous Agents & Self-Driving Labs",
                icon: "Bot",
                topics: [
                    "Agentic Workflows: Building AI agents that browse the web and write code autonomously.",
                    "The 'Closed Loop' Lab: AI predicts → Robot executes → AI learns → Repeat.",
                    "Lab: Simulate a closed-loop optimization cycle for a chemical reaction."
                ],
                duration: "Week 6"
            },
            {
                number: 7,
                title: "Data Analysis & The 'Code Interpreter' Workflow",
                icon: "Binary",
                topics: [
                    "Using Advanced Data Analysis (Code Interpreter) to clean messy Excel data and run statistical tests.",
                    "Automating image analysis (microscopy, cell counting) using Vision Models.",
                    "Generating publication-ready plots and statistical summaries."
                ],
                duration: "Week 7"
            },
            {
                number: 8,
                title: "Ethics, Hallucinations & Reproducibility",
                icon: "Shield",
                topics: [
                    "The Hallucination Problem: Why models invent citations and how to stop it (Grounding).",
                    "Bias in training data (e.g., Western-centric medical data).",
                    "Intellectual Property: Who owns an AI-discovered drug?"
                ],
                duration: "Week 8"
            }
        ],
        faqs: [
            {
                question: "Do I need to know Python for this course?",
                answer: "While we touch on Python scripts for robots, the course is designed for 'No-code/Low-code' data science. We focus on directing AI to write the code for you."
            },
            {
                question: "Is this course relevant for Wet Lab scientists?",
                answer: "Absolutely. Module 3 and 7 are specifically designed to reduce time spent on manual protocol design and data cleaning for wet lab environments."
            },
            {
                question: "What models will we use?",
                answer: "We use a mix of GPT-4o, Claude 3.5 Sonnet, and specialized open-source models like ESM-2 for proteins and SMILES-based transformers for chemistry."
            },
            {
                question: "Will this help with grant writing?",
                answer: "Yes, one of our capstone projects is the 'Grant Writer Bot', where you'll learn to fine-tune models on successful applications."
            }
        ],
        projects: [
            {
                title: "The Grant Writer Bot",
                description: "Fine-tune a model on successful grant applications to draft methodology sections.",
                tools: "Claude 3.5 + Custom RAG",
                icon: "Mail"
            },
            {
                title: "The Protocol Optimizer",
                description: "Build a tool that identifies failure points in lab protocols based on chemical properties.",
                tools: "GPT-4o + SMILES Integration",
                icon: "FlaskConical"
            },
            {
                title: "The Virtual Screener",
                description: "A pipeline that screams a library of small molecules for binding affinity to a target protein.",
                tools: "ESM-2 + AutoDock AI",
                icon: "Dna"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Accelerating Science: Generative AI for Research & Innovation",
        "description": "Equip scientists and research engineers with tactical AI skills for literature review, experiment automation, and molecular prediction.",
        "provider": {
            "@type": "Organization",
            "name": "IntuitionLabs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Advanced",
        "teaches": [
            "Scientific AI Prompting",
            "Automated Literature Review",
            "Generative Protocol Design",
            "Protein Language Models",
            "Self-Driving Lab Workflows",
            "AI-Driven Microscopy Analysis"
        ]
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
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
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
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Generative AI</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Scientific Research</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">IntuitionLabs</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-medium">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Image with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src="/accelerating-science-generative-ai-cover.png"
                                        alt="Accelerating Science: AI for Research"
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

                        {/* Core Mission */}
                        <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                            <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
                                <Zap className="h-5 w-5" />
                                Course Mission
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                                To equip scientists and research engineers with the tactical skills to integrate advanced AI agents into the scientific method—from accelerating literature review to automating experiment protocols and predicting molecular properties.
                            </p>
                        </div>

                        {/* Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                                </div>
                                What You Will Master
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-emerald-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-emerald-400" />
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
                                    <BookOpen className="h-6 w-6 text-blue-400" />
                                </div>
                                Curriculum Overview (8-Week Intensive)
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Microscope" ? Microscope :
                                        chapter.icon === "BookOpen" ? BookOpen :
                                            chapter.icon === "FlaskConical" ? FlaskConical :
                                                chapter.icon === "Dna" ? Dna :
                                                    chapter.icon === "Atom" ? Atom :
                                                        chapter.icon === "Bot" ? Bot :
                                                            chapter.icon === "Binary" ? Binary : Shield;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
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
                                                    <div className="h-px bg-gradient-to-r from-emerald-500/30 to-transparent mb-4"></div>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 mt-2 group-hover:bg-emerald-500 transition-colors" />
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
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Bot className="h-6 w-6 text-purple-400" />
                                </div>
                                Capstone Projects
                            </h2>
                            <p className="text-slate-400 mb-8">
                                Choose one track to build a portfolio-ready asset that demonstrates your mastery of AI in R&D.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "Mail" ? Mail : item.icon === "FlaskConical" ? FlaskConical : Dna;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-emerald-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center h-full flex flex-col">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-emerald-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-slate-400 mb-4 flex-grow">{item.description}</p>
                                                <div className="text-xs font-mono bg-slate-950/50 p-2 rounded border border-slate-700 text-emerald-500">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Why This Course Sells */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <FlaskConical className="h-24 w-24 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Why This Course?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-emerald-400">Immediate ROI</h4>
                                    <p className="text-sm text-slate-300">Save hours of manual labor in reading, pipetting planning, and coding immediately.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-emerald-400">The Modern Scientist</h4>
                                    <p className="text-sm text-slate-300">Position yourself as one who commands AI rather than being replaced by it.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-emerald-400">Industry Demand</h4>
                                    <p className="text-sm text-slate-300">Pharma and Biotech companies are aggressively hiring 'AI Leads' for wet labs.</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-emerald-400">Future-Proof Skills</h4>
                                    <p className="text-sm text-slate-300">Shift from Hypotheses to Protocols in seconds using the latest model classes.</p>
                                </div>
                            </div>
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
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹{courseData.price}
                                            </div>
                                            <div className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Full 8-Week Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-400 hover:to-blue-500 text-white rounded-2xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-emerald-400" />
                                                <span>Professional Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Microscope className="h-5 w-5 text-purple-400" />
                                                <span>Wet Lab Protocol Templates</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Database className="h-5 w-5 text-blue-400" />
                                                <span>Scientific RAG Infrastructure</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Users className="h-5 w-5 text-orange-400" />
                                                <span>R&D AI Networking Community</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Presented by</div>
                                    <CardTitle className="text-xl text-white italic tracking-tight">IntuitionLabs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 p-2 border border-slate-700 flex items-center justify-center">
                                            <Microscope className="h-8 w-8 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">IntuitionLabs</h4>
                                            <p className="text-xs text-slate-400">Pioneering AI in Science</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Specifically focused on the intersection of LLMs, Robotics, and Bench Science. We bridge the gap between AI engineering and wet lab innovation.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                                            <span className="font-bold">{courseData.rating}</span>
                                            <span className="text-slate-500">({courseData.students}+)</span>
                                        </div>
                                        <div className="text-slate-400">
                                            {courseData.duration}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prerequisites */}
                            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-yellow-400" />
                                    Target Profile
                                </h3>
                                <ul className="space-y-3">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
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
