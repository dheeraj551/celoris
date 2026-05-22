import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/build-real-time-ai-agents-with-livekit',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
