import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Smartphone, Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee,
    Search, Layout, Share2, Users, Wand2, Phone, TrendingUp, Code, Globe, Database, Server, ShoppingCart
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best WordPress Course in Noida (2026) — Complete Guide | Celoris',
    description: 'Looking for the best WordPress course in Noida? Complete guide covering fees, curriculum, WooCommerce, freelance scope, and how to choose the right trainer.',
    keywords: 'wordpress course noida, wordpress training noida, wordpress classes noida, woocommerce course noida, wordpress developer course noida',
};

export default function BestWordPressCourseNoida() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-purple-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/wordpress_noida.png")'
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
                            <span className="bg-purple-500/20 text-purple-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-purple-500/30 backdrop-blur-md">
                                WordPress • Noida • Web Skills
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-purple-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl text-balance">
                            Best WordPress Course in Noida (2026) — <span className="text-purple-400 italic block mt-2 text-balance">Complete Guide</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Team</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-purple-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-purple-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">Updated May 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-purple max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-purple-400 prose-strong:font-bold
                            prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <p className="text-xl leading-relaxed mb-10">
                                WordPress powers 43% of all websites on the internet — more than any other platform by a massive margin. Every Noida coaching institute, local business, restaurant, doctor's clinic, and startup needs a website. And for most of them, WordPress is the answer. Learning WordPress properly opens three doors simultaneously: you can manage your own website, freelance for local businesses, or get a job at a digital agency.
                            </p>
                            <p>
                                But WordPress training in Noida varies enormously in quality. Some courses teach you to install a theme and call it web development. Others go deep into WooCommerce, SEO, and client management. This guide helps you find the right one.
                            </p>

                            <div className="my-16 bg-purple-500/10 border-l-8 border-purple-500 p-8 md:p-12 rounded-r-3xl shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-purple-400 text-xl font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info className="h-6 w-6" /> Quick Answer
                                    </h3>
                                    <p className="text-xl md:text-2xl text-slate-100 font-bold leading-relaxed mb-6 text-balance">
                                        For project-based WordPress training in Noida covering Elementor, WooCommerce, SEO, and Indian payment gateways — visit <Link href="/wordpress-course-noida">celorisdesigns.com/wordpress-course-noida</Link>.
                                    </p>
                                    <Button className="bg-purple-500 hover:bg-purple-400 text-black font-black uppercase tracking-widest rounded-full px-8 py-6" asChild>
                                        <Link href="/wordpress-course-noida">View WordPress Course</Link>
                                    </Button>
                                    <p className="mt-4 text-sm text-slate-400">Courses start at ₹2,500.</p>
                                </div>
                                <Zap className="absolute top-1/2 right-10 -translate-y-1/2 h-40 w-40 text-purple-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            </div>

                            <section className="mt-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Why WordPress is the Most Practical Web Skill to Learn in Noida in 2026</h2>
                                <p>
                                    You could spend 6 months learning to code websites from scratch — or you could learn WordPress in 6 weeks and start building real sites for real clients immediately. Both paths have their place, but for most people in Noida who want to earn from web skills quickly, WordPress is the smarter starting point.
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 my-10">
                                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-purple-500" /> Market Demand in Noida
                                    </h4>
                                    <ul className="space-y-4 list-none p-0 m-0">
                                        {[
                                            "WordPress powers 43% of all websites globally — meaning almost every web-related job touches WordPress at some point",
                                            "Noida has thousands of small businesses, coaching institutes, and startups that need websites — and most of them cannot afford a full development agency",
                                            "A freelance WordPress developer in Noida can charge ₹8,000–30,000 per project and complete 2–3 projects per month",
                                            "WordPress + WooCommerce is the most widely used e-commerce platform for Indian small businesses, ahead of Shopify for sub-₹50L revenue stores",
                                            "Digital marketing roles almost universally require WordPress management — adding or editing pages, managing blogs, installing plugins"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <Check className="h-5 w-5 text-purple-500 shrink-0 mt-1" />
                                                <span className="text-slate-300 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p>
                                    The practical business case is clear: WordPress skill has one of the fastest learning-to-earning curves of any digital skill available in Noida right now.
                                </p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">WordPress vs Wix vs Shopify vs Custom Coding — Which Should You Learn?</h2>
                                
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Platform</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Best For</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Coding Required</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Market Share India</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Freelance Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { p: "WordPress", b: "Business sites, blogs, e-commerce, anything", c: "No (can add)", m: "Very High", f: "Very High" },
                                                { p: "Shopify", b: "Pure e-commerce, D2C brands", c: "No", m: "Medium", f: "Medium" },
                                                { p: "Wix", b: "Simple personal/small sites", c: "No", m: "Low", f: "Low" },
                                                { p: "Squarespace", b: "Portfolio and creative sites", c: "No", m: "Very Low", f: "Very Low" },
                                                { p: "Custom HTML/CSS/JS", b: "Full control, unique projects", c: "Yes", m: "N/A", f: "High (different skill)" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.p}</td>
                                                    <td className="p-6 text-purple-400 font-medium">{row.b}</td>
                                                    <td className="p-6 text-slate-400">{row.c}</td>
                                                    <td className="p-6 text-slate-400">{row.m}</td>
                                                    <td className="p-6 text-slate-400">{row.f}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-8 text-sm italic text-slate-400 text-center">For Noida's market specifically — WordPress wins on freelance demand and versatility. Shopify is worth adding later if you want to target D2C e-commerce clients specifically. Wix and Squarespace have almost no professional market in India.</p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">What a Good WordPress Course in Noida Must Cover</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        {
                                            title: "1. Real website builds — not just watching",
                                            icon: <Layout className="h-6 w-6 text-purple-500" />,
                                            desc: "The most important thing in a WordPress course is whether you actually build websites during the course. Not demos. Not teacher-led examples. Your own websites — with your own domain, your own hosting, your own content. A course that does not result in at least 3 live websites you built yourself is not teaching you WordPress; it is showing you WordPress."
                                        },
                                        {
                                            title: "2. WooCommerce with Indian payment gateways",
                                            icon: <ShoppingCart className="h-6 w-6 text-purple-500" />,
                                            desc: "Most WordPress courses in Noida teach WooCommerce with Stripe or PayPal — which most Indian customers do not use. A genuinely useful WooCommerce module covers Razorpay, PayU, and Cash on Delivery — the actual payment methods that Indian shoppers use. If your trainer cannot set up Razorpay, they have not built Indian e-commerce sites professionally."
                                        },
                                        {
                                            title: "3. SEO built into the curriculum",
                                            icon: <Search className="h-6 w-6 text-purple-500" />,
                                            desc: "A WordPress website that is not optimized for search engines is a missed opportunity. Every WordPress course worth attending should cover Yoast SEO or RankMath, XML sitemaps, on-page optimization, and basic Core Web Vitals — because every client will eventually ask why their website does not show up on Google."
                                        },
                                        {
                                            title: "4. Speed and performance optimization",
                                            icon: <Zap className="h-6 w-6 text-purple-500" />,
                                            desc: "WordPress sites are famous for being slow when misconfigured. Knowing how to install a caching plugin, compress images, use a CDN, and achieve a good PageSpeed score is what separates a professional WordPress developer from someone who just installs themes. This is also a major SEO factor in 2026."
                                        },
                                        {
                                            title: "5. Client management and handover workflow",
                                            icon: <Users className="h-6 w-6 text-purple-500" />,
                                            desc: "If you are learning WordPress for freelancing, knowing how to build a site is only half the job. You also need to know how to set up a client admin account, document what you built, handle revisions professionally, and hand over the site in a way that the client can manage it themselves. These soft skills are what get you referrals."
                                        }
                                    ].map((cat, i) => (
                                        <div key={i} className={`bg-white/5 border border-white/10 rounded-3xl p-8 ${i === 4 ? 'md:col-span-2' : ''}`}>
                                            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                                                {cat.icon} {cat.title}
                                            </h3>
                                            <p className="text-slate-400 text-sm leading-relaxed m-0">{cat.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">WordPress Course Fees in Noida — 2026 Price Guide</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
                                    {[
                                        {
                                            title: "Basic",
                                            price: "₹2,500",
                                            duration: "4 Weeks",
                                            stack: "WordPress setup, Elementor, essential plugins, 2 website builds"
                                        },
                                        {
                                            title: "Advanced",
                                            price: "₹4,999",
                                            duration: "8 Weeks",
                                            stack: "Full course + WooCommerce + SEO + performance + 3 website builds"
                                        },
                                        {
                                            title: "Mastery (1-on-1)",
                                            price: "₹8,000",
                                            duration: "8 Weeks",
                                            stack: "Everything + client management + freelance workflow setup"
                                        }
                                    ].map((plan, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-purple-500/50 transition-all group relative overflow-hidden">
                                            <div className="bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                                                {plan.duration}
                                            </div>
                                            <h3 className="text-2xl font-black text-white mb-2">{plan.title}</h3>
                                            <p className="text-4xl font-black text-purple-400 mb-6">{plan.price}</p>
                                            <p className="text-sm text-slate-300 mb-8 border-t border-white/5 pt-6 flex items-start gap-2">
                                                <Zap className="h-4 w-4 text-purple-500 shrink-0 mt-1" />
                                                {plan.stack}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-center text-sm italic text-slate-400">All plans include 3+ live WordPress websites built, a deployed WooCommerce store, Celoris completion certificate, and lifetime WhatsApp support.</p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Top 10 WordPress Interview Questions for Noida Jobs</h2>
                                
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Interview Question</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">What They're Testing</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { q: "What is the difference between a page and a post in WordPress?", t: "WordPress fundamentals" },
                                                { q: "How do you speed up a slow WordPress website?", t: "Performance knowledge" },
                                                { q: "Which SEO plugin do you prefer and why?", t: "SEO tool familiarity" },
                                                { q: "How do you set up a payment gateway in WooCommerce?", t: "E-commerce practical skills" },
                                                { q: "How do you handle a WordPress site that has been hacked?", t: "Security knowledge" },
                                                { q: "What is a child theme and why would you use one?", t: "Theme customization depth" },
                                                { q: "How do you migrate a WordPress site to a new host?", t: "Technical competence" },
                                                { q: "What is the difference between WordPress.com and WordPress.org?", t: "Platform understanding" },
                                                { q: "Which page builder do you prefer — Elementor, Divi, or Gutenberg?", t: "Tool familiarity + opinion" },
                                                { q: "How do you make a WordPress site mobile responsive?", t: "Responsive design basics" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.q}</td>
                                                    <td className="p-6 text-slate-400">{row.t}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-8 text-sm italic text-slate-400 text-center">Celoris students practice answers to these exact questions using real examples from websites built during the course.</p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white flex items-center gap-4 text-balance">
                                    Freelance WordPress Income in Noida — What's Realistic
                                </h2>
                                <p className="mb-10">Many students ask about realistic freelance income from WordPress in Noida. Here is an honest breakdown based on market rates:</p>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Project Type</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Typical Rate Noida</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Time Required</th>
                                                <th className="p-6 text-purple-400 font-black uppercase tracking-widest text-xs">Monthly Potential (3-4 projects)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { p: "Basic 5-page business website", r: "₹8,000–15,000", t: "3–5 days", m: "₹24,000–60,000" },
                                                { p: "WordPress blog setup + training", r: "₹5,000–10,000", t: "1–2 days", m: "₹20,000–40,000" },
                                                { p: "WooCommerce store (10-50 products)", r: "₹15,000–30,000", t: "5–8 days", m: "₹30,000–60,000" },
                                                { p: "Website maintenance retainer", r: "₹2,000–5,000/month", t: "2–4 hrs/month", m: "₹8,000–20,000 recurring" },
                                                { p: "Landing page design", r: "₹5,000–12,000", t: "2–3 days", m: "₹20,000–48,000" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.p}</td>
                                                    <td className="p-6 text-purple-400 font-black">{row.r}</td>
                                                    <td className="p-6 text-slate-400">{row.t}</td>
                                                    <td className="p-6 text-slate-400">{row.m}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-8 text-sm text-slate-400 leading-relaxed text-center">
                                    Starting out, expect 1–2 projects per month as you build your portfolio and referral network. By 3–6 months with consistent effort, 3–4 projects per month is achievable in Noida's active small business market.
                                </p>
                            </section>

                            <section className="mt-32">
                                <h2 className="text-3xl md:text-5xl font-black mb-12 text-white flex items-center gap-4">
                                    <HelpCircle className="h-10 w-10 text-purple-500" /> Frequently Asked Questions
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {[
                                        {
                                            q: "Is WordPress still relevant in 2026 with website builders like Wix?",
                                            a: "Yes — more than ever. WordPress market share has actually grown while Wix and Squarespace remain niche platforms. For any serious business website, e-commerce store, or professional blog in India, WordPress is the standard. And for freelancers, WordPress projects pay significantly more than Wix work."
                                        },
                                        {
                                            q: "How long does it take to learn WordPress?",
                                            a: "You can build a basic business website in WordPress within 2 weeks of regular training. A complete skill set including WooCommerce, SEO, and performance optimization takes 6–8 weeks. Being fully freelance-ready — including client management and troubleshooting — takes 8–10 weeks of dedicated learning."
                                        },
                                        {
                                            q: "Do I need hosting to learn WordPress?",
                                            a: "Yes, but it does not need to be expensive. We recommend starting with local hosting (LocalWP — free) for the first few sessions, then moving to live hosting (~₹200–300/month for shared hosting) when you build your first real site. Your trainer will guide you on the most cost-effective setup."
                                        },
                                        {
                                            q: "Is Elementor free or paid?",
                                            a: "Elementor has a free version that covers most basic functionality. Elementor Pro (~₹4,000/year) adds advanced widgets, theme builder, and WooCommerce builder. Our course covers both — you start with the free version and learn what Pro features are actually worth paying for."
                                        },
                                        {
                                            q: "Can the trainer come to my home in Noida?",
                                            a: "Yes. Celoris trainers offer home-visit sessions across all Noida sectors, Greater Noida, and nearby Ghaziabad. Online sessions are also available via Zoom or Google Meet."
                                        }
                                    ].map((item, i) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                            <AccordionTrigger className="text-white font-bold hover:no-underline py-6 text-left">{item.q}</AccordionTrigger>
                                            <AccordionContent className="text-slate-400 pb-6 leading-relaxed">
                                                {item.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>

                            <section className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts — Which WordPress Course Should You Join in Noida?</h2>
                                <p className="text-lg leading-relaxed mb-10">
                                    The best WordPress course in Noida is the one that gets you building real websites on day one, covers WooCommerce with actual Indian payment gateways, teaches you SEO alongside design, and prepares you for real client work — not just tutorial reproductions.
                                </p>
                                <p className="text-lg leading-relaxed mb-10">
                                    WordPress is forgiving of beginners and powerful in the hands of professionals. What you need is a trainer who has built real client sites, taught you the exact stack that Noida's market demands (Elementor, WooCommerce, Razorpay, Yoast), and supported you through the inevitable technical issues that come up on live projects.
                                </p>
                                <p className="text-lg leading-relaxed mb-10 text-purple-400 font-bold">
                                    Celoris WordPress training in Noida delivers all of this — starting at ₹2,500 with a free demo, home visit options, 3+ real website builds, and lifetime WhatsApp support.
                                </p>
                                <div className="bg-purple-500/10 border border-purple-500/20 p-10 md:p-16 rounded-[3rem] my-16 text-center">
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Book Your FREE Demo Today</h3>
                                    <p className="text-slate-400 mb-10 text-lg">Talk to an expert trainer. No commitment required.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <Button size="lg" className="bg-purple-500 hover:bg-purple-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(168,85,247,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                            <Link href="https://wa.me/919084718101">
                                                <Phone className="h-6 w-6 mr-3" /> WhatsApp Demo
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl w-full sm:w-auto" asChild>
                                            <Link href="/wordpress-course-noida">Course Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Internal Links & Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-purple-500" /> Related Articles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {[
                                    { t: "Best Web Development Course in Noida", l: "/blog/best-web-development-course-noida" },
                                    { t: "Best Digital Marketing Course in Noida", l: "/blog/best-digital-marketing-course-noida" },
                                    { t: "Web Designing Course Noida", l: "/blog/best-web-designing-course-noida" },
                                    { t: "WordPress Course Noida Landing Page", l: "/wordpress-course-noida" },
                                    { t: "All Trainers in Noida", l: "/learn?location=noida" }
                                ].map((link, i) => (
                                    <Link key={i} href={link.l} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{link.t}</span>
                                        <ArrowRight className="h-4 w-4 text-purple-500 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-purple-500 mt-1" />
                                {['wordpress course noida', 'wordpress training noida', 'wordpress classes noida', 'woocommerce course noida', 'wordpress developer course noida'].map((tag) => (
                                    <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-purple-500/20 hover:text-purple-400 transition-all cursor-default border border-white/5 hover:border-purple-500/30">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce sm:hidden">
                <Button className="bg-purple-500 hover:bg-purple-400 text-black font-black uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl shadow-purple-500/40 border-4 border-black/20" asChild>
                    <Link href="https://wa.me/919084718101">Book Demo</Link>
                </Button>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris Designs LLP | Noida's Leading Creative Skills Platform
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
