"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Layers, Filter, RefreshCw, Activity, Globe, ShieldCheck, TrendingDown, Terminal, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"

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
        ],
        quiz_data: [
            {
                title: "Core Objectives & Philosophy",
                questions: [
                    {
                        question: "What is the primary goal of the 'Deploy & Scale AI' course?",
                        options: ["To build local prototypes only", "To bridge the gap from local prototype to global production", "To teach hardware manufacturing", "To focus exclusively on manual scaling"],
                        correctIndex: 1,
                        explanation: "The course is specifically designed to take you from localhost to a global production environment."
                    },
                    {
                        question: "Which scaling philosophy does the course promote?",
                        options: ["Cost-heavy scaling", "Slow-growth scaling", "Zero-waste scaling", "Local-only scaling"],
                        correctIndex: 2,
                        explanation: "Zero-waste scaling focuses on efficiency and only paying for what you actually use."
                    },
                    {
                        question: "What does the course aim to help developers stop paying for?",
                        options: ["API keys", "Idle GPUs", "Internet bandwidth", "Domain registration"],
                        correctIndex: 1,
                        explanation: "Traditional GPU hosting is expensive when idle; serverless architectures solve this."
                    },
                    {
                        question: "The course ensures applications are cost-efficient starting from user #1 up to how many users?",
                        options: ["10,000", "100,000", "500,000", "1,000,000"],
                        correctIndex: 3,
                        explanation: "The architecture is designed to scale seamlessly up to 1 million users."
                    },
                    {
                        question: "How does the source describe the speed of applications deployed using these architectures?",
                        options: ["Moderately paced", "Lightning-fast", "Standard industry speed", "Variable speed"],
                        correctIndex: 1,
                        explanation: "Edge and serverless architectures minimize latency for lightning-fast performance."
                    }
                ]
            },
            {
                title: "Architecture & Infrastructure",
                questions: [
                    {
                        question: "Which two architecture types are central to the course?",
                        options: ["Monolithic and On-premise", "Serverless and Edge", "P2P and Client-Server", "Legacy and Hybrid"],
                        correctIndex: 1
                    },
                    {
                        question: "Which platform is recommended for global deployment alongside the Next.js AI SDK?",
                        options: ["Heroku", "DigitalOcean", "Vercel", "Bluehost"],
                        correctIndex: 2
                    },
                    {
                        question: "What is the primary benefit of using Cloudflare Workers mentioned in the sources?",
                        options: ["High storage capacity", "Edge Computing with 10ms latency", "Specialized hardware cooling", "Manual server management"],
                        correctIndex: 1
                    },
                    {
                        question: "What specific latency benchmark is associated with Cloudflare Workers in the source?",
                        options: ["1ms", "10ms", "100ms", "1 second"],
                        correctIndex: 1
                    },
                    {
                        question: "Which AWS service is recommended for 'Heavy Inference'?",
                        options: ["AWS S3", "AWS Lambda", "AWS CloudFront", "AWS IAM"],
                        correctIndex: 1
                    },
                    {
                        question: "Besides AWS Lambda, which other AWS service is mentioned for heavy inference tasks?",
                        options: ["AWS Fargate", "AWS Route 53", "AWS EC2 (Standard)", "AWS Amplify"],
                        correctIndex: 0
                    },
                    {
                        question: "What is 'Edge Computing' as used in this context?",
                        options: ["Computing done at the central data centre", "Computing done closer to the user to reduce latency", "Computing using outdated hardware", "Computing without an internet connection"],
                        correctIndex: 1
                    },
                    {
                        question: "What does the course help you master regarding architecture selection?",
                        options: ["Choosing the most expensive provider", "Serverless & Edge Architecture Selection", "Building your own data centre", "Using only local servers"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "AI Models & Management",
                questions: [
                    {
                        question: "Which of the following is NOT one of the specific models mentioned for Model Routing?",
                        options: ["GPT-4o", "Claude 3.5", "Llama 3", "Gemini 1.5"],
                        correctIndex: 3
                    },
                    {
                        question: "What does 'Model Routing' refer to in the curriculum?",
                        options: ["Physical cables connecting servers", "Choosing between models like GPT-4o, Claude 3.5, and Llama 3 based on needs", "Improving the internet speed of the user", "Training a new model from scratch"],
                        correctIndex: 1
                    },
                    {
                        question: "What aspect of AI management focuses on 'Tokens'?",
                        options: ["Token Security only", "Precision Cost Optimization & Token Management", "Token Mining", "Selling tokens as cryptocurrency"],
                        correctIndex: 1
                    },
                    {
                        question: "Which tool is recommended for AI Observability and Tracing?",
                        options: ["Google Analytics", "LangSmith", "Wireshark", "Meta Pixel"],
                        correctIndex: 1
                    },
                    {
                        question: "Which alternative tool is mentioned for tracing alongside LangSmith?",
                        options: ["Helicone", "Postman", "Docker", "Kubernetes"],
                        correctIndex: 0
                    }
                ]
            },
            {
                title: "Security & Operations",
                questions: [
                    {
                        question: "What is a key security mastery point mentioned for AI applications?",
                        options: ["Physical locks on servers", "Prompt Injection Defense & Guardrails", "Biometric authentication for users", "Hiding the website URL"],
                        correctIndex: 1
                    },
                    {
                        question: "How should API Keys and Environment Variables be managed according to the source?",
                        options: ["Publicly in the GitHub repo", "Secure API Key & Environment Variable Management", "Hardcoded in the JavaScript files", "Sent via unencrypted email"],
                        correctIndex: 1
                    },
                    {
                        question: "What type of CI/CD is taught in the course?",
                        options: ["Manual deployment only", "Production-Grade CI/CD for AI Infrastructure", "Local-only testing", "Peer-to-peer sharing"],
                        correctIndex: 1
                    },
                    {
                        question: "Which automation tool is used for infrastructure provisioning?",
                        options: ["Jenkins", "GitHub Actions", "CircleCI", "Travis CI"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Tech Stack & Deliverables",
                questions: [
                    {
                        question: "What is the era of the tech stack taught in the course?",
                        options: ["2018-2019", "2020-2022", "2024-2025", "2026-2030"],
                        correctIndex: 2
                    },
                    {
                        question: "Which CSS framework is included in the 'Starter Kit'?",
                        options: ["Bootstrap", "Tailwind", "Bulma", "Foundation"],
                        correctIndex: 1
                    },
                    {
                        question: "The 'Boilerplate Repo' features which combination of technologies?",
                        options: ["Next.js, Tailwind, and Cloudflare", "React, Sass, and AWS", "Vue, CSS, and Azure", "Angular, Less, and Google Cloud"],
                        correctIndex: 0
                    },
                    {
                        question: "What is 'The Deployment Guide'?",
                        options: ["A physical book", "A step-by-step PDF checklist", "A video-only series", "A phone support line"],
                        correctIndex: 1
                    },
                    {
                        question: "What does the course provide for automated infrastructure provisioning?",
                        options: ["Manual instructions", "GitHub Actions workflows", "A list of phone numbers", "A physical server"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the destination for the 'Deployment Guide' checklist?",
                        options: ["Moving from local prototype to a backup drive", "Moving from localhost to main", "Moving from one PC to another", "Storing code in a private folder"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Course Logistics & Prerequisites",
                questions: [
                    {
                        question: "What is the total duration of the course content?",
                        options: ["2 hours", "5 hours", "10 hours", "24 hours"],
                        correctIndex: 2
                    },
                    {
                        question: "What is the required proficiency level for JavaScript/TypeScript?",
                        options: ["Beginner", "Intermediate", "Expert", "None"],
                        correctIndex: 1
                    },
                    {
                        question: "What is a 'basic understanding' requirement for the course?",
                        options: ["Basic understanding of hardware repair", "Basic understanding of AI/LLM APIs", "Basic understanding of Photoshop", "Basic understanding of marketing"],
                        correctIndex: 1
                    },
                    {
                        question: "What is mentioned as a 'plus' for students?",
                        options: ["Familiarity with Cloud platforms", "A degree in Mathematics", "Ownership of a GPU cluster", "Experience in mobile app design"],
                        correctIndex: 0
                    },
                    {
                        question: "What is the cost for 'Full Lifetime Access'?",
                        options: ["₹5,000", "₹10,000", "₹15,000", "₹20,000"],
                        correctIndex: 2
                    },
                    {
                        question: "What kind of certification is provided upon completion?",
                        options: ["Participation certificate", "Professional Certification", "No certification", "Honorary degree"],
                        correctIndex: 1
                    },
                    {
                        question: "Where can students access the 'Exclusive Community'?",
                        options: ["Facebook", "Slack", "Discord", "LinkedIn"],
                        correctIndex: 2
                    },
                    {
                        question: "Who is the instructor/team behind the course?",
                        options: ["The Vercel Team", "The Celoris Team", "The AWS Support Team", "Anonymous contributors"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the average rating of the course/instructors?",
                        options: ["3.5", "4.0", "4.5", "4.9"],
                        correctIndex: 3
                    },
                    {
                        question: "How many students/ratings are cited for the platform?",
                        options: ["100+", "500+", "1200+", "5000+"],
                        correctIndex: 2
                    }
                ]
            },
            {
                title: "The Celoris Platform & Company",
                questions: [
                    {
                        question: "Which of the following is NOT one of the four main platform areas?",
                        options: ["Learn", "Earn", "Sleep", "Apps"],
                        correctIndex: 2
                    },
                    {
                        question: "The fourth pillar of the Celoris platform, besides Learn, Earn, and Apps, is:",
                        options: ["Social", "Market", "Trade", "Build"],
                        correctIndex: 0
                    },
                    {
                        question: "What is the legal name of the company behind the platform?",
                        options: ["Celoris AI Inc.", "Celoris Designs LLP", "Celoris Serverless Ltd.", "Celoris Education Group"],
                        correctIndex: 1
                    },
                    {
                        question: "According to the footer, what is the status of the protocol?",
                        options: ["Protocol Inactive", "Protocol Loading", "Protocol Active", "Protocol Error"],
                        correctIndex: 2
                    },
                    {
                        question: "What is the 'Stay Synchronized' section for?",
                        options: ["Clock settings", "Getting updates on knowledge nodes and grid opportunities", "Synchronizing files between computers", "Employee payroll"],
                        correctIndex: 1
                    },
                    {
                        question: "Which 'Company' link would you use to find job openings?",
                        options: ["About", "Contact", "Careers", "Blog"],
                        correctIndex: 2
                    },
                    {
                        question: "Which 'Support' link explains how user data is handled?",
                        options: ["Help Center", "Privacy Policy", "Terms of Service", "Cookie Policy"],
                        correctIndex: 1
                    },
                    {
                        question: "What is the name of the unified platform mentioned in the source?",
                        options: ["Celoris Unified Platform", "AI Scaling Hub", "Serverless Masterclass", "The Grid"],
                        correctIndex: 0
                    },
                    {
                        question: "What type of engineering does the Celoris Team specialize in?",
                        options: ["Civil Engineering", "AI Infrastructure and Serverless Architectures", "Mechanical Engineering", "Basic Web Design"],
                        correctIndex: 1
                    },
                    {
                        question: "The platform aims to empower individuals through learning and what other opportunities?",
                        options: ["Gaming", "Earning opportunities", "Physical fitness", "Travel"],
                        correctIndex: 1
                    },
                    {
                        question: "In the 'Connect' section, which of these is NOT listed?",
                        options: ["Newsletter", "Community", "Partners", "Telephone"],
                        correctIndex: 3
                    },
                    {
                        question: "What is the overarching theme of the Celoris platform?",
                        options: ["Localised computing for small tasks", "Learn, Earn, Fun & Apps", "Purely academic research", "Non-profit open source only"],
                        correctIndex: 1
                    }
                ]
            }
        ],
        student_reviews: [
            {
                name: "Arjun Mehta",
                role: "Full-Stack Developer",
                rating: 5,
                content: "This course finally showed me how to move from a local AI prototype to a real production system. The serverless and edge architecture lessons were extremely practical and easy to follow."
            },
            {
                name: "Rohan Kulkarni",
                role: "AI Engineer",
                rating: 5,
                content: "The cost optimization strategies helped me reduce inference expenses significantly. Learning model routing and token management alone made this course worth it."
            },
            {
                name: "Neel Patel",
                role: "Indie Hacker",
                rating: 5,
                content: "I had AI demos but no idea how to scale them globally. Deploying with Vercel, Next.js AI SDK, and Cloudflare Workers was a game changer for me."
            },
            {
                name: "Aditi Sharma",
                role: "Software Engineer",
                rating: 4.5,
                content: "Very hands-on and production-focused. The AWS Lambda and Fargate sections clearly explained when serverless beats traditional GPU servers."
            },
            {
                name: "Kunal Verma",
                role: "Startup Founder",
                rating: 5,
                content: "This course is perfect for founders building AI products. It shows how to scale from your first user to thousands without burning money on infrastructure."
            },
            {
                name: "Sarthak Jain",
                role: "Backend Engineer",
                rating: 5,
                content: "The edge computing module was eye-opening. Running AI workloads close to users for ultra-low latency finally made sense after this course."
            },
            {
                name: "Meera Nair",
                role: "Product Engineer",
                rating: 4.5,
                content: "The observability and tracing lessons were excellent. I can now debug AI failures and monitor model behavior in production with confidence."
            },
            {
                name: "Ankit Srivastava",
                role: "DevOps Engineer",
                rating: 5,
                content: "Security and CI/CD for AI are rarely taught this well. Prompt injection defense and API key management were explained with real-world scenarios."
            },
            {
                name: "Rahul Bansal",
                role: "Freelance AI Consultant",
                rating: 5,
                content: "The deployment checklist and automation scripts saved me days of work. This course feels like learning from someone who has shipped AI at scale."
            },
            {
                name: "Ishan Choudhary",
                role: "Computer Science Student",
                rating: 5,
                content: "This course connected the gap between theory and real production AI systems. I now understand how modern AI infrastructure actually works."
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
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": courseData.rating.toString(),
            "reviewCount": courseData.student_reviews.length.toString()
        },
        "review": courseData.student_reviews.map(review => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": review.name
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating.toString()
            },
            "reviewBody": review.content
        })),
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

                        {/* Course Preview Video with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-25 transition duration-1000"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/HLJqpHcSjKA"
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="absolute inset-0 w-full h-full"
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
                        <section id="curriculum" className="space-y-6">
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

                        {/* Student Reviews Section */}
                        <section id="reviews" className="space-y-8 pt-12 border-t border-slate-800/50">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                                        <div className="p-2 bg-yellow-500/20 rounded-lg">
                                            <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                                        </div>
                                        Student Success Stories
                                    </h2>
                                    <p className="text-slate-400 mt-2">Hear from developers who have successfully scaled their AI applications.</p>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-sm border border-slate-800 px-6 py-3 rounded-2xl w-fit">
                                    <div className="text-center border-r border-slate-800 pr-6">
                                        <div className="text-2xl font-bold text-white">{courseData.rating}</div>
                                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Course Rating</div>
                                    </div>
                                    <div className="text-center pl-2">
                                        <div className="text-2xl font-bold text-white">{courseData.student_reviews.length}</div>
                                        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Verified Reviews</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.student_reviews.map((review, index) => (
                                    <Card key={index} className="bg-slate-900/40 border-slate-800 hover:border-cyan-500/30 transition-all duration-300 group">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-1">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3.5 w-3.5 ${i < Math.floor(review.rating) ? "text-yellow-400 fill-yellow-400" : (i < review.rating ? "text-yellow-400 fill-yellow-400 opacity-50" : "text-slate-700")}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs font-bold text-slate-500 bg-slate-800/50 px-2 py-1 rounded-md">{review.rating} / 5</span>
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed italic">
                                                "{review.content}"
                                            </p>
                                            <div className="flex items-center gap-3 pt-4 border-t border-slate-800/50">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase shadow-inner">
                                                    {review.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{review.name}</div>
                                                    <div className="text-[11px] text-slate-500 font-medium">{review.role}</div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
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

                        {/* Interactive Quiz Section */}
                        <section id="quiz" className="pt-12 border-t border-slate-800/50">
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="p-2 bg-primary-500/20 rounded-lg">
                                        <Trophy className="h-6 w-6 text-primary-400" />
                                    </div>
                                    Deployment Readiness Assessment
                                </h2>
                                <p className="text-slate-400 mt-2">Validate your mastery of serverless scaling, edge computing, and cost optimization before going to production.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="Deployment Readiness Assessment"
                                quizDescription="50 questions covering the end-to-end AI deployment and scaling lifecycle."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score) => {
                                    if (score >= 45) return "Master Architect! You are fully prepared to scale AI applications to millions of users.";
                                    if (score >= 35) return "Production Ready! You have a solid grasp of serverless and edge deployment patterns.";
                                    return "Keep Learning! Review the architecture and security modules to strengthen your deployment skills.";
                                }}
                            />
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
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
                                                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                Take Assessment Quiz
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
                                            <div
                                                className="mt-6 p-4 bg-yellow-400/5 border border-yellow-400/10 rounded-2xl flex items-center justify-between cursor-pointer group/reviews"
                                                onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="flex -space-x-2">
                                                        {[
                                                            { initial: "A", color: "from-cyan-500/20 to-blue-500/20", text: "text-cyan-400" },
                                                            { initial: "R", color: "from-purple-500/20 to-pink-500/20", text: "text-purple-400" },
                                                            { initial: "N", color: "from-orange-500/20 to-red-500/20", text: "text-orange-400" }
                                                        ].map((avatar, i) => (
                                                            <div key={i} className={`h-6 w-6 rounded-full border border-slate-900 bg-gradient-to-br ${avatar.color} flex items-center justify-center text-[10px] font-extrabold ${avatar.text} shadow-inner`}>
                                                                {avatar.initial}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="text-[11px] font-bold text-slate-300">
                                                        10+ Student Reviews
                                                    </div>
                                                </div>
                                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 group-hover/reviews:scale-125 transition-transform" />
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
