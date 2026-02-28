import { type Metadata } from "next"
import ExcelExpertClient from "./ExcelExpertClient"

export const metadata: Metadata = {
    title: "Be an Excel Expert — Online Course India | Celoris",
    description: "Learn Microsoft Excel from beginner to Macro master with Dheeraj Kushwaha — 229 reviews, 682 students trained. Free demo available. celoris.in",
    openGraph: {
        title: "Excel Expert Course India — Live + Self Paced | Celoris",
        description: "Learn Microsoft Excel from beginner to Macro master with Dheeraj Kushwaha — 229 reviews, 682 students trained. Free demo available. celoris.in",
    }
}

export default function ExcelExpertPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Course",
                            "name": "Be an Excel Expert — From Beginner to Macro Master",
                            "description": "This is not a generic Excel course. This is the exact curriculum developed and refined over 8 years of training working professionals across India.",
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
                                    "name": "Is this Excel course free on Celoris?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Your first live demo session is completely free. After that each module is available at an affordable price — significantly lower than similar courses elsewhere. Self-paced recorded content is available free."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Is this the same course available on UrbanPro?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes — this is the exact same curriculum by Dheeraj Kushwaha that has 229 verified reviews and 682 students on UrbanPro."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Will I get a certificate?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes — a Celoris Certificate of Completion after each module and a full course certificate signed by the trainer on completing all 4 modules."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Does this course cover Excel interview questions?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Absolutely — this course was specifically designed to help students crack Excel interview questions asked in KPO, banking and corporate jobs. VLOOKUP, PivotTables and IF formulas are covered in depth."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "How is this better than free YouTube tutorials?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "YouTube gives you videos with no feedback. This course gives you a real trainer who knows the Indian workplace, answers your specific questions, and prepares you for actual job interviews."
                                    }
                                }
                            ]
                        }
                    ])
                }}
            />
            <ExcelExpertClient />
        </>
    )
}
