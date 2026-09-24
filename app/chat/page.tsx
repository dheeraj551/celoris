import type { Metadata } from 'next'
import ChatPageClient from './ChatPageClient'

// Celoris Chat is members-only (private messages), so keep it out of search.
export const metadata: Metadata = {
  title: 'Celoris Chat',
  description: 'Private chat with your friends on Celoris.',
  robots: { index: false, follow: false },
}

export default function ChatPage() {
  return <ChatPageClient />
}
