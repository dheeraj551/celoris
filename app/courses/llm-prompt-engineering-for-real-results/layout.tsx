import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/llm-prompt-engineering-for-real-results',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
