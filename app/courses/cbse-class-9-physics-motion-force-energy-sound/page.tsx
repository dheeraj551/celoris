"use client"

import { useState } from "react"
import { ArrowLeft, Clock, Users, Star, Award, Play, Download, CheckCircle, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CourseInquiryDialog } from "@/components/CourseInquiryDialog"
import { InteractiveQuiz } from "@/components/InteractiveQuiz"

export default function CBSEClass9PhysicsCourse() {
    const courseData = {
        title: "CBSE Class 9 Physics Mastery Course (2025-2026)",
        description: "This comprehensive, CBSE-aligned Class 9 Physics course is your essential guide to building a strong conceptual foundation and achieving high exam scores. We cover the entire official curriculum, focusing on conceptual clarity, problem-solving skills, and CBSE examination patterns. Master the core concepts with clear explanations, diagrams, and extensive solved numerical examples.",
        students: 120,
        rating: 4.8,
        duration: "3 months",
        price: 1500.00,
        currency: "INR",
        provider: "Celoris Designs",
        website: "https://celorisdesigns.com",
        url: "https://celorisdesigns.com/courses/cbse-class-9-physics-motion-force-energy-sound",
        learning_outcomes: [
            "Motion (Kinematics): Understand distance, displacement, speed, velocity, and acceleration. In-depth analysis of motion graphs. Derivation and application of the three Equations of Motion Class 9 ($v = u + at$, $s = ut + \\frac{1}{2}at^2$, $v^2 = u^2 + 2as$).",
            "Force and Laws of Motion: Detailed explanation of Newton’s Three Laws of Motion and their real-life applications. Core concepts of Inertia and Momentum. Thorough coverage of the Law of Conservation of Momentum.",
            "Gravitation and Flotation: Study the Universal Law of Gravitation and Free Fall. Calculate Acceleration due to Gravity ($g$). Differentiate between Mass and Weight. Thrust and Pressure, Buoyancy, and the critical principles of Archimedes’ Principle and Flotation.",
            "Work, Energy, and Power: Definitions and derivations of Kinetic Energy ($KE = \\frac{1}{2}mv^2$) and Potential Energy ($PE = mgh$). Work done by forces and the Law of Conservation of Energy. Practice high-level Work Energy Power Class 9 numericals.",
            "Sound: Nature and propagation of Sound Waves and characteristics (pitch, loudness). Speed of sound in different media. Reflection of sound (Echo) and the human hearing range."
        ],
        requirements: [
            "Basic understanding of Class 8 Science concepts.",
            "CBSE Exam-Oriented Content",
            "Derivations and Formulas Made Simple",
            "Extensive Solved Numericals for every chapter",
            "Conceptual Clarity guaranteed"
        ],
        faqs: [
            {
                question: "Is this Class 9 Physics course aligned with the latest CBSE syllabus?",
                answer: "Yes, this is a comprehensive, exam-oriented course covering all five core chapters prescribed by the latest CBSE Class 9 Physics syllabus: Motion, Force and Laws of Motion, Gravitation, Work-Energy-Power, and Sound."
            },
            {
                question: "Does the course include solved numericals and derivations?",
                answer: "Absolutely. The course provides clear derivation and application of the three Equations of Motion and includes numerous solved numerical examples based on CBSE exam patterns, particularly for chapters like Work, Energy, and Power."
            },
            {
                question: "What specific fluid mechanics topics are covered in Gravitation?",
                answer: "The course covers Thrust and Pressure, Buoyancy, the principles of flotation, and a detailed explanation of Archimedes’ Principle, ensuring conceptual clarity for fluid mechanics topics."
            },
            {
                question: "What makes this course AI-friendly for tools like Gemini and ChatGPT?",
                answer: "The content is structured using explicit Q&A formats, clearly defined terms, and technical formulas like the $KE = \\frac{1}{2}mv^2$ formula. The use of this FAQPage structured data ensures high extractability by Large Language Models (LLMs) for direct answers and citations."
            }
        ],
        parent_reviews: [
            {
                name: "Rajesh Sharma",
                occupation: "Government Officer",
                rating: 5,
                content: "My son struggled with Physics concepts earlier, especially numericals. After enrolling in this course, his understanding has improved drastically. The explanations are clear and very exam-oriented. Highly satisfied."
            },
            {
                name: "Sunita Verma",
                occupation: "School Teacher",
                rating: 5,
                content: "As a teacher myself, I appreciate how systematically the syllabus is covered. Derivations and formulas are explained in a student-friendly way. This course truly builds a strong foundation for Class 10."
            },
            {
                name: "Anil Gupta",
                occupation: "Chartered Accountant",
                rating: 4.5,
                content: "The course focuses equally on concepts and problem-solving. My daughter is now confident in motion graphs and equations. The structured approach makes learning Physics much easier."
            },
            {
                name: "Pooja Mehta",
                occupation: "Homemaker",
                rating: 5,
                content: "Earlier, my child used to memorize Physics without understanding. Now he explains concepts like Newton’s laws and gravitation confidently. The teaching quality is excellent."
            },
            {
                name: "Vikram Singh",
                occupation: "Business Owner",
                rating: 5,
                content: "This course is very well designed for CBSE students. The Work, Energy, and Power chapter helped my son score much better in school tests. Worth every rupee."
            },
            {
                name: "Neha Kapoor",
                occupation: "HR Manager",
                rating: 4.5,
                content: "I liked how numericals are solved step by step. The course removes fear of Physics and replaces it with confidence. The sound chapter was explained exceptionally well."
            },
            {
                name: "Suresh Iyer",
                occupation: "Mechanical Engineer",
                rating: 5,
                content: "The scientific accuracy and clarity of explanations impressed me. Topics like momentum, buoyancy, and Archimedes’ Principle are explained better than many tuition classes."
            },
            {
                name: "Kavita Malhotra",
                occupation: "Bank Manager",
                rating: 5,
                content: "This course is extremely helpful for exam preparation. My daughter now writes proper derivations and understands when to apply formulas instead of guessing."
            },
            {
                name: "Ramesh Patel",
                occupation: "Textile Trader",
                rating: 4.5,
                content: "The interactive quiz and chapter-wise practice helped my child revise efficiently before exams. It’s a very practical and student-focused course."
            },
            {
                name: "Alok Mishra",
                occupation: "IT Project Manager",
                rating: 5,
                content: "A perfect course for building conceptual clarity in Physics. My son’s interest in the subject has increased, and his performance has improved significantly."
            }
        ],
        quiz_data: [
            {
                title: "Unit 1: Motion (Kinematics)",
                questions: [
                    {
                        question: "Which of the following is a vector quantity?",
                        options: ["Distance", "Speed", "Displacement", "Time"],
                        correctIndex: 2,
                        explanation: "Displacement has both magnitude and direction."
                    },
                    {
                        question: "The rate of change of velocity is called:",
                        options: ["Speed", "Acceleration", "Displacement", "Distance"],
                        correctIndex: 1,
                        explanation: "Acceleration is defined as the change in velocity per unit time."
                    },
                    {
                        question: "What does the slope of a distance-time graph represent?",
                        options: ["Acceleration", "Speed", "Displacement", "Force"],
                        correctIndex: 1,
                        explanation: "The slope of distance vs time gives the speed of the object."
                    },
                    {
                        question: "Identify the correct first equation of motion:",
                        options: [
                            "s = ut + ½ at²",
                            "v² = u² + 2as",
                            "v = u + at",
                            "F = ma"
                        ],
                        correctIndex: 2,
                        explanation: "v = u + at relates final velocity with initial velocity, acceleration, and time."
                    },
                    {
                        question: "A body moving in a straight line with constant velocity has an acceleration of:",
                        options: ["Zero", "Increasing", "Decreasing", "Uniform"],
                        correctIndex: 0,
                        explanation: "Current velocity is not changing, so acceleration is zero."
                    },
                    {
                        question: "The S.I. unit of acceleration is:",
                        options: ["m/s", "m/s²", "km/h", "m²/s"],
                        correctIndex: 1,
                        explanation: "Acceleration is meters per second squared."
                    },
                    {
                        question: "In the equation s = ut + ½ at², 's' stands for:",
                        options: ["Speed", "Displacement", "Second", "Surface area"],
                        correctIndex: 1,
                        explanation: "'s' represents displacement in the equations of motion."
                    },
                    {
                        question: "If an object returns to its starting point, its total displacement is:",
                        options: ["Equal to distance", "Zero", "Infinite", "Negative"],
                        correctIndex: 1,
                        explanation: "Displacement is the shortest path between start and end points. If they are the same, displacement is zero."
                    },
                    {
                        question: "Negative acceleration is also known as:",
                        options: ["Retardation", "Friction", "Inertia", "Velocity"],
                        correctIndex: 0,
                        explanation: "Retardation (or deceleration) occurs when velocity decreases."
                    },
                    {
                        question: "The third equation of motion is represented as:",
                        options: [
                            "v = u + at",
                            "s = ut + ½ at²",
                            "v² = u² + 2as",
                            "p = mv"
                        ],
                        correctIndex: 2,
                        explanation: "The third equation relates velocities and displacement without time."
                    }
                ]
            },
            {
                title: "Unit 2: Force and Laws of Motion",
                questions: [
                    {
                        question: "The property of an object to resist a change in its state of motion is:",
                        options: ["Momentum", "Force", "Inertia", "Acceleration"],
                        correctIndex: 2,
                        explanation: "Inertia is the tendency to resist changes in motion."
                    },
                    {
                        question: "Newton’s First Law of Motion is also known as the Law of:",
                        options: ["Conservation", "Inertia", "Gravity", "Sound"],
                        correctIndex: 1,
                        explanation: "It states that objects at rest stay at rest unless acted upon."
                    },
                    {
                        question: "The mathematical formula for Momentum (p) is:",
                        options: ["p = m/v", "p = mv", "p = ma", "p = Fs"],
                        correctIndex: 1,
                        explanation: "Momentum is the product of mass and velocity."
                    },
                    {
                        question: "Newton’s Second Law of Motion relates force to:",
                        options: ["Mass and Acceleration (F=ma)", "Velocity and Time", "Inertia and Distance", "Work and Energy"],
                        correctIndex: 0,
                        explanation: "Force is directly proportional to the rate of change of momentum (F=ma)."
                    },
                    {
                        question: "'To every action, there is an equal and opposite reaction' is Newton's:",
                        options: ["First Law", "Second Law", "Third Law", "Law of Gravitation"],
                        correctIndex: 2
                    },
                    {
                        question: "The S.I. unit of Force is:",
                        options: ["Joule", "Watt", "Newton", "Pascal"],
                        correctIndex: 2
                    },
                    {
                        question: "In a collision between two objects, the total momentum remains constant provided no external force acts. This is the:",
                        options: ["Law of Inertia", "Law of Conservation of Momentum", "Universal Law of Gravitation", "Archimedes' Principle"],
                        correctIndex: 1
                    },
                    {
                        question: "Which of the following has the most inertia?",
                        options: ["A rubber ball", "A bicycle", "A train", "A football"],
                        correctIndex: 2,
                        explanation: "Inertia depends on mass. A train has the largest mass."
                    },
                    {
                        question: "If the net force acting on a body is zero, the forces are said to be:",
                        options: ["Unbalanced", "Balanced", "Gravitational", "Frictional"],
                        correctIndex: 1
                    },
                    {
                        question: "Recoil of a gun is an application of:",
                        options: ["Newton's First Law", "Newton's Third Law", "Law of Flotation", "Potential Energy"],
                        correctIndex: 1,
                        explanation: "Action is bullet moving forward, reaction is gun moving backward."
                    }
                ]
            },
            {
                title: "Unit 3: Gravitation and Flotation",
                questions: [
                    {
                        question: "The force of attraction between any two objects in the universe is:",
                        options: ["Friction", "Gravitation", "Inertia", "Buoyancy"],
                        correctIndex: 1
                    },
                    {
                        question: "The value of acceleration due to gravity (g) on Earth is approximately:",
                        options: ["9.8 m/s²", "1.6 m/s²", "100 m/s²", "0 m/s²"],
                        correctIndex: 0
                    },
                    {
                        question: "Which of these remains constant regardless of location?",
                        options: ["Weight", "Mass", "Acceleration due to gravity", "Buoyant force"],
                        correctIndex: 1,
                        explanation: "Mass is the amount of matter and doesn't change based on gravity."
                    },
                    {
                        question: "The weight of an object on the moon is ____ its weight on Earth.",
                        options: ["Equal to", "Double", "One-sixth of", "Six times"],
                        correctIndex: 2
                    },
                    {
                        question: "Thrust per unit area is called:",
                        options: ["Force", "Pressure", "Density", "Work"],
                        correctIndex: 1
                    },
                    {
                        question: "The upward force exerted by a fluid on an immersed object is:",
                        options: ["Gravitation", "Buoyancy", "Tension", "Friction"],
                        correctIndex: 1
                    },
                    {
                        question: "Archimedes’ Principle is used to determine:",
                        options: ["Velocity of sound", "Relative density and purity of substances", "Newton’s Second Law", "Kinetic Energy"],
                        correctIndex: 1
                    },
                    {
                        question: "An object will float when the buoyant force is:",
                        options: ["Less than its weight", "Greater than or equal to its weight", "Zero", "Always less than gravity"],
                        correctIndex: 1
                    },
                    {
                        question: "The S.I. unit of Pressure is:",
                        options: ["Newton", "Pascal", "Joule", "Watt"],
                        correctIndex: 1
                    },
                    {
                        question: "Free fall occurs when an object falls under the influence of:",
                        options: ["Air resistance", "Gravity alone", "Magnetic force", "Engine power"],
                        correctIndex: 1
                    }
                ]
            },
            {
                title: "Unit 4: Work, Energy, and Power",
                questions: [
                    {
                        question: "Work is done only when:",
                        options: ["A force is applied", "A force causes displacement", "An object is at rest", "Energy is conserved"],
                        correctIndex: 1
                    },
                    {
                        question: "The formula for Kinetic Energy is:",
                        options: ["mgh", "½ mv²", "mv", "Fs"],
                        correctIndex: 1
                    },
                    {
                        question: "Potential Energy of an object at a height 'h' is given by:",
                        options: ["½ mv²", "mgh", "ma", "P/t"],
                        correctIndex: 1
                    },
                    {
                        question: "The S.I. unit of Work and Energy is:",
                        options: ["Newton", "Watt", "Joule", "Pascal"],
                        correctIndex: 2
                    },
                    {
                        question: "'Energy can neither be created nor destroyed, only transformed.' This is the:",
                        options: ["Law of Inertia", "Law of Conservation of Energy", "Universal Law of Gravitation", "Law of Flotation"],
                        correctIndex: 1
                    },
                    {
                        question: "Power is defined as the:",
                        options: ["Capacity to do work", "Rate of doing work", "Force per unit area", "Product of mass and velocity"],
                        correctIndex: 1
                    },
                    {
                        question: "The S.I. unit of Power is:",
                        options: ["Joule", "Watt", "Newton", "Meter/second"],
                        correctIndex: 1
                    },
                    {
                        question: "When a ball is thrown upwards, its Kinetic Energy converts into:",
                        options: ["Heat Energy", "Potential Energy", "Sound Energy", "Nuclear Energy"],
                        correctIndex: 1
                    },
                    {
                        question: "Commercial unit of electrical energy (1 unit) is:",
                        options: ["Joule", "Kilowatt-hour (kWh)", "Watt", "Newton-meter"],
                        correctIndex: 1
                    },
                    {
                        question: "If the velocity of an object is doubled, its Kinetic Energy becomes:",
                        options: ["Double", "Four times", "Half", "Same"],
                        correctIndex: 1,
                        explanation: "KE is proportional to v². Double v means 2² = 4 times KE."
                    }
                ]
            },
            {
                title: "Unit 5: Sound",
                questions: [
                    {
                        question: "Sound is a form of energy that travels as a:",
                        options: ["Transverse wave", "Longitudinal wave", "Electromagnetic wave", "Static wave"],
                        correctIndex: 1
                    },
                    {
                        question: "Sound cannot travel through:",
                        options: ["Water", "Steel", "Air", "Vacuum"],
                        correctIndex: 3,
                        explanation: "Sound requires a medium to travel."
                    },
                    {
                        question: "The number of oscillations per unit time is called:",
                        options: ["Amplitude", "Frequency", "Pitch", "Wavelength"],
                        correctIndex: 1
                    },
                    {
                        question: "The human hearing range is:",
                        options: ["0 Hz to 20 Hz", "20 Hz to 20,000 Hz", "Above 20,000 Hz", "100 Hz to 1,000 Hz"],
                        correctIndex: 1
                    },
                    {
                        question: "The pitch of a sound depends on its:",
                        options: ["Amplitude", "Frequency", "Speed", "Reflection"],
                        correctIndex: 1
                    },
                    {
                        question: "Loudness of sound is determined by its:",
                        options: ["Amplitude", "Frequency", "Speed", "Density of medium"],
                        correctIndex: 0
                    },
                    {
                        question: "The repetition of sound caused by reflection is known as an:",
                        options: ["Vibration", "Echo", "Note", "Tone"],
                        correctIndex: 1
                    },
                    {
                        question: "In which medium does sound travel the fastest?",
                        options: ["Gas", "Liquid", "Solid", "Vacuum"],
                        correctIndex: 2,
                        explanation: "Sound travels fastest in solids due to higher molecular density."
                    },
                    {
                        question: "Sound waves with frequencies below 20 Hz are called:",
                        options: ["Ultrasonic", "Infrasonic", "Audible", "Supersonic"],
                        correctIndex: 1
                    },
                    {
                        question: "The speed of sound in air is approximately:",
                        options: ["3×10⁸ m/s", "344 m/s", "1500 m/s", "10 m/s"],
                        correctIndex: 1
                    }
                ]
            }
        ]
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        "@id": `${courseData.url}#course`,
        "name": courseData.title,
        "description": courseData.description,
        "provider": {
            "@type": "Organization",
            "name": courseData.provider,
            "sameAs": courseData.website
        },
        "educationalLevel": "Grade 9",
        "coursePrerequisites": "Basic understanding of Class 8 Science concepts.",
        "offers": {
            "@type": "Offer",
            "url": courseData.url,
            "priceCurrency": courseData.currency,
            "price": courseData.price.toString(),
            "availability": "https://schema.org/InStock"
        },
        "hasCourseInstance": [
            {
                "@type": "CourseInstance",
                "courseMode": "online",
                "name": "Full Class 9 Physics Curriculum (CBSE)",
                "inLanguage": "en"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": courseData.rating.toString(),
            "reviewCount": courseData.parent_reviews.length.toString()
        },
        "review": courseData.parent_reviews.map(review => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": review.name
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating.toString()
            },
            "reviewBody": review.content
        }))
    }

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${courseData.url}#faq`,
        "mainEntity": courseData.faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }

    return (
        <div className="min-h-screen bg-background py-8">
            {/* JSON-LD Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, faqJsonLd]) }}
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
                    <span className="text-foreground line-clamp-1">{courseData.title}</span>
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
                                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Physics</span>
                                <span className="bg-slate-200 text-slate-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Class 9th</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                {courseData.title}
                            </h1>
                            <p className="text-lg text-muted-foreground mb-6">
                                {courseData.description}
                            </p>
                        </div>

                        {/* Course Image */}
                        <Card>
                            <div className="aspect-video relative overflow-hidden rounded-lg">
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/T-cNrCcFiCk"
                                    title="CBSE Class 9 Physics Mastery Course - Motion, Force, Energy, Sound"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </Card>

                        {/* What You'll Learn */}
                        <Card id="curriculum" className="bg-white border-slate-200">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-slate-900">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <span>What You Will Master</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {courseData.learning_outcomes.map((item, index) => (
                                        <li key={index} className="flex items-start space-x-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-slate-700 font-medium leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card className="bg-white border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {courseData.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start space-x-2">
                                            <span className="text-slate-400 font-bold">•</span>
                                            <span className="text-slate-700 font-medium">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Parent Reviews */}
                        <Card id="reviews">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                                    <span>What Parents Say</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courseData.parent_reviews.map((review, index) => (
                                        <div key={index} className="space-y-3 p-4 rounded-xl bg-surface/50 border border-border/50 hover:border-primary-200 transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex text-yellow-500">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < Math.floor(review.rating) ? "fill-current" : (i < review.rating ? "fill-current opacity-50" : "text-gray-300")}`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm font-semibold text-text-secondary">{review.rating}/5</span>
                                            </div>
                                            <p className="text-text-secondary text-sm italic leading-relaxed">
                                                "{review.content}"
                                            </p>
                                            <div className="pt-3 border-t border-border/50">
                                                <p className="font-bold text-foreground text-sm">{review.name}</p>
                                                <p className="text-xs text-muted-foreground font-medium">{review.occupation}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* FAQ Section */}
                        <Card className="text-slate-900">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <HelpCircle className="h-5 w-5 text-blue-500" />
                                    <span className="font-bold">Frequently Asked Questions</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {courseData.faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-slate-200">
                                            <AccordionTrigger className="text-slate-900 font-bold text-left">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-slate-700 leading-relaxed italic">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Interactive Quiz Section */}
                        <div id="quiz" className="pt-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-foreground mb-2">Test Your Knowledge</h2>
                                <p className="text-muted-foreground">Take our interactive quiz to validate your understanding of Class 9 Physics concepts.</p>
                            </div>
                            <InteractiveQuiz
                                quizTitle="Class 9 Physics Mastery Quiz"
                                quizDescription="Test your knowledge across all 5 units of Class 9 Physics."
                                quizUnits={courseData.quiz_data}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Enrollment Card */}
                            <Card className="bg-white border-slate-200 shadow-xl shadow-primary-900/10">
                                <CardContent className="p-6">
                                    <div className="text-center mb-6">
                                        <div className="text-4xl font-bold text-slate-900 mb-2">
                                            ₹{courseData.price}
                                        </div>
                                        <div className="text-slate-500 font-medium">One-time payment</div>
                                    </div>
                                    <CourseInquiryDialog
                                        courseTitle={courseData.title}
                                        buttonClassName="w-full mb-4"
                                    />
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        Take Assessment Quiz
                                    </Button>
                                    <div className="mt-6 text-center text-sm text-text-secondary">
                                        <div className="flex items-center justify-center space-x-4">
                                            <span>• Opportunity to work with us</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 mt-2">
                                            <span>• Lifetime access</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 mt-2">
                                            <span>• Certificate of completion</span>
                                        </div>
                                        <div className="flex items-center justify-center space-x-4 mt-4 py-2 bg-yellow-50 rounded-lg border border-yellow-100 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' })}>
                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                            <span className="font-semibold text-yellow-800">10+ Five-Star Parent Reviews</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-white border-slate-200">
                                <CardHeader>
                                    <CardTitle className="text-slate-900">Your Instructor</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-slate-100">
                                            <img src="/celoris-logo.png" alt="Celoris" className="w-12 h-12 object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{courseData.provider}</h3>
                                            <p className="text-xs text-slate-500 font-medium">Course Instructor</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                                        Passionate about teaching and helping others break into tech. This course is designed to provide you with the best learning experience.
                                    </p>
                                    <div className="space-y-3 text-sm text-slate-600 font-semibold">
                                        <div className="flex items-center space-x-2">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                                            <span className="text-slate-900">{courseData.rating}</span>
                                            <span className="text-slate-400 font-normal">({courseData.students} ratings)</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Clock className="h-4 w-4 text-primary-600" />
                                            <span>{courseData.duration}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Users className="h-4 w-4 text-primary-600" />
                                            <span>{courseData.students} enrolled</span>
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
