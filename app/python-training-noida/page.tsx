"use client"

import { useEffect } from "react"
import { 
    ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, BookOpen, Zap, 
    Lightbulb, MapPin, Smartphone, MessageSquare, Phone, Globe, ShieldCheck, 
    TrendingUp, BarChart3, Target, Megaphone, Share2, Mail, FileText, MousePointer2, Search,
    Code2, Layout, Database, Server, Cpu, Github, Terminal, Binary
} from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function PythonTrainingNoida() {
    useEffect(() => {
        document.title = "Python Training in Noida | Celoris — Book Free Demo"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Learn Python in Noida from expert trainers. Data analysis, automation, AI/ML, web development & more. Online & offline. Free demo available. Book today!"
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
        title: "Python Training in Noida",
        subtitle: "Learn Python programming from basics to advanced — data analysis, automation, web development, and AI/ML applications.",
        heroDescription: "Taught by expert trainers with real industry experience. Online and offline batches available across Noida, Greater Noida, and Ghaziabad. Book Your FREE Demo Class Today.",
        whatsappNumber: "+91 90847 18101",
        whatsappLink: "https://wa.me/919084718101",
        overview: "Python is the world's most popular programming language and the foundation of India's fastest-growing career fields — data science, artificial intelligence, and automation. Whether you are a complete beginner, a working professional looking to upskill, or a business owner who wants to automate repetitive tasks, Celoris Python training in Noida is designed for your specific goals.",
        courseDetails: [
            { label: "Course Name", value: "Python Training (Basic to Advanced + AI/ML)" },
            { label: "Location", value: "Noida — Sector 18, 62, 63, 125, Greater Noida | Also Online" },
            { label: "Mode", value: "At Student's Home | At Trainer's Home | Online via Zoom/Meet" },
            { label: "Duration", value: "4–12 Weeks (Basic to Data Science/AI track)" },
            { label: "Batch Size", value: "1-on-1 or Small Group (max 5 students)" },
            { label: "Language", value: "Hindi + English (Hinglish)" },
            { label: "Certification", value: "Celoris Course Completion Certificate" },
            { label: "Contact", value: "+91 90847 18101 | support@celorisdesigns.com" }
        ],
        curriculum: [
            {
                module: "Module 1: Python Fundamentals (Week 1–2)",
                topics: [
                    "Python installation, IDE setup — VS Code, PyCharm, Jupyter Notebook",
                    "Variables, data types, operators, and expressions",
                    "Control flow — if/else, for loops, while loops, break/continue",
                    "Functions — defining, calling, arguments, return values, scope",
                    "Data structures — lists, tuples, dictionaries, sets",
                    "String manipulation — slicing, formatting, built-in methods",
                    "File handling — reading and writing text and CSV files",
                    "Error handling — try/except blocks and debugging techniques"
                ],
                icon: Lightbulb
            },
            {
                module: "Module 2: Intermediate Python (Week 3–4)",
                topics: [
                    "Object-Oriented Programming — classes, objects, inheritance, polymorphism",
                    "Modules and packages — importing, pip, virtual environments",
                    "List comprehensions and lambda functions",
                    "Regular expressions — pattern matching and text processing",
                    "Working with APIs — requests library, JSON parsing",
                    "Database basics — SQLite with Python, CRUD operations",
                    "Introduction to NumPy — arrays, operations, broadcasting"
                ],
                icon: Binary
            },
            {
                module: "Module 3: Data Analysis with Python (Week 5–6)",
                topics: [
                    "Pandas — DataFrames, Series, importing CSV/Excel data",
                    "Data cleaning — handling nulls, duplicates, data type conversion",
                    "Data manipulation — groupby, merge, pivot, apply",
                    "Data visualization — Matplotlib and Seaborn charts",
                    "Exploratory Data Analysis (EDA) on real datasets",
                    "Working with Excel files using openpyxl and pandas",
                    "Exporting analysis results to reports"
                ],
                icon: BarChart3
            },
            {
                module: "Module 4: Automation & Web Scraping (Week 7–8)",
                topics: [
                    "Task automation — automating file operations, email sending, reports",
                    "Web scraping — BeautifulSoup and requests for extracting web data",
                    "Selenium basics — browser automation for testing and scraping",
                    "Scheduling Python scripts with cron and Windows Task Scheduler",
                    "Building automation scripts for real business use cases"
                ],
                icon: Cpu
            },
            {
                module: "Module 5: AI/ML Introduction & Web Dev (Week 9–12)",
                topics: [
                    "Machine learning basics — supervised, unsupervised, regression, classification",
                    "Scikit-learn — training models, evaluation metrics, cross-validation",
                    "Flask basics — building simple web applications with Python",
                    "Introduction to OpenAI API and LLM integration with Python",
                    "Building a complete data project — end-to-end from data to insight",
                    "Deploying Python projects to cloud platforms"
                ],
                icon: Database
            }
        ],
        pricing: [
            { name: "Basic Python", price: "2,500", duration: "4 Weeks", focus: "Beginners, Students", topics: "Core Python, OOP, File Handling, APIs" },
            { name: "Data Analysis", price: "4,999", duration: "8 Weeks", focus: "Analysts, Professionals", topics: "Python + Pandas + Visualization + Automation" },
            { name: "AI/ML Mastery", price: "8,000", duration: "12 Weeks", focus: "Career Switchers, Developers", topics: "Full stack + ML + Flask + LLM Integration" }
        ],
        whyChooseUs: [
            "Trainers with real industry experience in data science, automation, and AI applications",
            "Project-based learning — 10+ real Python projects across data, automation, and web",
            "Small batches — maximum 5 students, 1-on-1 sessions available",
            "Home visit sessions across all Noida sectors and Greater Noida",
            "Covers the exact skills demanded by Noida's IT and analytics companies",
            "Flexible timing — morning, evening, and weekend batches",
            "Lifetime WhatsApp support — doubt clearing even after course completion",
            "Free 30-minute demo — try before you pay, no pressure whatsoever"
        ],
        whoIsItFor: [
            "Freshers from BCA, B.Tech, MCA, B.Sc wanting Python for job placements",
            "Working professionals in Excel/data roles who want to upgrade to Python",
            "Business owners who want to automate repetitive manual processes",
            "Aspiring data scientists and machine learning engineers",
            "Developers from other languages (Java, C++) switching to Python",
            "Digital marketers who want to automate reporting and data analysis"
        ],
        comparison: [
            { feature: "Real projects built", celoris: "✅ 10+ projects", local: "⚠️ Limited", youtube: "❌ Tutorial clones" },
            { feature: "AI/ML coverage", celoris: "✅ Yes", local: "⚠️ Extra cost", youtube: "⚠️ Separate course" },
            { feature: "Home visit", celoris: "✅ Yes", local: "❌ No", youtube: "❌ No" },
            { feature: "Batch size", celoris: "✅ Max 5 / 1-on-1", local: "❌ 20-40 students", youtube: "❌ No interaction" },
            { feature: "Free demo", celoris: "✅ Yes", local: "❌ Rarely", youtube: "✅ Always free" },
            { feature: "Lifetime support", celoris: "✅ WhatsApp", local: "❌ No", youtube: "❌ No" },
            { feature: "Certificate", celoris: "✅ Yes", local: "✅ Yes", youtube: "⚠️ Some" },
            { feature: "Price", celoris: "₹2,500–8,000", local: "₹15,000–60,000", youtube: "Free–₹5,000" }
        ],
        jobs: [
            { role: "Python Developer", salary: "₹3.5L – ₹8L / year", skills: "Core Python, OOP, APIs, Flask/Django" },
            { role: "Data Analyst", salary: "₹3L – ₹7L / year", skills: "Python, Pandas, SQL, Visualization" },
            { role: "Data Scientist", salary: "₹6L – ₹15L / year", skills: "Python, ML, Statistics, Scikit-learn" },
            { role: "Automation Engineer", salary: "₹3.5L – ₹7L / year", skills: "Python, Selenium, Scripting" },
            { role: "ML Engineer", salary: "₹8L – ₹20L / year", skills: "Python, ML, Deep Learning, Cloud" },
            { role: "Freelance Python Dev", salary: "₹3L – ₹15L / year", skills: "Python + any specialization" }
        ],
        areasCovered: [
            "Noida: Sector 18, 22, 37, 44, 50, 56, 62, 63, 76, 93, 100, 120, 125, 135, 137",
            "Greater Noida West: Gaur City, Supertech Eco Village, Amrapali Silicon City",
            "Greater Noida: Knowledge Park I–V, Alpha, Beta, Gamma, Delta, Omega",
            "Ghaziabad: Indirapuram, Vaishali, Vasundhara, Crossings Republik"
        ],
        testimonials: [
            {
                name: "Amit R.",
                location: "Noida Sector 62",
                text: "I was doing manual Excel reporting for 3 hours every day. After the Python automation module, I wrote a script that does the same job in 4 minutes. My manager was amazed.",
                rating: 5
            },
            {
                name: "Priyanka S.",
                location: "Greater Noida",
                text: "Started from zero coding knowledge. By the end of the data analysis track I had built 3 real projects using real datasets and landed a data analyst role at a Noida startup.",
                rating: 5
            }
        ],
        faq: [
            {
                question: "How much does Python training cost in Noida?",
                answer: "At Celoris, Python training starts at ₹2,500 for the Basic plan (4 weeks) and goes up to ₹8,000 for the AI/ML Mastery plan (12 weeks). All prices are transparent with no hidden fees. WhatsApp us at +91 90847 18101 for details."
            },
            {
                question: "Can I learn Python with no programming background?",
                answer: "Yes. Our Basic plan is designed for complete beginners. We start with variables and basic logic before progressing to data structures and functions. Many of our most successful students had never written a single line of code before joining."
            },
            {
                question: "Can the trainer come to my home in Noida?",
                answer: "Yes. Celoris trainers offer home-visit sessions across all Noida sectors, Greater Noida, and nearby Ghaziabad. Online sessions are also available via Zoom or Google Meet."
            },
            {
                question: "Is Python good for getting a job in Noida in 2026?",
                answer: "Absolutely. Python is the most in-demand programming language in Noida's IT and analytics sector. Whether you target data analysis, automation, web development, or AI/ML — Python is the entry point for all of these career paths."
            },
            {
                question: "How is Python different from web development courses?",
                answer: "Python is a general-purpose language used across data science, automation, AI, and web development. Web development courses (HTML, CSS, JavaScript, React) focus on building websites and frontend applications. Python is more powerful for data, automation, and AI work — but both are valuable depending on your goal."
            },
            {
                question: "Do I get a certificate after the course?",
                answer: "Yes. All students receive a Celoris Course Completion Certificate. You also leave with a GitHub portfolio of 10+ real Python projects — which is what employers in Noida's data and IT sector actually look at."
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
        "name": "Celoris Python Training Noida",
        "image": "https://www.celorisdesigns.com/python_noida.png",
        "@id": "https://www.celorisdesigns.com/python-training-noida",
        "url": "https://www.celorisdesigns.com/python-training-noida",
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
                    <span className="text-slate-100 line-clamp-1 italic">Python Training Noida</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    Noida's Best Tech Hub
                                </span>
                                <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    AI/ML & Automation
                                </span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Book Free Demo
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">Python Training</span>
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
                                    <Terminal className="h-5 w-5 text-blue-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Basic to Advanced</span>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0d1321]/40 border border-white/5">
                                    <Github className="h-5 w-5 text-blue-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">10+ Projects</span>
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
                                        src="/python_noida.png"
                                        alt="Python Training Noida"
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
                                Course Fees — Python Training Noida
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
                                    Every Plan Includes: ✓ 10+ coding projects ✓ GitHub portfolio ready ✓ Celoris Certificate ✓ Lifetime WhatsApp Support
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
                                Why Learn Python from Celoris in Noida?
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
                                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <Users className="h-8 w-8 text-indigo-500" />
                                </div>
                                Who Is This Course For?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pageData.whoIsItFor.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-6 rounded-[2.5rem] bg-[#0d1321]/40 border border-white/5 hover:border-indigo-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-1 group-hover:bg-indigo-500/20 transition-colors">
                                            <CheckCircle className="h-3.5 w-3.5 text-indigo-500" />
                                        </div>
                                        <span className="text-slate-300 text-sm font-bold uppercase tracking-wide leading-relaxed italic">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 font-bold uppercase italic tracking-widest pl-4 border-l-2 border-blue-500">
                                No prior programming experience required for the Basic plan. We start from absolute zero.
                            </p>
                        </section>

                        {/* Comparison Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <Share2 className="h-8 w-8 text-purple-500" />
                                </div>
                                Celoris vs Other Python Training Options in Noida
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-[#0d1321]/40 rounded-[2.5rem] overflow-hidden">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Feature</th>
                                            <th className="p-6 text-center text-[10px] font-black text-blue-500 uppercase tracking-widest italic bg-blue-500/5">Celoris</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Coding Institute</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">YouTube/Udemy</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold italic uppercase tracking-tight">
                                        {pageData.comparison.map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-slate-300">{row.feature}</td>
                                                <td className="p-6 text-center text-blue-400 bg-blue-500/5">{row.celoris}</td>
                                                <td className="p-6 text-center text-slate-500">{row.local}</td>
                                                <td className="p-6 text-center text-slate-500">{row.youtube}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Jobs Prospects */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <BarChart3 className="h-8 w-8 text-blue-500" />
                                </div>
                                Python Jobs in Noida — What You Can Earn
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
                                Noida's IT corridor — home to HCL, Wipro, Adobe, Info Edge, and hundreds of data-driven startups — is one of the strongest markets in India for Python professionals.
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
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Your Python Journey in Noida Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                Join thousands of students who have already built real skills with Celoris. Book your free demo class today.
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
                            <Link href="/python-training-gurgaon" className="hover:text-blue-400 transition-colors">Python Gurgaon</Link>
                            <span>Related Courses:</span>
                            <Link href="/web-development-course-noida" className="hover:text-blue-400 transition-colors">Web Development Noida</Link>
                            <Link href="/digital-marketing-course-noida" className="hover:text-blue-400 transition-colors">Digital Marketing Noida</Link>
                            <span>From our Blog:</span>
                            <Link href="/blog/best-python-training-noida" className="hover:text-blue-400 transition-colors">Best Python Training Noida</Link>
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
                                        <div className="text-2xl font-black text-white italic tracking-tighter uppercase">Python Training</div>
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
                                            <Smartphone className="h-4 w-4 text-emerald-500 group-hover:animate-pulse" />
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
                                        Trainers with real industry experience in data science, automation, and AI applications. Learn from practitioners, not just theorists.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-blue-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span>4.9/5 Rating</span>
                                        </div>
                                        <div className="text-slate-500">
                                            3,000+ Students
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
