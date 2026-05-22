import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/agentic-ai-masterclass',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
