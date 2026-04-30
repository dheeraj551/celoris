import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Smartphone, Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee,
    Search, Layout, Share2, Users, Wand2, Phone, TrendingUp
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Microsoft Excel Training in Noida (2026) — Complete Guide | Celoris',
    description: 'Looking for the best Microsoft Excel training in Noida in 2026? This guide covers top courses, fees, curriculum, and how to choose the right trainer. Includes free demo offer.',
    keywords: 'excel training in noida, microsoft excel course noida, excel classes noida, excel trainer noida, excel training fees noida',
};

export default function ExcelBlogNoida() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/excel-noida.png")'
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
                                Excel Training • Noida • Career Skills
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl">
                            Best Microsoft Excel Training in Noida (2026) — <span className="text-emerald-400 italic block mt-2">Complete Guide</span>
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
                                <span className="text-sm uppercase tracking-widest text-slate-200">April 30, 2026</span>
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
                                Excel is one of the most in-demand skills in Noida's job market. From IT companies in Sector 62 to finance firms in Sector 18, almost every employer expects candidates to know Excel at some level. But with so many training options available — from local institutes to online platforms — how do you choose the right one?
                            </p>
                            <p>
                                This guide covers everything you need to know about finding the best Microsoft Excel training in Noida — including what to look for, what to avoid, how much it should cost, and what a good curriculum looks like.
                            </p>

                            <div className="my-16 bg-emerald-500/10 border-l-8 border-emerald-500 p-8 md:p-12 rounded-r-3xl shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-emerald-400 text-xl font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info className="h-6 w-6" /> Quick Answer
                                    </h3>
                                    <p className="text-xl md:text-2xl text-slate-100 font-bold leading-relaxed mb-6">
                                        If you want expert-led, flexible Excel training in Noida with home visit options and a free demo — check out Celoris.
                                    </p>
                                    <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-full px-8 py-6" asChild>
                                        <Link href="/microsoft-excel-training-noida">View Excel Courses</Link>
                                    </Button>
                                    <p className="mt-4 text-sm text-slate-400">Prices start at ₹2,500 for the Basic course.</p>
                                </div>
                                <Zap className="absolute top-1/2 right-10 -translate-y-1/2 h-40 w-40 text-emerald-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            </div>

                            <section className="mt-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Why Excel Skills Matter in Noida's Job Market</h2>
                                <p>
                                    Noida has one of the densest concentrations of IT companies, BPOs, and MNCs in India. Sectors 62, 63, 125, and the Expressway belt are home to companies like HCL, Wipro, Adobe, Samsung, and hundreds of mid-size firms — all of which require Excel as a baseline skill for their operations, finance, HR, and marketing teams.
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 my-10">
                                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Market Data Insights
                                    </h4>
                                    <ul className="space-y-4 list-none p-0 m-0">
                                        {[
                                            "Over 70% of job postings in Noida's finance and operations roles list Excel as a required skill",
                                            "MIS Executive roles — a very common job title in Noida — are almost entirely Excel-based",
                                            "Even digital marketing roles now require Excel for reporting, ad performance analysis, and budget tracking",
                                            "Freelancers and small business owners in Noida increasingly need Excel for inventory, billing, and GST tracking"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
                                                <span className="text-slate-300 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p>
                                    Whether you are a fresher from Amity, GLA, or Sharda University, or a working professional looking to move up, Excel is a skill that pays off fast.
                                </p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">What Level of Excel Training Do You Need?</h2>
                                <p className="mb-12">Before you join any course, it helps to know which level is right for you. Here is a simple breakdown:</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[
                                        {
                                            title: "Basic Excel",
                                            level: "Beginner",
                                            target: "Students, freshers, homemakers",
                                            topics: ["Formulas (SUM, IF)", "Formatting", "Sorting/Filtering", "Basic Charts"],
                                            duration: "2–4 weeks",
                                            fees: "₹1,500–3,000"
                                        },
                                        {
                                            title: "Advanced Excel",
                                            level: "Intermediate",
                                            target: "Working professionals",
                                            topics: ["VLOOKUP/XLOOKUP", "Pivot Tables", "Dashboards", "Power Query"],
                                            duration: "4–8 weeks",
                                            fees: "₹3,000–6,000"
                                        },
                                        {
                                            title: "Excel with VBA",
                                            level: "Expert",
                                            target: "MIS Executives, Analysts",
                                            topics: ["Macros", "VBA Programming", "Automation", "Error Handling"],
                                            duration: "6–10 weeks",
                                            fees: "₹6,000–10,000"
                                        }
                                    ].map((plan, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-emerald-500/50 transition-all group">
                                            <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                                                {plan.level}
                                            </div>
                                            <h3 className="text-2xl font-black text-white mb-2">{plan.title}</h3>
                                            <p className="text-xs text-slate-400 mb-6 font-bold italic">Best for: {plan.target}</p>
                                            <ul className="space-y-2 list-none p-0 mb-8">
                                                {plan.topics.map((topic, j) => (
                                                    <li key={j} className="text-sm text-slate-300 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                        {topic}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="pt-6 border-t border-white/5">
                                                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                                    <span className="text-slate-500">Duration</span>
                                                    <span className="text-emerald-500">{plan.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Comprehensive Curriculum — What You Will Learn</h2>
                                <p>Our Excel training is designed to be 100% practical. We don't just teach you what a button does; we teach you how to use it to solve a business problem. Here is a sneak peek at the modules:</p>
                                
                                <div className="space-y-6 mt-12">
                                    {[
                                        {
                                            module: "Module 1: Data Foundations & Formatting",
                                            topics: "Understanding cell references, custom formatting, data cleaning (Trim, Clean, Proper), and using basic logic (SUM, AVERAGE, COUNT)."
                                        },
                                        {
                                            module: "Module 2: Advanced Logical Formulas",
                                            topics: "Deep dive into IF, IFS, AND, OR, and Nested IF functions. Creating complex decision-making models."
                                        },
                                        {
                                            module: "Module 3: The Power of Lookups (VLOOKUP, XLOOKUP)",
                                            topics: "Mastering VLOOKUP, HLOOKUP, INDEX-MATCH, and the new XLOOKUP. Handling errors with IFERROR."
                                        },
                                        {
                                            module: "Module 4: Data Visualization & Pivot Tables",
                                            topics: "Creating Pivot Tables from scratch, Slicers, Timeline, Pivot Charts, and building interactive Executive Dashboards."
                                        },
                                        {
                                            module: "Module 5: Data Automation with Power Query",
                                            topics: "Importing data from multiple sources, merging tables, and automating the cleaning process without writing a single line of code."
                                        },
                                        {
                                            module: "Module 6: Intro to Macros & VBA (Optional)",
                                            topics: "Recording macros, understanding the VBA editor, and automating repetitive daily reports."
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
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">How Excel Empowers Different Roles in Noida</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                                        <h4 className="text-emerald-400 font-bold mb-4">For IT & BPO Professionals</h4>
                                        <p className="text-sm text-slate-400">Noida's massive BPO sector relies on MIS reports. Excel helps you automate performance tracking, shift rosters, and client billing, making you indispensable to your team.</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                                        <h4 className="text-emerald-400 font-bold mb-4">For Finance & CA Students</h4>
                                        <p className="text-sm text-slate-400">Noida is a hub for audit firms. Mastering Pivot Tables and financial modeling in Excel is the difference between working 12 hours a day and working 6 hours a day.</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                                        <h4 className="text-emerald-400 font-bold mb-4">For Marketing & HR Teams</h4>
                                        <p className="text-sm text-slate-400">Manage recruitment pipelines, track ad performance (ROAS), and create beautiful monthly presentations for stakeholders using Excel's data visualization tools.</p>
                                    </div>
                                    <div className="p-8 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
                                        <h4 className="text-emerald-400 font-bold mb-4">For Freshers & Job Seekers</h4>
                                        <p className="text-sm text-slate-400">If you are a student from Amity or Sharda University, a 'Verified Excel Expert' tag on your resume can increase your chances of landing an interview by 3x.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white flex items-center gap-4 text-balance">
                                    <Layout className="h-10 w-10 text-emerald-500 shrink-0" />
                                    Why Choose Celoris Over Others?
                                </h2>
                                <p>We don't just teach Excel; we build careers. Our trainers are active industry consultants who bring real-life datasets into the classroom. You won't be practicing on 'Sample Data'; you will be working on actual business scenarios that you will encounter in your job.</p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Excel Training Fees in Noida — 2026 Price Guide</h2>
                                <p>One of the biggest pain points students face is unclear pricing. Many institutes in Noida will not tell you fees until you visit — and then pressure you to pay on the spot. At Celoris, we believe in transparent pricing upfront.</p>
                                
                                <div className="overflow-x-auto my-12 rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Plan</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Price</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Duration</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Key Topics</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { plan: "Basic Excel", price: "₹2,500", duration: "4 Weeks", topics: "Formulas, Formatting, VLOOKUP, Charts" },
                                                { plan: "Advanced Excel", price: "₹4,999", duration: "8 Weeks", topics: "Pivot Tables, Dashboards, MIS, Power Query" },
                                                { plan: "Mastery (VBA)", price: "₹8,000", duration: "8 Weeks", topics: "Macros, VBA, Automation, Adv Dashboards" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.plan}</td>
                                                    <td className="p-6 font-black text-emerald-400">{row.price}</td>
                                                    <td className="p-6 text-slate-400">{row.duration}</td>
                                                    <td className="p-6 text-slate-400">{row.topics}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl">
                                    <p className="text-slate-200 font-bold mb-4">All plans include:</p>
                                    <div className="flex flex-wrap gap-6">
                                        {["10+ practice files", "Celoris completion certificate", "Lifetime WhatsApp support"].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-400">
                                                <Check className="h-4 w-4 text-emerald-500" /> {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">How to Choose the Right Excel Trainer in Noida</h2>
                                <p>With dozens of options available — from Aptech and NIIT to individual tutors and platforms like UrbanPro — choosing the right training can feel overwhelming. Here are the five things that actually matter:</p>
                                
                                <div className="space-y-12 mt-12">
                                    {[
                                        {
                                            title: "1. Check the Trainer's Real-World Experience",
                                            desc: "A trainer who only teaches theory without real corporate experience will leave you unprepared for actual job requirements. Ask if they have worked as a data analyst, MIS executive, or finance professional. At Celoris, our Excel trainers have 13+ years of hands-on experience."
                                        },
                                        {
                                            title: "2. Demand a Free Demo Before Paying",
                                            desc: "Any serious trainer or platform should offer a free demo session. This lets you evaluate the trainer's teaching style, clarity, and pace. If a trainer refuses a demo, that is a red flag. Celoris offers a free 30-minute demo."
                                        },
                                        {
                                            title: "3. Confirm the Mode of Training",
                                            desc: "Noida is big — commuting from Noida Extension to Sector 18 is not always practical. Look for trainers who offer home visits or online sessions. Celoris trainers come to your home across Noida, Greater Noida West, and Ghaziabad."
                                        },
                                        {
                                            title: "4. Ask About Batch Size",
                                            desc: "Large batches (20–30 students) mean you will not get individual attention. The best learning happens in 1-on-1 or very small groups. Celoris caps group batches at 5 students maximum."
                                        },
                                        {
                                            title: "5. Verify What You Get After the Course",
                                            desc: "Check if you get: practice files to keep, a certificate, and ongoing support. Celoris provides all three — including lifetime WhatsApp support even after course completion."
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
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Celoris vs Other Options in Noida</h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Feature</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Celoris</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Local Institute</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">UrbanPro</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { f: "Transparent Pricing", c: "✅ Yes", l: "❌ Often Hidden", u: "❌ Coin System" },
                                                { f: "Home Visit Option", c: "✅ Yes", l: "❌ No", u: "✅ Some Tutors" },
                                                { f: "1-on-1 Batches", c: "✅ Available", l: "❌ Group Only", u: "✅ Some Tutors" },
                                                { f: "Free Demo Class", c: "✅ Yes", l: "❌ Rarely", u: "❌ No" },
                                                { f: "Lifetime Support", c: "✅ WhatsApp", l: "❌ No", u: "❌ No" },
                                                { f: "Verified Trainers", c: "✅ Yes", l: "✅ Yes", u: "⚠️ Mixed" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.f}</td>
                                                    <td className="p-6 text-emerald-400 font-bold">{row.c}</td>
                                                    <td className="p-6 text-slate-500">{row.l}</td>
                                                    <td className="p-6 text-slate-500">{row.u}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Areas We Cover for Excel Training in Noida</h2>
                                <p>Celoris trainers are available for home-visit sessions across the entire Noida and Greater Noida region:</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">Noida City</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Sector 18, 22, 27, 37, 44, 50, 56, 62, 63, 76, 77, 93, 100, 120, 125, 135, 137</p>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">Greater Noida West</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Gaur City, Supertech Eco Village, Amrapali Silicon City, Ajnara Homes</p>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">Greater Noida</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Knowledge Park I–V, Alpha I & II, Beta I & II, Gamma, Delta, Omega, Chi, Phi, Mu, Xu</p>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                        <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">Nearby Areas</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">Indirapuram, Vaishali, Vasundhara, Crossings Republik — Ghaziabad</p>
                                    </div>
                                </div>
                                <p className="italic text-emerald-400 font-bold">Online sessions are available for students anywhere in India.</p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Excel Jobs You Can Get After This Training</h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Job Role</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Avg Salary</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Skills Needed</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { r: "MIS Executive", s: "₹2.5L – ₹5L", k: "Advanced + Macros" },
                                                { r: "Data Analyst", s: "₹3.5L – ₹7L", k: "Advanced + Power Query" },
                                                { r: "Operations Analyst", s: "₹3L – ₹6L", k: "Advanced + Dashboards" },
                                                { r: "Finance Executive", s: "₹2.5L – ₹5L", k: "Intermediate to Advanced" },
                                                { r: "Digital Marketing Analyst", s: "₹2.5L", k: "Intermediate" },
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.r}</td>
                                                    <td className="p-6 text-emerald-400 font-black">{row.s}</td>
                                                    <td className="p-6 text-slate-400">{row.k}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="mt-32">
                                <h2 className="text-3xl md:text-5xl font-black mb-12 text-white flex items-center gap-4">
                                    <HelpCircle className="h-10 w-10 text-emerald-500" /> Frequently Asked Questions
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    <AccordionItem value="item-1" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Is Excel training worth it in 2026?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes, absolutely. While newer tools like Power BI and Python are growing, Excel remains the universal language of business data in India. Even companies using Power BI still use Excel for data prep and quick analysis. Learning Excel is not just useful — it is essential.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Can I learn Excel in 1 month?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            You can learn Basic to Intermediate Excel comfortably in 4 weeks with regular sessions (3–4 days a week, 1 hour each). Advanced Excel with Pivot Tables and Dashboards takes 6–8 weeks. VBA and Macros typically require 8–10 weeks total from scratch.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Which Excel course is best for job seekers in Noida?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            For freshers targeting MIS or data roles, the Advanced Excel course (covering Pivot Tables, VLOOKUP, Dashboards) is the most job-relevant. For finance roles, add the Macros/VBA module. For marketing or HR roles, Intermediate Excel is sufficient.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Can I get a home tutor for Excel in Noida?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes. Celoris trainers offer home-visit sessions across Noida, Greater Noida, and Ghaziabad. You can also opt for online sessions. WhatsApp +91 90847 18101 to check trainer availability in your area.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Does Celoris provide a certificate?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes. All students who complete the course and clear the practical assessment receive a Celoris Course Completion Certificate. This can be added to your LinkedIn profile and resume.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            <section className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts</h2>
                                <p className="text-lg leading-relaxed mb-10">
                                    If you are serious about building Excel skills that actually help you get a job or perform better at work, here is the honest answer: skip the large batch institutes, avoid platforms where you cannot verify your trainer, and do not pay without a free demo first.
                                </p>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-16 text-center">
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Book Your FREE Demo Today</h3>
                                    <p className="text-slate-400 mb-10 text-lg">Talk to an expert trainer with 13+ years of experience. No commitment required.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                            <Link href="https://wa.me/919084718101">
                                                <Phone className="h-6 w-6 mr-3" /> WhatsApp Demo
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl w-full sm:w-auto" asChild>
                                            <Link href="/microsoft-excel-training-noida">Course Details</Link>
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-lg leading-relaxed mb-6 font-medium text-slate-200">
                                    The best Excel training in Noida is one that offers flexible timings, a verified experienced trainer, practical project-based learning, and support after the course ends — not just during it.
                                </p>
                                <p className="text-lg leading-relaxed italic text-emerald-400 font-black">
                                    Celoris ticks all of these boxes. Start your journey today.
                                </p>
                            </section>
                        </div>

                        {/* Internal Links & Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-emerald-500" /> Related Articles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {[
                                    { t: "Best Digital Marketing Course in Noida", l: "/blog/digital-marketing-course-noida" },
                                    { t: "Microsoft Excel Training in Gurgaon", l: "/microsoft-excel-training-gurgaon" },
                                    { t: "How to Learn Python for Data Analysis", l: "/blog/python-training-noida" },
                                    { t: "All Trainers in Noida", l: "/learn?location=noida" }
                                ].map((link, i) => (
                                    <Link key={i} href={link.l} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{link.t}</span>
                                        <ArrowRight className="h-4 w-4 text-emerald-500 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                                {['excel training in noida', 'microsoft excel course noida', 'excel classes noida', 'excel trainer noida', 'excel training fees noida', 'MIS training noida', 'advanced excel noida'].map((tag) => (
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
