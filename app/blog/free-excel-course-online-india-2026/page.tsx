import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee, BookOpen, GraduationCap, Users, TrendingUp, Briefcase
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: 'Free Excel Course Online India 2026 — Zero to Job Ready',
    description: 'Looking for a free Excel course online in India 2026? Learn Excel from beginner to advanced with a verified trainer — 229 reviews, 682 students trained. Free demo at celoris.in',
    keywords: ['free excel course online', 'free excel course online India', 'Excel course India 2026', 'Microsoft Excel training India'],
    openGraph: {
        title: 'Free Excel Course Online India 2026 — Zero to Job Ready',
        description: 'Learn Excel from beginner to advanced with a verified trainer in India. Free demo available.',
        images: ['/blog-excel-course-india-2026.png'],
        type: 'article',
    },
};

export default function BlogPost() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-excel-course-india-2026.png")'
                    }}
                />
                {/* Overlay */}
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
                                Education
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 12 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1] tracking-tighter text-white drop-shadow-2xl">
                            Free Excel Course Online India 2026 — <span className="text-emerald-400">Zero to Job Ready</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Creator</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">March 3, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative">
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
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg">
                                    "If you are searching for a free Excel course online in India in 2026 — you are making one of the smartest career decisions of this year."
                                </p>
                            </div>

                            <p>
                                Microsoft Excel remains the single most in-demand software skill in India's corporate job market. Every company — from startups in Bangalore to government offices in Delhi — expects their employees to know Excel. HR professionals, accountants, data analysts, sales executives, marketing managers and operations teams all use Excel daily.
                            </p>
                            <p>
                                The problem is that most Excel courses in India are either genuinely good but expensive — or free but completely useless.
                            </p>
                            <p>
                                This guide covers everything you need to know about learning Excel online for free in India in 2026 — what to look for in a free course, which free courses actually teach you job-ready skills and how to access India's highest-rated Excel course completely free on Celoris.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <TrendingUp className="h-10 w-10 text-emerald-500" />
                                Why Excel is Still the Most Important Skill to Learn in 2026
                            </h2>
                            <p>
                                Every year people predict that Excel will be replaced by newer tools. Every year Excel proves them wrong.
                            </p>
                            <p>
                                In 2026 Excel is more relevant than ever in India for three specific reasons:
                            </p>

                            <div className="space-y-8 my-12">
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                    <h4 className="text-white font-black mb-4 flex items-center gap-3">
                                        <Briefcase className="h-5 w-5 text-emerald-500" />
                                        1. Indian companies run on Excel
                                    </h4>
                                    <p className="text-slate-400 text-sm">Despite the availability of expensive ERP software and business intelligence tools, the reality of Indian corporate life is that Excel handles most day-to-day data work. Budget planning, sales tracking, inventory management, employee records, financial reporting — all Excel. Even companies that use SAP or Salesforce use Excel alongside those tools for quick analysis and reporting.</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                    <h4 className="text-white font-black mb-4 flex items-center gap-3">
                                        <IndianRupee className="h-5 w-5 text-emerald-500" />
                                        2. Excel skills directly increase your salary
                                    </h4>
                                    <p className="text-slate-400 text-sm">A working professional in India who demonstrates advanced Excel skills — VLOOKUP, PivotTables, data analysis and basic Macros — consistently earns 20 to 30 percent more than colleagues without those skills. Recruiters on Naukri.com and LinkedIn actively filter candidates by Excel proficiency. In a competitive job market having Excel on your resume is not a differentiator — not having it is a disqualifier.</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                    <h4 className="text-white font-black mb-4 flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-emerald-500" />
                                        3. AI tools are making Excel more powerful not less
                                    </h4>
                                    <p className="text-slate-400 text-sm">In 2026 Microsoft has deeply integrated Copilot AI into Excel. Professionals who already know Excel are now using AI to work 5 times faster. Professionals who never learned Excel cannot use Excel Copilot effectively. Learning Excel in 2026 means learning the foundation that makes AI-powered Excel work for you.</p>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                What Makes a Good Free Excel Course in India
                            </h2>
                            <p>
                                Not all free Excel courses are equal. Here is what separates genuinely useful free Excel courses from the ones that waste your time:
                            </p>

                            <div className="bg-gradient-to-br from-[#121a2e] to-[#0a0f1d] p-8 md:p-12 rounded-[2rem] border border-white/10 my-12 shadow-inner">
                                <ul className="grid grid-cols-1 gap-6 list-none p-0">
                                    {[
                                        { title: "Real trainer with verifiable experience", desc: "A good free Excel course has a trainer whose credentials you can verify — years of experience, student reviews, corporate training background." },
                                        { title: "Structured curriculum not random videos", desc: "A good free Excel course follows a logical progression — basics first, intermediate next, advanced last." },
                                        { title: "Practical exercises not just theory", desc: "Good free courses include exercises, assignments and real datasets to practice on." },
                                        { title: "Job-relevant content", desc: "Should cover the functions that Indian companies actually use — VLOOKUP, PivotTables, IF formulas, and Macros." },
                                        { title: "Certificate on completion", desc: "In India's job market a course certificate adds credibility to your resume." }
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-4 bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all">
                                            <Check className="h-6 w-6 text-emerald-500 shrink-0" />
                                            <div>
                                                <h4 className="text-white font-bold mb-1">{item.title}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-12 text-white">
                                Best Free Excel Course Online India 2026 — <span className="text-emerald-500">Celoris</span>
                            </h2>
                            <p className="text-lg">
                                The best free Excel course available in India in 2026 is <strong>Be an Excel Expert</strong> on Celoris — taught by <strong>Dheeraj Kushwaha</strong>.
                            </p>

                            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 md:p-12 rounded-[3rem] my-12 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                    <Star className="h-32 w-32 text-emerald-500" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-6 relative">Why this course stands out:</h3>
                                <div className="space-y-6 relative">
                                    <p className="text-slate-300">
                                        Dheeraj Kushwaha has been training professionals on Microsoft Excel for over 8 years. He has trained <strong>682 students</strong>, earned <strong>229 verified reviews</strong> and been recognised as a <strong>Top 10 Microsoft Excel Trainer in India</strong> by UrbanPro in 2024.
                                    </p>
                                    <p className="text-slate-300">
                                        The course is available on Celoris (celoris.in) with a <strong>free demo session</strong> — no credit card required, no hidden fees, no watermark on your certificate.
                                    </p>
                                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest px-10 rounded-2xl shadow-xl shadow-emerald-500/20 group" asChild>
                                        <Link href="/learn/be-an-excel-expert">
                                            View Course Details
                                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white">
                                Complete Course Curriculum
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                                {[
                                    {
                                        module: "Module 1",
                                        title: "Excel Foundations",
                                        desc: "For complete beginners. Topics: interface navigation, basic formulas (SUM, AVG, etc), formatting, and essential shortcuts.",
                                        exercise: "Build a personal budget tracker and attendance register.",
                                        icon: <Laptop className="h-6 w-6" />
                                    },
                                    {
                                        module: "Module 2",
                                        title: "Excel for the Indian Workplace",
                                        desc: "For intermediate users. Topics: VLOOKUP, HLOOKUP, IF/Nested IF, Data Validation, and PivotTables.",
                                        exercise: "Build a complete HR attendance and salary tracker.",
                                        icon: <Briefcase className="h-6 w-6" />
                                    },
                                    {
                                        module: "Module 3",
                                        title: "Excel Data Analysis",
                                        desc: "For professionals handling large data. Topics: PivotTable mastery, PivotCharts, Slicers, INDEX & MATCH.",
                                        exercise: "Build a one-page executive dashboard for 5,000-row dataset.",
                                        icon: <TrendingUp className="h-6 w-6" />
                                    },
                                    {
                                        module: "Module 4",
                                        title: "Macros and Automation",
                                        desc: "For advanced users. Topics: Recording macros, basic VBA, Project automation (Invoices, Reports).",
                                        exercise: "Build a fully automated monthly sales report with one click.",
                                        icon: <Zap className="h-6 w-6" />
                                    }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-emerald-500/30 transition-all hover:scale-[1.02] flex flex-col items-start">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 border border-emerald-500/30">
                                            {item.icon}
                                        </div>
                                        <span className="text-emerald-500 font-black text-xs uppercase tracking-widest mb-2">{item.module}</span>
                                        <h4 className="text-xl font-black text-white mb-4">{item.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-6">{item.desc}</p>
                                        <div className="mt-auto pt-6 border-t border-white/5 w-full">
                                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-2">Practice Exercise:</p>
                                            <p className="text-xs text-emerald-400 font-bold italic">{item.exercise}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white">
                                Who Should Take This Course
                            </h2>
                            <div className="space-y-6 mb-32">
                                {[
                                    { title: "Freshers entering the job market", desc: "VLOOKUP, PivotTables and basic data analysis are tested in interviews at every major Indian company from TCS to HDFC bank." },
                                    { title: "Working professionals seeking promotion", desc: "Advanced Excel skills directly correlate with career advancement in finance, operations, HR and sales functions." },
                                    { title: "Small business owners managing accounts", desc: "Excel gives you the tools to manage inventory, track sales, and monitor expenses without expensive software." },
                                    { title: "Students preparing for government exams", desc: "SSC CGL, IBPS and state-level exams now include computer proficiency sections testing Excel." },
                                    { title: "Freelancers and consultants", desc: "Data entry and analysis are consistently among the highest-paying freelance tasks on platforms like Upwork." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-6 bg-[#12182b] p-8 rounded-3xl border border-white/5 shadow-inner">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 font-black text-emerald-500">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold mb-2">{item.title}</h4>
                                            <p className="text-slate-400 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Comparison Table */}
                            <div className="mt-32 mb-32 bg-gradient-to-br from-[#12182b] to-[#0a0f1d] rounded-[3rem] border border-white/10 p-8 md:p-12 overflow-hidden shadow-inner">
                                <h3 className="text-3xl font-black text-white mb-12 tracking-tight flex items-center gap-4">
                                    <Zap className="h-8 w-8 text-yellow-500" />
                                    Free vs Paid Excel Course — 2026
                                </h3>
                                <div className="overflow-x-auto -mx-8 px-8">
                                    <table className="w-full text-left border-collapse min-w-[600px]">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                                                <th className="py-6 pr-4">Factor</th>
                                                <th className="py-6 px-4 text-emerald-400">Celoris Free Demo</th>
                                                <th className="py-6 px-4">YouTube</th>
                                                <th className="py-6 pl-4">Paid Udemy</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-300 font-bold text-sm">
                                            {[
                                                { label: "Real trainer", values: ["Yes (Verified)", "Varies", "Varies"] },
                                                { label: "Structured curriculum", values: ["Yes", "Random", "Yes"] },
                                                { label: "Personal feedback", values: ["Yes", "No", "No"] },
                                                { label: "Live sessions", values: ["Yes", "No", "No"] },
                                                { label: "Certificate", values: ["Yes", "No", "Yes"] },
                                                { label: "Job-relevant projects", values: ["Yes", "Some", "Some"] },
                                                { label: "Hindi explanation", values: ["Yes", "Some", "Some"] },
                                                { label: "Cost", values: ["Free demo", "Free", "₹500-3,000"] },
                                                { label: "Indian context", values: ["Yes", "Some", "Mostly Western"] }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                    <td className="py-6 pr-4 text-slate-400 group-hover:text-white transition-colors">{row.label}</td>
                                                    {row.values.map((v, idx) => (
                                                        <td key={idx} className={`py-6 px-4 ${idx === 0 ? "text-emerald-400 font-black" : v.includes("No") ? "text-red-500/50" : "text-slate-300"}`}>
                                                            {v === "Yes" ? <Check className="h-4 w-4" /> : v === "No" ? <X className="h-4 w-4" /> : v}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white">
                                How to Access the Free Course
                            </h2>
                            <div className="space-y-6 mb-32">
                                {[
                                    { step: "Visit celoris.in/learn/be-an-excel-expert", icon: <Laptop className="h-5 w-5" /> },
                                    { step: "Click 'Book Free Demo' — no credit card required", icon: <Star className="h-5 w-5" /> },
                                    { step: "Choose your session time (weekdays or weekends)", icon: <Calendar className="h-5 w-5" /> },
                                    { step: "Attend your free demo with Dheeraj Kushwaha", icon: <Users className="h-5 w-5" /> },
                                    { step: "Decide if you want the full 10-hour live course", icon: <Check className="h-5 w-5" /> }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 bg-[#12182b] p-6 rounded-3xl border border-white/5 shadow-inner">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-xl border border-emerald-500/20">
                                            0{i + 1}
                                        </div>
                                        <p className="text-white font-bold">{item.step}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-32 text-center">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Ready to be an Excel Expert?</h2>
                                <p className="text-slate-400 mb-12 text-lg">Join 682+ trainees who have mastered Excel under India's top trainer. Book your free demo today.</p>
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" asChild>
                                    <Link href="/learn/be-an-excel-expert">Book Free Demo</Link>
                                </Button>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-12 text-white flex items-center gap-4">
                                <HelpCircle className="h-10 w-10 text-emerald-500" />
                                FAQs
                            </h2>
                            <div className="mb-32">
                                <Accordion type="single" collapsible className="space-y-4">
                                    {[
                                        {
                                            q: "Is this Excel course really free?",
                                            a: "The demo session is completely free — no credit card, no hidden charges. You get a full Module 1 session worth ₹400 at zero cost. The complete 10-hour course is ₹4,000 if you choose to continue after the demo."
                                        },
                                        {
                                            q: "Which version of Excel does this course cover?",
                                            a: "The course covers Excel 2010, 2013, 2016, 2019, 2021 and Microsoft 365. All functions taught work across these versions. XLOOKUP is taught separately for modern versions."
                                        },
                                        {
                                            q: "I am a complete beginner — is this course suitable?",
                                            a: "Yes — Module 1 starts from the absolute beginning assuming zero prior Excel knowledge. Many students joined as complete beginners and now use Excel confidently in their jobs."
                                        },
                                        {
                                            q: "Do I get a certificate?",
                                            a: "Yes — you receive a module-wise certificate after completing each module and a full course completion certificate after Module 4. Celoris certificates include your name and trainer credentials."
                                        },
                                        {
                                            q: "Can I use these skills for freelance work?",
                                            a: "Yes — after completing this course you are qualified for freelance Excel projects. The Celoris EARN section even lists daily freelance opportunities for Excel professionals."
                                        },
                                        {
                                            q: "How do I book the free demo?",
                                            a: "Go to celoris.in/learn/be-an-excel-expert and click Book Free Demo. You will receive a WhatsApp confirmation within 2 hours with your session details."
                                        }
                                    ].map((faq, i) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="border-white/10 bg-white/5 px-8 rounded-[2rem] overflow-hidden">
                                            <AccordionTrigger className="text-left text-white font-black py-8 hover:no-underline text-xl">{faq.q}</AccordionTrigger>
                                            <AccordionContent className="text-slate-400 pb-8 text-lg leading-relaxed">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>

                            <div className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Conclusion</h2>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    Learning Excel in 2026 is not optional for Indian professionals — it is the baseline skill that every employer expects and every career requires.
                                </p>
                                <p className="text-lg leading-relaxed mb-12">
                                    The good news is that you no longer need to spend thousands to learn Excel properly. The best Excel training available in India is now available with a free demo on Celoris. <span className="text-emerald-400 font-black">Book your free demo today and learn from India's top-rated trainer.</span>
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Free Excel Course', 'Online Excel India', 'Job Ready Skills', 'Dheeraj Kushwaha', 'Excel 2026', 'Corporate Skills'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky CTA */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest px-8 py-6 rounded-full shadow-2xl shadow-emerald-500/40 border-4 border-black/20" asChild>
                    <Link href="/learn/be-an-excel-expert">Book Free Demo</Link>
                </Button>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    Celoris Designs LLP | Incorporated 23rd May 2019 | Ministry of Corporate Affairs, India
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
