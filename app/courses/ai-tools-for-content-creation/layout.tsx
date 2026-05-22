import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/ai-tools-for-content-creation',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
