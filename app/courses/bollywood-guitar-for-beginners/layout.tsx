import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/bollywood-guitar-for-beginners',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
