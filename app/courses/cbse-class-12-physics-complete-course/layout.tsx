import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/cbse-class-12-physics-complete-course',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
