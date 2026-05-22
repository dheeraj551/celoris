import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/cbse-class-10-physics-light-electricity-magnetism-energy',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
