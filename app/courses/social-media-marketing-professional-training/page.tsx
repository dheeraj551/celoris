"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Eye, Lightbulb, Battery, Cpu, Radio, Shield, BarChart, Server, Workflow, Bot, Database, Search, Mail, Code, Terminal, MousePointer2, Layout, FileText, FlaskConical, Binary, Layers, Megaphone, Target, Share2, TrendingUp, TrendingDown, PieChart, Activity, Globe, Smartphone, Camera, Video, Monitor, Globe2, Sparkles, MessageSquare, PenTool, Trophy, Instagram, Linkedin, Youtube, Twitter } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"

export default function SocialMediaMarketingProCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "SMM Professional Training with AI, Canva & Email | Celoris";

        const metaDescription = document.querySelector('meta[name="description"]');
        const descriptionText = "Master social media marketing with AI tools, Canva, and email automation. 10 hours, 8 modules, and 40+ lessons of professional training for entrepreneurs and creators. celoris.in";
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
        title: "Social Media Marketing with AI Tools, Canva & Email Automation",
        subtitle: "Professional Training Program",
        description: "This comprehensive 10-hour program teaches you to build, grow, and monetize a social media presence using cutting-edge AI tools. Master content creation, automation, and data-driven campaigns.",
        students: 850,
        rating: 4.9,
        duration: "10 Hours",
        modules_count: 8,
        lessons_count: "40+",
        ai_tools_count: 5,
        price: 2499,
        level: "Beginner to Advanced",
        currency: "INR",
        provider: "Celoris Team",
        learning_outcomes: [
            "Create professional-quality graphics, reels, and carousels using Canva + AI",
            "Build and automate an email list that converts subscribers into customers",
            "Run profitable Meta (Facebook/Instagram) and Google ad campaigns",
            "Write engaging captions, scripts, and blog posts using AI tools in minutes",
            "Analyse performance data and optimize content strategy with AI insights",
            "Build a complete 30-day content calendar from scratch"
        ],
        requirements: [
            "Basic smartphone or computer skills",
            "A social media account on any platform (Instagram, Facebook, LinkedIn, etc.)",
            "Free Canva account (canva.com)",
            "No coding or design experience required"
        ],
        tools_covered: [
            "Canva (design)", "ChatGPT / Claude (AI writing)", "Mailchimp / Brevo (email automation)", 
            "Meta Ads Manager (paid ads)", "Buffer / Later (scheduling)", "Hootsuite (analytics)", 
            "Midjourney / Adobe Firefly (AI images)"
        ],
        chapters: [
            {
                number: 1,
                title: "Foundations of Social Media Marketing",
                duration: "1 hr 15 min",
                icon: "Target",
                highlights: "Strategy, platforms, audience, branding",
                lessons: [
                    { title: "The Social Media Landscape 2025", duration: "15 min", topics: ["Platforms", "algorithms", "trends"] },
                    { title: "Defining Your Goals & KPIs", duration: "15 min", topics: ["SMART goals", "metrics", "ROI"] },
                    { title: "Audience Research with AI", duration: "20 min", topics: ["Buyer personas", "ChatGPT research"] },
                    { title: "Competitor Analysis Using AI Tools", duration: "15 min", topics: ["SpyFu", "SimilarWeb", "Semrush AI"] },
                    { title: "Building Your Brand Identity", duration: "10 min", topics: ["Voice", "tone", "colour palette"] }
                ],
                content: "Before you post a single image or run a single ad, you need a strategy. This module gives you the complete mental framework for social media success — platform selection, audience psychology, brand identity, and competitive research — all powered by AI research tools.",
                ai_tip: "Use ChatGPT prompt: 'Give me a comparison of Instagram vs LinkedIn for a [your niche] business targeting [audience] in India' to get a customised platform recommendation instantly."
            },
            {
                number: 2,
                title: "Canva Mastery for Social Media",
                duration: "1 hr 30 min",
                icon: "PenTool",
                highlights: "Design, templates, Brand Kit, video",
                lessons: [
                    { title: "Canva Interface & Workspace Setup", duration: "15 min", topics: ["Dashboard", "templates", "folders"] },
                    { title: "Brand Kit — Your Design System", duration: "20 min", topics: ["Colours", "fonts", "logos", "Brand Voice"] },
                    { title: "Designing for Every Platform", duration: "25 min", topics: ["Instagram", "Facebook", "LinkedIn", "stories"] },
                    { title: "Canva AI Tools — Magic Studio", duration: "20 min", topics: ["Magic Write", "Magic Design", "AI image"] },
                    { title: "Video, Reels & Animated Posts", duration: "10 min", topics: ["Animations", "music", "transitions"] }
                ],
                content: "Canva is the world's most popular design tool — and with AI built in, it's become even more powerful. This module takes you from basic templates to advanced animations, Brand Kit setup, and AI-powered design workflows.",
                pro_tip: "Use Canva's 'Brand Hub' to create shareable style guidelines. Export them as a PDF and send to clients or collaborators to ensure design consistency."
            },
            {
                number: 3,
                title: "AI-Powered Content Creation",
                duration: "1 hr 15 min",
                icon: "Zap",
                highlights: "ChatGPT, Claude, AI images, captions",
                lessons: [
                    { title: "ChatGPT for Social Media Content", duration: "20 min", topics: ["Prompts", "captions", "scripts", "hashtags"] },
                    { title: "Claude AI for Long-Form & Strategy", duration: "15 min", topics: ["Blogs", "strategies", "email sequences"] },
                    { title: "AI Image Generation for Posts", duration: "20 min", topics: ["Midjourney", "Adobe Firefly", "DALL·E"] },
                    { title: "Building a 30-Day Content Calendar", duration: "20 min", topics: ["Notion", "Airtable", "AI scheduling"] }
                ],
                content: "AI tools can 10x your content output without sacrificing quality. This module covers the exact prompts and workflows used by top content creators to produce weeks of content in a single day.",
                power_workflow: "Batch create content: Spend 2 hours on Sunday generating 30 days of captions with ChatGPT. Paste them into Notion, then schedule them in Buffer or Later."
            },
            {
                number: 4,
                title: "Email Marketing & Automation",
                duration: "1 hr 30 min",
                icon: "Mail",
                highlights: "Mailchimp, Brevo, funnels, sequences",
                lessons: [
                    { title: "Email Marketing Fundamentals", duration: "15 min", topics: ["Why email", "deliverability", "spam laws"] },
                    { title: "Setting Up Mailchimp / Brevo", duration: "20 min", topics: ["Lists", "segments", "templates", "forms"] },
                    { title: "Writing Emails with AI", duration: "20 min", topics: ["Subject lines", "body copy", "CTAs"] },
                    { title: "Automation Sequences & Funnels", duration: "25 min", topics: ["Welcome series", "abandoned cart", "drip"] },
                    { title: "List Growth Strategies", duration: "10 min", topics: ["Lead magnets", "landing pages", "integrations"] }
                ],
                content: "Social media reach is rented. Your email list is owned. This module teaches you to build, grow, and monetise an email list using AI and automation — turning one-time visitors into loyal customers."
            },
            {
                number: 5,
                title: "Social Media Scheduling & Analytics",
                duration: "1 hr",
                icon: "Activity",
                highlights: "Buffer, Hootsuite, insights, reporting",
                lessons: [
                    { title: "Scheduling Tools — Buffer, Later, Hootsuite", duration: "20 min", topics: ["Setup", "queues", "best times to post"] },
                    { title: "Native Platform Analytics", duration: "20 min", topics: ["Instagram Insights", "Facebook", "LinkedIn"] },
                    { title: "AI-Powered Analytics & Reporting", duration: "20 min", topics: ["Hootsuite Insights", "ChatGPT analysis"] }
                ],
                content: "Consistency is the #1 driver of social media growth. Scheduling tools let you batch-create and auto-publish content, while analytics tools tell you exactly what's working so you can double down."
            },
            {
                number: 6,
                title: "Paid Advertising with AI",
                duration: "1 hr 30 min",
                icon: "Target",
                highlights: "Meta Ads, Google Ads, targeting, ROI",
                lessons: [
                    { title: "Meta Ads Manager: Complete Setup", duration: "25 min", topics: ["Campaigns", "ad sets", "pixels", "targeting"] },
                    { title: "Writing Ad Copy with AI", duration: "20 min", topics: ["Headlines", "hooks", "creative frameworks"] },
                    { title: "Google Ads Essentials", duration: "20 min", topics: ["Search", "Display", "Performance Max"] },
                    { title: "Tracking, Testing & Optimisation", duration: "25 min", topics: ["A/B testing", "ROAS", "scaling winners"] }
                ],
                content: "Organic reach has limits. Paid advertising — done right — can generate 5x, 10x, even 20x return on investment. This module demystifies Meta Ads and Google Ads with AI optimization."
            },
            {
                number: 7,
                title: "Advanced AI Strategies & Reels",
                duration: "1 hr",
                icon: "Sparkles",
                highlights: "Viral content, Reels, trends, growth hacks",
                lessons: [
                    { title: "Viral Reels Formula & Trending Audio", duration: "20 min", topics: ["Hook", "structure", "sounds"] },
                    { title: "AI Trend Forecasting", duration: "15 min", topics: ["Google Trends", "Exploding Topics"] },
                    { title: "Repurposing Content Across Platforms", duration: "15 min", topics: ["1 video -> 10 posts"] },
                    { title: "Community Building & DM Automation", duration: "10 min", topics: ["ManyChat", "DM flows"] }
                ],
                content: "This module covers cutting-edge strategies that the top 1% of social media marketers are using right now — AI trend forecasting, viral Reels frameworks, and growth hacking techniques."
            },
            {
                number: 8,
                title: "Capstone – Full Campaign Build",
                duration: "1 hr",
                icon: "Trophy",
                highlights: "End-to-end campaign, portfolio project",
                lessons: [
                    { title: "Campaign Planning & Brief", duration: "15 min", topics: ["Goals", "audience", "budget"] },
                    { title: "Content Creation Sprint", duration: "20 min", topics: ["7 posts in Canva + AI captions"] },
                    { title: "Email Funnel Setup", duration: "15 min", topics: ["Lead magnet + 3-email sequence"] },
                    { title: "Schedule, Launch & Monitor", duration: "10 min", topics: ["Buffer setup", "checklist"] }
                ],
                content: "This is where everything comes together. You will build a complete, real-world social media marketing campaign from scratch — strategy, content, email automation, and optional paid ads."
            }
        ],
        tool_stack: [
            { tool: "Canva", website: "canva.com", category: "Design", best_for: "All-in-one visuals & video" },
            { tool: "ChatGPT / Claude", website: "openai.com", category: "AI Writing", best_for: "Captions, scripts, strategy" },
            { tool: "Mailchimp / Brevo", website: "brevo.com", category: "Email", best_for: "Automation & list building" },
            { tool: "Buffer / Later", website: "buffer.com", category: "Scheduling", best_for: "Auto-publishing content" },
            { tool: "Meta Ads Manager", website: "business.facebook.com", category: "Ads", best_for: "Paid growth & targeting" }
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6 font-medium uppercase tracking-wider italic">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400 transition-colors">Academy</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic">{courseData.title}</span>
                </div>

                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-8 transition-all group font-black uppercase tracking-widest italic text-xs">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Academy
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-16">
                        {/* Hero Section */}
                        <div className="space-y-8">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap gap-3 mb-4"
                            >
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">10 Hours</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">8 Modules</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">Professional Training</span>
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl lg:text-7xl font-black text-white italic uppercase tracking-tighter leading-none"
                            >
                                {courseData.title}
                            </motion.h1>
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-emerald-400/90 font-black italic uppercase tracking-tight"
                            >
                                {courseData.subtitle}
                            </motion.p>
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium"
                            >
                                {courseData.description}
                            </motion.p>
                        </div>

                        {/* Featured Image Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/smm-pro-hero.png"
                                        alt="Social Media Marketing AI"
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                    <div className="absolute flex flex-col items-center">
                                        <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-3xl shadow-emerald-600/50 hover:scale-110 transition-transform cursor-pointer mb-4">
                                            <Play className="h-8 w-8 text-white fill-current ml-1" />
                                        </div>
                                        <div className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic shadow-lg">Watch Overview</div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Total Training", value: "10 Hours", icon: Clock },
                                { label: "Structured Content", value: "8 Modules", icon: Layers },
                                { label: "Covered in Depth", value: "40+ Lessons", icon: BookOpen },
                                { label: "Hands-on Practice", value: "5 AI Tools", icon: Cpu }
                            ].map((stat, idx) => (
                                <div key={idx} className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 text-center group hover:border-emerald-500/30 transition-all">
                                    <stat.icon className="h-6 w-6 text-emerald-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                                    <div className="text-xl font-black text-white uppercase italic tracking-tighter mb-1">{stat.value}</div>
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Outcomes */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Target className="h-8 w-8 text-emerald-500" />
                                </div>
                                Course Outcomes
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
                            <div className="flex items-end justify-between">
                                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                    <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                        <BookOpen className="h-8 w-8 text-purple-500" />
                                    </div>
                                    Complete Curriculum
                                </h2>
                                <div className="hidden md:block text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-2">Practical Assignments in Every Module</div>
                            </div>

                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.chapters.map((chapter, index) => {
                                    const IconMap: any = {
                                        Target, PenTool, Zap, Mail, Activity, Sparkles, Trophy
                                    };
                                    const Icon = IconMap[chapter.icon] || BookOpen;
                                    return (
                                        <AccordionItem key={index} value={`chapter-${index}`} className="border border-white/5 bg-[#0d1321]/40 rounded-[2rem] px-4 overflow-hidden shadow-xl group/item">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-emerald-500/20 shadow-inner group-hover/item:scale-110 transition-transform">
                                                        <Icon className="h-7 w-7 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1 italic">Module {chapter.number} • {chapter.duration}</div>
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{chapter.title}</div>
                                                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.1em] mt-1">{chapter.highlights}</div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400">
                                                <div className="pl-4 md:pl-20 space-y-8 relative">
                                                    <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent" />
                                                    
                                                    <p className="text-sm font-medium leading-relaxed italic text-slate-300">
                                                        {chapter.content}
                                                    </p>

                                                    <div className="grid grid-cols-1 gap-4">
                                                        {chapter.lessons.map((lesson, lessonIndex) => (
                                                            <div key={lessonIndex} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all group/lesson">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <div className="text-xs font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                                                                        <span className="text-emerald-500/50">{chapter.number}.{lessonIndex + 1}</span>
                                                                        {lesson.title}
                                                                    </div>
                                                                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{lesson.duration}</div>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2 ml-7">
                                                                    {lesson.topics.map((topic, tidx) => (
                                                                        <span key={tidx} className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">
                                                                            {topic}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {(chapter.ai_tip || chapter.pro_tip || chapter.power_workflow) && (
                                                        <div className="mt-6 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 relative overflow-hidden group/tip">
                                                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/tip:rotate-12 transition-transform">
                                                                <Zap className="h-10 w-10 text-emerald-500" />
                                                            </div>
                                                            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2 italic flex items-center gap-2">
                                                                <Sparkles size={12} />
                                                                {chapter.ai_tip ? 'AI Tip' : chapter.pro_tip ? 'Pro Tip' : 'Power Workflow'}
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-400 italic leading-relaxed uppercase tracking-tight">
                                                                {chapter.ai_tip || chapter.pro_tip || chapter.power_workflow}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </section>

                        {/* Tool Stack Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                                    <Cpu className="h-8 w-8 text-yellow-500" />
                                </div>
                                AI & Tools Reference
                            </h2>
                            <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5 bg-white/5">
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Tool</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Category</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-emerald-500 italic">Best For</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {courseData.tool_stack.map((item, idx) => (
                                            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                <td className="p-6">
                                                    <div className="text-sm font-bold text-white italic uppercase tracking-tight">{item.tool}</div>
                                                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{item.website}</div>
                                                </td>
                                                <td className="p-6">
                                                    <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase italic">
                                                        {item.category}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-xs font-bold text-slate-500 italic uppercase leading-relaxed">{item.best_for}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Final CTA Banner */}
                        <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-emerald-600/20 to-blue-600/20 border border-white/10 relative overflow-hidden group shadow-3xl text-center">
                            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.1),transparent)]" />
                            <Sparkles className="h-16 w-16 text-emerald-500 mx-auto mb-8 animate-pulse" />
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4 relative z-10">Start Your Mastery Journey</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 max-w-2xl mx-auto mb-10">
                                Join 850+ entrepreneurs and creators who have transformed their social media presence with AI-powered strategies.
                            </p>
                            <CourseInquiryDialog
                                courseTitle={courseData.title}
                                buttonClassName="h-16 px-12 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all active:scale-95 italic relative z-10"
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            {/* Pricing Card */}
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2 italic">Official Enrollment</div>
                                        <div className="text-4xl font-black text-white italic tracking-tighter uppercase mb-1">₹{courseData.price.toLocaleString()}</div>
                                        <div className="text-slate-600 font-bold tracking-widest uppercase text-[8px] italic line-through">₹4,999 (50% OFF)</div>
                                    </div>

                                    <div className="space-y-4 mb-10 text-slate-400">
                                        <CourseInquiryDialog
                                            courseTitle={courseData.title}
                                            buttonClassName="w-full h-16 text-[10px] font-black bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-[0.4em] rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all active:scale-95 italic"
                                        />
                                        <Link
                                            href="https://wa.me/919084718101"
                                            target="_blank"
                                            className="w-full h-14 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl flex items-center justify-center gap-3 group transition-all italic"
                                        >
                                            <Radio className="h-4 w-4 text-emerald-500 group-hover:animate-pulse" />
                                            Live Chat with Team
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Celoris Professional Certificate", color: "text-emerald-500" },
                                            { icon: Sparkles, text: "5+ AI Tools Deep Dive", color: "text-blue-500" },
                                            { icon: Monitor, text: "Lifetime Access to Material", color: "text-purple-500" },
                                            { icon: Instagram, text: "Instagram Viral Framework", color: "text-rose-500" }
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
                            <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
                                <CardHeader className="pb-4 px-10 pt-10">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Lead Instructor</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter break-words">{courseData.provider}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        Team of digital strategists and AI specialists at Celoris, helping creators leverage automation to scale.
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

                            {/* Prerequisites */}
                            <div className="p-10 rounded-[3rem] bg-[#0d1321]/40 border border-white/5 shadow-xl">
                                <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-6 flex items-center gap-3">
                                    <Shield className="h-6 w-6 text-blue-500" />
                                    Prerequisites
                                </h3>
                                <ul className="space-y-4">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500/40 mt-1.5 flex-shrink-0 group-hover:bg-blue-500 transition-colors" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Trust Badge */}
                            <div className="text-center px-10">
                                <div className="text-[8px] font-black text-slate-700 uppercase tracking-[0.5em] italic mb-4">Secure Learning Environment</div>
                                <div className="flex justify-center gap-6 opacity-20 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                                    <Globe className="h-6 w-6" />
                                    <Shield className="h-6 w-6" />
                                    <Lock className="h-6 w-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Course",
                        "name": courseData.title,
                        "description": courseData.description,
                        "provider": {
                            "@type": "Organization",
                            "name": "Celoris",
                            "sameAs": "https://www.celoris.in"
                        },
                        "educationalLevel": courseData.level,
                        "teaches": courseData.learning_outcomes
                    })
                }}
            />
        </div>
    )
}

function Lock({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
        </svg>
    )
}
