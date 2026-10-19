import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, BookOpen, CheckCircle2,
    TrendingUp, ShieldCheck, Zap, HardDrive, Lock, Server,
    ArrowRight, Globe, Palette, Terminal, HelpCircle, Check,
    AlertCircle, Sparkles, ExternalLink, Cpu, RefreshCw,
    Layers, Database, ShieldAlert, FileText, ArrowDownRight,
    GraduationCap, Briefcase, Code, Rocket, Award, Share2,
    Search, CheckSquare, Laptop, Smartphone, Eye, Lightbulb,
    BarChart3, Radio, FileCode2, Gauge, QrCode, Bookmark,
    Cloud, ServerCrash, DollarSign, ShieldX, Key, Binary,
    Network, CheckCircle, Flame
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ShareButtons from '@/components/ShareButtons';
import BlogEngagement from '@/components/blog/BlogEngagement';

export const metadata: Metadata = {
    title: "Student Portfolio & Full-Stack Hosting Architecture in India (2026 Guide) — Zero Credit Card, Sub-15ms Latency & Free Cloud Allocation",
    description: "The complete technical manual for B.Tech, BCA, MCA, and self-taught developers in India. How to deploy production portfolios, Next.js full-stack capstone apps, and WordPress instances with zero billing risk, sub-15ms Indian edge routing, MongoDB Atlas, Supabase, and no credit card required.",
    keywords: [
        'Free portfolio hosting for students India 2026',
        'Student full-stack hosting architecture India',
        'How to host student portfolio free without credit card',
        'Free WordPress hosting for college project viva',
        'Best free hosting for BCA BTech MCA projects',
        'Host resume website free custom subdomain',
        'Headless WordPress student portfolio REST API',
        '000webhost alternatives for students India 2026',
        'GitHub Pages vs Vercel vs Cloudflare Pages vs Celoris',
        'Azure for Students free credits India',
        'MongoDB Atlas M0 AWS Mumbai ap-south-1',
        'Supabase free tier India developer',
        'ATS friendly portfolio link on resume'
    ],
    alternates: {
        canonical: 'https://celorisdesigns.com/blog/free-portfolio-hosting-students-india-2026',
    },
    openGraph: {
        title: "Student Portfolio & Full-Stack Hosting Architecture in India (2026 Guide)",
        description: "Deploy an ad-free student portfolio or full-stack capstone project in 60 seconds. 3 GB NVMe PCIe storage, Let's Encrypt TLS 1.3, Headless REST API, Cloudflare edge, and zero credit card mandates.",
        url: 'https://celorisdesigns.com/blog/free-portfolio-hosting-students-india-2026',
        siteName: 'Celoris',
        locale: 'en_IN',
        images: [
            {
                url: 'https://celorisdesigns.com/free-portfolio-hosting-students-india-2026.jpg',
                width: 1200,
                height: 675,
                alt: 'Free Portfolio Hosting for Students in India 2026 Guide - Celoris Cloud',
            }
        ],
        type: 'article',
        publishedTime: '2026-10-19T08:00:00Z',
        modifiedTime: '2026-10-19T15:50:00Z',
        authors: ['Celoris Cloud Developer Relations & Academic Outreach Group'],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Student Portfolio & Full-Stack Hosting Architecture in India (2026 Guide)",
        description: "Zero-cost, ad-free student portfolio hosting with 3 GB NVMe storage, custom subdomain, Headless REST API, and 60-second automated deployment.",
        images: ['https://celorisdesigns.com/free-portfolio-hosting-students-india-2026.jpg'],
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
                    "item": "https://celorisdesigns.com"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Blog",
                    "item": "https://celorisdesigns.com/blog"
                },
                {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Student Portfolio & Full-Stack Hosting Architecture (2026)",
                    "item": "https://celorisdesigns.com/blog/free-portfolio-hosting-students-india-2026"
                }
            ]
        },
        {
            "@type": "Article",
            "headline": "Student Portfolio & Full-Stack Hosting Architecture in India (2026 Guide) — Zero Credit Card, Sub-15ms Latency & Free Cloud Allocation",
            "description": "Comprehensive technical guide for Indian engineering students (B.Tech, BCA, MCA) and junior developers to deploy production-grade portfolios and capstone applications with zero billing risk, sub-15ms domestic latency, and no credit card requirements.",
            "image": "https://celorisdesigns.com/free-portfolio-hosting-students-india-2026.jpg",
            "datePublished": "2026-10-19T08:00:00Z",
            "dateModified": "2026-10-19T15:50:00Z",
            "author": {
                "@type": "Organization",
                "name": "Celoris Cloud Developer Relations & Academic Outreach",
                "url": "https://celorisdesigns.com"
            },
            "publisher": {
                "@type": "Organization",
                "name": "Celoris Designs",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://celorisdesigns.com/celoris-logo.png"
                }
            },
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://celorisdesigns.com/blog/free-portfolio-hosting-students-india-2026"
            }
        },
        {
            "@type": "HowTo",
            "name": "How to Host a Production Full-Stack Portfolio or College Project in India (Zero Cost)",
            "description": "Deploy a live HTTPS portfolio website with dedicated storage, database, and zero credit card requirements.",
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Step 1: Choose Your Platform & Domain Handle",
                    "text": "Select your deployment architecture: Celoris Cloud for 1-click dynamic WordPress with 3 GB NVMe, or Cloudflare Pages / Vercel for custom React/Next.js frontends."
                },
                {
                    "@type": "HowToStep",
                    "name": "Step 2: Provision Low-Latency Database in AWS Mumbai",
                    "text": "Configure a free MongoDB Atlas M0 cluster or Supabase Postgres instance located strictly in AWS Asia Pacific (Mumbai) ap-south-1 for sub-15ms database query roundtrips."
                },
                {
                    "@type": "HowToStep",
                    "name": "Step 3: Connect Frontend via Environment Variables",
                    "text": "Authenticate via GitHub or Google (zero credit card mandate), set your secure connection string, and build."
                },
                {
                    "@type": "HowToStep",
                    "name": "Step 4: Audit Against the 12-Point Pre-Interview Checklist",
                    "text": "Verify mobile layout, ATS resume link cleanliness, custom favicon, and 1-click resume PDF download before sharing with recruiters."
                }
            ]
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Why do international cloud platforms reject Indian student debit cards?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "The Reserve Bank of India (RBI) enforces strict e-mandate and two-factor authentication (AFA) guidelines for recurring subscriptions. Standard RuPay cards and domestic student debit cards lack international recurring auto-debit authorizations, causing platforms like AWS, DigitalOcean, and GCP to reject them during account signup."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What happened to 000webhost, and why is Celoris Cloud a better 2026 alternative?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "000webhost was permanently shut down in July 2024 by Hostinger. Celoris Cloud replaces it with enterprise-grade Docker container isolation, 3 GB NVMe PCIe Gen4 storage in Mumbai, Let's Encrypt TLS 1.3 wildcard SSL, pre-installed Astra themes, and zero advertising popups."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I avoid surprise cloud bills on student projects?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Never enter a credit card on pay-as-you-go metered clouds. Use platforms with strict hard caps (like Vercel Hobby, which pauses upon hitting 100 GB rather than billing overages), Azure for Students (which deallocates VMs rather than charging when credits expire), or 100% free container platforms like Celoris Cloud."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Can I use Celoris Cloud as a Headless CMS for my React or Next.js portfolio?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes! Every Celoris WordPress instance includes the native WP REST API enabled at 'https://yourname.celoris.in/wp-json/wp/v2/posts'. You can manage case studies, blog posts, and project media through the WordPress dashboard and fetch them dynamically into Next.js using Incremental Static Regeneration (ISR)."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How can Indian students get free Microsoft Azure credits and certification discounts?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Verified students with college email addresses can activate the 'Azure for Students' program for $100 annual free credit (~₹8,300 INR) with no credit card. Additionally, attending Microsoft Virtual Training Days grants a 50% exam discount voucher on AZ-900, AI-900, and SC-900 certification exams."
                    }
                }
            ]
        }
    ]
};

