import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "How to Go Viral on YouTube Shorts in 2026: Complete Guide",
  description: "What actually works on YouTube Shorts in 2026: hooks, length, posting rhythm and editing tips that get views, explained step by step.",
  alternates: { canonical: '/blog/how-to-go-viral-youtube-shorts-2026' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/how-to-go-viral-youtube-shorts-2026',
    title: "How to Go Viral on YouTube Shorts in 2026: Complete Guide",
    description: "What actually works on YouTube Shorts in 2026: hooks, length, posting rhythm and editing tips that get views, explained step by step.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "How to Go Viral on YouTube Shorts in 2026: Complete Guide", description: "What actually works on YouTube Shorts in 2026: hooks, length, posting rhythm and editing tips that get views, explained step by step." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
