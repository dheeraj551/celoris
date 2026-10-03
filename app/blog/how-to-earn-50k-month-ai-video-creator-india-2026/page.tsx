import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee, BookOpen, GraduationCap, Users, TrendingUp, Briefcase,
    ExternalLink, Sparkles, CheckCircle2, AlertTriangle, FileText, BarChart3, Target,
    Smartphone, MessageSquare, ShoppingBag, Award, Layers, Cpu, Compass, RefreshCw, Video, Film, Wand2,
    AlertCircle, CreditCard, Percent, ChevronRight, ShieldAlert, PieChart
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ShareButtons from '@/components/ShareButtons';
import BlogEngagement from '@/components/blog/BlogEngagement';

export const metadata: Metadata = {
    title: "How to Earn ₹30,000–₹50,000/Month as an AI Video Creator in India (2026 Blueprint) | Celoris",
    description: "The complete 2026 commercial blueprint: Master generative AI video tools, YouTube AdSense RPM niche math, UPI storefront economics, agency retainers, and the 180-day execution roadmap.",
    keywords: [
        'AI video creator salary India 2026',
        'how to earn money with AI video editing',
        'video editing freelance rates India per reel',
        'YouTube AdSense RPM India 2026 niches',
        'Runway Gen-3 Alpha commercial workflow',
        'Pika Labs Midjourney reel animation',
        'YouTube Shorts AI automation retainer',
        'UPI digital product storefront India',
        'Celoris Job Center video editor jobs',
        'creative video editing course India'
    ],
    alternates: {
        canonical: 'https://www.celorisdesigns.com/blog/how-to-earn-50k-month-ai-video-creator-india-2026',
    },
    openGraph: {
        title: "How to Earn ₹30,000–₹50,000/Month as an AI Video Creator in India (2026 Blueprint) | Celoris",
        description: "Step-by-step breakdown: Tools, rates per video, YouTube RPM niche comparison, UPI digital stores, and monthly agency retainers without an expensive GPU.",
        url: 'https://www.celorisdesigns.com/blog/how-to-earn-50k-month-ai-video-creator-india-2026',
        siteName: 'Celoris',
        locale: 'en_IN',
        images: [
            {
                url: 'https://www.celorisdesigns.com/how-to-earn-50k-month-ai-video-creator-india-2026.jpg',
                width: 1200,
                height: 675,
                alt: 'How to Earn 50000 per month as an AI Video Creator in India 2026 Guide',
            }
        ],
        type: 'article',
        publishedTime: '2026-10-03T07:00:00Z',
        authors: ['Celoris Creative Career Lab'],
    },
    twitter: {
        card: 'summary_large_image',
        title: "How to Earn ₹30,000–₹50,000/Month as an AI Video Creator in India (2026 Blueprint)",
        description: "From prompt engineering to YouTube RPMs and monthly retainer contracts: The modern playbook for Indian video editors.",
        images: ['https://www.celorisdesigns.com/how-to-earn-50k-month-ai-video-creator-india-2026.jpg'],
    }
};

const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://www.celorisdesigns.com"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Blog",
                    "item": "https://www.celorisdesigns.com/blog"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "How to Earn ₹50,000/Month as an AI Video Creator in India (2026 Blueprint)",
                    "item": "https://www.celorisdesigns.com/blog/how-to-earn-50k-month-ai-video-creator-india-2026"
                }
            ]
        },
        {
            "@type": "Article",
            "headline": "How to Earn ₹30,000–₹50,000/Month as an AI Video Creator in India (2026 Blueprint: Tools, Rates, and Retainers)",
            "description": "Comprehensive practical blueprint for Indian creators to master AI-animated video production, land consistent client retainers, and build a high-income creative freelance career.",
            "image": "https://www.celorisdesigns.com/how-to-earn-50k-month-ai-video-creator-india-2026.jpg",
            "datePublished": "2026-10-03T07:00:00Z",
            "dateModified": "2026-10-03T07:00:00Z",
            "author": {
                "@type": "Organization",
                "name": "Celoris Creative Career Lab",
                "url": "https://www.celorisdesigns.com"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Celoris",
                "url": "https://www.celorisdesigns.com",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.celorisdesigns.com/logo.png"
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.celorisdesigns.com/blog/how-to-earn-50k-month-ai-video-creator-india-2026"
            }
        },
        {
            "@type": "HowTo",
            "name": "How to Build a ₹50,000/Month AI Video Freelancing Pipeline in India",
            "description": "A 4-step execution framework from prompt generation to landing recurring monthly agency retainer contracts.",
            "step": [
                {
                    "@type": "HowToStep",
                    "position": 1,
                    "name": "Master the Core Generative Toolchain",
                    "text": "Pair Midjourney v6/Flux for master visual assets with Runway Gen-3/Pika for motion animation, and composite inside Premiere Pro or CapCut."
                },
                {
                    "@type": "HowToStep",
                    "position": 2,
                    "name": "Build a 3-Style Niche Portfolio",
                    "text": "Create 3 sample vertical 9:16 reels showcasing Indian cultural narrative, cinematic product commercial, and high-retention educational storytelling."
                },
                {
                    "@type": "HowToStep",
                    "position": 3,
                    "name": "Package Transparent Per-Video & Retainer Pricing",
                    "text": "Offer starter packs at ₹700–₹1,000 per video for 10-video bundles, scaling to ₹25,000–₹35,000 monthly brand retainer contracts."
                },
                {
                    "@type": "HowToStep",
                    "position": 4,
                    "name": "Apply to Verified Creator Openings",
                    "text": "Submit verified portfolios directly to agency openings such as the Celoris Job Center Public Portal and pitch YouTube creators with custom sample hooks."
                }
            ]
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Do I need an expensive gaming laptop with an RTX 4090 GPU to create AI videos?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. Modern generative video models like Runway Gen-3, Pika Labs, Kling AI, and Midjourney run 100% in the cloud on enterprise server clusters. Any basic laptop or PC with 8GB RAM capable of running a modern web browser and lightweight video editor (like CapCut Desktop or Premiere Pro) is sufficient."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How much do clients in India pay for short-form AI videos?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Rates range from ₹700 to ₹1,500 per 45–60 second vertical video for standard social content. Specialized cinematic or narrative AI animations command ₹2,500 to ₹5,000 per video. Monthly retainers for 10–15 videos typically pay ₹10,000 to ₹25,000 per client."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Who pays for the AI software subscriptions: the client or the creator?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Freelance creators usually cover their own foundational software stack (approx. ₹2,000–₹4,000/month for Midjourney and Runway/Pika starter plans), which is factored into their per-video pricing. However, dedicated agencies like Celoris often provide scripts, voiceovers, or software seats for long-term retainers."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Can college students or full-time employees do this part-time?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes. A skilled AI video creator can produce a high-quality 45–60 second vertical video in 2 to 3.5 hours. Delivering 2 to 3 videos per week easily fits into 6–8 evening or weekend hours while generating ₹8,000 to ₹15,000 in monthly side-income."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What YouTube AdSense RPM can I expect for AI videos in India?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "In India, YouTube long-form AdSense RPM ranges from ₹40 to ₹170 ($0.50 to $2.00 USD) per 1,000 views. Hindi Personal Finance commands the highest RPM (₹100–₹170), requiring 300k–500k monthly views to hit ₹50,000. Devotional and mythology channels average ₹60–₹90 RPM, while general entertainment averages ₹40–₹80 RPM. In contrast, YouTube Shorts only yields ₹5 to ₹30 RPM, requiring 2.5M to 10M views."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why shouldn't Indian creators sell digital products through Gumroad or Stripe?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Over 80% of digital transactions in India happen via UPI. International storefronts like Gumroad and Payhip rely on credit cards or PayPal, which lack native UPI, leading to a 30% to 50% checkout abandonment rate. Furthermore, international platforms deduct 18% to 25% in fees, currency conversion spreads, and payout deductions. Indian UPI-native storefronts like Playto or Peerseek provide seamless UPI checkout and net ₹9,500+ out of ₹10,000 in sales."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How can I avoid YouTube demonetization for 'Reused Content' when using generative AI?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "YouTube demonetizes channels that upload raw, mass-automated text-to-video outputs without human creative value. To protect your channel, implement a Human-in-the-Loop workflow: write original narrative scripts, custom color grade all clips, manually pace cuts to audio markers in Premiere Pro or CapCut, and layer unique sound design, commentary, and motion graphics."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What hidden costs occur when paying for AI video tools in India?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "AI subscriptions billed in USD (such as Midjourney, Runway, or ElevenLabs) incur an 18% Indian Digital Services GST (OIDAR) plus a 3% to 4% bank foreign exchange markup. For example, a $20/month plan actually debits approximately ₹2,100 to ₹2,240 on your Indian card. Budget ₹2,500 to ₹3,500/month for your complete cloud stack, or utilize tools offering direct INR billing."
                    }
                }
            ]
        }
    ]
};

