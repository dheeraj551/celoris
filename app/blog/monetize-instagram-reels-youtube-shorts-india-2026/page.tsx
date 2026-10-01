import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Calendar, Clock, Tag, Check, X,
    Laptop, Play, Info, HelpCircle,
    ArrowRight, Star, Shield, Zap, IndianRupee, BookOpen, GraduationCap, Users, TrendingUp, Briefcase,
    ExternalLink, Sparkles, CheckCircle2, AlertTriangle, FileText, BarChart3, Target,
    Smartphone, MessageSquare, ShoppingBag, Award
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ShareButtons from '@/components/ShareButtons';
import BlogEngagement from '@/components/blog/BlogEngagement';

export const metadata: Metadata = {
    title: "How to Monetize Instagram Reels & YouTube Shorts in India (2026–2027) | Celoris",
    description: "Master short-form video monetization, comment-to-DM automation, creator platform fees, and ASCI/GST compliance in India to reach ₹50,000+ monthly revenue.",
    keywords: [
        'Monetize Instagram Reels and YouTube Shorts India',
        'Instagram Reels monetization India',
        'YouTube Shorts RPM India',
        'comment to DM automation',
        'Topmate alternatives Peerseek Kreato MintLink',
        'ASCI influencer guidelines 2025 2026',
        'influencer GST code 16021',
        'make money from reels India',
        'short form video masterclass celoris'
    ],
    alternates: {
        canonical: '/blog/monetize-instagram-reels-youtube-shorts-india-2026',
    },
    openGraph: {
        title: "How to Monetize Instagram Reels & YouTube Shorts in India (2026–2027) | Celoris",
        description: "Comprehensive blueprint to reach ₹50,000+/mo from short-form video in India: RPMs, comment-to-DM automation, platform fee comparison, and tax/ASCI compliance.",
        images: ['/instgramreel.png'],
        type: 'article',
        publishedTime: '2026-10-01T10:00:00Z',
        authors: ['Celoris Creator Lab'],
    },
    twitter: {
        card: 'summary_large_image',
        title: "How to Monetize Instagram Reels & YouTube Shorts in India (2026–2027)",
        description: "Master short-form video monetization, comment-to-DM automation, creator platform fees, and ASCI/GST compliance in India to reach ₹50,000+ monthly revenue.",
        images: ['/instgramreel.png'],
    }
};

const jsonLdData = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Article",
            "headline": "How to Monetize Instagram Reels & YouTube Shorts in India (2026–2027)",
            "description": "Master short-form video monetization, comment-to-DM automation, creator platform fees, and ASCI/GST compliance in India to reach ₹50,000+ monthly revenue.",
            "image": "https://www.celorisdesigns.com/instgramreel.png",
            "datePublished": "2026-10-01T10:00:00Z",
            "dateModified": "2026-10-01T10:00:00Z",
            "author": {
                "@type": "Organization",
                "name": "Celoris Creator Lab",
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
                "@id": "https://www.celorisdesigns.com/blog/monetize-instagram-reels-youtube-shorts-india-2026"
            }
        },
        {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "How many followers are required to monetize Instagram in India?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Gifts on Reels require 500+ followers, Subscriptions require 10,000+ followers, and Creator Marketplace brand deals are accessible at 1,000+ followers. Off-platform monetization (selling digital products via comment-to-DM funnels) has 0 minimum follower requirements."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Does Instagram pay creators directly per 1,000 Reels views in India?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "No. Instagram does not provide direct view-based ad payouts in India (Reels Play Bonus is inactive). Income is generated through Gifts, Subscriptions, brand deals, and comment-to-DM sales funnels."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What are the ASCI disclosure rules for finance and health influencers in India?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Under Addendum II of ASCI guidelines, financial advice requires upfront SEBI registration disclosures. Health claims require accredited medical/nutrition qualifications. All sponsored content must display upfront labels like #Ad, #Sponsored, or #Partnership (#collab alone is invalid)."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Which creator storefront has the lowest platform fees in India?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Playto offers 0% commission and $0/mo pricing. Peerseek charges a 0% platform fee with a flat 5% transaction fee. Kreato charges a flat 5% with Razorpay UPI. MintLink charges 5% above ₹10 (flat ₹1 below ₹10). In contrast, Topmate charges 10% direct / 20% marketplace fees."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why is comment-to-DM automation superior to Link in Bio for converting sales?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Link-in-bio achieves a 1% CTR because viewers dislike leaving their feed. Comment-to-DM automation delivers links directly to inboxes in under 1 second via Meta Graph API, achieving a 46% CTR, 90%+ open rates, and boosting algorithm reach through high comment volume."
                    }
                }
            ]
        }
    ]
};

