import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee, BookOpen, GraduationCap, Users, TrendingUp, Briefcase
} from "lucide-react";

export const metadata: Metadata = {
    title: "Excel Formulas Every Working Professional Must Know in 2026 | Celoris",
    description: "From Basic Lookups to Dynamic Arrays — Practical Excel for India's Workforce. Master VLOOKUP, XLOOKUP, Pivot Tables and more with Celoris.",
    keywords: ['Excel formulas 2026', 'VLOOKUP vs XLOOKUP', 'Excel training India', 'Pivot Tables guide', 'Excel for MIS reports'],
    openGraph: {
        title: "Excel Formulas Every Working Professional Must Know in 2026 | Celoris",
        description: "Master the most important Excel formulas and features that will genuinely change how you work in 2026.",
        images: ['/blog-excel-formulas-2026.png'],
        type: 'article',
    },
};

export default function ExcelBlogPage() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-excel-formulas-2026.png")'
                    }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-[#050810] via-[#050810]/60 to-transparent" />

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
                                Excel Training
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 15 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl">
                            Excel Formulas Every <span className="text-emerald-400">Working Professional</span> Must Know in 2026
                        </h1>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Blog</p>
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
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:p-8 prose-blockquote:rounded-3xl
                        ">
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg">
                                    "Whether you are a fresh graduate applying for your first job, an accountant managing monthly MIS reports, or a business owner tracking sales data — Microsoft Excel remains the single most in-demand software skill in India's job market."
                                </p>
                            </div>

                            <p>
                                Yet most people use barely 10% of what Excel can actually do. This guide covers the most important Excel formulas and features that will genuinely change how you work — no fluff, no theory-only content. Just real formulas you will use on real data.
                            </p>

                            <blockquote>
                                **💡 Pro Tip:** Every formula in this blog works in Excel 2016, Excel 2019, Microsoft 365, and Google Sheets (unless noted). Screenshots available in our live Excel course on <Link href="/">celoris.in</Link>.
                            </blockquote>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <span className="bg-emerald-500 text-black w-12 h-12 flex items-center justify-center rounded-2xl text-2xl">1</span>
                                VLOOKUP vs XLOOKUP
                            </h2>
                            <p>
                                If you have been in any office environment in India, you have definitely heard someone say <em>"bas VLOOKUP aata hai mujhe"</em> as if that is the ultimate Excel flex. And while VLOOKUP is still useful, XLOOKUP has replaced it for good reason.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                    <h4 className="text-white font-black mb-4 flex items-center gap-3">
                                        <Briefcase className="h-5 w-5 text-emerald-500" />
                                        VLOOKUP — The Old Reliable
                                    </h4>
                                    <p className="text-slate-400 text-sm mb-4">Search for a value in the leftmost column and return data from a column to the right.</p>
                                    <code className="block bg-black/50 p-4 rounded-xl text-emerald-400 text-xs break-all">
                                        =VLOOKUP(lookup_value, table_array, col_index, [range])
                                    </code>
                                </div>
                                <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
                                    <h4 className="text-white font-black mb-4 flex items-center gap-3">
                                        <Zap className="h-5 w-5 text-yellow-500" />
                                        XLOOKUP — The Modern Standard
                                    </h4>
                                    <p className="text-slate-400 text-sm mb-4">Fixes all VLOOKUP problems. Can look left, won't break on column inserts.</p>
                                    <code className="block bg-black/50 p-4 rounded-xl text-emerald-400 text-xs break-all">
                                        =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])
                                    </code>
                                </div>
                            </div>

                            <p>
                                **✅ Recommendation:** If you are on Microsoft 365, learn XLOOKUP as your primary lookup function. Still learn VLOOKUP for compatibility with older Excel files and colleagues who use older versions.
                            </p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <span className="bg-emerald-500 text-black w-12 h-12 flex items-center justify-center rounded-2xl text-2xl">2</span>
                                IF, IFS, and Nested IF
                            </h2>
                            <p>
                                The IF formula lets your spreadsheet make decisions automatically based on data.
                            </p>
                            <div className="bg-gradient-to-r from-emerald-500/10 to-transparent p-8 rounded-3xl border border-emerald-500/20 my-8">
                                <h4 className="text-white font-bold mb-4">Example: Automate Status</h4>
                                <code className="block bg-black/50 p-4 rounded-xl text-emerald-400 mb-4 whitespace-pre-wrap">
                                    =IF(B2&gt;=40, "Pass", "Fail")
                                </code>
                                <p className="text-sm text-slate-400">For multiple grades (A, B, C, D), use <strong>IFS</strong> for much cleaner code:</p>
                                <code className="block bg-black/50 p-4 rounded-xl text-emerald-400 mt-4 whitespace-pre-wrap">
                                    =IFS(B2&gt;=90,"A", B2&gt;=75,"B", B2&gt;=60,"C", B2&gt;=40,"D", TRUE,"Fail")
                                </code>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4">
                                <span className="bg-emerald-500 text-black w-12 h-12 flex items-center justify-center rounded-2xl text-2xl">3</span>
                                Conditional Calculations
                            </h2>
                            <p>
                                <strong>SUMIF, COUNTIF, AVERAGEIF</strong> are game-changers. Instead of calculating totals for your entire dataset, you calculate only for rows that meet a specific condition.
                            </p>
                            <div className="bg-[#12182b] p-8 rounded-[2rem] border border-white/5 my-12">
                                <ul className="space-y-6 list-none p-0">
                                    <li className="flex gap-4">
                                        <Check className="h-6 w-6 text-emerald-500 shrink-0" />
                                        <div>
                                            <strong className="text-white">SUMIF:</strong> Add only matching rows (e.g., Sales from Delhi: <code>=SUMIF(B:B, "Delhi", D:D)</code>)
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <Check className="h-6 w-6 text-emerald-500 shrink-0" />
                                        <div>
                                            <strong className="text-white">COUNTIF:</strong> Count matching rows (e.g., Transactions &gt; ₹10,000: <code>=COUNTIF(D:D, "&gt;10000")</code>)
                                        </div>
                                    </li>
                                    <li className="flex gap-4">
                                        <Check className="h-6 w-6 text-emerald-500 shrink-0" />
                                        <div>
                                            <strong className="text-white">SUMIFS:</strong> The upgraded version for multiple criteria (Delhi + March sales).
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white flex items-center gap-4">
                                <span className="bg-emerald-500 text-black w-12 h-12 flex items-center justify-center rounded-2xl text-2xl">4</span>
                                TEXT Functions & Cleaning
                            </h2>
                            <p>
                                Real-world data is always messy. Names have extra spaces, dates are in wrong formats. Excel's text functions allow you to fix everything instantly.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
                                {[
                                    { f: "TRIM", desc: "Removes extra spaces" },
                                    { f: "PROPER", desc: "Converts 'rAHUL' to 'Rahul'" },
                                    { f: "TEXTJOIN", desc: "Joins cells with separator" },
                                    { f: "TEXT", desc: "Formats dates/numbers as text" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col">
                                        <code className="text-emerald-400 font-bold mb-1">={item.f}()</code>
                                        <span className="text-xs text-slate-500">{item.desc}</span>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white flex items-center gap-4">
                                <TrendingUp className="h-10 w-10 text-emerald-500" />
                                Pivot Tables: Data Analysis Superpower
                            </h2>
                            <p>
                                A Pivot Table lets you instantly summarize thousands of rows of data into a compact, meaningful report — with <strong>zero formulas</strong>.
                            </p>
                            <div className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 p-10 rounded-[3rem] border border-white/10 my-12">
                                <h4 className="text-white font-black mb-6">How to Create (Step-by-Step):</h4>
                                <ol className="space-y-4 text-slate-300">
                                    <li>1. Click anywhere inside your data table</li>
                                    <li>2. Go to <strong>Insert → PivotTable</strong></li>
                                    <li>3. Drag fields into <strong>Rows</strong>, <strong>Columns</strong>, and <strong>Values</strong></li>
                                    <li>4. Change Value Field Settings to SUM, COUNT, or AVERAGE</li>
                                </ol>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white flex items-center gap-4">
                                <Zap className="h-10 w-10 text-yellow-500" />
                                Dynamic Arrays (Next-Gen Excel)
                            </h2>
                            <p>
                                Available in Microsoft 365, these functions "spill" results into multiple cells automatically.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 mb-12">
                                <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <strong className="text-white block mb-2">=FILTER()</strong>
                                    <span className="text-sm text-slate-400">Returns only rows matching a condition dynamically.</span>
                                </li>
                                <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <strong className="text-white block mb-2">=UNIQUE()</strong>
                                    <span className="text-sm text-slate-400">Extracts a unique list of values from a column.</span>
                                </li>
                            </ul>

                            <h2 className="text-3xl md:text-5xl font-black mt-32 mb-10 text-white flex items-center gap-4">
                                <Star className="h-10 w-10 text-emerald-500" />
                                Essential Shortcuts
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-12">
                                {[
                                    { k: "Ctrl+Shift+L", d: "Filter" },
                                    { k: "Ctrl+T", d: "Table" },
                                    { k: "Alt + =", d: "AutoSum" },
                                    { k: "F4", d: "Repeat" },
                                    { k: "Ctrl+1", d: "Format" },
                                    { k: "Ctrl+;", d: "Date" },
                                    { k: "Ctrl+D", d: "Fill Down" },
                                    { k: "Ctrl+Pgdwn", d: "Sheets" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-black/40 p-4 rounded-xl border border-white/5 text-center">
                                        <p className="text-emerald-400 font-bold text-xs mb-1">{item.k}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-black">{item.d}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-40 bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] text-center">
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Master Excel in 2026</h2>
                                <p className="text-slate-400 mb-12 text-lg max-w-2xl mx-auto">
                                    Don't just use Excel — master it. Join our live batches and learn from verified trainers with real-world datasets.
                                </p>
                                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" asChild>
                                    <Link href="/learn/be-an-excel-expert">Book Free Demo Today</Link>
                                </Button>
                            </div>
                        </div>

                        {/* Footer / Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <div className="flex flex-wrap gap-3">
                                <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                                {['Excel Formulas', 'XLOOKUP Guide', 'Pivot Tables', 'MIS Reporting', 'Celoris Training', 'India Jobs'].map((tag) => (
                                    <span key={tag} className="bg-white/5 text-slate-400 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-12 text-center text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase">
                                Published by Celoris — India's Skill Learning Marketplace
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4">
                    © {new Date().getFullYear()} Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
