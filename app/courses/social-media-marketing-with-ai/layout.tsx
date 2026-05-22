import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/social-media-marketing-with-ai',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
