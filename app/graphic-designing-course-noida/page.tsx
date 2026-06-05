"use client"

import { useEffect } from "react"
import { 
    Users, Star, Award, CheckCircle, BookOpen, Zap, 
    MapPin, MessageSquare, Globe, ShieldCheck, 
    Megaphone, Share2, Palette, Image as ImageIcon, PenTool, Printer, Briefcase, IndianRupee
} from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function GraphicDesigningCourseNoida() {
    useEffect(() => {
        document.title = "Graphic Designing Course in Noida | Celoris — Book Free Demo"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Learn graphic designing in Noida from expert trainers. Photoshop, Illustrator, InDesign, Canva & more. Online & offline. Free demo available. Book today!"
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
        title: "Graphic Designing Course in Noida",
        subtitle: "Master graphic design from fundamentals to professional-level work — Photoshop, Illustrator, InDesign, Canva, and brand identity design. Build a portfolio of 15+ real design projects.",
        heroDescription: "Online and offline batches available across Noida, Greater Noida, and Ghaziabad. Book Your FREE Demo Class Today.",
        whatsappNumber: "+91 90847 18101",
        whatsappLink: "https://wa.me/919084718101",
        overview: "Graphic design is one of the most versatile and in-demand creative skills in Noida's growing digital economy. From startups in the Expressway belt needing brand identities to e-commerce companies requiring product visuals and social media content — skilled graphic designers are needed everywhere. Celoris graphic designing course in Noida gives you the complete toolkit — both technical software skills and design thinking — to work as a professional designer.",
        courseDetails: [
            { label: "Course Name", value: "Graphic Designing Course (Basic to Advanced)" },
            { label: "Location", value: "Noida — Sector 18, 22, 62, 63, 125, Greater Noida | Also Online" },
            { label: "Mode", value: "At Student's Home | At Trainer's Home | Online via Zoom/Meet" },
            { label: "Duration", value: "4–10 Weeks (Basic to Full Professional track)" },
            { label: "Batch Size", value: "1-on-1 or Small Group (max 5 students)" },
            { label: "Language", value: "Hindi + English (Hinglish)" },
            { label: "Certification", value: "Celoris Course Completion Certificate" },
            { label: "Contact", value: "+91 90847 18101 | support@celorisdesigns.com" },
        ],
        curriculum: [
            {
                module: "Module 1: Design Fundamentals (Week 1)",
                topics: [
                    "Principles of design — balance, contrast, alignment, proximity, repetition",
                    "Color theory — color wheel, harmonies, psychology of color in branding",
                    "Typography fundamentals — typeface classification, pairing, hierarchy",
                    "Layout and composition — grid systems, white space, visual flow",
                    "Design brief analysis — understanding client requirements and deliverables"
                ],
                icon: Palette
            },
            {
                module: "Module 2: Adobe Photoshop for Designers (Week 2–3)",
                topics: [
                    "Non-destructive editing — layers, masks, smart objects",
                    "Photo retouching and manipulation for design work",
                    "Creating social media graphics, banners, and marketing collateral",
                    "Photo compositing — combining images for advertising visuals",
                    "Export settings for print and digital — resolution, color modes, formats"
                ],
                icon: ImageIcon
            },
            {
                module: "Module 3: Adobe Illustrator — Vector Design (Week 4–5)",
                topics: [
                    "Vector graphics fundamentals — paths, anchor points, bezier curves",
                    "Logo design — from concept to final vector artwork",
                    "Icon design and illustration — creating original vector assets",
                    "Typography as design — custom lettering and type manipulation",
                    "Brand identity elements — logos, color palettes, type systems",
                    "Packaging design basics — labels, boxes, product visuals"
                ],
                icon: PenTool
            },
            {
                module: "Module 4: Brand Identity & Print Design (Week 6–7)",
                topics: [
                    "Brand identity systems — logo, colors, fonts, stationery",
                    "Business card, letterhead, and envelope design",
                    "Brochure and flyer design — multi-page print layouts",
                    "Poster and banner design for print and outdoor advertising",
                    "Adobe InDesign basics — multi-page document design",
                    "Print-ready files — bleed, crop marks, CMYK, PDF/X standards"
                ],
                icon: Printer
            },
            {
                module: "Module 5: Digital & Social Media Design (Week 8–9)",
                topics: [
                    "Social media template systems — Instagram, Facebook, LinkedIn, YouTube",
                    "Motion graphics basics — animated social media posts in Photoshop",
                    "Email newsletter design — header, layout, CTA design",
                    "Website banner and display ad design",
                    "Canva for quick client deliverables — professional template customization",
                    "UI design basics — understanding screens, grids, and component design"
                ],
                icon: Share2
            },
            {
                module: "Module 6: Portfolio & Freelance Skills (Week 10)",
                topics: [
                    "Building a professional design portfolio — selecting and presenting work",
                    "Behance and LinkedIn profile optimization for designers",
                    "Freelance pricing — project-based vs retainer, how to quote clients",
                    "Client communication and design presentation skills",
                    "Getting first design clients in Noida — platforms, networking, cold outreach"
                ],
                icon: Briefcase
            }
        ],
        whyChooseUs: [
            "Trainers with real design industry experience — agency work, brand projects, client campaigns",
            "Portfolio-first — every student finishes with 15+ real design projects ready to show",
            "Complete Adobe toolkit — Photoshop, Illustrator, and InDesign all covered",
            "1-on-1 attention — maximum 5 students per batch, your work gets reviewed",
            "Home visit sessions across all Noida sectors and Greater Noida",
            "Design thinking taught alongside software — not just tool training",
            "Lifetime WhatsApp support — doubt clearing after course completion",
            "Free 30-minute demo — try before you pay, zero pressure"
        ],
        whoIsItFor: [
            "Students pursuing design, media, mass communication, or BFA looking for practical skills",
            "Marketing and social media professionals who need to create visuals in-house",
            "Entrepreneurs and business owners who want to design their own brand materials",
            "Photographers who want to add design skills to expand their services",
            "Freelancers who want to offer graphic design alongside their existing skills",
            "Career switchers from any field looking to enter the creative industry"
        ],
        areasCovered: [
            "Noida: Sector 18, 22, 37, 44, 50, 56, 62, 63, 76, 93, 100, 120, 125, 135, 137",
            "Greater Noida West: Gaur City, Supertech Eco Village, Amrapali Silicon City",
            "Greater Noida: Knowledge Park I–V, Alpha, Beta, Gamma, Delta, Omega",
            "Ghaziabad: Indirapuram, Vaishali, Vasundhara, Crossings Republik"
        ],
        testimonials: [
            {
                name: "Kavya T.",
                location: "Noida Sector 93",
                text: "I came from a non-design background but the trainer explained everything from first principles. By the end I had designed a full brand identity for a local business in Noida — now using it as my portfolio piece.",
                rating: 5
            },
            {
                name: "Rohit M.",
                location: "Greater Noida West",
                text: "The Illustrator module completely changed how I approach logo design. I now have 4 freelance clients in Noida and charge ₹8,000–15,000 per logo project.",
                rating: 5
            }
        ],
        faq: [
            {
                question: "How much does a graphic design course cost in Noida?",
                answer: "At Celoris, graphic designing courses start at ₹2,500 for the Basic plan (4 weeks) and go up to ₹8,000 for the Professional 1-on-1 plan (10 weeks). All prices are transparent. WhatsApp us at +91 90847 18101 for details."
            },
            {
                question: "Which software is covered in the graphic design course?",
                answer: "Our course covers Adobe Photoshop (photo editing and digital design), Adobe Illustrator (vector graphics and logo design), Adobe InDesign (multi-page print layouts), and Canva (quick social media content). You get the complete professional Adobe toolkit."
            },
            {
                question: "Can I learn graphic design with no art background?",
                answer: "Yes. Graphic design is a learnable skill — not an innate talent. We start with design principles and move to software. Many of our most successful design students had no prior art or drawing background. What matters is attention to detail and willingness to practice."
            },
            {
                question: "Can the trainer come to my home in Noida?",
                answer: "Yes. Celoris trainers offer home-visit sessions across all Noida sectors, Greater Noida, and nearby Ghaziabad. Online sessions are also available via Zoom or Google Meet."
            },
            {
                question: "Do I need to buy Adobe software for the course?",
                answer: "Adobe Creative Cloud requires a subscription. The Photography plan (Photoshop + Lightroom) costs ~₹1,675/month. The All Apps plan is ~₹4,230/month. Adobe offers a 7-day free trial. Your trainer will advise on the most cost-effective plan based on which tools you need."
            },
            {
                question: "Do I get a certificate after the course?",
                answer: "Yes. All students receive a Celoris Course Completion Certificate plus a portfolio of 15+ real design projects — which is what design employers and clients actually want to see."
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
        "name": "Celoris Graphic Designing Training Noida",
        "image": "https://www.celorisdesigns.com/photoshop_noida.png",
        "@id": "https://www.celorisdesigns.com/graphic-designing-course-noida",
        "url": "https://www.celorisdesigns.com/graphic-designing-course-noida",
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
        "areaServed": [
            {
                "@type": "City",
                "name": "Noida"
            },
            {
                "@type": "City",
                "name": "Greater Noida"
            },
            {
                "@type": "City",
                "name": "Ghaziabad"
            }
        ],
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
                    <span className="text-slate-100 line-clamp-1 italic">Graphic Designing Course Noida</span>
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
                                    15+ Portfolio Projects
                                </span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Book Free Demo
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">Graphic Designing</span>
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
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">Portfolio Focus</span>
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
                                        src="/photoshop_noida.png"
                                        alt="Graphic Designing Course Noida"
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
                                Course Fees — Graphic Designing Course Noida
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { name: "Basic", price: "2,500", focus: "Beginners, Students", duration: "4 Weeks", topics: "Design principles, Photoshop, basic Illustrator, social media graphics" },
                                    { name: "Advanced", price: "4,999", focus: "Job Seekers, Marketers", duration: "8 Weeks", topics: "Full Adobe suite + Brand identity + Print + Digital design" },
                                    { name: "Professional (1-on-1)", price: "8,000", focus: "Freelancers, Agency aspirants", duration: "10 Weeks", topics: "Complete course + Portfolio + Client workflow + Freelance setup" },
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
                                    Every Plan Includes: 10+ design projects, Print & digital portfolio, Celoris Certificate, Lifetime WhatsApp Support.
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
                                    <Palette className="h-8 w-8 text-blue-500" />
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
                                Why Learn Graphic Design from Celoris in Noida?
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
                                No prior design experience required. We start from design principles and build from there.
                            </p>
                        </section>

                        {/* Comparison Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                                    <Share2 className="h-8 w-8 text-purple-500" />
                                </div>
                                Celoris vs Other Graphic Design Options in Noida
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-[#0d1321]/40 rounded-[2.5rem] overflow-hidden">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Feature</th>
                                            <th className="p-6 text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest italic bg-emerald-500/5">Celoris</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Design Institute</th>
                                            <th className="p-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest italic">YouTube/Online</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold italic uppercase tracking-tight">
                                        {[
                                            { feature: "Real portfolio projects", celoris: "✅ 15+ projects", local: "⚠️ Limited", online: "❌ Self-managed" },
                                            { feature: "Full Adobe suite", celoris: "✅ PS + AI + ID", local: "⚠️ Sometimes", online: "⚠️ Separate courses" },
                                            { feature: "Design thinking taught", celoris: "✅ Yes", local: "⚠️ Varies", online: "❌ Tool-focused only" },
                                            { feature: "Home visit", celoris: "✅ Yes", local: "❌ No", online: "❌ No" },
                                            { feature: "Batch size", celoris: "✅ Max 5 / 1-on-1", local: "❌ 15-30 students", online: "❌ No interaction" },
                                            { feature: "Freelance training", celoris: "✅ Yes", local: "❌ Rarely", online: "❌ No" },
                                            { feature: "Free demo", celoris: "✅ Yes", local: "❌ Rarely", online: "✅ Always free" },
                                            { feature: "Price", celoris: "₹2,500–8,000", local: "₹10,000–40,000", online: "Free–₹5,000" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-slate-300">{row.feature}</td>
                                                <td className="p-6 text-center text-emerald-400 bg-emerald-500/5">{row.celoris}</td>
                                                <td className="p-6 text-center text-slate-500">{row.local}</td>
                                                <td className="p-6 text-center text-slate-500">{row.online}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Jobs Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20">
                                    <IndianRupee className="h-8 w-8 text-yellow-500" />
                                </div>
                                Graphic Design Jobs in Noida — What You Can Earn
                            </h2>
                            <p className="text-lg text-slate-400 leading-relaxed font-medium">
                                Noida's growing ecosystem of D2C brands, agencies, and startups creates consistent demand for graphic designers — making it one of the best cities in Delhi NCR to build a design career.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse bg-[#0d1321]/40 rounded-[2.5rem] overflow-hidden">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Job Role</th>
                                            <th className="p-6 text-center text-[10px] font-black text-emerald-500 uppercase tracking-widest italic bg-emerald-500/5">Avg Salary in Noida</th>
                                            <th className="p-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Skills Needed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-bold italic uppercase tracking-tight">
                                        {[
                                            { role: "Graphic Designer", salary: "₹2.5L–5L / year", skills: "Photoshop + Illustrator + InDesign" },
                                            { role: "Brand Designer", salary: "₹3.5L–7L / year", skills: "Illustrator + brand identity + strategy" },
                                            { role: "Social Media Designer", salary: "₹2.5L–4.5L / year", skills: "Photoshop + Canva + content planning" },
                                            { role: "UI Designer", salary: "₹4L–9L / year", skills: "Illustrator + Figma + user research" },
                                            { role: "Art Director", salary: "₹6L–14L / year", skills: "Full Adobe suite + creative direction" },
                                            { role: "Freelance Designer", salary: "₹3L–15L / year", skills: "Any specialization + client skills" },
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-slate-300">{row.role}</td>
                                                <td className="p-6 text-center text-emerald-400 bg-emerald-500/5">{row.salary}</td>
                                                <td className="p-6 text-slate-500 text-xs">{row.skills}</td>
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
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Your Graphic Design Journey Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                Join thousands of students who have built real design careers with Celoris. Whether you want a job at a Noida agency, grow your freelance income, or design your own brand — our graphic design trainers are ready for you.
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
                            <span>Locations & Courses:</span>
                            <Link href="/graphic-designing-course-gurgaon" className="hover:text-emerald-400 transition-colors">Gurgaon Graphic Design</Link>
                            <Link href="/photoshop-training-noida" className="hover:text-emerald-400 transition-colors">Photoshop Noida</Link>
                            <Link href="/adobe-illustrator-course-noida" className="hover:text-emerald-400 transition-colors">Illustrator Noida</Link>
                            <Link href="/digital-marketing-course-noida" className="hover:text-emerald-400 transition-colors">Digital Marketing Noida</Link>
                            <span>Related:</span>
                            <Link href="/blog/best-graphic-designing-course-noida" className="hover:text-emerald-400 transition-colors">Best Course Noida Blog</Link>
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
                                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-[2rem] mx-auto mb-6 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-all duration-500 shadow-2xl shadow-emerald-500/20">
                                            <MessageSquare className="h-10 w-10 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Book Free Demo</h3>
                                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest italic">30 Mins • Zero Pressure</p>
                                    </div>
                                    <div className="space-y-4">
                                        <CourseInquiryDialog 
                                            courseTitle={pageData.title}
                                            buttonClassName="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest italic rounded-2xl transition-all shadow-xl shadow-emerald-500/20"
                                        />
                                        <Link 
                                            href={pageData.whatsappLink}
                                            target="_blank"
                                            className="w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black uppercase tracking-widest italic rounded-2xl transition-all flex items-center justify-center gap-3"
                                        >
                                            <MessageSquare className="h-4 w-4" />
                                            {pageData.whatsappNumber}
                                        </Link>
                                    </div>
                                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-400 font-bold uppercase tracking-widest italic">
                                            <MapPin className="h-4 w-4 text-emerald-500" />
                                            Home Visit Available
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-400 font-bold uppercase tracking-widest italic">
                                            <Globe className="h-4 w-4 text-emerald-500" />
                                            Online Classes via Zoom
                                        </div>
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
