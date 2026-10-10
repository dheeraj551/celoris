import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Online Teaching Jobs in Delhi 2026: How to Start",
  description: "How to start online teaching jobs in Delhi NCR in 2026: which skills sell (dance, Excel, content creation), how to find students and how much you can earn.",
  alternates: { canonical: '/blog/online-teaching-jobs-delhi-2026' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/online-teaching-jobs-delhi-2026',
    title: "Online Teaching Jobs in Delhi 2026: How to Start",
    description: "How to start online teaching jobs in Delhi NCR in 2026: which skills sell (dance, Excel, content creation), how to find students and how much you can earn.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Online Teaching Jobs in Delhi 2026: How to Start", description: "How to start online teaching jobs in Delhi NCR in 2026: which skills sell (dance, Excel, content creation), how to find students and how much you can earn." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
