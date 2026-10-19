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
    GraduationCap, Briefcase, Code, Rocket, Award, Share2
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ShareButtons from '@/components/ShareButtons';
import BlogEngagement from '@/components/blog/BlogEngagement';

export const metadata: Metadata = {
    title: "Free Portfolio Hosting for Students in India (2026 Guide) — No Credit Card, 3 GB NVMe & Free SSL",
    description: "The complete 2026 guide on how college students, BCA/B.Tech freshers, and junior developers in India can host a live portfolio or college project for free. Instant 1-click deployment, 3 GB NVMe PCIe storage, Let's Encrypt SSL, and custom subdomain.",
    keywords: [
        'Free portfolio hosting for students India',
        'How to host student portfolio free 2026',
        'Free WordPress hosting for college project',
        'Best free hosting for BCA BTech MCA projects',
        'Host resume website free without credit card',
        'Free portfolio hosting with custom subdomain',
        '000webhost alternatives for students India',
        'GitHub Pages alternative with WordPress MySQL',
        'Celoris Cloud student hosting tier',
        'Free web project hosting India'
    ],
    alternates: {
        canonical: 'https://celorisdesigns.com/blog/free-portfolio-hosting-students-india-2026',
    },
    openGraph: {
        title: "Free Portfolio Hosting for Students in India (2026 Guide) — Celoris Cloud",
        description: "Deploy a live, high-speed student portfolio or college project in 60 seconds. 3 GB NVMe PCIe storage, free Let's Encrypt SSL certificate, and zero credit card required.",
        url: 'https://celorisdesigns.com/blog/free-portfolio-hosting-students-india-2026',
        siteName: 'Celoris',
        locale: 'en_IN',
        images: [
            {
                url: 'https://celorisdesigns.com/free-portfolio-hosting-students-india-2026.png',
                width: 1200,
                height: 675,
                alt: 'Free Portfolio Hosting for Students in India 2026 Guide - Celoris Cloud',
            }
        ],
        type: 'article',
        publishedTime: '2026-10-19T08:00:00Z',
        authors: ['Celoris Cloud Developer Relations & Academic Outreach Group'],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Free Portfolio Hosting for Students in India (2026 Guide) — Celoris Cloud",
        description: "Zero-cost, ad-free student portfolio hosting with 3 GB NVMe storage, custom subdomain, and 60-second automated deployment.",
        images: ['https://celorisdesigns.com/free-portfolio-hosting-students-india-2026.png'],
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
                    "name": "Free Portfolio Hosting for Students in India (2026)",
                    "item": "https://celorisdesigns.com/blog/free-portfolio-hosting-students-india-2026"
                }
            ]
        },
        {
            "@type": "Article",
            "headline": "Free Portfolio Hosting for Students in India (2026 Guide) — No Credit Card, 3 GB NVMe & Free SSL",
            "description": "Step-by-step technical guide for Indian engineering, BCA, MCA, and design students to host their live resume portfolio or college project at zero cost.",
            "image": "https://celorisdesigns.com/free-portfolio-hosting-students-india-2026.png",
            "datePublished": "2026-10-19T08:00:00Z",
            "dateModified": "2026-10-19T08:00:00Z",
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
            "name": "How to Host a Free Student Portfolio Website in India (Step-by-Step)",
            "description": "Deploy a live HTTPS portfolio website with 3 GB NVMe storage on Celoris Cloud in less than 60 seconds without paying or providing a credit card.",
            "step": [
                {
                    "@type": "HowToStep",
                    "name": "Step 1: Choose Your Subdomain",
                    "text": "Visit celoris.in/cloud and pick your personal brand handle (e.g. yourname.celoris.in) which will serve as your live resume link."
                },
                {
                    "@type": "HowToStep",
                    "name": "Step 2: Sign in with Google (1-Tap)",
                    "text": "Authenticate using your college or personal Google account. No credit card or billing mandate is ever required."
                },
                {
                    "@type": "HowToStep",
                    "name": "Step 3: Click Deploy and Go Live",
                    "text": "The Celoris automated container provisioner spins up an isolated WordPress instance with 3 GB NVMe storage, pre-installed Astra theme, and Let's Encrypt SSL in 60 seconds."
                }
            ]
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "Do I need a credit card or debit card to get free student hosting?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. Celoris Cloud does not ask for credit cards, debit cards, UPI mandates, or billing details. You simply sign in with Google and launch your live portfolio instantly."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Can I put this live link on my resume and LinkedIn profile?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes! Your site gets a clean, professional, SSL-secured link like 'https://yourname.celoris.in' which you can share directly with recruiters, college professors, and freelance clients."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How is this different from GitHub Pages or Vercel?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "GitHub Pages and Vercel only support static frontend files (HTML/CSS/JS or Next.js) and do not support dynamic PHP, WordPress backends, or native MySQL databases on their free tiers. Celoris Cloud gives you a full WordPress CMS with a MariaDB database and 3 GB NVMe storage."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What happened to 000webhost? Can I use Celoris as an alternative?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "000webhost was permanently shut down in July 2024 by Hostinger. Celoris Cloud is the modern 2026 alternative, offering NVMe PCIe Gen4 speeds, sub-15ms Indian edge routing, and zero advertising banners."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How much storage and bandwidth do students get?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Every free student instance receives 3,072 MB (3 GB) of dedicated NVMe PCIe Gen4 storage and unmetered fair-use bandwidth, which is more than enough for high-resolution graphics, video embeds, and hundreds of portfolio project pages."
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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-emerald-600/15 via-cyan-500/10 to-transparent blur-3xl opacity-75" />
                <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full" />
                <div className="absolute top-[70%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full" />
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
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Student & Developer Guide 2026
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            Zero Credit Card Mandate
                        </span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            3 GB NVMe PCIe Gen4
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Free Portfolio Hosting for Students in India (2026 Guide) — No Credit Card, 3 GB NVMe & Free SSL
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl">
                        The ultimate roadmap for BCA, B.Tech, MCA, and design students to take their college projects, design showcases, and developer resumes live on the web in 60 seconds — with zero hosting fees and zero credit card requirements.
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-sm text-slate-400">
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-400" />
                                Updated October 19, 2026
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                7 min read
                            </span>
                            <span className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-purple-400" />
                                Academic & Career Resource
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
                        src="/free-portfolio-hosting-students-india-2026.png"
                        alt="Free Student Portfolio and Web Project Hosting India 2026 - Celoris Cloud"
                        width={1200}
                        height={675}
                        priority
                        className="w-full h-auto object-cover"
                    />
                </div>

                {/* Interactive Instant Launch Bar */}
                <section className="my-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-cyan-950/40 border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.12)]">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            Claim Your Free Student Subdomain in 60 Seconds
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Ready to make your resume link live?
                        </h2>
                        <p className="text-slate-300 text-sm sm:text-base">
                            Get <code className="text-emerald-400 font-mono">yourname.celoris.in</code> with 3 GB NVMe storage, pre-installed Astra theme, and Let&apos;s Encrypt SSL. 100% Free forever.
                        </p>
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link href="/cloud" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">
                                    <Rocket className="w-5 h-5 mr-2" />
                                    Launch Free Student Portfolio Now
                                </Button>
                            </Link>
                            <Link href="#comparison" className="w-full sm:w-auto">
                                <Button variant="outline" className="w-full sm:w-auto border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white px-6 py-6 rounded-xl">
                                    Compare Hosting Tiers
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Article Body */}
                <article className="prose prose-invert prose-emerald max-w-none space-y-12 text-slate-300">
                    
                    {/* The Student Dilemma */}
                    <section className="space-y-5">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <GraduationCap className="w-7 h-7 text-emerald-400" />
                            The Student Dilemma: Why Hosting a Portfolio in India is So Frustrating
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Every college student or junior developer in India faces the exact same stumbling block when applying for software internships, campus placements, or freelance gigs:
                        </p>
                        <blockquote className="p-4 rounded-xl bg-slate-900/80 border-l-4 border-amber-500 text-slate-200 italic">
                            &quot;Recruiters and college evaluators don&apos;t want to read a 10-page project report or clone a GitHub repo with broken node_modules. They want to click one live URL on your resume and see your work working seamlessly in their mobile browser.&quot;
                        </blockquote>
                        <p className="text-base sm:text-lg leading-relaxed">
                            However, the hosting landscape in India has become brutally hostile to students over the past two years:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
                            <div className="p-5 rounded-xl bg-slate-900/60 border border-red-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-red-400 font-bold">
                                    <ShieldAlert className="w-5 h-5" />
                                    Credit Card & Auto-Debit Traps
                                </div>
                                <p className="text-sm text-slate-400">
                                    Big hosting providers (GoDaddy, Hostinger, Bluehost) lure you with &quot;₹79/month&quot; deals, but force an upfront 4-year payment of ₹3,500–₹5,000 + mandatory credit card recurring mandates that most college students don&apos;t have.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-slate-900/60 border border-amber-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-amber-400 font-bold">
                                    <AlertCircle className="w-5 h-5" />
                                    000webhost Is Dead
                                </div>
                                <p className="text-sm text-slate-400">
                                    For 15 years, Indian students relied on 000webhost for college submissions. In July 2024, Hostinger permanently killed 000webhost, leaving millions of students with no free PHP/WordPress alternative.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                    <Code className="w-5 h-5" />
                                    GitHub Pages Is Static Only
                                </div>
                                <p className="text-sm text-slate-400">
                                    GitHub Pages is fantastic for plain HTML/CSS, but it cannot run dynamic CMS platforms like WordPress, PHP contact forms, or MySQL databases required for real-world projects.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-slate-900/60 border border-purple-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-purple-400 font-bold">
                                    <Clock className="w-5 h-5" />
                                    Render / Railway 60s Cold Starts
                                </div>
                                <p className="text-sm text-slate-400">
                                    Free PaaS tiers put services to sleep after 15 minutes of inactivity. When a recruiter clicks your resume link, the page spins for 60 seconds before failing or loading, killing your first impression.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* How Celoris Cloud Solves It */}
                    <section className="space-y-5">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Zap className="w-7 h-7 text-emerald-400" />
                            The Solution: Celoris Cloud Free Student Architecture
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Celoris Cloud was built specifically to eliminate these roadblocks for Indian students, designers, and educators. By leveraging high-density Docker containerization and Contabo NVMe cloud instances in Mumbai, we provide enterprise-grade WordPress hosting completely free.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose my-6">
                            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <HardDrive className="w-8 h-8 text-emerald-400" />
                                <h3 className="text-lg font-bold text-white">3 GB NVMe PCIe Gen4</h3>
                                <p className="text-xs text-slate-400">
                                    Real NVMe storage for your portfolio assets, high-res design exports, client case studies, and database records.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <Globe className="w-8 h-8 text-cyan-400" />
                                <h3 className="text-lg font-bold text-white">Custom Subdomain</h3>
                                <p className="text-xs text-slate-400">
                                    A professional web address (<code className="text-cyan-300">yourname.celoris.in</code>) with zero third-party ads or obnoxious banner popups.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <Lock className="w-8 h-8 text-purple-400" />
                                <h3 className="text-lg font-bold text-white">Auto SSL Certificate</h3>
                                <p className="text-xs text-slate-400">
                                    Pre-configured Let&apos;s Encrypt TLS 1.3 wildcard certificate ensures green padlocks across Chrome, Safari, and Edge.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Comparison Table */}
                    <section id="comparison" className="space-y-5">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Layers className="w-7 h-7 text-emerald-400" />
                            Comprehensive Comparison: Celoris vs Alternatives
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base">
                            See how Celoris Cloud compares to common student options available in India in 2026:
                        </p>

                        <div className="overflow-x-auto not-prose rounded-2xl border border-slate-800 bg-slate-900/40">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="p-4">Feature</th>
                                        <th className="p-4 text-emerald-400 font-bold bg-emerald-950/20">Celoris Cloud</th>
                                        <th className="p-4">GitHub Pages</th>
                                        <th className="p-4">Hostinger Shared</th>
                                        <th className="p-4">000webhost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Cost for Students</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-emerald-950/20">₹0 Forever</td>
                                        <td className="p-4">₹0 Forever</td>
                                        <td className="p-4 text-red-400">₹3,500+ Upfront</td>
                                        <td className="p-4 text-slate-500">Shut Down (Dead)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Credit Card Required</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-emerald-950/20">NO (Google 1-Tap)</td>
                                        <td className="p-4">No</td>
                                        <td className="p-4 text-red-400">Yes (Mandatory)</td>
                                        <td className="p-4 text-slate-500">—</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Dynamic PHP / WordPress</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-emerald-950/20">Yes (Full CMS)</td>
                                        <td className="p-4 text-red-400">No (Static Only)</td>
                                        <td className="p-4 text-emerald-400">Yes</td>
                                        <td className="p-4 text-slate-500">—</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Storage Allocation</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-emerald-950/20">3 GB NVMe PCIe</td>
                                        <td className="p-4">1 GB Git Limit</td>
                                        <td className="p-4">10–50 GB (Paid)</td>
                                        <td className="p-4 text-slate-500">300 MB (Dead)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Cold Start / Sleep</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-emerald-950/20">Instant (No Sleep)</td>
                                        <td className="p-4">Instant</td>
                                        <td className="p-4">Instant</td>
                                        <td className="p-4 text-slate-500">1 Hour Sleep/Day</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Third-Party Ads</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-emerald-950/20">Zero Ads</td>
                                        <td className="p-4">Zero Ads</td>
                                        <td className="p-4">Zero Ads</td>
                                        <td className="p-4 text-red-400">Obnoxious Popups</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Step-by-Step Tutorial */}
                    <section className="space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Briefcase className="w-7 h-7 text-emerald-400" />
                            How to Launch Your Free Student Portfolio in 3 Minutes
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Follow these three straightforward steps to get your portfolio live today:
                        </p>

                        <div className="space-y-4 not-prose">
                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                                    1
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">Navigate to Celoris Cloud</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Open <Link href="/cloud" className="text-emerald-400 hover:underline font-mono">celoris.in/cloud</Link> in your phone or laptop browser. You will see the instant deployment dashboard.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 shrink-0">
                                    2
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">Choose Your Professional Handle</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Enter your personal name or project name (e.g. <code className="text-cyan-300">rohitsharma</code> or <code className="text-cyan-300">aaravdev</code>). This becomes your permanent live resume link: <code className="text-emerald-300 font-mono">https://rohitsharma.celoris.in</code>.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 shrink-0">
                                    3
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">Click &quot;Deploy Website&quot; &amp; Access WP Admin</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        The cloud provisioning engine provisions your MariaDB schema, allocates 3 GB storage, activates the Astra theme, and displays your one-time secure WordPress administrator credentials. Click the Admin URL, log in, and begin adding your projects!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* What to Include in a High-Converting Student Portfolio */}
                    <section className="space-y-5">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Award className="w-7 h-7 text-emerald-400" />
                            5 Must-Have Sections for a High-Converting Student Portfolio
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Once your Celoris instance is active, use the pre-installed WordPress editor or Astra templates to include these five sections:
                        </p>
                        <ol className="list-decimal pl-6 space-y-3 text-slate-300">
                            <li><strong className="text-white">Hero Section:</strong> Clear headline stating your core stack (e.g. <em>&quot;Full-Stack React &amp; Python Developer | BCA &apos;26&quot;</em>) and a 1-click &quot;Download Resume&quot; button.</li>
                            <li><strong className="text-white">Featured Project Case Studies:</strong> Instead of simple screenshots, write a 3-bullet summary: Problem, Tech Stack Used, and Live Demo / GitHub Repo link.</li>
                            <li><strong className="text-white">Technical Skills Grid:</strong> Group skills by category (Languages, Frameworks, Cloud/Databases, Tools).</li>
                            <li><strong className="text-white">College Coursework &amp; Certifications:</strong> Highlight verified bootcamps, hackathon participations, or specialized online course credentials.</li>
                            <li><strong className="text-white">Direct Contact / WhatsApp Link:</strong> Make it effortless for hiring managers to ping you on LinkedIn, email, or WhatsApp.</li>
                        </ol>
                    </section>

                    {/* FAQ Section */}
                    <section className="space-y-6 pt-6">
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
                            Stop keeping your projects on localhost. Deploy your high-speed portfolio link in 60 seconds and start impressing recruiters today.
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
