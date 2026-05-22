import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/sovereign-intelligence',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
