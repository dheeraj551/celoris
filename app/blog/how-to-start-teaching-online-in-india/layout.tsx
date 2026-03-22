import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Best Platform for Online Trainers in India 2025 | Celoris",
    description: "Thinking of teaching online in India? Learn how Celoris helps new trainers grow without per-lead charges, coin systems, or platform restrictions. Free to join.",
    keywords: ["online teaching platform India", "best platform for trainers India", "how to start online teaching India", "teach online without paying per lead", "celoris trainer platform"],
    openGraph: {
        title: "How to Start Teaching Online in India: The Complete Guide",
        description: "Everything you need to know about starting your online teaching business in India with zero per-lead costs.",
        images: ["/blog-how-to-start-teaching-online-in-india.png"],
    }
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
