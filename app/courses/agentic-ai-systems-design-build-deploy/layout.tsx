import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/agentic-ai-systems-design-build-deploy',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
