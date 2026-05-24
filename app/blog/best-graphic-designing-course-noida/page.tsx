import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Smartphone, Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee,
    Search, Layout, Share2, Users, Wand2, Phone, TrendingUp,
    Palette, PenTool, Monitor
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Graphic Designing Course in Noida (2026) — Complete Guide | Celoris',
    description: 'Looking for the best graphic designing course in Noida? This guide covers top options, software, fees, portfolio tips, and career scope. Free demo available.',
    keywords: 'graphic designing course noida, graphic design classes noida, graphic design training noida, graphic designer course noida fees, adobe course noida',
};

export default function GraphicDesigningBlogNoida() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/photoshop_noida.png")'
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
                            <span className="bg-emerald-500/20 text-emerald-400 px-5 py-2 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md">
                                Graphic Design • Noida • Creative Career
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 9 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl text-balance">
                            Best Graphic Designing Course in Noida (2026) — <span className="text-emerald-400 italic block mt-2 text-balance">Complete Guide</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Team</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">May 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative mx-auto">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <p className="text-xl leading-relaxed mb-10">
                                Graphic design is everywhere in Noida's economy — from the branding of startups launching in Sector 63 to the product packaging of D2C brands shipping from the Expressway belt. Social media content, YouTube thumbnails, app icons, billboards, business cards — all of it requires skilled designers. And the demand is growing faster than the supply of trained professionals.
                            </p>
                            <p>
                                But choosing the right graphic designing course in Noida is genuinely difficult. Between online platforms, YouTube channels, local institutes, and one-off Adobe tutorials — the options are overwhelming and the quality varies enormously. This guide cuts through all of that and tells you exactly what to look for.
                            </p>

                            <div className="my-16 bg-emerald-500/10 border-l-8 border-emerald-500 p-8 md:p-12 rounded-r-3xl shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-emerald-400 text-xl font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info className="h-6 w-6" /> Quick Answer
                                    </h3>
                                    <p className="text-xl md:text-2xl text-slate-100 font-bold leading-relaxed mb-6 text-balance">
                                        For project-based graphic design training in Noida covering Photoshop, Illustrator, and brand identity — visit <Link href="/graphic-designing-course-noida">celorisdesigns.com/graphic-designing-course-noida</Link>.
                                    </p>
                                    <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-full px-8 py-6" asChild>
                                        <Link href="/graphic-designing-course-noida">View Graphic Design Course</Link>
                                    </Button>
                                    <p className="mt-4 text-sm text-slate-400">Courses start at ₹2,500.</p>
                                </div>
                                <Palette className="absolute top-1/2 right-10 -translate-y-1/2 h-40 w-40 text-emerald-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            </div>

                            <section className="mt-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Why Graphic Design is a Powerful Career Choice in Noida in 2026</h2>
                                <p>
                                    Noida has undergone a significant shift over the past five years. What was once primarily a back-office IT city has evolved into a hub for product companies, D2C startups, content agencies, and digital marketing firms. Every single one of these businesses needs design — constantly and consistently.
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 my-10">
                                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Market Demand in Noida
                                    </h4>
                                    <ul className="space-y-4 list-none p-0 m-0">
                                        {[
                                            "Noida's e-commerce ecosystem alone generates thousands of product image editing and packaging design jobs",
                                            "Social media management agencies in Noida's Sector 2, 16, and 62 hire designers for ongoing content creation",
                                            "YouTube creators and Instagram influencers based in Delhi NCR outsource thumbnail and banner design to Noida-based freelancers",
                                            "Startups in the Knowledge Park and Expressway corridor need brand identity designers for launch materials",
                                            "Print shops and signage companies across Noida hire in-house designers for everyday client work"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
                                                <span className="text-slate-300 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p>
                                    The opportunity for a trained graphic designer in Noida is not just in formal employment — the freelance market is equally strong. A designer with a solid portfolio and basic client skills can build a ₹30,000–80,000/month freelance income from Noida's local business market alone.
                                </p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white flex items-center gap-4 text-balance">
                                    <Layout className="h-10 w-10 text-emerald-500 shrink-0" />
                                    Graphic Design vs Web Design vs UI/UX — What's the Difference?
                                </h2>
                                <p className="mb-12">Before you choose a course, it helps to understand how these overlapping fields differ:</p>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Field</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Core Focus</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Primary Tools</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Best Career Path</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { f: "Graphic Design", c: "Visual communication — print, digital, brand identity", t: "Photoshop, Illustrator, InDesign", p: "Designer, Art Director, Brand Consultant" },
                                                { f: "Web Design", c: "Designing how websites look and feel visually", t: "Figma, Photoshop, basic HTML/CSS", p: "Web Designer, Frontend Designer" },
                                                { f: "UI/UX Design", c: "Designing digital product interfaces and user experience", t: "Figma, Sketch, user research methods", p: "Product Designer, UX Researcher" },
                                                { f: "Motion Graphics", c: "Animated visuals — ads, videos, explainers", t: "After Effects, Premiere Pro", p: "Motion Designer, Video Creator" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.f}</td>
                                                    <td className="p-6 text-slate-300">{row.c}</td>
                                                    <td className="p-6 text-emerald-400 font-bold">{row.t}</td>
                                                    <td className="p-6 text-slate-400">{row.p}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-8">
                                    Start with graphic design if you want the broadest foundation — it underlies all other visual disciplines. Web design and UI/UX are natural progressions once you have solid design fundamentals. Celoris offers all of these as separate courses in Noida.
                                </p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">The Complete Graphic Designer's Toolkit — What You Need to Learn</h2>
                                <div className="space-y-6">
                                    {[
                                        {
                                            module: "Adobe Photoshop — raster image editing",
                                            topics: "Photoshop is the foundation for photo editing, digital illustration, social media graphics, and marketing collateral. Every graphic designer uses Photoshop daily. It is non-negotiable in the toolkit."
                                        },
                                        {
                                            module: "Adobe Illustrator — vector graphics and logo design",
                                            topics: "Illustrator is where logos, icons, brand marks, and scalable graphics are created. The critical difference from Photoshop: Illustrator graphics can be scaled to any size without losing quality — essential for logos that appear on everything from a business card to a billboard. Any serious graphic designer must know Illustrator."
                                        },
                                        {
                                            module: "Adobe InDesign — multi-page print and digital layouts",
                                            topics: "InDesign is the industry standard for designing brochures, catalogues, annual reports, magazines, and books. If you want to work in print design or publishing in Noida, InDesign is required. It is the most commonly skipped tool in cheap graphic design courses — and the most commonly asked for in design job descriptions."
                                        },
                                        {
                                            module: "Canva — quick client deliverables",
                                            topics: "Canva is not a professional design tool, but it is a reality of the industry. Clients ask for Canva templates, social media managers use it daily, and knowing Canva allows you to deliver quick iterations without opening the full Adobe suite. Treat it as a productivity tool, not a primary skill."
                                        },
                                        {
                                            module: "Design principles — the most important and most neglected part",
                                            topics: "Software skills without design thinking produce technically competent but visually weak work. Typography, color theory, grid systems, visual hierarchy, and composition are what separate designers who charge ₹2,000 per logo from those who charge ₹20,000. Any course that does not teach these principles alongside the software is incomplete."
                                        }
                                    ].map((m, i) => (
                                        <div key={i} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-black border border-emerald-500/30">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold mb-2">{m.module}</h4>
                                                <p className="text-sm text-slate-400 m-0">{m.topics}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Graphic Design Course Fees in Noida — 2026 Price Guide</h2>
                                <p>Graphic design training fees in Noida range from ₹2,500 for a basic course to ₹40,000+ at branded institutes. Here is transparent Celoris pricing:</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
                                    {[
                                        {
                                            title: "Basic Plan",
                                            price: "₹2,500",
                                            duration: "4 Weeks",
                                            focus: "Design principles, Photoshop, basic Illustrator, social media graphics"
                                        },
                                        {
                                            title: "Advanced Plan",
                                            price: "₹4,999",
                                            duration: "8 Weeks",
                                            focus: "Full Adobe suite + Brand identity + Print design + 15 portfolio projects"
                                        },
                                        {
                                            title: "Professional (1-on-1)",
                                            price: "₹8,000",
                                            duration: "10 Weeks",
                                            focus: "Complete course + Portfolio review + Freelance client acquisition"
                                        }
                                    ].map((plan, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-emerald-500/50 transition-all group relative overflow-hidden flex flex-col">
                                            <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                                                {plan.duration}
                                            </div>
                                            <h3 className="text-2xl font-black text-white mb-2">{plan.title}</h3>
                                            <p className="text-4xl font-black text-emerald-400 mb-6">{plan.price}</p>
                                            <p className="text-sm text-slate-300 mb-8 border-t border-white/5 pt-6 flex-1 flex items-start gap-2">
                                                <Zap className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
                                                {plan.focus}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl">
                                    <p className="text-slate-200 font-bold mb-4 flex items-center gap-2">
                                        <Check className="text-emerald-500" />
                                        All plans include:
                                    </p>
                                    <p className="text-slate-400">
                                        A portfolio of 15+ real design projects, print and digital ready files, Celoris completion certificate, and lifetime WhatsApp support.
                                    </p>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">5 Things to Check Before Paying for Any Graphic Design Course in Noida</h2>
                                <div className="space-y-12">
                                    {[
                                        {
                                            title: "1. Does the course teach design principles or just software?",
                                            desc: "Software skills are learnable from YouTube in a few weeks. What you pay a trainer for is the design thinking — understanding why certain color combinations work, how to create visual hierarchy, when to use whitespace, how to build a grid. If a course syllabus is entirely tool-focused with no mention of design principles, typography, or color theory — it is teaching you to use a hammer without understanding construction."
                                        },
                                        {
                                            title: "2. Which Adobe tools are actually covered?",
                                            desc: "Many courses in Noida advertise 'graphic design training' but only cover Photoshop. A complete graphic design education requires Photoshop, Illustrator, and at minimum basic InDesign. Ask specifically which tools are covered and at what depth before paying."
                                        },
                                        {
                                            title: "3. How many real projects will you build?",
                                            desc: "The only thing that gets you a design job or freelance client is a portfolio. A course that does not result in a portfolio of at least 10–15 original projects is a waste of money. Ask to see examples of student work from previous batches. If the trainer cannot show you real student projects, that tells you everything."
                                        },
                                        {
                                            title: "4. Is the trainer a practising designer?",
                                            desc: "A trainer who has designed real brand identities, worked with real clients, and solved real design problems teaches fundamentally differently from one who has only taught in classrooms. Ask to see your trainer's own portfolio and client work before committing."
                                        },
                                        {
                                            title: "5. Batch size and individual feedback",
                                            desc: "Design improvement requires feedback on your specific work. In a batch of 20-30 students, your designs never get properly reviewed. Look for small batches of 5 or fewer, or 1-on-1 sessions. Celoris caps group batches at 5 students maximum — every design project gets individual feedback."
                                        }
                                    ].map((item, i) => (
                                        <div key={i} className="bg-white/5 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                            <h4 className="text-xl font-black text-white mb-4">{item.title}</h4>
                                            <p className="text-slate-400 mb-0">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Graphic Design Career Paths in Noida — Roles and Growth</h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Career Path</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Starting Point</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Salary Range</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Growth</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { r: "Junior Graphic Designer", s: "Portfolio of 10+ projects", sal: "₹2.5L–4.5L / year", g: "Senior Designer → Art Director" },
                                                { r: "Brand Designer", s: "Illustrator + brand identity", sal: "₹3.5L–7L / year", g: "Brand Strategist → Creative Director" },
                                                { r: "Social Media Designer", s: "Photoshop + Canva", sal: "₹2.5L–4.5L / year", g: "Content Lead → Social Media Manager" },
                                                { r: "Print Designer", s: "Photoshop + Illustrator + InDesign", sal: "₹2.5L–5L / year", g: "Senior Designer → Studio owner" },
                                                { r: "Freelance Designer", s: "Any specialization", sal: "₹3L–15L / year", g: "Scale clients → Design agency" },
                                                { r: "Art Director", s: "5+ years experience", sal: "₹6L–14L / year", g: "Creative Director → VP Creative" }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.r}</td>
                                                    <td className="p-6 text-slate-400">{row.s}</td>
                                                    <td className="p-6 text-emerald-400 font-black">{row.sal}</td>
                                                    <td className="p-6 text-slate-300">{row.g}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="mt-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Building Your Graphic Design Portfolio in Noida</h2>
                                <p>
                                    Your portfolio is your most important asset as a graphic designer. Employers and clients will look at your work before they look at anything else. Here is what a strong entry-level design portfolio in Noida should contain:
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 my-10">
                                    <ul className="space-y-4 list-none p-0 m-0">
                                        {[
                                            "2–3 logo design projects — showing your Illustrator skills and brand thinking",
                                            "1 complete brand identity — logo, colors, fonts, business card, letterhead",
                                            "3–4 social media graphic sets — showing platform-specific design sensibility",
                                            "1–2 print pieces — brochure, flyer, or poster showing InDesign and print knowledge",
                                            "1 packaging design project — product label or box design",
                                            "Behance or portfolio website — where employers and clients can view your work online"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
                                                <span className="text-slate-300 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p>
                                    At Celoris, every student finishes the course with all of the above — 15+ projects across all categories, ready to present to employers or freelance clients in Noida.
                                </p>
                            </section>

                            <section className="mt-32">
                                <h2 className="text-3xl md:text-5xl font-black mb-12 text-white flex items-center gap-4">
                                    <HelpCircle className="h-10 w-10 text-emerald-500" /> Frequently Asked Questions
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    <AccordionItem value="item-1" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Is graphic design a good career in Noida in 2026?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes — Noida's growing startup and e-commerce ecosystem creates consistent demand for graphic designers. Between formal employment at agencies and IT companies, and the strong freelance market from local businesses, a skilled designer in Noida can build a solid career relatively quickly compared to more saturated fields.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Do I need to know how to draw to learn graphic design?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            No. Modern graphic design is done primarily with software tools — not hand drawing. While some illustration-focused roles benefit from drawing skills, the vast majority of graphic design work (logos, branding, social media, print layouts) requires no drawing ability whatsoever.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">How long does it take to become a professional graphic designer?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            With dedicated practice, you can reach an entry-level professional standard in 8–12 weeks of structured training. Building a strong portfolio and developing a personal design style takes another 3–6 months of consistent project work. Most Celoris students are ready for junior roles or first freelance clients within 3 months of starting.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Which is more important — Photoshop or Illustrator for graphic design?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Both are essential but serve different purposes. Photoshop handles raster images (photos, digital paintings, social media graphics). Illustrator handles vector graphics (logos, icons, scalable artwork). A complete graphic designer needs both. If you can only learn one first — start with Photoshop, then add Illustrator.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Can I get freelance clients after completing the course?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes — Celoris Professional plan specifically covers freelance client acquisition. We help you price your services, build your Behance profile, create a proposal template, and identify where to find your first clients in Noida's local business market. Several of our students have gotten their first paid project within 2–4 weeks of completing the course.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            <section className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts — Which Graphic Design Course Should You Join in Noida?</h2>
                                <p className="text-lg leading-relaxed mb-10">
                                    The honest truth about graphic design training in Noida is this: the difference between a good course and a bad one is not the price or the institute name — it is whether you leave with a portfolio of original work that demonstrates real skill.
                                </p>
                                <p className="text-lg leading-relaxed mb-10">
                                    A ₹30,000 course at a branded institute that puts 25 students in a batch and assigns tutorial reproductions will not get you a design job or a freelance client. A ₹5,000 course with a practising designer, small batch sizes, original project assignments, and individual feedback will.
                                </p>
                                <p className="text-lg leading-relaxed mb-10">
                                    Celoris graphic designing course in Noida is built around this principle — real projects, real feedback, the complete Adobe toolkit, and design thinking alongside software skills. Starting at ₹2,500 with a free demo, home visit options, and a portfolio of 15+ projects by the time you finish.
                                </p>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-16 text-center">
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Book Your FREE Demo Today</h3>
                                    <p className="text-slate-400 mb-10 text-lg">Talk to an expert trainer who has handled real client accounts. No commitment required.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                            <Link href="https://wa.me/919084718101">
                                                <Phone className="h-6 w-6 mr-3" /> WhatsApp Demo
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl w-full sm:w-auto" asChild>
                                            <Link href="/graphic-designing-course-noida">Course Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Internal Links & Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-emerald-500" /> Related Articles & Courses
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {[
                                    { t: "Best Photoshop Training in Noida", l: "/blog/best-photoshop-training-noida" },
                                    { t: "Best Digital Marketing Course in Noida", l: "/blog/best-digital-marketing-course-noida" },
                                    { t: "Adobe Illustrator Course Noida", l: "/blog/adobe-illustrator-course-noida" },
                                    { t: "Graphic Designing Course Noida", l: "/graphic-designing-course-noida" },
                                    { t: "All Design Trainers in Noida", l: "/learn?location=noida&category=design" }
                                ].map((link, i) => (
                                    <Link key={i} href={link.l} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{link.t}</span>
                                        <ArrowRight className="h-4 w-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                                {['graphic designing course noida', 'graphic design classes noida', 'graphic design training noida', 'graphic designer course noida fees', 'adobe course noida'].map((tag) => (
                                    <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
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
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl shadow-emerald-500/40 border-4 border-black/20" asChild>
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
