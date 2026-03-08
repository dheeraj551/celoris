"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Cpu, Radio, Shield, BarChart, Code, Layout, GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function LiveKitAIAgentsCourse() {
    useEffect(() => {
        document.title = "Building Real-Time Voice AI with LiveKit | Production Voice Agents Course";
        const metaDescription = document.querySelector('meta[name="description"]');
        const desc = "Build production-grade voice agents, real-time transcription pipelines, and multi-modal AI apps using LiveKit Agents, Whisper, and LLMs.";
        if (metaDescription) {
            metaDescription.setAttribute('content', desc);
        }
    }, []);

    const courseData = {
        title: "Building Real-Time Voice AI with LiveKit",
        subtitle: "Build production-grade voice agents, real-time transcription pipelines, and multi-modal AI apps using LiveKit Agents, Whisper, and LLMs",
        description: "Real-time voice AI is the fastest-growing interface in tech — from customer service bots to AI meeting assistants, voice-first apps are going mainstream. This course teaches you to build production-quality voice AI systems from scratch using LiveKit, the open-source real-time infrastructure platform trusted by thousands of developers.",
        whoItIsFor: "Backend and full-stack developers comfortable with Python and JavaScript who want to build AI-powered voice, audio, or video products. Prior AI/ML experience is not required but basic familiarity with REST APIs helps.",
        statsOverview: "8 Modules • 30+ Lessons • 6 Projects • Intermediate–Advanced",
        students: 1250,
        rating: 4.9,
        duration: "28.5 hours",
        price: 3000,
        provider: "Celoris Designs",
        learning_outcomes: [
            "Build a production-grade voice AI agent using LiveKit Agents and deploy it on a live URL",
            "Integrate any combination of STT, LLM, and TTS providers and switch between them with minimal code changes",
            "Design voice-first conversational experiences that feel natural and handle interruptions, silence, and errors gracefully",
            "Implement real-time transcription with speaker diarization for multi-party conversations",
            "Secure, monitor, and scale voice AI infrastructure to handle hundreds of concurrent sessions",
            "Understand and optimize end-to-end latency across the full voice pipeline",
            "Integrate telephony via SIP trunks to enable phone-based voice AI"
        ],
        requirements: [
            "Python 3.10+ (comfortable with async/await)",
            "JavaScript / TypeScript basics",
            "REST APIs and JSON",
            "Basic terminal / command line",
            "Git for version control"
        ],
        tools: [
            "Python 3.11 + pip",
            "Node.js 20+",
            "Docker Desktop",
            "LiveKit CLI (lk)",
            "VS Code with Pylance",
            "OpenAI API key (free tier ok)"
        ],
        projects: [
            { name: "Live Transcription App", tech: "LiveKit, Whisper, React" },
            { name: "Voice-Enabled Q&A Bot", tech: "LiveKit Agents, GPT-4o, TTS" },
            { name: "AI Meeting Assistant", tech: "LiveKit Cloud, Diarization, Summarization" },
            { name: "Multi-Language Voice Translator", tech: "Whisper, DeepL, LiveKit Egress" },
            { name: "Voice-Controlled Dashboard", tech: "LiveKit, Tool Calling, WebSockets" },
            { name: "Production Agent Deployment", tech: "Docker, LiveKit Cloud, Monitoring" }
        ],
        modules: [
            {
                number: 1,
                title: "Real-Time Audio & WebRTC Foundations",
                duration: "~3 hrs",
                topics: [
                    "How WebRTC works: signaling, STUN/TURN, ICE negotiation",
                    "Audio pipelines: sampling, codecs (Opus, G.711), jitter buffers",
                    "LiveKit architecture: rooms, tracks, participants, and data channels",
                    "Setting up your first LiveKit room with the Python and JS SDKs",
                    "Capturing microphone audio in browser and Node.js"
                ]
            },
            {
                number: 2,
                title: "LiveKit Agents Framework",
                duration: "~4 hrs",
                topics: [
                    "Introduction to livekit-agents: what it is and why it exists",
                    "Agent lifecycle: entry points, jobs, and workers",
                    "Voice Activity Detection (VAD): Silero and WebRTC VAD",
                    "Speech-to-Text plugins: Deepgram, Whisper, AssemblyAI",
                    "Text-to-Speech plugins: ElevenLabs, OpenAI TTS, Cartesia",
                    "Project: Build your first voice-activated assistant"
                ]
            },
            {
                number: 3,
                title: "Speech-to-Text at Scale with Whisper",
                duration: "~3.5 hrs",
                topics: [
                    "OpenAI Whisper architecture and model sizes (tiny → large-v3)",
                    "Local inference with faster-whisper and GPU acceleration",
                    "Streaming transcription: chunking strategies and partial results",
                    "Speaker diarization with pyannote.audio",
                    "Punctuation restoration and post-processing",
                    "Project: Real-time live transcription web app"
                ]
            },
            {
                number: 4,
                title: "LLM Integration & Conversational Design",
                duration: "~4 hrs",
                topics: [
                    "Connecting LiveKit agents to GPT-4o, Claude, and Gemini",
                    "Designing effective voice-first system prompts",
                    "Tool calling for voice agents: function schemas and execution",
                    "Turn-taking, interruption handling, and conversation flow",
                    "Context management: token budgets and long conversation memory",
                    "Project: Full voice Q&A assistant with tool use"
                ]
            },
            {
                number: 5,
                title: "Advanced Audio Processing",
                duration: "~3 hrs",
                topics: [
                    "Noise suppression and echo cancellation (RNNoise, WebRTC AEC)",
                    "Audio normalization and gain control for consistent transcription",
                    "Multi-language detection and routing",
                    "Handling phone-quality audio and low-bandwidth connections",
                    "Audio recording, egress, and storage with LiveKit",
                    "Project: Multi-language voice translator"
                ]
            },
            {
                number: 6,
                title: "Building Production Voice Applications",
                duration: "~4 hrs",
                topics: [
                    "Architecture patterns: single-agent vs multi-agent rooms",
                    "Latency budget analysis: where time is spent end-to-end",
                    "LiveKit Egress: recording and compositing rooms",
                    "Authentication, authorization, and room security",
                    "Monitoring: metrics, tracing, and alerting for voice apps",
                    "Project: AI meeting assistant with auto-summary"
                ]
            },
            {
                number: 7,
                title: "Deployment & Infrastructure",
                duration: "~3 hrs",
                topics: [
                    "Deploying agents with Docker and docker-compose",
                    "LiveKit Cloud vs self-hosted: when to switch",
                    "Horizontal scaling: multiple agent workers and load balancing",
                    "Cost modelling: compute, bandwidth, API costs per hour of voice",
                    "CI/CD for voice agents: testing, staging, blue-green deploys",
                    "Project: Containerized voice agent on a VPS"
                ]
            },
            {
                number: 8,
                title: "Advanced Patterns & Capstone",
                duration: "~4 hrs",
                topics: [
                    "Multi-agent architectures: orchestrator and sub-agents",
                    "Retrieval-Augmented Generation (RAG) for voice",
                    "Emotion and intent detection from audio",
                    "Integrating telephony: SIP trunks with LiveKit",
                    "Building a voice AI product: UX, onboarding, and trust signals",
                    "Capstone: Full-stack voice AI product of your choice"
                ]
            }
        ],
        batchTimings: [
            "12:00 PM - 01:00 PM",
            "03:00 PM - 04:00 PM",
            "09:00 PM - 10:00 PM"
        ],
        faqs: [
            {
                question: "Do I need an OpenAI API key to follow along?",
                answer: "Yes, for the LLM modules we primarily use OpenAI GPT-4o. However, we also cover how to use local models like Llama 3 via Ollama for developers who want to minimize API costs."
            },
            {
                question: "Is this course live or pre-recorded?",
                answer: "This is a LIVE hybrid course. You get access to weekly live coding sessions and Q&A, along with high-quality recorded core modules for self-paced learning."
            },
            {
                question: "Will I get a certificate after completion?",
                answer: "Yes, upon submitting the capstone project and completing all modules, you will receive a verified certificate from Celoris Designs."
            },
            {
                question: "Is prior experience with WebRTC required?",
                answer: "No. Module 1 covers all the necessary WebRTC foundations. You just need to be comfortable with async Python and basic JavaScript."
            }
        ]
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                    <Link href="/" className="hover:text-primary-500 font-medium">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-primary-500 font-medium">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-primary-500 font-medium">Courses</Link>
                    <span>/</span>
                    <span className="text-foreground line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-muted-foreground hover:text-primary-500 mb-6 font-medium">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Header */}
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">🎙️ LIVE COURSE</span>
                                <span className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Voice AI</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                                {courseData.title}
                            </h1>
                            <p className="text-xl text-muted-foreground mb-6 font-medium leading-relaxed">
                                {courseData.subtitle}
                            </p>
                            <div className="text-sm text-slate-400 font-semibold mb-8 uppercase tracking-widest bg-slate-900/50 w-fit px-4 py-2 rounded-lg border border-slate-800">
                                {courseData.statsOverview}
                            </div>
                        </div>

                        {/* Overview Section */}
                        <Card className="bg-white border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary-600" />
                                    Course Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <p className="text-slate-700 leading-relaxed text-lg italic">
                                    {courseData.description}
                                </p>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <h4 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">Who is this for?</h4>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {courseData.whoItIsFor}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Projects Table */}
                        <Card className="bg-white border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <Layout className="h-5 w-5 text-indigo-600" />
                                    What You Will Build
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 text-sm font-bold text-slate-900">Project</th>
                                                <th className="px-4 py-3 text-sm font-bold text-slate-900">Key Technologies</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {courseData.projects.map((project, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-4 text-sm font-bold text-slate-800">{project.name}</td>
                                                    <td className="px-4 py-4 text-sm text-slate-600 font-medium font-mono">{project.tech}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Curriculum */}
                        <Card className="bg-white border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500" />
                                    Course Modules
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.modules.map((module, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-slate-100">
                                            <AccordionTrigger className="hover:no-underline py-4">
                                                <div className="flex justify-between items-center w-full pr-4">
                                                    <div className="flex flex-col items-start whitespace-nowrap">
                                                        <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Module {module.number}</span>
                                                        <span className="text-slate-900 font-bold text-lg">{module.title}</span>
                                                    </div>
                                                    <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded font-bold">{module.duration}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-6">
                                                <ul className="space-y-3 pl-2">
                                                    {module.topics.map((topic, i) => (
                                                        <li key={i} className="flex items-start gap-3 text-slate-700 font-medium">
                                                            <div className="h-1.5 w-1.5 rounded-full bg-primary-400 mt-2 flex-shrink-0" />
                                                            {topic}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Outcomes */}
                        <Card className="bg-white border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-green-600" />
                                    Learning Outcomes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* FAQ Section */}
                        <Card className="bg-white border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900 flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5 text-blue-500" />
                                    Frequently Asked Questions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`faq-${index}`} className="border-slate-100">
                                            <AccordionTrigger className="text-slate-900 font-bold hover:no-underline text-left">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-slate-700 font-medium leading-relaxed">
                                                {faq.answer}
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
                            <Card className="bg-white border-slate-200 shadow-xl shadow-primary-900/10 overflow-hidden">
                                <div className="bg-emerald-600 py-3 text-center text-white text-[10px] font-black uppercase tracking-[0.2em] italic">
                                    Enrolling Now
                                </div>
                                <CardContent className="p-8 flex flex-col gap-6">
                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full h-14 text-xl font-black uppercase italic bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:scale-[1.02] border-none"
                                    />

                                    <div className="text-center text-sm text-slate-500 font-medium space-y-3">
                                        <div className="flex items-center justify-center gap-2">
                                            <Award className="h-4 w-4 text-emerald-500" />
                                            <span>Certificate of completion</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Zap className="h-4 w-4 text-yellow-500" />
                                            <span>Lifetime repo access</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Batch Timings */}
                            <Card className="bg-white border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-slate-900 flex items-center gap-2 text-lg">
                                        <Clock className="h-5 w-5 text-indigo-600" />
                                        Batch Timings
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {courseData.batchTimings.map((time, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Batch {i + 1}</span>
                                                <span className="text-sm font-bold text-slate-900">{time}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                                        All times in IST (GMT+5:30)
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Instructor Profile */}
                            <Card className="bg-white border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">Your Instructor</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-slate-100">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-12 h-12 object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{courseData.provider}</h3>
                                            <p className="text-xs text-slate-500 font-medium italic">Deep-Content Learning Series</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                                        Celoris deep-content courses are designed for developers who want to go beyond surface-level tutorials and truly understand how things work.
                                    </p>
                                    <div className="space-y-3 text-sm text-slate-600 font-semibold">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                                            <span className="text-slate-900">{courseData.rating}</span>
                                            <span className="text-slate-400 font-normal">(1250+ ratings)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-primary-600" />
                                            <span>{courseData.duration} course</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prerequisites Card */}
                            <Card className="bg-slate-900 text-white border-none shadow-xl">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-white">
                                        <Cpu className="h-5 w-5 text-primary-400" />
                                        Prerequisites
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {courseData.requirements.map((req, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-primary-400 flex-shrink-0" />
                                                <span className="text-sm text-slate-300 font-medium">{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-8 pt-6 border-t border-slate-800">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Tools to Install</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {courseData.tools.map((tool, i) => (
                                                <span key={i} className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-bold border border-slate-700">
                                                    {tool}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}
