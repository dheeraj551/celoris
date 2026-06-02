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
    title: 'Best Social Media Marketing Course in Noida (2026) — Complete Guide | Celoris',
    description: 'Looking for the best social media marketing course in Noida? This guide covers platforms, fees, scope, and how to choose the right training. Free demo available.',
    keywords: 'social media marketing course noida, smm course noida, social media training noida, instagram marketing course noida, facebook ads course noida',
};

export default function SocialMediaMarketingBlogNoida() {
    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative h-[600px] w-full overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                    style={{
                        backgroundImage: 'url("/digimarck.png")'
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
                                Social Media • Noida • Career Guide
                            </span>
                            <span className="text-slate-200 text-xs font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <Clock className="h-4 w-4 text-emerald-500" /> 8 MIN READ
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-white drop-shadow-2xl text-balance">
                            Best Social Media Marketing Course in Noida (2026) — <span className="text-emerald-400 italic block mt-2 text-balance">Complete Guide</span>
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
                                Social media is no longer just a place to post photos — it is where businesses in Noida acquire customers, where creators build income, and where careers in marketing begin. Every restaurant in Sector 18, every startup in the Expressway belt, every D2C brand shipping out of Greater Noida needs a social media presence — and most of them are doing it badly.
                            </p>
                            <p>
                                That gap between what businesses need and what they actually have is your opportunity. Learning social media marketing properly — not just how to post but how to grow, how to run ads, and how to measure results — positions you for one of the most in-demand roles in Noida's job market right now.
                            </p>

                            <div className="my-16 bg-emerald-500/10 border-l-8 border-emerald-500 p-8 md:p-12 rounded-r-3xl shadow-lg relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-emerald-400 text-xl font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Info className="h-6 w-6" /> Quick Answer
                                    </h3>
                                    <p className="text-xl md:text-2xl text-slate-100 font-bold leading-relaxed mb-6 text-balance">
                                        For practical social media marketing training in Noida covering Instagram, Facebook Ads, LinkedIn, YouTube, and AI tools — visit <Link href="/social-media-marketing-course-noida">celorisdesigns.com/social-media-marketing-course-noida</Link>.
                                    </p>
                                    <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest rounded-full px-8 py-6" asChild>
                                        <Link href="/social-media-marketing-course-noida">View SMM Course Noida</Link>
                                    </Button>
                                    <p className="mt-4 text-sm text-slate-400">Courses start at ₹2,500.</p>
                                </div>
                                <Zap className="absolute top-1/2 right-10 -translate-y-1/2 h-40 w-40 text-emerald-500/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            </div>

                            <section className="mt-20">
                                <h2 className="text-3xl md:text-5xl font-black mb-8 text-white">Why Social Media Marketing is One of the Best Career Choices in Noida in 2026</h2>
                                <p>
                                    Noida's business landscape has shifted dramatically toward digital-first. The combination of a massive startup ecosystem, thousands of SMEs, and a young population that lives on Instagram and YouTube creates extraordinary demand for social media skills.
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 my-10">
                                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-emerald-500" /> Market Scope in Noida
                                    </h4>
                                    <ul className="space-y-4 list-none p-0 m-0">
                                        {[
                                            "Social media manager is consistently one of the top 10 most-posted marketing jobs on Naukri and LinkedIn for Delhi NCR",
                                            "Every D2C brand, coaching institute, restaurant, and startup in Noida needs ongoing social media content and paid campaign management",
                                            "Freelance social media managers in Noida charge ₹8,000–25,000 per client per month for ongoing management",
                                            "Content creators with 10,000–50,000 engaged followers in NCR niches earn ₹30,000–80,000/month from brand deals",
                                            "AI tools have made content production faster — but strategy and ad optimization still require skilled humans"
                                        ].map((item, i) => (
                                            <li key={i} className="flex gap-4 items-start">
                                                <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-1" />
                                                <span className="text-slate-300 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p>
                                    The barrier to entry is lower than most IT skills — you do not need to code. But the ceiling is high — senior social media managers and paid social specialists at Noida's growing companies earn ₹6–12L per year.
                                </p>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Platform-by-Platform Guide — What to Focus on in Noida</h2>
                                
                                <div className="space-y-12">
                                    <div>
                                        <h3 className="text-white font-black text-2xl mb-4">Instagram — Highest organic opportunity for local businesses</h3>
                                        <p>
                                            Instagram remains the strongest platform for B2C brands, coaches, restaurants, fashion, and lifestyle businesses in Noida. The Reels format has democratized reach — even accounts with 500 followers can hit 50,000 views on a well-executed Reel. For anyone targeting Noida's consumer market, Instagram is the highest-priority platform to master.
                                        </p>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Key skills: Reels scripting and editing, hashtag strategy, Instagram Shopping, Stories for engagement, and Instagram Insights analysis.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-white font-black text-2xl mb-4">Facebook — Still powerful for local services and ads</h3>
                                        <p>
                                            Despite losing mindshare to Instagram among younger audiences, Facebook remains the most powerful advertising platform for local service businesses in Noida. If you are targeting working professionals aged 25–45 for courses, home services, or professional services — Facebook's targeting capabilities are unmatched. Facebook Groups are also resurging as high-engagement community platforms.
                                        </p>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Key skills: Facebook Page management, Meta Ads (Awareness to Conversion), WhatsApp message objective campaigns, and Facebook Groups.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-white font-black text-2xl mb-4">LinkedIn — Best for B2B and career growth in Noida's corporate belt</h3>
                                        <p>
                                            LinkedIn is underutilized by most Noida businesses but incredibly powerful for the right use cases. IT services companies, training providers, HR firms, and B2B brands targeting Noida's corporate corridor (Sector 62, 63, 125) should be active on LinkedIn. Personal brand building on LinkedIn is also one of the fastest paths to building authority in Noida's professional market.
                                        </p>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Key skills: LinkedIn content strategy, personal branding, Company Page management, LinkedIn Ads basics, and lead generation using Sales Navigator.</p>
                                    </div>

                                    <div>
                                        <h3 className="text-white font-black text-2xl mb-4">YouTube — Long-term content engine</h3>
                                        <p>
                                            YouTube is the only social platform where content compounds over years. A well-optimized YouTube video from 2024 still drives traffic in 2026. For educational content, how-to videos, and product reviews — YouTube is unbeatable for sustainable organic reach. YouTube Shorts is also now a major discovery channel for younger audiences.
                                        </p>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Key skills: Video SEO (titles, descriptions, thumbnails), Shorts strategy, channel optimization, and YouTube Analytics.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white flex items-center gap-4 text-balance">
                                    <Users className="h-10 w-10 text-emerald-500 shrink-0" />
                                    Top 10 Social Media Marketing Job Roles in Noida
                                </h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Job Role</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Salary Range Noida</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Key Skills Required</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { role: "Social Media Executive", sal: "₹2.5L–4.5L / year", skills: "Content creation, scheduling, basic analytics" },
                                                { role: "Social Media Manager", sal: "₹3.5L–7L / year", skills: "Multi-platform strategy, team management, reporting" },
                                                { role: "Content Creator / Strategist", sal: "₹3L–6L / year", skills: "Reels, YouTube Shorts, copywriting, trends" },
                                                { role: "Meta Ads Specialist", sal: "₹3.5L–7L / year", skills: "Facebook + Instagram paid campaigns, ROAS optimization" },
                                                { role: "LinkedIn Marketing Specialist", sal: "₹3.5L–6L / year", skills: "B2B content, lead gen, Sales Navigator" },
                                                { role: "Community Manager", sal: "₹2.5L–5L / year", skills: "Engagement, moderation, brand voice" },
                                                { role: "Influencer Marketing Manager", sal: "₹3.5L–7L / year", skills: "Influencer outreach, contracts, campaign tracking" },
                                                { role: "Social Media Analyst", sal: "₹3L–6L / year", skills: "Data analysis, reporting, A/B testing" },
                                                { role: "Digital Marketing Manager", sal: "₹5L–12L / year", skills: "SMM + SEO + Google Ads + full funnel" },
                                                { role: "Freelance SMM Consultant", sal: "₹3L–15L / year", skills: "Any specialization + client management" }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white">{row.role}</td>
                                                    <td className="p-6 text-emerald-400 font-black whitespace-nowrap">{row.sal}</td>
                                                    <td className="p-6 text-slate-400">{row.skills}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">What a Good Social Media Marketing Course in Noida Must Cover</h2>
                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Platform-specific strategy — not generic 'post regularly' advice</h4>
                                        <p className="text-slate-400">A course worth paying for teaches you the specific mechanics of each platform — how the Instagram algorithm weights Reels vs carousel vs static posts, why LinkedIn posts with external links get less reach, what thumbnail click-through rate matters on YouTube. Generic advice like 'post consistently and use hashtags' is available free on YouTube. You are paying for platform-specific depth.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Live Meta Ads experience</h4>
                                        <p className="text-slate-400">You cannot learn paid social by watching someone else manage campaigns. You need to actually set up a campaign, choose an objective, build an audience, create an ad, and optimize based on results. Any SMM course in Noida that does not give you hands-on Meta Ads experience is leaving out the most job-relevant and highest-paying part of the skill set.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Content creation tools — Canva, CapCut, AI</h4>
                                        <p className="text-slate-400">Modern social media management requires basic content creation capability. You do not need to be a professional designer or video editor — but you need to know Canva for graphics, CapCut or InVideo for Reels, and increasingly AI tools for caption writing and content ideation. A good course covers all three.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Analytics and reporting</h4>
                                        <p className="text-slate-400">The difference between a social media manager who charges ₹8,000/month and one who charges ₹25,000/month is usually the ability to present data. Knowing how to read Meta Ads Manager, pull Instagram Insights into a report, and explain what the numbers mean in business terms is what separates juniors from senior professionals.</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">Real account or campaign work for portfolio</h4>
                                        <p className="text-slate-400">Employers and clients want to see what you have actually done. A social media portfolio should include at least: screenshots of organic growth results, Meta Ads campaign screenshots with real metrics, content samples across platforms, and a monthly report example. Celoris students build all of this during the course.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white">Social Media Marketing Fees in Noida — 2026 Price Guide</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-12">
                                    {[
                                        { title: "Basic", price: "₹2,500", duration: "4 Weeks", focus: "Instagram + Facebook organic, content calendar, Canva, basic analytics" },
                                        { title: "Advanced", price: "₹4,999", duration: "8 Weeks", focus: "All platforms + Meta Ads + LinkedIn + YouTube + reporting + AI tools" },
                                        { title: "Mastery (1-on-1)", price: "₹8,000", duration: "8 Weeks", focus: "Full course + live campaigns + client management + freelance portfolio" }
                                    ].map((plan, i) => (
                                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:border-emerald-500/50 transition-all group relative overflow-hidden flex flex-col justify-between">
                                            <div>
                                                <div className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit mb-4">
                                                    {plan.duration}
                                                </div>
                                                <h3 className="text-2xl font-black text-white mb-2">{plan.title}</h3>
                                                <p className="text-4xl font-black text-emerald-400 mb-6">{plan.price}</p>
                                            </div>
                                            <p className="text-sm text-slate-300 border-t border-white/5 pt-6 flex items-center gap-2">
                                                <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
                                                {plan.focus}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl text-center">
                                    <p className="text-slate-200 font-bold mb-0">All plans include live campaign practice, real ad account experience, Celoris completion certificate, and lifetime WhatsApp support.</p>
                                </div>
                            </section>

                            <section className="mt-24">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white flex items-center gap-4 text-balance">
                                    <HelpCircle className="h-10 w-10 text-emerald-500 shrink-0" />
                                    Top 10 Interview Questions for SMM Jobs in Noida
                                </h2>
                                <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-white/5">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">Question</th>
                                                <th className="p-6 text-emerald-400 font-black uppercase tracking-widest text-xs">What They're Testing</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {[
                                                { q: "What is your approach to growing a brand's Instagram from scratch?", t: "Strategic thinking + platform knowledge" },
                                                { q: "How do you calculate ROAS and what's a good benchmark?", t: "Paid ads literacy + business understanding" },
                                                { q: "Walk me through how you'd set up a Meta Lead Gen campaign", t: "Practical Meta Ads skills" },
                                                { q: "How does the Instagram algorithm work in 2026?", t: "Platform knowledge currency" },
                                                { q: "What tools do you use for scheduling and analytics?", t: "Tool familiarity" },
                                                { q: "How would you handle a brand that gets negative comments?", t: "Community management + brand voice" },
                                                { q: "What's the difference between reach and impressions?", t: "Metrics fundamentals" },
                                                { q: "How do you research trending content for a brand?", t: "Content strategy process" },
                                                { q: "Give an example of a campaign you ran and the results", t: "Portfolio + accountability" },
                                                { q: "How are AI tools changing social media marketing?", t: "2026 awareness + adaptability" }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-6 font-bold text-white normal-case leading-relaxed">{row.q}</td>
                                                    <td className="p-6 text-slate-400 leading-relaxed">{row.t}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-6 text-sm text-emerald-500 font-black uppercase italic tracking-widest pl-4 border-l-2 border-emerald-500">At Celoris, we specifically prepare students for these exact questions before they go for interviews — using real examples from campaigns run during the course.</p>
                            </section>

                            <section className="mt-32">
                                <h2 className="text-3xl md:text-5xl font-black mb-12 text-white flex items-center gap-4">
                                    <HelpCircle className="h-10 w-10 text-emerald-500" /> Frequently Asked Questions
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    <AccordionItem value="item-1" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Is social media marketing easy to learn?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            The basics of social media marketing — content planning, posting, basic analytics — are accessible within 2–3 weeks. The more advanced skills like Meta Ads optimization, cross-platform strategy, and data-driven reporting take 6–8 weeks of dedicated learning. The learning curve is gentler than coding but steeper than most people expect.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Can I get a job in social media marketing without a marketing degree?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes — social media marketing is one of the most skills-based fields in marketing. Employers care far more about your portfolio (what accounts have you grown, what campaigns have you run) than your degree. Several of our students with non-marketing backgrounds have landed social media roles in Noida simply by showing results.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">How many clients can I handle as a freelance social media manager?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Most freelancers in Noida comfortably manage 4–6 clients simultaneously once they have templates and processes in place. At ₹10,000–15,000 per client per month, that is ₹40,000–90,000/month from part-time freelance work. The key is systemizing your workflow — which we cover in the Mastery plan.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Which pays more — organic social media or Meta Ads?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Paid social (Meta Ads) specialists typically earn 20–40% more than organic social media managers at the same level. However, the most valuable — and highest paid — social media professionals understand both. We recommend learning organic strategy first, then adding paid ads skills.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-5" className="bg-white/5 border border-white/10 rounded-2xl px-6">
                                        <AccordionTrigger className="text-white font-bold hover:no-underline py-6">Can the trainer come to my home in Noida?</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 pb-6">
                                            Yes. Celoris trainers offer home-visit sessions across all Noida sectors, Greater Noida, and nearby Ghaziabad. Online sessions are also available via Zoom or Google Meet.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </section>

                            <section className="mt-32 pt-16 border-t border-white/10">
                                <h2 className="text-3xl md:text-5xl font-black mb-10 text-white tracking-tight">Final Thoughts — Which Social Media Marketing Course Should You Join in Noida?</h2>
                                <p className="text-lg leading-relaxed mb-10">
                                    The best social media marketing course in Noida is not the most expensive one or the one with the most impressive-sounding syllabus. It is the one that puts you in front of real ad accounts, teaches you platform-specific strategies that actually work in 2026, and gives you results you can show an employer or client before you even finish the course.
                                </p>
                                <p className="text-lg leading-relaxed mb-10">
                                    Generic social media advice is free on YouTube. What you cannot get for free is a trainer who has managed real brand accounts, a structured curriculum that goes from fundamentals to live campaigns, and individual feedback on your specific work from someone who knows what good looks like.
                                </p>
                                <p className="text-lg leading-relaxed mb-10">
                                    Celoris social media marketing training in Noida delivers all of this — starting at ₹2,500, with home visit options, a free demo before you pay, and lifetime WhatsApp support after your course ends.
                                </p>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 md:p-16 rounded-[3rem] my-16 text-center">
                                    <h3 className="text-2xl md:text-4xl font-black text-white mb-6">Book Your FREE Demo Today</h3>
                                    <p className="text-slate-400 mb-10 text-lg">Talk to an SMM expert trainer who has handled real client accounts. No commitment required.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                        <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                                            <Link href="https://wa.me/919084718101" target="_blank">
                                                <Phone className="h-6 w-6 mr-3" /> WhatsApp Demo
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-16 py-8 text-xl w-full sm:w-auto" asChild>
                                            <Link href="/social-media-marketing-course-noida">Course Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Internal Links & Tags */}
                        <div className="mt-20 pt-12 border-t border-white/10">
                            <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
                                <Share2 className="h-4 w-4 text-emerald-500" /> Related Articles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                {[
                                    { t: "Best Digital Marketing Course in Noida", l: "/blog/best-digital-marketing-course-noida" },
                                    { t: "Best Video Editing Course in Noida", l: "/blog/best-video-editing-course-noida" },
                                    { t: "Social Media Marketing Course Noida Landing Page", l: "/social-media-marketing-course-noida" },
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
                                {['social media marketing course noida', 'smm course noida', 'social media training noida', 'instagram marketing course noida', 'facebook ads course noida'].map((tag) => (
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
                    <Link href="https://wa.me/919084718101" target="_blank">Book Demo</Link>
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
