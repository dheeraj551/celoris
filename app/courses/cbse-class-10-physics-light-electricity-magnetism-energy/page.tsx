"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle, BookOpen, Zap, Eye, Lightbulb, Battery } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function CBSEClass10PhysicsCourse() {
    // Set page title and meta tags dynamically
    useEffect(() => {
        document.title = "Class 10 Physics Master Course - Light, Electricity, Magnetism & Energy | CBSE 2025-2026";

        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Master CBSE Class 10 Physics with comprehensive coverage of Light Reflection and Refraction, Human Eye, Electricity (Ohm\'s Law, circuits), Magnetic Effects, and Energy Sources. Includes ray diagrams, formulas, numerical problems, and NCERT solutions.');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = 'Master CBSE Class 10 Physics with comprehensive coverage of Light Reflection and Refraction, Human Eye, Electricity (Ohm\'s Law, circuits), Magnetic Effects, and Energy Sources. Includes ray diagrams, formulas, numerical problems, and NCERT solutions.';
            document.head.appendChild(meta);
        }
    }, []);

    const courseData = {
        title: "Class 10 Physics Master Course: Light, Electricity, Magnetism & Energy (CBSE 2025-2026)",
        description: "Master CBSE Class 10 Physics with this comprehensive, exam-oriented course covering all five core chapters: Light Reflection and Refraction, Human Eye and Colourful World, Electricity, Magnetic Effects of Electric Current, and Sources of Energy. This AI-friendly and SEO-optimized course provides crystal-clear explanations, detailed ray diagrams, step-by-step numerical problem solutions, and real-world applications to help you achieve excellence in your board exams.",
        students: 1250,
        rating: 4.8,
        duration: "4 months",
        price: 1500,
        currency: "INR",
        provider: "Celoris Academy",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-10-physics-light-electricity-magnetism-energy",
        learning_outcomes: [
            "Light Reflection and Refraction: Master laws of reflection and refraction. Draw accurate ray diagrams for concave and convex mirrors (6 cases each). Apply mirror formula (1/v + 1/u = 1/f) and lens formula (1/v - 1/u = 1/f). Calculate magnification and power of lenses. Understand refractive index and its applications.",
            "Human Eye and Colourful World: Understand the structure and functioning of the human eye (cornea, iris, pupil, lens, retina). Learn about accommodation and near/far points. Identify and correct defects of vision: Myopia (concave lens), Hypermetropia (convex lens), and Presbyopia. Explain dispersion of light, VIBGYOR spectrum, and atmospheric refraction phenomena (twinkling stars, blue sky, red sunset).",
            "Electricity: Calculate electric current (I = Q/t), potential difference (V = W/Q), and resistance using Ohm's Law (V = IR). Understand resistivity (ρ = RA/L) and factors affecting resistance. Solve complex problems on series circuits (Req = R1 + R2 + ...) and parallel circuits (1/Req = 1/R1 + 1/R2 + ...). Apply Joule's Law of Heating (H = I²Rt) and calculate electric power (P = VI = I²R = V²/R) and energy consumption in kWh.",
            "Magnetic Effects of Electric Current: Understand magnetic field patterns due to straight conductors, circular loops, and solenoids. Apply Right-Hand Thumb Rule and Fleming's Left-Hand Rule. Calculate force on current-carrying conductors (F = BIL). Explain the working principles of electric motors and generators. Understand electromagnetic induction and Fleming's Right-Hand Rule. Learn about domestic electric circuits, earthing, fuses, and safety measures.",
            "Sources of Energy: Identify characteristics of good energy sources and ideal fuels. Compare conventional sources (fossil fuels, thermal power, hydro power) with non-conventional sources (solar, wind, biomass, ocean thermal, geothermal, nuclear). Analyze environmental impacts and sustainability of different energy sources. Understand solar cells, biogas plants, and renewable energy technologies."
        ],
        requirements: [
            "Basic understanding of Class 9 Science concepts (especially Motion, Force, and Energy)",
            "Knowledge of basic mathematics (algebra, geometry, and basic trigonometry)",
            "Access to NCERT Class 10 Science textbook for reference",
            "Calculator for solving numerical problems",
            "Notebook and drawing instruments for ray diagrams and circuit diagrams",
            "Willingness to practice numerical problems regularly"
        ],
        chapters: [
            {
                number: 1,
                title: "Light - Reflection and Refraction",
                icon: "Lightbulb",
                topics: [
                    "1.1 Reflection of Light - Laws of Reflection, Regular vs. Diffuse Reflection, Plane Mirror properties",
                    "1.2 Spherical Mirrors - Concave and Convex Mirrors, Principal Axis, Focus (F), Centre of Curvature (C), Pole (P)",
                    "1.3 Ray Diagrams for Mirrors - Rules for Ray Tracing, Image formation by Concave Mirror (6 Cases), Image formation by Convex Mirror",
                    "1.4 Mirror Formula & Magnification - Sign Convention, Mirror Formula (1/v + 1/u = 1/f), Magnification (m = -v/u)",
                    "1.5 Refraction of Light - Laws of Refraction, Refractive Index (n = c/v), Glass Slab experiment",
                    "1.6 Spherical Lenses - Concave and Convex Lenses, Principal Focus, Optical Centre",
                    "1.7 Ray Diagrams for Lenses - Rules for Ray Tracing, Image formation by Convex Lens (6 Cases), Image formation by Concave Lens",
                    "1.8 Lens Formula & Power - Lens Formula (1/v - 1/u = 1/f), Power of a Lens (P = 1/f), S.I. unit (Dioptre)"
                ],
                duration: "8 hours"
            },
            {
                number: 2,
                title: "The Human Eye and the Colourful World",
                icon: "Eye",
                topics: [
                    "2.1 The Human Eye - Structure (Cornea, Iris, Pupil, Lens, Retina), Accommodation, Near and Far Point",
                    "2.2 Defects of Vision - Myopia (Near-sightedness) and Correction (Concave Lens), Hypermetropia (Far-sightedness) and Correction (Convex Lens), Presbyopia",
                    "2.3 Refraction through a Prism - Prism Angle, Angle of Deviation, Deviation vs. Angle of Incidence graph",
                    "2.4 Dispersion of Light - Spectrum (VIBGYOR), Cause of Dispersion",
                    "2.5 Atmospheric Effects - Atmospheric Refraction (Twinkling of stars, Advanced sunrise, delayed sunset), Scattering of Light (Tyndall Effect, Blue colour of the sky, Colour of the sun at sunrise/sunset)"
                ],
                duration: "5 hours"
            },
            {
                number: 3,
                title: "Electricity",
                icon: "Zap",
                topics: [
                    "3.1 Electric Current & Charge - Electric Charge (Q), S.I. unit (Coulomb), Electric Current (I = Q/t), S.I. unit (Ampere), Ammeter",
                    "3.2 Potential Difference - Electric Potential, Potential Difference (V = W/Q), S.I. unit (Volt), Voltmeter, Definition of 1 Volt and 1 Ampere",
                    "3.3 Ohm's Law and Resistance - Ohm's Law (V ∝ I ⟹ V=IR), Resistance (R), S.I. unit (Ohm, Ω), Factors affecting resistance",
                    "3.4 Resistivity - Resistivity (ρ = RA/L), S.I. unit (Ω·m), Difference between Conductors, Alloys, and Insulators, Table of Resistivity values",
                    "3.5 Combination of Resistors - Series Circuit (Req = R1 + R2 + ...), Parallel Circuit (1/Req = 1/R1 + 1/R2 + ...)",
                    "3.6 Heating Effect of Electric Current - Joule's Law of Heating (H = I²Rt), Practical Applications (Electric Heater, Fuse), Why Fuse wires have low melting points",
                    "3.7 Electric Power - Electric Power (P = VI = I²R = V²/R), S.I. unit (Watt), Commercial unit (Kilowatt-hour, kWh), Calculation of Electric Bill (cost of energy)"
                ],
                duration: "7 hours"
            },
            {
                number: 4,
                title: "Magnetic Effects of Electric Current",
                icon: "Battery",
                topics: [
                    "4.1 Magnetic Field & Field Lines - Properties of Magnetic Field Lines, Magnetic Field of a Bar Magnet",
                    "4.2 Field due to Current-Carrying Conductor - Magnetic Field patterns due to a straight wire (Concentric circles), Circular loop, and Solenoid",
                    "4.3 Direction of Field - Right-Hand Thumb Rule for direction of magnetic field",
                    "4.4 Force on a Current-Carrying Conductor - Force (F = BIL), Factors affecting force, Fleming's Left-Hand Rule",
                    "4.5 Electric Motor - Principle, Construction (Coil, Magnet, Split Ring Commutator), Working",
                    "4.6 Electromagnetic Induction (EMI) - Discovery by Faraday, Induced Current, Fleming's Right-Hand Rule (Generator Rule)",
                    "4.7 Electric Generator - Principle, AC vs. DC Generator, Working, Alternating Current (AC) and Direct Current (DC)",
                    "4.8 Domestic Electric Circuits - Live, Neutral, and Earth Wire, Earthing, Fuse, Overloading, and Short Circuit"
                ],
                duration: "8 hours"
            },
            {
                number: 5,
                title: "Sources of Energy",
                icon: "BookOpen",
                topics: [
                    "5.1 Good Source of Energy - Characteristics of an Ideal Fuel, Comparison Table (Calorific Value, Cost, Pollution)",
                    "5.2 Conventional Sources - Fossil Fuels (Coal, Petroleum), Thermal Power Plant, Hydro Power Plant",
                    "5.3 Non-Conventional Sources - Solar Energy (Solar Cell, Solar Cooker), Wind Energy, Bio-mass Energy (Biogas Plant), Ocean Thermal Energy (OTEC), Geothermal Energy, Nuclear Energy",
                    "5.4 Environmental Consequences - Environmental impact of using various energy sources, Focus on sustainability and renewable energy"
                ],
                duration: "6 hours"
            }
        ],
        faqs: [
            {
                question: "What is the difference between Reflection and Refraction?",
                answer: "Reflection is the bouncing back of light when it hits a surface (like a mirror), while Refraction is the bending of light as it passes from one medium to another (like air to glass), caused by a change in speed."
            },
            {
                question: "What is Ohm's Law and its formula?",
                answer: "Ohm's Law states that the current (I) flowing through a conductor between two points is directly proportional to the voltage (V) across the two points. The formula is V=IR, where R is the resistance."
            },
            {
                question: "How is Myopia corrected?",
                answer: "Myopia (near-sightedness) is corrected by using a concave lens (diverging lens) of appropriate power. The concave lens pushes the focal point back onto the retina."
            },
            {
                question: "Is this Class 10 Physics course aligned with the latest CBSE syllabus for 2025-2026?",
                answer: "Yes, this comprehensive course covers all five core Physics chapters prescribed by the latest CBSE Class 10 Science syllabus: Light Reflection and Refraction, Human Eye and Colourful World, Electricity, Magnetic Effects of Electric Current, and Sources of Energy. The content is structured to match NCERT textbook chapters and includes all topics required for board exam preparation."
            },
            {
                question: "Does the course include ray diagrams for mirrors and lenses?",
                answer: "Absolutely! The course provides detailed, step-by-step instructions for drawing ray diagrams for both mirrors and lenses. You'll learn to draw all 6 cases of image formation by concave mirrors, convex mirror ray diagrams, all 6 cases of image formation by convex lenses, and concave lens ray diagrams. Each diagram follows proper ray tracing rules and sign conventions as per CBSE guidelines."
            },
            {
                question: "How does the course help with numerical problems in Electricity chapter?",
                answer: "The Electricity chapter includes extensive coverage of numerical problem-solving. You'll learn to apply Ohm's Law (V = IR), calculate equivalent resistance in series (Req = R1 + R2 + ...) and parallel circuits (1/Req = 1/R1 + 1/R2 + ...), solve Joule's Law of Heating problems (H = I²Rt), and calculate electric power (P = VI = I²R = V²/R) and energy bills using kWh. Each concept includes worked examples and practice problems."
            },
            {
                question: "What are Fleming's Left-Hand Rule and Right-Hand Rule, and when are they used?",
                answer: "Fleming's Left-Hand Rule is used to determine the direction of force on a current-carrying conductor in a magnetic field (used in electric motors). Fleming's Right-Hand Rule (Generator Rule) is used to determine the direction of induced current in electromagnetic induction (used in electric generators). The course provides clear explanations, diagrams, and practical applications of both rules."
            },
            {
                question: "Does the course explain atmospheric phenomena like blue sky and twinkling stars?",
                answer: "Yes! The Human Eye and Colourful World chapter thoroughly explains atmospheric optical phenomena. You'll learn about atmospheric refraction causing twinkling of stars, advanced sunrise and delayed sunset. The course also covers scattering of light, including the Tyndall Effect, why the sky appears blue, and why the sun appears red at sunrise and sunset. All explanations are based on the physics of light scattering and refraction."
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Course",
                "name": "Class 10 Physics Master Course: CBSE/NCERT",
                "description": "Comprehensive, AI-friendly course content for Class 10 Physics covering Light, Electricity, Human Eye, and Magnetic Effects, adhering to CBSE/NCERT curriculum standards.",
                "provider": {
                    "@type": "Organization",
                    "name": "Celoris Academy",
                    "sameAs": "https://celorisdesigns.com"
                },
                "educationalCredentialAwarded": "Certificate of Completion",
                "courseCode": "PHY10-M01",
                "timeRequired": "PT40H",
                "hasCourseInstance": {
                    "@type": "CourseInstance",
                    "courseMode": "online",
                    "location": {
                        "@type": "VirtualLocation",
                        "url": courseData.url
                    },
                    "inLanguage": "en",
                    "offers": {
                        "@type": "Offer",
                        "price": courseData.price.toString(),
                        "priceCurrency": "INR",
                        "availability": "https://schema.org/InStock"
                    }
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": courseData.rating.toString(),
                    "reviewCount": courseData.students.toString()
                },
                "offers": {
                    "@type": "Offer",
                    "price": courseData.price.toString(),
                    "priceCurrency": "INR"
                },
                "coursePrerequisites": "Basic understanding of Class 9 Science and Math.",
                "syllabusSections": [
                    {
                        "@type": "Syllabus",
                        "name": "Chapter 1: Light - Reflection and Refraction",
                        "description": "Mastering spherical mirrors, lenses, sign conventions, and lens/mirror formulas."
                    },
                    {
                        "@type": "Syllabus",
                        "name": "Chapter 2: The Human Eye and the Colourful World",
                        "description": "Understanding vision defects, prisms, dispersion, and atmospheric scattering effects."
                    },
                    {
                        "@type": "Syllabus",
                        "name": "Chapter 3: Electricity",
                        "description": "Detailed study of Ohm's Law, resistance in series and parallel, Joule's Law of Heating, and electric power."
                    },
                    {
                        "@type": "Syllabus",
                        "name": "Chapter 4: Magnetic Effects of Electric Current",
                        "description": "Exploring magnetic fields, solenoids, Fleming's rules, motors, and generators."
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": courseData.faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        ]
    }

    return (
        <div className="min-h-screen bg-background py-8">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container max-w-7xl mx-auto px-4">
                {/* Breadcrumb */}
                <div className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
                    <Link href="/" className="hover:text-primary-500">Home</Link>
                    <span>/</span>
                    <Link href="/learn" className="hover:text-primary-500">Learn</Link>
                    <span>/</span>
                    <Link href="/learn/courses" className="hover:text-primary-500">Courses</Link>
                    <span>/</span>
                    <span className="text-text-primary line-clamp-1">Class 10 Physics</span>
                </div>

                {/* Back Button */}
                <Link href="/learn/courses" className="inline-flex items-center text-text-secondary hover:text-primary-500 mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Course Header */}
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">Physics</span>
                                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">Class 10th</span>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">CBSE Board</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                                {courseData.title}
                            </h1>
                            <p className="text-lg text-text-secondary mb-6">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Preview */}
                        <Card>
                            <div className="aspect-video relative overflow-hidden rounded-lg">
                                <img
                                    src="/class-10-physics-cover.jpg"
                                    alt="Class 10 Physics Master Course - Light, Electricity, Magnetism & Energy"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <Button size="lg" className="bg-white text-black hover:bg-gray-100" asChild>
                                        <Link href="https://www.youtube.com/@celorisacademy" target="_blank">
                                            <Play className="mr-2 h-5 w-5" />
                                            Visit Channel
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* What You'll Learn */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <span>What You Will Master</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-text-secondary">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Course Curriculum */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <BookOpen className="h-5 w-5 text-blue-500" />
                                    <span>Course Curriculum</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.chapters.map((chapter, index) => (
                                        <AccordionItem key={index} value={`chapter-${index}`}>
                                            <AccordionTrigger>
                                                <div className="flex items-center space-x-3 text-left">
                                                    <span className="font-semibold text-primary-600">Chapter {chapter.number}</span>
                                                    <span className="font-medium">{chapter.title}</span>
                                                    <span className="text-sm text-text-secondary ml-auto mr-4">({chapter.duration})</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ul className="space-y-2 ml-4">
                                                    {chapter.topics.map((topic, topicIndex) => (
                                                        <li key={topicIndex} className="flex items-start space-x-2 text-text-secondary">
                                                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span className="text-sm">{topic}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <span className="text-text-secondary">•</span>
                                            <span className="text-text-secondary">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* FAQ Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="h-5 w-5 text-blue-500" />
                                    <span>Frequently Asked Questions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`faq-${index}`}>
                                            <AccordionTrigger>{faq.question}</AccordionTrigger>
                                            <AccordionContent>
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Enrollment Card */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-green-600 mb-2">
                                            {courseData.price === 0 ? "Free" : `₹${courseData.price}`}
                                        </div>
                                        <div className="text-text-secondary">Full Access</div>
                                    </div>
                                    <Button className="w-full mb-4" size="lg">
                                        Enroll Now
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Download className="mr-2 h-4 w-4" />
                                        Download Syllabus
                                    </Button>
                                    <div className="mt-6 text-center text-sm text-text-secondary space-y-2">
                                        <div className="flex items-center justify-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Opportunity to work with us</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Lifetime access</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>Certificate of completion</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span>NCERT aligned content</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Instructor */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Instructor</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-gray-200">
                                            <img src="/celoris-logo.png" alt="Celoris Academy" className="w-12 h-12 object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-text-primary">{courseData.provider}</h3>
                                            <p className="text-sm text-text-secondary">Physics Expert</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-text-secondary mb-4">
                                        Experienced Physics educator specializing in CBSE curriculum with a passion for making complex concepts simple and engaging through visual learning and practical applications.
                                    </p>
                                    <div className="space-y-3 text-sm text-text-secondary">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            <span className="font-medium text-text-primary">{courseData.rating}</span>
                                            <span>({courseData.students} ratings)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4" />
                                            <span>{courseData.duration} course</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-4 w-4" />
                                            <span>{courseData.students} students enrolled</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <BookOpen className="h-4 w-4" />
                                            <span>5 comprehensive chapters</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Course Highlights */}
                            <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                                <CardHeader>
                                    <CardTitle className="text-lg">Course Highlights</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex items-start space-x-2">
                                        <Award className="h-4 w-4 text-blue-600 mt-0.5" />
                                        <span>CBSE Board Exam Focused</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                        <span>34+ Detailed Topics</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5" />
                                        <span>Ray Diagrams & Formulas</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <Zap className="h-4 w-4 text-purple-600 mt-0.5" />
                                        <span>Numerical Problem Solving</span>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <BookOpen className="h-4 w-4 text-indigo-600 mt-0.5" />
                                        <span>NCERT Solutions Included</span>
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
