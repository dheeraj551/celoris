import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/cbse-class-9-mathematics-complete-syllabus-mastery-guide',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
