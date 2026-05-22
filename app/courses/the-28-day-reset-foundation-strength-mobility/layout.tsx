import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/the-28-day-reset-foundation-strength-mobility',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
