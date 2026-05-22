import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/digital-marketing-using-ai-tools',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
