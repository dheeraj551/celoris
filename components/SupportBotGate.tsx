"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Lazy-load the Phone OS with zero SSR overhead so initial page load, Core Web Vitals,
// and Google ranking remain completely untouched.
const CelorisPhoneOS = dynamic(
  () => import("@/components/phone-os/CelorisPhoneOS").then((mod) => mod.CelorisPhoneOS),
  { ssr: false, loading: () => null }
);

// The phone companion is for visitors browsing the public site — homepage,
// courses, pricing, etc. Hide it on studio workspaces, admin panels, and dedicated interactive pages (teach & job-center) which have their own mobile app showcase.
const HIDDEN_PREFIXES = ["/dashboard", "/celo-ai", "/admin", "/video-studio", "/image-studio", "/chat", "/shop", "/teach", "/job-center"];

export function SupportBotGate() {
  const pathname = usePathname();
  if (!pathname) return null;

  const hidden = HIDDEN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  if (hidden) return null;

  return <CelorisPhoneOS />;
}
