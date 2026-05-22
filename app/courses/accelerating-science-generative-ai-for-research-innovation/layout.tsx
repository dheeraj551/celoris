import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/accelerating-science-generative-ai-for-research-innovation',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
