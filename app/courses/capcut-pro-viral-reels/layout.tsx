import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/capcut-pro-viral-reels',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
