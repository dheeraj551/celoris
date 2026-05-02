"use client"

import { useEffect } from "react"
import { 
    ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, 
    Lightbulb, MapPin, Smartphone, MessageSquare, Phone, Globe, ShieldCheck, 
    TrendingUp, BarChart3, Target, Megaphone, Share2, Mail, FileText, MousePointer2, Search,
    Code2, Layout, Database, Server, Cpu, Github, Terminal
} from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function WebDevelopmentCourseNoida() {
    useEffect(() => {
        document.title = "Web Development Course in Noida | Celoris — Book Free Demo"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Learn web development in Noida from expert trainers. HTML, CSS, JavaScript, React, Node.js & more. Online & offline. Free demo available. Book today!"
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
        title: "Web Development Course in Noida",
        subtitle: "Learn HTML, CSS, JavaScript, React, Node.js, and full-stack web development from expert trainers with real industry experience.",
        heroDescription: "Online and offline batches available across Noida, Greater Noida, and Ghaziabad. Build a GitHub portfolio of real projects by the time you finish.",
        whatsappNumber: "+91 90847 18101",
        whatsappLink: "https://wa.me/919084718101",
        overview: "Web development is one of the highest-paying skills you can learn in Noida's IT sector. Whether you want a job at one of Noida's 1,000+ IT companies, go freelance, or build your own startup — Celoris web development training in Noida gives you practical, project-based skills that employers actually need.",
        courseDetails: [
            { label: "Course Name", value: "Web Development Training (Basic to Full Stack)" },
            { label: "Location", value: "Noida — Sector 18, 62, 63, 125, Greater Noida | Also Online" },
            { label: "Mode", value: "At Student's Home | At Trainer's Home | Online via Zoom/Meet" },
            { label: "Duration", value: "4–12 Weeks (based on level — Basic to Full Stack)" },
            { label: "Batch Size", value: "1-on-1 or Small Group (max 5 students)" },
            { label: "Language", value: "Hindi + English (Hinglish)" },
            { label: "Certification", value: "Celoris Course Completion Certificate" },
        ],
        curriculum: [
            {
                module: "Module 1: HTML & CSS Fundamentals (Week 1–2)",
                topics: [
                    "HTML5 — semantic structure, forms, tables, media elements",
                    "CSS3 — selectors, box model, flexbox, grid layout",
                    "Responsive design — mobile-first approach, media queries",
                    "CSS animations and transitions",
                    "Building your first static website from scratch"
                ],
                icon: Layout
            },
            {
                module: "Module 2: JavaScript (Week 3–5)",
                topics: [
                    "JavaScript fundamentals — variables, functions, loops, arrays, objects",
                    "DOM manipulation — selecting elements, events, dynamic content",
                    "ES6+ features — arrow functions, destructuring, spread, modules",
                    "Async JavaScript — promises, async/await, fetch API",
                    "Form validation and interactive UI components",
                    "Introduction to browser developer tools and debugging"
                ],
                icon: Code2
            },
            {
                module: "Module 3: React.js (Week 6–8)",
                topics: [
                    "React fundamentals — components, props, state, JSX",
                    "React Hooks — useState, useEffect, useContext, useReducer",
                    "React Router — multi-page applications and navigation",
                    "API integration — fetching real data from REST APIs",
                    "State management with Context API",
                    "Building and deploying a complete React application"
                ],
                icon: Zap
            },
            {
                module: "Module 4: Backend with Node.js & Express (Week 9–10)",
                topics: [
                    "Node.js fundamentals — event loop, modules, npm ecosystem",
                    "Express.js — routing, middleware, REST API design",
                    "Database integration — MongoDB basics with Mongoose",
                    "Authentication — JWT tokens, bcrypt password hashing",
                    "File uploads and environment variables",
                    "Deploying a Node.js API to the cloud"
                ],
                icon: Server
            },
            {
                module: "Module 5: Full Stack Projects & Deployment (Week 11–12)",
                topics: [
                    "Git and GitHub — version control, branching, pull requests",
                    "Building a full stack MERN application end-to-end",
                    "Deployment — Vercel for frontend, Railway/Render for backend",
                    "Portfolio setup on GitHub — 5 project showcases",
                    "Code review and best practices for production-ready code",
                    "Introduction to Next.js for modern full-stack development"
                ],
                icon: Database
            }
        ],
        pricing: [
            { name: "Basic (Frontend)", price: "2,500", focus: "Beginners, Students", duration: "4 Weeks", topics: "HTML, CSS, JavaScript basics" },
            { name: "Advanced (React)", price: "4,999", focus: "Job Seekers", duration: "8 Weeks", topics: "HTML + CSS + JS + React + API integration" },
            { name: "Full Stack (MERN)", price: "8,000", focus: "Career switchers, Freelancers", duration: "12 Weeks", topics: "Frontend + Backend + Database + Deployment" },
        ],
        whyChooseUs: [
            "Trainers with 5+ years of real industry experience building production applications",
            "Project-based learning — build 5+ real projects, not just tutorial follow-alongs",
            "GitHub portfolio ready by end of course — what employers actually check",
            "Small batches — maximum 5 students, 1-on-1 option available",
            "Home visit sessions across all Noida sectors and Greater Noida",
            "Flexible timing — morning, evening, and weekend batches",
            "Covers the exact tech stack used by Noida's top IT companies",
            "Lifetime WhatsApp support for doubt clearing after course completion",
            "Free 30-minute demo — try before you pay, no pressure"
        ],
        whoIsItFor: [
            "Freshers from BCA, B.Tech, MCA, or any degree looking for IT jobs in Noida",
            "Working professionals from non-IT backgrounds switching to web development",
            "Freelancers who want to build websites and web apps for clients",
            "Entrepreneurs who want to build their own web products without hiring a dev agency",
            "Students preparing for placements at Noida's IT companies and startups"
        ],
        comparison: [
            { feature: "Real project builds", celoris: "✅ 5+ projects", bootcamp: "✅ Some", youtube: "⚠️ Tutorial clones only" },
            { feature: "GitHub portfolio", celoris: "✅ Ready by end", bootcamp: "⚠️ Sometimes", youtube: "❌ You do it yourself" },
            { feature: "Home visit", celoris: "✅ Yes", bootcamp: "❌ No", youtube: "❌ No" },
            { feature: "Batch size", celoris: "✅ Max 5 / 1-on-1", bootcamp: "❌ 20-50 students", youtube: "❌ No interaction" },
            { feature: "Free demo", celoris: "✅ Yes", bootcamp: "❌ Rarely", youtube: "✅ Free always" },
            { feature: "Trainer experience", celoris: "✅ Industry verified", bootcamp: "⚠️ Varies", youtube: "⚠️ Unknown" },
            { feature: "Lifetime support", celoris: "✅ WhatsApp", bootcamp: "❌ No", youtube: "❌ No" },
            { feature: "Price", celoris: "₹2,500–8,000", bootcamp: "₹30,000–1,20,000", youtube: "Free–₹5,000" },
        ],
        jobs: [
            { role: "Frontend Developer", salary: "₹3L – ₹6L / year", skills: "HTML, CSS, JavaScript, React" },
            { role: "Backend Developer", salary: "₹4L – ₹8L / year", skills: "Node.js, Express, MongoDB/SQL" },
            { role: "Full Stack Developer", salary: "₹5L – ₹12L / year", skills: "MERN Stack + Deployment" },
            { role: "Junior Web Developer", salary: "₹2.5L – ₹4L / year", skills: "HTML, CSS, JS basics" },
            { role: "React Developer", salary: "₹4L – ₹9L / year", skills: "React, REST APIs, Git" },
            { role: "Freelance Web Developer", salary: "₹3L – ₹15L / year", skills: "Full stack + Client management" },
        ],
        areasCovered: [
            "Noida: Sector 18, 22, 37, 44, 50, 56, 62, 63, 76, 93, 100, 120, 125, 135, 137",
            "Greater Noida West: Gaur City, Supertech Eco Village, Amrapali Silicon City",
            "Greater Noida: Knowledge Park I–V, Alpha, Beta, Gamma, Delta, Omega",
            "Ghaziabad: Indirapuram, Vaishali, Vasundhara, Crossings Republik"
        ],
        testimonials: [
            {
                name: "Rahul T.",
                location: "Noida Sector 44",
                text: "Completed 5 real projects during the course — my GitHub portfolio helped me land a junior developer role in Noida Sector 62 within 3 weeks of finishing.",
                rating: 5
            },
            {
                name: "Sneha M.",
                location: "Indirapuram",
                text: "The trainer explained React in a way that finally made sense to me after months of trying to self-learn. Home visit sessions in Indirapuram were very convenient.",
                rating: 5
            }
        ],
        faq: [
            {
                question: "How much does a web development course cost in Noida?",
                answer: "At Celoris, web development training starts at ₹2,500 for the Basic Frontend plan (4 weeks). The Full Stack MERN plan is ₹8,000 for 12 weeks. All plans include real project builds and a completion certificate. WhatsApp us at +91 90847 18101 for details."
            },
            {
                question: "Can I learn web development without any coding background?",
                answer: "Yes. Our Basic plan starts from absolute zero — no prior coding knowledge needed. We teach HTML and CSS first before moving to JavaScript, so even complete beginners can follow along comfortably."
            },
            {
                question: "How long does it take to get a web development job after training?",
                answer: "Most students who complete the Full Stack course and build a solid GitHub portfolio land their first job within 1–3 months. Having real project work to show employers makes a significant difference compared to candidates with only certificates."
            },
            {
                question: "Can the trainer come to my home in Noida?",
                answer: "Yes. Celoris trainers offer home-visit sessions across all Noida sectors, Greater Noida, and Ghaziabad. You can also choose online sessions via Zoom or Google Meet if that is more convenient."
            },
            {
                question: "Which web development technology should I learn first in 2026?",
                answer: "Start with HTML, CSS, and JavaScript — these are the foundation of everything. Then add React for frontend jobs or Node.js for full stack. The MERN stack (MongoDB, Express, React, Node) is the most in-demand combination at Noida IT companies right now."
            },
            {
                question: "Do I get a certificate after the course?",
                answer: "Yes. All students receive a Celoris Course Completion Certificate upon finishing the training and projects. You also leave with a GitHub portfolio of 5+ real projects — which is what most Noida employers actually look at during hiring."
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
        "name": "Celoris Web Development Training Noida",
        "image": "https://www.celorisdesigns.com/webdev_noida.png",
        "@id": "https://www.celorisdesigns.com/web-development-course-noida",
        "url": "https://www.celorisdesigns.com/web-development-course-noida",
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
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-blue-500/30">
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
                    <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-blue-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1 italic">Web Development Course Noida</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    Noida's #1 Dev Training
                                </span>
                                <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Full Stack MERN
                                </span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Book Free Demo
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">Web Development</span>
                                <span className="block">Course</span>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-500 block tracking-normal mt-2">
                                    in Noida
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-blue-400/90 font-black italic uppercase tracking-tight">
                                {pageData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {pageData.heroDescription}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <Github className="h-5 w-5 text-blue-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">GitHub Portfolio</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <Award className="h-5 w-5 text-blue-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Celoris Certificate</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <ShieldCheck className="h-5 w-5 text-blue-500" />
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
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                            <Card className="relative overflow-hidden border-0 bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] shadow-3xl">
                                <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-[#00120d]">
                                    <img
                                        src="/webdev_noida.png"
                                        alt="Web Development Course Noida"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                                </div>
                            </Card>
                        </div>

                        {/* Pricing Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Zap className="h-8 w-8 text-blue-500" />
                                </div>
                                Course Pricing & Plans
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {pageData.pricing.map((plan, i) => (
                                    <Card key={i} className={`bg-[#0d1321]/40 border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:border-blue-500/30 transition-all text-center flex flex-col ${i === 2 ? 'border-blue-500/30 ring-1 ring-blue-500/20' : ''}`}>
                                        <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic mb-2">{plan.name}</div>
                                        <div className="text-4xl font-black text-white italic tracking-tighter mb-4">₹{plan.price}</div>
                                        <div className="space-y-2 mb-8 flex-1">
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.focus}</div>
                                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">{plan.duration}</div>
                                            <div className="text-[10px] font-bold text-slate-400 italic mt-4">{plan.topics}</div>
                                        </div>
                                        <CourseInquiryDialog 
                                            courseTitle={`${pageData.title} - ${plan.name}`}
                                            buttonClassName="w-full py-3 bg-white/5 border border-white/10 hover:bg-blue-600 hover:text-white text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-xl transition-all italic"
                                        />
                                    </Card>
                                ))}
                            </div>
                            <div className="p-6 rounded-[2rem] bg-blue-500/5 border border-blue-500/10 text-center">
                                <p className="text-sm font-black text-blue-400 uppercase italic tracking-widest">
                                    ✓ 5+ real project builds   ✓ GitHub portfolio ready   ✓ Celoris Certificate   ✓ Lifetime WhatsApp Support
                                </p>
                            </div>
                        </section>

                        {/* Course Overview */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <BookOpen className="h-8 w-8 text-blue-500" />
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
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Terminal className="h-8 w-8 text-emerald-500" />
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
                                                    <div className="bg-[#00120d] p-4 rounded-2xl border border-blue-500/20 shadow-inner">
                                                        <Icon className="h-7 w-7 text-blue-500" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-xl font-black text-white uppercase italic tracking-tighter">{item.module}</div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6 text-slate-400 opacity-100 visible">
                                                <div className="pl-6 sm:pl-20 space-y-4 relative">
                                                    <div className="absolute left-0 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/30 via-blue-500/10 to-transparent" />
                                                    <div className="flex flex-col gap-4">
                                                        {item.topics && item.topics.map((topic, topicIndex) => (
                                                            <div key={topicIndex} className="flex items-start gap-4 group">
                                                                <div className="h-2 w-2 rounded-full bg-blue-500/40 mt-2.5 group-hover:bg-blue-500 transition-colors shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                                <span className="text-sm font-bold uppercase tracking-widest italic group-hover:text-blue-400 transition-colors leading-relaxed block">{topic}</span>
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
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Star className="h-8 w-8 text-blue-500" />
                                </div>
                                Why Learn Web Development from Celoris in Noida?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.whyChooseUs.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-blue-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-blue-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Who Is This Course For */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Users className="h-8 w-8 text-emerald-500" />
                                </div>
                                Who Is This Course For?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.whoIsItFor.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-emerald-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 font-bold uppercase italic tracking-widest pl-4 border-l-2 border-blue-500">
                                No prior coding knowledge required for the Basic plan. You start from absolute zero.
                            </p>
                        </section>

                        {/* Comparison Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <Share2 className="h-8 w-8 text-purple-500" />
                                </div>
                                Celoris vs Other Web Development Options in Noida
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-[#0d1321]/40 rounded-[2.5rem] overflow-hidden">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Feature</th>
                                            <th className="p-6 text-center text-[10px] font-black text-blue-500 uppercase tracking-widest italic bg-blue-500/5">Celoris</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Coding Bootcamp</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">YouTube/Udemy</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold italic uppercase tracking-tight">
                                        {pageData.comparison.map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-slate-300">{row.feature}</td>
                                                <td className="p-6 text-center text-blue-400 bg-blue-500/5">{row.celoris}</td>
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
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <BarChart3 className="h-8 w-8 text-blue-500" />
                                </div>
                                Web Development Jobs in Noida — What You Can Earn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {pageData.jobs.map((job, i) => (
                                    <div key={i} className="p-6 rounded-[2rem] bg-[#0d1321]/40 border border-white/5 hover:border-blue-500/20 transition-all flex flex-col justify-between">
                                        <div>
                                            <div className="text-lg font-black text-white italic uppercase tracking-tight">{job.role}</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">{job.skills}</div>
                                        </div>
                                        <div className="text-xl font-black text-blue-400 mt-4 italic">{job.salary}</div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 font-bold uppercase italic tracking-widest pl-4 border-l-2 border-emerald-500">
                                Noida's Sector 62, 63, and 125 corridor is home to hundreds of IT companies actively hiring web developers.
                            </p>
                        </section>

                        {/* Areas Covered */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <MapPin className="h-8 w-8 text-blue-500" />
                                </div>
                                Areas Covered in Noida
                            </h2>
                            <div className="space-y-6">
                                {pageData.areasCovered.map((area, i) => (
                                    <div key={i} className="p-6 rounded-2xl bg-[#0d1321]/40 border border-white/5 text-sm font-black text-slate-400 uppercase italic tracking-widest hover:border-blue-500/30 transition-all">
                                        {area}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-blue-400 font-black uppercase italic tracking-[0.2em] pt-2">
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
                                    <Card key={i} className="bg-[#0d1321]/40 border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:border-blue-500/20 transition-all">
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
                                    <div key={index} className="group bg-[#0d1321]/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/20 transition-all shadow-lg hover:shadow-blue-500/5">
                                        <div className="flex gap-6">
                                            <div className="text-2xl font-black text-white/10 group-hover:text-blue-500/20 transition-colors italic">Q{index + 1}</div>
                                            <div className="space-y-3">
                                                <h4 className="text-lg font-black text-white italic uppercase tracking-tight leading-tight group-hover:text-blue-400 transition-colors">{item.question}</h4>
                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">{item.answer}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Closing CTA banner */}
                        <div className="p-10 rounded-[3rem] bg-gradient-to-br from-blue-500/10 to-emerald-500/10 border border-white/5 relative overflow-hidden group shadow-3xl">
                            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-1000 group-hover:rotate-12">
                                <Cpu className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Your Web Development Journey Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                Join thousands of students who have already built real skills and real careers with Celoris. Book your free demo today.
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
                            <Link href="/web-development-course-gurgaon" className="hover:text-blue-400 transition-colors">Gurgaon</Link>
                            <Link href="/web-designing-course-noida" className="hover:text-blue-400 transition-colors">Web Designing Noida</Link>
                            <span>Related Courses:</span>
                            <Link href="/python-training-noida" className="hover:text-blue-400 transition-colors">Python Training</Link>
                            <Link href="/digital-marketing-course-noida" className="hover:text-blue-400 transition-colors">Digital Marketing</Link>
                            <span>From our Blog:</span>
                            <Link href="/blog/best-web-development-course-noida" className="hover:text-blue-400 transition-colors">Best Web Dev Course Noida</Link>
                            <Link href="/learn" className="hover:text-blue-400 transition-colors">Explore All Courses</Link>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10 space-y-10">
                            {/* Quick Contact Card */}
                            <Card className="relative bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 rounded-[3rem] overflow-hidden shadow-3xl">
                                <CardContent className="p-10">
                                    <div className="text-center mb-10">
                                        <div className="text-sm font-black text-blue-500 italic tracking-[0.3em] uppercase mb-2">Book Free Demo</div>
                                        <div className="text-2xl font-black text-white italic tracking-tighter uppercase">Web Development</div>
                                    </div>

                                    <div className="space-y-4 mb-10 text-slate-400">
                                        <CourseInquiryDialog
                                            courseTitle={pageData.title}
                                            buttonClassName="w-full h-16 text-xs font-black bg-blue-600 hover:bg-blue-500 text-white uppercase tracking-[0.3em] rounded-2xl shadow-3xl shadow-blue-600/30 transition-all active:scale-95 italic"
                                        />
                                        <Link
                                            href={pageData.whatsappLink}
                                            target="_blank"
                                            className="w-full h-14 border border-white/10 hover:bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[9px] rounded-2xl flex items-center justify-center gap-3 group transition-all italic"
                                        >
                                            <Smartphone className="h-4 w-4 text-blue-500 group-hover:animate-pulse" />
                                            WhatsApp: +91 90847 18101
                                        </Link>
                                    </div>

                                    <div className="space-y-6 pt-10 border-t border-white/5">
                                        {[
                                            { icon: Award, text: "Celoris Certificate", color: "text-blue-500" },
                                            { icon: Github, text: "GitHub Portfolio Ready", color: "text-emerald-500" },
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
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Celoris Tech Team</CardTitle>
                                </CardHeader>
                                <CardContent className="px-10 pb-10">
                                    <p className="text-xs text-slate-500 font-bold uppercase leading-relaxed italic mb-8">
                                        Trainers with 5+ years of real industry experience building production applications. Learn from practitioners, not just theorists.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-blue-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>4.9/5 Rating</span>
                                        </div>
                                        <div className="text-slate-500">
                                            2,500+ Students
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Support Card */}
                            <div className="p-10 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 shadow-xl">
                                <h3 className="text-white font-black italic uppercase tracking-tighter text-xl mb-6 flex items-center gap-3">
                                    <ShieldCheck className="h-6 w-6 text-blue-500" />
                                    Support & Contact
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                        <Phone className="h-4 w-4 text-blue-500" />
                                        <span>+91 90847 18101</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-relaxed group">
                                        <Globe className="h-4 w-4 text-blue-500" />
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
