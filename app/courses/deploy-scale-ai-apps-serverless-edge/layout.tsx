import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/deploy-scale-ai-apps-serverless-edge',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
