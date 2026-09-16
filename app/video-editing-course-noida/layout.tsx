import { Metadata } from 'next';

// This route's page.tsx is a client component that sets document.title /
// the meta description via useEffect — that only runs after JS hydration,
// so a crawler that reads the server-rendered HTML (many AI bots, and even
// some search crawlers) was seeing the site-wide default title/description
// instead of this page's own, and there was no canonical tag at all. This
// sibling layout mirrors the pattern already used under app/courses/*/layout.tsx
// so the correct metadata ships in the initial HTML.
export const metadata: Metadata = {
    title: "Video Editing Course in Noida | Celoris — Book Free Demo",
    description: "Learn video editing in Noida — Premiere Pro, After Effects, CapCut & DaVinci Resolve. Online & offline. Build a portfolio of 5+ real projects. Free demo available!",
    alternates: {
        canonical: '/video-editing-course-noida',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
