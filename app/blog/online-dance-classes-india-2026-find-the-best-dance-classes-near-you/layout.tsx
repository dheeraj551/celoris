import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Online Dance Classes India 2026: Find the Best Classes",
  description: "Can't find good dance classes near you? How to choose the best online dance classes in India in 2026, by style, level, fees and trainer.",
  alternates: { canonical: '/blog/online-dance-classes-india-2026-find-the-best-dance-classes-near-you' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/online-dance-classes-india-2026-find-the-best-dance-classes-near-you',
    title: "Online Dance Classes India 2026: Find the Best Classes",
    description: "Can't find good dance classes near you? How to choose the best online dance classes in India in 2026, by style, level, fees and trainer.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Online Dance Classes India 2026: Find the Best Classes", description: "Can't find good dance classes near you? How to choose the best online dance classes in India in 2026, by style, level, fees and trainer." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
