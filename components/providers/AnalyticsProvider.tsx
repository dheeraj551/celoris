"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { initClarity } from "@/lib/clarity"
import { SignupConversionTracker, GOOGLE_ADS_ID } from "./SignupConversionTracker"

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}

const GA_MEASUREMENT_ID = "G-7NFKQBTPHZ"

function GoogleAnalyticsRouteTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      const query = searchParams?.toString() ? `?${searchParams.toString()}` : ""
      const fullPath = pathname + query
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: fullPath,
        page_location: window.location.href,
        page_title: document.title,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function AnalyticsProvider() {
  useEffect(() => {
    // Initialize Microsoft Clarity if NEXT_PUBLIC_CLARITY_PROJECT_ID is set
    initClarity()
  }, [])

  return (
    <>
      {/* Vercel Web Analytics */}
      <Analytics />

      {/* Google Analytics 4 + Google Ads (one gtag.js, two config lines) */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
            gtag('config', '${GOOGLE_ADS_ID}');
          `,
        }}
      />

      {/* Next.js client-side route change listener for GA4 */}
      <Suspense fallback={null}>
        <GoogleAnalyticsRouteTracker />
      </Suspense>

      {/* One "sign_up" event + Google Ads conversion per new account */}
      <SignupConversionTracker />
    </>
  )
}
