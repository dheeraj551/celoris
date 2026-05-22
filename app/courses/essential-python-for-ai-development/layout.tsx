import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/essential-python-for-ai-development',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
