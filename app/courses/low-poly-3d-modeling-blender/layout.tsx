import { Metadata } from 'next';

export const metadata: Metadata = {
    alternates: {
        canonical: '/courses/low-poly-3d-modeling-blender',
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
