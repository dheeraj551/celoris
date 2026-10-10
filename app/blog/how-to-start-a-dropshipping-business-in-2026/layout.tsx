import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "How to Start a Dropshipping Business in India (2026)",
  description: "A step-by-step guide to starting a dropshipping business in 2026: choosing products, suppliers, store setup, payments and marketing on a small budget.",
  alternates: { canonical: '/blog/how-to-start-a-dropshipping-business-in-2026' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/how-to-start-a-dropshipping-business-in-2026',
    title: "How to Start a Dropshipping Business in India (2026)",
    description: "A step-by-step guide to starting a dropshipping business in 2026: choosing products, suppliers, store setup, payments and marketing on a small budget.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "How to Start a Dropshipping Business in India (2026)", description: "A step-by-step guide to starting a dropshipping business in 2026: choosing products, suppliers, store setup, payments and marketing on a small budget." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
