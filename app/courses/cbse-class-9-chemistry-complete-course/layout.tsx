import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/cbse-class-9-chemistry-complete-course',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
