"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, HelpCircle, BookOpen, Zap, Cpu, Shield, BarChart, Bot, Database, Server, GitBranch, Layers, Trophy, Lock, Globe, HardDrive, Terminal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import TestimonialsDisplay from "@/components/TestimonialsDisplay"

export default function SovereignIntelligenceCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Learn AI Basics Free: Build Your Private AI Knowledge Base";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Learn the basics of AI. Build your own private knowledge base using simple tools like Ollama and PrivateGPT. Free to start. No credit card. celoris.in 🇮🇳";
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
        title: "Learn AI Basics Free",
        subtitle: "Build Your Private and Simple AI Knowledge Base",
        description: "Learn how to use AI on your own computer. Use AI for your personal notes and documents without needing the cloud. This course is perfect for beginners who want to start their AI journey for free.",
        students: 850,
        rating: 4.98,
        duration: "6 Weeks (Intensive)",
        price: 24999,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://www.celorisdesigns.com",
        url: "https://www.celorisdesigns.com/courses/sovereign-intelligence",
        learning_outcomes: [
            "Local Inference: Running LLMs on your own GPU without internet dependency.",
            "Privacy Architecture: Why cloud AI is a liability and how to build a 'zero-trust' local vault.",
            "Uncensored Research: Leveraging open-source weights for unfiltered creative and academic freedom.",
            "Retrieval Augmented Generation (RAG): Building AI that 'reads' your private library of PDFs and docs.",
            "Environment Staging: Master WSL2, Docker, and Poetry for a deterministic AI stack.",
            "Hardware Optimization: Quantization techniques to run 13B+ models on consumer hardware.",
            "Air-Gapped Workflows: Configuring systems that stay smart even when the Wi-Fi is dead.",
            "Open WebUI: Deploying a premium ChatGPT-like interface hosted entirely on your machine."
        ],
        requirements: [
            "Basic Terminal/CLI familiarity",
            "NVIDIA GPU (8GB+ VRAM recommended) or Apple Silicon (M1/M2/M3)",
            "16GB+ System RAM",
            "Desire for data sovereignty and privacy"
        ],
        chapters: [
            {
                number: 1,
                title: "Foundations of Local AI & Sovereignty",
                icon: "Shield",
                topics: [
                    "The Privacy Paradigm: Deconstructing the risks of Cloud-based LLMs.",
                    "Hardware Audit: Assessing VRAM, CUDA cores, and Unified Memory for inference.",
                    "The Weights of Freedom: Understanding the Llama, Mistral, and Quants ecosystem.",
                    "The Uncensored Advantage: Moving beyond corporate alignment filters."
                ],
                duration: "1 Week"
            },
            {
                number: 2,
                title: "Local Core Deployment with Ollama",
                icon: "HardDrive",
                topics: [
                    "Native Installation: Proper setup on Windows, MacOS, and Linux.",
                    "The Model Bazaar: Pulling, running, and switching between model architectures.",
                    "CLI Mastery: Interacting with local silicon via terminal for speed and automation.",
                    "Modelfiles: Customizing system prompts and parameters natively."
                ],
                videoUrl: "https://www.youtube.com/embed/t-AFTcqxGko",
                duration: "1 Week"
            },
            {
                number: 3,
                title: "Environment Staging & Technical Core",
                icon: "Terminal",
                topics: [
                    "WSL2 Integration: Bridging high-performance Linux kernels into Windows.",
                    "Python for Sovereignty: Managing localized interpreters and environments.",
                    "Poetry vs Pip: Implementing deterministic builds for AI dependencies.",
                    "Nvidia Container Toolkit: GPU acceleration for dev environments."
                ],
                duration: "1 Week"
            },
            {
                number: 4,
                title: "Building the Brain: Private RAG Systems",
                icon: "Database",
                topics: [
                    "Vector Databases 101: How computer memory stores human knowledge.",
                    "Embeddings: Turning your private library into mathematical coordinates.",
                    "PrivateGPT & LocalIngest: Connecting 10,000+ pages of data to your model.",
                    "Context Injection: Teaching the AI to cite your personal documents."
                ],
                duration: "1.5 Weeks"
            },
            {
                number: 5,
                title: "Hardening, Optimization & UI",
                icon: "Cpu",
                topics: [
                    "Quantization Deep-Dive: Fitting 70B parameters into 12GB VRAM.",
                    "Air-Gapping the Lab: Ensuring 100% offline functionality.",
                    "Open WebUI: Setting up a professional-grade web interface locally.",
                    "Scaling: Distributed inference and Ollama clusters."
                ],
                duration: "1.5 Weeks"
            }
        ],
        faqs: [
            {
                question: "Do I really need an expensive GPU?",
                answer: "Not necessarily. While an NVIDIA GPU is best, this course covers Apple Silicon (Mac) and CPU-only optimization (GGUF) so you can get started on most modern laptops."
            },
            {
                question: "Is 'Uncensored' AI dangerous?",
                answer: "Uncensored models simply lack the 'as an AI language model' corporate guardrails. They are tools for academic freedom and creative exploration. We teach the ethics of responsible usage."
            },
            {
                question: "Can I use this for my business data?",
                answer: "Absolutely. The primary use case for this course is enabling businesses to use AI on their sensitive legal, financial, and private documents without ever uploading them to a third party."
            }
        ],
        projects: [
            {
                title: "The Librarian",
                description: "Build a PrivateGPT instance that can answer questions about a 100-page local PDF library.",
                tools: "PrivateGPT + ChromaDB + Ollama",
                icon: "BookOpen"
            },
            {
                title: "The Sovereign CLI",
                description: "Create a custom terminal wrapper for multi-model switching and automated document summary.",
                tools: "Python + Click + Ollama API",
                icon: "Terminal"
            },
            {
                title: "The Air-Gapped Oracle",
                description: "Configure a fully offline system with Open WebUI that functions without a Wi-Fi card.",
                tools: "Docker + WSL2 + Open WebUI",
                icon: "Shield"
            }
        ],
        reviews: [
            {
                id: 'rev-1',
                client_name: 'Rohan K.',
                client_title: 'AI Engineer',
                client_avatar_url: null,
                testimonial_text: 'This is the course I wish existed two years ago. Running LLMs locally always felt like black magic—this breaks it down step by step. The RAG module alone is worth the price. My PrivateGPT setup now replaces half my cloud tools.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'rev-2',
                client_name: 'Ananya M.',
                client_title: 'Research Scholar',
                client_avatar_url: null,
                testimonial_text: 'The emphasis on sovereignty and air-gapped workflows is rare and incredibly valuable. I can now query sensitive academic papers without ever touching the cloud. Clear explanations, zero fluff.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'rev-3',
                client_name: 'Marcus L.',
                client_title: 'Indie Founder',
                client_avatar_url: null,
                testimonial_text: 'Most AI courses teach demos. This one teaches systems. Docker, WSL2, Ollama, quantization—everything fits together cleanly. I’m now deploying local AI for client data without legal anxiety.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'rev-4',
                client_name: 'Neha P.',
                client_title: 'Data Analyst',
                client_avatar_url: null,
                testimonial_text: 'Technically dense but extremely rewarding. The environment staging module saved me days of trial and error. I’d recommend this to anyone serious about privacy-first AI.',
                rating: 4,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'rev-5',
                client_name: 'Daniel R.',
                client_title: 'Cybersecurity Consultant',
                client_avatar_url: null,
                testimonial_text: 'The “cloud AI is a liability” section hit hard—and it’s correct. This course finally connects AI with zero-trust principles. The air-gapped oracle project is 🔥.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'rev-6',
                client_name: 'Amit S.',
                client_title: 'Software Developer',
                client_avatar_url: null,
                testimonial_text: 'I went from “LLMs only work on the cloud” to running 13B models locally on my consumer GPU. The hardware optimization lessons are practical and honest, not hype.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'rev-7',
                client_name: 'Sarah T.',
                client_title: 'Technical Writer',
                client_avatar_url: null,
                testimonial_text: 'Uncensored research models changed how I write and explore ideas. No guardrails, no filters, just raw intelligence—used responsibly. The Open WebUI setup feels like my own private ChatGPT.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'rev-8',
                client_name: 'Kunal V.',
                client_title: 'Startup CTO',
                client_avatar_url: null,
                testimonial_text: 'This is not beginner-friendly—and that’s a good thing. It treats you like an adult engineer. If you already know Python and Docker, this course levels you up fast.',
                rating: 4,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'rev-9',
                client_name: 'Liam O.',
                client_title: 'Privacy Advocate',
                client_avatar_url: null,
                testimonial_text: 'Finally, an AI course that respects user autonomy. Sovereign Intelligence isn’t just technical—it’s philosophical. Owning your intelligence stack feels empowering.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            },
            {
                id: 'rev-10',
                client_name: 'Priya N.',
                client_title: 'Indie Developer',
                client_avatar_url: null,
                testimonial_text: 'The project labs are excellent. Building a RAG system that actually reads my PDFs—offline—felt unreal. This course delivers exactly what it promises.',
                rating: 5,
                testimonial_type: 'general',
                client_company: null,
                client_location: null,
                client_website: null,
                date_received: null,
                is_featured: true,
                project_details: null
            }
        ],
        quiz_data: [
            {
                "title": "General Concepts",
                "questions": [
                    {
                        "question": "What is a primary benefit of running a \"Private AI\" locally?",
                        "options": ["Faster internet connection", "Data is not shared with external companies", "It requires more cloud storage", "It only works on mobile devices"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What does \"zero guardrails\" mean in the context of the sources?",
                        "options": ["The AI is uncensored", "The AI has no memory", "The AI cannot write code", "The AI is connected to the public cloud"],
                        "correctIndex": 0
                    },
                    {
                        "question": "According to the sources, approximately how many pre-trained models are on HuggingFace?",
                        "options": ["500,000", "1 million", "2 million plus", "10 million"],
                        "correctIndex": 2
                    },
                    {
                        "question": "Which of these is a requirement for running the \"easy\" version of local AI?",
                        "options": ["High-speed Wi-Fi", "A web browser-like download tool (Ollama)", "A monthly subscription", "A Python 2.0 environment"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What can a local AI do that mainstream AIs often block?",
                        "options": ["Search the live web", "Follow prompts for sensitive or \"unethical\" scripts", "Send emails to tech support", "Order groceries"],
                        "correctIndex": 1
                    },
                    {
                        "question": "True or False: Local AI requires an active internet connection to function once set up.",
                        "options": ["True", "False"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is the \"more advanced\" use case mentioned for local AI?",
                        "options": ["Playing video games", "Connecting a private knowledge base/documents", "Mining cryptocurrency", "Creating social media accounts"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Why might a user prefer a local AI during an internet outage?",
                        "options": ["It generates its own Wi-Fi", "It functions entirely offline", "It connects to satellite radio", "It saves battery life"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which tool is described as being as simple to download as a web browser?",
                        "options": ["PrivateGPT", "WSL", "Ollama", "Poetry"],
                        "correctIndex": 2
                    },
                    {
                        "question": "What is a \"local database ecosystem\" in this context?",
                        "options": ["A cloud server in another country", "A private, contained environment for data on your computer", "A public library of prompts", "A shared network drive"],
                        "correctIndex": 1
                    }
                ]
            },
            {
                "title": "Ollama",
                "questions": [
                    {
                        "question": "Which platforms support Ollama?",
                        "options": ["Mac only", "Linux and Mac only", "Mac, Linux, and Windows", "Windows only"],
                        "correctIndex": 2
                    },
                    {
                        "question": "What command is used to start a model in Ollama?",
                        "options": ["start ai", "ollama run [model name]", "run local-gpt", "python start.py"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What happens if you search \"uncensored\" in the Ollama library?",
                        "options": ["It returns no results", "It shows models that bypass standard restrictions", "It crashes the terminal", "It alerts the developer"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is the main limitation of standard Ollama models mentioned?",
                        "options": ["They are too slow", "They only speak English", "They were trained on public data and lack access to your private files", "They cannot be deleted"],
                        "correctIndex": 2
                    },
                    {
                        "question": "How does an uncensored model respond to \"unethical\" prompts?",
                        "options": ["It refuses to answer", "It might give a warning but provides the answer anyway", "It deletes the prompt", "It reports the user"],
                        "correctIndex": 1
                    }
                ]
            },
            {
                "title": "PrivateGPT and RAG",
                "questions": [
                    {
                        "question": "What does RAG stand for?",
                        "options": ["Rapid Access Gateway", "Retrieval Augmented Generation", "Remote AI Generation", "Random Access Grouping"],
                        "correctIndex": 1
                    },
                    {
                        "question": "PrivateGPT acts like a storage database or a _______ for your data.",
                        "options": ["Search engine", "Filing cabinet", "Virtual assistant", "Social network"],
                        "correctIndex": 0
                    },
                    {
                        "question": "Which of the following is NOT a mode in the PrivateGPT UI?",
                        "options": ["RAG (Query Files)", "Basic Chat", "Summarisation", "Image Generation"],
                        "correctIndex": 3
                    },
                    {
                        "question": "What does the \"Basic Chat\" mode in PrivateGPT do?",
                        "options": ["Summarises all uploaded files", "Uses the LLM's training data and ignores uploaded files", "Searches the internet for answers", "Deletes your private notes"],
                        "correctIndex": 1
                    },
                    {
                        "question": "In PrivateGPT, what is the purpose of \"Vector Stores\"?",
                        "options": ["To manage internet speeds", "To store document data for RAG", "To display 3D graphics", "To manage user passwords"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which mode allows you to find \"relevant chunks of text\" in specific files?",
                        "options": ["Basic Chat", "RAG/Search", "Summarisation", "Export Mode"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What happens in \"Summarisation\" mode?",
                        "options": ["The AI creates a short version of selected files", "The AI deletes the files", "The AI sends the files to a company", "The AI translates files to another language"],
                        "correctIndex": 0
                    },
                    {
                        "question": "Which file type was specifically demonstrated as being uploaded to PrivateGPT?",
                        "options": ["MP3", "PDF", "JPEG", "EXE"],
                        "correctIndex": 1
                    },
                    {
                        "question": "When PrivateGPT answers a question based on a file, what does it provide as proof?",
                        "options": ["A link to a website", "Sources and page numbers", "A timestamp", "A digital signature"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What kinds of private data can be used with PrivateGPT?",
                        "options": ["Journal entries", "Emails", "Company data", "All of the above"],
                        "correctIndex": 3
                    }
                ]
            },
            {
                "title": "Technical Requirements & Installation",
                "questions": [
                    {
                        "question": "What does WSL stand for?",
                        "options": ["Windows System Log", "Windows Subsystem for Linux", "Wide Scale Language", "Web Server Linux"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is the default Linux distribution installed with WSL in the tutorial?",
                        "options": ["Fedora", "Ubuntu", "Debian", "Mint"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which specific Python version is required to run PrivateGPT?",
                        "options": ["2.7", "3.9", "3.11", "3.12"],
                        "correctIndex": 2
                    },
                    {
                        "question": "What is pyenv used for?",
                        "options": ["Editing text files", "Managing multiple Python versions", "Encrypting your hard drive", "Speeding up the internet"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What tool is used for Python \"packaging and dependency management\"?",
                        "options": ["GitHub", "Poetry", "Ollama", "WSL"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What command is used to clone the PrivateGPT repository?",
                        "options": ["git pull", "git clone", "git download", "git copy"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which configuration file contains the model settings for PrivateGPT?",
                        "options": ["config.txt", "settings.yaml", "private.json", "setup.py"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Where must you export the pyenv root to ensure it works?",
                        "options": ["Desktop", ".bashrc file", "System BIOS", "Recycling bin"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What must be included in your \"path environment variable\" for Poetry to work?",
                        "options": ["The user's home directory", "Poetry\u2019s bin directory", "The Windows system folder", "The Downloads folder"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is the purpose of the curl command in the setup?",
                        "options": ["To delete files", "To download tools like pyenv or Poetry from the web", "To restart the computer", "To check for viruses"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which command is used to view the contents of the settings.yaml file?",
                        "options": ["open settings.yaml", "cat settings.yaml", "see settings.yaml", "show settings.yaml"],
                        "correctIndex": 1
                    },
                    {
                        "question": "How do you ensure Poetry uses the correct Python version?",
                        "options": ["It happens automatically", "You must run a specific configuration command mentioned in the sources", "You have to reinstall Windows", "You change the file extension"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is the default model used by PrivateGPT as shown in the settings.yaml?",
                        "options": ["GPT-4o", "Llama 3.1", "Claude 3", "Gemini"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Where do you find the quick start guide for PrivateGPT?",
                        "options": ["github.com", "docs.privategpt.dev", "google.com", "ollama.com"],
                        "correctIndex": 1
                    },
                    {
                        "question": "True or False: PrivateGPT installation is described as \"simpler\" than Ollama.",
                        "options": ["True", "False"],
                        "correctIndex": 1
                    }
                ]
            },
            {
                "title": "User Interface and Management",
                "questions": [
                    {
                        "question": "What is the default local URL for the PrivateGPT interface?",
                        "options": ["localhost:3000", "localhost:8000", "localhost:8001", "localhost:5000"],
                        "correctIndex": 2
                    },
                    {
                        "question": "In the source, what did the user rename the interface to?",
                        "options": ["Cyber AI", "Hivemind AI", "Private Bot", "Maddy GPT"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Which tool is used to \"ingest\" documents into the AI?",
                        "options": ["Ollama terminal", "PrivateGPT UI/RAG", "Web browser", "Windows Explorer"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is \"Hivemind AI\" an example of?",
                        "options": ["A new AI model", "A customized UI for PrivateGPT", "A cloud subscription", "A hardware component"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What does the user suggest using if the official documentation is missing information?",
                        "options": ["A specific helpful article", "Tech support", "ChatGPT", "A local library"],
                        "correctIndex": 0
                    },
                    {
                        "question": "What is the command to download a specific model into Ollama on Linux?",
                        "options": ["ollama get", "curl o llama pool [model]", "fetch model", "sudo install model"],
                        "correctIndex": 1
                    },
                    {
                        "question": "Can you change the model in PrivateGPT to an uncensored one?",
                        "options": ["No, it only uses Llama 3.1", "Yes, by changing the settings/config file", "Only if you pay for it", "Only on Linux"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What happens if you don't set up the Python virtual environment correctly?",
                        "options": ["The computer shuts down", "PrivateGPT will not run", "The AI becomes public", "The AI runs faster"],
                        "correctIndex": 1
                    },
                    {
                        "question": "What is the main role of Poetry in this ecosystem?",
                        "options": ["Writing poems", "Managing Python dependencies and packaging", "Translating code", "Increasing RAM speed"],
                        "correctIndex": 1
                    },
                    {
                        "question": "The sources recommend using local AI for which type of entries?",
                        "options": ["Public blog posts", "Private journal entries", "Twitter updates", "News articles"],
                        "correctIndex": 1
                    }
                ]
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Sovereign Intelligence: Building Your Private, Local, & Uncensored AI Knowledge Base",
        "description": "Learn to host and manage private AI systems locally on your own hardware.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs",
            "sameAs": "https://www.celorisdesigns.com"
        },
        "educationalLevel": "Intermediate to Advanced",
        "teaches": [
            "Local LLM Inference",
            "Retrieval Augmented Generation (RAG)",
            "Ollama Deployment",
            "WSL2 & Linux Environment Staging",
            "Model Quantization",
            "Private Knowledge Bases"
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
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Local AI</span>
                                <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Privacy</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">Sovereignty</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-medium italic">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        className="w-full h-full"
                                        src="https://www.youtube.com/embed/ynZOXVGFjyA?autoplay=0&rel=0"
                                        title="Sovereign Intelligence Course Preview"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </Card>
                        </div>

                        {/* Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                                </div>
                                What You'll Learn
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
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-purple-400" />
                                </div>
                                Course Content
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Shield" ? Shield :
                                        chapter.icon === "HardDrive" ? HardDrive :
                                            chapter.icon === "Terminal" ? Terminal :
                                                chapter.icon === "Database" ? Database : Cpu;
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

                                                    {(chapter as any).videoUrl && (
                                                        <div className="mt-6 rounded-xl overflow-hidden border border-slate-700/50 bg-slate-950 shadow-2xl">
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

                        {/* Tech Stack Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Cpu className="h-6 w-6 text-green-400" />
                                </div>
                                Tools You'll Use
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Core", value: "Ollama / Llama.cpp" },
                                    { label: "Systems", value: "WSL2, Docker" },
                                    { label: "Brain", value: "PrivateGPT, Chroma" },
                                    { label: "Interface", value: "Open WebUI" }
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-800/20 border border-slate-700/50">
                                        <div className="text-xs font-bold text-slate-500 uppercase mb-1">{item.label}</div>
                                        <div className="text-sm text-emerald-400 font-semibold">{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Projects Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <Globe className="h-6 w-6 text-blue-400" />
                                </div>
                                Hands-on Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "BookOpen" ? BookOpen : item.icon === "Terminal" ? Terminal : Shield;
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

                        {/* Student Reviews Section */}
                        <section className="space-y-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-pink-500/20 rounded-lg">
                                    <Users className="h-6 w-6 text-pink-400" />
                                </div>
                                Student Transmissions (Reviews)
                            </h2>
                            <TestimonialsDisplay
                                initialTestimonials={courseData.reviews}
                                layout="grid"
                                limit={10}
                                showFeatured={false}
                                className="!grid-cols-1 md:!grid-cols-2"
                            />
                        </section>

                        {/* Note on Ethics */}
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-orange-500/10 to-red-600/10 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Shield className="h-24 w-24 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 relative z-10">Note on Ethics</h3>
                            <p className="text-md text-slate-300 leading-relaxed italic relative z-10">
                                While \"uncensored\" models remove corporate guardrails, users are encouraged to utilize this freedom for academic research, creative writing, and data privacy rather than harmful activities.
                            </p>
                        </div>

                        {/* FAQ Section */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-orange-400" />
                                </div>
                                System Inquiries (FAQ)
                            </h2>
                            <Accordion type="single" collapsible className="w-full space-y-2">
                                {courseData.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border-slate-800">
                                        <AccordionTrigger className="text-slate-200 hover:text-white transition-colors text-left font-medium">{faq.question}</AccordionTrigger>
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
                                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                                        <Trophy className="h-6 w-6 text-emerald-400" />
                                    </div>
                                    Mastery Assessment: Sovereign Intelligence
                                </h2>
                                <p className="text-slate-400 mt-2">Validate your expertise in local AI deployment, privacy architectures, and RAG systems.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="Sovereign Intelligence Mastery Assessment"
                                quizDescription="Test your knowledge of privacy, hardware requirements, and local AI stack configuration."
                                quizUnits={courseData.quiz_data}
                                onCompleteMessage={(score) => {
                                    if (score >= 6) return "Sovereign Level! You are fully equipped to manage your own private AI infrastructure.";
                                    if (score >= 4) return "Privacy Advocate! You have a solid grasp of local inference and RAG fundamentals.";
                                    return "Keep Building! Review the hardware and RAG modules to strengthen your local AI knowledge.";
                                }}
                            />
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Enrollment Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-3xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-slate-900 border-0 rounded-3xl overflow-hidden shadow-2xl">
                                    <CardContent className="p-8">
                                        <div className="text-center mb-8">
                                            
                                            <div className="text-emerald-400 font-bold tracking-widest uppercase text-xs">Full Lifetime System Access</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white rounded-2xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
                                            />
                                            <Button
                                                variant="outline"
                                                className="w-full h-12 border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl flex items-center justify-center gap-2 group transition-all"
                                                onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                            >
                                                <Trophy className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                                                Take Mastery Quiz
                                            </Button>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-slate-800">
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Award className="h-5 w-5 text-emerald-400" />
                                                <span>Data Sovereignty Certification</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Shield className="h-5 w-5 text-purple-400" />
                                                <span>100% Privacy-First Architecture</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <HardDrive className="h-5 w-5 text-blue-400" />
                                                <span>Air-Gapped Setup Guide</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-300">
                                                <Zap className="h-5 w-5 text-orange-400" />
                                                <span>Local Inference Templates</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-slate-900/50 backdrop-blur-md border-slate-700/50 rounded-2xl overflow-hidden">
                                <CardHeader className="pb-4">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Protocol Lead</div>
                                    <CardTitle className="text-xl text-white">Celoris Designs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white p-2.5 shadow-lg shadow-white/10 border border-slate-200 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">Celoris Designs</h4>
                                            <p className="text-xs text-slate-400">Pioneering Data Sovereignty</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 leading-relaxed mb-6">
                                        Championing the right to private intelligence. We specialize in local LLM optimization, secure RAG architectures, and hardware-accelerated inference.
                                    </p>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-slate-800">
                                        <div className="flex items-center gap-1.5 text-slate-300">
                                            <Star className="h-4 w-4 fill-emerald-400 text-emerald-400" />
                                            <span className="font-bold">{courseData.rating}</span>
                                            <span className="text-slate-500">({courseData.students}+ Syncs)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
