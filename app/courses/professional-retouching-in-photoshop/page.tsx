"use client"

import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download, Layout, Target, Monitor, Layers } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function ProfessionalRetouchingCourse() {
    const courseData = {
        title: "Professional Retouching in Photoshop Using AI Tools",
        description: "Master skin retouching, compositing, AI-powered editing & studio-grade output",
        summary: "This course is designed for photographers, graphic designers, content creators, and digital artists who want to elevate their retouching skills to a professional level — harnessing both Photoshop's classic toolkit and the cutting-edge AI-powered features that are reshaping the industry.",
        students: 1240,
        rating: 4.9,
        duration: "16+ Hours | 8 Modules | 32 Lessons",
        price: 4999.00,
        currency: "INR",
        provider: "Celoris Training",
        instructor: "Celoris Team",
        learning_outcomes: [
            "Perform studio-grade skin retouching using frequency separation and dodge & burn",
            "Leverage Photoshop's AI tools: Generative Fill, Neural Filters, Remove Tool, Sky Replacement",
            "Build efficient, non-destructive editing workflows with Smart Objects and adjustment layers",
            "Retouch hair, clothing, and product shots to commercial standards",
            "Create seamless composites using AI-assisted masking and blending",
            "Deliver final files in correct formats for print, web, and social media",
            "Build a professional retouching portfolio"
        ],
        requirements: [
            "Basic familiarity with Photoshop's interface (layers, basic tools)",
            "A computer running Photoshop 2023 or later (Creative Cloud subscription recommended)",
            "No prior AI tool experience required — everything is taught from scratch"
        ],
        syllabus: [
            {
                unit: "Module 01 — Foundations & Workspace Setup",
                focus: "Build the right habits and environment before you touch a single pixel",
                chapters: [
                    { title: "Lesson 1.1 — Photoshop 2024–2025 Interface: What's New with AI", desc: "18 min Video" },
                    { title: "Lesson 1.2 — Color Settings, Monitor Calibration & File Formats", desc: "22 min Video" },
                    { title: "Lesson 1.3 — Setting Up a Non-Destructive Layer Structure", desc: "20 min Video" },
                    { title: "Lesson 1.4 — Introduction to Photoshop's AI Features", desc: "Generative Fill, Neural Filters & More. 25 min Video" }
                ]
            },
            {
                unit: "Module 02 — Non-Destructive Retouching Workflow",
                focus: "Clean, reversible, professional-grade editing from day one",
                chapters: [
                    { title: "Lesson 2.1 — Masking Fundamentals", desc: "Pixel, Vector & Luminosity Masks. 24 min Video" },
                    { title: "Lesson 2.2 — Adjustment Layers", desc: "For Exposure, Tone & Colour. 20 min Video" },
                    { title: "Lesson 2.3 — Smart Filters & Smart Objects", desc: "For Retouching workflows. 18 min Video" },
                    { title: "Lesson 2.4 — Stamped Layers & History Strategy", desc: "Snapshot & History Strategy. 15 min Video" }
                ]
            },
            {
                unit: "Module 03 — AI-Powered Skin Retouching",
                focus: "Studio-grade skin from Natural Portrait to High Fashion",
                chapters: [
                    { title: "Lesson 3.1 — Frequency Separation", desc: "Texture vs Tone Retouching. 30 min Video" },
                    { title: "Lesson 3.2 — Dodge & Burn with Curves", desc: "Sculpting Light on Skin. 28 min Video" },
                    { title: "Lesson 3.3 — Neural Filters", desc: "Skin Smoothing, Depth Blur & Face-Aware Liquify. 25 min Video" },
                    { title: "Lesson 3.4 — Generative Fill for Blemish Removal", desc: "Healing Workflows. 22 min Video" }
                ]
            },
            {
                unit: "Module 04 — Hair, Clothing & Product Retouching",
                focus: "Extend your skills beyond skin — tackle every element in the frame",
                chapters: [
                    { title: "Lesson 4.1 — Hair Retouching", desc: "Flyaways, Volume & AI Select Hair Mask. 26 min Video" },
                    { title: "Lesson 4.2 — Clothing & Fabric", desc: "Wrinkle Removal, Lint & Logo Clean-Up. 22 min Video" },
                    { title: "Lesson 4.3 — AI Remove Tool", desc: "Distractions, Objects & Background Elements. 18 min Video" },
                    { title: "Lesson 4.4 — Product & E-Commerce Retouching", desc: "With AI Assistance. 28 min Video" }
                ]
            },
            {
                unit: "Module 05 — Background & Environment Editing",
                focus: "Transform scenes with Sky Replacement, Generative Fill",
                chapters: [
                    { title: "Lesson 5.1 — Sky Replacement", desc: "Automatic AI Masking & Light Adaptation. 24 min Video" },
                    { title: "Lesson 5.2 — Background Removal", desc: "Clean Plate Generation with AI. 20 min Video" },
                    { title: "Lesson 5.3 — Generative Fill", desc: "Extending Backgrounds & Adding Elements. 30 min Video" },
                    { title: "Lesson 5.4 — Matching Light, Colour & Perspective", desc: "Across Composite Layers. 26 min Video" }
                ]
            },
            {
                unit: "Module 06 — Advanced Compositing with AI",
                focus: "Seamlessly blend multiple images into one cohesive final image",
                chapters: [
                    { title: "Lesson 6.1 — AI Subject Selection", desc: "Advanced Masking with Properties Panel. 28 min Video" },
                    { title: "Lesson 6.2 — Blend-If & Luminosity Masks", desc: "Luminosity Masks & Edge Light Matching. 25 min Video" },
                    { title: "Lesson 6.3 — Depth & Atmosphere", desc: "AI Depth Blur & Haze Effects. 22 min Video" },
                    { title: "Lesson 6.4 — Full Composite Project", desc: "Fashion Editorial from Scratch. 45 min Project" }
                ]
            },
            {
                unit: "Module 07 — Color Grading & Final Touches",
                focus: "The look that makes a retouch unforgettable",
                chapters: [
                    { title: "Lesson 7.1 — Curves, Hue/Saturation", desc: "Selective Colour Grading. 24 min Video" },
                    { title: "Lesson 7.2 — Gradient Map Colour Grading", desc: "Luminosity Blending. 20 min Video" },
                    { title: "Lesson 7.3 — LUTs & Camera Raw AI", desc: "Lightroom-Photoshop Roundtrip. 22 min Video" },
                    { title: "Lesson 7.4 — Final Sharpening & Export Workflow", desc: "Output Sizing & Format Export Workflow. 18 min Video" }
                ]
            },
            {
                unit: "Module 08 — Delivery, Portfolio & Freelancing",
                focus: "Turn your skills into a career or income stream",
                chapters: [
                    { title: "Lesson 8.1 — Building a Retouching Portfolio", desc: "Curation, Presentation & Platform. 20 min Video" },
                    { title: "Lesson 8.2 — Client Workflow", desc: "Briefs, Revisions & Delivering Final Assets. 18 min Video" },
                    { title: "Lesson 8.3 — Pricing Retouching Services", desc: "Hourly vs Per-Image vs Package. 16 min Video" },
                    { title: "Lesson 8.4 — Capstone Project Review", desc: "Next Steps. 30 min Project" }
                ]
            }
        ],
        faqs: [
            {
                question: "Do I need any prior AI tool experience?",
                answer: "No prior AI tool experience is required. We will teach you everything from scratch. However, basic familiarity with Photoshop's interface (layers, basic tools) is recommended."
            },
            {
                question: "Which version of Photoshop is required?",
                answer: "A computer running Photoshop 2023 or later is required. A Creative Cloud subscription is highly recommended to access all the latest AI capabilities like Generative Fill and Neural Filters."
            },
            {
                question: "Does Generative Fill require an internet connection?",
                answer: "Yes, currently Adobe's Generative Fill and some Neural Filters cloud processing require an active internet connection to generate results."
            },
            {
                question: "Will I get practice files?",
                answer: "Absolutely. All practice RAW files, PSD templates, LUTs, and project assets are provided in the course resource pack."
            },
            {
                question: "Is there a certification provided?",
                answer: "Yes, students who score 70% or above across all assessments receive a Celoris Certificate of Completion in Professional Retouching, issued as a digitally verifiable credential."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": courseData.title,
        "description": courseData.description,
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs LLP",
            "sameAs": "https://celoris.in"
        },
        "educationalLevel": "Intermediate",
        "offers": [
            {
                "@type": "Offer",
                "category": "CourseAccess",
                "price": courseData.price.toString(),
                "priceCurrency": "INR",
                "url": "https://celoris.in/courses/professional-retouching-in-photoshop"
            }
        ]
    }

    return (
        <div className="min-h-screen bg-[#050810] text-slate-300 py-8 selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-emerald-500">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-500">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-500">Courses</Link>
                    <span>/</span>
                    <span className="text-white line-clamp-1">{courseData.title}</span>
                </div>

                <Link href="/learn/courses" className="inline-flex items-center text-slate-500 hover:text-emerald-500 mb-6 group">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-emerald-500/30">Design & AI</span>
                                <span className="bg-white/5 px-4 py-1.5 rounded-full text-xs font-bold border border-white/5">16+ Hrs Content</span>
                                <span className="bg-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/30">Certificate</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tighter italic uppercase">
                                {courseData.title}
                            </h1>
                            <div className="bg-[#0a0f1d] p-8 rounded-[2.5rem] border-l-8 border-emerald-500 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Layers size={120} />
                                </div>
                                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-4">Course Intent</h2>
                                <p className="text-lg md:text-xl text-slate-200 leading-relaxed font-bold italic relative z-10">
                                    "{courseData.summary}"
                                </p>
                            </div>
                        </div>

                        {/* Course Image */}
                        <Card className="overflow-hidden border-none bg-transparent">
                            <div className="aspect-video relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl">
                                <img
                                    src="https://images.unsplash.com/photo-1561715276-a2d087060f1d?auto=format&fit=crop&q=80&w=800"
                                    alt="Photoshop and AI Retouching"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-60" />
                            </div>
                        </Card>

                        {/* What You'll Learn */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-4 md:p-8">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3 text-white text-3xl font-black italic uppercase tracking-tighter">
                                    <Target className="h-8 w-8 text-emerald-500" />
                                    <span>Learning Outcomes</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-4 group">
                                            <div className="mt-1 bg-emerald-500/20 p-2 rounded-xl border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                <CheckCircle className="h-4 w-4" />
                                            </div>
                                            <span className="text-slate-300 font-bold leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Curriculum */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-4 md:p-8">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3 text-white text-3xl font-black italic uppercase tracking-tighter">
                                    <BookOpen className="h-8 w-8 text-emerald-500" />
                                    <span>Course Curriculum</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="space-y-4">
                                    {courseData.syllabus.map((unit, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-white/5 bg-white/5 px-6 md:px-10 rounded-[2rem] overflow-hidden">
                                            <AccordionTrigger className="text-left font-black text-white hover:no-underline py-8 text-xl italic uppercase">
                                                {unit.unit}
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 space-y-6">
                                                <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4">Focus: {unit.focus}</p>
                                                <div className="space-y-4 pl-4 border-l-2 border-emerald-500/30">
                                                    {unit.chapters.map((chapter, cIndex) => (
                                                        <div key={cIndex} className="relative group">
                                                            <div className="absolute -left-[1.35rem] top-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors uppercase italic">{chapter.title}</h3>
                                                            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-medium italic">{chapter.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                            <CardTitle className="flex items-center space-x-3 text-white text-2xl font-black uppercase tracking-tighter mb-8 italic">
                                <Layout className="h-6 w-6 text-emerald-500" />
                                <span>Prerequisites</span>
                            </CardTitle>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                                {courseData.requirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span className="font-bold text-sm italic">{req}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* FAQs */}
                        <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                            <CardTitle className="flex items-center space-x-3 text-white text-2xl font-black uppercase tracking-tighter mb-8 italic">
                                <HelpCircle className="h-6 w-6 text-emerald-500" />
                                <span>Common Queries</span>
                            </CardTitle>
                            <Accordion type="single" collapsible className="space-y-3">
                                {courseData.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border-white/5">
                                        <AccordionTrigger className="text-left font-bold text-white hover:no-underline uppercase italic tracking-tight">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 leading-relaxed text-base pt-2 font-medium italic">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Stats Card */}
                            <Card className="bg-[#0d1426] border-2 border-emerald-500/30 rounded-[3rem] p-8 shadow-3xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-all" />
                                <div className="relative z-10">
                                    <div className="text-center mb-8">
                                        <div className="text-4xl font-black text-white mb-2 leading-none italic tracking-tighter">₹4,999</div>
                                        <div className="text-emerald-500 font-black uppercase tracking-[0.2em] text-[10px] italic">Full Course Access</div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        {[
                                            { icon: <Clock className="h-4 w-4" />, text: "16+ Hours of Video" },
                                            { icon: <Layers className="h-4 w-4" />, text: "8 Detailed Modules" },
                                            { icon: <Monitor className="h-4 w-4" />, text: "Project Assets Included" },
                                            { icon: <CheckCircle className="h-4 w-4" />, text: "Celoris Certificate" }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 text-slate-300 font-bold text-sm bg-white/5 p-4 rounded-2xl border border-white/5 transition-colors hover:bg-white/10 italic uppercase">
                                                <div className="text-emerald-500">{item.icon}</div>
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>

                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest h-16 rounded-[1.5rem] shadow-xl shadow-emerald-500/25 text-lg"
                                    />
                                    <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-widest mt-4">Lifetime Access Available</p>
                                </div>
                            </Card>

                            {/* Instructor Card */}
                            <Card className="bg-[#0a0f1d] border-white/5 rounded-[3rem] p-8">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-8 italic">Verified Provider</CardTitle>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-black text-xl border-2 border-white/10 shadow-lg">C</div>
                                    <div>
                                        <h3 className="font-black text-white text-lg leading-none mb-1">Celoris Team</h3>
                                        <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Design & AI Experts</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6 italic">
                                    Learn from experienced professionals combining traditional retouching finesse with cutting-edge AI generation techniques.
                                </p>
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                        <span className="text-white font-black text-sm">4.9</span>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">High Student Rating</div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
