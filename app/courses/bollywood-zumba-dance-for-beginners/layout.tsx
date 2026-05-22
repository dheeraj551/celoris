import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/bollywood-zumba-dance-for-beginners',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