export default function MonetizeReelsShortsBlog() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Inject JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
            />

            {/* Hero Section */}
            <div className="relative min-h-[620px] w-full overflow-hidden flex flex-col justify-end">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
                    style={{
                        backgroundImage: 'url("/instgramreel.png")',
                    }}
                />
                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/85 to-black/60" />

                <div className="container relative z-10 pb-16 pt-32 text-white px-4 mx-auto max-w-5xl">
                    <Button
                        variant="ghost"
                        className="text-white w-fit mb-8 hover:bg-white/10 group bg-black/40 backdrop-blur-md border border-white/15 rounded-full pr-6"
                        asChild
                    >
                        <Link href="/blog">
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Insights
                        </Link>
                    </Button>

                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/40 backdrop-blur-md">
                                Creator Economy · 2026 Playbook
                            </span>
                            <span className="bg-amber-500/20 text-amber-300 px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-amber-500/40 backdrop-blur-md">
                                Monetization
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-3.5 w-3.5 text-emerald-400" /> 16 MIN READ
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-6 leading-[1.12] tracking-tight text-white drop-shadow-2xl">
                            How to Monetize Instagram Reels &amp; YouTube Shorts in India{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 block mt-2">
                                (2026–2027 Blueprint)
                            </span>
                        </h1>

                        <p className="text-slate-300 text-base sm:text-xl font-medium leading-relaxed mb-8 max-w-3xl">
                            The definitive operational guide to going beyond low AdSense payouts. Master comment-to-DM automation, platform fee matrices, stacked monetization, and ASCI/GST compliance to build a predictable ₹50,000+/month creator business.
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-slate-400 border-t border-white/10 pt-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white font-black text-lg border-2 border-white/20 shadow-lg">
                                    C
                                </div>
                                <div>
                                    <p className="font-bold text-white tracking-tight text-base leading-none mb-1">Celoris Creator Lab</p>
                                    <p className="text-[11px] uppercase font-bold tracking-[0.15em] text-emerald-400">Research &amp; Strategy</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 font-medium bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 text-xs">
                                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="uppercase tracking-wider text-slate-300">Updated October 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container py-16 px-4 relative mx-auto max-w-5xl">
                {/* Decorative background glows */}
                <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px] -z-10 pointer-events-none" />
                <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] -z-10 pointer-events-none" />

                <div className="max-w-4xl mx-auto space-y-12">
                    
                    {/* 🤖 AIO Overview & Direct Answer Box */}
                    <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c1527] to-[#070c18] border-2 border-emerald-500/30 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -z-0" />
                        <div className="flex items-center gap-3 mb-4 text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold">
                            <Sparkles className="h-4 w-4" />
                            <span>AI Overview &amp; Direct Answer Summary (Key Takeaways)</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                            How do creators actually monetize short-form video in India in 2026–2027?
                        </h3>
                        <div className="space-y-3.5 text-sm sm:text-base text-slate-300 leading-relaxed">
                            <div className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">1</span>
                                <div><strong className="text-white">YouTube Shorts Payouts:</strong> YouTube pools ad revenue and shares 45% with eligible creators. India Shorts RPM ranges from <strong className="text-emerald-300">₹2 to ₹60 ($0.01 to $0.10) per 1,000 views</strong>, highest in finance, tech, and skill-building.</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">2</span>
                                <div><strong className="text-white">Instagram Reels Payouts:</strong> Instagram offers <strong className="text-rose-300">zero direct view-based ad payouts</strong> in India (Reels Play Bonus is inactive). Indian creators monetize via Gifts ($0.01/Star), Subscriptions, Creator Marketplace brand deals, and Comment-to-DM storefront funnels.</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">3</span>
                                <div><strong className="text-white">Comment-to-DM Automation:</strong> Replacing static &quot;Link in Bio&quot; (1% CTR) with Meta Graph API automation tools (ReplyKaro, ManyChat, FlowGent) delivers <strong className="text-emerald-300">46% link CTR, 90%+ open rates</strong>, and a 156% surge in comment volume that triggers algorithmic viral distribution.</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">4</span>
                                <div><strong className="text-white">Creator Storefront Fees:</strong> Platforms like <strong className="text-white">Playto</strong> ($0/mo, 0% commission), <strong className="text-white">Peerseek</strong> (0% platform fee, 5% transaction), <strong className="text-white">Kreato</strong> (flat 5%, auto-GST, Razorpay UPI), and <strong className="text-white">MintLink</strong> (₹1 on &le;₹10 items) dramatically beat Topmate&apos;s 10%–20% fee for selling digital templates, calls, and cohorts.</div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 mt-0.5">5</span>
                                <div><strong className="text-white">Tax &amp; ASCI Compliance:</strong> Earnings must be filed under ITR Code <strong className="text-white">16021</strong>. Free gifts &gt;₹20,000/year trigger 10% TDS under Sec 194R. GST is mandatory above ₹20L turnover. ASCI mandates explicit <strong className="text-white">#Ad</strong> or <strong className="text-white">#Sponsored</strong> labels (<code>#collab</code> alone is non-compliant) and SEBI credentials for finance creators.</div>
                            </div>
                        </div>
                    </div>

                    {/* Table of Contents */}
                    <div className="bg-[#0a0f1d] rounded-2xl p-6 border border-white/10">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" /> Table of Contents
                        </h2>
                        <nav className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-300">
                            {[
                                { title: "1. The Reality: YouTube Shorts vs. Instagram Reels", id: "reality" },
                                { title: "2. Niche Segmentation & RPM Dynamics (Math to ₹50k)", id: "rpm-dynamics" },
                                { title: "3. The High-Converting Comment-to-DM Funnel", id: "comment-to-dm" },
                                { title: "4. Storefront Fee Matrix (Peerseek, Kreato, Playto, Topmate)", id: "storefront-fees" },
                                { title: "5. Affiliate Marketing & E-Commerce Integration", id: "affiliate-marketing" },
                                { title: "6. Algorithmic Mechanics: The 70% Retention Benchmark", id: "algorithmic-mechanics" },
                                { title: "7. Tax, Regulatory & ASCI Compliance Framework", id: "compliance" },
                                { title: "8. 90-Day Operational Roadmap to ₹50,000/Month", id: "roadmap" },
                                { title: "9. Frequently Asked Questions (FAQ)", id: "faqs" },
                            ].map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className="hover:text-emerald-400 hover:underline flex items-center gap-2 py-1 transition-colors"
                                >
                                    <span className="text-emerald-500 font-mono text-xs">→</span> {item.title}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Section 1 */}
                    <section id="reality" className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                            Section 01
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            The Short-Form Video Monetization Reality in India
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            The vertical video ecosystem in India reaches over <strong>362.9 million active users</strong>. However, a structural economic divide exists between algorithmic reach and direct platform payouts. Creators relying solely on native platform view payouts face an uphill battle: achieving ₹50,000 per month purely through ad-revenue sharing requires millions of impressions.
                        </p>

                        <div className="bg-[#0b1324] border border-slate-800 rounded-2xl p-6 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto">
                            <pre className="text-emerald-400 font-semibold mb-2">THE 3-TIER MONETIZATION ARCHITECTURE:</pre>
                            <code>{`[Short-Form Video Attention Engine] (YouTube Shorts / Instagram Reels)
               │
               ▼ (Meta Graph API / Webhooks)
[Automated Comment-to-DM Funnel] (Keyword triggers: "GUIDE", "TAX", "BUY")
               │
               ▼ (Direct UPI / Razorpay)
[High-Margin Storefront] (Digital Products, Cohorts, 1:1 Calls, Affiliate)`}</code>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="bg-[#0a0f1d] border border-red-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center font-bold">YT</div>
                                    <h3 className="text-lg font-bold text-white">YouTube Shorts (YPP)</h3>
                                </div>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    <li>• <strong>Model:</strong> Pooled ad-revenue sharing (45% distributed to creators based on view share).</li>
                                    <li>• <strong>YPP Ad Qualification:</strong> 1,000 subscribers + 10 million public Shorts views in 90 days.</li>
                                    <li>• <strong>Fan-Funding Tier:</strong> 500 subscribers + 3M views unlocks Super Thanks &amp; Memberships.</li>
                                    <li>• <strong>India RPM:</strong> ₹2 to ₹60 per 1,000 views depending on niche and advertiser bid.</li>
                                </ul>
                            </div>

                            <div className="bg-[#0a0f1d] border border-pink-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center font-bold">IG</div>
                                    <h3 className="text-lg font-bold text-white">Instagram Reels (Meta)</h3>
                                </div>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    <li>• <strong>Direct View Payout:</strong> <span className="text-rose-400 font-bold">NONE</span> in India (Reels Play Bonus is currently inactive).</li>
                                    <li>• <strong>Gifts on Reels:</strong> Unlocks at 500+ followers ($0.01 / ~₹0.85 per Star received).</li>
                                    <li>• <strong>Subscriptions:</strong> 10k+ followers for recurring monthly fan badges ($0.99 to $99.99).</li>
                                    <li>• <strong>Real Profit Vector:</strong> Creator Marketplace brand deals and comment-to-DM storefront funnels.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/10 mt-6">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="bg-[#11192e] text-slate-200 font-mono text-xs uppercase">
                                    <tr>
                                        <th className="p-4">Platform Parameter</th>
                                        <th className="p-4">YouTube Shorts (India)</th>
                                        <th className="p-4">Instagram Reels (India)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 bg-[#0a0f1d]">
                                    <tr>
                                        <td className="p-4 font-bold text-white">Primary Monetization Vector</td>
                                        <td className="p-4">Pooled Feed Ad Share (45% split)</td>
                                        <td className="p-4">Brand Deals, DM Automations, Products</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-white">Minimum Eligibility Threshold</td>
                                        <td className="p-4">500 Subs / 3M Views (Fan) · 1k / 10M (Ads)</td>
                                        <td className="p-4">500 Followers (Gifts) · 10k (Subscriptions)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-white">Direct RPM Range (India)</td>
                                        <td className="p-4 text-emerald-400 font-mono font-bold">₹2 to ₹60 per 1,000 views</td>
                                        <td className="p-4 text-rose-400 font-mono font-bold">No direct view payout</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 font-bold text-white">Out-of-Box Fan Tools</td>
                                        <td className="p-4">Super Thanks, Memberships, Shopping</td>
                                        <td className="p-4">Gifts ($0.01/Star), Subscriptions</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section id="rpm-dynamics" className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                            Section 02
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Niche Segmentation &amp; Revenue Per Mille (RPM) Dynamics
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            On YouTube Shorts, RPM represents your gross earnings per 1,000 views after YouTube&apos;s 45% revenue cut. RPM in India is strictly governed by commercial intent—advertisers bid top dollar when your viewers have purchasing power and high financial intent.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { niche: "Finance & Stock Market", rpm: "₹20 – ₹60 RPM", highlight: "Premium", color: "border-emerald-500/40 text-emerald-400", desc: "Banking, credit cards, mutual funds, trading apps" },
                                { niche: "Tech & Gadget Reviews", rpm: "₹15 – ₹40 RPM", highlight: "High", color: "border-cyan-500/40 text-cyan-400", desc: "Smartphone launches, SaaS tools, AI productivity software" },
                                { niche: "Education & Upskilling", rpm: "₹12 – ₹30 RPM", highlight: "High", color: "border-blue-500/40 text-blue-400", desc: "EdTech, government exams, coding & digital marketing" },
                                { niche: "Culinary & Lifestyle", rpm: "₹8 – ₹20 RPM", highlight: "Moderate", color: "border-amber-500/40 text-amber-400", desc: "Kitchen appliances, FMCG groceries, recipe books" },
                                { niche: "Comedy & Entertainment", rpm: "₹5 – ₹15 RPM", highlight: "Low Yield", color: "border-purple-500/40 text-purple-400", desc: "Huge view volume, but lower buyer commercial intent" },
                                { niche: "Gaming & Mobile Esports", rpm: "₹2 – ₹8 RPM", highlight: "Lowest Yield", color: "border-slate-700 text-slate-400", desc: "Young audience, heavy view volume required" },
                            ].map((item, i) => (
                                <div key={i} className={`bg-[#0a0f1d] border ${item.color} rounded-2xl p-5 shadow-lg`}>
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-bold text-white text-sm">{item.niche}</h3>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 uppercase font-bold">{item.highlight}</span>
                                    </div>
                                    <div className="text-xl font-black font-mono my-2 text-white">{item.rpm}</div>
                                    <p className="text-xs text-slate-400 leading-snug">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl p-6 bg-gradient-to-r from-slate-900 to-[#0e1629] border border-emerald-500/30">
                            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                <IndianRupee className="w-5 h-5 text-emerald-400" /> Mathematical Breakdown: Reaching ₹50,000/Month
                            </h3>
                            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                                Relying purely on ad views to make ₹50,000 is a trap. In a lifestyle niche at ₹15 RPM, you need <strong>3.33 million views</strong>. In gaming at ₹5 RPM, you need <strong>10 million views</strong> every single month. Smart creators deploy the <strong>Stacked Monetization Model</strong>:
                            </p>
                            <div className="p-3 bg-black/40 rounded-xl font-mono text-xs sm:text-sm text-emerald-300 text-center mb-6">
                                Total Revenue = Ad Share + Brand Deals + Affiliate Commissions + Digital Products / Services
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                                    <thead className="bg-[#050810] text-slate-400 font-mono uppercase">
                                        <tr>
                                            <th className="p-3">Creator Profile</th>
                                            <th className="p-3">Monthly Views</th>
                                            <th className="p-3">Revenue Stack</th>
                                            <th className="p-3 text-emerald-400 font-bold">Monthly Net</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 bg-[#0a0f1d]">
                                        <tr>
                                            <td className="p-3 font-bold text-white">High-Volume Generalist</td>
                                            <td className="p-3">8M Views (Shorts)</td>
                                            <td className="p-3">Ad Share (₹32k) + 2x Micro Deals (₹18k)</td>
                                            <td className="p-3 font-mono font-bold text-emerald-400">₹50,000</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-bold text-white">Niche Micro-Influencer</td>
                                            <td className="p-3">500k Views (15k Followers)</td>
                                            <td className="p-3">2x Deals (₹25k) + 30 Ebooks @ ₹499 (₹15k) + Affiliate (₹10k)</td>
                                            <td className="p-3 font-mono font-bold text-emerald-400">₹50,000</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-bold text-white">Product &amp; Consultation Engine</td>
                                            <td className="p-3">150k Views (5k Followers)</td>
                                            <td className="p-3">60 Templates @ ₹599 (₹36k) + 10 Calls @ ₹1,499 (₹15k)</td>
                                            <td className="p-3 font-mono font-bold text-emerald-400">₹51,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section id="comment-to-dm" className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                            Section 03
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            The High-Converting Comment-to-DM Automation Funnel
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            The traditional call-to-action &quot;Link in Bio&quot; is practically dead. Asking viewers to leave their addictive video feed, tap your profile, and open an external browser achieves a miserable <strong>1% Click-Through Rate (CTR)</strong>.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#140b0f] border border-rose-500/30 rounded-2xl p-6">
                                <div className="text-rose-400 font-mono text-xs uppercase font-bold mb-2">Old Way (1% CTR)</div>
                                <h3 className="text-white font-bold text-lg mb-3">Link-in-Bio Funnel</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    Reel Impression → Open Profile → Click Bio Link → In-App Browser → 99% Bounce Rate.
                                </p>
                                <span className="inline-block px-3 py-1 bg-rose-500/20 text-rose-300 text-xs rounded-full font-mono">
                                    High friction · Low intent
                                </span>
                            </div>

                            <div className="bg-[#0b1a17] border border-emerald-500/30 rounded-2xl p-6">
                                <div className="text-emerald-400 font-mono text-xs uppercase font-bold mb-2">Modern 2026 Way (46% CTR)</div>
                                <h3 className="text-white font-bold text-lg mb-3">Comment-to-DM Automation</h3>
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    Reel CTA (&quot;Comment TAX&quot;) → Meta Graph API Webhook &lt;1s → Instant DM link to inbox → Direct UPI Checkout.
                                </p>
                                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full font-mono font-bold">
                                    90%+ Open Rate · 46% Click-Through
                                </span>
                            </div>
                        </div>

                        <div className="bg-[#0a0f1d] rounded-2xl p-6 border border-white/10 space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-400" /> How It Supercharges the Instagram Algorithm
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Deploying tools like <strong>ReplyKaro</strong>, <strong>ManyChat</strong>, or <strong>FlowGent</strong> does two massive things simultaneously:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <strong className="text-emerald-400 block mb-1">1. Sub-Second DM Delivery</strong>
                                    Meta Graph API webhooks detect the comment and dispatch your checkout link in <strong>0.4 to 1.0 seconds</strong>, capturing peak impulse intent.
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <strong className="text-cyan-400 block mb-1">2. 156% Higher Comments</strong>
                                    HypeAuditor research reveals that comment-driven reels receive <strong>156% more comments</strong>. Instagram interprets this massive comment surge as viral interest, pushing your Reel to non-followers.
                                </div>
                            </div>
                            <p className="text-xs text-slate-400 font-mono pt-2">
                                Pro-Tip: Use localized Hinglish triggers like <code className="text-amber-300">BHEJO</code>, <code className="text-amber-300">DEDO</code>, or <code className="text-amber-300">PRICE BATAO</code> to maximize responses from Indian audiences.
                            </p>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section id="storefront-fees" className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                            Section 04
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Indian Creator Platform Fees &amp; Storefront Comparison (2026 Matrix)
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            Selling digital downloads (PDF guides, templates, presets) or booking 1:1 calls requires an Indian-friendly checkout with instant UPI, Razorpay integration, and automated GST invoices. Choosing the wrong platform can quietly cost you 10%–25% of your gross earnings in hidden commissions.
                        </p>

                        <div className="overflow-x-auto rounded-2xl border border-white/10">
                            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                                <thead className="bg-[#11192e] text-slate-200 font-mono uppercase">
                                    <tr>
                                        <th className="p-3.5">Storefront Platform</th>
                                        <th className="p-3.5">Platform Fee</th>
                                        <th className="p-3.5">Monthly Cost</th>
                                        <th className="p-3.5">Onboarding Fee</th>
                                        <th className="p-3.5 text-emerald-400 font-bold">Retention on ₹1,00,000</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 bg-[#0a0f1d]">
                                    <tr className="bg-emerald-500/5">
                                        <td className="p-3.5 font-bold text-white">Playto</td>
                                        <td className="p-3.5 font-mono text-emerald-400">0% Commission</td>
                                        <td className="p-3.5 font-mono">$0 / month</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5 font-mono font-bold text-emerald-300">~₹97,000 – ₹1,00,000</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">Peerseek</td>
                                        <td className="p-3.5 font-mono text-emerald-400">0% (Flat 5% Txn)</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5 font-mono font-bold text-emerald-400">~₹95,000</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">Kreato</td>
                                        <td className="p-3.5 font-mono">Flat 5% (incl UPI)</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5 font-mono font-bold text-emerald-400">~₹95,000</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">MintLink</td>
                                        <td className="p-3.5 font-mono">Flat 5% (&gt;₹10) · ₹1 (&le;₹10)</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5 font-mono font-bold text-emerald-400">~₹92,000 – ₹95,000</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">SuperProfile (Creator)</td>
                                        <td className="p-3.5 font-mono">5% + GST (~5.9%)</td>
                                        <td className="p-3.5">₹499 / mo</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5 font-mono text-slate-300">~₹93,600</td>
                                    </tr>
                                    <tr className="bg-rose-500/5">
                                        <td className="p-3.5 font-bold text-white">Topmate</td>
                                        <td className="p-3.5 font-mono text-rose-400 font-bold">10% Direct / 20% Mkt</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5">None</td>
                                        <td className="p-3.5 font-mono text-rose-300 font-bold">~₹87,100</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3.5 font-bold text-white">TagMango</td>
                                        <td className="p-3.5 font-mono">10% Take Rate</td>
                                        <td className="p-3.5">Varies</td>
                                        <td className="p-3.5">Optional</td>
                                        <td className="p-3.5 font-mono text-slate-300">Variable by volume</td>
                                    </tr>
                                    <tr className="bg-rose-500/5">
                                        <td className="p-3.5 font-bold text-white">Graphy (India)</td>
                                        <td className="p-3.5 font-mono text-rose-400">10% Rev Share</td>
                                        <td className="p-3.5">₹1,999 – ₹8,400/mo</td>
                                        <td className="p-3.5 font-mono font-bold text-rose-400">₹19,999</td>
                                        <td className="p-3.5 font-mono text-rose-300">&lt; ₹80,000 (after fixed fees)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* 🔥 Feature CTA Card 1: Short-Form Video Masterclass */}
                    <div className="rounded-3xl p-8 bg-gradient-to-r from-emerald-950 via-[#0d1e1c] to-slate-900 border-2 border-emerald-500/50 shadow-2xl relative overflow-hidden my-12">
                        <div className="max-w-2xl relative z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/30">
                                🚀 Flagship Creator Masterclass
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                                Want to Master Short-Form Video Production &amp; Monetization Live?
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                                Join the <strong>10-Hour Live Short-Form Video Masterclass</strong> in Celoris Classrooms. Learn hands-on how to script 1.5-second viral hooks, film cinematic 4K video on your smartphone, edit retention pacing in CapCut, and close your first ₹5,000–₹25,000 brand sponsorship with battle-tested rate cards and pitch templates.
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button
                                    asChild
                                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-6 rounded-xl shadow-lg transition-all"
                                >
                                    <Link href="/learn/course/master-youtube-shorts-instagram-reels">
                                        Explore the 10-Hour Masterclass <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" /> Includes ₹12,500 Creator Bonus Pack
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section 5 */}
                    <section id="affiliate-marketing" className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                            Section 05
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Affiliate Marketing Networks &amp; E-Commerce Integration
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            With the Indian e-commerce market surging past <strong>$350 billion</strong>, affiliate marketing allows creators to monetize product recommendations without holding inventory or handling shipping customer service.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6">
                                <div className="text-emerald-400 font-mono text-xs font-bold uppercase mb-2">#1 Sub-Affiliate Network</div>
                                <h3 className="text-white font-bold text-lg mb-2">EarnKaro</h3>
                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                                    Backed by Ratan Tata. Connects with 200+ top Indian retailers (Flipkart, Myntra, Nykaa, Ajio, Axis Bank). Features an industry-lowest <strong>₹10 withdrawal threshold</strong> directly as real cash to your bank account.
                                </p>
                            </div>

                            <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6">
                                <div className="text-cyan-400 font-mono text-xs font-bold uppercase mb-2">Direct Brand Programs</div>
                                <h3 className="text-white font-bold text-lg mb-2">D2C Brand Programs</h3>
                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                                    Hosted on Impact.com or GoAffPro by brands like Mamaearth, boAt, and Sugar Cosmetics. Pays significantly higher commissions (<strong>10% to 25%</strong>) than Amazon&apos;s standard 1%–5%.
                                </p>
                            </div>

                            <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6">
                                <div className="text-purple-400 font-mono text-xs font-bold uppercase mb-2">AI-Powered Tracking</div>
                                <h3 className="text-white font-bold text-lg mb-2">Saara AI (EcoAgents)</h3>
                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                                    Autonomous AI agents that research trending products, track multi-program affiliate earnings, and aggregate financial data for accurate TDS reporting.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section id="algorithmic-mechanics" className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                            Section 06
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Algorithmic Mechanics: The 70% Retention Benchmark
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            YouTube Shorts processes more than <strong>200 billion daily views</strong>. Both Shorts and Reels use sequential seed testing: when you publish, your video is shown to an initial seed audience of 1,000 to 3,000 viewers.
                        </p>

                        <div className="bg-[#0c1527] border border-cyan-500/30 rounded-2xl p-6 space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-cyan-400" /> The Golden Metrics of 2026:
                            </h3>
                            <div className="space-y-3 text-sm text-slate-300">
                                <div>• <strong className="text-white">The 3-Second Hook Rule:</strong> 65% of viewers decide whether to watch or swipe in the first 3 seconds. If your <strong>Swipe-Away Rate exceeds 30%</strong>, algorithmic distribution immediately stalls.</div>
                                <div>• <strong className="text-white">The 70% APV Threshold:</strong> Videos under 60 seconds must maintain an <strong>Average Percentage Viewed (APV) &gt;70%</strong> (&gt;100% for videos under 30s) to transition from seed testing into the global feed.</div>
                                <div>• <strong className="text-white">The 2-Second Cut Rule:</strong> Introduce visual variation (angle switch, zoom punch, b-roll clip, or caption highlight) every <strong>1.5 to 2.5 seconds</strong> to prevent subconscious drop-off.</div>
                                <div>• <strong className="text-white">Seamless Loop Pacing:</strong> Connect your closing sentence directly into your opening hook so the video loops smoothly without viewer drop.</div>
                            </div>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section id="compliance" className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                            Section 07
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Tax, Regulatory &amp; ASCI Compliance Framework for Indian Creators
                        </h2>
                        <p className="text-slate-300 text-lg leading-relaxed">
                            As digital creator earnings grow, regulatory enforcement by the CBDT, GST Council, and ASCI has intensified. Operating without compliance exposes creators to severe financial penalties.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 space-y-3">
                                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                                    <Shield className="w-4 h-4" /> Income Tax &amp; GST
                                </div>
                                <h3 className="text-white font-bold text-base">ITR Code 16021 &amp; GST Thresholds</h3>
                                <ul className="text-xs sm:text-sm text-slate-300 space-y-2">
                                    <li>• <strong>ITR Activity Code 16021:</strong> Specific classification for social media influencers and creators. Enables legal deduction of operational expenses (cameras, lights, phones, software).</li>
                                    <li>• <strong>Section 194R TDS (10%):</strong> Free gifts, smartphones, or barter perks exceeding ₹20,000/year trigger 10% TDS (exempt if returned after filming per CBDT Circular 12/2022).</li>
                                    <li>• <strong>GST Mandate:</strong> Registration is mandatory once aggregate turnover exceeds <strong>₹20 Lakhs</strong> (₹10 Lakhs in special category states).</li>
                                    <li>• <strong>Zero-Rated Exports:</strong> International ad payouts (e.g., Google AdSense from foreign entities) qualify as zero-rated exports if an annual Letter of Undertaking (LUT) is filed.</li>
                                </ul>
                            </div>

                            <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 space-y-3">
                                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                                    <AlertTriangle className="w-4 h-4" /> ASCI Guidelines (Addendum II)
                                </div>
                                <h3 className="text-white font-bold text-base">Disclosure Norms &amp; Legal Credentials</h3>
                                <ul className="text-xs sm:text-sm text-slate-300 space-y-2">
                                    <li>• <strong>Mandatory Upfront Labels:</strong> Sponsored posts must display <code className="text-amber-300">#Ad</code>, <code className="text-amber-300">#Sponsored</code>, <code className="text-amber-300">#Partnership</code>, or <code className="text-amber-300">#Free gift</code> in the first 3 seconds.</li>
                                    <li>• <strong>Invalid Tag Warning:</strong> Using <code className="text-rose-400 line-through">#collab</code> or <code className="text-rose-400 line-through">#spotted</code> alone is <strong className="text-rose-300">legally non-compliant</strong> under ASCI rules.</li>
                                    <li>• <strong>SEBI Finance Mandate:</strong> Influencers giving stock or investment advice <strong>must hold SEBI registration</strong> and disclose their registration number on-screen.</li>
                                    <li>• <strong>Medical Credentials:</strong> Medical or nutrition health claims require certified medical degrees (MBBS, registered dietician).</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section id="roadmap" className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                            Section 08
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                            Step-by-Step 90-Day Operational Roadmap to ₹50,000/Month
                        </h2>

                        <div className="space-y-4">
                            <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-emerald-500/30">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-white">Phase 1 (Days 1–15): Infrastructure &amp; Product Setup</h3>
                                    <span className="text-xs font-mono px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full font-bold">FOUNDATION</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                                    Switch personal accounts to Instagram Professional and YouTube Creator status. Create one focused, high-utility digital product priced at ₹299–₹499 (e.g. personal tax spreadsheet, resume template, or niche checklist). Launch a storefront on <strong>Playto</strong> or <strong>Peerseek</strong> with Razorpay UPI.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-cyan-500/30">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-white">Phase 2 (Days 16–30): Funnel Automation &amp; Production</h3>
                                    <span className="text-xs font-mono px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full font-bold">AUTOMATION</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                                    Connect your Meta Graph API tool (ReplyKaro or ManyChat) and configure comment triggers (e.g. &quot;GUIDE&quot;, &quot;TAX&quot;, &quot;BHEJO&quot;). Batch-film 10 videos structured strictly around the 3-second hook rule and 70% retention pacing.
                                </p>
                            </div>

                            <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-purple-500/30">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-white">Phase 3 (Days 31–90): Commercial Scaling &amp; Compliance</h3>
                                    <span className="text-xs font-mono px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full font-bold">SCALE</span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                                    Publish 15–20 high-retention vertical videos monthly across YouTube Shorts and Instagram Reels simultaneously. Once videos hit 10k+ views consistently, pitch regional D2C brands for ₹5,000–₹15,000 sponsored integrations. Track all revenues under ITR Code 16021.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* 🔥 Feature CTA Card 2: Digital Marketing Mastery Batch #43 */}
                    <div className="rounded-3xl p-8 bg-gradient-to-r from-slate-900 via-[#131b31] to-[#0b1022] border-2 border-amber-500/40 shadow-2xl relative overflow-hidden my-12">
                        <div className="max-w-2xl relative z-10">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/30">
                                ⚡ Live Cohort Launching Tonight
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                                Digital Marketing Mastery — Batch #43 Starts Tonight at 8:00 PM IST
                            </h3>
                            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                                Want to run real ad campaigns, master Meta &amp; Google Ads, and learn how to generate qualified leads and high-converting sales funnels? Batch #43 is live tonight with only <strong>5 seats left out of 15</strong>.
                            </p>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button
                                    asChild
                                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-6 rounded-xl shadow-lg transition-all"
                                >
                                    <Link href="/learn/course/digital-marketing-mastery">
                                        Join Batch #43 (5 Seats Left) <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                                <span className="text-xs text-amber-300 font-mono flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4" /> Next cohort starts 11th Oct 2026
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Section 9: FAQ */}
                    <section id="faqs" className="space-y-6 pt-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3.5 py-1 rounded-full">
                            Section 09
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
                            <HelpCircle className="w-8 h-8 text-emerald-400" /> Frequently Asked Questions
                        </h2>

                        <Accordion type="single" collapsible className="w-full space-y-4">
                            <AccordionItem value="item-1" className="border border-white/10 bg-[#0a0f1d] rounded-2xl px-6 py-2">
                                <AccordionTrigger className="text-left font-bold text-white hover:text-emerald-400 text-base sm:text-lg">
                                    How many followers are required to monetize Instagram in India?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
                                    Gifts on Reels require <strong>500+ followers</strong>, Subscriptions require <strong>10,000+ followers</strong>, and Creator Marketplace brand deals are accessible at <strong>1,000+ followers</strong>. However, off-platform monetization—selling your own digital products, consultations, or presets via comment-to-DM funnels—has <strong>zero minimum follower requirement</strong>.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2" className="border border-white/10 bg-[#0a0f1d] rounded-2xl px-6 py-2">
                                <AccordionTrigger className="text-left font-bold text-white hover:text-emerald-400 text-base sm:text-lg">
                                    Does Instagram pay creators directly per 1,000 Reels views in India?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
                                    No. Instagram provides <strong>no direct view-based ad payouts</strong> in India because the Reels Play Bonus program is inactive. Income is generated through Gifts ($0.01/Star), Subscriptions, brand partnerships, and comment-to-DM sales funnels. On YouTube Shorts, in contrast, RPM ranges from <strong>₹2 to ₹60 per 1,000 views</strong>.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3" className="border border-white/10 bg-[#0a0f1d] rounded-2xl px-6 py-2">
                                <AccordionTrigger className="text-left font-bold text-white hover:text-emerald-400 text-base sm:text-lg">
                                    What are the ASCI disclosure rules for finance and health influencers in India?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
                                    Under Addendum II of ASCI guidelines, financial creators making investment or wealth claims <strong>must be SEBI-registered</strong> and display their SEBI registration number upfront on-screen. Health and nutrition advice requires formal medical or dietician credentials. All commercial posts must feature prominent visual labels (<code className="text-amber-300">#Ad</code>, <code className="text-amber-300">#Sponsored</code>, or <code className="text-amber-300">#Partnership</code>). Using <code>#collab</code> alone is legally invalid.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-4" className="border border-white/10 bg-[#0a0f1d] rounded-2xl px-6 py-2">
                                <AccordionTrigger className="text-left font-bold text-white hover:text-emerald-400 text-base sm:text-lg">
                                    Which creator storefront has the lowest platform fees in India?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
                                    <strong>Playto</strong> offers 0% commission and $0/mo pricing. <strong>Peerseek</strong> charges a 0% platform fee with a flat 5% transaction fee. <strong>Kreato</strong> charges a flat 5% with Razorpay UPI and auto-GST invoices. <strong>MintLink</strong> charges 5% above ₹10 (flat ₹1 below ₹10). In contrast, <strong>Topmate</strong> charges 10% direct / 20% marketplace fees plus payment processing, and <strong>SuperProfile</strong> charges ₹499/mo + 5% + GST.
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-5" className="border border-white/10 bg-[#0a0f1d] rounded-2xl px-6 py-2">
                                <AccordionTrigger className="text-left font-bold text-white hover:text-emerald-400 text-base sm:text-lg">
                                    Why is comment-to-DM automation superior to Link in Bio?
                                </AccordionTrigger>
                                <AccordionContent className="text-slate-300 text-sm sm:text-base leading-relaxed pt-2">
                                    Link-in-bio achieves a 1% CTR because viewers resist exiting their video feeds. Automated comment-to-DM tools (ReplyKaro, ManyChat, FlowGent) use Meta Graph API webhooks to send links directly to inboxes in <strong>under 1 second</strong>, driving a <strong>46% CTR</strong>, <strong>90%+ open rates</strong>, and <strong>156% higher comment engagement</strong> that triggers the algorithm to push the video to wider audiences.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </section>

                    {/* Share & Feedback */}
                    <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <ShareButtons
                            title="How to Monetize Instagram Reels & YouTube Shorts in India (2026–2027)"
                            slug="monetize-instagram-reels-youtube-shorts-india-2026"
                        />
                        <BlogEngagement slug="monetize-instagram-reels-youtube-shorts-india-2026" />
                    </div>

                </div>
            </div>
        </div>
    );
}
