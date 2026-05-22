import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/personalized-ai-experiences-with-rag-and-agents',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
