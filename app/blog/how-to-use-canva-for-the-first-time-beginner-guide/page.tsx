'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Zap, ListChecks, HelpCircle,
    ArrowRight, Star, Shield, Info,
    BookOpen, GraduationCap, Timer, AlertCircle,
    Layout, Database, PenTool, Box, Smartphone,
    Share2, Megaphone, Sparkles, TrendingUp, Users, Heart,
    Search, Home, Layers, MousePointer2, Settings, Download, Monitor
} from "lucide-react";

export default function CanvaBeginnerBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-canva-beginner-guide.png")'
                    }}
                />
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

                <div className="container relative h-full flex flex-col justify-end pb-16 text-white px-4">
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
                            <span className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md">
                                Design • Canva
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                            <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Beginner Friendly
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-4 leading-[1.1] tracking-tighter text-white drop-shadow-2xl italic uppercase">
                            CANVA MASTERY SERIES <span className="text-emerald-400">— MODULE 1</span>
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-bold text-white/90 mb-8 leading-tight">
                            How to Use Canva for the First Time: A Complete Beginner's Guide to the Interface
                        </h2>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Editorial</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Insight</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">April 4, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <article className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg">
                                    "If you've ever spent hours trying to make a WhatsApp status look good, or paid someone just to design a simple Instagram post — this article is for you."
                                </p>
                            </div>

                            <p>Canva is a free, browser-based design tool used by over 170 million people worldwide. It's the go-to tool for small business owners, content creators, students, and social media managers who want professional-looking designs without any prior design experience.</p>
                            
                            <p>But here's the thing — most beginners open Canva, feel overwhelmed by all the options, and close the tab. Sound familiar?</p>
                            
                            <p>This guide will fix that. By the time you finish reading, you'll know exactly where everything is, what it does, and how to start your first design with confidence.</p>

                            <div className="bg-white/5 border border-emerald-500/20 p-8 rounded-3xl my-12 text-center">
                                <p className="text-2xl font-black text-white italic mb-2">"You don't need to be a designer to design beautifully. You just need the right tool — and five minutes to learn it."</p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Sparkles className="h-10 w-10 text-emerald-500" />
                                What Is Canva and Why Does Everyone Use It?
                            </h2>
                            <p>Canva launched in 2013 with one simple idea: make design accessible to everyone. Today it's one of the most downloaded apps in the world, and it's completely free to use for most features.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                                <div className="bg-emerald-500/5 p-8 rounded-[2.5rem] border border-emerald-500/10 hover:border-emerald-500/30 transition-all">
                                    <h3 className="text-emerald-400 font-black mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                        <Check className="h-5 w-5" /> What Canva Does Well
                                    </h3>
                                    <ul className="space-y-3 text-slate-300 font-bold italic list-none p-0">
                                        <li>• Zero learning curve for basics</li>
                                        <li>• 250,000+ free templates</li>
                                        <li>• Works on phone and laptop</li>
                                        <li>• Millions of free stock photos</li>
                                        <li>• Collaboration with teams</li>
                                        <li>• Export as PNG, PDF, MP4, GIF</li>
                                    </ul>
                                </div>
                                <div className="bg-cyan-500/5 p-8 rounded-[2.5rem] border border-cyan-500/10 hover:border-cyan-500/30 transition-all">
                                    <h3 className="text-cyan-400 font-black mb-6 uppercase tracking-widest italic flex items-center gap-2">
                                        <Users className="h-5 w-5" /> Who Uses Canva?
                                    </h3>
                                    <ul className="space-y-3 text-slate-300 font-bold italic list-none p-0">
                                        <li>• Instagram creators & influencers</li>
                                        <li>• Small business owners</li>
                                        <li>• Students making presentations</li>
                                        <li>• Digital marketers & agencies</li>
                                        <li>• Coaches, trainers & educators</li>
                                        <li>• NGOs and event organizers</li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white italic uppercase tracking-tighter">
                                Getting Started: Create Your Free Account
                            </h2>
                            <p>Before exploring the interface, you need an account. Here's the fastest way:</p>
                            <div className="space-y-4 my-8">
                                <ol className="list-decimal list-inside space-y-4 text-lg">
                                    <li className="font-bold text-slate-200">Go to <a href="https://canva.com" target="_blank" className="text-emerald-400 underline">canva.com</a> on your browser (Chrome recommended)</li>
                                    <li className="font-bold text-slate-200">Click <strong className="text-white">'Sign up'</strong> — use your Google account for the fastest login</li>
                                    <li className="font-bold text-slate-200">Select your use case: 'Personal', 'Small Business', 'Education', etc.</li>
                                    <li className="font-bold text-slate-200">You're in! Your dashboard is ready.</li>
                                </ol>
                            </div>

                            <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-6 rounded-r-2xl my-8">
                                <p className="text-emerald-400 font-black mb-1 uppercase tracking-widest flex items-center gap-2">
                                    <Info className="h-5 w-5" /> Pro Tip
                                </p>
                                <p className="text-slate-200 italic mb-0">
                                    Students and teachers can apply for **Canva for Education** — it's completely free and unlocks most Pro features including Brand Kit.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Layout className="h-10 w-10 text-emerald-500" />
                                The Canva Dashboard: Your Design Home
                            </h2>
                            <p>The first thing you'll see after logging in is the Canva Dashboard. Think of this as your design home base.</p>

                            <h3 className="text-2xl font-black mt-12 mb-6 text-white uppercase italic tracking-tight flex items-center gap-3">
                                <Search className="h-6 w-6 text-emerald-500" /> The Search Bar (Top Center)
                            </h3>
                            <p>This is the most powerful part of the dashboard. Type anything here — 'Instagram post', 'YouTube thumbnail', 'birthday invitation', 'LinkedIn banner' — and Canva instantly shows you templates sized perfectly for that platform.</p>
                            
                            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl my-6">
                                <p className="text-emerald-400 font-bold uppercase tracking-widest mb-2 italic">Try This Right Now:</p>
                                <p className="text-slate-300 italic mb-0">Search for <strong>'Instagram Post'</strong>. You'll see hundreds of free templates at exactly 1080x1080px — the perfect size for Instagram.</p>
                            </div>

                            <h3 className="text-2xl font-black mt-12 mb-6 text-white uppercase italic tracking-tight flex items-center gap-3">
                                <Home className="h-6 w-6 text-emerald-500" /> Home Feed (Center)
                            </h3>
                            <p>The home feed shows you:</p>
                            <ul className="list-disc list-inside space-y-2 mb-8">
                                <li><strong>Your recent designs</strong> — so you can pick up where you left off</li>
                                <li><strong>Suggested templates</strong> based on your use case</li>
                                <li><strong>Featured collections</strong> curated by Canva's design team</li>
                                <li><strong>Quick-access buttons</strong> for the most common design types</li>
                            </ul>
                            <p>You'll also see a <strong className="text-white">'Create a Design'</strong> button in the top-right corner — this is your shortcut to start any new design instantly.</p>

                            <h3 className="text-2xl font-black mt-12 mb-6 text-white uppercase italic tracking-tight flex items-center gap-3">
                                <Layers className="h-6 w-6 text-emerald-500" /> Left Sidebar Navigation
                            </h3>
                            <div className="overflow-x-auto my-8">
                                <table className="w-full border-collapse bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                                    <thead>
                                        <tr className="bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-widest text-xs">
                                            <th className="p-4 text-left border-b border-white/10">Section</th>
                                            <th className="p-4 text-left border-b border-white/10">What It Does</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium">
                                        <tr className="border-b border-white/5">
                                            <td className="p-4 text-white font-bold italic">🏠 Home</td>
                                            <td className="p-4 text-slate-400">Returns to your main dashboard from anywhere</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <td className="p-4 text-white font-bold italic">📝 Templates</td>
                                            <td className="p-4 text-slate-400">Browse all 250,000+ templates by category</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <td className="p-4 text-white font-bold italic">📁 Projects</td>
                                            <td className="p-4 text-slate-400">All your saved and in-progress designs</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <td className="p-4 text-white font-bold italic">📄 Brand Hub</td>
                                            <td className="p-4 text-slate-400">Your Brand Kit: logos, colors, fonts (Free & Pro)</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <td className="p-4 text-white font-bold italic">👥 Shared With You</td>
                                            <td className="p-4 text-slate-400">Designs shared by collaborators or team members</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-white font-bold italic">🗑️ Trash</td>
                                            <td className="p-4 text-slate-400">Deleted designs (can be recovered within 30 days)</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Monitor className="h-10 w-10 text-emerald-500" />
                                Inside the Editor: Your Design Workspace
                            </h2>
                            <p>Once you open or create a design, you enter the Canva Editor — the actual workspace where the magic happens. This is where 90% of your time will be spent.</p>

                            <h3 className="text-2xl font-black mt-12 mb-6 text-white uppercase italic tracking-tight">1. The Left Panel — Your Design Toolkit</h3>
                            <p>This panel is your toolkit. It stays on the left side of the editor and gives you access to everything you can add to your design:</p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0 my-8">
                                {[
                                    { title: "Templates", desc: "Switch to a different template instantly" },
                                    { title: "Elements", desc: "Shapes, icons, stickers, grids, and frames" },
                                    { title: "Text", desc: "Add headings or body text with one click" },
                                    { title: "Photos & Videos", desc: "Millions of free stock assets" },
                                    { title: "Uploads", desc: "Your own images, logos, and videos" },
                                    { title: "Apps", desc: "QR codes, GIPHY, and integrations" }
                                ].map((item, i) => (
                                    <li key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all flex items-start gap-3">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <Check className="h-3 w-3 text-emerald-500" />
                                        </div>
                                        <div>
                                            <strong className="text-white block mb-1 uppercase tracking-tighter italic">{item.title}</strong>
                                            <span className="text-xs text-slate-400 font-medium italic">{item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl my-12 shadow-inner">
                                <p className="text-emerald-400 font-black mb-2 uppercase tracking-widest italic flex items-center gap-2">
                                    <HelpCircle className="h-5 w-5" /> Beginner Tip:
                                </p>
                                <p className="text-slate-300 text-lg font-bold italic leading-relaxed mb-0">
                                    Start with the **Elements** section. It has frames (pre-shaped image holders), grids for photo collages, and thousands of free icons organized by category. This one section alone can transform your designs.
                                </p>
                            </div>

                            <h3 className="text-2xl font-black mt-12 mb-6 text-white uppercase italic tracking-tight">2. The Canvas (Center) — Your Design Area</h3>
                            <p>The big white area in the center is your actual canvas. This is where your design lives. A few things to know:</p>
                            <ul className="space-y-4 my-8">
                                <li className="flex gap-4">
                                    <MousePointer2 className="h-6 w-6 text-emerald-500 shrink-0" />
                                    <span>Everything outside the white canvas won't appear in your final export</span>
                                </li>
                                <li className="flex gap-4">
                                    <MousePointer2 className="h-6 w-6 text-emerald-500 shrink-0" />
                                    <span>The dotted blue lines are **smart alignment guides** — they help you align things perfectly</span>
                                </li>
                                <li className="flex gap-4">
                                    <MousePointer2 className="h-6 w-6 text-emerald-500 shrink-0" />
                                    <span>Press **Ctrl + Shift + H** to fit the entire canvas to your screen</span>
                                </li>
                            </ul>

                            <h3 className="text-2xl font-black mt-12 mb-6 text-white uppercase italic tracking-tight">3. The Top Toolbar — Your Quick Actions Bar</h3>
                            <p>The toolbar at the very top of the editor changes depending on what you've selected. It allows you to **Resize, Undo/Redo, Share, and Download** your work.</p>
                            <p>When you select an element (text, image, shape), the toolbar shows context-specific options for that element — like font size, color, transparency, and effects.</p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white italic uppercase tracking-tighter">
                                Creating Your First Design: Step-by-Step
                            </h2>
                            <div className="space-y-8 my-12">
                                {[
                                    { step: "01", title: "Pick Your Category", desc: "From the dashboard, click 'Create a Design' and search for 'Instagram Post'." },
                                    { step: "02", title: "Select a Template", desc: "Browse the templates on the left and click one to apply it to your canvas." },
                                    { step: "03", title: "Edit Your Text", desc: "Double-click any text to change it. Use the toolbar to style it." },
                                    { step: "04", title: "Swap Images", desc: "Drag a new photo from the Photos panel over an existing image to replace it." },
                                    { step: "05", title: "Download & Post", desc: "Click 'Download' in the top right, choose PNG, and you're ready!" }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6 p-8 bg-[#121a2e] rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group">
                                        <div className="text-3xl font-black text-emerald-500/20 group-hover:text-emerald-500 transition-colors italic leading-none">{step.step}</div>
                                        <div>
                                            <h4 className="text-white font-black mb-2 uppercase italic tracking-tight">{step.title}</h4>
                                            <p className="text-sm text-slate-400 font-medium italic mb-0 leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="my-16 bg-emerald-500/5 p-12 rounded-[3.5rem] border border-emerald-500/20 text-center">
                                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 mb-8 shadow-2xl shadow-emerald-500/20">
                                    <Zap className="h-10 w-10 text-black" />
                                </div>
                                <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">You Did It!</h3>
                                <p className="text-lg text-slate-400 font-bold italic mb-0 uppercase tracking-widest">
                                    That's your first Canva design. The whole process should take less than 5 minutes once you're comfortable.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Database className="h-10 w-10 text-emerald-500" />
                                Must-Know Canva Keyboard Shortcuts
                            </h2>
                            <div className="overflow-x-auto my-8">
                                <table className="w-full border-collapse bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                                    <thead>
                                        <tr className="bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-widest text-xs">
                                            <th className="p-4 text-left border-b border-white/10">Shortcut</th>
                                            <th className="p-4 text-left border-b border-white/10">What It Does</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium">
                                        {[
                                            { key: "T", action: "Add a text box" },
                                            { key: "R", action: "Add a rectangle" },
                                            { key: "C", action: "Add a circle" },
                                            { key: "L", action: "Add a line" },
                                            { key: "Ctrl + D", action: "Duplicate element" },
                                            { key: "Ctrl + G", action: "Group elements" },
                                            { key: "Ctrl + Shift + H", action: "Fit to screen" }
                                        ].map((s, i) => (
                                            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                <td className="p-4 font-mono text-emerald-400 font-black">{s.key}</td>
                                                <td className="p-4 text-slate-400 italic font-bold">{s.action}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white italic uppercase tracking-tighter">
                                Common Beginner Questions
                            </h2>
                            <div className="space-y-6 my-12">
                                {[
                                    { q: "Is Canva really free?", a: "Yes — the free plan gives you access to 250,000+ templates and millions of photos. Pro unlocks advanced tools like Background Remover." },
                                    { q: "Can I use Canva on my phone?", a: "Absolutely. The Canva app on Android and iOS is fully synced with the browser version." },
                                    { q: "Do I need to save my work?", a: "No. Canva saves automatically every few seconds to the cloud. You'll see a 'Saved' indicator at the top." },
                                    { q: "Can I use designs for my business?", a: "Yes, you can use Canva designs commercially, but you cannot resell templates as-is." }
                                ].map((faq, i) => (
                                    <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                        <h4 className="text-white font-black mb-4 uppercase italic tracking-tight flex items-center gap-3">
                                            <HelpCircle className="h-5 w-5 text-emerald-500" /> {faq.q}
                                        </h4>
                                        <p className="text-slate-400 italic font-medium leading-relaxed mb-0">{faq.a}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="my-24 p-12 rounded-[3.5rem] bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/5 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                                    <Settings className="h-40 w-40 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 relative z-10">You're Ready to Design</h3>
                                <p className="text-lg text-slate-400 italic font-bold uppercase tracking-wider mb-12 relative z-10 max-w-2xl mx-auto">
                                    Module 2 covers Design Fundamentals — learn the principles that separate amateur designs from professional ones.
                                </p>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl px-12 h-16 shadow-2xl shadow-emerald-500/20 group/btn transition-all italic text-sm" asChild>
                                        <Link href="https://www.celoris.in" className="flex items-center gap-3">
                                            Go to Canva.com <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-[0.3em] rounded-2xl px-12 h-16 transition-all italic text-sm" asChild>
                                        <Link href="/blog">View All Modules</Link>
                                    </Button>
                                </div>
                            </div>

                            <div className="my-24 p-12 rounded-[3.5rem] bg-emerald-500 text-black text-center relative overflow-hidden">
                                <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-6">Want to learn Canva with a live trainer?</h3>
                                <p className="text-xl font-bold italic mb-10 max-w-2xl mx-auto opacity-80">
                                    Celoris connects you with experienced trainers for one-on-one sessions. No middlemen. Just skills.
                                </p>
                                <Button size="lg" className="bg-black text-white hover:bg-zinc-800 font-black uppercase tracking-[0.3em] rounded-2xl px-12 h-16 shadow-2xl transition-all italic text-sm" asChild>
                                    <Link href="/">Book Your Session</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Footer tags */}
                        <div className="mt-16 pt-16 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Canva Tutorial', 'Canva for Beginners', 'Social Media Design', 'Free Design Tool', 'Instagram Design', 'Canva India', 'Celoris'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-default italic">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </article>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4 italic">
                    Published by Celoris | celoris.in | Skill-Based Learning
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase italic">
                    © 2026 Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
