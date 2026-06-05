"use client"

import { useEffect } from "react"
import { 
    Video, Film, MonitorPlay, Scissors, Wand2, Layers, Youtube, Instagram, Clapperboard, Briefcase, Camera, Music,
    Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, 
    Lightbulb, MapPin, Smartphone, MessageSquare, Phone, Globe, ShieldCheck, 
    TrendingUp, BarChart3, Target, Megaphone, Share2, Mail, FileText, MousePointer2, Search, Cpu
} from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function VideoEditingCourseNoida() {
    useEffect(() => {
        document.title = "Video Editing Course in Noida | Celoris — Book Free Demo"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Learn video editing in Noida — Premiere Pro, After Effects, CapCut & DaVinci Resolve. Online & offline. Build a portfolio of 5+ real projects. Free demo available!"
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
        title: "Video Editing Course in Noida",
        subtitle: "Learn professional video editing from scratch — Adobe Premiere Pro, After Effects, CapCut, and DaVinci Resolve.",
        heroDescription: "Create YouTube videos, Instagram Reels, brand ads, and cinematic content. Build a portfolio of 5+ real video projects. Online and offline batches available across Noida, Greater Noida, and Ghaziabad.",
        whatsappNumber: "+91 90847 18101",
        whatsappLink: "https://wa.me/919084718101",
        overview: "Video is now the dominant content format across every platform — YouTube, Instagram Reels, LinkedIn, and brand websites. Noida's growing ecosystem of YouTube creators, content agencies, D2C brands, and corporate marketing teams all need skilled video editors. Celoris video editing course in Noida teaches you the complete professional toolkit — from basic cuts to colour grading, motion graphics, and Reels editing.",
        courseDetails: [
            { label: "Course Name", value: "Video Editing Training (Basic to Advanced)" },
            { label: "Location", value: "Noida — Sector 18, 22, 62, 63, 125, Greater Noida | Also Online" },
            { label: "Mode", value: "At Student's Home | At Trainer's Home | Online via Zoom/Meet" },
            { label: "Duration", value: "4–10 Weeks (Basic CapCut to Advanced Premiere Pro + After Effects)" },
            { label: "Batch Size", value: "1-on-1 or Small Group (max 5 students)" },
            { label: "Language", value: "Hindi + English (Hinglish)" },
            { label: "Certification", value: "Celoris Course Completion Certificate" },
        ],
        curriculum: [
            {
                module: "Module 1: Video Editing Fundamentals & CapCut (Week 1)",
                topics: [
                    "Understanding video formats — MP4, MOV, resolution (1080p, 4K), frame rates",
                    "CapCut for mobile and desktop — interface, timeline, basic cuts",
                    "Trimming, splitting, merging clips on timeline",
                    "Adding text, stickers, transitions, and basic effects",
                    "Exporting for Instagram Reels, YouTube Shorts, and WhatsApp status",
                    "Music sync and beat-based editing basics"
                ],
                icon: Smartphone
            },
            {
                module: "Module 2: Adobe Premiere Pro — Professional Editing (Week 2–4)",
                topics: [
                    "Premiere Pro interface — project panel, timeline, source monitor, program monitor",
                    "Importing media — organizing bins, proxies for smooth editing",
                    "Timeline editing — cuts, J-cuts, L-cuts, insert, overwrite, ripple trim",
                    "Audio editing — levels, noise reduction, music bed, voiceover sync",
                    "Colour correction — Lumetri Color panel, exposure, white balance, skin tones",
                    "Colour grading — LUTs, cinematic looks, consistency across clips",
                    "Titles and lower thirds — built-in templates and custom title design",
                    "Export settings — YouTube, Instagram, broadcast, client delivery formats"
                ],
                icon: Scissors
            },
            {
                module: "Module 3: After Effects — Motion Graphics & VFX (Week 5–7)",
                topics: [
                    "After Effects interface — composition, layers, timeline, effects panel",
                    "Keyframe animation — position, scale, rotation, opacity",
                    "Motion graphics — animated titles, logo reveals, lower thirds",
                    "Track matte and masking — creative compositing techniques",
                    "Text animation presets and custom kinetic typography",
                    "Green screen / chroma key — removing and replacing backgrounds",
                    "Transitions and stingers — professional broadcast-style effects",
                    "Dynamic Link — moving projects between Premiere Pro and After Effects"
                ],
                icon: Wand2
            },
            {
                module: "Module 4: YouTube & Social Media Video Production (Week 8)",
                topics: [
                    "YouTube video structure — hook, content, CTA for maximum retention",
                    "Thumbnail creation workflow — Photoshop + Premiere Pro integration",
                    "Instagram Reels editing — aspect ratios, hooks, trending formats",
                    "LinkedIn and corporate video editing — professional style and tone",
                    "Short-form content strategy — Reels vs Shorts vs TikTok format differences",
                    "Adding captions and subtitles — automated and manual workflows"
                ],
                icon: Youtube
            },
            {
                module: "Module 5: DaVinci Resolve & Portfolio Projects (Week 9–10)",
                topics: [
                    "DaVinci Resolve introduction — free alternative to Premiere Pro",
                    "Cut page for fast editing, Edit page for detailed work",
                    "Fusion basics — node-based compositing introduction",
                    "Fairlight audio — professional audio mixing in DaVinci",
                    "Building a video portfolio — 5 finished projects across formats",
                    "Freelance workflow — file management, client delivery, revision process"
                ],
                icon: MonitorPlay
            }
        ],
        pricing: [
            { name: "Basic", price: "2,500", focus: "Beginners, Content Creators", duration: "4 Weeks", topics: "CapCut + Premiere Pro basics, Reels & YouTube" },
            { name: "Advanced", price: "4,999", focus: "Job Seekers, YouTubers", duration: "8 Weeks", topics: "Premiere Pro + After Effects + Colour Grading + Portfolio" },
            { name: "Mastery (1-on-1)", price: "8,000", focus: "Freelancers, Agency editors", duration: "10 Weeks", topics: "Full stack + DaVinci Resolve + Client workflow" },
        ],
        whyChooseUs: [
            "Trainers with real YouTube, brand, and agency video editing experience",
            "Project-based — 5+ real videos edited and exported, ready for your portfolio",
            "Covers all major tools — CapCut, Premiere Pro, After Effects, DaVinci Resolve",
            "AI video tools covered — CapCut AI, Premiere Pro AI features, auto-captioning",
            "Small batches — maximum 5 students, 1-on-1 option available",
            "Home visit sessions across all Noida sectors and Greater Noida",
            "Flexible timing — morning, evening, and weekend batches",
            "Lifetime WhatsApp support — doubt clearing after course completion",
            "Free 30-minute demo — try before you pay, zero pressure"
        ],
        whoIsItFor: [
            "YouTube creators who want to edit their own videos professionally",
            "Instagram content creators who want to level up their Reels quality",
            "Freshers looking for video editor roles at agencies and production houses",
            "Social media managers who need to create video content in-house",
            "Freelancers who want to offer video editing services to clients",
            "Business owners who want to create brand videos and product ads"
        ],
        comparison: [
            { feature: "Real project portfolio", celoris: "✅ 5+ projects", bootcamp: "⚠️ Limited", youtube: "❌ Self-managed" },
            { feature: "After Effects covered", celoris: "✅ Yes", bootcamp: "⚠️ Extra cost", youtube: "⚠️ Separate course" },
            { feature: "DaVinci Resolve covered", celoris: "✅ Yes", bootcamp: "❌ Rarely", youtube: "⚠️ Separate course" },
            { feature: "Home visit", celoris: "✅ Yes", bootcamp: "❌ No", youtube: "❌ No" },
            { feature: "Batch size", celoris: "✅ Max 5 / 1-on-1", bootcamp: "❌ 15-30 students", youtube: "❌ No interaction" },
            { feature: "AI tools covered", celoris: "✅ Yes", bootcamp: "❌ Rarely", youtube: "⚠️ Some" },
            { feature: "Free demo", celoris: "✅ Yes", bootcamp: "❌ Rarely", youtube: "✅ Always free" },
            { feature: "Price", celoris: "₹2,500–8,000", bootcamp: "₹8,000–30,000", youtube: "Free–₹5,000" },
        ],
        jobs: [
            { role: "Video Editor", salary: "₹2.5L–5L / year", skills: "Premiere Pro, basic After Effects, colour grading" },
            { role: "Motion Graphics Designer", salary: "₹3.5L–7L / year", skills: "After Effects, animation, typography" },
            { role: "YouTube Video Editor", salary: "₹2.5L–5L / year", skills: "Premiere Pro, thumbnails, retention editing" },
            { role: "Social Media Video Editor", salary: "₹2.5L–4.5L / year", skills: "CapCut, Premiere Pro, Reels formats" },
            { role: "Corporate Video Editor", salary: "₹3L–6L / year", skills: "Premiere Pro, colour grading, client workflow" },
            { role: "Freelance Video Editor", salary: "₹3L–15L / year", skills: "Any specialization + client management" },
        ],
        areasCovered: [
            "Noida: Sector 18, 22, 37, 44, 50, 56, 62, 63, 76, 93, 100, 120, 125, 135, 137",
            "Greater Noida West: Gaur City, Supertech Eco Village, Amrapali Silicon City",
            "Greater Noida: Knowledge Park I–V, Alpha, Beta, Gamma, Delta, Omega",
            "Ghaziabad: Indirapuram, Vaishali, Vasundhara, Crossings Republik"
        ],
        testimonials: [
            {
                name: "Varun K.",
                location: "Noida Sector 62",
                text: "Started editing my own YouTube videos after the Premiere Pro module. My average watch time went from 2 minutes to 6 minutes after implementing the retention editing techniques.",
                rating: 5
            },
            {
                name: "Nikita S.",
                location: "Greater Noida West",
                text: "Got a freelance client within 3 weeks of finishing the course. Now editing Reels for 3 Noida businesses at ₹8,000 per client per month.",
                rating: 5
            }
        ],
        faq: [
            {
                question: "How much does a video editing course cost in Noida?",
                answer: "At Celoris, video editing training starts at ₹2,500 for the Basic plan (4 weeks) and goes up to ₹8,000 for the Mastery 1-on-1 plan (10 weeks). All prices are transparent with no hidden fees. WhatsApp us at +91 90847 18101 for details."
            },
            {
                question: "Which software should I learn first — Premiere Pro or CapCut?",
                answer: "Start with CapCut if you primarily create content for Instagram Reels and YouTube Shorts — it is faster for short-form content. Learn Premiere Pro if you want professional-level editing for YouTube, brand videos, and client work. Our Basic plan covers both so you can make the choice during the course."
            },
            {
                question: "Do I need an expensive computer for video editing?",
                answer: "Premiere Pro and After Effects require a reasonably powerful computer — minimum 16GB RAM, dedicated GPU recommended. DaVinci Resolve free version runs on more modest hardware. CapCut works on any modern laptop or phone. Your trainer will assess your setup in the demo session and advise accordingly."
            },
            {
                question: "Can the trainer come to my home in Noida?",
                answer: "Yes. Celoris trainers offer home-visit sessions across all Noida sectors, Greater Noida, and nearby Ghaziabad. Online sessions are also available via Zoom or Google Meet."
            },
            {
                question: "Is video editing a good career in 2026?",
                answer: "Yes — video content demand is at an all-time high and still growing. Every brand, creator, and business needs video. Video editors who understand both technical editing and content strategy (retention, hooks, platform formats) are especially in demand."
            },
            {
                question: "Do I get a certificate after the course?",
                answer: "Yes. All students receive a Celoris Course Completion Certificate plus a portfolio of 5+ real edited video projects — which is what employers and freelance clients want to see."
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
        "name": "Celoris Video Editing Course Noida",
        "image": "https://www.celorisdesigns.com/vid_edit_noida.png",
        "@id": "https://www.celorisdesigns.com/video-editing-course-noida",
        "url": "https://www.celorisdesigns.com/video-editing-course-noida",
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
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ],
            "opens": "08:00",
            "closes": "21:00"
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-purple-500/30">
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
                    <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-purple-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic">Video Editing Course Noida</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    Noida's #1 Editing Training
                                </span>
                                <span className="bg-pink-600/20 text-pink-400 border border-pink-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Premiere Pro + AE
                                </span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Book Free Demo
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">Video Editing</span>
                                <span className="block">Course</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 block tracking-normal mt-2">
                                    in Noida
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-purple-400/90 font-black italic uppercase tracking-tight">
                                {pageData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {pageData.heroDescription}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <Video className="h-5 w-5 text-purple-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">5+ Real Projects</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <Award className="h-5 w-5 text-purple-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Celoris Certificate</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <ShieldCheck className="h-5 w-5 text-purple-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Lifetime Support</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link 
                                    href={pageData.whatsappLink}
                                    target="_blank"
                                    className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-black uppercase tracking-widest italic rounded-2xl shadow-3xl shadow-pink-600/30 transition-all flex items-center gap-3"
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
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/vid_edit_noida.png"
                                        alt="Video Editing Course Noida"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null; 
                                            target.src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1600&q=80";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                </div>
                            </Card>
                        </div>

                        {/* Pricing Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <Zap className="h-8 w-8 text-purple-500" />
                                </div>
                                Course Pricing & Plans
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {pageData.pricing.map((plan, i) => (
                                    <Card key={i} className={`bg-[#0d1321]/40 border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:border-purple-500/30 transition-all text-center flex flex-col ${i === 1 ? 'border-purple-500/30 ring-1 ring-purple-500/20' : ''}`}>
                                        <div className="text-[10px] font-black text-purple-500 uppercase tracking-widest italic mb-2">{plan.name}</div>
                                        <div className="text-4xl font-black text-white italic tracking-tighter mb-4">₹{plan.price}</div>
                                        <div className="space-y-2 mb-8 flex-1">
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.focus}</div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.duration}</div>
                                            <div className="text-[10px] font-bold text-slate-400 italic mt-4">{plan.topics}</div>
                                        </div>
                                        <CourseInquiryDialog 
                                            courseTitle={`${pageData.title} - ${plan.name}`}
                                            buttonClassName="w-full py-3 bg-white/5 border border-white/10 hover:bg-purple-600 hover:text-white text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all italic"
                                        />
                                    </Card>
                                ))}
                            </div>
                            <div className="p-6 rounded-[2rem] bg-purple-500/5 border border-purple-500/10 text-center">
                                <p className="text-sm font-black text-purple-400 uppercase italic tracking-widest">
                                    ✓ 5+ real project builds   ✓ Export-ready portfolio files   ✓ Celoris Certificate   ✓ Lifetime WhatsApp Support
                                </p>
                            </div>
                        </section>

                        {/* Course Overview */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <BookOpen className="h-8 w-8 text-purple-500" />
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
                                <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20">
                                    <Film className="h-8 w-8 text-pink-500" />
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
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-purple-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-purple-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{item.module}</div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400 opacity-100 visible">
                                                <div className="pl-6 sm:pl-20 space-y-4 relative">
                                                    <div className="absolute left-0 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/30 via-purple-500/10 to-transparent" />
                                                    <div className="flex flex-col gap-4">
                                                        {item.topics && item.topics.map((topic, topicIndex) => (
                                                            <div key={topicIndex} className="flex items-start gap-4 group">
                                                                <div className="h-2 w-2 rounded-full bg-purple-500/40 mt-2.5 group-hover:bg-purple-500 transition-colors shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                                                                <span className="text-sm font-bold uppercase tracking-widest italic group-hover:text-purple-400 transition-colors leading-relaxed block">{topic}</span>
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
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <Star className="h-8 w-8 text-purple-500" />
                                </div>
                                Why Learn Video Editing from Celoris in Noida?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.whyChooseUs.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-purple-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-purple-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-purple-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Who Is This Course For */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20">
                                    <Users className="h-8 w-8 text-pink-500" />
                                </div>
                                Who Is This Course For?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.whoIsItFor.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-pink-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-pink-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-pink-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-pink-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 font-bold uppercase italic tracking-widest pl-4 border-l-2 border-purple-500">
                                No prior video editing experience required. We start from absolute basics.
                            </p>
                        </section>

                        {/* Comparison Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <Share2 className="h-8 w-8 text-indigo-500" />
                                </div>
                                Celoris vs Other Video Editing Options in Noida
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-[#0d1321]/40 rounded-[2.5rem] overflow-hidden">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Feature</th>
                                            <th className="p-6 text-center text-[10px] font-black text-purple-500 uppercase tracking-widest italic bg-purple-500/5">Celoris</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Local Institute</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">YouTube/Udemy</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold italic uppercase tracking-tight">
                                        {pageData.comparison.map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-slate-300">{row.feature}</td>
                                                <td className="p-6 text-center text-purple-400 bg-purple-500/5">{row.celoris}</td>
                                                <td className="p-6 text-center text-slate-500">{row.bootcamp}</td>
                                                <td className="p-6 text-center text-slate-500">{row.youtube}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Job Prospects */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <BarChart3 className="h-8 w-8 text-purple-500" />
                                </div>
                                Video Editing Jobs in Noida — What You Can Earn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pageData.jobs.map((job, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 hover:border-purple-500/20 transition-all flex flex-col justify-between">
                                        <div>
                                            <div className="text-lg font-black text-white italic uppercase tracking-tight">{job.role}</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">{job.skills}</div>
                                        </div>
                                        <div className="text-xl font-black text-purple-400 mt-4 italic">{job.salary}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 font-bold uppercase italic tracking-widest pl-4 border-l-2 border-pink-500">
                                Noida's growing YouTube creator economy, D2C brand content teams, and digital marketing agencies create consistent demand for skilled video editors at every experience level.
                            </p>
                        </section>

                        {/* Areas Covered */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <MapPin className="h-8 w-8 text-purple-500" />
                                </div>
                                Areas Covered in Noida
                            </h2>
                            <div className="space-y-6">
                                {pageData.areasCovered.map((area, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-[#0d1321]/40 border border-white/5 text-sm font-black text-slate-400 uppercase italic tracking-widest hover:border-purple-500/30 transition-all">
                                        {area}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-purple-400 font-black uppercase italic tracking-[0.2em] pt-2">
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
                                    <Card key={i} className="bg-[#0d1321]/40 border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:border-purple-500/20 transition-all">
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
                                    <div key={index} className="group bg-[#0d1321]/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-purple-500/20 transition-all shadow-lg hover:shadow-purple-500/5">
                                        <div className="flex gap-6">
                                            <div className="text-2xl font-black text-white/10 group-hover:text-purple-500/20 transition-colors italic">Q{index + 1}</div>
                                            <div className="space-y-3">
                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight leading-tight group-hover:text-purple-400 transition-colors">{item.question}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Closing CTA banner */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Video className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Your Video Editing Journey Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                Join thousands of students who have already built real creative skills with Celoris. Book your free demo today.
                            </p>
                            <div className="flex flex-wrap gap-4 relative z-10">
                                <Link 
                                    href={pageData.whatsappLink}
                                    target="_blank"
                                    className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-black uppercase tracking-widest italic rounded-2xl shadow-3xl transition-all flex items-center gap-3"
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
                            <Link href="/video-editing-course-gurgaon" className="hover:text-purple-400 transition-colors">Gurgaon</Link>
                            <span>Related Courses:</span>
                            <Link href="/adobe-premiere-course-noida" className="hover:text-purple-400 transition-colors">Premiere Pro Training</Link>
                            <Link href="/after-effects-course-noida" className="hover:text-purple-400 transition-colors">After Effects Training</Link>
                            <Link href="/social-media-marketing-course-noida" className="hover:text-purple-400 transition-colors">Social Media Marketing</Link>
                            <span>From our Blog:</span>
                            <Link href="/blog/best-video-editing-course-noida" className="hover:text-purple-400 transition-colors">Best Video Editing Course Noida</Link>
                            <Link href="/learn" className="hover:text-purple-400 transition-colors">View All Courses</Link>
                        </div>
                    </div>

                    {/* Sidebar / Right Column */}
                    <div className="hidden lg:block space-y-8">
                        <div className="sticky top-8 space-y-6">
                            <Card className="bg-[#0d1321]/40 border-white/5 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl">
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">Quick Contact</h3>
                                <p className="text-slate-400 text-sm mb-6">Need help choosing the right batch? Speak to our counselor directly.</p>
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-5 w-5 text-purple-500" />
                                        <span className="text-slate-300 font-bold">+91 90847 18101</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="h-5 w-5 text-purple-500" />
                                        <span className="text-slate-300 font-bold">support@celorisdesigns.com</span>
                                    </div>
                                </div>
                                <CourseInquiryDialog 
                                    courseTitle={pageData.title}
                                    buttonClassName="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all italic"
                                />
                            </Card>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
