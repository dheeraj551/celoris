import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/mastering-multimodal-ai',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
