import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "How to Use Canva for the First Time: Beginner's Guide",
  description: "New to Canva? Learn the basics step by step and make your first Instagram post, WhatsApp status or poster in minutes, even with no design experience.",
  alternates: { canonical: '/blog/how-to-use-canva-for-the-first-time-beginner-guide' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/how-to-use-canva-for-the-first-time-beginner-guide',
    title: "How to Use Canva for the First Time: Beginner's Guide",
    description: "New to Canva? Learn the basics step by step and make your first Instagram post, WhatsApp status or poster in minutes, even with no design experience.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "How to Use Canva for the First Time: Beginner's Guide", description: "New to Canva? Learn the basics step by step and make your first Instagram post, WhatsApp status or poster in minutes, even with no design experience." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
