import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/arjuna-ssc-jee-bridge',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
