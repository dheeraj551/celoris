import { type Metadata } from "next"
import BlenderBeginnerClient from "./BlenderBeginnerClient"

export const metadata: Metadata = {
    title: "Blender 3D Modelling — Complete Beginner Course | Celoris",
    description: "From zero to your first 3D model — no experience needed. Learn Blender from scratch with Dheeraj Kushwaha. Free demo available. celoris.in",
    openGraph: {
        title: "Blender 3D Modelling Course for Beginners | Celoris",
        description: "From zero to your first 3D model — no experience needed. Learn Blender from scratch with Dheeraj Kushwaha. Free demo available. celoris.in",
    }
}

export default function BlenderBeginnerPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Course",
                            "name": "Blender 3D Modelling — Complete Beginner Course",
                            "description": "This course is for complete beginners who have never opened Blender before. You do not need any prior design experience, coding knowledge or expensive hardware.",
                            "provider": {
                                "@type": "Organization",
                                "@name": "Celoris",
                                "sameAs": "https://celoris.in"
                            }
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [
                                {
                                    "@type": "Question",
                                    "name": "I have never done any 3D work before — is this course really for me?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes — this course assumes zero prior knowledge of Blender or any 3D software. Module 1 starts from installing Blender for the first time and every tool is explained from scratch."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "What kind of laptop do I need?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Blender runs on most modern Windows and Mac laptops. For smooth performance a minimum of 8GB RAM and a dedicated graphics card is recommended. The course includes a session on optimising Blender settings for basic hardware."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Is Blender really free?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Blender is 100% free and open source forever. There are no subscription fees, no watermarks and no feature restrictions."
                                    }
                                },
                                {
                                    "@type": "Question",
                                    "name": "Can I make money after completing this course?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Yes — 3D modelling is one of the fastest-growing freelance skills in India. Ecommerce companies, architects, brands, and YouTube creators all need 3D content."
                                    }
                                }
                            ]
                        }
                    ])
                }}
            />
            <BlenderBeginnerClient />
        </>
    )
}