export default function FreePortfolioHostingStudentsIndia2026() {
    return (
        <div className="min-h-screen bg-[#070b12] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
            {/* Structured Data Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
            />

            {/* Background Lighting */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-emerald-600/15 via-cyan-500/10 to-transparent blur-3xl opacity-80" />
                <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-emerald-500/5 blur-[130px] rounded-full" />
                <div className="absolute top-[65%] left-[-10%] w-[550px] h-[550px] bg-cyan-500/5 blur-[130px] rounded-full" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                {/* Back to Blog */}
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Blog & Engineering Insights
                </Link>

                {/* Article Header */}
                <header className="space-y-6 pb-10 border-b border-slate-800/80">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                            <GraduationCap className="w-3.5 h-3.5" />
                            Academic & Student Edition 2026
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            Zero Credit Card Required
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
                            <Cpu className="w-3.5 h-3.5" />
                            Headless REST API Ready
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Student Portfolio &amp; Full-Stack Hosting Architecture in India (2026 Guide)
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl">
                        The comprehensive technical reference for BCA, B.Tech, MCA, self-taught developers, and educators across India. How to deploy production portfolios, Next.js capstone applications, and dynamic WordPress instances with zero billing risk, sub-15ms domestic Indian edge routing, and no credit card mandates.
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-sm text-slate-400">
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-400" />
                                Updated October 19, 2026
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                14 min read
                            </span>
                            <span className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-purple-400" />
                                Executive Technical Reference
                            </span>
                        </div>
                        <ShareButtons
                            title="Free Portfolio Hosting for Students in India (2026 Guide)"
                            slug="free-portfolio-hosting-students-india-2026"
                        />
                    </div>
                </header>

                {/* Hero Banner Image */}
                <div className="my-10 relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900/50">
                    <Image
                        src="/free-portfolio-hosting-students-india-2026.jpg"
                        alt="Free Portfolio Hosting for Students in India 2026 - Build. Showcase. Get hired. Celoris Designs"
                        width={1200}
                        height={675}
                        priority
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Table of Contents Box */}
                <nav className="my-10 p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
                    <div className="flex items-center gap-2 text-white font-bold text-base mb-4">
                        <Bookmark className="w-4 h-4 text-emerald-400" />
                        Table of Contents & Quick Technical Navigation
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300">
                        <a href="#the-student-dilemma" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">01.</span> The Indian Student Cloud Dilemma (RBI Auto-Debit &amp; Cold Starts)
                        </a>
                        <a href="#platform-comparison" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">02.</span> Zero-Credit-Card Platform Comparison Matrix
                        </a>
                        <a href="#platform-mechanics" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">03.</span> Deep-Dive: Cloudflare Pages, Vercel Hobby &amp; Azure for Students
                        </a>
                        <a href="#database-architecture" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">04.</span> Database Architecture: MongoDB Atlas &amp; Supabase (AWS Mumbai)
                        </a>
                        <a href="#specialization-blueprints" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">05.</span> Architectural Blueprints by Academic Specialisation (BCA/B.Tech/UI-UX)
                        </a>
                        <a href="#code-integration" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">06.</span> Code Blueprints: Next.js + MongoDB &amp; Headless WordPress REST API
                        </a>
                        <a href="#celoris-cloud-setup" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">07.</span> Celoris Cloud: 1-Click 3 GB NVMe WordPress Deployment
                        </a>
                        <a href="#portfolio-checklist" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">08.</span> The 12-Point Pre-Interview Student Portfolio Audit Checklist
                        </a>
                        <a href="#career-roadmap" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">09.</span> Career Roadmap: Microsoft Certifications &amp; 50% Exam Vouchers
                        </a>
                        <a href="#faq" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">10.</span> Frequently Asked Questions (FAQ)
                        </a>
                    </div>
                </nav>

                {/* Interactive Instant Launch Bar */}
                <section className="my-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-cyan-950/40 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.12)]">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            Claim Your Free Student Subdomain in 60 Seconds
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Build. Showcase. Get Hired.
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base">
                            Get <code className="text-emerald-400 font-mono">yourname.celoris.in</code> with 3 GB NVMe PCIe storage, pre-installed Astra theme, and Let&apos;s Encrypt TLS 1.3. 100% Free forever with zero credit card mandates.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/cloud" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                                    <Rocket className="w-5 h-5 mr-2" />
                                    Create Your Free Portfolio Now
                                </Button>
                            </Link>
                            <Link href="#platform-comparison" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-6 py-6 rounded-xl">
                                    Compare Hosting Tiers
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Article Body */}
                <article className="prose prose-invert prose-emerald max-w-none space-y-16 text-slate-300">
                    
                    {/* SECTION 1: The Indian Student Cloud Dilemma */}
                    <section id="the-student-dilemma" className="space-y-6 pt-4">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                            <span>01 / The Indian Student Cloud Dilemma (2026 Context)</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <GraduationCap className="w-7 h-7 text-emerald-400" />
                            The 4 Structural Barriers Facing Indian Developers
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Deploying production-ready portfolios and full-stack capstone projects is now a baseline expectation for engineering students (B.Tech, BCA, MCA) applying to top product companies and fast-growing Indian tech startups. However, Indian developers encounter specific structural barriers when attempting to use global cloud infrastructure:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
                            <div className="p-6 rounded-xl bg-slate-900/60 border border-red-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-red-400 font-bold">
                                    <ShieldAlert className="w-5 h-5" />
                                    1. The Credit Card &amp; RBI Auto-Debit Wall
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Strict Reserve Bank of India (RBI) e-mandate and recurring payment guidelines cause international cloud platforms (AWS, GCP, DigitalOcean) to reject standard Indian RuPay cards and student debit accounts. Mandatory auto-debit setup forms an immediate barrier for students without credit cards.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-900/60 border border-amber-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-amber-400 font-bold">
                                    <DollarSign className="w-5 h-5" />
                                    2. Usage-Based Bill Shock Risk
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Platforms that rely on un-capped metered billing (such as AWS Pay-As-You-Go or Vercel Pro) carry severe financial risks if a project experiences bot traffic, viral scrapers, or unexpected query spikes. A student waking up to a $1,200 bill is a real and terrifying reality.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-900/60 border border-purple-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-purple-400 font-bold">
                                    <ServerCrash className="w-5 h-5" />
                                    3. The 000webhost Shutdown
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Hostinger&apos;s permanent shutdown of <strong>000webhost in July 2024</strong> eliminated the historical go-to free PHP/MySQL hosting service used by millions of Indian college students, leaving a massive void for dynamic project submissions and vivas.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                    <Clock className="w-5 h-5" />
                                    4. Cold Starts &amp; Sleeping Containers
                                </div>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    Free Container-as-a-Service (PaaS) platforms like Render, Koyeb, and SnapDeploy put free web services to sleep after 15 minutes of inactivity. When a recruiter or viva examiner clicks a resume link, the page stalls for 30 to 60 seconds on a cold start before failing.
                                </p>
                            </div>
                        </div>

                        <p className="text-base sm:text-lg leading-relaxed">
                            To bypass these friction points, students require infrastructure that guarantees zero financial risk, eliminates credit card mandates, utilizes local Indian Point-of-Presence (PoP) edge nodes, and pairs high-speed frontend hosting with low-latency persistent databases.
                        </p>
                    </section>

                    {/* SECTION 2: Platform Comparison Matrix */}
                    <section id="platform-comparison" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
                            <span>02 / Platform Comparison Matrix</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Layers className="w-7 h-7 text-cyan-400" />
                            Comprehensive Zero-Credit-Card Platform Comparison
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base">
                            A granular, side-by-side technical evaluation of primary zero-credit-card hosting options available to Indian developers in 2026:
                        </p>

                        <div className="overflow-x-auto not-prose rounded-2xl border border-slate-800 bg-slate-900/40">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="p-4">Platform</th>
                                        <th className="p-4">Bandwidth / Egress</th>
                                        <th className="p-4">Dynamic Quota</th>
                                        <th className="p-4">Credit Card?</th>
                                        <th className="p-4">Indian Edge PoPs</th>
                                        <th className="p-4">Key Gotchas</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                                    <tr className="bg-emerald-950/20">
                                        <td className="p-4 font-sans font-bold text-emerald-400 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-emerald-400" />
                                            Celoris Cloud
                                        </td>
                                        <td className="p-4 font-bold text-emerald-300">Unmetered Fair-Use</td>
                                        <td className="p-4 text-emerald-300">3 GB NVMe Container + MariaDB</td>
                                        <td className="p-4 text-emerald-400 font-bold">NO (Google 1-Tap)</td>
                                        <td className="p-4 text-emerald-300">Mumbai Datacenter (Sub-15ms)</td>
                                        <td className="p-4 text-slate-400">Requires login once every 90 days</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Cloudflare Pages</td>
                                        <td className="p-4 text-emerald-400 font-bold">Unmetered Static</td>
                                        <td className="p-4">100k req/day via Workers</td>
                                        <td className="p-4 text-emerald-400 font-bold">No</td>
                                        <td className="p-4">22+ PoPs (BOM, DEL, BLR, MAA)</td>
                                        <td className="p-4 text-slate-400">10ms CPU limit on free Workers</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Vercel Hobby</td>
                                        <td className="p-4">100 GB Fast Transfer</td>
                                        <td className="p-4">1M invocations / 4 CPU hrs</td>
                                        <td className="p-4 text-emerald-400 font-bold">No</td>
                                        <td className="p-4">Mumbai (`bom1`) &amp; New Delhi</td>
                                        <td className="p-4 text-red-400">Non-commercial only; auto-pauses at cap</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Azure for Students</td>
                                        <td className="p-4">100 GB SWA + $100 Credit</td>
                                        <td className="p-4">750 hrs B1s Linux VM</td>
                                        <td className="p-4 text-emerald-400 font-bold">No (.edu verification)</td>
                                        <td className="p-4">Central, South, West India</td>
                                        <td className="p-4 text-slate-400">Annual re-verification required</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">GitHub Pages</td>
                                        <td className="p-4">100 GB soft cap</td>
                                        <td className="p-4 text-red-400">Static Only (No Backend)</td>
                                        <td className="p-4 text-emerald-400 font-bold">No</td>
                                        <td className="p-4">Global Fastly CDN</td>
                                        <td className="p-4 text-red-400">1 GB repo size limit; no dynamic PHP/DB</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Render Hobby</td>
                                        <td className="p-4">5 GB pooled</td>
                                        <td className="p-4 text-amber-400">Free Web Services</td>
                                        <td className="p-4 text-emerald-400 font-bold">No</td>
                                        <td className="p-4">Single region</td>
                                        <td className="p-4 text-red-400">30–60s cold start wake delay</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* SECTION 3: Deep-Dive Platform Analysis */}
                    <section id="platform-mechanics" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400">
                            <span>03 / Architecture Mechanics</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Server className="w-7 h-7 text-purple-400" />
                            Deep-Dive Platform Analysis &amp; Mechanics
                        </h2>

                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Cloud className="w-5 h-5 text-cyan-400" />
                                    Cloudflare Pages &amp; Workers (Edge Topology)
                                </h3>
                                <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                                    Cloudflare operates 22+ Points of Presence across Tier-1 and Tier-2 Indian cities (Mumbai, New Delhi, Bengaluru, Chennai, Hyderabad, Kolkata, and 16 more). Requests to static assets (HTML, CSS, JS, WebP images) are <strong>unmetered</strong> on all free plans. Dynamic logic runs via <strong>Cloudflare Workers</strong>, which utilize lightweight V8 JavaScript isolates rather than full container VMs, booting up in less than 5 milliseconds.
                                </p>
                                <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 border border-slate-800">
                                    [ Indian End User (Jio / Airtel / Vi) ] ──&gt; (Sub-15ms Domestic Edge) ──&gt; [ Cloudflare V8 Isolate (&lt;5ms Cold Start) ]
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-emerald-400" />
                                    Vercel Hobby (Next.js &amp; Hard Cap Safeguards)
                                </h3>
                                <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                                    Vercel Hobby enforces strict <strong>hard caps</strong> rather than metered charges. If your project reaches 100 GB data transfer or 1M invocations, the project pauses automatically until the next billing cycle, ensuring zero bill shock. It includes 4 Active CPU hours per month:
                                </p>
                                <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 border border-slate-800">
                                    Capacity = 14,400 seconds / 0.050 s per request = ~288,000 dynamic requests/month
                                </div>
                                <p className="text-xs text-slate-400">
                                    This capacity is more than ample for student portfolios, resume showcases, and capstone project evaluators.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Award className="w-5 h-5 text-purple-400" />
                                    Azure for Students (Enterprise Cloud Allocation)
                                </h3>
                                <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                                    Microsoft Azure provides an institutional program for university students aged 18+. Verification is done via an official college email address (<code className="text-purple-300">.edu</code> or university domain) without any credit card. It grants <strong>$100 annual credit (~₹8,300 INR)</strong> renewed every year, 750 hours/month of a Burstable B1s Linux VM, 1M Azure Functions requests, and 25 GB Azure Cosmos DB.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4: Database & Persistent Storage */}
                    <section id="database-architecture" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                            <span>04 / Database &amp; Persistent Storage</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Database className="w-7 h-7 text-emerald-400" />
                            Database &amp; Persistent Storage Architecture (AWS Mumbai)
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            A production-ready full-stack portfolio requires pairing frontend edge hosting with low-latency database infrastructure located strictly within Indian regions:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose my-6">
                            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                                    <Database className="w-5 h-5" />
                                    MongoDB Atlas M0
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Free 512 MB NVMe cluster. Selecting <strong>AWS Asia Pacific (Mumbai) `ap-south-1`</strong> places your database in the exact same cloud hub as Indian edge servers, yielding sub-20ms query round-trips with zero cost forever.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                    <Lock className="w-5 h-5" />
                                    Supabase Managed Postgres
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Full PostgreSQL in AWS Mumbai with built-in Auth, Row-Level Security (RLS), and auto-generated REST/GraphQL APIs. Includes 500 MB database storage, 5 GB monthly egress, and 50,000 monthly active users.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <div className="flex items-center gap-2 text-purple-400 font-bold">
                                    <Cloud className="w-5 h-5" />
                                    Cloudflare D1 &amp; R2
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    <strong>D1:</strong> Serverless edge SQL database with 5 GB free storage executing inside edge isolates. <strong>R2:</strong> Object storage with zero egress fees (10 GB free) ideal for hosting design assets and PDFs.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 5: Architectural Blueprints by Specialisation */}
                    <section id="specialization-blueprints" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
                            <span>05 / Academic Specialisation Blueprints</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Briefcase className="w-7 h-7 text-cyan-400" />
                            Architectural Blueprints by Student Specialisation
                        </h2>

                        <div className="space-y-4 not-prose">
                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="text-base font-bold text-white">B.Tech / MCA Full-Stack Capstone (MERN / Next.js)</h3>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Full-Stack Web</span>
                                </div>
                                <p className="text-xs text-slate-300">
                                    <strong>Stack:</strong> Next.js on Vercel Hobby + MongoDB Atlas M0 (AWS Mumbai `ap-south-1`) + Supabase Auth.
                                </p>
                                <p className="text-xs text-slate-400">
                                    <strong>Rationale:</strong> Industry-standard enterprise stack; Vercel hard caps prevent unexpected charges during high-volume college project vivas.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="text-base font-bold text-white">BCA / B.Sc Dynamic Web Systems (PHP, CMS, E-Commerce)</h3>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">WordPress / CMS</span>
                                </div>
                                <p className="text-xs text-slate-300">
                                    <strong>Stack:</strong> Celoris Cloud (3 GB NVMe Container + MariaDB + Astra) on Mumbai Edge.
                                </p>
                                <p className="text-xs text-slate-400">
                                    <strong>Rationale:</strong> 1-click automated deployment, zero credit cards, no sleeping containers, pre-configured SSL, and custom subdomain (<code className="text-cyan-300">name.celoris.in</code>).
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="text-base font-bold text-white">UI/UX &amp; Graphic Design Portfolios (Figma, High-Res Media)</h3>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">Design Portfolio</span>
                                </div>
                                <p className="text-xs text-slate-300">
                                    <strong>Stack:</strong> Cloudflare Pages + Cloudflare R2 / Celoris Cloud Media CDN.
                                </p>
                                <p className="text-xs text-slate-400">
                                    <strong>Rationale:</strong> Eliminates bandwidth overage concerns when serving high-resolution case study mockups, interactive Figma prototypes, and video showreels.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="text-base font-bold text-white">AI / ML &amp; Data Science Demonstrations (Python, FastAPI, PyTorch)</h3>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Data &amp; AI</span>
                                </div>
                                <p className="text-xs text-slate-300">
                                    <strong>Stack:</strong> Azure Static Web Apps (Frontend) + Azure B1s Linux VM (750 Free Hrs via Student Credit) for Python runtime + Cosmos DB.
                                </p>
                                <p className="text-xs text-slate-400">
                                    <strong>Rationale:</strong> Provides a persistent Linux compute environment for Python runtimes and model inference that cannot run on edge JS isolates.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 6: Code Integration Blueprints */}
                    <section id="code-integration" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                            <span>06 / Implementation Code Blueprints</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Code className="w-7 h-7 text-emerald-400" />
                            Production Code Blueprints (Next.js &amp; Headless WordPress)
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Here are production-ready boilerplate implementations for connecting decoupled backends with zero billing risk:
                        </p>

                        <div className="space-y-6 not-prose my-6">
                            {/* Blueprint A: MongoDB Connection */}
                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                                    <span className="font-mono text-emerald-400">Blueprint A: lib/dbConnect.ts (Next.js + MongoDB Atlas Mumbai)</span>
                                    <span>Serverless Connection Caching</span>
                                </div>
                                <pre className="text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}`}
                                </pre>
                            </div>

                            {/* Blueprint B: Headless WordPress REST API */}
                            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                                    <span className="font-mono text-cyan-400">Blueprint B: app/api/projects/route.ts (Headless Celoris WordPress REST API)</span>
                                    <span>ISR Static Generation</span>
                                </div>
                                <pre className="text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Consume project case studies from your Celoris WordPress cloud instance
    const res = await fetch('https://yourname.celoris.in/wp-json/wp/v2/posts?_embed', {
      next: { revalidate: 3600 } // Incremental Static Regeneration: cached for 1 hour
    });

    if (!res.ok) throw new Error('Failed to fetch from WordPress CMS');
    
    const posts = await res.json();
    const formatted = posts.map((item: any) => ({
      id: item.id,
      title: item.title.rendered,
      slug: item.slug,
      summary: item.excerpt.rendered,
      featuredImage: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
    }));

    return NextResponse.json({ success: true, projects: formatted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 7: Celoris Cloud Deployment */}
                    <section id="celoris-cloud-setup" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400">
                            <span>07 / 1-Click Cloud Deployment</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Rocket className="w-7 h-7 text-purple-400" />
                            Celoris Cloud: 1-Click 3 GB NVMe WordPress Deployment
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            For students who need an instant, live, fully configured dynamic website without writing backend scaffolding or configuring Nginx/Apache, Celoris Cloud provides automated 60-second provisioning:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose my-6">
                            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                                <span className="text-xs font-bold text-emerald-400 font-mono">STEP 01</span>
                                <h3 className="text-base font-bold text-white">Pick Your Subdomain</h3>
                                <p className="text-xs text-slate-400">
                                    Visit <Link href="/cloud" className="text-emerald-400 hover:underline font-mono">celoris.in/cloud</Link> and enter your personal brand handle (e.g. <code className="text-emerald-300">priyasharma</code>).
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                                <span className="text-xs font-bold text-cyan-400 font-mono">STEP 02</span>
                                <h3 className="text-base font-bold text-white">Google 1-Tap Auth</h3>
                                <p className="text-xs text-slate-400">
                                    Sign in using your Google account. No credit cards, OTP SMS fees, or billing mandates required.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                                <span className="text-xs font-bold text-purple-400 font-mono">STEP 03</span>
                                <h3 className="text-base font-bold text-white">Instant Go-Live</h3>
                                <p className="text-xs text-slate-400">
                                    The engine provisions your 3 GB NVMe container, activates the Astra theme, issues SSL, and displays your admin login credentials.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 8: 12-Point Audit Checklist */}
                    <section id="portfolio-checklist" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                            <span>08 / Quality Assurance</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <CheckSquare className="w-7 h-7 text-emerald-400" />
                            The 12-Point Pre-Interview Student Portfolio Audit Checklist
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Before copying your portfolio link into your resume, LinkedIn profile, or college project viva submission report, verify every box in this audit checklist:
                        </p>

                        <div className="space-y-3 not-prose my-6">
                            {[
                                { title: "1. Active HTTPS Padlock", desc: "Confirm the URL opens via HTTPS without browser SSL security warnings." },
                                { title: "2. Mobile Responsiveness", desc: "Test layout on mobile screens (6-inch phone) and desktop monitors. Over 65% of initial recruiter clicks happen on mobile." },
                                { title: "3. Direct PDF Resume Download Button", desc: "Position a visible 'Download Resume' button in your top navigation header." },
                                { title: "4. 3-Second Value Headline", desc: "Clearly state your name, academic background, and target role (e.g., 'B.Tech CS 2026 | Full-Stack Developer') above the fold." },
                                { title: "5. Live Working Project Demos", desc: "Ensure every listed project includes a working live deployment link or clean GitHub repository." },
                                { title: "6. Zero Placeholder Text", desc: "Delete all default 'Lorem Ipsum', 'Hello World', or test posts before sharing." },
                                { title: "7. Compressed WebP Images", desc: "Optimize all project screenshots to WebP format to guarantee sub-2s mobile load speeds." },
                                { title: "8. Social Links Verified", desc: "Ensure GitHub, LinkedIn, and email links open correctly in new tabs." },
                                { title: "9. Verified Contact Form", desc: "Send yourself a test message from your contact form to confirm email delivery." },
                                { title: "10. Problem Statement & Tech Stack Badges", desc: "Clearly explain the problem solved, tech stack used, and core technical challenge overcome for each project." },
                                { title: "11. Custom Favicon", desc: "Replace default host icons with your personal monogram or initials." },
                                { title: "12. Clean Resume Header Link", desc: "Format hyperlinks cleanly without tracking parameters (e.g. 'https://aaravdev.celoris.in')." },
                            ].map((item, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 shrink-0 text-xs mt-0.5">
                                        ✓
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                        <p className="text-xs text-slate-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* SECTION 9: Career Roadmap & Microsoft Certifications */}
                    <section id="career-roadmap" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
                            <span>09 / Career Acceleration</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Award className="w-7 h-7 text-cyan-400" />
                            Career Roadmap: Microsoft Certifications &amp; Free Credits (India 2026)
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Combining a live portfolio with industry cloud certifications helps strengthen resume credentials for campus placements and off-campus roles at Indian IT firms and cloud consultancies:
                        </p>

                        <div className="overflow-x-auto not-prose rounded-2xl border border-slate-800 bg-slate-900/40 my-6">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="p-4">Certification</th>
                                        <th className="p-4">Focus Area</th>
                                        <th className="p-4">Standard Fee (India)</th>
                                        <th className="p-4">High-Value Discount Route</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                                    <tr>
                                        <td className="p-4 font-sans font-bold text-white">AZ-900 (Azure Fundamentals)</td>
                                        <td className="p-4 font-sans">Core Cloud Concepts, IaaS/PaaS, Security</td>
                                        <td className="p-4">₹3,696 INR</td>
                                        <td className="p-4 text-emerald-400 font-bold">50% Voucher via Virtual Training Days</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-bold text-white">AI-900 (Azure AI Fundamentals)</td>
                                        <td className="p-4 font-sans">AI/ML concepts, Azure OpenAI, Vision, NLP</td>
                                        <td className="p-4">₹3,696 INR</td>
                                        <td className="p-4 text-emerald-400 font-bold">50% Voucher via Virtual Training Days</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-bold text-white">PL-300 (Power BI Data Analyst)</td>
                                        <td className="p-4 font-sans">Power Query, DAX, Dashboard Design</td>
                                        <td className="p-4">₹4,800 INR</td>
                                        <td className="p-4 text-emerald-400 font-bold">Free Applied Skills Credentials</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-bold text-white">SC-900 (Security Fundamentals)</td>
                                        <td className="p-4 font-sans">Zero Trust, Entra ID, Identity &amp; Compliance</td>
                                        <td className="p-4">₹3,696 INR</td>
                                        <td className="p-4 text-emerald-400 font-bold">50% Voucher via Virtual Training Days</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 not-prose">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                How to Access Student Benefits &amp; Exam Vouchers:
                            </h3>
                            <ul className="text-xs sm:text-sm text-slate-300 space-y-2 list-disc pl-5">
                                <li><strong>Microsoft Virtual Training Days:</strong> Attending free 2-day online webinars grants attendees a <strong>50% discount voucher</strong> on fundamentals exams (reducing AZ-900 from ₹3,696 to ~₹1,848).</li>
                                <li><strong>GitHub Student Developer Pack:</strong> Provides verified students with free access to LinkedIn Learning courses, Canva Pro, JetBrains IDE licenses, and custom domains.</li>
                                <li><strong>Azure for Students:</strong> Grants $100 annual credit (~₹8,300) without credit cards to practice cloud deployments.</li>
                            </ul>
                        </div>
                    </section>

                    {/* SECTION 10: FAQ Section */}
                    <section id="faq" className="space-y-6 pt-4">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                            <span>10 / Frequently Asked Questions</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <HelpCircle className="w-7 h-7 text-emerald-400" />
                            Frequently Asked Questions (FAQ)
                        </h2>

                        <Accordion type="single" collapsible className="w-full space-y-3 not-prose">
                            <AccordionItem value="faq-1" className="border border-slate-800 rounded-xl bg-slate-900/50 px-4">
                                <AccordionTrigger className="text-left font-semibold text-white hover:text-emerald-400">
                                    Is Celoris Cloud really 100% free with no hidden charges?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 text-sm leading-relaxed">
                                    Yes. The student tier provides 3 GB NVMe PCIe storage, an isolated WordPress subsite, free SSL, and unmetered fair-use bandwidth completely free. There are no credit card checks or auto-debits.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-2" className="border border-slate-800 rounded-xl bg-slate-900/50 px-4">
                                <AccordionTrigger className="text-left font-semibold text-white hover:text-emerald-400">
                                    Can I use this for my final-year college project submission?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 text-sm leading-relaxed">
                                    Absolutely. Thousands of students in BCA, B.Tech, MCA, and diploma programs use Celoris Cloud to host their live final-year web projects to present to external evaluators and university viva panels.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-3" className="border border-slate-800 rounded-xl bg-slate-900/50 px-4">
                                <AccordionTrigger className="text-left font-semibold text-white hover:text-emerald-400">
                                    Can I install plugins like Elementor or WooCommerce?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 text-sm leading-relaxed">
                                    Yes! You have full WordPress administrator privileges on your instance. You can install Elementor, contact form plugins, portfolio widgets, and SEO tools directly from the WordPress repository.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-4" className="border border-slate-800 rounded-xl bg-slate-900/50 px-4">
                                <AccordionTrigger className="text-left font-semibold text-white hover:text-emerald-400">
                                    How long will my website remain active?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 text-sm leading-relaxed">
                                    Your website remains permanently active as long as you log into your dashboard at least once every 90 days. We send automated email reminders before any idle archival, ensuring your projects never disappear.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="faq-5" className="border border-slate-800 rounded-xl bg-slate-900/50 px-4">
                                <AccordionTrigger className="text-left font-semibold text-white hover:text-emerald-400">
                                    Can I connect my own custom .com or .in domain later?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-400 text-sm leading-relaxed">
                                    Yes! While every student gets an instant clean subdomain like `yourname.celoris.in`, you can seamlessly point your own custom domain (e.g. `yourname.com`) using standard CNAME mapping at any time.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* Final CTA Card */}
                    <div className="my-14 p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 text-center space-y-5 not-prose shadow-2xl">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                            <Rocket className="w-7 h-7" />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                            Claim Your Free 3 GB Student Cloud Instance
                        </h2>
                        <p className="text-slate-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                            Build. Showcase. Get hired. Deploy your high-speed portfolio link in 60 seconds and start impressing recruiters today.
                        </p>
                        <div className="pt-2">
                            <Link href="/cloud">
                                <Button className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                                    Deploy Free Portfolio on Celoris Cloud
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Engagement / Comments */}
                    <div className="pt-8 border-t border-slate-800">
                        <BlogEngagement
                            slug="free-portfolio-hosting-students-india-2026"
                        />
                    </div>
                </article>
            </main>
        </div>
    );
}
