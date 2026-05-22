import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/cbse-class-9-physics-motion-force-energy-sound',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
