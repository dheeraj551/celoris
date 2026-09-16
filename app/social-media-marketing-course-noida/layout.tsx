import { Metadata } from 'next';

// This route's page.tsx is a client component that sets document.title /
// the meta description via useEffect — that only runs after JS hydration,
// so a crawler that reads the server-rendered HTML (many AI bots, and even
// some search crawlers) was seeing the site-wide default title/description
// instead of this page's own, and there was no canonical tag at all. This
// sibling layout mirrors the pattern already used under app/courses/*/layout.tsx
// so the correct metadata ships in the initial HTML.
export const metadata: Metadata = {
    title: "Social Media Marketing Course in Noida | Celoris — Book Free Demo",
    description: "Learn social media marketing in Noida. Instagram, Facebook, LinkedIn, YouTube strategy + paid ads. Online & offline. Free demo available. Book today!",
    alternates: {
        canonical: '/social-media-marketing-course-noida',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
