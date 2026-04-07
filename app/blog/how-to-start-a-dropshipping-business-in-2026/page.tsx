'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Zap, ListChecks, HelpCircle,
    ArrowRight, Star, Shield, Info,
    BookOpen, GraduationCap, Timer, AlertCircle,
    Layout, Database, PenTool, Box, Smartphone,
    Share2, Megaphone, Sparkles, TrendingUp, Users, Heart,
    Search, Home, Layers, MousePointer2, Settings, Download, Monitor,
    ShoppingCart, Truck, Globe, MessageSquare, IndianRupee, PieChart
} from "lucide-react";

export default function DropshippingBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/blog-dropshipping-guide-2026.png")'
                    }}
                />
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
                                Business • E-Commerce
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 15 MIN READ
                            </span>
                            <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Comprehensive Guide
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-4 leading-[1.1] tracking-tighter text-white drop-shadow-2xl italic uppercase">
                            How to Start a Dropshipping <span className="text-emerald-400">Business in 2026</span>
                        </h1>
                        <h2 className="text-2xl md:text-4xl font-bold text-white/90 mb-8 leading-tight">
                            A Complete Step-by-Step Guide for Beginners
                        </h2>
                        <div className="flex flex-wrap items-center gap-8 text-slate-400">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/20 shadow-2xl">
                                    C
                                </div>
                                <div>
                                    <p className="font-black text-white tracking-tight text-lg leading-none mb-1">Celoris Editorial</p>
                                    <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Insight</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 font-bold bg-white/5 px-4 py-2 rounded-full border border-white/5">
                                <Calendar className="h-4 w-4 text-emerald-500" />
                                <span className="text-sm uppercase tracking-widest text-slate-200">April 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-20 px-4 relative">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px] -z-10" />

                <div className="max-w-4xl mx-auto">
                    <article className="bg-[#0a0f1d] rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
                        <div className="prose prose-invert prose-emerald max-w-none 
                            prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                            prose-strong:text-emerald-400 prose-strong:font-bold
                            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                        ">
                            <div className="mb-16">
                                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic bg-emerald-500/10 border-l-8 border-emerald-500 p-8 rounded-r-3xl shadow-lg">
                                    "Dropshipping has gone from a niche side-hustle to a genuine full-time business model. In 2026, it is easier than ever to launch — you do not need a warehouse, you do not carry inventory, and you can start with a few thousand rupees."
                                </p>
                            </div>

                            <p>This guide walks you through everything: picking a niche, finding reliable suppliers, building a store, driving traffic, and scaling to your first lakh in revenue. Whether you are a college student, a working professional, or a trainer looking for a parallel income stream, this is your starting point.</p>

                            <p>Dropshipping is a retail fulfilment method where you sell products online without stocking them. When a customer places an order, you purchase the item from a third-party supplier who ships it directly to the customer. Your profit is the difference between what the customer paid and what you paid the supplier.</p>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Sparkles className="h-10 w-10 text-emerald-500" />
                                1. Understand How Dropshipping Works in 2026
                            </h2>
                            <p>The core model has not changed, but the landscape has evolved significantly. Here is what is different in 2026:</p>
                            <ul className="space-y-4 my-8 list-none p-0">
                                <li className="flex gap-4 items-start">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3 w-3 text-emerald-500" />
                                    </div>
                                    <span className="font-bold text-slate-200">AI-powered product research tools have replaced manual trend-spotting.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3 w-3 text-emerald-500" />
                                    </div>
                                    <span className="font-bold text-slate-200">Fast-shipping suppliers from India, UAE, and Europe now compete with Chinese suppliers on delivery speed.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3 w-3 text-emerald-500" />
                                    </div>
                                    <span className="font-bold text-slate-200">Social commerce (Instagram Shops, WhatsApp Catalogue) has become a primary sales channel alongside traditional Shopify or WooCommerce stores.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3 w-3 text-emerald-500" />
                                    </div>
                                    <span className="font-bold text-slate-200">Customers expect 3-7 day delivery even for imported products — slow shipping kills conversion rates.</span>
                                </li>
                                <li className="flex gap-4 items-start">
                                    <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-1">
                                        <Check className="h-3 w-3 text-emerald-500" />
                                    </div>
                                    <span className="font-bold text-slate-200">Payment gateways like Razorpay, Cashfree, and even UPI-based checkouts are fully mature for Indian dropshippers.</span>
                                </li>
                            </ul>

                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl my-12 text-center">
                                <p className="text-2xl font-black text-white italic mb-4 uppercase tracking-tighter">How Money Flows</p>
                                <p className="text-xl text-slate-300 font-bold italic">
                                    Customer pays you <span className="text-emerald-400">₹1,500</span> → You order from supplier at <span className="text-cyan-400">₹800</span> → Supplier ships to customer → You keep <span className="text-white font-black">₹700</span> minus advertising and platform fees.
                                </p>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Search className="h-10 w-10 text-emerald-500" />
                                2. Choose a Profitable Niche
                            </h2>
                            <p>This is the single most important decision. A wrong niche wastes months of effort. A great niche compounds your advantage over time. What Makes a Good Dropshipping Niche in 2026:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 transition-all hover:border-emerald-500/30">
                                    <Heart className="h-8 w-8 text-emerald-500 mb-4" />
                                    <h4 className="text-white font-black mb-2 uppercase italic">Passionate buyers</h4>
                                    <p className="text-sm text-slate-400 font-medium italic">People who spend money on their hobby or identity (fitness, pets, gaming, baby care).</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 transition-all hover:border-emerald-500/30">
                                    <TrendingUp className="h-8 w-8 text-emerald-500 mb-4" />
                                    <h4 className="text-white font-black mb-2 uppercase italic">Repeat purchases</h4>
                                    <p className="text-sm text-slate-400 font-medium italic">Consumables and accessories that customers keep buying over and over.</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 transition-all hover:border-emerald-500/30">
                                    <X className="h-8 w-8 text-emerald-500 mb-4" />
                                    <h4 className="text-white font-black mb-2 uppercase italic">Low returns</h4>
                                    <p className="text-sm text-slate-400 font-medium italic">Avoid fragile items, size-dependent clothing, or complex assembly products.</p>
                                </div>
                                <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 transition-all hover:border-emerald-500/30">
                                    <Box className="h-8 w-8 text-emerald-500 mb-4" />
                                    <h4 className="text-white font-black mb-2 uppercase italic">Room to brand</h4>
                                    <p className="text-sm text-slate-400 font-medium italic">Generic commodities are a price war. Find something you can put a story around.</p>
                                </div>
                            </div>

                            <h3 className="text-2xl font-black mt-12 mb-6 text-white uppercase italic tracking-tight">Hot Niches Right Now</h3>
                            <ul className="space-y-6 list-none p-0">
                                <li>
                                    <strong className="text-white text-xl block mb-2 uppercase italic tracking-tighter">Home Gym & Fitness:</strong>
                                    Resistance bands, yoga props, posture correctors, massage guns. Massive demand post-pandemic that has not cooled.
                                </li>
                                <li>
                                    <strong className="text-white text-xl block mb-2 uppercase italic tracking-tighter">Pet Care:</strong>
                                    India's pet ownership grew 30%+ in 5 years. Grooming tools, orthopedic beds, slow feeders — premium customers who spend freely.
                                </li>
                                <li>
                                    <strong className="text-white text-xl block mb-2 uppercase italic tracking-tighter">Smart Home Accessories:</strong>
                                    LED strips, cable management, desk organisation, mini projectors.
                                </li>
                                <li>
                                    <strong className="text-white text-xl block mb-2 uppercase italic tracking-tighter">Personal Finance Tools:</strong>
                                    Planners, habit trackers, journaling kits — digital-physical hybrids with strong Instagram appeal.
                                </li>
                                <li>
                                    <strong className="text-white text-xl block mb-2 uppercase italic tracking-tighter">Spiritual & Wellness:</strong>
                                    Crystal decor, incense, meditation tools — aspirational purchases with high margins.
                                </li>
                            </ul>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Truck className="h-10 w-10 text-emerald-500" />
                                3. Find Reliable Suppliers
                            </h2>
                            <p>Your supplier is your business partner. A bad supplier means late deliveries, wrong items, and refund nightmares.</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                                <div className="bg-emerald-500/5 p-8 rounded-[3rem] border border-emerald-500/10">
                                    <h4 className="text-emerald-400 font-black mb-6 uppercase tracking-widest italic">For Indian Dropshippers</h4>
                                    <ul className="space-y-4 text-slate-300 font-bold italic list-none p-0">
                                        <li>• <span className="text-white">IndiaMart</span>: Negotiate directly with manufacturers</li>
                                        <li>• <span className="text-white">Meesho</span>: Built for resellers, easy integration</li>
                                        <li>• <span className="text-white">GlowRoad / Shop101</span>: Dedicated fulfilment platforms</li>
                                        <li>• <span className="text-white">Baapstore</span>: Massive SKU range, highly reliable</li>
                                    </ul>
                                </div>
                                <div className="bg-cyan-500/5 p-8 rounded-[3rem] border border-cyan-500/10">
                                    <h4 className="text-cyan-400 font-black mb-6 uppercase tracking-widest italic">For Global Suppliers</h4>
                                    <ul className="space-y-4 text-slate-300 font-bold italic list-none p-0">
                                        <li>• <span className="text-white">AliExpress / DSers</span>: The classic cost-effective choice</li>
                                        <li>• <span className="text-white">Zendrop / AutoDS</span>: Premium networks, fast shipping</li>
                                        <li>• <span className="text-white">CJ Dropshipping</span>: Global warehouses, great integration</li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Layout className="h-10 w-10 text-emerald-500" />
                                4. Build Your Online Store
                            </h2>
                            <p>You do not need to be a developer. The tools available in 2026 make store creation accessible to anyone.</p>
                            <div className="space-y-8 my-12">
                                {[
                                    { platform: "Shopify", desc: "The gold standard. Best ecosystem and support. Plans start at $29/month." },
                                    { platform: "WooCommerce", desc: "Free on WordPress hosting. More control, slightly more technical." },
                                    { platform: "Dukaan / Instamojo", desc: "Indian-built. Razorpay native, no currency headaches. Ideal for India." },
                                    { platform: "Social Commerce", desc: "Insta Shopping + WhatsApp ordering. Zero cost, highly personal." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-6 p-8 bg-[#121a2e] rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all group">
                                        <div className="text-3xl font-black text-emerald-500/20 group-hover:text-emerald-500 transition-colors italic leading-none">{i+1}</div>
                                        <div>
                                            <h4 className="text-white font-black mb-2 uppercase italic tracking-tight">{item.platform}</h4>
                                            <p className="text-sm text-slate-400 font-medium italic mb-0 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter border-l-8 border-emerald-500 pl-8">
                                5. Drive Traffic to Your Store
                            </h2>
                            <p>A great store with no traffic is a shop in the desert. Traffic is where most beginners struggle.</p>

                            <div className="space-y-12 my-12">
                                <div>
                                    <h3 className="text-2xl font-black text-white italic uppercase mb-6 flex items-center gap-3">
                                        <Globe className="h-6 w-6 text-emerald-500" /> Organic (Free) Traffic
                                    </h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                        <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <strong className="text-white block mb-1">Instagram Reels & Shorts</strong>
                                            Post 5-7x per week showing problem and solution.
                                        </li>
                                        <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <strong className="text-white block mb-1">SEO Blog Content</strong>
                                            Write targetted articles. Takes time but compounds forever.
                                        </li>
                                        <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <strong className="text-white block mb-1">Pinterest</strong>
                                            High purchase intent, visual products convert extremely well.
                                        </li>
                                        <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <strong className="text-white block mb-1">WhatsApp Communities</strong>
                                            Be helpful first, then mention your store.
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-white italic uppercase mb-6 flex items-center gap-3">
                                        <Megaphone className="h-6 w-6 text-emerald-500" /> Paid Traffic
                                    </h3>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                                        <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <strong className="text-white block mb-1">Meta Ads</strong>
                                            The most powerful tool. Start with ₹500/day testing budget.
                                        </li>
                                        <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <strong className="text-white block mb-1">Google Shopping Ads</strong>
                                            Best for products with clear search intent. Higher conversion.
                                        </li>
                                        <li className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                            <strong className="text-white block mb-1">Influencer Marketing</strong>
                                            Micro-influencers often accept product for free in exchange for reach.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-black mt-24 mb-10 text-white flex items-center gap-4 italic uppercase tracking-tighter">
                                <Timer className="h-10 w-10 text-emerald-500" />
                                10. Realistic Timeline and Expectations
                            </h2>
                            <p>Here is an honest roadmap for a first-time dropshipper:</p>
                            <div className="overflow-x-auto my-8">
                                <table className="w-full border-collapse bg-white/5 rounded-2xl overflow-hidden border border-white/10">
                                    <thead>
                                        <tr className="bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-widest text-xs">
                                            <th className="p-4 text-left border-b border-white/10">Phase</th>
                                            <th className="p-4 text-left border-b border-white/10">Activities & Revenue</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium italic">
                                        <tr className="border-b border-white/5">
                                            <td className="p-4 text-white font-bold">Month 1</td>
                                            <td className="p-4 text-slate-400">Research, store build, first 5-10 orders from network.</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <td className="p-4 text-white font-bold">Month 2-3</td>
                                            <td className="p-4 text-slate-400">Testing ads, identifying winners. Revenue: ₹20k - ₹80k.</td>
                                        </tr>
                                        <tr className="border-b border-white/5">
                                            <td className="p-4 text-white font-bold">Month 4-6</td>
                                            <td className="p-4 text-slate-400">Scaling winners, building email list. Revenue: ₹1L - ₹3L.</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 text-white font-bold">Month 7-12</td>
                                            <td className="p-4 text-slate-400">Private labelling, VA onboarding. Revenue: ₹3L - ₹10L.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="my-24 p-12 rounded-[3.5rem] bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/5 text-center relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                                    <Settings className="h-40 w-40 text-white" />
                                </div>
                                <h3 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 relative z-10">Start Your Journey Today</h3>
                                <p className="text-lg text-slate-400 italic font-bold uppercase tracking-wider mb-12 relative z-10 max-w-2xl mx-auto">
                                    The barrier to entry is low. The barrier to staying is execution. Pick a niche, validate fast, and iterate faster.
                                </p>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 relative z-10">
                                    <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl px-12 h-16 shadow-2xl shadow-emerald-500/20 group/btn transition-all italic text-sm" asChild>
                                        <Link href="https://www.celoris.in" className="flex items-center gap-3">
                                            Explore Courses <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                    <Button size="lg" variant="outline" className="border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-[0.3em] rounded-2xl px-12 h-16 transition-all italic text-sm" asChild>
                                        <Link href="/blog">More Insights</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Footer tags */}
                        <div className="mt-16 pt-16 border-t border-white/10 flex flex-wrap gap-3">
                            <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                            {['Dropshipping 2026', 'E-commerce India', 'Passive Income', 'Start Business', 'Online Business', 'Shopify India', 'Celoris'].map((tag) => (
                                <span key={tag} className="bg-white/5 text-slate-500 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5 hover:border-emerald-500/30 hover:text-emerald-400 transition-all cursor-default italic">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </article>
                </div>
            </div>

            <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center mt-20">
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase mb-4 italic">
                    Published by Celoris | celoris.in | Skill-Based Learning
                </p>
                <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 uppercase italic">
                    © 2026 Celoris.in • All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
