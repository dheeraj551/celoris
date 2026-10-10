import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Bollywood & Zumba Dance for Beginners: Learn Online",
  description: "Learn Bollywood and Zumba dance from scratch, online and at your own pace. What the beginner course covers, who it is for and how to start.",
  alternates: { canonical: '/blog/bollywood-zumba-dance-course-for-beginners-dheeraj-kushwaha' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/bollywood-zumba-dance-course-for-beginners-dheeraj-kushwaha',
    title: "Bollywood & Zumba Dance for Beginners: Learn Online",
    description: "Learn Bollywood and Zumba dance from scratch, online and at your own pace. What the beginner course covers, who it is for and how to start.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Bollywood & Zumba Dance for Beginners: Learn Online", description: "Learn Bollywood and Zumba dance from scratch, online and at your own pace. What the beginner course covers, who it is for and how to start." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
