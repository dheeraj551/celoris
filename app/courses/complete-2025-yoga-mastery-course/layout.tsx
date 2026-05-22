import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/complete-2025-yoga-mastery-course',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
