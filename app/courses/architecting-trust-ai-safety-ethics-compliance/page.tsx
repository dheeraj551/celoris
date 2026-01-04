"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Shield, Eye, Scale, AlertTriangle, ShieldCheck, Lock, Binary, FileText, Gavel, BarChart3, RotateCcw, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ArchitectingTrustCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Architecting Trust: AI Safety, Ethics & Compliance | Celoris Designs";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Master the frameworks, tools, and legal requirements necessary to deploy predictable, compliant, and ethical AI systems for the modern enterprise.";
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
        title: "Architecting Trust: AI Safety, Ethics & Compliance",
        subtitle: "Building Robust and Regulated AI Systems for the Modern Enterprise",
        description: "This program provides a 360-degree view of the AI lifecycle through the lens of safety and ethics. Participants will move beyond 'AI hype' to master the frameworks, tools, and legal requirements necessary to deploy AI that is not only powerful but also predictable and compliant.",
        students: 1240,
        rating: 4.95,
        duration: "6-8 Weeks (Self-paced)",
        price: 21999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/architecting-trust-ai-safety-ethics-compliance",
        learning_outcomes: [
            "Identify and mitigate algorithmic bias using state-of-the-art technical remediation.",
            "Implement Explainable AI (XAI) libraries (SHAP, LIME) into production pipelines.",
            "Navigate complex regulatory landscapes like the EU AI Act and NIST AI RMF.",
            "Protect AI systems against adversarial attacks like prompt injection and data poisoning.",
            "Establish cross-functional AI oversight boards and incident response protocols.",
            "Quantify the 'Ethical ROI' and treat trust as a competitive advantage."
        ],
        requirements: [
            "Basic understanding of Machine Learning concepts",
            "Familiarity with Python (for technical modules)",
            "Interest in AI Governance and Corporate Compliance",
            "No advanced Math PhD required"
        ],
        chapters: [
            {
                number: 1,
                title: "The Foundations of Trustworthy AI",
                icon: "Shield",
                topics: [
                    "The Trust Gap: Why consumers and regulators are wary of 'Black Box' systems.",
                    "Defining the Pillars: Fairness, Robustness, Explainability, and Privacy.",
                    "The Cost of Failure: Case studies on algorithmic bias and security breaches.",
                    "Alignment: Ensuring AI objectives match human values and corporate ROI."
                ],
                duration: "1 Week"
            },
            {
                number: 2,
                title: "Bias Detection & Mitigation (Technical)",
                icon: "Binary",
                topics: [
                    "Identifying Bias: Historical, representation, and measurement bias in training data.",
                    "Technical Remediation: Pre-processing (re-weighing), In-processing (adversarial de-biasing), Post-processing (equalized odds).",
                    "Tooling: Hands-on with Fairlearn, AIF360, and Google’s What-If Tool."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 3,
                title: "Explainable AI (XAI) & Interpretability",
                icon: "Eye",
                topics: [
                    "The Interpretability Spectrum: Global vs. Local explainability.",
                    "Glass-Box Models: Prioritizing decision trees and linear models over Deep Learning.",
                    "Post-hoc Explanations: Implementing SHAP and LIME architectures.",
                    "Stakeholder Communication: Translating feature importance for non-technical auditors."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 4,
                title: "Privacy, Security & Adversarial Robustness",
                icon: "Lock",
                topics: [
                    "Data Privacy: Techniques for Differential Privacy and Federated Learning.",
                    "Adversarial AI: Protecting against prompt injection and model inversion.",
                    "Red Teaming: Organizing internal 'attack teams' to find vulnerabilities.",
                    "Anonymization vs. Pseudonymization: Practical data governance for LLMs."
                ],
                duration: "1 Week"
            },
            {
                number: 5,
                title: "The Regulatory Landscape & AI Governance",
                icon: "Gavel",
                topics: [
                    "The EU AI Act: Navigating High-risk vs. Low-risk systems.",
                    "NIST AI Risk Management Framework: The Gold Standard for governance.",
                    "Audit Trails: Documentation for model cards, data cards, and transparency.",
                    "Liability Models: Who is responsible when the AI makes a mistake?"
                ],
                duration: "1 Week"
            },
            {
                number: 6,
                title: "Operationalizing Ethics (The Roadmap)",
                icon: "Activity",
                topics: [
                    "The Ethics Committee: Building a cross-functional AI oversight board.",
                    "Incident Response: Creating a 'Kill Switch' and roll-back protocols.",
                    "Continuous Monitoring: Tracking drift and bias in production environments.",
                    "Ethical ROI: Quantifying trust as a competitive advantage."
                ],
                duration: "1 Week"
            }
        ],
        projects: [
            {
                title: "The Bias Audit Lab",
                description: "Clean a 'toxic' dataset to meet fairness metrics using Fairlearn.",
                tools: "Python + Fairlearn + AIF360",
                icon: "Binary"
            },
            {
                title: "The Policy Workshop",
                description: "Draft a 'Company AI Ethics Charter' for Healthcare or Finance.",
                tools: "Framework: NIST AI RMF",
                icon: "FileText"
            },
            {
                title: "Adversarial Simulation",
                description: "Attempt to 'break' a model in a sandboxed environment to find injection flaws.",
                tools: "Red Teaming Toolkit",
                icon: "AlertTriangle"
            }
        ],
        faqs: [
            {
                question: "Is this course only for lawyers and compliance officers?",
                answer: "Not at all. While essential for compliance, Module 2 and 3 are highly technical and designed for Engineers and Data Scientists who need to implement these safeguards in code."
            },
            {
                question: "Will I get a certificate?",
                answer: "Yes, upon completion of the 'Bias Audit' and 'Policy Workshop' projects, you will receive a Professional Certification in AI Safety & Governance."
            },
            {
                question: "Does this cover the latest LLM safety issues?",
                answer: "Yes, we have dedicated sections on prompt injection, jailbreaking LLMs, and Hallucination mitigation strategies."
            },
            {
                question: "Is this based on US or EU laws?",
                answer: "Both. We cover the EU AI Act (the most comprehensive law) and the NIST framework (the US standard), as most global companies must comply with both."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Architecting Trust: AI Safety, Ethics & Compliance",
        "description": "Master AI safety, bias mitigation, and regulatory compliance for modern enterprises.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Intermediate to Advanced",
        "teaches": [
            "AI Bias Detection",
            "Explainable AI (XAI)",
            "EU AI Act Compliance",
            "Adversarial Robustness",
            "AI Governance Frameworks",
            "Model Interpretability"
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-gold-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-gold-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-gold-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-gold-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-gold-400 mb-6 transition-all group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-gold-500/10 text-gold-400 border border-gold-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">AI Ethics</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Compliance</span>
                                <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">AI Safety</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-gold-200">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-gold-400/90 font-medium">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview Image */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-gold-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <img
                                        src="/architecting-trust-ai-safety-cover.png"
                                        alt="Architecting Trust Course Cover"
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

                        {/* Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-gold-500/20 rounded-lg">
                                    <ShieldCheck className="h-6 w-6 text-gold-400" />
                                </div>
                                Core Learning Outcomes
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 hover:border-gold-500/30 transition-colors group">
                                        <div className="h-5 w-5 rounded-full bg-gold-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gold-500/20 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-gold-400" />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-blue-400" />
                                </div>
                                Curriculum Overview
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Shield" ? Shield :
                                        chapter.icon === "Binary" ? Binary :
                                            chapter.icon === "Eye" ? Eye :
                                                chapter.icon === "Lock" ? Lock :
                                                    chapter.icon === "Gavel" ? Gavel : Activity;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-slate-700/50 bg-slate-900/40 rounded-xl px-2 overflow-hidden">
                                            <AccordionTrigger className="hover:no-underline py-6">
                                                <div className="flex items-center gap-4 text-left w-full">
                                                    <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shadow-inner">
                                                        <Icon className="h-6 w-6 text-gold-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xs font-bold text-gold-500 uppercase tracking-widest mb-1">Module {chapter.number}</div>
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
                                                    <div className="h-px bg-gradient-to-r from-gold-500/30 to-transparent mb-4"></div>
                                                    <ul className="grid grid-cols-1 gap-3">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-3 text-slate-400 group">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-gold-500/40 mt-2 group-hover:bg-gold-500 transition-colors" />
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

                        {/* Projects */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <Scale className="h-6 w-6 text-purple-400" />
                                </div>
                                Practical Simulations & Labs
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "Binary" ? Binary : item.icon === "FileText" ? FileText : AlertTriangle;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 hover:border-gold-500/40 transition-all duration-300 group">
                                            <CardContent className="pt-8 text-center h-full flex flex-col">
                                                <div className="mx-auto bg-slate-700/50 p-4 w-fit rounded-2xl border border-slate-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                                    <Icon className="h-8 w-8 text-gold-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                                <p className="text-sm text-slate-400 mb-4 flex-grow">{item.description}</p>
                                                <div className="text-xs font-mono bg-slate-950/50 p-2 rounded border border-slate-700 text-gold-500">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        {/* Learning Outcomes by Role */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <Users className="h-6 w-6 text-emerald-400" />
                                </div>
                                Learning Path by Role
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { role: "Engineers", takeaway: "Code bias-detection scripts and implement XAI libraries into the CI/CD pipeline." },
                                    { role: "Managers", takeaway: "Frameworks to assess the 'Ethics-to-Revenue' ratio and lead safe AI transitions." },
                                    { role: "Compliance", takeaway: "Deep understanding of the EU AI Act and NIST to ensure company passes external audits." }
                                ].map((path, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-slate-800/20 border border-slate-700/50">
                                        <div className="text-sm font-bold text-gold-400 uppercase mb-2">{path.role}</div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{path.takeaway}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FAQ */}
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
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500 to-blue-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="text-5xl font-extrabold text-white mb-2 tracking-tighter">
                                                ₹{courseData.price}
                                            </div>
                                            <div className="text-gold-400 font-bold tracking-widest uppercase text-xs">Professional Excellence Tier</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-white rounded-2xl shadow-lg shadow-gold-500/25 transition-all active:scale-95" size="lg">
                                                Enroll Now
                                            </Button>
                                            <Button variant="outline" className="w-full h-12 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl">
                                                <Download className="mr-2 h-4 w-4" />
                                                Download Syllabus
                                            </Button>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-gold-400" />
                                                <span>Professional Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Activity className="h-5 w-5 text-blue-400" />
                                                <span>Bias Remediation Toolkit</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Gavel className="h-5 w-5 text-purple-400" />
                                                <span>Regulatory Compliance Maps</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <RotateCcw className="h-5 w-5 text-red-400" />
                                                <span>Incident Response Playbooks</span>
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
                                        <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg shadow-white/5 border border-slate-200 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Designs</h4>
                                            <p className="text-xs text-slate-400">Excellence in AI Safety</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        We specialize in operationalizing AI safety for the modern enterprise. From technical bias mitigation to boardroom governance, we bridge the trust gap.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
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
                                    <Shield className="h-5 w-5 text-blue-400" />
                                    Prerequisites
                                </h3>
                                <ul className="space-y-3">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-sm text-slate-400">
                                            <div className="h-1.5 w-1.5 rounded-full bg-gold-500/40 mt-1.5 flex-shrink-0" />
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
