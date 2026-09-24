"use client"

import dynamic from 'next/dynamic'
import { DashboardShell } from '@/components/home-new/DashboardShell'

const CelorisChatApp = dynamic(() => import('@/components/celoris-chat/CelorisChatApp'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[calc(100dvh-65px)] bg-[#070a10]">
      <div className="h-10 w-10 border-4 border-sky-500/15 border-t-sky-500 rounded-full animate-spin" />
    </div>
  ),
})

export default function ChatPageClient() {
  return (
    <DashboardShell>
      <CelorisChatApp />
    </DashboardShell>
  )
}
