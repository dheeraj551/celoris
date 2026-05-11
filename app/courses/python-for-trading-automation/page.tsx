"use client"

import { useEffect } from "react"
import { 
    ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, 
    Lightbulb, MapPin, Smartphone, MessageSquare, Phone, Globe, ShieldCheck, 
    TrendingUp, BarChart3, Target, Megaphone, Share2, Mail, FileText, MousePointer2, Search,
    Code, LineChart, Activity, Wallet, Bell, BarChart, Database
} from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PythonTradingAutomation() {
    useEffect(() => {
        document.title = "Python for Trading Automation | Using ICICI Direct Breeze API | Celoris"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Master automated trading with Python and ICICI Direct Breeze API. Build a live trading bot, fetch real-time data, and automate your strategies in this 10-hour practical course."
        if (metaDescription) {
            metaDescription.setAttribute("content", descriptionText)
        } else {
            const meta = document.createElement("meta")
            meta.name = "description"
            meta.content = descriptionText
            document.head.appendChild(meta)
        }
    }, [])

    const pageData = {
        title: "Python for Trading Automation",
        subtitle: "Using ICICI Direct Breeze API",
        heroDescription: "Complete 10-Hour Course Curriculum. Fetch live data, generate buy/sell signals, place orders, and send alerts — all running automatically.",
        whatsappNumber: "+91 90847 18101",
        whatsappLink: "https://wa.me/919084718101",
        overview: "This 10-hour practical course teaches you how to automate your stock trading strategy using Python and the ICICI Direct Breeze API. By the end, you will have a fully functional trading bot that fetches live data, generates buy/sell signals, places orders, and sends alerts — all running automatically without manual intervention.",
        courseDetails: [
            { label: "Course Name", value: "Python for Trading Automation" },
            { label: "API Focus", value: "ICICI Direct Breeze API (iConnect)" },
            { label: "Duration", value: "10 Hours Total" },
            { label: "Modules", value: "10 Modules (1 Hour Each)" },
            { label: "Level", value: "Beginner to Intermediate" },
            { label: "Certification", value: "Celoris Course Completion Certificate" },
        ],
        curriculum: [
            {
                module: "Module 01: Python Foundations for Traders",
                duration: "1 Hour",
                focus: "Setting up Python, VS Code & Jupyter Notebook",
                topics: [
                    "Variables, data types, lists, dictionaries",
                    "Loops, conditionals, and functions",
                    "Installing libraries: pandas, numpy, requests",
                    "Your first Python script: print stock price"
                ],
                outcome: "Student can write basic Python scripts and set up their trading environment.",
                icon: TerminalIcon
            },
            {
                module: "Module 02: Data Handling with Pandas & NumPy",
                duration: "1 Hour",
                focus: "Loading and reading CSV data (OHLCV format)",
                topics: [
                    "DataFrames: filter, sort, slice",
                    "Calculating daily returns, % change",
                    "Handling missing data and date indexing",
                    "Exporting processed data to Excel"
                ],
                outcome: "Student can clean and manipulate stock data using pandas for analysis.",
                icon: Database
            },
            {
                module: "Module 03: ICICI Direct Breeze API Setup",
                duration: "1 Hour",
                focus: "Creating & activating ICICI Direct API (iConnect)",
                topics: [
                    "Installing Breeze Python SDK",
                    "Authentication: session token generation",
                    "Fetching account profile and holdings",
                    "Understanding API rate limits and errors"
                ],
                outcome: "Student has a live Breeze API connection and can fetch account data.",
                icon: Zap
            },
            {
                module: "Module 04: Fetching Live & Historical Market Data",
                duration: "1 Hour",
                focus: "Fetching live quotes via Breeze API",
                topics: [
                    "Downloading historical OHLCV data (1min, 1D, 1W)",
                    "Subscribing to live websocket feeds",
                    "Storing data locally in CSV / SQLite",
                    "Plotting price charts with matplotlib"
                ],
                outcome: "Student can pull real-time and historical market data directly into Python.",
                icon: Activity
            },
            {
                module: "Module 05: Technical Indicators & Signals",
                duration: "1 Hour",
                focus: "Moving Averages: SMA, EMA (using pandas-ta)",
                topics: [
                    "RSI, MACD, Bollinger Bands",
                    "Generating Buy/Sell signals from indicators",
                    "Backtesting signals on historical data",
                    "Visualising signals on candlestick charts"
                ],
                outcome: "Student can compute technical indicators and generate automated trading signals.",
                icon: TrendingUp
            },
            {
                module: "Module 06: Order Placement & Management",
                duration: "1 Hour",
                focus: "Placing Market and Limit orders via Breeze API",
                topics: [
                    "Modifying and cancelling existing orders",
                    "Fetching order book and trade book",
                    "Handling order rejections gracefully",
                    "Placing Trailing Stop Loss (TSL) orders"
                ],
                outcome: "Student can place, modify, and cancel orders programmatically via ICICI Direct.",
                icon: Wallet
            },
            {
                module: "Module 07: Building a Simple Trading Bot",
                duration: "1 Hour",
                focus: "Architecture of an automated trading bot",
                topics: [
                    "Event-driven vs time-driven execution",
                    "Combining data fetch → signal → order in one script",
                    "Adding logging and trade journal",
                    "Running the bot in paper trading mode"
                ],
                outcome: "Student has a working end-to-end bot that fetches data, generates signals, and places orders.",
                icon: Code
            },
            {
                module: "Module 08: Risk Management & Position Sizing",
                duration: "1 Hour",
                focus: "Setting Stop Loss and Target levels in code",
                topics: [
                    "Calculating position size (% of capital)",
                    "Max drawdown control and daily loss limits",
                    "Portfolio-level exposure management",
                    "Killing the bot on threshold breach"
                ],
                outcome: "Student can add risk controls to the bot to protect capital automatically.",
                icon: ShieldCheck
            },
            {
                module: "Module 09: Scheduling, Alerts & Notifications",
                duration: "1 Hour",
                focus: "Scheduling bot runs with APScheduler / cron",
                topics: [
                    "Sending trade alerts via Telegram Bot API",
                    "Email notifications using smtplib",
                    "Logging trades to Google Sheets",
                    "Running bot on startup (Windows Task Scheduler)"
                ],
                outcome: "Student can automate bot scheduling and receive real-time alerts on any device.",
                icon: Bell
            },
            {
                module: "Module 10: Backtesting, Optimisation & Live Deployment",
                duration: "1 Hour",
                focus: "Introduction to backtesting frameworks (Backtrader / VectorBT)",
                topics: [
                    "Running a full backtest on 1-year historical data",
                    "Optimising parameters (SMA period, RSI threshold)",
                    "Analysing performance: Sharpe ratio, win rate, max DD",
                    "Going live: checklist, monitoring & next steps"
                ],
                outcome: "Student can validate their strategy on historical data and confidently deploy it live.",
                icon: BarChart
            }
        ],
        prerequisites: [
            "Basic computer skills (no prior coding knowledge required)",
            "Active ICICI Direct trading account with API access enabled",
            "Laptop/PC with internet connection",
            "Python 3.10+ installed (we set this up in Module 1)"
        ],
        whatYouWillBuild: [
            "A live market data dashboard using Breeze API",
            "Technical indicator engine (RSI, EMA, MACD)",
            "Automated order placement bot with Stop Loss",
            "Telegram alert system for trade signals",
            "Full backtesting report on your strategy"
        ]
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6 font-medium uppercase tracking-wider italic">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic">Python Trading Automation</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    Live Trading Ready
                                </span>
                                <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Breeze API Focused
                                </span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    10 Hours Curriculum
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">Python for</span>
                                <span className="block">Trading</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 block tracking-normal mt-2">
                                    Automation
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-black italic uppercase tracking-tight">
                                {pageData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {pageData.heroDescription}
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <Clock className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">10 Hours Total</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <BookOpen className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">10 Modules</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <Code className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Hands-on Coding</span>
                                </div>
                                <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Live Ready</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link 
                                    href={pageData.whatsappLink}
                                    target="_blank"
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest italic rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all flex items-center gap-3"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    WhatsApp Now
                                </Link>
                                <CourseInquiryDialog 
                                    courseTitle={pageData.title}
                                    buttonClassName="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest italic rounded-2xl transition-all"
                                />
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/Python forautomation.png"
                                        alt="Python for Trading Automation"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                </div>
                            </Card>
                        </div>

                        {/* Course Overview */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <BookOpen className="h-8 w-8 text-emerald-500" />
                                </div>
                                Course Overview
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed font-medium">
                                {pageData.overview}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pageData.courseDetails.map((detail, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 flex flex-col justify-center">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1">{detail.label}</div>
                                        <div className="text-sm font-black text-white italic uppercase leading-tight">{detail.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                    <TrendingUp className="h-8 w-8 text-cyan-500" />
                                </div>
                                Full 10-Hour Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {pageData.curriculum.map((item, index) => {
                                    const Icon = item.icon
                                    return (
                                        <AccordionItem key={index} value={`module-${index}`} className="border border-white/5 bg-[#0d1321]/40 rounded-[2rem] px-4 overflow-hidden shadow-xl">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{item.module}</div>
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic mt-1">{item.focus}</div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400 opacity-100 visible">
                                                <div className="pl-6 sm:pl-20 space-y-6 relative">
                                                    <div className="absolute left-0 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent" />
                                                    <div className="flex flex-col gap-4">
                                                        {item.topics.map((topic, topicIndex) => (
                                                            <div key={topicIndex} className="flex items-start gap-4 group">
                                                                <div className="h-2 w-2 rounded-full bg-emerald-500/40 mt-2.5 group-hover:bg-emerald-500 transition-colors shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                                <span className="text-sm font-bold uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors leading-relaxed block">{topic}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                                        <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest italic mb-1">Session Outcome:</div>
                                                        <div className="text-xs font-bold text-slate-300 italic">✅ {item.outcome}</div>
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </section>

                        {/* What You Will Build */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Zap className="h-8 w-8 text-emerald-500" />
                                </div>
                                What You Will Build
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.whatYouWillBuild.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Prerequisites */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
                                    <Lightbulb className="h-8 w-8 text-cyan-500" />
                                </div>
                                Prerequisites
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.prerequisites.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-cyan-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-cyan-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-cyan-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Closing CTA banner */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <LineChart className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Your Trading Automation Journey Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                Join the next generation of algorithmic traders. Build your first bot in just 10 hours.
                            </p>
                            <div className="flex flex-wrap gap-4 relative z-10">
                                <Link 
                                    href={pageData.whatsappLink}
                                    target="_blank"
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest italic rounded-2xl shadow-3xl transition-all flex items-center gap-3"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    WhatsApp Now
                                </Link>
                                <Link 
                                    href="/"
                                    className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest italic rounded-2xl transition-all flex items-center gap-3"
                                >
                                    <Globe className="h-5 w-5" />
                                    Visit celoris.in
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            {/* Quick Contact Card */}
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-sm font-black text-emerald-500 italic tracking-[0.3em] uppercase mb-2">Build Your Bot</div>
                                        <div className="text-2xl font-black text-white italic tracking-tighter uppercase">Python Trading</div>
                                    </div>

                                    <div className="space-y-4 mb-10 text-slate-400">
                                        <CourseInquiryDialog
                                            courseTitle={pageData.title}
                                            buttonClassName="w-full h-16 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-[0.3em] rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all active:scale-95 italic"
                                        />
                                        <Link
                                            href={pageData.whatsappLink}
                                            target="_blank"
                                            className="w-full h-14 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl flex items-center justify-center gap-3 group transition-all italic"
                                        >
                                            <Smartphone className="h-4 w-4 text-emerald-500 group-hover:animate-pulse" />
                                            WhatsApp: +91 90847 18101
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Celoris Certificate", color: "text-emerald-500" },
                                            { icon: Code, text: "Hands-on Coding", color: "text-emerald-500" },
                                            { icon: Activity, text: "Live Data Feed", color: "text-emerald-500" },
                                            { icon: Clock, text: "10 Hours Training", color: "text-orange-500" },
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
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Lead Trainer</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Celoris Tech Team</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        Experts in FinTech and Algorithmic Trading with focus on ICICI Direct Breeze API integration.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>4.9/5 Rating</span>
                                        </div>
                                        <div className="text-slate-500">
                                            5,000+ Students
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Support Card */}
                            <div className="p-10 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 shadow-xl">
                                <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-6 flex items-center gap-3">
                                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                                    Support & Contact
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                        <Phone className="h-4 w-4 text-emerald-500" />
                                        <span>+91 90847 18101</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                        <Globe className="h-4 w-4 text-emerald-500" />
                                        <span>support@celoris.in</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function TerminalIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" x2="20" y1="19" y2="19" />
        </svg>
    )
}
