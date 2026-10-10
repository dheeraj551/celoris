import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Top 10 Free AI Video Editing Tools in India (2026)",
  description: "The 10 best free AI video editing tools for Indian creators in 2026: what each does, its limits and which to pick to edit like a pro without spending.",
  alternates: { canonical: '/blog/top-10-free-ai-video-editing-tools-india-2026' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/top-10-free-ai-video-editing-tools-india-2026',
    title: "Top 10 Free AI Video Editing Tools in India (2026)",
    description: "The 10 best free AI video editing tools for Indian creators in 2026: what each does, its limits and which to pick to edit like a pro without spending.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Top 10 Free AI Video Editing Tools in India (2026)", description: "The 10 best free AI video editing tools for Indian creators in 2026: what each does, its limits and which to pick to edit like a pro without spending." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
