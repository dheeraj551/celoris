import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Learn Guitar Online India 2026: Beginner's Guide",
  description: "Everything a beginner needs to learn guitar online in India in 2026: choosing a guitar, first chords, a practice routine and finding the right teacher.",
  alternates: { canonical: '/blog/learn-guitar-online-india-2026-beginners-guide' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/learn-guitar-online-india-2026-beginners-guide',
    title: "Learn Guitar Online India 2026: Beginner's Guide",
    description: "Everything a beginner needs to learn guitar online in India in 2026: choosing a guitar, first chords, a practice routine and finding the right teacher.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Learn Guitar Online India 2026: Beginner's Guide", description: "Everything a beginner needs to learn guitar online in India in 2026: choosing a guitar, first chords, a practice routine and finding the right teacher." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
