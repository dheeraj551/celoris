import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/agentic-ai-for-beginners',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
