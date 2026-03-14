"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, FileText, FlaskConical, Binary, Layers } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"
import { Trophy } from "lucide-react"

export default function PythonForAIDevelopersCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Python for AI Developers: Applied Python for ML & AI | Celoris";

        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Master Python for AI. From fundamentals to production-ready ML pipelines, LLM integrations, and agentic AI systems. 2025 Edition. 40+ Hours of deep learning. celoris.in 🇮🇳";
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
        title: "Python for AI Developers",
        subtitle: "A Comprehensive Course in Applied Python for Machine Learning & AI",
        description: "A structured, project-driven course designed for developers and engineers who want to build real-world AI applications. Go from Python fundamentals to production-ready ML pipelines, LLM integrations, and agentic AI systems.",
        students: 1240,
        rating: 4.9,
        duration: "40+ Hours (Self-paced)",
        price: 19999,
        currency: "INR",
        provider: "Celoris Team",
        learning_outcomes: [
            "Write clean, idiomatic Python code for data science and AI workflows.",
            "Build and train machine learning models with scikit-learn and PyTorch.",
            "Work with large language models (LLMs) via APIs such as OpenAI and Anthropic Claude.",
            "Design agentic AI systems with tool use, memory, and multi-step reasoning.",
            "Build REST APIs and deploy AI services to the cloud using FastAPI and Docker.",
            "Apply best practices: testing, logging, type hints, and CI/CD for AI projects."
        ],
        requirements: [
            "Basic programming experience in any language.",
            "No prior Python or ML knowledge required.",
            "A computer with at least 8GB RAM recommended for local model testing."
        ],
        chapters: [
            {
                number: 1,
                title: "Python Foundations for AI",
                icon: "Cpu",
                topics: [
                    "Setting Up Your AI Development Environment (pyenv, venv, Jupyter).",
                    "Python Language Essentials: Collections, Comprehensions, & OOP.",
                    "Advanced Features: Type hints, Generators, and Decorators.",
                    "Building a reusable AI Toolkit using dataclasses."
                ],
                duration: "4 Hours"
            },
            {
                number: 2,
                title: "Data Wrangling with Python",
                icon: "Database",
                topics: [
                    "NumPy: Numerical Computing & Vectorization.",
                    "Pandas: Structured Data Analysis & Feature Engineering.",
                    "Data Cleaning Pipelines: Handling missing values and outliers.",
                    "Lab: Building a Customer Churn Dataset Pipeline."
                ],
                duration: "5 Hours"
            },
            {
                number: 3,
                title: "Visualization & Exploratory Analysis",
                icon: "BarChart",
                topics: [
                    "Static Plotting with Matplotlib & Seaborn.",
                    "Interactive Visualizations with Plotly Express.",
                    "ML-Specific Visuals: ROC Curves, Confusion Matrices, & Loss curves.",
                    "Dimensionality reduction plots with PCA and t-SNE."
                ],
                duration: "3 Hours"
            },
            {
                number: 4,
                title: "Machine Learning Fundamentals",
                icon: "Binary",
                topics: [
                    "The ML Workflow: Training, Validation, and Testing.",
                    "scikit-learn Estimator API & Core Algorithms (Regression, Trees, SVM).",
                    "Model Evaluation: Precision, Recall, F1, and ROC-AUC.",
                    "Pipelines & Hyperparameter Tuning with Optuna."
                ],
                duration: "6 Hours"
            },
            {
                number: 5,
                title: "Deep Learning with PyTorch",
                icon: "Layers",
                topics: [
                    "PyTorch Tensors & Autograd: Understanding Gradient Flow.",
                    "Building Neural Networks with nn.Module.",
                    "The Training Loop Pattern: Optimizers & Learning Rate Schedulers.",
                    "CNNs & Transfer Learning for Image Classification."
                ],
                duration: "6 Hours"
            },
            {
                number: 6,
                title: "NLP & Text Processing",
                icon: "FileText",
                topics: [
                    "Classical Text Processing & Word Embeddings (Word2Vec, GloVe).",
                    "Transformer Models with Hugging Face (BERT, AutoModel).",
                    "Fine-tuning BERT on custom text datasets.",
                    "Vector Databases & Semantic Search fundamentals (FAISS, Pinecone)."
                ],
                duration: "5 Hours"
            },
            {
                number: 7,
                title: "Working with LLM APIs",
                icon: "Zap",
                topics: [
                    "OpenAI API: Chat Completions, Structured Outputs & Streaming.",
                    "Anthropic Claude API: Tool Use & Vision Inputs.",
                    "Prompt Engineering: Few-shot, COT, and Jinja2 templates.",
                    "Lab: Building an AI Code Review Assistant."
                ],
                duration: "5 Hours"
            },
            {
                number: 8,
                title: "Building Agentic AI Systems",
                icon: "Bot",
                topics: [
                    "The ReAct Pattern: Building Reasoning Loops from scratch.",
                    "Retrieval-Augmented Generation (RAG) Architecture.",
                    "LangChain & LlamaIndex: Frameworks for Agentic Workflows.",
                    "Lab: Building a Research Agent that summarizes PDFs & Web URLs."
                ],
                duration: "5 Hours"
            },
            {
                number: 9,
                title: "Building & Deploying AI APIs",
                icon: "Server",
                topics: [
                    "FastAPI for AI Services: Async endpoints & Pydantic models.",
                    "Testing AI Apps: Mocking LLMs and Evaluating Quality.",
                    "Containerization with Docker & Cloud Deployment patterns.",
                    "CI/CD for AI: GitHub Actions and GPU Monitoring."
                ],
                duration: "4 Hours"
            }
        ],
        faq_categories: [
            {
                title: "Prerequisites & Getting Started",
                icon: "Lightbulb",
                questions: [
                    {
                        question: "Do I need to know Python before taking this course?",
                        answer: "No prior Python knowledge is required. Module 1 is dedicated entirely to Python foundations for AI — covering syntax, data structures, OOP, type hints, and environment setup from scratch. If you have experience in any other programming language (JavaScript, Java, C++), you'll move through Module 1 quickly. The course is designed so that a motivated beginner with zero Python experience can start at M1 and arrive at building real AI systems by M8.",
                        source: "Trending on r/learnpython, r/learnmachinelearning & DeepLearning.AI community forums"
                    },
                    {
                        question: "How much math do I need to know for this course?",
                        answer: "You need a high school–level comfort with algebra and basic statistics (mean, variance, percentages). You do NOT need a degree in mathematics. Concepts like linear algebra, calculus derivatives, and probability are introduced contextually where needed — for example, when explaining gradient descent or attention mechanisms — with intuitive explanations before the equations. The course is engineering-first, not research-first.",
                        source: "Top recurring questions on Quora: 'How much math do I need for ML?'"
                    },
                    {
                        question: "I'm a software developer but not a data scientist. Is this course for me?",
                        answer: "This course was built specifically for software developers making the AI transition. The curriculum mirrors how a backend or full-stack engineer thinks: it emphasises APIs, pipelines, deployment, and system design — not statistical theory. You'll be writing FastAPI services, building Docker containers, and calling LLM APIs using patterns that feel natural if you already build software.",
                        source: "r/cscareerquestions, r/learnmachinelearning common threads"
                    },
                    {
                        question: "Is it too late to learn Python and AI in 2025?",
                        answer: "Absolutely not. The AI job market is expanding rapidly — the global ML market was valued at $19.2 billion in 2022 and is projected to reach over $225 billion by 2030. Job postings for AI and ML engineers grew over 70% from 2022 to 2025. Python remains the #1 language for AI by every major survey.",
                        source: "Quora: 'Am I too late to learn Python for AI?'"
                    }
                ]
            },
            {
                title: "Course Content & Curriculum",
                icon: "BookOpen",
                questions: [
                    {
                        question: "Why does the course use PyTorch instead of TensorFlow?",
                        answer: "PyTorch is now the dominant framework across research, startups, and increasingly in production. Most modern LLMs, diffusion models, and open-source AI models (Llama, Mistral, Stable Diffusion) are built in PyTorch. Hugging Face's entire ecosystem runs on PyTorch by default. Learning PyTorch also gives you a more intuitive, Pythonic experience.",
                        source: "r/MachineLearning, r/learnmachinelearning — 'PyTorch vs TensorFlow 2025'"
                    },
                    {
                        question: "What is RAG and why is there a whole module on it?",
                        answer: "RAG stands for Retrieval-Augmented Generation. It's the technique of giving an LLM access to your own documents or knowledge base at query time, rather than relying on what the model memorised during training. This solves two critical LLM problems: hallucination and knowledge cutoff. RAG is currently the most widely deployed production pattern for LLM applications.",
                        source: "r/LocalLLaMA, r/MachineLearning — top asked topic"
                    },
                    {
                        question: "What's the difference between using an LLM API and fine-tuning a model?",
                        answer: "Using an LLM API (like OpenAI) means calling a hosted model via HTTP — no training required, instant results. Fine-tuning means taking a pre-trained model and continuing to train it on your own data to specialise its behaviour. This course focuses primarily on API usage and prompt engineering (Module 7), which is what 90% of real-world AI applications use.",
                        source: "r/LocalLLaMA, Quora — 'API vs Fine-tuning'"
                    },
                    {
                        question: "Does this course teach AI agents? What exactly is an AI agent?",
                        answer: "Yes — Module 8 is dedicated entirely to agentic AI systems. An AI agent is a program that uses an LLM to reason about a goal, decide which tools to use, execute those tools, and iterate until the task is complete. Unlike a simple chatbot, an agent can handle multi-step workflows autonomously.",
                        source: "r/MachineLearning, r/artificial — 'What are AI agents?'"
                    },
                    {
                        question: "Is scikit-learn still worth learning with LLMs everywhere?",
                        answer: "Absolutely. Scikit-learn is the backbone of classical ML. Not every problem needs an LLM — anomaly detection, churn prediction, fraud detection, and recommendation systems are typically solved with scikit-learn. LLMs are expensive and slow for tabular/numerical problems where scikit-learn excels.",
                        source: "r/datascience — 'Is ML still relevant with LLMs?'"
                    }
                ]
            },
            {
                title: "Tools, Hardware & Setup",
                icon: "Terminal",
                questions: [
                    {
                        question: "Do I need a powerful GPU to take this course?",
                        answer: "No. The vast majority of the course runs perfectly fine on a standard laptop CPU. For Deep Learning (Module 5), the labs are designed to run on free GPU resources via Google Colab. For LLM modules, you're calling external APIs rather than running models locally, so no GPU is needed.",
                        source: "r/learnmachinelearning common question"
                    },
                    {
                        question: "Should I use Jupyter Notebooks or VS Code for this course?",
                        answer: "Both are used. Jupyter Lab is ideal for exploratory data analysis (Modules 2–4). VS Code is better for writing application code, building APIs, and working on larger codebases (Modules 7–9). Most AI developers use both, and the course reflects this workflow.",
                        source: "r/learnpython — 'Jupyter vs VS Code for ML'"
                    },
                    {
                        question: "What Python version should I use?",
                        answer: "Python 3.11 or 3.12 is recommended. Python 3.11 introduced significant performance improvements and is currently the most battle-tested version for AI libraries. The course walks you through installing Python 3.11 via pyenv to manage versions cleanly.",
                        source: "r/Python, r/learnpython version confusion questions"
                    }
                ]
            },
            {
                title: "Career, Jobs & Salary",
                icon: "Award",
                questions: [
                    {
                        question: "What jobs can I get after completing this course?",
                        answer: "This course prepares you for roles like: AI/ML Engineer, LLM Application Developer, Applied Data Scientist, AI Backend Engineer, and MLOps Engineer. The curriculum focuses on production-ready skills that employers in 2025 are actively seeking.",
                        source: "r/cscareerquestions, r/datascience role analysis"
                    },
                    {
                        question: "How long will it take to complete the course and be job-ready?",
                        answer: "The course contains 40+ hours of instruction. At 10 hours/week, you can complete it in 5–6 weeks. Being 'job-ready' depends on your background; entry-level LLM dev roles may be accessible after 3–4 months of focused practice and building a portfolio using the course projects.",
                        source: "Quora experts & Coursera 2025 data"
                    },
                    {
                        question: "Is Python still the right language to learn for AI in 2025?",
                        answer: "Python's position is stronger than ever. Every major AI framework (PyTorch, LangChain, etc.) uses Python as its primary interface. While Rust/C++ are used for performance runtimes, the application layer where most jobs live is overwhelmingly Python.",
                        source: "Stack Overflow 2025 Survey"
                    },
                    {
                        question: "Do I need a degree in computer science to get an AI job?",
                        answer: "Not necessarily. While research labs may require advanced degrees, most AI engineering jobs — building applications and deploying models — value demonstrated skills and portfolio projects over credentials. What you've built matters most.",
                        source: "Quora: 'Do I need a degree to work in AI/ML?'"
                    }
                ]
            },
            {
                title: "Technical Concepts Explained",
                icon: "Cpu",
                questions: [
                    {
                        question: "What's the difference between AI, Machine Learning, and Deep Learning?",
                        answer: "They are nested concepts: AI is anything that makes machines appear intelligent. Machine Learning is a subset where models learn from data. Deep Learning is a subset of ML using neural networks — it powers Modern LLMs and image recognition.",
                        source: "Top searched AI question on Google"
                    },
                    {
                        question: "What is overfitting and how do I know if my model is overfitting?",
                        answer: "Overfitting happens when your model learns training noise rather than general patterns, causing it to fail on new data. Signs include high training accuracy but poor validation performance. We cover solutions like regularisation and dropout in Module 4.",
                        source: "r/learnmachinelearning beginner FAQ"
                    },
                    {
                        question: "What is a Large Language Model (LLM) and how is it different from traditional ML?",
                        answer: "A traditional ML model makes specific predictions on structured data. An LLM is trained on vast amounts of text to generate coherent language and follow complex instructions. LLMs are general-purpose intelligence layers controlled via prompts.",
                        source: "r/MachineLearning explanation request"
                    },
                    {
                        question: "How does overfitting relate to bias and variance?",
                        answer: "Bias is error from being too simple (underfitting); variance is error from being too complex (overfitting). AI engineering is about balancing both to capture real signal without memorising noise.",
                        source: "r/learnmachinelearning perennial topic"
                    }
                ]
            }
        ],
        projects: [
            {
                title: "Customer Churn Predictor",
                description: "End-to-end ML pipeline from data cleaning to model export.",
                tools: "Pandas + scikit-learn",
                icon: "BarChart"
            },
            {
                title: "Research Agent",
                description: "Autonomous agent that researches topics and builds RAG context.",
                tools: "Claude + LangChain + FAISS",
                icon: "Bot"
            },
            {
                title: "AI Summarizer Service",
                description: "Deployed API service with Docker and CI/CD automation.",
                tools: "FastAPI + Docker + GCP",
                icon: "Server"
            }
        ],
        quiz_data: [
            {
                title: "Python & Data foundations",
                questions: [
                    {
                        question: "Which Python feature is best for creating a memory-efficient data pipeline?",
                        options: ["Lists", "Generators", "Dictionaries", "Tuples"],
                        correctIndex: 1
                    },
                    {
                        question: "In NumPy, what is 'broadcasting'?",
                        options: ["Sending data to a server", "Performing operations on arrays of different shapes", "Sharing code on GitHub", "Converting Python to C++"],
                        correctIndex: 1
                    }
                ]
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "Python for AI Developers",
        "description": "Master Python for AI, Machine Learning, and Agentic Systems.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris",
            "sameAs": "https://www.celoris.in"
        },
        "educationalLevel": "Beginner to Advanced",
        "teaches": [
            "Applied Python",
            "Machine Learning",
            "Deep Learning with PyTorch",
            "LLM API Integration",
            "Agentic AI Development",
            "FastAPI Deployment"
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6 font-medium uppercase tracking-wider italic">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic">{courseData.title}</span>
                </div>

                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-8 transition-all group font-black uppercase tracking-widest italic text-xs">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-16">
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">2025 Edition</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Python for AI</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Agentic Systems</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-none">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-black italic uppercase tracking-tight">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {courseData.description}
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/python-ai-course.png"
                                        alt="Course Preview"
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                    <div className="absolute flex items-center justify-center">
                                        <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-3xl shadow-emerald-600/50 hover:scale-110 transition-transform cursor-pointer">
                                            <Play className="h-8 w-8 text-white fill-current ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                </div>
                                Mastery Roadmap
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <BookOpen className="h-8 w-8 text-purple-500" />
                                </div>
                                Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const Icon = chapter.icon === "Cpu" ? Cpu :
                                        chapter.icon === "Database" ? Database :
                                            chapter.icon === "BarChart" ? BarChart :
                                                chapter.icon === "Binary" ? Binary :
                                                    chapter.icon === "Layers" ? Layers :
                                                        chapter.icon === "FileText" ? FileText :
                                                            chapter.icon === "Zap" ? Zap :
                                                                chapter.icon === "Bot" ? Bot : Server;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-white/5 bg-[#0d1321]/40 rounded-[2rem] px-4 overflow-hidden shadow-xl">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 italic">Module {chapter.number}</div>
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{chapter.title}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest italic mr-6 bg-white/5 px-4 py-1.5 rounded-full">
                                                        <Clock className="h-4 w-4 text-emerald-500/50" />
                                                        {chapter.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400">
                                                <div className="pl-20 space-y-4 relative">
                                                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent" />
                                                    <ul className="grid grid-cols-1 gap-4">
                                                        {chapter.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-4 group">
                                                                <div className="h-2 w-2 rounded-full bg-emerald-500/40 mt-2.5 group-hover:bg-emerald-500 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                                <span className="text-sm font-bold uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors leading-relaxed">{topic}</span>
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

                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <FlaskConical className="h-8 w-8 text-blue-500" />
                                </div>
                                Applied AI Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {courseData.projects.map((item, index) => {
                                    const Icon = item.icon === "BarChart" ? BarChart : item.icon === "Bot" ? Bot : Server;
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-[#0d1321] to-[#00120d] border-white/5 hover:border-emerald-500/30 transition-all duration-500 group rounded-[2.5rem] shadow-2xl">
                                            <CardContent className="pt-10 text-center h-full flex flex-col px-8">
                                                <div className="mx-auto bg-white/5 p-5 w-fit rounded-2xl border border-white/10 mb-8 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-500">
                                                    <Icon className="h-10 h-10 text-emerald-500" />
                                                </div>
                                                <h3 className="text-xl font-black text-white italic uppercase mb-3 tracking-tighter">{item.title}</h3>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6 flex-grow leading-relaxed italic">{item.description}</p>
                                                <div className="text-[9px] font-black bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-500 tracking-[0.2em] uppercase italic">
                                                    {item.tools}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                            </div>
                        </section>

                        <section className="space-y-12 bg-[#0d1321]/20 p-12 rounded-[3rem] border border-white/5 shadow-inner">
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Everything You Need to Know</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Sourced from Reddit, Quora & Developer Communities — 2025</p>
                            </div>

                            <div className="space-y-16">
                                {courseData.faq_categories.map((category, catIndex) => {
                                    const CatIcon = category.icon === "Lightbulb" ? Lightbulb :
                                        category.icon === "BookOpen" ? BookOpen :
                                            category.icon === "Terminal" ? Terminal :
                                                category.icon === "Award" ? Award : Cpu;
                                    return (
                                        <div key={catIndex} className="space-y-8">
                                            <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                                                <CatIcon className="h-6 w-6 text-emerald-500" />
                                                <h3 className="text-xl font-black text-emerald-400 italic uppercase tracking-widest">{category.title}</h3>
                                            </div>
                                            <div className="grid grid-cols-1 gap-6">
                                                {category.questions.map((faq, faqIndex) => (
                                                    <div key={faqIndex} className="group bg-[#0d1321]/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all shadow-lg hover:shadow-emerald-500/5">
                                                        <div className="flex gap-6">
                                                            <div className="text-2xl font-black text-white/10 group-hover:text-emerald-500/20 transition-colors italic">Q{faqIndex + 1}</div>
                                                            <div className="space-y-4">
                                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">{faq.question}</h4>
                                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{faq.answer}</p>
                                                                <div className="flex items-center gap-2 pt-2">
                                                                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Source: {faq.source}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </section>

                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Bot className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Beyond the Basics</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10">
                                "This course doesn't just teach you how to code in Python; it teaches you how to think like an AI Architect. You will build systems that reason, act, and learn—all from scratch."
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">₹{courseData.price.toLocaleString()}</div>
                                        <div className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Premium Training Bundle</div>
                                    </div>

                                    <div className="space-y-4 mb-10 text-slate-400">
                                        <CourseInquiryDialog
                                            courseTitle={courseData.title}
                                            buttonClassName="w-full h-16 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-[0.3em] rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all active:scale-95 italic"
                                        />
                                        <Link
                                            href="https://wa.me/919084718101"
                                            target="_blank"
                                            className="w-full h-14 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl flex items-center justify-center gap-3 group transition-all italic"
                                        >
                                            <Radio className="h-4 w-4 text-emerald-500 group-hover:animate-pulse" />
                                            Inquire on WhatsApp
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Official AI Certification", color: "text-emerald-500" },
                                            { icon: Code, text: "40+ Hours of Code Labs", color: "text-blue-500" },
                                            { icon: Users, text: "Direct Trainer Access", color: "text-purple-500" },
                                            { icon: Zap, text: "Production Ready Pipelines", color: "text-orange-500" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic group">
                                                <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <CardHeader className="pb-4 px-10 pt-10">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Instructor</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">{courseData.provider}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        The Celoris core team consists of elite AI engineers and education specialists dedicated to making cutting-edge technology accessible to developers in India and beyond.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>{courseData.rating} Rating</span>
                                        </div>
                                        <div className="text-slate-500">
                                            {courseData.students}+ Students
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="p-10 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 shadow-xl">
                                <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-6 flex items-center gap-3">
                                    <Lightbulb className="h-6 w-6 text-yellow-500" />
                                    Prerequisites
                                </h3>
                                <ul className="space-y-4">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40 mt-1.5 flex-shrink-0 group-hover:bg-emerald-500 transition-colors" />
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
