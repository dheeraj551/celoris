"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function LiveKitAIAgentsCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Build Real-Time AI Agents with LiveKit | low-latency Voice AI Course";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Learn how to build low-latency voice AI agents using LiveKit, OpenAI GPT-4o-Realtime, and WebRTC. Master STT/TTS integration and scalable deployment.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Learn how to build low-latency voice AI agents using LiveKit, OpenAI GPT-4o-Realtime, and WebRTC. Master STT/TTS integration and scalable deployment.';
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "Build Real-Time AI Agents with LiveKit",
        description: "Learn how to build low-latency voice AI agents using LiveKit, OpenAI GPT-4o-Realtime, and WebRTC. This comprehensive course covers everything from STT/TTS integration to scalable deployment for interactive AI.",
        students: 850,
        rating: 4.9,
        duration: "10 hours",
        price: 14999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/build-real-time-ai-agents-with-livekit",
        learning_outcomes: [
            "Understand why WebRTC is the industry standard for sub-500ms latency compared to WebSockets.",
            "Master LiveKit Ecosystem: SFU (Selective Forwarding Unit), Rooms, and Participants.",
            "Develop a Multi-Modal AI Pipeline: Integrate Speech-to-Text (STT), LLMs, and Text-to-Speech (TTS).",
            "Implement VAD (Voice Activity Detection) for natural human-AI turn-taking and interruptions.",
            "Utilize LLM Tools & Function Calling to enable agents to interact with external APIs in real-time.",
            "Manage Session State and context windows during live, multi-turn conversations.",
            "Apply Prompt Engineering specifically crafted for conversational voice AI agents.",
            "Orchestrate Multi-Agent systems: Hand off tasks between specialized AI agents in a single room.",
            "Deploy production-ready agents using Docker, Kubernetes, or LiveKit Cloud.",
            "Implement OpenTelemetry for observability and monitoring latency spikes."
        ],
        requirements: [
            "Basic knowledge of TypeScript or Python",
            "Familiarity with OpenAI APIs and LLM concepts",
            "Basic understanding of networking (WebSockets/HTTP)",
            "A computer with Docker installed (optional but recommended)",
            "LiveKit Cloud account (free tier) or local LiveKit server setup"
        ],
        chapters: [
            {
                number: 1,
                title: "LiveKit Ecosystem & Real-Time Fundamentals",
                icon: "Radio",
                topics: [
                    "WebRTC vs. WebSockets: Why WebRTC is the industry standard for sub-500ms latency.",
                    "LiveKit Components: Understanding SFU (Selective Forwarding Unit), Rooms, and Participants.",
                    "Developer Environment Setup: Setting up a local LiveKit Server and CLI for real-time testing."
                ],
                duration: "2.5 hours"
            },
            {
                number: 2,
                title: "The Multi-Modal AI Pipeline (Voice + Video)",
                icon: "Cpu",
                topics: [
                    "The AI Agent Stack: Integrating Speech-to-Text (STT), Large Language Models (LLM), and Text-to-Speech (TTS).",
                    "VAD (Voice Activity Detection): How to handle human interruptions and natural turn-taking logic.",
                    "LLM Tools & Function Calling: Teaching agents to interact with external APIs in real-time."
                ],
                duration: "2.5 hours"
            },
            {
                number: 3,
                title: "Building the 'Brain' (Logic & State Management)",
                icon: "Zap",
                topics: [
                    "Session State: Managing memory and context window during live sessions.",
                    "Prompt Engineering for Voice: Crafting system instructions specifically for conversational AI agents.",
                    "Multi-Agent Orchestration: Handing off tasks between specialized AI agents within a single LiveKit room."
                ],
                duration: "2.5 hours"
            },
            {
                number: 4,
                title: "Scaling, Security & Production Deployment",
                icon: "Shield",
                topics: [
                    "Deployment Strategies: Running agents on LiveKit Cloud vs. self-hosting with Docker and Kubernetes.",
                    "Observability: Implementing OpenTelemetry to monitor latency spikes and agent performance.",
                    "Cost Optimization: Reducing inference and bandwidth costs for high-traffic AI applications."
                ],
                duration: "2.5 hours"
            }
        ],
        faqs: [
            {
                question: "What is LiveKit and how does it power AI agents?",
                answer: "LiveKit is an open-source WebRTC stack that provides the infrastructure for real-time audio and video sessions. It powers AI agents by enabling high-fidelity, low-latency communication between humans and AI models, handling the complex networking and scaling required for real-time interactions."
            },
            {
                question: "How do you connect LLMs to real-time audio streams?",
                answer: "This is achieved through a pipeline that converts incoming audio to text (STT), sends that text to an LLM (like GPT-4o), and then converts the LLM's text response back to audio (TTS) which is streamed back to the user via WebRTC."
            },
            {
                question: "How do you maintain context in a live conversation?",
                answer: "We use session state management to preserve the history of the conversation, ensuring the AI 'remembers' previous turns, and we carefully manage the LLM's context window to keep the conversation relevant and responsive."
            },
            {
                question: "How do you deploy a production-ready AI agent?",
                answer: "Production deployment involves choosing between LiveKit Cloud for managed scaling or self-hosting using Docker and Kubernetes. It also requires setting up observability tools like OpenTelemetry and optimizing for both latency and cost."
            }
        ],
        deliverables: [
            {
                title: "Production Starter Repo",
                description: "A modular GitHub template featuring Python/TypeScript and LiveKit Agent SDK."
            },
            {
                title: "Interactive Demo App",
                description: "A fully functional 'Voice Concierge' app deployable in one click."
            },
            {
                title: "Latency Benchmarking Tool",
                description: "A script to measure and optimize your agent’s Time-to-First-Byte (TTFB)."
            }
        ],
        comparison: [
            {
                feature: "Latency",
                traditional: "2 - 5 seconds",
                livekit: "< 500 milliseconds"
            },
            {
                feature: "Interruption",
                traditional: "Not possible (Wait for finish)",
                livekit: "Natural (Interrupt anytime)"
            },
            {
                feature: "Communication",
                traditional: "Text-based / Sequential",
                livekit: "Full Duplex / Real-time Voice"
            },
            {
                feature: "User Experience",
                traditional: "Static / Robotic",
                livekit: "Fluid / Human-like"
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Build Real-Time AI Agents with LiveKit",
        "description": "A comprehensive technical course on building low-latency, interactive voice and chat AI agents using LiveKit, WebRTC, and LLM pipelines.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://celorisdesigns.com/"
        },
        "courseCode": "LK-AI-001",
        "educationalLevel": "Intermediate",
        "teaches": [
            "Real-time AI Agent Development",
            "LiveKit Framework",
            "WebRTC for AI",
            "STT/TTS Pipeline Integration",
            "Production AI Deployment"
        ],
        "hasCourseInstance": {
            "@type": "CourseInstance",
            "courseMode": "Online",
            "courseWorkload": "PT10H",
            "instructor": {
                "@type": "Person",
                "name": "Expert Lead Instructor",
                "jobTitle": "AI Engineer"
            }
        },
        "syllabusSections": [
            {
                "@type": "Syllabus",
                "name": "LiveKit Fundamentals",
                "description": "Architecture, SFU basics, and setting up the developer environment."
            },
            {
                "@type": "Syllabus",
                "name": "WebRTC + AI Integration",
                "description": "Mastering low-latency streaming and audio processing for LLMs."
            },
            {
                "@type": "Syllabus",
                "name": "Voice/Chat Agent Logic",
                "description": "Building the pipeline for natural turn-taking and tool use."
            },
            {
                "@type": "Syllabus",
                "name": "Scaling & Deployment",
                "description": "Dockerization and deploying to LiveKit Cloud for production."
            }
        ],
        "offers": {
            "@type": "Offer",
            "category": "Paid",
            "priceCurrency": "INR",
            "price": "14999"
        }
    }

    return (
        <div className="min-h-screen bg-background py-8">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
                    <Link href="/" className="hover:text-primary-500">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-primary-500">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-primary-500">Courses</Link>
                    <span>/</span>
                    <span className="text-text-primary line-clamp-1">LiveKit AI Agents</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-text-secondary hover:text-primary-500 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Header */}
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">Artificial Intelligence</span>
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">WebRTC</span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">LiveKit</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                                {courseData.title}
                            </h1>
                            <p className="text-lg text-text-secondary mb-6 italic">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview */}
                        <Card className="overflow-hidden border-2 border-primary-100">
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src="/livekit-ai-agents-cover.png"
                                    alt="Build Real-Time AI Agents with LiveKit"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Button size="lg" className="bg-white text-black hover:bg-gray-100" asChild>
                                        <Link href="#" target="_blank">
                                            <Play className="mr-2 h-5 w-5" />
                                            Watch Trailer
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Comparison Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BarChart className="h-5 w-5 text-indigo-500" />
                                    <span>Why LiveKit AI Agents?</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="py-3 px-4 font-semibold text-text-primary">Feature</th>
                                                <th className="py-3 px-4 font-semibold text-text-secondary">Traditional Chatbots (REST)</th>
                                                <th className="py-3 px-4 font-semibold text-primary-600">LiveKit AI Agents (WebRTC)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {courseData.comparison.map((row, index) => (
                                                <tr key={index} className="border-b hover:bg-surface transition-colors">
                                                    <td className="py-3 px-4 font-medium">{row.feature}</td>
                                                    <td className="py-3 px-4 text-text-secondary">{row.traditional}</td>
                                                    <td className="py-3 px-4 font-medium text-primary-700">{row.livekit}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* What You'll Learn */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>What You Will Master</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-text-secondary text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Course Curriculum */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BookOpen className="h-5 w-5 text-blue-500" />
                                    <span>Course Curriculum</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.chapters.map((chapter, index) => {
                                        const Icon = chapter.icon === "Radio" ? Radio :
                                            chapter.icon === "Cpu" ? Cpu :
                                                chapter.icon === "Zap" ? Zap :
                                                    chapter.icon === "Shield" ? Shield : BookOpen;
                                        return (
                                            <AccordionItem key={index} value={`chapter-${index}`}>
                                                <AccordionTrigger>
                                                    <div className="flex items-center space-x-3 text-left w-full">
                                                        <div className="bg-primary-50 p-2 rounded-lg">
                                                            <Icon className="h-5 w-5 text-primary-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Module {chapter.number}</div>
                                                            <div className="font-medium">{chapter.title}</div>
                                                        </div>
                                                        <span className="text-sm text-text-secondary mr-4">({chapter.duration})</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="pl-12 pr-4 py-2 space-y-4">
                                                        <div className="text-sm font-semibold text-text-primary">
                                                            Key Question: {
                                                                chapter.number === 1 ? "What is LiveKit and how does it power AI agents?" :
                                                                    chapter.number === 2 ? "How do you connect LLMs to real-time audio streams?" :
                                                                        chapter.number === 3 ? "How do you maintain context in a live conversation?" :
                                                                            "How do you deploy a production-ready AI agent?"
                                                            }
                                                        </div>
                                                        <ul className="space-y-3">
                                                            {chapter.topics.map((topic, topicIndex) => (
                                                                <li key={topicIndex} className="flex items-start space-x-3 text-text-secondary">
                                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                                                                    <span className="text-sm">{topic}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Course Deliverables */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {courseData.deliverables.map((item, index) => (
                                <Card key={index} className="bg-gradient-to-br from-surface to-primary-50/30">
                                    <CardContent className="pt-6">
                                        <div className="bg-white p-2 w-fit rounded-lg shadow-sm mb-4">
                                            {index === 0 ? <Cpu className="h-6 w-6 text-orange-500" /> :
                                                index === 1 ? <Play className="h-6 w-6 text-green-500" /> :
                                                    <BarChart className="h-6 w-6 text-blue-500" />}
                                        </div>
                                        <h3 className="font-bold text-text-primary mb-2">{item.title}</h3>
                                        <p className="text-sm text-text-secondary">{item.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="h-5 w-5 text-blue-500" />
                                    <span>Frequently Asked Questions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`faq-${index}`}>
                                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="text-text-secondary leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Enrollment Card */}
                            <Card className="shadow-xl">
                                <CardContent className="p-6">
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-primary-600 mb-2">
                                            ₹{courseData.price}
                                        </div>
                                        <div className="text-text-secondary">Professional Certification</div>
                                    </div>
                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full mb-4 bg-primary-600 hover:bg-primary-700 h-12 text-lg"
                                    />
                                    <div className="mt-6 text-center text-sm text-text-secondary space-y-3">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Award className="h-4 w-4 text-primary-500" />
                                            <span>Certificate of Completion</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <Zap className="h-4 w-4 text-yellow-500" />
                                            <span>Lifetime Access to Repo</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <Users className="h-4 w-4 text-blue-500" />
                                            <span>Join 850+ AI Engineers</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Industry-Standard Toolkit</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructor */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Lead Instructor</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center overflow-hidden border-2 border-primary-100">
                                            <img src="/celoris-logo.png" alt="Celoris Designs" className="w-12 h-12 object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary">{courseData.provider}</h3>
                                            <p className="text-sm text-text-secondary">AI Engineer & Expert</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                                        At Celoris Designs, we specialize in building state-of-the-art AI solutions. Our engineering team brings real-world experience in deploying low-latency voice agents for enterprise clients.
                                    </p>
                                    <div className="space-y-3 text-sm text-text-secondary">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium text-text-primary">{courseData.rating}</span>
                                            <span>(850+ ratings)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{courseData.duration} course</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="h-4 w-4" />
                                            <span>4 Comprehensive Modules</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Requirements */}
                            <Card className="bg-slate-900 text-white">
                                <CardHeader>
                                    <CardTitle className="text-lg text-white">Prerequisites</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {courseData.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start space-x-2 text-slate-300 text-sm">
                                                <div className="h-1 w-1 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
