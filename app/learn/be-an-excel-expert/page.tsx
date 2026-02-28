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
                                        "text": "Your first live demo session is completely free. After that each module is available at an affordable price."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Will I get a certificate?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes — a Celoris Certificate of Completion after each module and a full course certificate signed by the trainer."
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
