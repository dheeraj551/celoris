"use client"

import { useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Lightbulb, Cpu, Radio, BarChart, Server, Bot, Database, Code, Terminal, Layers, Brain, FlaskConical, Package } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function EssentialPythonForAIDevelopment() {
    useEffect(() => {
        document.title = "Essential Python for AI Development — Beginner to Intermediate | Celoris"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "A practical 10-hour curriculum taking you from Python basics to building real AI-powered applications. Learn NumPy, APIs, scikit-learn, PyTorch, and HuggingFace. celoris.in 🇮🇳"
        if (metaDescription) {
            metaDescription.setAttribute("content", descriptionText)
        } else {
            const meta = document.createElement("meta")
            meta.name = "description"
            meta.content = descriptionText
            document.head.appendChild(meta)
        }
    }, [])

    const courseData = {
        title: "Essential Python for AI Development",
        subtitle: "From Python Basics to Real AI-Powered Applications",
        description:
            "A practical 10-hour curriculum taking you from Python basics to building real AI-powered applications. Each module is tightly scoped, hands-on, and immediately useful — whether you're a complete beginner or a non-Python developer crossing over into AI.",
        students: 890,
        rating: 4.8,
        duration: "10 Hours (Self-paced)",
        price: 9999,
        currency: "INR",
        provider: "Celoris Team",
        badges: ["Beginner → Intermediate", "Self-paced", "AI-focused"],
        stats: [
            { label: "Total hours", value: "10" },
            { label: "Modules", value: "7" },
            { label: "Topics covered", value: "35+" },
            { label: "Hands-on projects", value: "5" },
        ],
        learning_outcomes: [
            "Set up a professional Python development environment from scratch.",
            "Write clean, reusable Python code using functions, OOP, and file I/O.",
            "Work with NumPy for numerical computing — the backbone of AI.",
            "Call real-world AI APIs: OpenAI, Gemini, and Anthropic.",
            "Train and evaluate ML models using scikit-learn.",
            "Build neural networks and work with transformers via HuggingFace.",
            "Complete a capstone project: a fully functional AI-powered application.",
        ],
        requirements: [
            "A computer (Windows, Mac, or Linux).",
            "No prior Python or programming knowledge required.",
            "Curiosity and commitment to build real things.",
        ],
        modules: [
            {
                number: 1,
                title: "Python Fundamentals & Environment Setup",
                subtitle: "Install Python, VS Code, understand the basics",
                icon: "Terminal",
                duration: "1.5 hrs",
                topics: [
                    "Installing Python 3.12 and configuring VS Code",
                    "Variables, data types, and type conversion",
                    "Conditionals, loops, and flow control",
                    "Lists, tuples, dictionaries, and sets",
                    "Your first Python script: a smart calculator",
                ],
            },
            {
                number: 2,
                title: "Functions, OOP & File Handling",
                subtitle: "Write reusable code, work with files & JSON",
                icon: "Code",
                duration: "1.5 hrs",
                topics: [
                    "Defining functions, parameters, and return values",
                    "Lambda functions and higher-order functions",
                    "Classes, objects, inheritance, and encapsulation",
                    "Reading and writing text, CSV, and JSON files",
                    "Building a reusable data-processing module",
                ],
            },
            {
                number: 3,
                title: "NumPy & Data Manipulation",
                subtitle: "Numerical computing — the backbone of AI",
                icon: "BarChart",
                duration: "1.5 hrs",
                topics: [
                    "NumPy arrays vs Python lists — why it matters",
                    "Array creation, slicing, and reshaping",
                    "Broadcasting and vectorised operations",
                    "Matrix multiplication and linear algebra basics",
                    "Lab: Processing a real dataset with NumPy only",
                ],
            },
            {
                number: 4,
                title: "APIs, HTTP & Working with AI Services",
                subtitle: "Connect Python to OpenAI, Gemini, Anthropic APIs",
                icon: "Zap",
                duration: "1.5 hrs",
                topics: [
                    "HTTP fundamentals: GET, POST, headers, and JSON",
                    "Using the `requests` library with authentication",
                    "Calling the OpenAI Chat Completions API",
                    "Calling Google Gemini and Anthropic Claude APIs",
                    "Building a multi-provider AI chatbot script",
                ],
            },
            {
                number: 5,
                title: "Machine Learning with scikit-learn",
                subtitle: "Train, evaluate, and deploy ML models",
                icon: "Brain",
                duration: "1.5 hrs",
                topics: [
                    "The ML workflow: data → features → train → evaluate",
                    "scikit-learn Estimator API and pipeline pattern",
                    "Linear Regression, Decision Trees, and Random Forests",
                    "Model evaluation: Accuracy, Precision, Recall, F1",
                    "Lab: Predicting house prices with a real dataset",
                ],
            },
            {
                number: 6,
                title: "Deep Learning & Transformers (PyTorch + HuggingFace)",
                subtitle: "Neural networks, embeddings, and pre-trained models",
                icon: "Layers",
                duration: "1.5 hrs",
                topics: [
                    "PyTorch tensors, autograd, and the training loop",
                    "Building a simple neural network with nn.Module",
                    "Introduction to the Transformer architecture",
                    "Using HuggingFace pipelines for text classification",
                    "Generating embeddings and semantic similarity search",
                ],
            },
            {
                number: 7,
                title: "Capstone — Build an AI-Powered Application",
                subtitle: "Tie everything together in one real project",
                icon: "FlaskConical",
                duration: "1 hr",
                topics: [
                    "Project planning: scoping an AI application",
                    "Combining an LLM API with a scikit-learn model",
                    "Building a FastAPI endpoint to serve predictions",
                    "Testing, packaging, and sharing your project",
                    "Code review and improvement strategies",
                ],
            },
        ],
        projects: [
            {
                title: "Smart CLI Calculator",
                description: "Your first Python script using control flow and functions.",
                tools: "Python 3.12",
                icon: "Terminal",
            },
            {
                title: "Dataset Pipeline",
                description: "Process and analyse a real CSV dataset using NumPy.",
                tools: "NumPy + CSV",
                icon: "BarChart",
            },
            {
                title: "Multi-Provider AI Chatbot",
                description: "A script that calls OpenAI, Gemini, and Claude APIs.",
                tools: "requests + OpenAI + Gemini",
                icon: "Bot",
            },
            {
                title: "ML Price Predictor",
                description: "Train a regression model on a real housing dataset.",
                tools: "scikit-learn + Pandas",
                icon: "Database",
            },
            {
                title: "AI-Powered App (Capstone)",
                description: "A full app combining an LLM API and a ML model via FastAPI.",
                tools: "FastAPI + OpenAI + scikit-learn",
                icon: "Server",
            },
        ],
        faq: [
            {
                question: "Do I need programming experience to start?",
                answer:
                    "No. Module 1 starts from absolute zero — installing Python and writing your very first script. If you've never coded before, this course is designed for you. If you already know another language, you'll fly through the first two modules.",
            },
            {
                question: "How is this different from the Python Mega Course?",
                answer:
                    "The Python Mega Course (80+ hours, 20 apps) is a comprehensive deep-dive for those who want to master Python holistically. This course is a 10-hour fast-track specifically structured around what you need to start building AI applications — nothing more, nothing less.",
            },
            {
                question: "Will I be able to call real AI APIs like ChatGPT?",
                answer:
                    "Yes. Module 4 covers calling the OpenAI, Google Gemini, and Anthropic Claude APIs using real Python code. You'll build a working multi-provider chatbot script by the end of that module.",
            },
            {
                question: "Do I need a GPU for the Deep Learning module?",
                answer:
                    "No GPU required. The PyTorch examples in Module 6 are deliberately designed to run on CPU. For the HuggingFace exercises, we use small, efficient models that run comfortably on any modern laptop.",
            },
            {
                question: "What will I have built by the end?",
                answer:
                    "5 hands-on projects including a multi-provider AI chatbot, an ML price predictor, and a Capstone AI application served via a FastAPI endpoint — all portfolio-ready and shareable on GitHub.",
            },
        ],
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: "Essential Python for AI Development",
        description:
            "A practical 10-hour curriculum taking you from Python basics to building real AI-powered applications.",
        provider: {
            "@type": "Organization",
            name: "Celoris",
            sameAs: "https://www.celoris.in",
        },
        educationalLevel: "Beginner to Intermediate",
        teaches: [
            "Python Fundamentals",
            "NumPy and Data Manipulation",
            "AI API Integration",
            "Machine Learning with scikit-learn",
            "Deep Learning with PyTorch",
            "HuggingFace Transformers",
        ],
    }

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "Terminal": return Terminal
            case "Code": return Code
            case "BarChart": return BarChart
            case "Zap": return Zap
            case "Brain": return Brain
            case "Layers": return Layers
            case "FlaskConical": return FlaskConical
            case "Bot": return Bot
            case "Database": return Database
            case "Server": return Server
            case "Package": return Package
            default: return Cpu
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
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
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Beginner → Intermediate
                                </span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Self-Paced
                                </span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    AI-Focused
                                </span>
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

                        {/* Hero Image */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/essential-python-ai-cover.png"
                                        alt="Essential Python for AI Development Course"
                                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-700"
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

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {courseData.stats.map((stat, i) => (
                                <div key={i} className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 text-center">
                                    <div className="text-3xl font-black text-white italic">{stat.value}</div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Learning Outcomes */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <CheckCircle className="h-8 w-8 text-emerald-500" />
                                </div>
                                What You'll Master
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

                        {/* Curriculum */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <BookOpen className="h-8 w-8 text-purple-500" />
                                </div>
                                Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.modules.map((module, index) => {
                                    const Icon = getIcon(module.icon)
                                    return (
                                        <AccordionItem key={index} value={`module-${index}`} className="border border-white/5 bg-[#0d1321]/40 rounded-[2rem] px-4 overflow-hidden shadow-xl">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 italic">Module {module.number}</div>
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{module.title}</div>
                                                        <div className="text-[11px] text-slate-400 font-medium mt-1 italic">{module.subtitle}</div>
                                                    </div>
                                                    <div className="hidden sm:flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest italic mr-6 bg-white/5 px-4 py-1.5 rounded-full">
                                                        <Clock className="h-4 w-4 text-emerald-500/50" />
                                                        {module.duration}
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400">
                                                <div className="pl-20 space-y-4 relative">
                                                    <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent" />
                                                    <ul className="grid grid-cols-1 gap-4">
                                                        {module.topics.map((topic, topicIndex) => (
                                                            <li key={topicIndex} className="flex items-start gap-4 group">
                                                                <div className="h-2 w-2 rounded-full bg-emerald-500/40 mt-2.5 group-hover:bg-emerald-500 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                                <span className="text-sm font-bold uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors leading-relaxed">{topic}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </section>

                        {/* Projects */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <FlaskConical className="h-8 w-8 text-blue-500" />
                                </div>
                                5 Hands-On Projects
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courseData.projects.map((item, index) => {
                                    const Icon = getIcon(item.icon)
                                    return (
                                        <Card key={index} className="bg-gradient-to-br from-[#0d1321] to-[#00120d] border-white/5 hover:border-emerald-500/30 transition-all duration-500 group rounded-[2.5rem] shadow-2xl">
                                            <CardContent className="pt-10 text-center h-full flex flex-col px-8 pb-8">
                                                <div className="mx-auto bg-white/5 p-5 w-fit rounded-2xl border border-white/10 mb-6 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-500">
                                                    <Icon className="h-10 w-10 text-emerald-500" />
                                                </div>
                                                <h3 className="text-lg font-black text-white italic uppercase mb-3 tracking-tighter">{item.title}</h3>
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

                        {/* FAQ */}
                        <section className="space-y-12 bg-[#0d1321]/20 p-12 rounded-[3rem] border border-white/5 shadow-inner">
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Frequently Asked Questions</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Everything you need to know before starting</p>
                            </div>
                            <div className="space-y-6">
                                {courseData.faq.map((item, index) => (
                                    <div key={index} className="group bg-[#0d1321]/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all shadow-lg hover:shadow-emerald-500/5">
                                        <div className="flex gap-6">
                                            <div className="text-2xl font-black text-white/10 group-hover:text-emerald-500/20 transition-colors italic">Q{index + 1}</div>
                                            <div className="space-y-3">
                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">{item.question}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Closing CTA banner */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Brain className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">The Fastest Path to AI</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10">
                                "10 hours. No fluff. Real AI applications. This is the course you wish existed when you started."
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            {/* Pricing Card */}
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2">₹{courseData.price.toLocaleString()}</div>
                                        <div className="text-emerald-500 font-black tracking-[0.3em] uppercase text-[10px] italic">Fast-Track AI Bundle</div>
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
                                            { icon: Award, text: "Course Certificate", color: "text-emerald-500" },
                                            { icon: Code, text: "5 Portfolio Projects", color: "text-blue-500" },
                                            { icon: Users, text: "Trainer Support", color: "text-purple-500" },
                                            { icon: Zap, text: "10 Hours Self-Paced", color: "text-orange-500" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic group">
                                                <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructor Card */}
                            <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <CardHeader className="pb-4 px-10 pt-10">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Instructor</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">{courseData.provider}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        The Celoris core team builds production AI systems and distils hard-won knowledge into practical, no-fluff learning experiences for developers in India and beyond.
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

                            {/* Prerequisites Card */}
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
