import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Top 5 Video Editing Trends in 2026 + Premiere Pro Tips",
  description: "The 5 video editing trends shaping 2026, from AI workflows to vertical-first storytelling, plus practical Premiere Pro tips to stay ahead.",
  alternates: { canonical: '/blog/video-editing-trends-2026-premiere-pro-tips' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/video-editing-trends-2026-premiere-pro-tips',
    title: "Top 5 Video Editing Trends in 2026 + Premiere Pro Tips",
    description: "The 5 video editing trends shaping 2026, from AI workflows to vertical-first storytelling, plus practical Premiere Pro tips to stay ahead.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Top 5 Video Editing Trends in 2026 + Premiere Pro Tips", description: "The 5 video editing trends shaping 2026, from AI workflows to vertical-first storytelling, plus practical Premiere Pro tips to stay ahead." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
