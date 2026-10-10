import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "The English Sound System: 44 Sounds, 26 Letters",
  description: "English has 44 sounds but only 26 letters. Learn the English sound system step by step, starting with the vowels, to speak and pronounce clearly.",
  alternates: { canonical: '/blog/the-english-sound-system' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/the-english-sound-system',
    title: "The English Sound System: 44 Sounds, 26 Letters",
    description: "English has 44 sounds but only 26 letters. Learn the English sound system step by step, starting with the vowels, to speak and pronounce clearly.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "The English Sound System: 44 Sounds, 26 Letters", description: "English has 44 sounds but only 26 letters. Learn the English sound system step by step, starting with the vowels, to speak and pronounce clearly." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
