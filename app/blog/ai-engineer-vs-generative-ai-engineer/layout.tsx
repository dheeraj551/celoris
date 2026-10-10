import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "AI Engineer vs Generative AI Engineer: The Real Difference",
  description: "AI Engineer vs Generative AI Engineer: what each role does, the tools they use, salaries and skills, and which career path suits you in India.",
  alternates: { canonical: '/blog/ai-engineer-vs-generative-ai-engineer' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/ai-engineer-vs-generative-ai-engineer',
    title: "AI Engineer vs Generative AI Engineer: The Real Difference",
    description: "AI Engineer vs Generative AI Engineer: what each role does, the tools they use, salaries and skills, and which career path suits you in India.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "AI Engineer vs Generative AI Engineer: The Real Difference", description: "AI Engineer vs Generative AI Engineer: what each role does, the tools they use, salaries and skills, and which career path suits you in India." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
