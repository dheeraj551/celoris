import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/vibe-coding-mastery',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
