import { type Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { PresenceProvider } from "@/components/providers/PresenceProvider"
import { Toaster } from "@/components/ui/toaster"
import { ReCaptchaProvider } from "@/components/ReCaptchaProvider"
import { GlobalAd } from "@/components/GlobalAd"
import { MotionProvider } from "@/components/providers/MotionProvider"
import { AnalyticsProvider } from "@/components/providers/AnalyticsProvider"
import { SupportBotGate } from "@/components/SupportBotGate"

const inter = Inter({ subsets: ["latin"] })
const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Celoris — India's Creative Studio & Academy | AI Video, Photo & Courses",
    template: "%s | Celoris",
  },
  description: "India's creative studio and academy since 2019. AI video editor, Photoshop-style photo studio, certified professional courses, and a free tier for students.",
  keywords: [
    "Celoris",
    "Creative studio India",
    "AI video editor India",
    "photo editing online",
    "AI learning",
    "AI courses India",
    "digital marketing course",
    "video editing training",
    "graphic designing course",
    "web development course",
    "online classes India",
    "free tier for students",
    "Celoris Academy"
  ],
  authors: [{ name: "Dheeraj Kushwaha", url: "https://www.celorisdesigns.com/about" }],
  creator: "Celoris Designs LLP",
  publisher: "Celoris Designs LLP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.celorisdesigns.com"),
  // No site-wide canonical here: in Next.js a canonical in the root layout is
  // inherited by EVERY page that doesn't set its own, which told Google each
  // blog post / tool page was a duplicate of the homepage. Pages set their own.
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.celorisdesigns.com",
    siteName: "Celoris",
    title: "Celoris — India's Creative Studio & Academy",
    description: "India's creative studio and academy since 2019. AI video editor, Photoshop-style photo studio, certified professional courses, and a free tier for students.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Celoris - India's Creative Studio & Academy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Celoris — India's Creative Studio & Academy",
    description: "India's creative studio and academy since 2019. AI video editor, Photoshop-style photo studio, certified professional courses, and a free tier for students.",
    images: ["/og-image.jpg"],
    creator: "@celoris",
    site: "@celoris",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
    notranslate: true,
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
  other: {
    "google-adsense-account": "ca-pub-2157452506602914",
  },
  category: "Education",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.celorisdesigns.com/#organization",
  "name": "Celoris Designs",
  "legalName": "Celoris Designs LLP",
  "alternateName": "Celoris",
  "url": "https://www.celorisdesigns.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.celorisdesigns.com/celoris-logo.png",
    "width": "512",
    "height": "512"
  },
  "description": "Video editing. Image design. 20 AI models. Free classes. Daily freelance gigs. All in one place. All free to start. Built for India. 🇮🇳",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91 90847 18101",
    "contactType": "customer service",
    "email": "support@celorisdesigns.com",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/celoris",
    "https://www.facebook.com/celoris",
    "https://www.youtube.com/celoris",
    "https://x.com/celoris"
  ]
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.celorisdesigns.com/#website",
  "name": "Celoris",
  "url": "https://www.celorisdesigns.com",
  "description": "Video editing. Image design. 20 AI models. Free classes. Daily freelance gigs. All in one place. All free to start. Built for India. 🇮🇳",
  "publisher": { "@id": "https://www.celorisdesigns.com/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://www.celorisdesigns.com/learn/courses?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7NFKQBTPHZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-7NFKQBTPHZ');
          `}
        </Script>

        {/* Google AdSense via next/script afterInteractive */}
        <Script
          id="google-adsense"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2157452506602914"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={outfit.className}>
        {/* Global Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />

        <ReCaptchaProvider siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}>
          <AuthProvider>
            <PresenceProvider>
              <MotionProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">
                    {children}
                  </main>
                  <GlobalAd />

                  <Footer />
                </div>
              </MotionProvider>
            </PresenceProvider>
          </AuthProvider>
          <Toaster />
          <AnalyticsProvider />
          <SupportBotGate />
        </ReCaptchaProvider>
      </body>
    </html>
  )
}
