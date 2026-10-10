import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Kya AI Replace Kar Dega Digital Marketers Ko?",
  description: "Kya ChatGPT aur AI tools digital marketers ki job le lenge? Is blog mein samjhiye kaun se kaam AI karega, kaun se nahi, aur aapko kya seekhna chahiye.",
  alternates: { canonical: '/blog/kya-ai-replace-kar-dega-digital-marketers-ko' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/kya-ai-replace-kar-dega-digital-marketers-ko',
    title: "Kya AI Replace Kar Dega Digital Marketers Ko?",
    description: "Kya ChatGPT aur AI tools digital marketers ki job le lenge? Is blog mein samjhiye kaun se kaam AI karega, kaun se nahi, aur aapko kya seekhna chahiye.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Kya AI Replace Kar Dega Digital Marketers Ko?", description: "Kya ChatGPT aur AI tools digital marketers ki job le lenge? Is blog mein samjhiye kaun se kaam AI karega, kaun se nahi, aur aapko kya seekhna chahiye." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
