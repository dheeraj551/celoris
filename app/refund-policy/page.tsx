import { type Metadata } from "next"
import { RefundPolicyContent } from "./RefundPolicyContent"

export const metadata: Metadata = {
  title: "Refund and Cancellation Policy — Celoris Designs LLP",
  description:
    "Official Refund and Cancellation Policy for Celoris Designs LLP. Learn about our 7-day cooling-off period, AI credit subscriptions, academy course enrollments, UPI reversals, and cancellation procedures.",
  keywords: [
    "Celoris refund policy",
    "cancellation policy Celoris",
    "AI credits refund India",
    "Celoris Designs LLP refund",
    "course cancellation policy",
    "UPI refund timeline India",
  ],
  openGraph: {
    title: "Refund and Cancellation Policy — Celoris Designs LLP",
    description:
      "Official Refund and Cancellation Policy for Celoris AI Studio subscriptions, credits, and Academy courses.",
    url: "https://www.celorisdesigns.com/refund-policy",
    siteName: "Celoris",
  },
}

export default function RefundPolicyPage() {
  return <RefundPolicyContent />
}
