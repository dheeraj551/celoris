'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check,
    Globe, Zap, ListChecks, HelpCircle,
    ArrowRight, Star, Shield, Info, Laptop,
    BookOpen, GraduationCap, Timer, AlertCircle,
    Layout, Database, PenTool, Box, Smartphone,
    Share2, IndianRupee, MapPin, Camera, Video,
    Mic, Wifi, BarChart, Target, Rocket, Cpu, Binary, Search, Code, Terminal, Bot, Workflow, Activity, TrendingUp, LineChart, PieChart, FlaskConical, Layers
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function MT5PythonTradingBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[650px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-mt5-python.png")'
                    }}
                />
                <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#050810] via-[#050810]/70 to-transparent" />

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
                            <span className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md">
                                Trading & Technology
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 12 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter text-white drop-shadow-2xl uppercase italic">
                            MetaTrader 5 + Python: <span className="text-emerald-400 text-shadow-glow">The Ultimate Guide to AI Trading Automation</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1 uppercase italic">Celoris Editorial</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500 italic">Trading Tech Guide</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight prose-headings:uppercase prose-headings:italic
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg uppercase tracking-tight">
                                    "How to automate Forex, Stocks, and Crypto trading using MT5 and Python AI models — The ultimate guide for Indian traders in 2026."
                                </p>
                            </div>

                            <p>
                                If you've ever dreamed of building a trading bot that works while you sleep, <strong>MetaTrader 5 (MT5)</strong> combined with <strong>Python</strong> is your best starting point. MT5 is not just a trading platform — it's a full ecosystem for building, testing, and deploying automated trading strategies powered by AI and machine learning.
                            </p>
                            <p>
                                In this guide, we'll break down everything you need to know: what MT5 is, why Python is the perfect companion, and how to get started with AI-driven trading automation.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <Layers className="h-10 w-10 text-emerald-500" />
                                What is MetaTrader 5 (MT5)?
                            </h2>
                            <p>
                                MetaTrader 5 is a professional multi-asset trading platform developed by MetaQuotes. It supports Forex, Stocks, Commodities, Indices, and Cryptocurrency markets — making it one of the most versatile trading platforms available today.
                            </p>
                            
                            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 my-10">
                                <h4 className="text-emerald-400 font-black mb-6 uppercase tracking-widest italic">Key Highlights Of MT5:</h4>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                    <li className="flex items-center gap-3 text-slate-300 font-bold uppercase text-xs italic"><Check className="h-4 w-4 text-emerald-500" /> Free through most brokers</li>
                                    <li className="flex items-center gap-3 text-slate-300 font-bold uppercase text-xs italic"><Check className="h-4 w-4 text-emerald-500" /> Supports Expert Advisors</li>
                                    <li className="flex items-center gap-3 text-slate-300 font-bold uppercase text-xs italic"><Check className="h-4 w-4 text-emerald-500" /> Built-in Strategy Tester</li>
                                    <li className="flex items-center gap-3 text-slate-300 font-bold uppercase text-xs italic"><Check className="h-4 w-4 text-emerald-500" /> MQL5 & Python Integration</li>
                                </ul>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <Binary className="h-10 w-10 text-cyan-500" />
                                Why Use Python with MT5?
                            </h2>
                            <p>
                                MQL5 is powerful but limited for AI/ML work. Python, on the other hand, has the world's best machine learning libraries. Together, they form the perfect stack for algorithmic trading.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                {[
                                    { title: "Data Manipulation", desc: "Use pandas & numpy for live market data cleaning and transformation.", icon: <Database className="h-6 w-6 text-emerald-400" /> },
                                    { title: "ML Models", desc: "Implement scikit-learn models like SVM and Random Forest for trade signals.", icon: <Cpu className="h-6 w-6 text-cyan-400" /> },
                                    { title: "Deep Learning", desc: "Use TensorFlow / PyTorch for LSTM-based price prediction.", icon: <Workflow className="h-6 w-6 text-purple-400" /> },
                                    { title: "LLM Intelligence", desc: "Integrate OpenAI / Claude for real-time news sentiment analysis.", icon: <Bot className="h-6 w-6 text-yellow-400" /> }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                        <div className="mb-4">{item.icon}</div>
                                        <h4 className="text-white font-black mb-2 uppercase italic tracking-tight">{item.title}</h4>
                                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest leading-relaxed opacity-60 italic">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <Workflow className="h-10 w-10 text-emerald-500" />
                                How Integration Works
                            </h2>
                            <p>
                                The MetaTrader5 Python package acts as a bridge between your Python AI model and the MT5 terminal. Here is the exact 6-step workflow to get started:
                            </p>

                            <div className="relative border-l-2 border-emerald-500/30 ml-4 pl-12 space-y-12 my-16">
                                {[
                                    { label: "Step 1: Environmental Setup", content: "Install MT5 terminal and open a demo account with a broker like IC Markets or XM." },
                                    { label: "Step 2: Library Installation", content: "Use 'pip install MetaTrader5' to install the official integration library." },
                                    { label: "Step 3: Data Retrieval", content: "Connect Python to your running MT5 terminal and pull live OHLCV price data." },
                                    { label: "Step 4: AI Logic Execution", content: "Run your pre-trained ML model or custom strategy logic in your Python script." },
                                    { label: "Step 5: Order Execution", content: "Send programmatic Buy/Sell orders back to MT5 with stop-loss and take-profit levels." },
                                    { label: "Step 6: Performance Monitoring", content: "Automate trade logging and performance tracking using Python's logging frameworks." }
                                ].map((step, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[61px] top-1 w-6 h-6 rounded-full bg-[#050810] border-2 border-emerald-500 z-10 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center text-[10px] font-black text-emerald-500 italic">
                                            {i + 1}
                                        </div>
                                        <h4 className="text-white font-black text-xl mb-2 uppercase italic tracking-tighter">{step.label}</h4>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.1em] italic leading-relaxed opacity-70">{step.content}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white">
                                Popular <span className="text-emerald-500">AI Strategies</span>
                            </h2>
                            <div className="space-y-8 my-12">
                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-emerald-500/30 transition-all">
                                    <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3 uppercase italic tracking-tighter">
                                        <TrendingUp className="h-7 w-7 text-emerald-500" /> 1. Rule-Based Crossover Bot
                                    </h3>
                                    <p className="text-slate-400 font-bold uppercase text-sm italic tracking-widest leading-relaxed opacity-80">
                                        Perfect for beginners. Automate classic indicators like Moving Averages or RSI. It's the best way to learn the technical connectivity between MT5 and Python code.
                                    </p>
                                </div>

                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-cyan-500/30 transition-all">
                                    <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3 uppercase italic tracking-tighter">
                                        <FlaskConical className="h-7 w-7 text-cyan-500" /> 2. ML Signal Classifier
                                    </h3>
                                    <p className="text-slate-400 font-bold uppercase text-sm italic tracking-widest leading-relaxed opacity-80">
                                        Intermediate strategy. Train a Random Forest or SVM on years of historical data to predict the direction of the next candle based on technical features.
                                    </p>
                                </div>

                                <div className="bg-[#121a2e] p-8 rounded-3xl border border-white/10 relative group hover:border-purple-500/30 transition-all">
                                    <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3 uppercase italic tracking-tighter">
                                        <Activity className="h-7 w-7 text-purple-500" /> 3. LSTM Price Prediction
                                    </h3>
                                    <p className="text-slate-400 font-bold uppercase text-sm italic tracking-widest leading-relaxed opacity-80">
                                        Advanced Deep Learning. Use neural networks to capture complex time-series patterns and predict short-term price movements in highly volatile markets.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl mb-12">
                                <p className="text-white font-bold mb-4 flex items-center gap-2 uppercase tracking-widest italic">
                                    <AlertCircle className="h-5 w-5 text-emerald-500" /> Common Mistakes:
                                </p>
                                <ul className="text-slate-400 text-sm font-bold uppercase italic tracking-widest space-y-2 list-none p-0">
                                    <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-emerald-500" /> Skipping backtesting on historical data</li>
                                    <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-emerald-500" /> Over-optimizing models (Curve Fitting)</li>
                                    <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-emerald-500" /> ignoring spreads and slippage costs</li>
                                    <li className="flex items-center gap-2"><ArrowRight className="h-3 w-3 text-emerald-500" /> no automated risk management</li>
                                </ul>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white">
                                Is MT5 + Python <span className="text-emerald-500">Right For You?</span>
                            </h2>
                            <p>
                                This setup is ideal if you want to trade Forex, stocks, or commodities algorithmically and have at least a basic understanding of Python. It gives you the infrastructure of a world-class terminal with the intelligence of modern AI.
                            </p>

                            <div className="bg-gradient-to-br from-emerald-500 to-cyan-600 p-1 rounded-[3rem] my-32">
                                <div className="bg-[#050810] p-10 md:p-16 rounded-[2.8rem] text-center">
                                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8 uppercase italic tracking-tighter">Master Python for AI</h2>
                                    <p className="text-slate-400 mb-12 text-lg font-bold uppercase tracking-widest italic">
                                        Join our 'Python for AI Developers' course to build Real-World financial bots and automation systems.
                                    </p>
                                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:scale-105 transition-all italic" asChild>
                                            <Link href="/courses/python-for-ai-developers">Enroll Now</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tighter uppercase italic">Final Thoughts</h2>
                                <p className="text-lg leading-relaxed mb-8 italic text-slate-400 font-bold uppercase tracking-tight">
                                    MetaTrader 5 combined with Python is one of the most powerful and accessible setups for anyone wanting to enter the world of AI trading automation. Start with a demo account, write your first script, and take it step by step.
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['MT5 Python Integration', 'AI Trading Automation', 'Algorithmic Trading India', 'Python for Finance', 'Forex Automation', 'Machine Learning Trading', 'Celoris Technology'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30 italic">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4 italic">
                    Published by Celoris | celoris.in | India's Premium Tech Learning Platform
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase italic">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
