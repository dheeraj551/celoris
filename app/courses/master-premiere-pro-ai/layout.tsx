import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/master-premiere-pro-ai',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
