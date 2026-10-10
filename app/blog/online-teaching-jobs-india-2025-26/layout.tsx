import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Online Teaching Jobs in India: Earn From Home Teaching",
  description: "How to get online teaching jobs in India and earn from home teaching what you know: subjects in demand, platforms, pricing and finding your first students.",
  alternates: { canonical: '/blog/online-teaching-jobs-india-2025-26' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/online-teaching-jobs-india-2025-26',
    title: "Online Teaching Jobs in India: Earn From Home Teaching",
    description: "How to get online teaching jobs in India and earn from home teaching what you know: subjects in demand, platforms, pricing and finding your first students.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Online Teaching Jobs in India: Earn From Home Teaching", description: "How to get online teaching jobs in India and earn from home teaching what you know: subjects in demand, platforms, pricing and finding your first students." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
