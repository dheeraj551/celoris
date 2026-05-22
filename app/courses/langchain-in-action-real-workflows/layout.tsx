import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/langchain-in-action-real-workflows',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
