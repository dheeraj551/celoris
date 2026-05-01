"use client"

import { useEffect } from "react"
import { 
    ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, 
    Lightbulb, MapPin, Smartphone, MessageSquare, Phone, Globe, ShieldCheck, 
    TrendingUp, BarChart3, Target, Megaphone, Share2, Mail, FileText, MousePointer2, Search 
} from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function DigitalMarketingCourseNoida() {
    useEffect(() => {
        document.title = "Digital Marketing Course in Noida | Celoris — Book Free Demo"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Join the best digital marketing course in Noida. Learn SEO, Google Ads, Meta Ads & more from certified trainers. Online & offline. Book a free demo today!"
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
        title: "Digital Marketing Course in Noida",
        subtitle: "Learn SEO, Google Ads, Meta Ads, Social Media Marketing, Content Marketing, and Analytics from certified trainers with real campaign experience.",
        heroDescription: "Online and offline batches available across Noida, Greater Noida, and Ghaziabad. Book Your FREE Demo Class Today.",
        whatsappNumber: "+91 90847 18101",
        whatsappLink: "https://wa.me/919084718101",
        overview: "Whether you are a fresher looking for your first digital marketing job, a working professional switching careers, or a business owner who wants to market their own brand — Celoris digital marketing training in Noida is built for you. Our trainers have managed real ad campaigns with combined spends of ₹50L+ across Delhi NCR clients.",
        courseDetails: [
            { label: "Course Name", value: "Digital Marketing Training (Basic to Advanced)" },
            { label: "Location", value: "Noida — Sector 18, 62, 63, 125, Greater Noida | Also Online" },
            { label: "Mode", value: "At Student's Home | At Trainer's Home | Online via Zoom/Meet" },
            { label: "Duration", value: "4–8 Weeks (flexible based on level)" },
            { label: "Batch Size", value: "1-on-1 or Small Group (max 5 students)" },
            { label: "Language", value: "Hindi + English (Hinglish)" },
            { label: "Certification", value: "Celoris Course Completion Certificate" },
        ],
        curriculum: [
            {
                module: "Module 1: Digital Marketing Fundamentals",
                topics: [
                    "Overview of all digital marketing channels — SEO, SEM, Social, Email, Content",
                    "Building a digital marketing strategy from scratch",
                    "Understanding buyer personas and customer journey",
                    "Key metrics — CPC, CPM, CTR, ROAS, CAC, LTV",
                    "Digital marketing tools overview"
                ],
                icon: Lightbulb
            },
            {
                module: "Module 2: Search Engine Optimization (SEO)",
                topics: [
                    "On-page SEO — title tags, meta descriptions, heading structure",
                    "Keyword research — Google Keyword Planner, Ubersuggest, Ahrefs",
                    "Off-page SEO — backlink building, guest posting, directory submissions",
                    "Technical SEO — site speed, Core Web Vitals, sitemaps, mobile optimization",
                    "Local SEO — Google Business Profile, NAP consistency, local citations",
                    "SEO reporting using Google Search Console"
                ],
                icon: Search
            },
            {
                module: "Module 3: Google Ads (Search + Display + YouTube)",
                topics: [
                    "Google Ads account structure — campaigns, ad groups, keywords",
                    "Search ads — match types, bidding strategies, Quality Score optimization",
                    "Display ads — audience targeting, remarketing, responsive ads",
                    "YouTube ads — TrueView, bumper ads, in-stream campaigns",
                    "Conversion tracking with Google Tag Manager",
                    "Google Ads reporting and optimization"
                ],
                icon: MousePointer2
            },
            {
                module: "Module 4: Meta Ads (Facebook + Instagram)",
                topics: [
                    "Meta Business Manager setup and Pixel installation",
                    "Campaign objectives — awareness, traffic, leads, conversions",
                    "Audience targeting — interest, lookalike, custom audiences",
                    "Ad formats — image, video, carousel, lead gen forms",
                    "A/B testing and campaign optimization",
                    "Retargeting strategies for services and e-commerce"
                ],
                icon: Target
            },
            {
                module: "Module 5: Social Media Marketing (Organic)",
                topics: [
                    "Platform strategy — Instagram, Facebook, LinkedIn, YouTube",
                    "Content calendar planning and scheduling tools",
                    "Instagram Reels and YouTube Shorts strategy for NCR brands",
                    "Community management and engagement tactics",
                    "Analytics — Meta Insights, LinkedIn Analytics, YouTube Studio"
                ],
                icon: Share2
            },
            {
                module: "Module 6: Content Marketing & Copywriting",
                topics: [
                    "Blog writing for SEO — structure, keywords, internal linking",
                    "Copywriting frameworks — AIDA, PAS, FAB",
                    "Email marketing — sequences, automation, open rate optimization",
                    "Landing page copywriting and conversion optimization",
                    "Video script writing and YouTube channel optimization"
                ],
                icon: FileText
            },
            {
                module: "Module 7: Analytics & Reporting",
                topics: [
                    "Google Analytics 4 — events, conversions, funnels, audiences",
                    "Google Search Console — impressions, clicks, keyword data",
                    "Building client-ready monthly reports and dashboards",
                    "UTM parameters and campaign tracking setup",
                    "Attribution models — first click, last click, data-driven"
                ],
                icon: BarChart3
            },
            {
                module: "Module 8: Freelancing & Agency Skills (Bonus)",
                topics: [
                    "Getting your first digital marketing client in Noida",
                    "Pricing services — retainer vs project-based models",
                    "Building a portfolio and case studies from course projects",
                    "Tools — Canva, Buffer, Notion, Mailchimp, Semrush"
                ],
                icon: TrendingUp
            }
        ],
        whyChooseUs: [
            "Trainers have managed ₹50L+ in real ad spends for Delhi NCR clients",
            "Live campaign practice — you run real Google and Meta ads during the course",
            "1-on-1 attention — maximum 5 students per batch, never a classroom of 30",
            "Flexible timing — early morning, evening, and weekend batches available",
            "Home visit option — trainers come to your location across Noida sectors",
            "Practical projects — portfolio-ready work by end of course",
            "Lifetime WhatsApp support — doubt clearing even after course completion",
            "Transparent pricing — no hidden fees, no surprise charges",
            "Free 30-minute demo — try before you pay, zero pressure"
        ],
        whoIsItFor: [
            "Freshers from Amity, Sharda, GLA, or other NCR colleges looking for their first marketing job",
            "Working professionals in IT, sales, or operations who want to switch to marketing",
            "Business owners and entrepreneurs who want to market their own brand online",
            "Freelancers who want to add digital marketing to their service offerings",
            "Content creators and influencers who want to monetize their audience",
            "Homemakers and career-returnees looking to upskill for remote work"
        ],
        areasCovered: [
            "Noida: Sector 18, 22, 37, 44, 50, 56, 62, 63, 76, 93, 100, 120, 125, 135, 137",
            "Greater Noida West: Gaur City, Supertech Eco Village, Amrapali Silicon City",
            "Greater Noida: Knowledge Park I–V, Alpha, Beta, Gamma, Delta, Omega",
            "Ghaziabad: Indirapuram, Vaishali, Vasundhara, Crossings Republik"
        ],
        testimonials: [
            {
                name: "Priya M.",
                location: "Noida Sector 62",
                text: "The trainer actually showed me how to run a live Facebook ad campaign during class. That hands-on experience is what got me my first freelance client.",
                rating: 5
            },
            {
                name: "Sandeep K.",
                location: "Greater Noida",
                text: "I was running my own business but had no idea about digital marketing. After this course I am managing my own Google Ads and saving ₹15,000/month on the agency I was paying.",
                rating: 5
            }
        ],
        faq: [
            {
                question: "How much does a digital marketing course cost in Noida?",
                answer: "At Celoris, courses start at ₹2,500 for the Basic plan (4 weeks) and go up to ₹8,000 for the Mastery 1-on-1 plan (8 weeks). All prices are transparent with no hidden fees. WhatsApp us at +91 90847 18101 for details."
            },
            {
                question: "Can the trainer come to my home in Noida?",
                answer: "Yes. Celoris trainers offer home-visit sessions across all Noida sectors and Greater Noida. You can also choose fully online sessions via Zoom or Google Meet."
            },
            {
                question: "Is digital marketing a good career in 2026?",
                answer: "Absolutely. There are 15,000+ digital marketing job openings in Delhi NCR at any given time. Skilled digital marketers — especially those who can run paid ads — are in high demand across IT companies, D2C brands, and agencies in Noida."
            },
            {
                question: "Do I need any technical background to learn digital marketing?",
                answer: "No technical background required. Digital marketing does not involve coding. Most successful marketers come from commerce, arts, or general backgrounds. Analytical thinking and creativity matter more than technical skills."
            },
            {
                question: "Will I get a certificate after the course?",
                answer: "Yes. All students receive a Celoris Course Completion Certificate upon finishing training and assignments. You can add it to your LinkedIn profile and resume."
            },
            {
                question: "Can I attend a free demo before enrolling?",
                answer: "Yes — we offer a free 30-minute demo session with no payment required. WhatsApp us at +91 90847 18101 or visit celoris.in to book your demo slot."
            }
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
        "name": "Celoris Digital Marketing Training Noida",
        "image": "https://www.celorisdesigns.com/digimarck.png",
        "@id": "https://www.celorisdesigns.com/digital-marketing-course-noida",
        "url": "https://www.celorisdesigns.com/digital-marketing-course-noida",
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
                    <span className="text-slate-100 line-clamp-1 italic">Digital Marketing Course Noida</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    Noida's Best Training
                                </span>
                                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Live Campaign Experience
                                </span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Book Free Demo
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">Digital Marketing</span>
                                <span className="block">Course</span>
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
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Live Ad Campaigns</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <Award className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Celoris Certificate</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Lifetime Support</span>
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
                                        alt="Digital Marketing Course Noida"
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
                                    { name: "Basic", price: "2,500", focus: "Beginners & Students", duration: "4 Weeks", topics: "SEO, Social Media, Content Basics" },
                                    { name: "Advanced", price: "4,999", focus: "Working Professionals", duration: "8 Weeks", topics: "SEO + Google Ads + Meta Ads + Analytics" },
                                    { name: "Mastery (1-on-1)", price: "8,000", focus: "Freelancers & Owners", duration: "8 Weeks", topics: "Full stack + Live Campaign Mgmt" },
                                ].map((plan, i) => (
                                    <Card key={i} className="bg-[#0d1321]/40 border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:border-emerald-500/30 transition-all text-center flex flex-col">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic mb-2">{plan.name}</div>
                                        <div className="text-4xl font-black text-white italic tracking-tighter mb-4">₹{plan.price}</div>
                                        <div className="space-y-2 mb-8 flex-1">
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.focus}</div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.duration}</div>
                                            <div className="text-[10px] font-bold text-slate-400 italic mt-4">{plan.topics}</div>
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
                                    All plans include: 10+ practice assignments, live ad campaign experience, Celoris completion certificate, and lifetime WhatsApp support.
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
                                                        {item.topics && item.topics.map((topic, topicIndex) => (
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

                        {/* Why Learn from Celoris */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Star className="h-8 w-8 text-emerald-500" />
                                </div>
                                Why Learn Digital Marketing from Celoris in Noida?
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
                                No prior marketing knowledge required. We start from absolute basics.
                            </p>
                        </section>

                        {/* Comparison Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <Share2 className="h-8 w-8 text-purple-500" />
                                </div>
                                Celoris vs Others in Noida
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-[#0d1321]/40 rounded-[2.5rem] overflow-hidden">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Feature</th>
                                            <th className="p-6 text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest italic bg-emerald-500/5">Celoris</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Local Institute</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">UrbanPro</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold italic uppercase tracking-tight">
                                        {[
                                            { feature: "Transparent Pricing", celoris: "✅ Yes", local: "❌ Hidden fees", urban: "❌ Coin system" },
                                            { feature: "Live Campaign Practice", celoris: "✅ Yes", local: "⚠️ Limited", urban: "✅ Some tutors" },
                                            { feature: "Home Visit Option", celoris: "✅ Yes", local: "❌ No", urban: "✅ Some tutors" },
                                            { feature: "Batch Size", celoris: "✅ Max 5 / 1-on-1", local: "❌ 20-30 students", urban: "✅ 1-on-1" },
                                            { feature: "Free Demo", celoris: "✅ Yes", local: "❌ Rarely", urban: "❌ No" },
                                            { feature: "Lifetime Support", celoris: "✅ WhatsApp", local: "❌ No", urban: "❌ No" },
                                            { feature: "Certificate", celoris: "✅ Yes", local: "✅ Yes", urban: "❌ No" },
                                            { feature: "Real Trainer Experience", celoris: "✅ Verified", local: "⚠️ Varies", urban: "⚠️ Unverified" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-slate-300">{row.feature}</td>
                                                <td className="p-6 text-center text-emerald-400 bg-emerald-500/5">{row.celoris}</td>
                                                <td className="p-6 text-center text-slate-500">{row.local}</td>
                                                <td className="p-6 text-center text-slate-500">{row.urban}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                                Online sessions available for students anywhere in India via Zoom or Google Meet.
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
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Your Digital Marketing Journey Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                Join thousands of students who have already upgraded their careers with Celoris. Book your free demo class today.
                            </p>
                            <div className="flex flex-wrap gap-4 relative z-10">
                                <Link 
                                    href={pageData.whatsappLink}
                                    target="_blank"
                                    className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest italic rounded-2xl shadow-3xl transition-all flex items-center gap-3"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    WhatsApp Now
                                </Link>
                                <Link 
                                    href="/"
                                    className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest italic rounded-2xl transition-all flex items-center gap-3"
                                >
                                    <Globe className="h-5 w-5" />
                                    Visit celoris.in
                                </Link>
                            </div>
                        </div>

                        {/* Internal Linking */}
                        <div className="pt-8 border-t border-white/5 flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-[0.2em] italic text-slate-500">
                            <span>Locations:</span>
                            <Link href="/digital-marketing-course-gurgaon" className="hover:text-emerald-400 transition-colors">Gurgaon</Link>
                            <Link href="/digital-marketing-course-delhi" className="hover:text-emerald-400 transition-colors">Delhi</Link>
                            <span>Related:</span>
                            <Link href="/social-media-marketing-noida" className="hover:text-emerald-400 transition-colors">Social Media Noida</Link>
                            <Link href="/microsoft-excel-training-noida" className="hover:text-emerald-400 transition-colors">Excel Training Noida</Link>
                            <Link href="/blog/best-digital-marketing-course-noida" className="hover:text-emerald-400 transition-colors">Best Course Noida Blog</Link>
                            <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn More</Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            {/* Quick Contact Card */}
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-sm font-black text-emerald-500 italic tracking-[0.3em] uppercase mb-2">Book Free Demo</div>
                                        <div className="text-2xl font-black text-white italic tracking-tighter uppercase">Digital Marketing</div>
                                    </div>

                                    <div className="space-y-4 mb-10 text-slate-400">
                                        <CourseInquiryDialog
                                            courseTitle={pageData.title}
                                            buttonClassName="w-full h-16 text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white uppercase tracking-[0.3em] rounded-2xl shadow-3xl shadow-emerald-600/30 transition-all active:scale-95 italic"
                                        />
                                        <Link
                                            href={pageData.whatsappLink}
                                            target="_blank"
                                            className="w-full h-14 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl flex items-center justify-center gap-3 group transition-all italic"
                                        >
                                            <Smartphone className="h-4 w-4 text-emerald-500 group-hover:animate-pulse" />
                                            WhatsApp: +91 90847 18101
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Celoris Certificate", color: "text-emerald-500" },
                                            { icon: MousePointer2, text: "Live Ad Practice", color: "text-blue-500" },
                                            { icon: MapPin, text: "Home Visits Available", color: "text-blue-500" },
                                            { icon: Clock, text: "Flexible Batches", color: "text-orange-500" },
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic group">
                                                <item.icon className={`h-5 w-5 ${item.color} group-hover:scale-110 transition-transform`} />
                                                <span>{item.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructor/Provider Card */}
                            <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                                <CardHeader className="pb-4 px-10 pt-10">
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Expert Trainers</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Celoris Marketing Team</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        Our trainers have managed ₹50L+ in real ad spends for Delhi NCR clients. Learn from practitioners, not just theorists.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>4.9/5 Rating</span>
                                        </div>
                                        <div className="text-slate-500">
                                            1,000+ Students
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Support Card */}
                            <div className="p-10 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 shadow-xl">
                                <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-6 flex items-center gap-3">
                                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                                    Support & Contact
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                        <Phone className="h-4 w-4 text-emerald-500" />
                                        <span>+91 90847 18101</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                        <Globe className="h-4 w-4 text-emerald-500" />
                                        <span>support@celorisdesigns.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