export default function AIVideoCreatorGuidePage() {
    return (
        <article className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 selection:text-white font-sans antialiased overflow-x-hidden">
            {/* JSON-LD Rich Snippet Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
            />

            {/* Top Glowing Ambient Accents */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[450px] bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-[140px] pointer-events-none z-0" />
            <div className="fixed top-80 right-0 w-[400px] h-[500px] bg-purple-500/5 blur-[150px] pointer-events-none z-0" />

            {/* Sticky Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-[3px] bg-white/[0.04] z-50">
                <div className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 w-1/3" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                {/* Back Link */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-xs font-mono font-medium text-slate-400 hover:text-emerald-400 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to All Career Playbooks
                </Link>

                {/* Hero Header */}
                <header className="space-y-6 pb-8 border-b border-white/[0.08]">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                            2026 Career Blueprint
                        </span>
                        <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-mono font-bold">
                            ₹30k–₹50k/Mo Retainers
                        </span>
                        <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold flex items-center gap-1">
                            <IndianRupee className="w-3 h-3" />
                            India Market Verified
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] text-balance">
                        How to Earn <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">₹30,000–₹50,000/Month</span> as an AI Video Creator in India
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                        Traditional timeline video editing is suffering a massive price collapse. Meanwhile, creators who combine <strong>Generative AI tools (Runway, Pika, Midjourney)</strong> with narrative pacing are closing <strong>₹10,000–₹25,000 monthly agency retainers</strong>. Here is the exact commercial blueprint, per-reel pricing math, and client pipeline.
                    </p>

                    {/* Metadata Strip */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 text-xs text-slate-400 font-mono">
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[11px] font-bold text-emerald-400">
                                    CD
                                </div>
                                <span>Celoris Creative Career Lab</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                <span>October 3, 2026</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-slate-500" />
                                <span>16 Min Read</span>
                            </div>
                        </div>

                        <ShareButtons
                            title="How to Earn ₹30,000–₹50,000/Month as an AI Video Creator in India (2026 Blueprint)"
                            slug="how-to-earn-50k-month-ai-video-creator-india-2026"
                        />
                    </div>
                </header>

                {/* Feature Image Banner */}
                <div className="my-8 rounded-3xl overflow-hidden border border-white/10 bg-[#0d1322] shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative group">
                    <img
                        src="/how-to-earn-50k-month-ai-video-creator-india-2026.jpg"
                        alt="AI Video Creator working in creative studio in Delhi"
                        className="w-full h-auto object-cover max-h-[480px] group-hover:scale-102 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-60 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-slate-300 flex items-center justify-between">
                        <span className="flex items-center gap-2 font-mono">
                            <Film className="w-3.5 h-3.5 text-emerald-400" />
                            The 2026 AI Short-Form Production Workspace
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:inline font-mono">
                            100% Cloud-Rendered • 9:16 Vertical Optimization
                        </span>
                    </div>
                </div>

                {/* Key Takeaways Box (Executive Summary) */}
                <div className="my-10 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-[#0d1628]/70 to-[#080d1a] border border-emerald-500/25 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2.5">
                        <Zap className="w-4 h-4 text-emerald-400" />
                        Executive Summary: The ₹50,000/Month Monthly Unit Economics
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                            <div className="text-slate-400 mb-1">Volume Needed</div>
                            <div className="text-lg font-bold text-white">30–35 Reels/Mo</div>
                            <div className="text-[10.5px] text-emerald-400 mt-1">~1 Reel/day (3 hrs work)</div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                            <div className="text-slate-400 mb-1">Average Pay per Video</div>
                            <div className="text-lg font-bold text-emerald-400">₹1,000 – ₹1,500</div>
                            <div className="text-[10.5px] text-slate-400 mt-1">₹700 floor for beginners</div>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                            <div className="text-slate-400 mb-1">Target Client Mix</div>
                            <div className="text-lg font-bold text-cyan-300">2–3 Agency Retainers</div>
                            <div className="text-[10.5px] text-slate-400 mt-1">₹15k–₹20k/client contract</div>
                        </div>
                    </div>
                </div>

                {/* Section 1: The Collapse of Old Video Editing */}
                <section className="space-y-6 my-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-mono">01</span>
                        The Death of ₹300 Timeline Editing (And Why AI Creators Are Winning)
                    </h2>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        If you have been bidding for video editing gigs on Upwork, Fiverr, or Instagram DMs in India recently, you have likely felt the painful race to the bottom. Clients routinely offer <strong>₹250 to ₹400 per reel</strong> for manual subtitles, jumping cuts, and generic stock footage.
                    </p>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        Why? Because thousands of beginners with cracked copies of Premiere Pro can cut talking-head clips. <strong>Basic timeline assembly has become a commodity.</strong>
                    </p>

                    <div className="p-5 rounded-2xl bg-[#0e1424] border border-white/10 space-y-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            What Brands, Agencies, and Creators Actually Need in 2026:
                        </h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>Visual Worldbuilding:</strong> Transforming boring voiceovers into cinematic sci-fi, festive, historical, or mythological animations.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>0.5-Second Scroll Stoppers:</strong> Dynamic AI-generated hook scenes that freeze scrollers in their tracks.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>High-Velocity Turnaround:</strong> Delivering 45–60s vertical content within 48 to 72 hours, without needing camera crews or actors.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span><strong>Platform-Native Framing:</strong> Crisp 9:16 vertical exports with sound design, impact audio, and pacing tailored for Reels & Shorts.</span>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 2: The Modern AI Toolchain */}
                <section className="space-y-6 my-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-mono">02</span>
                        The 2026 AI Production Tech Stack (No RTX 4090 Required)
                    </h2>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        The biggest myth holding back aspiring creators is believing you need a ₹1.5 lakh gaming rig with a massive graphics card. <strong>All primary generative AI video engines run on high-performance cloud clusters.</strong> Your local computer only handles the final assembly and sound design.
                    </p>

                    {/* Toolchain Table */}
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d121f]">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.03] text-slate-300 font-mono uppercase tracking-wider">
                                    <th className="p-3.5">Category</th>
                                    <th className="p-3.5">Industry Standard Tools</th>
                                    <th className="p-3.5">Why It's Essential</th>
                                    <th className="p-3.5">Cost in India (Approx)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06] text-slate-300 font-sans">
                                <tr>
                                    <td className="p-3.5 font-bold text-emerald-400 font-mono">1. Asset & Character Generation</td>
                                    <td className="p-3.5 font-semibold text-white">Midjourney v6.1 / Flux.1 / Ideogram 2.0</td>
                                    <td className="p-3.5 text-slate-300">Generates photorealistic base frames, character consistency, and stylized backdrops.</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹800 – ₹2,400/mo (Cloud)</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-emerald-400 font-mono">2. Motion & Video Synthesis</td>
                                    <td className="p-3.5 font-semibold text-white">Runway Gen-3 Alpha / Pika 2.0 / Kling AI / Luma</td>
                                    <td className="p-3.5 text-slate-300">Turns static base images into 4–10 second cinematic camera motions and character movement.</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹1,200 – ₹2,800/mo (Cloud)</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-emerald-400 font-mono">3. Audio & Voiceovers</td>
                                    <td className="p-3.5 font-semibold text-white">ElevenLabs / Suno AI / CapCut Audio</td>
                                    <td className="p-3.5 text-slate-300">Ultra-realistic Indian accented narration, emotional background scoring, and sound fx.</td>
                                    <td className="p-3.5 font-mono text-slate-400">Free tier to ₹400/mo</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-emerald-400 font-mono">4. Assembly & Sound Design</td>
                                    <td className="p-3.5 font-semibold text-white">Adobe Premiere Pro / CapCut Desktop / DaVinci</td>
                                    <td className="p-3.5 text-slate-300">Syncs audio beats, cuts transitions, color grades, and adds vertical safe-zone captions.</td>
                                    <td className="p-3.5 font-mono text-slate-400">Free (CapCut/DaVinci) or ₹1,600/mo</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Hidden Subscription Overhead: 18% GST + Forex Card */}
                    <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/20 via-[#101524] to-[#0d121f] border border-amber-500/25 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                                <Percent className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    Budget Accounting: The 18% GST & Foreign Exchange Markup Tax
                                </h4>
                                <p className="text-[11px] text-slate-400 font-mono">
                                    Why a $20/month SaaS subscription actually debits ~₹2,240 from your Indian card
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                            A major financial blind spot for new Indian creators is forgetting cross-border payment surcharges. Generative AI tools billed in USD trigger <strong>18% Indian Digital Services GST (OIDAR tax)</strong> plus a <strong>3.5% foreign currency markup</strong> from your bank:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                <div className="text-[10px] text-slate-400 uppercase">1. Base USD Conversion</div>
                                <div className="text-sm font-bold text-white">$20 × ₹86.50 = ₹1,730</div>
                                <div className="text-[10px] text-slate-500">Standard card forex conversion</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                <div className="text-[10px] text-amber-400 uppercase">2. 18% Digital GST + Bank FX</div>
                                <div className="text-sm font-bold text-amber-300">+₹311 GST + ₹65 FX fee</div>
                                <div className="text-[10px] text-slate-500">Auto-debited by bank & gateway</div>
                            </div>
                            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                                <div className="text-[10px] text-emerald-400 uppercase">3. Real Out-of-Pocket Cost</div>
                                <div className="text-sm font-bold text-emerald-400">≈ ₹2,106 – ₹2,242</div>
                                <div className="text-[10px] text-slate-400">Actual monthly statement debit</div>
                            </div>
                        </div>

                        <div className="text-[11.5px] text-slate-300 flex items-start gap-2 bg-white/[0.02] p-3 rounded-xl border border-white/5">
                            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span><strong>Pro-Tip:</strong> Budget a realistic ₹2,500 to ₹3,500/month for your combined Midjourney + Runway starter stack. Where possible, utilize tools supporting domestic INR billing or annual pass purchases to bypass recurring forex fees.</span>
                        </div>
                    </div>
                </section>

                {/* Section 3: Commercial Rates in India */}
                <section className="space-y-6 my-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-mono">03</span>
                        Commercial Pricing Guide: What to Charge Per Video in India
                    </h2>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        Pricing yourself correctly is the difference between burning out for pocket change and running a healthy creative business. Never quote hourly rates to clients in India—quote <strong>Per-Video or Monthly Retainer Packages</strong>.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Tier 1 */}
                        <div className="p-5 rounded-2xl bg-[#0b0e17] border border-white/10 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Tier 1 • Entry Level</span>
                                <h3 className="text-lg font-bold text-white">Curated AI B-Roll & Captions</h3>
                                <div className="text-2xl font-extrabold text-slate-300 font-mono">₹500 – ₹700 <span className="text-xs font-normal text-slate-500">/video</span></div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Simple talking-head clips enhanced with AI-generated B-roll clips, sound effects, and kinetic subtitles. Turnaround: 24 hours.
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                                Monthly 12-Reel Retainer: <strong>₹6,000 – ₹8,000</strong>
                            </div>
                        </div>

                        {/* Tier 2 (Highlighted) */}
                        <div className="p-5 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-[#0d1624] to-[#0a101d] border border-emerald-500/40 flex flex-col justify-between space-y-4 shadow-[0_10px_30px_rgba(52,211,153,0.1)] relative">
                            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                                Most Popular
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Tier 2 • Pro AI Animator</span>
                                <h3 className="text-lg font-bold text-white">Full AI Narrative & Shorts</h3>
                                <div className="text-2xl font-extrabold text-emerald-400 font-mono">₹800 – ₹1,500 <span className="text-xs font-normal text-slate-300">/video</span></div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Full 45–60s visual story generated from scratch using script + voiceover. Consistent characters, custom AI camera pans, sound design.
                                </p>
                            </div>
                            <div className="pt-3 border-t border-emerald-500/20 text-[11px] text-emerald-300 font-mono">
                                Monthly 12-Reel Retainer: <strong>₹10,000 – ₹15,000</strong>
                            </div>
                        </div>

                        {/* Tier 3 */}
                        <div className="p-5 rounded-2xl bg-[#0b0e17] border border-white/10 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">Tier 3 • Premium Cinematic</span>
                                <h3 className="text-lg font-bold text-white">Commercial & Mythological DVC</h3>
                                <div className="text-2xl font-extrabold text-purple-300 font-mono">₹2,500 – ₹5,000+ <span className="text-xs font-normal text-slate-500">/video</span></div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Hyper-realistic brand commercials, 3D element integration, deep storytelling, custom audio mixing, and multi-shot continuity.
                                </p>
                            </div>
                            <div className="pt-3 border-t border-white/5 text-[11px] text-slate-400 font-mono">
                                Monthly 4-Video Campaign: <strong>₹15,000 – ₹25,000</strong>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 4: Live Job Opportunity Feature */}
                <div className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900/30 via-[#101827] to-cyan-900/20 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 text-[10px] font-bold animate-pulse">
                                Active Urgent Opening
                            </span>
                            <span className="text-xs text-slate-400 font-mono">Celoris Job Center</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                            We Are Hiring: AI-Animated Video Creators (Remote)
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                            Celoris Designs is actively looking for AI animation creators for long-term collaboration. Scripts and voiceovers provided. Pay: <strong>₹700 – ₹1,000 per video (Est. ₹7,000 – ₹12,000/mo)</strong>.
                        </p>
                    </div>
                    <Link
                        href="/job-center"
                        className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 shrink-0 group"
                    >
                        View & Apply in Job Center
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Section 5: The 4-Step Production Pipeline */}
                <section className="space-y-6 my-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-mono">04</span>
                        The 4-Step 3-Hour Workflow (Script to Final Render)
                    </h2>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        To earn ₹40,000–₹50,000 without working 16 hours a day, you must turn video production into an automated, systematic pipeline. Here is the exact checklist used by top creators:
                    </p>

                    <div className="space-y-4">
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c101a] border border-white/[0.08] flex items-start gap-4">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-bold font-mono shrink-0 text-sm">
                                01
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-sm font-bold text-white">Audio & Beat Script Breakdown (20 Mins)</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Import the voiceover into your timeline. Cut out dead pauses. Drop markers at every 3 to 4-second narrative beat where the visual must cut or transform to keep retention high.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c101a] border border-white/[0.08] flex items-start gap-4">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-bold font-mono shrink-0 text-sm">
                                02
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-sm font-bold text-white">Prompt Engineering & Seed Locking (45 Mins)</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Generate base 9:16 vertical keyframes on Midjourney or Flux. Lock your prompt styling (`cinematic 35mm, volumetric lighting, hyper-realistic, Indian cultural aesthetic`) so all 8–12 scenes look like they belong to the same film.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c101a] border border-white/[0.08] flex items-start gap-4">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-bold font-mono shrink-0 text-sm">
                                03
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-sm font-bold text-white">Motion Video Synthesis in Runway/Pika (45 Mins)</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Upload your keyframes into Runway Gen-3 Alpha or Pika. Use motion brushes and camera controls (`slow zoom in, dramatic tilt up, subtle wind drift`). Export clean 5-second MP4s.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c101a] border border-white/[0.08] flex items-start gap-4">
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 font-bold font-mono shrink-0 text-sm">
                                04
                            </div>
                            <div className="space-y-1.5">
                                <h4 className="text-sm font-bold text-white">Compositing, SFX, and Vertical Export (40 Mins)</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Drop the clips onto your Premiere or CapCut timeline. Add whoosh transitions on scene changes, layer subtle background ambiance (wind, cinematic rumble, festive beat), apply slight color warmth, and export at 1080x1920 (60 fps).
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 5: Direct Channel Monetization & Niche Economics */}
                <section className="space-y-6 my-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-mono">05</span>
                        Direct Channel Monetization & Indian YouTube AdSense RPMs
                    </h2>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        If your ambition is building faceless AI channels on YouTube, you must understand the financial reality of Indian ad revenue. Indian AdSense <strong>Revenue Per Mille (RPM)</strong> ranges from <strong>₹40 to ₹170 ($0.50 to $2.00 USD) per 1,000 views</strong> for long-form content—far below the $4–$9 RPM typical of Western markets.
                    </p>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        Because advertiser demand varies dramatically across industries, selecting the right niche determines whether you need <strong>300,000 views or 1.25 million views</strong> to generate ₹50,000/month:
                    </p>

                    {/* Niche RPM Comparison Table */}
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d121f]">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.03] text-slate-300 font-mono uppercase tracking-wider">
                                    <th className="p-3.5">Niche Category</th>
                                    <th className="p-3.5">Expected Long-Form RPM</th>
                                    <th className="p-3.5">AI Production Fit</th>
                                    <th className="p-3.5">Monthly Views for ₹50,000 Target</th>
                                    <th className="p-3.5">Key Revenue Beyond AdSense</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06] text-slate-300 font-sans">
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">Hindi Personal Finance</td>
                                    <td className="p-3.5 font-bold text-emerald-400 font-mono">₹100 – ₹170</td>
                                    <td className="p-3.5 text-slate-300"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px]">High</span> Data graphics, visual explainers, charts</td>
                                    <td className="p-3.5 font-mono text-cyan-300 font-bold">300k – 500k</td>
                                    <td className="p-3.5 text-slate-400">Fintech affiliate signups, credit cards, courses</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">Indian Mythology & Devotional</td>
                                    <td className="p-3.5 font-bold text-emerald-400 font-mono">₹60 – ₹90</td>
                                    <td className="p-3.5 text-slate-300"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 font-mono text-[10px]">Very High</span> Generative temple visuals, Vedic lore, TTS</td>
                                    <td className="p-3.5 font-mono text-cyan-300 font-bold">555k – 833k</td>
                                    <td className="p-3.5 text-slate-400">Spiritual merchandise, channel memberships, e-books</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">Indian History & General Knowledge</td>
                                    <td className="p-3.5 font-bold text-emerald-400 font-mono">₹50 – ₹80</td>
                                    <td className="p-3.5 text-slate-300"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[10px]">High</span> Historical maps, ancient battles, cinematic voiceover</td>
                                    <td className="p-3.5 font-mono text-cyan-300 font-bold">625k – 1,000,000</td>
                                    <td className="p-3.5 text-slate-400">Educational apps, audiobooks, study guides</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">Current Affairs & Daily News</td>
                                    <td className="p-3.5 font-bold text-amber-300 font-mono">₹40 – ₹70</td>
                                    <td className="p-3.5 text-slate-300"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono text-[10px]">Medium</span> Rapid turnaround needed; requires strict fact check</td>
                                    <td className="p-3.5 font-mono text-cyan-300 font-bold">714k – 1,250,000</td>
                                    <td className="p-3.5 text-slate-400">Volume impressions, aggregator affiliates</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">Entertainment, Comedy & Pop Lore</td>
                                    <td className="p-3.5 font-bold text-amber-300 font-mono">₹40 – ₹80</td>
                                    <td className="p-3.5 text-slate-300"><span className="px-2 py-0.5 rounded bg-slate-500/10 text-slate-300 font-mono text-[10px]">Moderate</span> High competition, fast visual pacing required</td>
                                    <td className="p-3.5 font-mono text-cyan-300 font-bold">625k – 1,250,000</td>
                                    <td className="p-3.5 text-slate-400">Brand sponsors, fan tips, mass digital packs</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Long-Form vs. Shorts Economics Trap Callout */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#0c1220] border border-cyan-500/30 space-y-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-cyan-400" />
                            The Shorts Economics Trap: Why Shorts Alone Won't Pay Your Bills
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Many beginners believe that racking up millions of views on YouTube Shorts will make them rich. Here is the mathematical reality: <strong>YouTube Shorts RPM in India sits between ₹5 and ₹30 per 1,000 views</strong>.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5 font-mono">
                                <div className="text-[11px] text-rose-400 font-bold">Shorts Exclusively (Low RPM)</div>
                                <div className="text-xl font-extrabold text-white">2.5M – 10M Views</div>
                                <p className="text-[11px] text-slate-400 font-sans leading-normal">
                                    Required every single month just to hit ₹50,000 ad payout. Highly volatile and prone to sudden algorithm drop-offs.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5 font-mono">
                                <div className="text-[11px] text-emerald-400 font-bold">Long-Form + Backend Funnel (High RPM)</div>
                                <div className="text-xl font-extrabold text-white">300k – 500k Views</div>
                                <p className="text-[11px] text-slate-400 font-sans leading-normal">
                                    Generates ₹50,000 AdSense easily in finance/mythology, while Shorts act as a top-of-funnel discovery magnet.
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 pt-1">
                            <strong>The Strategic Rule:</strong> Treat YouTube Shorts as free organic advertising. Use them to hook attention and drive viewers either to 8–12 minute long-form YouTube videos or directly to your digital product storefront.
                        </p>
                    </div>
                </section>

                {/* Section 6: High-Yield B2B Services & Agency Retainers */}
                <section className="space-y-6 my-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-mono">06</span>
                        High-Yield B2B Client Acquisition & Monthly Agency Retainers
                    </h2>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        While automated AdSense channels take 3 to 6 months to mature, offering B2B AI video production delivers immediate cash flow within your first 14 days. Direct-to-Consumer (D2C) brands, performance marketing agencies, and EdTech platforms face relentless pressure to publish high volumes of video.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1220] border border-white/10 space-y-2">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold uppercase">Deliverable 1</span>
                            <h4 className="text-sm font-bold text-white">Meta Advantage+ Performance Ad Creatives</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Meta’s automated ad distribution systems require 20 to 50 video variants per campaign to test hooks, angles, and CTAs. A freelance AI specialist delivering 15 to 30 hook variants commands monthly retainers between <strong>₹15,000 and ₹25,000 per brand</strong>. Securing just two clients satisfies your target income goal.
                            </p>
                        </div>
                        <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1220] border border-white/10 space-y-2">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-bold uppercase">Deliverable 2</span>
                            <h4 className="text-sm font-bold text-white">EdTech & Online Course Localization</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                EdTech startups and course creators need chapter explainers, animated visual diagrams, and localized voiceovers. AI-assisted production delivers course assets <strong>4x faster at 60% lower cost</strong> than studio crews, supporting retainers from <strong>₹15,000 to ₹30,000/month</strong>.
                            </p>
                        </div>
                    </div>

                    {/* Outreach protocol */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1424] border border-white/10 space-y-4">
                        <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                            <Target className="w-4 h-4 text-emerald-400" />
                            The "Free 3-Second Hook" Outreach Protocol:
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Do not send generic cold DMs saying: <i>"Hi sir, I am a video editor, hire me."</i> That has a near-zero response rate. Instead, take a creator's existing talking-head video, re-animate the first 3 seconds into a mind-blowing cinematic scene, and send this message:
                        </p>
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-slate-300 leading-relaxed">
                            "Hey [Creator/Brand Name]! Loved your recent video on [Topic]. Noticed your intro retained 40% in the first 3 seconds. I took your voiceover and re-imagined the first 4 seconds with a custom AI animation hook [link to 4-second clip]. No charge at all—just thought it looked super cool with your style! If you ever want 10 of these a month for your YouTube Shorts, let me know. Keep crushing it!"
                        </div>
                        <p className="text-xs text-slate-400">
                            When an influencer or agency owner sees their own voice paired with a stunning custom visual you already built, <strong>their reply rate jumps from 2% to over 35%.</strong>
                        </p>
                    </div>
                </section>

                {/* Section 7: Backend Digital Products & UPI Storefront Economics */}
                <section className="space-y-6 my-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-mono">07</span>
                        Backend Digital Products & UPI Storefront Economics
                    </h2>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        Creators who rely 100% on ad impressions or client retainers remain vulnerable to algorithm changes and client churn. The highest-margin asset an AI creator can own is a <strong>proprietary digital backend</strong>: ready-made prompt libraries, vertical video templates, sound effect packs, and Midjourney style cheatsheets.
                    </p>

                    <div className="p-5 rounded-2xl bg-[#0e1424] border border-amber-500/30 space-y-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400" />
                            The International Storefront Trap: Why Gumroad & Stripe Fail in India
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Over <strong>80% of digital transactions in India occur via UPI</strong>. Western creator storefronts like Gumroad, Payhip, or Stan Store do not support native UPI checkout. Sending Indian buyers to a credit card/PayPal checkout results in a <strong>30% to 50% cart abandonment rate</strong>, plus an 18% to 25% loss in platform fees and currency conversion deductions.
                        </p>
                    </div>

                    {/* Storefront Comparison Table */}
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d121f]">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.03] text-slate-300 font-mono uppercase tracking-wider">
                                    <th className="p-3.5">Storefront Platform</th>
                                    <th className="p-3.5">Fee Structure</th>
                                    <th className="p-3.5">Monthly Cost</th>
                                    <th className="p-3.5">Native UPI Checkout</th>
                                    <th className="p-3.5">Direct Bank Settlement</th>
                                    <th className="p-3.5">Net Payout on ₹10,000 Sales</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06] text-slate-300 font-sans">
                                <tr className="bg-emerald-500/[0.03]">
                                    <td className="p-3.5 font-bold text-emerald-400 font-mono">Playto</td>
                                    <td className="p-3.5 text-slate-300">0% platform fee, 0% UPI MDR</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹0/mo</td>
                                    <td className="p-3.5 text-emerald-400 font-semibold">Yes (UPI Autopay)</td>
                                    <td className="p-3.5 text-slate-300">Daily INR</td>
                                    <td className="p-3.5 font-mono font-bold text-emerald-400">₹9,750 – ₹10,000</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">Peerseek</td>
                                    <td className="p-3.5 text-slate-300">5% flat transaction fee</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹0/mo</td>
                                    <td className="p-3.5 text-emerald-400 font-semibold">Yes</td>
                                    <td className="p-3.5 text-slate-300">Direct INR</td>
                                    <td className="p-3.5 font-mono font-bold text-white">₹9,500</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">SuperProfile (Cosmofeed)</td>
                                    <td className="p-3.5 text-slate-300">5% + 18% GST</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹499/mo (Creator)</td>
                                    <td className="p-3.5 text-emerald-400 font-semibold">Yes</td>
                                    <td className="p-3.5 text-slate-300">Direct INR</td>
                                    <td className="p-3.5 font-mono text-slate-300">₹9,410 <span className="text-[10px] text-slate-500">(-₹499 sub)</span></td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">Graphy</td>
                                    <td className="p-3.5 text-slate-300">10% + 18% GST revenue share</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹1,999/mo</td>
                                    <td className="p-3.5 text-emerald-400 font-semibold">Yes</td>
                                    <td className="p-3.5 text-slate-300">Direct INR</td>
                                    <td className="p-3.5 font-mono text-slate-300">~₹9,000 <span className="text-[10px] text-slate-500">(-sub)</span></td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">Instamojo</td>
                                    <td className="p-3.5 text-slate-300">10% + ₹3/sale (Lite)</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹0/mo</td>
                                    <td className="p-3.5 text-emerald-400 font-semibold">Yes</td>
                                    <td className="p-3.5 text-slate-300">Direct INR</td>
                                    <td className="p-3.5 font-mono text-slate-300">₹8,970</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-white font-mono">Topmate</td>
                                    <td className="p-3.5 text-slate-300">~10% commission + gateway</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹0/mo</td>
                                    <td className="p-3.5 text-emerald-400 font-semibold">Yes</td>
                                    <td className="p-3.5 text-slate-300">Direct INR</td>
                                    <td className="p-3.5 font-mono text-slate-300">~₹8,750</td>
                                </tr>
                                <tr className="bg-rose-500/[0.03]">
                                    <td className="p-3.5 font-bold text-rose-300 font-mono">Gumroad / Payhip</td>
                                    <td className="p-3.5 text-slate-300">10% + $0.50/sale + FX conversion</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹0/mo</td>
                                    <td className="p-3.5 text-rose-400 font-semibold">No (Cards only)</td>
                                    <td className="p-3.5 text-slate-400">PayPal / Wire</td>
                                    <td className="p-3.5 font-mono text-rose-400 font-bold">~₹7,900 – ₹8,200 <span className="text-[10px] text-rose-300">(18–21% fee loss)</span></td>
                                </tr>
                                <tr className="bg-rose-500/[0.03]">
                                    <td className="p-3.5 font-bold text-rose-300 font-mono">Stan Store</td>
                                    <td className="p-3.5 text-slate-300">0% fee + Stripe processing</td>
                                    <td className="p-3.5 font-mono text-slate-400">$29/mo (~₹2,400)</td>
                                    <td className="p-3.5 text-rose-400 font-semibold">No (Stripe INR restricted)</td>
                                    <td className="p-3.5 text-slate-400">Restricted</td>
                                    <td className="p-3.5 font-mono text-rose-400 font-bold">~₹7,100 <span className="text-[10px] text-rose-300">(High sub drag)</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Small-Ticket Bundle Math */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-[#0e1627] to-[#070b14] border border-emerald-500/25 space-y-3">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            The ₹149 Template Bundle Math: How 300 Buyers = ₹42,000 Clean Profit
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Instead of trying to sell a high-friction ₹4,999 course to cold social media followers, top Indian AI creators package an impulse-purchase <strong>"AI Video Creator Prompt & Motion Preset Kit" priced at ₹149</strong>:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-1">
                            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                <div className="text-[10px] text-slate-400 uppercase">Volume Needed</div>
                                <div className="text-base font-bold text-white">300 Sales / Mo</div>
                                <div className="text-[10.5px] text-emerald-400">~10 sales / day from bio links</div>
                            </div>
                            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                <div className="text-[10px] text-slate-400 uppercase">Gross Revenue</div>
                                <div className="text-base font-bold text-cyan-300">₹44,700</div>
                                <div className="text-[10.5px] text-slate-400">300 × ₹149 bundle price</div>
                            </div>
                            <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                                <div className="text-[10px] text-emerald-400 uppercase">Net UPI Bank Payout</div>
                                <div className="text-base font-bold text-emerald-400">≈ ₹42,000</div>
                                <div className="text-[10.5px] text-slate-400">Via Playto or Peerseek 0–5% fee</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 8: The Consolidated Revenue Matrix & 180-Day Roadmap */}
                <section className="space-y-6 my-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-mono">08</span>
                        The Consolidated Revenue Matrix: 3 Blended Pathways to ₹50,000/Month
                    </h2>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        The creators who thrive long-term do not rely exclusively on a single source of income. By blending agency retainers, automated AdSense channels, and digital asset sales, they protect their income against algorithm swings and dry client pipelines.
                    </p>

                    {/* Operational Models Table */}
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0d121f]">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.03] text-slate-300 font-mono uppercase tracking-wider">
                                    <th className="p-3.5">Operational Model</th>
                                    <th className="p-3.5">Revenue Breakdown</th>
                                    <th className="p-3.5">Monthly Volume Output</th>
                                    <th className="p-3.5">Est. Software Overhead</th>
                                    <th className="p-3.5">Net Monthly Profit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.06] text-slate-300 font-sans">
                                <tr>
                                    <td className="p-3.5 font-bold text-emerald-400 font-mono">Model A: Pure Freelancer / B2B Specialist</td>
                                    <td className="p-3.5 text-slate-300">
                                        • 2 Brand Retainers @ ₹20,000/mo<br />
                                        • Marketplace projects: ₹10,000
                                    </td>
                                    <td className="p-3.5 text-slate-300 font-mono">30–40 Short-form Reels / Ads, 1–2 course modules</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹2,000 – ₹4,000</td>
                                    <td className="p-3.5 font-mono font-bold text-emerald-400 text-sm">₹46,000 – ₹48,000</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-cyan-300 font-mono">Model B: Channel Automation + Store</td>
                                    <td className="p-3.5 text-slate-300">
                                        • YouTube AdSense: ₹25,000 (250K views @ ₹100 RPM)<br />
                                        • Digital Products: ₹20,000 (135 sales @ ₹149)<br />
                                        • Affiliates: ₹5,000
                                    </td>
                                    <td className="p-3.5 text-slate-300 font-mono">12–16 Long-form videos, 30 Shorts</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹830 – ₹2,500</td>
                                    <td className="p-3.5 font-mono font-bold text-cyan-300 text-sm">₹47,500 – ₹49,170</td>
                                </tr>
                                <tr>
                                    <td className="p-3.5 font-bold text-purple-300 font-mono">Model C: Hybrid Creator-Agency Model</td>
                                    <td className="p-3.5 text-slate-300">
                                        • 1 B2B Brand Retainer: ₹25,000<br />
                                        • AdSense Revenue: ₹15,000 (200K views @ ₹75 RPM)<br />
                                        • Digital Bundles: ₹10,000
                                    </td>
                                    <td className="p-3.5 text-slate-300 font-mono">15 B2B Client Reels, 8 Long-form videos, daily Shorts</td>
                                    <td className="p-3.5 font-mono text-slate-400">₹1,500 – ₹3,000</td>
                                    <td className="p-3.5 font-mono font-bold text-purple-300 text-sm">₹47,000 – ₹48,500</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Phased Roadmap Timeline */}
                    <div className="p-6 sm:p-7 rounded-2xl bg-[#0b0e17] border border-white/10 space-y-5">
                        <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                                The 180-Day Step-by-Step Phased Execution Roadmap
                            </h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Phase 1 (Days 1–30)</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                </div>
                                <h5 className="text-xs font-bold text-white">Foundation & Lean Portfolio</h5>
                                <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
                                    <li>Set up lean cloud stack (Midjourney + Runway starter)</li>
                                    <li>Build 5 commercial samples (Finance, Mythology, D2C Ads, EdTech)</li>
                                    <li>Master CapCut/Premiere audio markers and kinetic text</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">Phase 2 (Days 31–60)</span>
                                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                                </div>
                                <h5 className="text-xs font-bold text-white">Client Acquisition & Retainers</h5>
                                <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
                                    <li>Execute "Free 3-Second Hook" protocol to 30 targeted brands</li>
                                    <li>Apply to verified openings on Celoris Job Center</li>
                                    <li>Lock in your first 2 recurring retainers @ ₹15,000–₹20,000/mo</li>
                                </ul>
                            </div>

                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">Phase 3 (Days 61–180)</span>
                                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                </div>
                                <h5 className="text-xs font-bold text-white">Automated Scaling & Digital Store</h5>
                                <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside leading-relaxed">
                                    <li>Launch faceless YouTube channel (3 long-form/wk + daily Shorts)</li>
                                    <li>Deploy ₹149 prompt & motion preset bundle on UPI store</li>
                                    <li>Scale consolidated net income sustainably beyond ₹50,000/mo</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 9: Platform Risk Analysis & Demonetization Safeguards */}
                <section className="space-y-6 my-12">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400 font-mono">09</span>
                        Platform Risk Analysis: Preventing YouTube "Reused Content" Demonetization
                    </h2>

                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                        Generating videos with AI carries real platform risks if you treat it like an unsupervised copy-paste machine. YouTube’s algorithm actively penalizes channels uploading raw, programmatic, low-effort AI slop.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl bg-[#0c101a] border border-white/10 space-y-2.5">
                            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold">
                                <ShieldAlert className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-white">1. YouTube Reused Content Demonetization</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <strong>Risk:</strong> Channels spitting out automated ChatGPT scripts into generic AI text-to-video generators get rejected from the YouTube Partner Program under "Reused Content".
                            </p>
                            <p className="text-xs text-emerald-400 font-mono">
                                <strong>Mitigation:</strong> Implement a strict <i>Human-in-the-Loop</i> protocol. Personally edit scripts, introduce custom pacing cuts in CapCut/Premiere, apply original color LUTs, and layer unique human-curated sound design.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#0c101a] border border-white/10 space-y-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-white">2. Currency & Software Overhead Volatility</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <strong>Risk:</strong> USD-billed SaaS models increase unexpected overhead during rupee depreciation or when credit card international limits fail.
                            </p>
                            <p className="text-xs text-emerald-400 font-mono">
                                <strong>Mitigation:</strong> Where available, switch to native INR billing options (e.g., InVideo AI or TrueFan) or lock in discounted annual billing once your initial client retainers establish reliable positive cash flow.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#0c101a] border border-white/10 space-y-2.5">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                                <Smartphone className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm font-bold text-white">3. Domestic Checkout Drop-Off Friction</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                <strong>Risk:</strong> Using Stripe/PayPal links for selling digital prompt bundles in India loses 30–50% of customers who only pay via PhonePe, GPay, or Paytm.
                            </p>
                            <p className="text-xs text-emerald-400 font-mono">
                                <strong>Mitigation:</strong> Exclusively host domestic products on zero-friction UPI platforms like Playto or Peerseek to guarantee instant 1-click settlements into your Indian bank account.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Live Cohort Launch Callout (October 11 Batch) */}
                <div className="my-14 p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-[#0e1627] to-[#070b14] border-2 border-emerald-500/40 shadow-[0_20px_60px_rgba(16,185,129,0.2)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10 space-y-5">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider">
                                Live Mentorship Cohort
                            </span>
                            <span className="px-3 py-1 rounded-full bg-white/10 text-white font-mono text-xs font-bold">
                                Starting October 11, 2026
                            </span>
                            <span className="text-xs text-emerald-400 font-mono font-bold">
                                Limited to 15 Seats
                            </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                            Master AI Video Creation & Land Your First Retainer
                        </h3>

                        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                            Stop watching disconnected YouTube tutorials. Join our intensive 6-week live classroom cohort starting <strong>October 11th</strong>. You will learn the exact Runway + Midjourney + Premiere pipeline, build 5 commercial-grade portfolio pieces, and get direct hiring priority inside the <strong>Celoris Job Center</strong>.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <Link
                                href="/classrooms"
                                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2"
                            >
                                <GraduationCap className="w-4 h-4" />
                                Explore Classroom Batch
                            </Link>
                            <a
                                href="https://wa.me/919084718101?text=Hi%20Celoris!%20I%20want%20details%20about%20the%20October%2011%20AI%20Video%20Cohort"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4 text-emerald-400" />
                                Chat on WhatsApp (Guest Pass)
                            </a>
                        </div>
                    </div>
                </div>

                {/* FAQ Accordion Section */}
                <section className="space-y-6 my-14">
                    <div className="space-y-2">
                        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                            Frequently Asked Questions
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            Common Questions on AI Video Freelancing & Channel Monetization
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="space-y-3">
                        <AccordionItem value="faq-1" className="border border-white/10 rounded-2xl px-5 bg-[#0b0e17] data-[state=open]:border-emerald-500/40">
                            <AccordionTrigger className="text-sm font-bold text-white hover:text-emerald-400 text-left py-4">
                                Do I need an expensive gaming laptop or RTX 4090 GPU?
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-slate-400 leading-relaxed pb-4">
                                No. 90% of the generative AI rendering happens on Runway and Midjourney's cloud servers. Any standard office laptop or desktop (Intel i5/Ryzen 5 with 8GB or 16GB RAM) capable of smoothly editing 1080p clips in CapCut or Premiere Pro is completely sufficient.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-2" className="border border-white/10 rounded-2xl px-5 bg-[#0b0e17] data-[state=open]:border-emerald-500/40">
                            <AccordionTrigger className="text-sm font-bold text-white hover:text-emerald-400 text-left py-4">
                                Who pays for the AI tool subscriptions (client or creator)?
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-slate-400 leading-relaxed pb-4">
                                When freelancing independently, you cover your basic tool subscriptions (approx. ₹2,000–₹3,500/month), which you factor into your per-video fee. One single 10-video retainer (₹10,000) easily covers your software costs with 70%+ profit margins. If you work on empaneled projects for Celoris, specific script resources and production assets are provided.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-3" className="border border-white/10 rounded-2xl px-5 bg-[#0b0e17] data-[state=open]:border-emerald-500/40">
                            <AccordionTrigger className="text-sm font-bold text-white hover:text-emerald-400 text-left py-4">
                                What YouTube AdSense RPM can I realistically expect in India for AI videos?
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-slate-400 leading-relaxed pb-4">
                                In India, YouTube long-form RPM ranges from ₹40 to ₹170 per 1,000 views. Hindi Personal Finance commands the highest RPM (₹100–₹170), requiring 300,000–500,000 monthly views to hit ₹50,000. Devotional and mythology channels average ₹60–₹90 RPM, while general entertainment averages ₹40–₹80 RPM.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-4" className="border border-white/10 rounded-2xl px-5 bg-[#0b0e17] data-[state=open]:border-emerald-500/40">
                            <AccordionTrigger className="text-sm font-bold text-white hover:text-emerald-400 text-left py-4">
                                Can I reach ₹50,000/month by only uploading YouTube Shorts?
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-slate-400 leading-relaxed pb-4">
                                It is extremely difficult. YouTube Shorts RPM in India is only ₹5 to ₹30 per 1,000 views. Generating ₹50,000 strictly through Shorts requires 2.5 million to 10 million views every month. Sustainable creators use Shorts primarily as top-of-funnel traffic drivers to push viewers to long-form videos, affiliate links, or UPI digital storefronts.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-5" className="border border-white/10 rounded-2xl px-5 bg-[#0b0e17] data-[state=open]:border-emerald-500/40">
                            <AccordionTrigger className="text-sm font-bold text-white hover:text-emerald-400 text-left py-4">
                                Why should I avoid Gumroad or Stripe when selling digital templates to Indians?
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-slate-400 leading-relaxed pb-4">
                                Over 80% of Indian online payments happen over UPI. Gumroad and Stripe lack native UPI checkout, creating a 30% to 50% cart abandonment rate. Furthermore, international processors deduct 18% to 25% in transaction fees, forex conversion, and bank wire costs. Domestic UPI storefronts like Playto or Peerseek allow 1-click UPI payments and deliver ₹9,500+ net into your account per ₹10,000 in sales.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-6" className="border border-white/10 rounded-2xl px-5 bg-[#0b0e17] data-[state=open]:border-emerald-500/40">
                            <AccordionTrigger className="text-sm font-bold text-white hover:text-emerald-400 text-left py-4">
                                How do I prevent my channel from being demonetized for "Reused Content"?
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-slate-400 leading-relaxed pb-4">
                                YouTube demonetizes automated channels that upload unedited, generic text-to-video outputs without human intervention. Protect your channel by using a Human-in-the-Loop workflow: write original scripts, apply custom color grading in Premiere/CapCut, cut pacing manually to voiceover beats, and add unique sound effects and motion graphics.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-7" className="border border-white/10 rounded-2xl px-5 bg-[#0b0e17] data-[state=open]:border-emerald-500/40">
                            <AccordionTrigger className="text-sm font-bold text-white hover:text-emerald-400 text-left py-4">
                                How much time does it take to make one 45-second vertical video?
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-slate-400 leading-relaxed pb-4">
                                Beginners usually take 4 to 5 hours on their first video. Once you develop your prompt library and template workflow, each completed video takes between 2 to 3 hours from script to final render.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="faq-8" className="border border-white/10 rounded-2xl px-5 bg-[#0b0e17] data-[state=open]:border-emerald-500/40">
                            <AccordionTrigger className="text-sm font-bold text-white hover:text-emerald-400 text-left py-4">
                                What is the difference between Public Jobs and Certified Roles in Celoris Job Center?
                            </AccordionTrigger>
                            <AccordionContent className="text-xs sm:text-sm text-slate-400 leading-relaxed pb-4">
                                Public Jobs are open to all creators to apply directly with sample portfolios. Certified Roles are high-paying premium client retainers (₹25,000–₹80,000/mo) reserved for students who have completed anti-cheat proctored badge exams inside the Celoris Exam Hub.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </section>

                {/* Interactive Blog Engagement */}
                <BlogEngagement
                    slug="how-to-earn-50k-month-ai-video-creator-india-2026"
                />
            </div>
        </article>
    );
}
