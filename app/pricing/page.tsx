import { type Metadata } from "next"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { PricingClientContent } from "./PricingClientContent"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Pricing & Plans — Student Tier, Pro & AI Creative Studio",
  description:
    "Explore Celoris plans in INR (₹). A free tier for students with starter credits, plus Basic, Pro, and Max packages with 20+ AI models including Nano Banana and Seedance.",
  keywords:
    "Celoris pricing, AI tools price India, free online courses India, student tier, Nano Banana Pro, Seedance video AI, creative studio pricing INR",
  openGraph: {
    title: "Pricing & Plans — Celoris AI Tools, Courses & Studio",
    description:
      "Explore Celoris plans in INR (₹). A free tier for students with starter credits, plus Basic, Pro, and Max packages with 20+ AI models including Nano Banana and Seedance.",
  }
}

export default function PricingPage() {
  return (
    <DashboardShell showVideoBackground>
      <PricingClientContent />
    </DashboardShell>
  )
}
