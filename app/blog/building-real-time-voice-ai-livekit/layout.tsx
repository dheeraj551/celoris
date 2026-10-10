import type { Metadata } from 'next'

// Server-side title, description and canonical for this blog post. The page itself
// is a client component, so without this file it inherited the homepage's title.
export const metadata: Metadata = {
  title: "Building Real-Time Voice AI with LiveKit: Complete Guide",
  description: "How to build production-grade voice agents with LiveKit Agents, Whisper and LLMs, from WebRTC basics to deployment.",
  alternates: { canonical: '/blog/building-real-time-voice-ai-livekit' },
  openGraph: {
    type: 'article',
    url: 'https://celorisdesigns.com/blog/building-real-time-voice-ai-livekit',
    title: "Building Real-Time Voice AI with LiveKit: Complete Guide",
    description: "How to build production-grade voice agents with LiveKit Agents, Whisper and LLMs, from WebRTC basics to deployment.",
    siteName: 'Celoris',
    locale: 'en_IN',
  },
  twitter: { card: 'summary_large_image', title: "Building Real-Time Voice AI with LiveKit: Complete Guide", description: "How to build production-grade voice agents with LiveKit Agents, Whisper and LLMs, from WebRTC basics to deployment." },
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
