import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Best Free Online Video Editor India 2026 (No Watermark)",
  description: "Looking for a free online video editor in India with no watermark and no download? Compare the best options for students, creators and small businesses in 2026.",
  alternates: { canonical: '/blog/best-free-online-video-editor-india-2026' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/best-free-online-video-editor-india-2026',
    title: "Best Free Online Video Editor India 2026 (No Watermark)",
    description: "Looking for a free online video editor in India with no watermark and no download? Compare the best options for students, creators and small businesses in 2026.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Best Free Online Video Editor India 2026 (No Watermark)", description: "Looking for a free online video editor in India with no watermark and no download? Compare the best options for students, creators and small businesses in 2026." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
