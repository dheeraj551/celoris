import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/python-mega-course',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
