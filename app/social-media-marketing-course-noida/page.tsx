"use client"

import { useEffect } from "react"
import { 
    ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, 
    Lightbulb, MapPin, Smartphone, MessageSquare, Phone, Globe, ShieldCheck, 
    TrendingUp, BarChart3, Target, Megaphone, Share2, Mail, FileText, MousePointer2, Search,
    Instagram, Facebook, Linkedin, Youtube, Film, PenTool
} from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SocialMediaMarketingCourseNoida() {
    useEffect(() => {
        document.title = "Social Media Marketing Course in Noida | Celoris — Book Free Demo"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Learn social media marketing in Noida. Instagram, Facebook, LinkedIn, YouTube strategy + paid ads. Online & offline. Free demo available. Book today!"
        if (metaDescription) {
            metaDescription.setAttribute("content", descriptionText)
        } else {
            const meta = document.createElement("meta")
            meta.name = "description"
            meta.content = descriptionText
            document.head.appendChild(meta)
        }
    }, [])

    const pageData = {
        title: "Social Media Marketing Course in Noida",
        subtitle: "Learn Instagram, Facebook, LinkedIn, and YouTube marketing — organic strategy, content creation, paid ads, analytics, and influencer marketing.",
        heroDescription: "Build a real brand presence from scratch. Online and offline batches available across Noida, Greater Noida, and Ghaziabad. Book Your FREE Demo Class Today.",
        whatsappNumber: "+91 90847 18101",
        whatsappLink: "https://wa.me/919084718101",
        overview: "Social media is where Noida's businesses win or lose their customers. Whether you are a fresher looking for a social media manager role, a business owner who wants to grow their brand organically, or a content creator ready to monetize — Celoris social media marketing course in Noida gives you the complete skill set across platforms, content, and paid campaigns.",
        courseDetails: [
            { label: "Course Name", value: "Social Media Marketing (SMM) Training — Basic to Advanced" },
            { label: "Location", value: "Noida — Sector 18, 22, 62, 63, 125, Greater Noida | Also Online" },
            { label: "Mode", value: "At Student's Home | At Trainer's Home | Online via Zoom/Meet" },
            { label: "Duration", value: "4–8 Weeks (flexible based on level)" },
            { label: "Batch Size", value: "1-on-1 or Small Group (max 5 students)" },
            { label: "Language", value: "Hindi + English (Hinglish)" },
            { label: "Certification", value: "Celoris Course Completion Certificate" },
            { label: "Contact", value: "+91 90847 18101 | support@celorisdesigns.com" },
        ],
        curriculum: [
            {
                module: "Module 1: Social Media Fundamentals",
                topics: [
                    "Overview of all major platforms — Instagram, Facebook, LinkedIn, YouTube, Twitter/X",
                    "Understanding algorithms — how each platform decides what content to show",
                    "Building a social media strategy — goals, audience, content pillars, posting frequency",
                    "Brand voice and tone — creating consistent identity across platforms",
                    "Social media audit — analyzing existing accounts for gaps and opportunities",
                    "Competitor analysis — learning from what works in your niche"
                ],
                icon: Lightbulb
            },
            {
                module: "Module 2: Instagram Marketing (Organic + Reels)",
                topics: [
                    "Profile optimization — bio, highlights, link-in-bio strategy",
                    "Content types — feed posts, Stories, Reels, Carousels, Lives",
                    "Instagram Reels strategy — hooks, scripts, trending audio, hashtags",
                    "Hashtag research and niche hashtag strategy for NCR businesses",
                    "Instagram Shopping and product tagging for e-commerce",
                    "Collaboration and influencer outreach strategies",
                    "Instagram Insights — reach, impressions, follower growth analytics"
                ],
                icon: Instagram
            },
            {
                module: "Module 3: Facebook Marketing (Organic + Groups)",
                topics: [
                    "Facebook Page optimization — about, CTA button, cover photo strategy",
                    "Facebook content strategy — what works in 2026 vs what is dead",
                    "Facebook Groups — building and monetizing communities",
                    "Facebook Reels and video content for maximum organic reach",
                    "Facebook Events and local business promotion",
                    "Facebook Insights — understanding page analytics"
                ],
                icon: Facebook
            },
            {
                module: "Module 4: Meta Ads (Facebook + Instagram Paid)",
                topics: [
                    "Meta Business Manager setup — Ad Account, Pixel, Catalog",
                    "Campaign objectives — awareness, traffic, engagement, leads, conversions",
                    "Audience targeting — saved, custom, and lookalike audiences",
                    "Ad formats — image, video, carousel, collection, lead gen forms",
                    "Budget management — daily vs lifetime, CPC vs CPM bidding",
                    "A/B testing creatives and audiences for optimization",
                    "Retargeting — bringing back website visitors and engaged users",
                    "WhatsApp message objective ads — driving direct WhatsApp conversations"
                ],
                icon: Target
            },
            {
                module: "Module 5: LinkedIn Marketing",
                topics: [
                    "LinkedIn profile optimization for personal branding",
                    "LinkedIn Company Page — setup, content strategy, follower growth",
                    "LinkedIn content formats — posts, articles, documents, carousels",
                    "LinkedIn algorithm — what gets reach and why",
                    "LinkedIn for B2B lead generation in Noida's corporate market",
                    "LinkedIn Sales Navigator basics"
                ],
                icon: Linkedin
            },
            {
                module: "Module 6: YouTube Marketing",
                topics: [
                    "YouTube channel setup and SEO optimization",
                    "Video SEO — titles, descriptions, tags, thumbnails that get clicks",
                    "YouTube Shorts strategy — reaching new audiences quickly",
                    "YouTube Analytics — watch time, CTR, audience retention",
                    "Monetization paths — AdSense, memberships, sponsored content"
                ],
                icon: Youtube
            },
            {
                module: "Module 7: Content Creation & Tools",
                topics: [
                    "Content calendar — planning 30 days of content in 2 hours",
                    "Canva for social media design — templates, brand kit, animations",
                    "CapCut and InVideo for Reels and Shorts editing",
                    "AI tools for content — ChatGPT for captions, Midjourney for visuals",
                    "Scheduling tools — Buffer, Later, Meta Business Suite",
                    "Stock content resources — free images, videos, music for content"
                ],
                icon: PenTool
            },
            {
                module: "Module 8: Analytics & Reporting",
                topics: [
                    "Tracking growth — followers, reach, engagement rate, saves",
                    "Meta Ads Manager reporting — ROAS, CPL, CPC analysis",
                    "Building monthly social media reports for clients",
                    "Google Analytics integration — tracking social traffic to website",
                    "Adjusting strategy based on data — what to double down on"
                ],
                icon: BarChart3
            }
        ],
        whyChooseUs: [
            "Trainers who manage real brand accounts — not just classroom instructors",
            "Live ad campaign practice — you run real Meta ads during the course",
            "Platform-specific strategy — what works on Instagram vs LinkedIn vs YouTube",
            "AI tools integration — ChatGPT, Canva AI, and automation tools covered",
            "Small batches — maximum 5 students, 1-on-1 option available",
            "Home visit sessions across all Noida sectors and Greater Noida",
            "Lifetime WhatsApp support — doubt clearing after course completion",
            "Free 30-minute demo — try before you pay, zero pressure"
        ],
        whoIsItFor: [
            "Freshers looking for social media manager or content creator roles",
            "Business owners who want to grow their brand on Instagram and Facebook",
            "Marketing professionals adding social media to their existing skill set",
            "Content creators who want to monetize their audience professionally",
            "Freelancers who want to offer social media management services",
            "Influencers who want to understand strategy and analytics behind their growth"
        ],
        areasCovered: [
            "Noida: Sector 18, 22, 37, 44, 50, 56, 62, 63, 76, 93, 100, 120, 125, 135, 137",
            "Greater Noida West: Gaur City, Supertech Eco Village, Amrapali Silicon City",
            "Greater Noida: Knowledge Park I–V, Alpha, Beta, Gamma, Delta, Omega",
            "Ghaziabad: Indirapuram, Vaishali, Vasundhara, Crossings Republik"
        ],
        testimonials: [
            {
                name: "Meera K.",
                location: "Noida Sector 50",
                text: "I grew my food business Instagram from 800 to 11,000 followers in 3 months using the strategies from this course. The Reels hook formula alone was worth the entire fee.",
                rating: 5
            },
            {
                name: "Arjun T.",
                location: "Greater Noida West",
                text: "Got placed as a social media executive at a D2C brand in Noida Sector 63 within 6 weeks of completing the course. The Meta Ads module was exactly what they tested in the interview.",
                rating: 5
            }
        ],
        faq: [
            {
                question: "How much does a social media marketing course cost in Noida?",
                answer: "At Celoris, SMM training starts at ₹2,500 for the Basic plan (4 weeks) and goes up to ₹8,000 for the Mastery 1-on-1 plan (8 weeks). All prices are transparent with no hidden fees. WhatsApp us at +91 90847 18101 for details."
            },
            {
                question: "Can I learn social media marketing without any marketing background?",
                answer: "Yes. Our Basic plan starts from zero — we cover platform basics, algorithm understanding, and content strategy before moving to ads. Many of our most successful students had never managed a brand account before joining."
            },
            {
                question: "Which social media platform should I focus on first?",
                answer: "It depends on your goal. For most businesses and job seekers in Noida, Instagram + Facebook Meta Ads is the highest ROI starting point. If you are targeting B2B or corporate clients, add LinkedIn. YouTube is best for long-term content strategy. Our course covers all platforms and helps you prioritize based on your specific goals."
            },
            {
                question: "Can the trainer come to my home in Noida?",
                answer: "Yes. Celoris trainers offer home-visit sessions across all Noida sectors, Greater Noida, and nearby Ghaziabad. Online sessions are also available via Zoom or Google Meet."
            },
            {
                question: "Is social media marketing still a good career in 2026 with AI tools available?",
                answer: "Absolutely. AI tools have made content production faster but the strategy, audience understanding, and campaign optimization still require human expertise. If anything, social media managers who know how to use AI tools are more valuable — which is why we cover AI tools as part of this course."
            },
            {
                question: "Do I get a certificate after the course?",
                answer: "Yes. All students receive a Celoris Course Completion Certificate. You also leave with a portfolio of live campaign results and content pieces — which is what employers and clients actually want to see."
            }
        ],
        jobsTable: [
            { role: "Social Media Executive", salary: "₹2.5L–4.5L / year", skills: "Instagram, Facebook, content calendar, basic analytics" },
            { role: "Social Media Manager", salary: "₹3.5L–6L / year", skills: "All platforms, paid ads, team coordination" },
            { role: "Content Creator / Strategist", salary: "₹3L–6L / year", skills: "Content planning, Reels, YouTube, copywriting" },
            { role: "Paid Social Specialist", salary: "₹3.5L–7L / year", skills: "Meta Ads, LinkedIn Ads, campaign optimization" },
            { role: "Digital Marketing Manager", salary: "₹5L–10L / year", skills: "SMM + SEO + Google Ads + analytics" },
            { role: "Freelance SMM Manager", salary: "₹3L–12L / year", skills: "Any specialization + client management" }
        ]
    }

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": pageData.faq.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    }

    const businessJsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Celoris Social Media Marketing Training Noida",
        "image": "https://www.celorisdesigns.com/digimarck.png",
        "@id": "https://www.celorisdesigns.com/social-media-marketing-course-noida",
        "url": "https://www.celorisdesigns.com/social-media-marketing-course-noida",
        "telephone": "+91 90847 18101",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Sector 62",
            "addressLocality": "Noida",
            "addressRegion": "UP",
            "postalCode": "201301",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 28.6273,
            "longitude": 77.3725
        },
        "areaServed": {
            "@type": "City",
            "name": "Noida"
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday"
            ],
            "opens": "08:00",
            "closes": "21:00"
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6 font-medium uppercase tracking-wider italic">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic">Social Media Marketing Course Noida</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    Noida's Top Rated
                                </span>
                                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    100% Practical & AI Powered
                                </span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Free Demo Slot Available
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">Social Media</span>
                                <span className="block">Marketing Course</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 block tracking-normal mt-2">
                                    in Noida
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-black italic uppercase tracking-tight">
                                {pageData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {pageData.heroDescription}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Live Campaigns Practice</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <Award className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Celoris Certificate</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Lifetime WhatsApp Support</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link 
                                    href={pageData.whatsappLink}
                                    target="_blank"
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest italic rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all flex items-center gap-3"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    WhatsApp: {pageData.whatsappNumber}
                                </Link>
                                <CourseInquiryDialog 
                                    courseTitle={pageData.title}
                                    buttonClassName="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest italic rounded-2xl transition-all"
                                />
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/digimarck.png"
                                        alt="Social Media Marketing Course Noida"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                </div>
                            </Card>
                        </div>

                        {/* Pricing Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Zap className="h-8 w-8 text-emerald-500" />
                                </div>
                                Course Pricing & Plans
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: "Basic", price: "2,500", focus: "Beginners, Students", duration: "4 Weeks", topics: "Instagram + Facebook organic, content calendar, basic analytics" },
                                    { name: "Advanced", price: "4,999", focus: "Job Seekers, Business Owners", duration: "8 Weeks", topics: "All platforms + Meta Ads + LinkedIn + YouTube + reporting" },
                                    { name: "Mastery (1-on-1)", price: "8,000", focus: "Freelancers, Agency aspirants", duration: "8 Weeks", topics: "Full course + Live ad campaigns + Client management + Portfolio" },
                                ].map((plan, i) => (
                                    <Card key={i} className="bg-[#0d1321]/40 border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:border-emerald-500/30 transition-all text-center flex flex-col">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic mb-2">{plan.name}</div>
                                        <div className="text-4xl font-black text-white italic tracking-tighter mb-4">₹{plan.price}</div>
                                        <div className="space-y-2 mb-8 flex-1">
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.focus}</div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.duration}</div>
                                            <div className="text-[10px] font-bold text-slate-400 italic mt-4 leading-relaxed">{plan.topics}</div>
                                        </div>
                                        <CourseInquiryDialog 
                                            courseTitle={`${pageData.title} - ${plan.name}`}
                                            buttonClassName="w-full py-3 bg-white/5 border border-white/10 hover:bg-emerald-600 hover:text-white text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all italic"
                                        />
                                    </Card>
                                ))}
                            </div>
                            <div className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 text-center">
                                <p className="text-sm font-black text-emerald-400 uppercase italic tracking-widest">
                                    Every Plan Includes: ✓ Live campaign practice &nbsp;&nbsp; ✓ Real ad account experience &nbsp;&nbsp; ✓ Celoris Certificate &nbsp;&nbsp; ✓ Lifetime WhatsApp Support
                                </p>
                            </div>
                        </section>

                        {/* Course Overview */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <BookOpen className="h-8 w-8 text-emerald-500" />
                                </div>
                                Course Overview
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed font-medium">
                                {pageData.overview}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pageData.courseDetails.map((detail, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 flex flex-col justify-center">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic mb-1">{detail.label}</div>
                                        <div className="text-sm font-black text-white italic uppercase leading-tight">{detail.value}</div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Curriculum */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <TrendingUp className="h-8 w-8 text-blue-500" />
                                </div>
                                What You Will Learn — Full Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {pageData.curriculum.map((item, index) => {
                                    const Icon = item.icon
                                    return (
                                        <AccordionItem key={index} value={`module-${index}`} className="border border-white/5 bg-[#0d1321]/40 rounded-[2rem] px-4 overflow-hidden shadow-xl">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-6 text-left w-full">
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-emerald-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-emerald-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{item.module}</div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400 opacity-100 visible">
                                                <div className="pl-6 sm:pl-20 space-y-4 relative">
                                                    <div className="absolute left-0 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/30 via-emerald-500/10 to-transparent" />
                                                    <div className="flex flex-col gap-4">
                                                        {item.topics.map((topic, topicIndex) => (
                                                            <div key={topicIndex} className="flex items-start gap-4 group">
                                                                 <div className="h-2 w-2 rounded-full bg-emerald-500/40 mt-2.5 group-hover:bg-emerald-500 transition-colors shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                                                 <span className="text-sm font-bold uppercase tracking-widest italic group-hover:text-emerald-400 transition-colors leading-relaxed block">{topic}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </section>

                        {/* Why Learn SMM from Celoris */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Star className="h-8 w-8 text-emerald-500" />
                                </div>
                                Why Learn Social Media Marketing from Celoris in Noida?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.whyChooseUs.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Who Is This Course For */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Users className="h-8 w-8 text-blue-500" />
                                </div>
                                Who Is This Course For?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.whoIsItFor.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-blue-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-blue-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 font-bold uppercase italic tracking-widest pl-4 border-l-2 border-emerald-500">
                                No prior marketing experience required. We start from absolute basics.
                            </p>
                        </section>

                        {/* Comparison Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <Share2 className="h-8 w-8 text-purple-500" />
                                </div>
                                Celoris vs Other SMM Training Options in Noida
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-[#0d1321]/40 rounded-[2.5rem] overflow-hidden">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Feature</th>
                                            <th className="p-6 text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest italic bg-emerald-500/5">Celoris</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Local Institute</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">YouTube/Online</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold italic uppercase tracking-tight">
                                        {[
                                            { feature: "Live ad campaign practice", celoris: "✅ Yes", local: "⚠️ Limited", youtube: "❌ No" },
                                            { feature: "All platforms covered", celoris: "✅ IG+FB+LI+YT", local: "⚠️ Usually 1-2", youtube: "⚠️ Topic by topic" },
                                            { feature: "AI tools included", celoris: "✅ Yes", local: "❌ Rarely", youtube: "⚠️ Separate videos" },
                                            { feature: "Home visit option", celoris: "✅ Yes", local: "❌ No", youtube: "❌ No" },
                                            { feature: "Batch size", celoris: "✅ Max 5 / 1-on-1", local: "❌ 15-30", youtube: "❌ No interaction" },
                                            { feature: "Free demo", celoris: "✅ Yes", local: "❌ Rarely", youtube: "✅ Always free" },
                                            { feature: "Lifetime support", celoris: "✅ WhatsApp", local: "❌ No", youtube: "❌ No" },
                                            { feature: "Price", celoris: "✅ ₹2,500–8,000", local: "❌ ₹8,000–30,000", youtube: "✅ Free–₹3,000" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-slate-300">{row.feature}</td>
                                                <td className="p-6 text-center text-emerald-400 bg-emerald-500/5">{row.celoris}</td>
                                                <td className="p-6 text-center text-slate-500">{row.local}</td>
                                                <td className="p-6 text-center text-slate-500">{row.youtube}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Jobs Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <TrendingUp className="h-8 w-8 text-blue-500" />
                                </div>
                                Social Media Marketing Jobs in Noida — What You Can Earn
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-[#0d1321]/40 rounded-[2.5rem] overflow-hidden">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Job Role</th>
                                            <th className="p-6 text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Avg Salary in Noida</th>
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Skills Needed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold italic uppercase tracking-tight">
                                        {pageData.jobsTable.map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-white">{row.role}</td>
                                                <td className="p-6 text-center text-emerald-400 bg-emerald-500/5">{row.salary}</td>
                                                <td className="p-6 text-slate-400 font-medium normal-case">{row.skills}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-sm text-slate-500 font-bold uppercase italic tracking-widest pl-4 border-l-2 border-emerald-500">
                                Noida's startup ecosystem and D2C brand market creates consistent demand for social media professionals — making it one of the best cities in NCR to build a career in social media marketing.
                            </p>
                        </section>

                        {/* Areas Covered */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <MapPin className="h-8 w-8 text-emerald-500" />
                                </div>
                                Areas Covered in Noida
                            </h2>
                            <div className="space-y-6">
                                {pageData.areasCovered.map((area, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-[#0d1321]/40 border border-white/5 text-sm font-black text-slate-400 uppercase italic tracking-widest hover:border-emerald-500/30 transition-all">
                                        {area}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-emerald-400 font-black uppercase italic tracking-[0.2em] pt-2">
                                Online sessions available via Zoom or Google Meet for students anywhere in India.
                            </p>
                        </section>

                        {/* Testimonials */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                                    <Star className="h-8 w-8 text-yellow-500 fill-current" />
                                </div>
                                What Our Students Say
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {pageData.testimonials.map((t, i) => (
                                    <Card key={i} className="bg-[#0d1321]/40 border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:border-emerald-500/20 transition-all">
                                        <div className="flex gap-1 mb-4 text-yellow-500">
                                            {[...Array(t.rating)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                                        </div>
                                        <p className="text-slate-300 italic font-medium leading-relaxed mb-6">"{t.text}"</p>
                                        <div className="flex flex-col">
                                            <span className="text-white font-black uppercase italic tracking-tighter">— {t.name}</span>
                                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{t.location}</span>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* FAQ */}
                        <section className="space-y-12 bg-[#0d1321]/20 p-12 rounded-[3rem] border border-white/5 shadow-inner">
                            <div className="text-center space-y-4">
                                <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Frequently Asked Questions</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs italic">Everything you need to know before starting</p>
                            </div>
                            <div className="space-y-6">
                                {pageData.faq.map((item, index) => (
                                    <div key={index} className="group bg-[#0d1321]/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/20 transition-all shadow-lg hover:shadow-emerald-500/5">
                                        <div className="flex gap-6">
                                            <div className="text-2xl font-black text-white/10 group-hover:text-emerald-500/20 transition-colors italic">Q{index + 1}</div>
                                            <div className="space-y-3">
                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">{item.question}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Closing CTA banner */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Megaphone className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Your Social Media Marketing Journey Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                Join thousands of students who have already built real skills and real results with Celoris. Whether you want a job at a Noida agency, grow your own business on Instagram, or build a freelance client base — our SMM trainers in Noida are ready for you.
                            </p>
                            <div className="flex flex-wrap gap-4 relative z-10">
                                <Link 
                                    href={pageData.whatsappLink}
                                    target="_blank"
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest italic rounded-2xl shadow-3xl transition-all flex items-center gap-3"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    WhatsApp Now: {pageData.whatsappNumber}
                                </Link>
                                <Link 
                                    href="/"
                                    className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest italic rounded-2xl transition-all flex items-center gap-3"
                                >
                                    <Globe className="h-5 w-5" />
                                    Visit celorisdesigns.com
                                </Link>
                            </div>
                        </div>

                        {/* Internal Linking */}
                        <div className="pt-8 border-t border-white/5 flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em] italic text-slate-500">
                            <span>Related Courses:</span>
                            <Link href="/social-media-marketing-course-gurgaon" className="hover:text-emerald-400 transition-colors">Gurgaon SMM Course</Link>
                            <Link href="/digital-marketing-course-noida" className="hover:text-emerald-400 transition-colors">Digital Marketing Noida</Link>
                            <Link href="/video-editing-course-noida" className="hover:text-emerald-400 transition-colors">Video Editing Noida</Link>
                            <Link href="/blog/best-social-media-marketing-course-noida" className="hover:text-emerald-400 transition-colors">Best SMM Course Blog Noida</Link>
                            <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn Directory</Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            {/* Quick Contact Card */}
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic mb-2">Book Free Demo</div>
                                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">1-on-1 Doubt Clear</h3>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider italic mt-2">Zero pressure trial class</p>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <Phone className="h-5 w-5 text-emerald-500" />
                                            <div>
                                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Call / WhatsApp</div>
                                                <Link href={pageData.whatsappLink} className="text-sm font-black text-white italic hover:text-emerald-400">{pageData.whatsappNumber}</Link>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <Mail className="h-5 w-5 text-emerald-500" />
                                            <div>
                                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Email Support</div>
                                                <Link href="mailto:support@celorisdesigns.com" className="text-sm font-black text-white italic hover:text-emerald-400">support@celorisdesigns.com</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <CourseInquiryDialog 
                                            courseTitle={pageData.title}
                                            buttonClassName="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest italic text-xs rounded-2xl shadow-2xl transition-all"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
