"use client"

import { useEffect } from "react"
import { 
    Globe, Layout, Smartphone, ShoppingCart, Search, Settings, FileText,
    Star, Award, CheckCircle, BookOpen, Zap, 
    MapPin, MessageSquare, ShieldCheck, 
    BarChart3, Users, Share2, Code, Phone, Mail
} from "lucide-react"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function WordPressCourseNoida() {
    useEffect(() => {
        document.title = "WordPress Course in Noida | Celoris — Book Free Demo"

        const metaDescription = document.querySelector('meta[name="description"]')
        const descriptionText = "Learn WordPress in Noida — build websites, eCommerce stores, and blogs without coding. Online & offline batches. Free demo available. Book today!"
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
        title: "WordPress Course in Noida",
        subtitle: "Learn to build professional websites, blogs, and WooCommerce stores with WordPress — no coding required.",
        heroDescription: "Master themes, plugins, SEO, and website management. Build 3+ real websites during the course. Online and offline batches available across Noida, Greater Noida, and Ghaziabad.",
        whatsappNumber: "+91 90847 18101",
        whatsappLink: "https://wa.me/919084718101",
        overview: "WordPress powers 43% of all websites on the internet — and in Noida's small business ecosystem, it is the most widely used platform for business websites, coaching portals, e-commerce stores, and blogs. Learning WordPress opens doors as a freelance web developer, digital agency employee, or business owner who manages their own online presence. Celoris WordPress course in Noida teaches you everything from installation to advanced customization — without needing to write a single line of code.",
        courseDetails: [
            { label: "Course Name", value: "WordPress Training (Basic to Advanced)" },
            { label: "Location", value: "Noida — Sector 18, 22, 62, 63, 125, Greater Noida | Also Online" },
            { label: "Mode", value: "At Student's Home | At Trainer's Home | Online via Zoom/Meet" },
            { label: "Duration", value: "4–8 Weeks (Basic site building to Advanced WooCommerce + SEO)" },
            { label: "Batch Size", value: "1-on-1 or Small Group (max 5 students)" },
            { label: "Language", value: "Hindi + English (Hinglish)" },
            { label: "Certification", value: "Celoris Course Completion Certificate" },
        ],
        curriculum: [
            {
                module: "Module 1: WordPress Fundamentals (Week 1)",
                topics: [
                    "Domain and hosting setup — choosing the right hosting for Indian websites",
                    "WordPress installation — one-click install and manual setup",
                    "WordPress dashboard overview — posts, pages, media, users, settings",
                    "Difference between WordPress.com and WordPress.org",
                    "Understanding themes vs plugins vs page builders",
                    "Admin panel — general settings, permalinks, reading, discussion settings"
                ],
                icon: Globe
            },
            {
                module: "Module 2: Themes & Page Builder (Week 2)",
                topics: [
                    "Free vs premium themes — where to find, evaluate, and install",
                    "Elementor page builder — drag-and-drop website building",
                    "Building homepage, about page, contact page, services page",
                    "Header and footer customization — logo, menu, social links",
                    "Mobile responsiveness — making sites look perfect on phones",
                    "Global styles — fonts, colors, spacing for consistent branding",
                    "Astra + Elementor combination — the most popular free professional stack"
                ],
                icon: Layout
            },
            {
                module: "Module 3: Essential Plugins & Functionality (Week 3)",
                topics: [
                    "SEO plugin — Yoast SEO or RankMath setup and optimization",
                    "Contact forms — WPForms or Contact Form 7 setup",
                    "Security plugins — Wordfence, login protection, SSL setup",
                    "Speed optimization — WP Rocket / LiteSpeed Cache, image compression",
                    "Backup plugins — UpdraftPlus automated backups",
                    "Google Analytics integration — connecting GA4 to WordPress",
                    "Social media integration — sharing buttons, Instagram feed, WhatsApp chat button"
                ],
                icon: ShieldCheck
            },
            {
                module: "Module 4: WooCommerce — E-Commerce (Week 4–5)",
                topics: [
                    "WooCommerce installation and initial setup wizard",
                    "Adding products — simple, variable, grouped, digital products",
                    "Product categories, tags, and attributes",
                    "Payment gateway setup — Razorpay, PayU, Cash on Delivery for Indian stores",
                    "Shipping setup — flat rate, free shipping, India-specific zones",
                    "Order management — processing, refunds, inventory management",
                    "WooCommerce SEO — product pages, category pages, schema markup",
                    "Coupon codes and discount management"
                ],
                icon: ShoppingCart
            },
            {
                module: "Module 5: WordPress SEO & Performance (Week 6)",
                topics: [
                    "On-page SEO — title tags, meta descriptions, heading optimization",
                    "Image SEO — alt text, file naming, WebP conversion",
                    "Internal linking strategy for WordPress sites",
                    "XML sitemap submission to Google Search Console",
                    "Core Web Vitals — improving LCP, FID, CLS scores",
                    "Page speed optimization — caching, CDN, lazy loading",
                    "Local SEO for Noida businesses — Google Business Profile integration"
                ],
                icon: Search
            },
            {
                module: "Module 6: Advanced WordPress & Client Management (Week 7–8)",
                topics: [
                    "Multisite setup — managing multiple websites from one dashboard",
                    "Custom post types and Advanced Custom Fields (ACF) basics",
                    "Website maintenance — updates, backups, security monitoring",
                    "Client handover — creating admin accounts, user roles, documentation",
                    "Freelance workflow — quoting WordPress projects, timeline, revision management",
                    "Staging environments — testing changes before pushing to live site"
                ],
                icon: Settings
            }
        ],
        pricing: [
            { name: "Basic", price: "2,500", focus: "Beginners, Business Owners", duration: "4 Weeks", topics: "WordPress setup, themes, Elementor, essential plugins" },
            { name: "Advanced", price: "4,999", focus: "Freelancers, Job Seekers", duration: "8 Weeks", topics: "Full course + WooCommerce + SEO + performance optimization" },
            { name: "Mastery (1-on-1)", price: "8,000", focus: "Agency aspirants, Developers", duration: "8 Weeks", topics: "Complete stack + client management + freelance business setup" },
        ],
        whyChooseUs: [
            "Trainer has built real client WordPress sites — not just practice projects",
            "Build 3+ real websites during the course — portfolio-ready on completion",
            "WooCommerce covered in depth — including Indian payment gateways (Razorpay, PayU)",
            "SEO and speed optimization included — not an add-on",
            "Small batches — maximum 5 students, 1-on-1 option available",
            "Home visit sessions across all Noida sectors and Greater Noida",
            "Flexible timing — morning, evening, and weekend batches",
            "Lifetime WhatsApp support — site issues solved even after course ends",
            "Free 30-minute demo — try before you pay, zero pressure"
        ],
        whoIsItFor: [
            "Small business owners who want to build and manage their own website",
            "Freelancers who want to offer WordPress development as a service",
            "Bloggers and content creators who want to launch their own website",
            "Digital marketers who want to manage client WordPress sites",
            "Students looking for web development skills without learning to code",
            "E-commerce entrepreneurs who want to launch an online store with WooCommerce"
        ],
        comparison: [
            { feature: "Real website builds", celoris: "✅ 3+ live sites", bootcamp: "⚠️ Limited", youtube: "❌ Demo sites only" },
            { feature: "WooCommerce covered", celoris: "✅ Full module", bootcamp: "⚠️ Extra cost", youtube: "⚠️ Separate course" },
            { feature: "Indian payment gateways", celoris: "✅ Razorpay + PayU", bootcamp: "❌ Generic only", youtube: "❌ Usually Stripe/PayPal" },
            { feature: "SEO included", celoris: "✅ Full SEO module", bootcamp: "⚠️ Basic only", youtube: "⚠️ Separate course" },
            { feature: "Home visit", celoris: "✅ Yes", bootcamp: "❌ No", youtube: "❌ No" },
            { feature: "Batch size", celoris: "✅ Max 5 / 1-on-1", bootcamp: "❌ 15-30 students", youtube: "❌ No interaction" },
            { feature: "Free demo", celoris: "✅ Yes", bootcamp: "❌ Rarely", youtube: "✅ Always free" },
            { feature: "Price", celoris: "₹2,500–8,000", bootcamp: "₹8,000–25,000", youtube: "Free–₹3,000" },
        ],
        jobs: [
            { role: "WordPress Developer", salary: "₹2.5L–6L / year", skills: "Themes, plugins, Elementor, WooCommerce" },
            { role: "Web Designer (WordPress)", salary: "₹2.5L–5L / year", skills: "Elementor, design sense, client management" },
            { role: "SEO + WordPress Manager", salary: "₹3L–6L / year", skills: "WordPress + Yoast/RankMath + on-page SEO" },
            { role: "WooCommerce Developer", salary: "₹3.5L–7L / year", skills: "WooCommerce + payment gateways + inventory" },
            { role: "Freelance WordPress Dev", salary: "₹3L–15L / year", skills: "Full WordPress stack + client management" },
            { role: "Digital Agency Employee", salary: "₹2.5L–5L / year", skills: "WordPress + basic SEO + client communication" },
        ],
        areasCovered: [
            "Noida: Sector 18, 22, 37, 44, 50, 56, 62, 63, 76, 93, 100, 120, 125, 135, 137",
            "Greater Noida West: Gaur City, Supertech Eco Village, Amrapali Silicon City",
            "Greater Noida: Knowledge Park I–V, Alpha, Beta, Gamma, Delta, Omega",
            "Ghaziabad: Indirapuram, Vaishali, Vasundhara, Crossings Republik"
        ],
        testimonials: [
            {
                name: "Preeti S.",
                location: "Noida Sector 50",
                text: "Built my coaching institute website during the course. Now managing it myself — adding blog posts, updating fees, and running a WooCommerce store for my course materials. Saved ₹15,000/year in agency fees.",
                rating: 5
            },
            {
                name: "Karan M.",
                location: "Greater Noida",
                text: "Got my first freelance client before finishing the course. Built a WordPress site for a local restaurant in Noida and charged ₹18,000. The WooCommerce module helped me add an online ordering feature.",
                rating: 5
            }
        ],
        faq: [
            {
                question: "How much does a WordPress course cost in Noida?",
                answer: "At Celoris, WordPress training starts at ₹2,500 for the Basic plan (4 weeks) and goes up to ₹8,000 for the Mastery 1-on-1 plan (8 weeks). All prices are transparent. WhatsApp us at +91 90847 18101."
            },
            {
                question: "Do I need to know coding to learn WordPress?",
                answer: "No. WordPress is specifically designed for non-coders. Our entire course is built around visual page builders and no-code tools. You can build a professional website, e-commerce store, and blog without writing a single line of HTML, CSS, or PHP."
            },
            {
                question: "How much does it cost to build a WordPress website?",
                answer: "A basic WordPress website needs: domain (~₹800-1,200/year), hosting (~₹2,000-4,000/year for shared hosting), and a premium theme (~₹2,000-4,000 one-time) or Elementor Pro (~₹4,000/year). Total annual cost for a professional website: ₹5,000–10,000/year. We cover cost-effective hosting options for India during the course."
            },
            {
                question: "Can the trainer come to my home in Noida?",
                answer: "Yes. Celoris trainers offer home-visit sessions across all Noida sectors, Greater Noida, and nearby Ghaziabad. Online sessions are also available via Zoom or Google Meet."
            },
            {
                question: "What is the difference between WordPress and Wix or Squarespace?",
                answer: "WordPress is self-hosted and gives you complete control — you own your site and data, can install any plugin, and customize without limits. Wix and Squarespace are hosted platforms with limited customization. For serious business use, client work, or freelancing, WordPress is the professional standard."
            },
            {
                question: "Do I get a certificate after the course?",
                answer: "Yes. All students receive a Celoris Course Completion Certificate plus a portfolio of 3+ real WordPress websites — including at least one WooCommerce store — that you can show to clients or employers."
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
        "name": "Celoris WordPress Course Noida",
        "image": "https://www.celorisdesigns.com/wordpress_noida.png",
        "@id": "https://www.celorisdesigns.com/wordpress-course-noida",
        "url": "https://www.celorisdesigns.com/wordpress-course-noida",
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
                    <span className="text-slate-100 line-clamp-1 italic">WordPress Course Noida</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Hero Header */}
                        <div className="space-y-8">
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic transform -skew-x-12">
                                    Noida's #1 Web Training
                                </span>
                                <span className="bg-pink-600/20 text-pink-400 border border-pink-500/30 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Elementor + WooCommerce
                                </span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase italic">
                                    Book Free Demo
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
                                <span className="block">WordPress</span>
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
                                    <Globe className="h-5 w-5 text-purple-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest italic text-slate-300">3+ Real Websites</span>
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
                                        src="/wordpress_noida.png"
                                        alt="WordPress Course Noida"
                                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null; 
                                            target.src = "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=1600&q=80";
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
                                    ✓ 3+ real websites built   ✓ Live site deployed   ✓ Celoris Certificate   ✓ Lifetime WhatsApp Support
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
                                    <Code className="h-8 w-8 text-pink-500" />
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
                                Why Learn WordPress from Celoris in Noida?
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
                                No coding knowledge required. WordPress is designed for non-coders.
                            </p>
                        </section>

                        {/* Comparison Table */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                                    <Share2 className="h-8 w-8 text-indigo-500" />
                                </div>
                                Celoris vs Other WordPress Training Options in Noida
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
                                WordPress Jobs & Freelance in Noida — What You Can Earn
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
                                Noida has hundreds of small businesses, coaching institutes, and startups that need WordPress websites — creating consistent freelance demand at ₹8,000–30,000 per project.
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
                                <Globe className="h-40 w-40 text-white" />
                            </div>
                            <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-6 relative z-10">Start Your WordPress Journey Today</h3>
                            <p className="text-lg text-slate-400 leading-relaxed italic font-bold uppercase tracking-wider relative z-10 mb-8">
                                Join thousands of students who have already built real websites and real income with Celoris. Book your free demo today.
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
                                <CourseInquiryDialog 
                                    courseTitle={pageData.title}
                                    buttonClassName="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black uppercase tracking-widest italic rounded-2xl transition-all"
                                />
                            </div>
                        </div>

                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        <div className="sticky top-24 space-y-8">
                            <Card className="bg-[#0d1321]/80 backdrop-blur-3xl border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                                <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 w-full" />
                                <CardHeader className="text-center pb-2">
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Book Free Demo</CardTitle>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mt-2">Try before you pay</p>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-white/5 p-4 rounded-xl border border-white/5">
                                            <Phone className="h-5 w-5 text-purple-500" />
                                            <span>Call: {pageData.whatsappNumber}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-300 font-medium bg-white/5 p-4 rounded-xl border border-white/5">
                                            <Mail className="h-5 w-5 text-pink-500" />
                                            <span>support@celorisdesigns.com</span>
                                        </div>
                                        <CourseInquiryDialog 
                                            courseTitle={pageData.title}
                                            buttonClassName="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all italic mt-4"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-[#0d1321]/40 border-white/5 rounded-[2rem] shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black text-white italic uppercase tracking-tighter">Course Highlights</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-4">
                                        {['No Coding Required', 'Elementor + WooCommerce', 'SEO & Speed Optimization', '3+ Real Websites Built', 'Indian Payment Gateways', '1-on-1 Mentorship'].map((highlight, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle className="h-4 w-4 text-purple-500" />
                                                <span className="text-sm font-bold text-slate-400 uppercase tracking-wide italic">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-[#0d1321]/40 border-white/5 rounded-[2rem] shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black text-white italic uppercase tracking-tighter">Related Links</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {[
                                            { name: 'Gurgaon Branch', link: '/wordpress-course-gurgaon' },
                                            { name: 'Web Development', link: '/web-development-course-noida' },
                                            { name: 'Web Designing', link: '/web-designing-course-noida' },
                                            { name: 'Digital Marketing', link: '/digital-marketing-course-noida' },
                                            { name: 'Best WordPress Course Blog', link: '/blog/best-wordpress-course-noida' },
                                            { name: 'All Courses', link: '/learn' }
                                        ].map((item, i) => (
                                            <li key={i}>
                                                <Link href={item.link} className="flex items-center gap-2 group">
                                                    <span className="h-1 w-1 bg-purple-500 rounded-full group-hover:scale-150 transition-transform" />
                                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wide italic group-hover:text-purple-400 transition-colors">{item.name}</span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
