import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/professional-retouching-in-photoshop',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
