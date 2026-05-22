import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/rag-unlocked-production-grade-search-answer-systems',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
