import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Best Free Video Editing and AI Tools for Indian Creators",
  description: "A practical list of the best free video editors and AI tools for Indian creators, students and small business owners, with what each one is good for.",
  alternates: { canonical: '/blog/best-free-video-editor-india' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/best-free-video-editor-india',
    title: "Best Free Video Editing and AI Tools for Indian Creators",
    description: "A practical list of the best free video editors and AI tools for Indian creators, students and small business owners, with what each one is good for.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Best Free Video Editing and AI Tools for Indian Creators", description: "A practical list of the best free video editors and AI tools for Indian creators, students and small business owners, with what each one is good for." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
