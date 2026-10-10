import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Multimodal and Agentic AI in Enterprise Workflows",
  description: "How multimodal and agentic AI move beyond chatbots: what they are, how businesses use them in real workflows, and what it means for your career.",
  alternates: { canonical: '/blog/multimodal-agentic-ai' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/multimodal-agentic-ai',
    title: "Multimodal and Agentic AI in Enterprise Workflows",
    description: "How multimodal and agentic AI move beyond chatbots: what they are, how businesses use them in real workflows, and what it means for your career.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Multimodal and Agentic AI in Enterprise Workflows", description: "How multimodal and agentic AI move beyond chatbots: what they are, how businesses use them in real workflows, and what it means for your career." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
