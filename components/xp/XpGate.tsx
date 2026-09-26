"use client"

import dynamic from "next/dynamic"

// Loads the XP layer after the page is interactive, so it never slows down
// the first paint or affects SEO.
const XpLayer = dynamic(() => import("./XpLayer").then((m) => m.XpLayer), { ssr: false, loading: () => null })

export function XpGate() {
  return <XpLayer />
}

export default XpGate
