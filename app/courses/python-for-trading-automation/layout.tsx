import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/python-for-trading-automation',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
