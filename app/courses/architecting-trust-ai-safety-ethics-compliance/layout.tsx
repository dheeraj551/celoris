import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/architecting-trust-ai-safety-ethics-compliance',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
