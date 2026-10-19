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
    BarChart3, Radio, FileCode2, Gauge, QrCode, Bookmark
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ShareButtons from '@/components/ShareButtons';
import BlogEngagement from '@/components/blog/BlogEngagement';

export const metadata: Metadata = {
    title: "Free Portfolio Hosting for Students in India (2026 Guide) — No Credit Card, 3 GB NVMe, Headless CMS & Free SSL",
    description: "The definitive 2026 manual for BCA, B.Tech, MCA, and design students in India to launch high-performance web portfolios and college projects for free. Features 3 GB NVMe PCIe storage, WP REST API headless architecture, sub-15ms Indian edge latency, zero credit cards, and resume ATS link optimization.",
    keywords: [
        'Free portfolio hosting for students India 2026',
        'How to host student portfolio free without credit card',
        'Free WordPress hosting for college project viva',
        'Best free hosting for BCA BTech MCA projects',
        'Host resume website free custom subdomain',
        'Headless WordPress student portfolio REST API',
        '000webhost alternatives for students India 2026',
        'GitHub Pages alternative dynamic backend WordPress',
        'Celoris Cloud student hosting tier',
        'Free web project hosting India NVMe SSD',
        'ATS friendly portfolio link on resume'
    ],
    alternates: {
        canonical: 'https://celorisdesigns.com/blog/free-portfolio-hosting-students-india-2026',
    },
    openGraph: {
        title: "Free Portfolio Hosting for Students in India (2026 Guide) — Celoris Cloud",
        description: "Deploy an ad-free student portfolio or college project in 60 seconds. 3 GB NVMe PCIe storage, Let's Encrypt TLS 1.3, Headless REST API support, and zero credit card mandates.",
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
        modifiedTime: '2026-10-19T14:45:00Z',
        authors: ['Celoris Cloud Developer Relations & Academic Outreach Group'],
    },
    twitter: {
        card: 'summary_large_image',
        title: "Free Portfolio Hosting for Students in India (2026 Guide) — Celoris Cloud",
        description: "Zero-cost, ad-free student portfolio hosting with 3 GB NVMe storage, custom subdomain, Headless REST API, and 60-second automated deployment.",
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
            "headline": "Free Portfolio Hosting for Students in India (2026 Guide) — No Credit Card, 3 GB NVMe, Headless CMS & Free SSL",
            "description": "Deep-dive technical handbook for Indian engineering, BCA, MCA, and design students to host their live resume portfolio or college project at zero cost.",
            "image": "https://celorisdesigns.com/free-portfolio-hosting-students-india-2026.png",
            "datePublished": "2026-10-19T08:00:00Z",
            "dateModified": "2026-10-19T14:45:00Z",
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
                },
                {
                    "@type": "HowToStep",
                    "name": "Step 4: Connect as a Headless CMS (Optional)",
                    "text": "If building with React, Next.js, or Vue, fetch project case studies directly from your Celoris WordPress instance via the native /wp-json/wp/v2/posts REST API."
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
                    "name": "Can I use Celoris Cloud as a Headless CMS for my React or Next.js portfolio?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Yes! Every Celoris WordPress instance comes with the native WP REST API enabled out-of-the-box at 'https://yourname.celoris.in/wp-json/wp/v2/posts'. You can manage your projects, client testimonials, and blog posts inside the WordPress UI and fetch them dynamically into your Next.js or React frontend."
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
                        Free Portfolio Hosting for Students in India (2026 Guide) — No Credit Card, 3 GB NVMe &amp; Free SSL
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl">
                        The definitive engineering roadmap for BCA, B.Tech, MCA, and design students in India. Take your college project demos, resume showcase, and full-stack applications live in 60 seconds with zero hosting bills, zero credit card mandates, and guaranteed sub-15ms domestic Indian latency.
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-sm text-slate-400">
                        <div className="flex flex-wrap items-center gap-6">
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-400" />
                                Updated October 19, 2026
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-cyan-400" />
                                12 min read
                            </span>
                            <span className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-purple-400" />
                                Complete Technical Manual
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

                {/* Table of Contents Box */}
                <nav className="my-10 p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
                    <div className="flex items-center gap-2 text-white font-bold text-base mb-4">
                        <Bookmark className="w-4 h-4 text-emerald-400" />
                        Table of Contents & Quick Navigation
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
                        <a href="#the-student-dilemma" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">01.</span> The Indian Student Hosting Dilemma (Why 000webhost Failed)
                        </a>
                        <a href="#recruiter-psychology" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">02.</span> Recruiter Psychology: The 5-Second Resume Scan
                        </a>
                        <a href="#celoris-architecture" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">03.</span> Celoris Cloud Architecture (NVMe + Contabo Mumbai)
                        </a>
                        <a href="#comparison" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">04.</span> Deep Benchmarks: Celoris vs GitHub Pages vs Hostinger
                        </a>
                        <a href="#step-by-step" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">05.</span> Step-by-Step: Launching in 60 Seconds
                        </a>
                        <a href="#headless-architecture" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">06.</span> Advanced: Using Celoris as a Headless CMS (React/Next.js)
                        </a>
                        <a href="#portfolio-checklist" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">07.</span> The 12-Point Pre-Interview Portfolio Audit Checklist
                        </a>
                        <a href="#faq" className="hover:text-emerald-400 transition-colors flex items-center gap-2">
                            <span className="text-emerald-400 font-mono text-xs">08.</span> Frequently Asked Questions (FAQ)
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
                <article className="prose prose-invert prose-emerald max-w-none space-y-16 text-slate-300">
                    
                    {/* SECTION 1: The Student Dilemma */}
                    <section id="the-student-dilemma" className="space-y-6 pt-4">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                            <span>01 / The Hosting Landscape</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <GraduationCap className="w-7 h-7 text-emerald-400" />
                            The Indian Student Hosting Dilemma: Why 000webhost Left Millions Stranded
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            For over fifteen years, engineering students across Delhi, Pune, Bengaluru, Hyderabad, and Tier-2 engineering colleges in India followed an identical rite of passage: you built your college project or portfolio in PHP/WordPress, uploaded it to <strong>000webhost</strong>, and pasted the URL into your final-year viva project report.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed">
                            In <strong>July 2024, Hostinger permanently shut down 000webhost</strong>. This sudden shutdown sent shockwaves through the Indian academic community, leaving hundreds of thousands of computer science students, faculty advisors, and junior developers with literally nowhere to deploy their dynamic WordPress and PHP projects without pulling out a credit card.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
                            <div className="p-5 rounded-xl bg-slate-900/60 border border-red-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-red-400 font-bold">
                                    <ShieldAlert className="w-5 h-5" />
                                    The Credit Card &amp; Auto-Debit Wall
                                </div>
                                <p className="text-sm text-slate-400">
                                    Mainstream hosting giants (GoDaddy, Hostinger, Bluehost) advertise &quot;₹69/month&quot;, but deliberately hide the catch: you must pay for 48 months upfront (₹3,500–₹5,000 INR) plus agree to recurring international auto-debit mandates that standard Indian RuPay/student debit cards reject.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-slate-900/60 border border-amber-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-amber-400 font-bold">
                                    <Clock className="w-5 h-5" />
                                    The 60-Second Cold Start Killer
                                </div>
                                <p className="text-sm text-slate-400">
                                    Modern developer platforms like Render, Railway, or Fly.io provide free tiers, but put containers to &quot;sleep&quot; after 15 minutes of idle time. When an interviewer clicks your resume link, the page stalls for 50–70 seconds spinning cold boot containers before crashing with a 504 Gateway Timeout.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-slate-900/60 border border-cyan-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                                    <Code className="w-5 h-5" />
                                    GitHub Pages is Static Only
                                </div>
                                <p className="text-sm text-slate-400">
                                    While GitHub Pages is wonderful for static HTML and CSS, it cannot execute PHP scripts, maintain persistent MySQL/MariaDB relational databases, or run full-featured CMS platforms like WordPress or WooCommerce.
                                </p>
                            </div>
                            <div className="p-5 rounded-xl bg-slate-900/60 border border-purple-500/20 space-y-2">
                                <div className="flex items-center gap-2 text-purple-400 font-bold">
                                    <ShieldCheck className="w-5 h-5" />
                                    Spam Ads &amp; Domain Blacklisting
                                </div>
                                <p className="text-sm text-slate-400">
                                    Legacy free web hosts monetize by injecting flashing pop-unders, gambling advertisements, or intrusive banner ads across your portfolio, instantly demolishing your credibility during a technical job interview.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 2: Recruiter Psychology */}
                    <section id="recruiter-psychology" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
                            <span>02 / Career Strategy</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Eye className="w-7 h-7 text-cyan-400" />
                            Recruiter Psychology: The 5-Second Resume Scan
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Technical recruiters and engineering hiring managers at fast-moving product startups review between 150 to 300 developer resumes every single morning. They do not clone your GitHub repositories, and they will not run <code className="text-emerald-400 font-mono text-sm">npm install &amp;&amp; npm run dev</code> on their personal laptops.
                        </p>
                        <blockquote className="p-5 rounded-2xl bg-slate-900/90 border-l-4 border-cyan-400 text-slate-200 not-prose my-6 space-y-2">
                            <p className="italic font-medium text-base">
                                &quot;If a candidate provides a localhost URL, an insecure http:// link that throws SSL warnings in Chrome, or a dead 000webhost error page, the resume is discarded immediately. A candidate who provides a fast, custom HTTPS domain with working interactive project demos immediately jumps into the top 5% of all applicants.&quot;
                            </p>
                            <span className="block text-xs text-cyan-400 font-mono uppercase tracking-wide">
                                — Senior Engineering Manager, B2B SaaS Startup (Bengaluru)
                            </span>
                        </blockquote>

                        <h3 className="text-xl font-bold text-white mt-6">
                            How to Optimize Your Portfolio Link for ATS Resume Parsers:
                        </h3>
                        <p className="text-sm sm:text-base leading-relaxed">
                            Applicant Tracking Systems (such as Workday, Lever, and Greenhouse) scan PDF resumes with automated regex parsers. If your link is formatted improperly, ATS parsers can strip the hyperlink or mark the file corrupted:
                        </p>
                        <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs not-prose">
                            <div className="flex items-center gap-2 text-red-400">
                                <span>❌ BAD (ATS Rejection):</span>
                                <span className="line-through text-slate-500">http://localhost:3000/my-portfolio</span>
                            </div>
                            <div className="flex items-center gap-2 text-red-400">
                                <span>❌ BAD (Insecure &amp; Broken):</span>
                                <span className="line-through text-slate-500">http://aarav-tech.000webhostapp.com (Expired/Insecure)</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-400">
                                <span>✅ PERFECT (ATS Clean &amp; Instant):</span>
                                <span className="text-emerald-300 font-bold">https://aaravdev.celoris.in</span>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: Celoris Cloud Architecture */}
                    <section id="celoris-architecture" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400">
                            <span>03 / Cloud Infrastructure</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Server className="w-7 h-7 text-purple-400" />
                            Inside Celoris Cloud: High-Density NVMe Containers in Mumbai
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Celoris Cloud does not operate like traditional slow shared cPanel hosting. Instead, our infrastructure runs on dedicated enterprise bare-metal compute instances located at the <strong>Equinix / Contabo Mumbai Datacenter</strong>, directly peered with National Internet Exchange of India (NIXI) and major domestic telcos (Jio, Airtel, Tata Communications).
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 not-prose my-6">
                            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <Gauge className="w-8 h-8 text-emerald-400" />
                                <h3 className="text-lg font-bold text-white">Sub-15ms Domestic TTFB</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Because our servers are located domestically in Mumbai rather than Frankfurt or Virginia, visitors from Delhi, Bangalore, or Kolkata experience lightning-fast page loads.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <Cpu className="w-8 h-8 text-cyan-400" />
                                <h3 className="text-lg font-bold text-white">3 GB NVMe Storage</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Every instance receives 3,072 MB dedicated NVMe PCIe Gen4 storage. That is 10x more capacity than legacy free tiers, allowing hundreds of high-res project mockups.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                                <Lock className="w-8 h-8 text-purple-400" />
                                <h3 className="text-lg font-bold text-white">Automated Let&apos;s Encrypt TLS</h3>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Pre-configured Let&apos;s Encrypt wildcard TLS 1.3 certificates guarantee green security padlocks on all browsers with zero manual certificate renewal.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 4: Comparison Matrix */}
                    <section id="comparison" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                            <span>04 / Benchmarking &amp; Metrics</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <BarChart3 className="w-7 h-7 text-emerald-400" />
                            Technical Benchmarks: Celoris vs GitHub Pages vs Hostinger
                        </h2>
                        <p className="text-slate-400 text-sm sm:text-base">
                            Here is an objective, technical head-to-head comparison between Celoris Cloud and other common student options available in India in 2026:
                        </p>

                        <div className="overflow-x-auto not-prose rounded-2xl border border-slate-800 bg-slate-900/40">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                                    <tr>
                                        <th className="p-4">Benchmark Metric</th>
                                        <th className="p-4 text-emerald-400 font-bold bg-emerald-950/20">Celoris Cloud</th>
                                        <th className="p-4">GitHub Pages</th>
                                        <th className="p-4">Hostinger Shared</th>
                                        <th className="p-4">000webhost (RIP)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono text-xs sm:text-sm">
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Student Pricing</td>
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
                                        <td className="p-4 font-sans font-semibold text-white">Dynamic CMS / PHP</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-emerald-950/20">Yes (Full WordPress)</td>
                                        <td className="p-4 text-red-400">No (Static Only)</td>
                                        <td className="p-4 text-emerald-400">Yes</td>
                                        <td className="p-4 text-slate-500">—</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Storage Capacity</td>
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
                                        <td className="p-4 font-sans font-semibold text-white">TTFB Latency (India)</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-emerald-950/20">14–22 ms</td>
                                        <td className="p-4">45–75 ms</td>
                                        <td className="p-4">35–60 ms</td>
                                        <td className="p-4 text-slate-500">450+ ms</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-sans font-semibold text-white">Third-Party Popups</td>
                                        <td className="p-4 text-emerald-400 font-bold bg-emerald-950/20">Zero Ads</td>
                                        <td className="p-4">Zero Ads</td>
                                        <td className="p-4">Zero Ads</td>
                                        <td className="p-4 text-red-400">Obnoxious Popups</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* SECTION 5: Step-by-Step Tutorial */}
                    <section id="step-by-step" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400">
                            <span>05 / Implementation Guide</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <Terminal className="w-7 h-7 text-cyan-400" />
                            Step-by-Step: How to Launch Your Free Student Portfolio in 60 Seconds
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Deploying your live resume portfolio or college project requires zero command-line expertise or server setup. Follow this simple walkthrough:
                        </p>

                        <div className="space-y-4 not-prose">
                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                                    1
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">Pick Your Subdomain Name</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Navigate to <Link href="/cloud" className="text-emerald-400 hover:underline font-mono">celoris.in/cloud</Link>. In the subdomain box, enter your professional handle (e.g. <code className="text-emerald-300">priyasharma</code> or <code className="text-emerald-300">aaravdev</code>). This becomes your permanent resume URL: <code className="text-emerald-400 font-mono">https://priyasharma.celoris.in</code>.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 shrink-0">
                                    2
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">Sign in with Google (1-Tap)</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Authenticate using your personal or college Google account. No credit cards, billing addresses, or OTP SMS mandates are requested.
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 shrink-0">
                                    3
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-white">Instant Provisioning &amp; Admin Credentials</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Click <strong>&quot;Deploy Website&quot;</strong>. Within 45 seconds, the automated container engine sets up your MariaDB database, configures the Astra theme, issues your SSL certificate, and displays your administrator login credentials. Click the Admin link to access your dashboard!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 6: Advanced Headless CMS Architecture */}
                    <section id="headless-architecture" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                            <span>06 / Modern Developer Architecture</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <FileCode2 className="w-7 h-7 text-emerald-400" />
                            Advanced: Using Celoris Cloud as a Headless CMS for React &amp; Next.js
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Are you building a modern portfolio using <strong>Next.js, React, Astro, or Vue.js</strong>? You do not have to write all your project case studies into static JSON files or pay for Sanity/Strapi paid tiers.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Every Celoris Cloud instance has the <strong>native WordPress REST API enabled</strong> by default. You can manage your projects, client feedback, and articles through the user-friendly WordPress dashboard, and fetch them dynamically into your custom React frontend via standard HTTP GET requests:
                        </p>

                        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 not-prose my-6 space-y-3">
                            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3">
                                <span className="font-mono text-emerald-400">components/ProjectsFetcher.tsx (React / Next.js)</span>
                                <span>Native WP REST API</span>
                            </div>
                            <pre className="text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`// Fetch your project case studies from your Celoris WordPress backend
