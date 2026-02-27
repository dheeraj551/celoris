"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, CheckCircle, HelpCircle, BookOpen, Download, Activity, Heart, Wind, Moon, Award, Play, Zap, Lightbulb, Target, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"

export default function YogaMasteryCourse2025() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "The Complete 2025 Yoga Mastery Course | Celoris Designs";

        const metaDescription = document.querySelector('meta[name="description"]');
        const desc = "Master high-demand skills with our legendary yoga courses and real-time expert guidance. Bridge traditional Vedic wisdom with modern functional movement.";
        if (metaDescription) {
            metaDescription.setAttribute('content', desc);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = desc;
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "The Complete 2025 Yoga Mastery Course",
        subtitle: "From Beginner Poses to Advanced Mindfulness",
        description: "This comprehensive yoga program bridges traditional Vedic wisdom with modern functional movement. Designed for all levels, it covers physical asanas, breathwork (Pranayama), and restorative techniques for stress relief.",
        students: 1540,
        rating: 4.9,
        duration: "12 Weeks (Self-paced)",
        price: 6000.00,
        currency: "INR",
        provider: "Celoris Designs llp",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/complete-2025-yoga-mastery-course",
        learning_outcomes: [
            "Master Sun Salutations (Surya Namaskar) Alignment with precision.",
            "Deepen your understanding of Yoga Anatomy and preventing injury.",
            "Reduce stress and anxiety via advanced Pranayama techniques.",
            "Learn to sequence Vinyasa Flow for different energy levels.",
            "Improve sleep quality with Yoga Nidra and restorative practices.",
            "Incorporate the 8 Limbs of Yoga into your modern daily life."
        ],
        requirements: [
            "No prior yoga experience required; suitable for beginners.",
            "A yoga mat and comfortable clothing.",
            "An open mind and commitment to daily practice."
        ],
        syllabus: [
            {
                unit: "Module 1: Foundations of Hatha & Vinyasa",
                icon: "Zap",
                focus: "Introduction to the 8 Limbs of Yoga.",
                keyQuestion: "What is the difference between Hatha and Vinyasa yoga?",
                chapters: [
                    { title: "Sun Salutations (Surya Namaskar)", content: "Detailed breakdown of alignment principles and variations for all bodies." },
                    { title: "History of the Yoga Sutras", content: "Exploring the philosophical roots and the 8 Limbs of Yoga." },
                    { title: "Hatha vs. Vinyasa", content: "Understanding static vs. fluid movement and when to practice each." }
                ]
            },
            {
                unit: "Module 2: Yoga Anatomy & Functional Movement",
                icon: "Activity",
                focus: "How yoga affects the nervous system.",
                keyQuestion: "Which yoga poses are best for back pain?",
                chapters: [
                    { title: "The Musculoskeletal System", content: "Focus on core stability and protecting the spine during movement." },
                    { title: "Downward Dog (Adho Mukha Svanasana)", content: "Mastering the foundation of many flows to prevent wrist and shoulder injury." },
                    { title: "Nervous System Regulation", content: "The science of how yoga shifts us from 'Fight or Flight' to 'Rest and Digest'." }
                ]
            },
            {
                unit: "Module 3: Breathwork & Mental Health",
                icon: "Wind",
                focus: "Mastering the breath for anxiety relief.",
                keyQuestion: "How do I practice Ujjayi breathing?",
                chapters: [
                    { title: "Nadi Shodhana", content: "Step-by-step guide on alternate nostril breathing for balance." },
                    { title: "Ujjayi (Victorious Breath)", content: "Learning the warming throat breath used in Vinyasa flows." },
                    { title: "Sheetali (Cooling Breath)", content: "Techniques for cooling the body and calming the mind." }
                ]
            },
            {
                unit: "Module 4: Restorative Yoga & Sleep Hygiene",
                icon: "Moon",
                focus: "Yoga Nidra and deep relaxation.",
                keyQuestion: "Can yoga improve sleep quality?",
                chapters: [
                    { title: "Passive Stretching & Props", content: "Using blocks and bolsters to support the body in deep relaxation." },
                    { title: "Science of the Parasympathetic Nervous System", content: "Why rest is just as important as movement for long-term health." },
                    { title: "Yoga Nidra Guided Practice", content: "A specific sequence designed to induce deep yogic sleep." }
                ]
            }
        ],
        faqs: [
            {
                question: "What is the difference between Hatha and Vinyasa yoga?",
                answer: "Hatha yoga focuses on holding individual poses to build strength and alignment, making it great for beginners. Vinyasa yoga is more dynamic, linking breath with continuous movement in a fluid sequence."
            },
            {
                question: "Which yoga poses are best for back pain?",
                answer: "Cat-Cow, Child's Pose, and Sphinx pose are excellent for relieving lower back tension. Our course provides a specific sequence for spinal health in Module 2."
            },
            {
                question: "How do I practice Ujjayi breathing?",
                answer: "Ujjayi involves a slight constriction at the back of the throat while breathing through the nose, creating a sound like the ocean waves. It helps maintain focus and heat during practice."
            },
            {
                question: "Can yoga improve sleep quality?",
                answer: "Yes! Restorative yoga and Yoga Nidra specifically activate the parasympathetic nervous system, lowering cortisol levels and preparing the brain for deep, restful sleep."
            }
        ],
        reviews: [
            {
                name: "Aditi Sharma",
                role: "HR Manager",
                rating: 5,
                comment: "Yoga Node helped me slow down and actually understand alignment. The Hatha foundations were explained so clearly that my back pain reduced within weeks. Pranayama sessions are now part of my daily routine."
            },
            {
                name: "Rohan Mehta",
                role: "Software Engineer",
                rating: 4,
                comment: "The course is very detailed, especially the anatomy module. I sometimes felt the theory was heavy, but it helped me avoid injuries during Vinyasa flows. Overall, worth it."
            },
            {
                name: "Neha Verma",
                role: "College Student",
                rating: 5,
                comment: "I joined for stress relief and better sleep, and Yoga Nidra exceeded my expectations. My anxiety before exams has reduced a lot. I just wish there were more live sessions."
            },
            {
                name: "Arjun Patel",
                role: "Gym Trainer",
                rating: 4,
                comment: "Great balance between traditional yoga and functional movement. The Vinyasa sequencing lessons are practical for clients. Some advanced flows could be a bit longer, but still very solid."
            },
            {
                name: "Pooja Nair",
                role: "Freelance Designer",
                rating: 5,
                comment: "The restorative yoga module is gold. I sit long hours, and this course helped with neck stiffness and sleep issues. The explanations are calm and easy to follow."
            },
            {
                name: "Kunal Singh",
                role: "Startup Founder",
                rating: 4,
                comment: "Pranayama and mindfulness modules helped me manage work stress better. The course demands consistency — not a quick fix — but that’s also its strength."
            },
            {
                name: "Sneha Kulkarni",
                role: "Ayurveda Student",
                rating: 5,
                comment: "I appreciated the references to Yoga Sutras and Hatha Yoga Pradipika. It feels authentic and aligned with classical yoga philosophy, not just fitness-based yoga."
            },
            {
                name: "Aman Gupta",
                role: "Marketing Executive",
                rating: 4,
                comment: "Very well-structured course. I liked the comparison of yoga styles — it helped me choose the right practice on busy days. Some videos felt slightly long, but content quality is high."
            },
            {
                name: "Kavita Rao",
                role: "Homemaker",
                rating: 5,
                comment: "I was new to yoga and worried about difficulty, but the beginner-friendly approach made me confident. My flexibility and energy levels have improved noticeably."
            },
            {
                name: "Rahul Malhotra",
                role: "Civil Engineer",
                rating: 4,
                comment: "The anatomy and alignment focus really stood out. It’s not flashy but very effective. I would recommend it to anyone serious about long-term yoga practice."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": "The Complete 2025 Yoga Mastery Course",
        "description": "An evidence-based yoga program combining Vinyasa flow, Hatha alignment, and Pranayama breathwork for physical and mental wellbeing.",
        "provider": {
            "@type": "Organization",
            "name": "Celoris Designs llp",
            "sameAs": "https://celorisdesigns.com"
        },
        "courseCode": "YOGA-2025-MASTER",
        "educationalLevel": "Beginner to Advanced",
        "teaches": [
            "Sun Salutations (Surya Namaskar) Alignment",
            "Anatomy of Yoga Poses",
            "Stress Reduction via Pranayama",
            "Vinyasa Flow Sequences",
            "Yoga Nidra for Sleep"
        ],
        "offers": {
            "@type": "Offer",
            "price": "6000.00",
            "priceCurrency": "INR",
            "availability": "https://schema.org/InStock"
        }
    }

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 py-8 selection:bg-emerald-500/30">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
                    <Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-emerald-400 transition-colors">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-emerald-400 transition-colors">Courses</Link>
                    <span>/</span>
                    <span className="text-slate-100 line-clamp-1">{courseData.title}</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-slate-400 hover:text-emerald-400 mb-6 transition-all group font-bold uppercase tracking-widest text-[10px]">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Course Header */}
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase italic">Yoga Node</span>
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase italic">2025 Edition</span>
                                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase italic">Holistic Health</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight italic uppercase">
                                {courseData.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-emerald-400/90 font-black italic uppercase tracking-tighter">
                                {courseData.subtitle}
                            </p>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl font-medium">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Video with Glassmorphism */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <Card className="relative overflow-hidden border-0 bg-slate-900/50 backdrop-blur-xl rounded-2xl">
                                <div className="aspect-video relative overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src="https://www.youtube.com/embed/eGBQv8_DipU"
                                        title="The Complete 2025 Yoga Mastery Course Video"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                        className="w-full h-full"
                                    ></iframe>
                                </div>
                            </Card>
                        </div>

                        {/* Comparison Table */}
                        <Card className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                                    <Target className="h-4 w-4" /> Comparison of Yoga Styles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-widest text-slate-500 font-black italic">
                                                <th className="p-4">Yoga Style</th>
                                                <th className="p-4">Intensity</th>
                                                <th className="p-4">Focus</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm font-bold text-slate-300">
                                            {[
                                                { style: "Hatha", intensity: "Gentle", focus: "Foundations & Alignment" },
                                                { style: "Vinyasa", intensity: "High", focus: "Fluidity & Breath Sync" },
                                                { style: "Yin", intensity: "Low", focus: "Deep Tissue & Stillness" },
                                                { style: "Restorative", intensity: "Very Low", focus: "Stress Recovery" }
                                            ].map((row, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="p-4 italic text-emerald-400 uppercase tracking-tight">{row.style}</td>
                                                    <td className="p-4">{row.intensity}</td>
                                                    <td className="p-4 opacity-70">{row.focus}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Learning Outcomes */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                                </div>
                                What You Will Master
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {courseData.learning_outcomes.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 transition-all group">
                                        <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-emerald-500 transition-colors">
                                            <CheckCircle className="h-3 w-3 text-emerald-400 group-hover:text-white transition-colors" />
                                        </div>
                                        <span className="text-slate-400 text-sm font-bold uppercase tracking-tight leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Detailed Syllabus */}
                        <section className="space-y-6">
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                <div className="p-2 bg-purple-500/20 rounded-lg">
                                    <BookOpen className="h-6 w-6 text-purple-400" />
                                </div>
                                Comprehensive Curriculum
                            </h2>
                            <Accordion type="single" collapsible className="space-y-4">
                                {courseData.syllabus.map((unit, index) => {
                                    const Icon = unit.icon === "Zap" ? Zap :
                                        unit.icon === "Activity" ? Activity :
                                            unit.icon === "Wind" ? Wind : Moon;
                                    return (
                                        <AccordionItem key={index} value={`unit-${index}`} className="border border-white/5 bg-slate-900/40 rounded-[2rem] px-4 overflow-hidden shadow-xl">
                                            <AccordionTrigger className="hover:no-underline py-8">
                                                <div className="flex items-center gap-5 text-left w-full">
                                                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-white/5 shadow-2xl group-hover:bg-emerald-600 transition-colors">
                                                        <Icon className="h-6 w-6 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-1">Node 0{index + 1}</div>
                                                        <div className="text-xl font-black text-white italic uppercase tracking-tighter">{unit.unit}</div>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="pb-8 px-6">
                                                <div className="pl-16 space-y-6">
                                                    <div className="h-1 w-24 bg-emerald-600 rounded-full" />
                                                    <div className="bg-emerald-500/5 p-5 rounded-2xl border border-emerald-500/20">
                                                        <p className="text-xs font-black text-emerald-400 uppercase tracking-widest italic mb-1">Key Inquiry:</p>
                                                        <p className="text-sm font-bold text-slate-200">{unit.keyQuestion}</p>
                                                    </div>
                                                    <div className="space-y-6">
                                                        {unit.chapters.map((chapter, cIndex) => (
                                                            <div key={cIndex} className="relative pl-6">
                                                                <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                                <h3 className="text-md font-black text-white mb-2 uppercase italic tracking-tight">{chapter.title}</h3>
                                                                <p className="text-sm text-slate-500 font-medium leading-relaxed uppercase tracking-tight">{chapter.content}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </section>

                        {/* Authority Citations */}
                        <div className="p-8 rounded-[2rem] bg-gradient-to-br from-emerald-500/10 to-blue-600/10 border border-white/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Award className="h-24 w-24 text-white" />
                            </div>
                            <h3 className="text-xl font-black text-white mb-4 uppercase italic tracking-tighter">Global Standards Compliance</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-bold uppercase tracking-widest italic opacity-70">
                                Note: This course curriculum follows the Yoga Alliance Standards and references classical texts such as the Hatha Yoga Pradipika and Patanjali&apos;s Yoga Sutras for maximum authenticity and E-E-A-T.
                            </p>
                        </div>

                        {/* Student Experiences */}
                        <section className="space-y-8">
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-lg">
                                    <Users className="h-6 w-6 text-emerald-400" />
                                </div>
                                Student Experiences
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courseData.reviews.map((review, index) => (
                                    <Card key={index} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all group p-6">
                                        <div className="flex flex-col h-full">
                                            <div className="flex items-center gap-1 mb-4">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < review.rating ? "text-emerald-400 fill-emerald-400" : "text-slate-600 fill-slate-600"}`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 flex-grow italic">
                                                "{review.comment}"
                                            </p>
                                            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-black text-xs">
                                                    {review.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-black text-sm uppercase italic tracking-tight">{review.name}</h4>
                                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest opacity-70">{review.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section className="space-y-6 pb-20">
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                <div className="p-2 bg-orange-500/20 rounded-lg">
                                    <HelpCircle className="h-6 w-6 text-orange-400" />
                                </div>
                                Inquiry Hub
                            </h2>
                            <Accordion type="single" collapsible className="w-full space-y-3">
                                {courseData.faqs.map((faq, index) => (
                                    <AccordionItem key={index} value={`faq-${index}`} className="border-white/5 bg-[#0d1321]/40 rounded-2xl px-2">
                                        <AccordionTrigger className="text-slate-200 hover:text-emerald-400 transition-colors text-left font-bold py-6 px-4 uppercase tracking-tight text-sm italic">{faq.question}</AccordionTrigger>
                                        <AccordionContent className="text-slate-400 font-medium leading-relaxed px-4 pb-6 uppercase tracking-widest text-[10px]">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-8">
                            {/* Enrollment Card */}
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-[3rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                <Card className="relative bg-[#0d1321] border-0 rounded-[3rem] overflow-hidden shadow-2xl">
                                    <CardContent className="p-10">
                                        <div className="text-center mb-10">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 block italic">Protocol Access Cost</span>
                                            <div className="text-5xl font-black text-white mb-2 tracking-tighter italic">
                                                
                                            </div>
                                            <div className="text-emerald-400 font-black tracking-[0.2em] uppercase text-[10px] italic bg-emerald-500/10 py-2 rounded-full border border-emerald-500/20">Full Lifetime Sync</div>
                                        </div>

                                        <div className="space-y-4 mb-10">
                                            <CourseInquiryDialog
                                                courseTitle={courseData.title}
                                                buttonClassName="w-full h-16 text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95 italic"
                                            />
                                        </div>

                                        <div className="space-y-5 pt-8 border-t border-white/5">
                                            {[
                                                { icon: Target, text: "Beginner to Advanced", color: "text-emerald-400" },
                                                { icon: Clock, text: "12 Weeks (Self-paced)", color: "text-purple-400" },
                                                { icon: Heart, text: "Holistic Wellbeing", color: "text-red-400" },
                                                { icon: Award, text: "RYT Certified Curriculum", color: "text-blue-400" }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                                                    <item.icon className={`h-5 w-5 ${item.color}`} />
                                                    <span>{item.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Instructor Card */}
                            <Card className="bg-[#0d1321]/40 backdrop-blur-md border-white/5 rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 pb-4">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Source Entity</div>
                                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Celoris Mastery</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0">
                                    <div className="flex items-center gap-5 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-white p-3 shadow-3xl shadow-white/5 border border-white/10 flex items-center justify-center">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-white italic uppercase tracking-tight">Yoga Alliance</h4>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">E-RYT 500 Accredited</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 font-bold uppercase tracking-tight leading-relaxed mb-8 opacity-70">
                                        Bridging ancient wisdom with modern functional science to help you achieve absolute mental clarity and physical peak in 2025.
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black py-4 border-t border-white/5 italic">
                                        <div className="flex items-center gap-2 text-emerald-400">
                                            <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                                            <span>{courseData.rating} CRITIQUE</span>
                                            <span className="text-slate-600">({courseData.students}+ SYNCED)</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Prerequisites */}
                            <div className="p-10 rounded-[2.5rem] bg-[#0d1321]/60 border border-white/5 relative overflow-hidden">
                                <div className="absolute -top-4 -right-4 bg-emerald-500/5 w-32 h-32 rounded-full blur-3xl" />
                                <h3 className="text-white font-black uppercase tracking-tighter italic mb-6 flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-emerald-500" />
                                    Prerequisites
                                </h3>
                                <ul className="space-y-5">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 animate-pulse" />
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
