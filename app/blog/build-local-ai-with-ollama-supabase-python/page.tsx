import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Brain, Database, Cpu, Layers, Workflow, ListTodo, Code2, Terminal,
    ArrowRight, Star, Shield, Zap, Info, HelpCircle,
    Share2, Users, Wand2, Phone, TrendingUp,
    Laptop, Search, Layout, Briefcase, Rocket
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata } from 'next';
import ShareButtons from '@/components/ShareButtons';

export const metadata: Metadata = {
    title: 'Build a Local AI That Remembers You — Project Series | Celoris',
    description: 'Learn how to build a private, local AI assistant using Ollama, Supabase, and Python. Class 01: Architecture, memory layers, and roadmap.',
    keywords: 'local ai, ollama, supabase, python ai agent, vector database, build your own ai, private ai, llama3 tutorial',
};

export default function BuildLocalAIBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-blue-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/Build a Local AI That.png")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-16 text-white px-4 mx-auto">
                    <Button
                        variant="ghost"
                        className="text-white w-fit mb-10 hover:bg-white/10 group bg-black/20 backdrop-blur-md border border-white/10 rounded-full pr-6"
                        asChild
                    >
                        <Link href="/blog">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </Link>
                    </Button>

                    <div className="max-w-5xl">
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <span className="bg-blue-500/20 text-blue-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-blue-500/30 backdrop-blur-md">
                                Project Series • Local AI • Python
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-blue-500" /> 12 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl text-balance">
                            Build a Local AI That <span className="text-blue-400 italic block mt-2 text-balance">Remembers You</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-bold text-slate-300 mb-8 max-w-3xl">
                            Using Ollama + Supabase + Python | Beginner to Intermediate
                        </p>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Team</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-blue-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-blue-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">May 2026</span>
                            </div>
                        </div>
                        <div className="mt-10">
                            <ShareButtons 
                                title="Build a Local AI That Remembers You — Project Series | Celoris" 
                                slug="build-local-ai-with-ollama-supabase-python" 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    {/* Metadata Badges */}
                    <div className="flex flex-wrap gap-4 mb-12">
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Level</span>
                            <span className="text-white font-bold">Intermediate</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Prerequisites</span>
                            <span className="text-white font-bold">Basic Python</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Series</span>
                            <span className="text-white font-bold">Build Your Own AI Agent</span>
                        </div>
                    </div>

                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-blue max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-blue-400 prose-strong:font-bold
                            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">What Are We Building?</h2>
                                <p className="text-xl leading-relaxed">
                                    Imagine an AI assistant that:
                                </p>
                                <ul className="space-y-4 my-10 list-none p-0">
                                    {[
                                        "Runs 100% on your own computer — no internet needed, no API charges",
                                        "Remembers every conversation you have ever had with it",
                                        "Can do tasks — read files, search the web, answer questions, write code",
                                        "Keeps your data private — nothing leaves your machine"
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 items-start bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <Check className="h-6 w-6 text-blue-500 shrink-0 mt-1" />
                                            <span className="text-slate-200 font-bold text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p>
                                    This is not a dream. With three free tools — <strong>Ollama, Supabase, and Python</strong> — you can build exactly this. This is Class 01. By the end, you will understand the full architecture. In the next classes, we will build it step by step.
                                </p>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Why Build a Local AI?</h2>
                                <p>Most AI tools like ChatGPT are cloud-based. That means:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
                                    {[
                                        "Your conversations are stored on someone else's server",
                                        "You pay per message (API costs add up fast)",
                                        "You need internet to use it",
                                        "If the company changes pricing or shuts down, you are stuck"
                                    ].map((item, i) => (
                                        <div key={i} className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl flex gap-4">
                                            <X className="h-6 w-6 text-red-500 shrink-0 mt-1" />
                                            <span className="text-slate-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="bg-green-500/10 border border-green-500/20 p-8 rounded-3xl text-green-400 font-bold mb-10">
                                    A local AI solves all of this. You run the model on your own computer. Your data stays with you. Zero cost per message. Works offline.
                                </p>
                                
                                <h3 className="text-2xl font-black text-white mb-6">Real World Use Case</h3>
                                <p>
                                    Think of a CA firm that wants an AI assistant trained on their client files. They cannot use ChatGPT because client data is confidential. A local AI is the only safe option. Same applies to hospitals, law firms, HR departments — any place where privacy matters.
                                </p>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">The Three Tools You Will Use</h2>
                                <div className="space-y-12">
                                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-blue-500/20 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-blue-500/20 p-4 rounded-2xl border border-blue-500/30">
                                                <Cpu className="h-8 w-8 text-blue-400" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white m-0">1. Ollama — Your Local AI Model Runner</h3>
                                        </div>
                                        <p className="mb-6 text-slate-400">
                                            Ollama lets you download and run large language models (LLMs) on your own computer. Think of it as the engine that powers your AI.
                                        </p>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none p-0 m-0">
                                            {["Free and open source", "Supports LLaMA 3, Mistral, Gemma", "Works on Windows, Mac, Linux", "Simple to install"].map((item, i) => (
                                                <li key={i} className="flex gap-2 items-center text-sm font-bold text-slate-300">
                                                    <Check className="h-4 w-4 text-blue-500" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-indigo-500/20 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-indigo-500/20 p-4 rounded-2xl border border-indigo-500/30">
                                                <Database className="h-8 w-8 text-indigo-400" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white m-0">2. Supabase — Your Database (Memory Storage)</h3>
                                        </div>
                                        <p className="mb-6 text-slate-400">
                                            Supabase is an open source database platform built on PostgreSQL. We use it to store:
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                                <h4 className="text-white font-bold mb-2">Chat History</h4>
                                                <p className="text-xs text-slate-500 m-0">Every message saved permanently.</p>
                                            </div>
                                            <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                                                <h4 className="text-white font-bold mb-2">Vector Embeddings</h4>
                                                <p className="text-xs text-slate-500 m-0">Mathematical meaning for smart search.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem] hover:border-green-500/20 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="bg-green-500/20 p-4 rounded-2xl border border-green-500/30">
                                                <Code2 className="h-8 w-8 text-green-400" />
                                            </div>
                                            <h3 className="text-2xl font-black text-white m-0">3. Python — The Brain</h3>
                                        </div>
                                        <p className="text-slate-400">
                                            Python is the glue. It receives your message, searches memory, sends context to Ollama, and saves replies.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">How Memory Works: Two Layers</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                                    <div className="p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20">
                                        <h4 className="text-xl font-black text-blue-400 mb-4 flex items-center gap-2">
                                            <Zap className="h-5 w-5" /> Layer 1: Short-Term
                                        </h4>
                                        <p className="text-sm text-slate-300 mb-0">
                                            Within one conversation, the AI remembers everything you said by passing the full current history to Ollama.
                                        </p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-indigo-500/10 border border-indigo-500/20">
                                        <h4 className="text-xl font-black text-indigo-400 mb-4 flex items-center gap-2">
                                            <Brain className="h-5 w-5" /> Layer 2: Long-Term
                                        </h4>
                                        <p className="text-sm text-slate-300 mb-0">
                                            Uses vector embeddings to search months-old messages for similar meanings and injects them as context.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-black/40 border border-white/10 p-8 rounded-3xl mt-8">
                                    <h4 className="text-white font-bold mb-4">The Flow of Long-Term Memory:</h4>
                                    <ol className="space-y-4 m-0 p-0 list-none">
                                        {[
                                            "You type a message",
                                            "Python converts it to a vector embedding (nomic-embed-text)",
                                            "Supabase searches old chat history for similar meanings",
                                            "Top 3-5 relevant memories are injected into the prompt",
                                            "Ollama generates a reply with full context",
                                            "New message is saved for future recall"
                                        ].map((step, i) => (
                                            <li key={i} className="flex gap-4 items-center text-slate-400 text-sm">
                                                <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-blue-500 border border-white/10 shrink-0">{i + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">What Tasks Can Your AI Do?</h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5 mb-10">
                                    <table className="w-full text-left border-collapse m-0">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-blue-400 font-black uppercase tracking-widest text-xs">Task Type</th>
                                                <th className="p-6 text-blue-400 font-black uppercase tracking-widest text-xs">How It Works</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { t: "Answer questions", h: "Uses LLM knowledge + your memory context" },
                                                { t: "Read & summarize files", h: "Python reads .txt/.pdf, passes content to Ollama" },
                                                { t: "Write and save code", h: "AI generates code, Python saves it to disk" },
                                                { t: "Remember preferences", h: "Stored in Supabase, retrieved via memory search" },
                                                { t: "Search the web", h: "Python calls search API, passes results to Ollama" },
                                                { t: "Run system commands", h: "Python executes shell commands based on AI instructions" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.t}</td>
                                                    <td className="p-6 text-slate-400">{row.h}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">7-Class Project Roadmap</h2>
                                <div className="space-y-4">
                                    {[
                                        { c: "01", t: "Architecture", b: "Understand the full system (this class)" },
                                        { c: "02", t: "Setup & Ollama", b: "Install Ollama, run first model, chat via Python" },
                                        { c: "03", t: "Supabase Setup", b: "Create database, tables, connect from Python" },
                                        { c: "04", t: "Memory System", b: "Embed messages, store and search with pgvector" },
                                        { c: "05", t: "Full Chat Loop", b: "Complete chatbot with long-term memory" },
                                        { c: "06", t: "Add Tools", b: "File reading, web search, task execution" },
                                        { c: "07", t: "Final Project", b: "Your personal AI assistant — fully working" },
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-black border border-blue-500/30">
                                                {step.c}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-1">{step.t}</h4>
                                                <p className="text-sm text-slate-500 m-0">{step.b}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">The Code Structure</h2>
                                <div className="bg-black/60 rounded-3xl p-8 border border-white/10 font-mono text-sm overflow-x-auto">
                                    <pre className="text-slate-400 m-0">
{`local-ai/
  main.py          # Main chat loop
  memory.py        # Supabase memory: save + retrieve
  embeddings.py    # Convert text to vectors using Ollama
  tools.py         # Extra abilities: files, web search
  config.py        # Settings: model name, DB URL, etc.
  requirements.txt # Python libraries needed`}
                                    </pre>
                                </div>
                                <h3 className="text-2xl font-black text-white mt-12 mb-6">A Sneak Peek: Chatting with Python</h3>
                                <div className="bg-black/60 rounded-3xl p-8 border border-white/10 font-mono text-sm overflow-x-auto relative group">
                                    <div className="absolute top-4 right-4 text-[10px] uppercase font-black tracking-widest text-slate-600 group-hover:text-blue-500 transition-colors">Python 3.10+</div>
                                    <pre className="text-blue-400 m-0">
{`import requests

response = requests.post('http://localhost:11434/api/generate', json={
    'model': 'llama3',
    'prompt': 'Hello! Who are you?',
    'stream': False
})

print(response.json()['response'])`}
                                    </pre>
                                </div>
                            </section>

                            <section className="mb-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-12 text-white flex items-center gap-4">
                                    <ListTodo className="h-10 w-10 text-blue-500" /> Your Homework
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        "Go to ollama.com and download Ollama for your OS",
                                        "Install it and run 'ollama pull llama3' in terminal",
                                        "Run 'ollama run llama3' and type 'Hello' to verify",
                                        "Create a free account at supabase.com"
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-black border border-blue-500/30 text-xs">{i + 1}</div>
                                            <p className="text-slate-300 font-medium m-0">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Ready to Build?</h2>
                                <p className="text-lg leading-relaxed mb-10 text-balance">
                                    This series is designed so that anyone with basic Python knowledge can build a production-grade AI agent. Stay tuned for Class 02 where we write our first lines of code.
                                </p>
                                <div className="bg-blue-500/10 border border-blue-500/20 p-10 md:p-16 rounded-[3rem] my-16 text-center relative overflow-hidden">
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Learn AI with Celoris</h3>
                                    <p className="text-slate-400 mb-10 text-lg">Master the hottest skills in the industry — from local LLMs to Vector Databases.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(59,130,246,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                            <Link href="https://wa.me/919084718101">
                                                <Phone className="h-6 w-6 mr-3" /> WhatsApp Query
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl w-full sm:w-auto" asChild>
                                            <Link href="/blog">All Classes</Link>
                                        </Button>
                                    </div>
                                    <Rocket className="absolute bottom-[-20px] right-[-20px] h-40 w-40 text-blue-500/10 -rotate-12" />
                                </div>
                            </section>
                        </div>

                        {/* Internal Links & Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-blue-500" /> Explore More
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {[
                                    { t: "Building Real-time Voice AI with LiveKit", l: "/blog/building-real-time-voice-ai-livekit" },
                                    { t: "Metatrader 5 Python AI Trading Automation", l: "/blog/metatrader-5-python-ai-trading-automation" },
                                    { t: "Multimodal Agentic AI Guide", l: "/blog/multimodal-agentic-ai" },
                                    { t: "Best Python for AI Course in Noida", l: "/blog/best-python-course-noida" }
                                ].map((link, i) => (
                                    <Link key={i} href={link.l} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{link.t}</span>
                                        <ArrowRight className="h-4 w-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-blue-500 mt-1" />
                                {['local ai', 'ollama', 'supabase', 'python ai', 'vector database', 'llama3', 'ai agent'].map((tag) => (
                                    <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-blue-500/20 hover:text-blue-400 transition-all cursor-default border border-white/5 hover:border-blue-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris AI Lab | Build the Future Locally
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • Class 01 of 07
                </p>
            </footer>
        </div>
    );
}
