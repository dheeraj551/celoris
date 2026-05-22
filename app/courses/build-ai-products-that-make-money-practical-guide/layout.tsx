import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/build-ai-products-that-make-money-practical-guide',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
