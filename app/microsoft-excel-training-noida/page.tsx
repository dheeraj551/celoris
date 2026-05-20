"use client"

import { useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, Lightbulb, MapPin, Smartphone, MessageSquare, Phone, Globe, ShieldCheck, TrendingUp, BarChart3, Database, FileSpreadsheet, LayoutDashboard, BrainCircuit } from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ExcelTrainingNoida() {
    useEffect(() => {
        document.title = "Microsoft Excel Training in Noida | Celoris — Book Free Demo"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Looking for expert Microsoft Excel training in Noida? Join Celoris and learn from certified trainers. Online & offline batches. Book a free demo today!"
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
        title: "Microsoft Excel Training in Noida",
        subtitle: "Master Excel from basics to advanced — MIS, Pivot Tables, VLOOKUP, Macros & more.",
        heroDescription: "Learn from certified trainers with 13+ years of experience. Online & offline batches available across Noida, Sector 18, 62, 63, and Greater Noida.",
        whatsappNumber: "+91 90847 18101",
        whatsappLink: "https://wa.me/919084718101",
        overview: "Whether you are a working professional in Noida's IT sector, a fresher looking to improve your resume, or a business owner who wants to manage data better — our Microsoft Excel training in Noida is designed for you. Celoris offers flexible batches with expert-led instruction, covering everything from basic spreadsheets to advanced dashboards and automation.",
        courseDetails: [
            { label: "Course Name", value: "Microsoft Excel Training (Basic to Advanced)" },
            { label: "Location", value: "Noida — Sector 18, 62, 63, Greater Noida | Also Online" },
            { label: "Mode", value: "At Student's Home | At Trainer's Home | Online via Zoom/Meet" },
            { label: "Duration", value: "4–8 Weeks (flexible based on level)" },
            { label: "Batch Size", value: "1-on-1 or Small Group (max 5 students)" },
            { label: "Language", value: "Hindi + English (Hinglish)" },
            { label: "Certification", value: "Celoris Course Completion Certificate" },
        ],
        curriculum: [
            {
                module: "Module 1: Excel Basics (Week 1)",
                topics: [
                    "Introduction to Excel interface — ribbons, sheets, cells",
                    "Data entry, formatting, and basic formulas (SUM, AVERAGE, COUNT)",
                    "Cell references — absolute, relative, and mixed",
                    "Sorting, filtering, and basic data organization",
                    "Print settings and page layout"
                ],
                icon: FileSpreadsheet
            },
            {
                module: "Module 2: Intermediate Excel (Week 2–3)",
                topics: [
                    "Logical functions — IF, AND, OR, IFERROR",
                    "Lookup functions — VLOOKUP, HLOOKUP, INDEX-MATCH",
                    "Text functions — CONCATENATE, LEFT, RIGHT, MID, TRIM",
                    "Date & Time functions",
                    "Conditional Formatting",
                    "Named Ranges and Data Validation"
                ],
                icon: Database
            },
            {
                module: "Module 3: Data Analysis & Pivot Tables (Week 4)",
                topics: [
                    "Creating and customizing Pivot Tables",
                    "Pivot Charts for visual data analysis",
                    "Slicers and Timelines",
                    "Power Query basics — importing and transforming data",
                    "What-If Analysis — Goal Seek, Scenario Manager"
                ],
                icon: BarChart3
            },
            {
                module: "Module 4: Advanced Excel & Dashboards (Week 5–6)",
                topics: [
                    "Advanced charting — combo charts, waterfall, funnel",
                    "Interactive Dashboards with dynamic charts",
                    "MIS Reports — structure and automation",
                    "Array formulas and dynamic arrays (FILTER, SORT, UNIQUE)",
                    "Data connection — linking Excel with external sources"
                ],
                icon: LayoutDashboard
            },
            {
                module: "Module 5: Macros & VBA Basics (Week 7–8)",
                topics: [
                    "Recording and running Macros",
                    "Introduction to VBA editor",
                    "Writing simple VBA scripts for automation",
                    "Automating repetitive tasks — reports, formatting, emails",
                    "Error handling in VBA"
                ],
                icon: BrainCircuit
            }
        ],
        whyChooseUs: [
            "13+ years of training experience — 5,000+ students trained across Delhi NCR",
            "Certified trainers with real corporate experience in MIS, Analytics, and Finance",
            "1-on-1 attention — no large batches, no one gets left behind",
            "Flexible timing — early morning, evening, and weekend batches",
            "Trainers can come to your home in Noida/Greater Noida — zero commute",
            "Practical, project-based learning — real Excel files, real scenarios",
            "Lifetime access to course material and doubt-clearing support via WhatsApp",
            "Rated 4.8/5 by students — see reviews on celoris.in"
        ],
        whoIsItFor: [
            "Working professionals in IT, Finance, HR, Marketing, or Operations",
            "Students (BBA, B.Com, MBA, BCA) looking to strengthen their resume",
            "Business owners and entrepreneurs managing inventory, accounts, or sales data",
            "Freshers preparing for jobs that require MIS or data skills",
            "Housewives or career-returnees who want to upgrade skills"
        ],
        areasCovered: [
            "Sector 18, 22, 37, 44, 50, 62, 63, 125 — Noida",
            "Greater Noida West (Noida Extension) — Gaur City, Supertech Eco Village",
            "Knowledge Park, Alpha, Beta, Gamma, Delta — Greater Noida",
            "Indirapuram, Vaishali, Vasundhara — Ghaziabad (nearby)"
        ],
        testimonials: [
            {
                name: "Riya S.",
                location: "Noida Sector 62",
                text: "Found my Excel trainer on Celoris within a day and booked a demo the same evening. Super smooth experience.",
                rating: 5
            },
            {
                name: "Bhoomi Sharma",
                location: "Greater Noida",
                text: "Good platform overall. Trainer profiles are detailed and easy to filter by category. What is there is solid.",
                rating: 5
            }
        ],
        faq: [
            {
                question: "How much does Excel training cost in Noida?",
                answer: "Course fees vary by level and format. Basic Excel starts from ₹2,000–3,000 for a full course. Advanced batches and 1-on-1 sessions are priced separately. WhatsApp us for the exact fee: +91 90847 18101."
            },
            {
                question: "Can the trainer come to my home in Noida?",
                answer: "Yes! Celoris trainers offer home-visit sessions across Noida and Greater Noida sectors. You can also choose online sessions via Zoom or Google Meet if you prefer learning from home."
            },
            {
                question: "How long does it take to learn Excel?",
                answer: "Basic Excel can be covered in 2–3 weeks with regular sessions. Advanced Excel including dashboards and Macros takes 6–8 weeks. We customize the pace based on your goals."
            },
            {
                question: "Do I get a certificate after completing the course?",
                answer: "Yes, all students receive a Celoris Course Completion Certificate upon finishing the training and clearing the practical assessment."
            },
            {
                question: "Is this training good for job placements?",
                answer: "Excel skills are required in almost every industry. Our training focuses on MIS reports, data analysis, and dashboards — skills that are directly useful in Finance, HR, Marketing, and Operations roles in Noida's corporate sector."
            },
            {
                question: "Can I attend a free demo before enrolling?",
                answer: "Absolutely. We offer a free 30-minute demo session. Just WhatsApp us at +91 90847 18101 or visit celoris.in to book your slot."
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
        "name": "Celoris Microsoft Excel Training Noida",
        "image": "https://www.celoris.in/excel-noida.png",
        "@id": "https://www.celoris.in/microsoft-excel-training-noida",
        "url": "https://www.celoris.in/microsoft-excel-training-noida",
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
                    <span className="text-slate-100 line-clamp-1 italic">Excel Training Noida</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-emerald-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    Noida's #1 Choice
                                </span>
                                <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Expert-Led Training
                                </span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Book Free Demo
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">Microsoft Excel</span>
                                <span className="block">Training</span>
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
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Practice Files Included</span>
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
                                        src="/excel-noida.png"
                                        alt="Microsoft Excel Training Noida"
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
                                Course Pricing & Batches
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: "Basic Excel", price: "2,500", focus: "Essentials", duration: "2 Weeks" },
                                    { name: "Advanced Excel", price: "4,999", focus: "MIS & Dashboards", duration: "4 Weeks" },
                                    { name: "Mastery (VBA)", price: "8,000", focus: "Automation", duration: "8 Weeks" },
                                ].map((plan, i) => (
                                    <Card key={i} className="bg-[#0d1321]/40 border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:border-emerald-500/30 transition-all text-center">
                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic mb-2">{plan.name}</div>
                                        <div className="text-4xl font-black text-white italic tracking-tighter mb-4">₹{plan.price}</div>
                                        <div className="space-y-2 mb-8">
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.focus}</div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.duration}</div>
                                        </div>
                                        <CourseInquiryDialog 
                                            courseTitle={`${pageData.title} - ${plan.name}`}
                                            buttonClassName="w-full py-3 bg-white/5 border border-white/10 hover:bg-emerald-600 hover:text-white text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all italic"
                                        />
                                    </Card>
                                ))}
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
                                Full Curriculum
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
                                Why Learn from Celoris?
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
                                No prior Excel knowledge is required for the Basic batch. Advanced batch requires basic Excel familiarity.
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
                            <div className="flex flex-wrap gap-4">
                                {pageData.areasCovered.map((area, i) => (
                                    <div key={i} className="px-6 py-3 rounded-2xl bg-[#0d1321]/40 border border-white/5 text-sm font-black text-slate-400 uppercase italic tracking-widest hover:border-emerald-500/30 transition-all">
                                        {area}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-emerald-400 font-black uppercase italic tracking-[0.2em] pt-2">
                                Online sessions are available for students anywhere in India.
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
                                <Smartphone className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Ready to Start Learning?</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                Join 5,000+ students who have already upgraded their skills with Celoris. Book your free demo class today.
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
                            <span>Other Locations:</span>
                            <Link href="/microsoft-excel-training-gurgaon" className="hover:text-emerald-400 transition-colors">Gurgaon</Link>
                            <Link href="/microsoft-excel-training-delhi" className="hover:text-emerald-400 transition-colors">Delhi</Link>
                            <span>Related Courses:</span>
                            <Link href="/python-training-noida" className="hover:text-emerald-400 transition-colors">Python Noida</Link>
                            <Link href="/digital-marketing-course-noida" className="hover:text-emerald-400 transition-colors">Digital Marketing Noida</Link>
                            <Link href="/learn" className="hover:text-emerald-400 transition-colors">Trainer Listing</Link>
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
                                        <div className="text-2xl font-black text-white italic tracking-tighter uppercase">Noida Training</div>
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
                                            WhatsApp Inquiry
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Course Certificate", color: "text-emerald-500" },
                                            { icon: Users, text: "1-on-1 Attention", color: "text-blue-500" },
                                            { icon: MapPin, text: "Home Visits Available", color: "text-blue-500" },
                                            { icon: Clock, text: "Flexible Timing", color: "text-orange-500" },
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
                                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Training Provider</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Celoris Expert Team</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        Our trainers are industry veterans with over 13 years of experience in data analytics, MIS reporting, and financial automation.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-emerald-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>4.8/5 Rating</span>
                                        </div>
                                        <div className="text-slate-500">
                                            5,000+ Students
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Support Card */}
                            <div className="p-10 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 shadow-xl">
                                <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-6 flex items-center gap-3">
                                    <ShieldCheck className="h-6 w-6 text-emerald-500" />
                                    Course Support
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
