import { type Metadata } from "next"
import HathaYogaClient from "./HathaYogaClient"

export const metadata: Metadata = {
    title: "Online Hatha Yoga Classes for Beginners — Live Sessions | Celoris",
    description: "Learn authentic Hatha Yoga from a certified trainer — live online sessions, small batches, beginner friendly. Complete 8-week foundation programme. celoris.in",
    openGraph: {
        title: "Online Hatha Yoga for Beginners | Live Online Sessions | Celoris",
        description: "Personal guidance, small batches (max 8), and alignment correction. Start your yoga journey with a certified trainer. Free demo available.",
    }
}

export default function HathaYogaPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "Course",
                            "name": "Online Hatha Yoga for Beginners — Complete Foundation Programme",
                            "description": "Learn authentic Hatha Yoga from a certified trainer — live online sessions, small batches, beginner friendly. 8-week structured course.",
                            "provider": {
                                "@type": "Organization",
                                "@name": "Celoris",
                                "sameAs": "https://celoris.in"
                            }
                        }
                    ])
                }}
            />
            <HathaYogaClient />
        </>
    )
}
