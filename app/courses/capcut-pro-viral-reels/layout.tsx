import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CapCut Pro Desktop & Mobile 1-on-1 Practical Training (14 Days)",
  description:
    "1-on-1 practical CapCut Desktop (Laptop/PC) and Mobile video editing training by Celoris in Delhi NCR & Online across India. 14-day online course: ₹10,500 (₹750/hr), 2 installments of ₹5,950 (₹850/hr), daily ₹1,000/hr, or Delhi NCR home tuition ₹1,500–₹2,000/hr.",
  alternates: {
    canonical: "/courses/capcut-pro-viral-reels",
  },
  openGraph: {
    title: "CapCut Pro Desktop & Mobile 1-on-1 Training (14 Days) | Celoris",
    description:
      "Master CapCut Desktop on Laptop/PC & Mobile in 14 days with live 1-on-1 practical training. Online from ₹750/hr (₹10,500 total) or Delhi NCR home tuition.",
    url: "https://celorisdesigns.com/courses/capcut-pro-viral-reels",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
