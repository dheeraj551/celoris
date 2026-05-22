import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/building-model-native-agent-systems',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
