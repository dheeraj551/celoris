import { type Metadata } from "next"
import SpeakWithConfidenceClient from "./SpeakWithConfidenceClient"

export const metadata: Metadata = {
    title: "Speak with Confidence — Complete Spoken English Course | Celoris",
    description: "Master Spoken English in 8 weeks with our comprehensive course. Pronunciation, Grammar, Fluency, and Business English for beginners. Book a free demo.",
    openGraph: {
        title: "Speak with Confidence — Online Spoken English Course | Celoris",
        description: "Comprehensive 8-week program designed for beginners. Learn to speak English fluently and confidently in professional and daily settings.",
    }
}

export default function SpeakWithConfidencePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Course",
                            "name": "SPEAK WITH CONFIDENCE — A Complete Spoken English Course for Beginners",
                            "description": "Speak with Confidence is a comprehensive 8-week Spoken English program designed specifically for complete beginners. Take you from basic sounds to fluent, confident conversation.",
                            "provider": {
                                "@type": "Organization",
                                "name": "Celoris",
                                "sameAs": "https://celoris.in"
                            }
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": "Who is this Spoken English course for?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "This course is designed for students, working professionals, or anyone who wants to communicate better in everyday life. It starts from the absolute basics of English sounds."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "How long is the course?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "It is a comprehensive 8-week program with over 40 lessons and 100+ exercises."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Will I learn Business English?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes, Module 7 specifically covers Business English, including professional introductions, meeting etiquette, presentations, and email language."
                                    }
                                }
                            ]
                        }
                    ])
                }}
            />
            <SpeakWithConfidenceClient />
        </>
    )
}