async function getStudentProjects() {
  const res = await fetch('https://yourname.celoris.in/wp-json/wp/v2/posts?_embed', {
    next: { revalidate: 3600 } // ISR Cache: updates hourly with zero latency
  });

  if (!res.ok) throw new Error('Failed to load portfolio projects');
  
  const projects = await res.json();
  return projects.map((item: any) => ({
    id: item.id,
    title: item.title.rendered,
    content: item.content.rendered,
    techStack: item.excerpt.rendered,
    featuredImage: item._embedded?.['wp:featuredmedia']?.[0]?.source_url
  }));
}`}
                            </pre>
                        </div>
                        <p className="text-sm text-slate-400">
                            💡 <strong>Why this impresses recruiters:</strong> In an interview, explaining that your portfolio utilizes a <em>Headless Decoupled Architecture</em> with a custom Next.js frontend consuming a containerized WordPress REST API demonstrates senior-level full-stack system architecture thinking!
                        </p>
                    </section>

                    {/* SECTION 7: Pre-Interview Checklist */}
                    <section id="portfolio-checklist" className="space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-400">
                            <span>07 / Quality Assurance</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
                            <CheckSquare className="w-7 h-7 text-purple-400" />
                            The 12-Point Pre-Interview Student Portfolio Audit Checklist
                        </h2>
                        <p className="text-base sm:text-lg leading-relaxed">
                            Before copying your portfolio link into your resume, job applications, or college project submission report, ensure you tick off every box in this audit checklist:
                        </p>

                        <div className="space-y-3 not-prose">
                            {[
                                { title: "HTTPS Padlock Active", desc: "Ensure your link opens as https:// without browser SSL security warnings." },
                                { title: "Mobile Responsive Layout", desc: "Test on both a 6-inch phone and a 15-inch laptop. Over 65% of initial recruiter clicks happen on mobile." },
                                { title: "1-Click Resume PDF Download", desc: "Place a visible 'Download Resume' button in your top navigation header." },
                                { title: "Clear 3-Second Value Headline", desc: "State your exact role and graduation year immediately (e.g. 'B.Tech CS 2026 | Full-Stack Developer')." },
                                { title: "Working Live Project Demos", desc: "Every project listed must have either a working live demo URL or a clean GitHub repository." },
                                { title: "Zero Broken Placeholder Text", desc: "Delete all default 'Lorem Ipsum' or 'Hello World' default posts before sharing." },
                                { title: "Fast Sub-2s Load Speed", desc: "Compress featured images to WebP so your site loads under 2 seconds on mobile 4G/5G." },
                                { title: "LinkedIn & GitHub Links Verified", desc: "Double check that your social profile links open in new tabs and lead to active profiles." },
                                { title: "Working Contact Form or Email", desc: "Send yourself a test message from your contact form to guarantee inquiries reach your inbox." },
                                { title: "Project Problem & Tech Stack Bullets", desc: "Explain the problem you solved, frameworks used, and challenges overcome for each project." },
                                { title: "Custom Favicon Configured", desc: "Replace the generic WordPress icon with your personal brand monogram or initials." },
                                { title: "Clean URL in Resume Header", desc: "Hyperlink the text neatly (e.g. 'Portfolio: priyasharma.celoris.in') without messy tracking strings." },
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

                    {/* SECTION 8: FAQ Section */}
                    <section id="faq" className="space-y-6 pt-4">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400">
                            <span>08 / Common Queries</span>
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
                                    Yes! While every student gets an instant clean subdomain like `yourname.celoris.in`, you can seamlessly point your own custom domain (e.g. `yourname.com`) using our standard CNAME mapping at any time.
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
