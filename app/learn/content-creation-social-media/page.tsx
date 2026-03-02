import { type Metadata } from "next"
import ContentCreationClient from "./ContentCreationClient"

export const metadata: Metadata = {
    title: "Content Creation on Social Media — From Creator to Income | Celoris",
    description: "Master Instagram and YouTube content creation with Dheeraj Kushwaha. Stop posting for likes, start creating for money. Full course ₹4,999. Free demo available. celoris.in",
    openGraph: {
        title: "Content Creation Mastery — Instagram & YouTube Course | Celoris",
        description: "Scale from creator to income. Complete content business system for Indian creators. Learn strategy, growth, and monetisation. celoris.in",
    }
}

export default function ContentCreationPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Course",
                            "name": "Content Creation on Social Media — From Creator to Income",
                            "description": "This is a practical, monetisation-focused course for creators who are stuck at a follower count or not making money. Learn to build a content business on Instagram and YouTube.",
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
                                    "name": "Is there a free demo for the content creation course?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes — you can book one free demo class to understand the curriculum and teaching style. The full 5-module comprehensive course is available for ₹4,999."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "I already post but don't get views — is this for me?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes — specifically designed for creators stuck at growth plateaus. Module 1 audited why your content isn't working and fixes it systematically."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Do I need a large following to monetise?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "No — Module 4 covers how creators with 2k-5k followers earn ₹15k-30k per month. Authority and engagement matter more than count."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "What equipment do I need?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Just your smartphone. We show you how to produce high-quality content without expensive gear in Module 2."
                                    }
                                }
                            ]
                        }
                    ])
                }}
            />
            <ContentCreationClient />
        </>
    )
}
