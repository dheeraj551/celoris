import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { PricingClientContent } from "./PricingClientContent"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Pricing & Plans — 100% Free Classes, Job Portal & AI Studio",
  description:
    "Explore Celoris plans in INR (₹). Free tier with starter credits, Basic, Pro, and Max packages with 20+ AI models including Nano Banana and Seedance. 100% free classes & job portal included in all plans.",
  keywords:
    "Celoris pricing, AI tools price India, free online courses India, free job portal, Nano Banana Pro, Seedance video AI, creative studio pricing INR",
  openGraph: {
    title: "Pricing & Plans — Celoris AI Tools, Free Classes & Job Portal",
    description:
      "Explore Celoris plans in INR (₹). Free tier with starter credits, Basic, Pro, and Max packages with 20+ AI models including Nano Banana and Seedance. 100% free classes & job portal included in all plans.",
  }
}

export default function PricingPage() {
  return (
    <DashboardShell showVideoBackground>
      <PricingClientContent />
    </DashboardShell>
  )
}
