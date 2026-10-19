"use client"

import { usePathname } from "next/navigation"
import { Capacitor } from '@capacitor/core'
import { useEffect, useState } from "react"
import { TopHeader } from "@/components/home-new/TopHeader"

export default function Header() {
  const pathname = usePathname()
  const [isNative, setIsNative] = useState(false)

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setIsNative(true)
    }
  }, [])

  const isDashboardPage = pathname === "/" ||
    pathname?.startsWith("/become-trainer") ||
    pathname?.startsWith("/free-courses-with-certificate") ||
    pathname?.startsWith("/learn") ||
    pathname?.startsWith("/earn") ||
    pathname?.startsWith("/social") ||
    pathname?.startsWith("/classrooms") ||
    pathname === "/chat" ||
    pathname?.startsWith("/ai-explorer") ||
    pathname?.startsWith("/ai-tools") ||
    pathname?.startsWith("/video-studio") ||
    pathname?.startsWith("/image-studio") ||
    pathname?.startsWith("/courses") ||
    pathname?.startsWith("/teach") ||
    pathname?.startsWith("/marketing") ||
    pathname?.startsWith("/vio-studio") ||
    pathname?.startsWith("/vibe-marketer") ||
    pathname?.startsWith("/marketing-studio") ||
    pathname?.startsWith("/celo-ai") ||
    pathname?.startsWith("/job-center") ||
    pathname?.startsWith("/cloud") ||
    pathname?.startsWith("/fivem-servers") ||
    pathname?.startsWith("/photolite") ||
    pathname?.startsWith("/polyvault") ||
    pathname?.startsWith("/shop") ||
    pathname?.startsWith("/pricing") ||
    pathname?.startsWith("/free-video-editor") ||
    pathname?.startsWith("/celoris-3d") ||
    pathname?.startsWith("/inbox") ||
    pathname?.startsWith("/interviews") ||
    pathname === "/login" ||
    pathname === "/register";

  if (isNative || isDashboardPage) return null

  return <TopHeader />
}
