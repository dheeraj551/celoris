import { Metadata } from 'next';

// Mirrors the sibling app/digital-marketing-course-noida/layout.tsx pattern:
// server-rendered metadata so crawlers see the real title/description/canonical
// on the initial HTML instead of a client-side useEffect update.
export const metadata: Metadata = {
    title: "Digital Marketing Course in Delhi | Celoris",
    description: "Hands-on digital marketing course for Delhi NCR — live ad campaigns, real data, transparent fees from ₹2,500. No hidden charges, no guesswork.",
    alternates: {
        canonical: '/digital-marketing-course-delhi',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
