import { type Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { PresenceProvider } from "@/components/providers/PresenceProvider"
import { Toaster } from "@/components/ui/toaster"
import { ReCaptchaProvider } from "@/components/ReCaptchaProvider"
import { GlobalAd } from "@/components/GlobalAd"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })
const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Celoris — Free Video Editor, AI Tools & Creative Studio for India",
  description: "Video editing. Image design. 20 AI models. Free classes. Daily freelance gigs. All in one place. Free to start. No credit card. celoris.in 🇮🇳",
  keywords: [
    "Celoris",
    "AI ecosystem",
    "digital transformation",
    "AI learning",
    "AI courses",
    "agentic AI",
    "RAG systems",
    "career growth",
    "productivity tools"
  ],
  authors: [{ name: "Celoris Designs LLP" }],
  creator: "Celoris Designs LLP",
  publisher: "Celoris Designs LLP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.celorisdesigns.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://www.celorisdesigns.com",
    title: "Celoris — Free Video Editor, AI Tools & Creative Studio for India",
    description: "Video editing. Image design. 20 AI models. Free classes. Daily freelance gigs. All in one place. Free to start. No credit card. celoris.in 🇮🇳",
    siteName: "Celoris",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Celoris AI-Powered Ecosystem",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Celoris — Free Video Editor, AI Tools & Creative Studio for India",
    description: "Video editing. Image design. 20 AI models. Free classes. Daily freelance gigs. All in one place. Free to start. No credit card. celoris.in 🇮🇳",
    images: ["/og-image.jpg"],
    creator: "@celoris",
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
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-7NFKQBTPHZ"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-7NFKQBTPHZ');
            `,
          }}
        />
        {/* Google AdSense - Managed via Dashboard and AdUnit component */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2389622666573829"
          crossOrigin="anonymous"></script>
        {/* Note: To stop scattered ads, disable "Auto ads" (Anchor, Vignette, Side rails) in your Google AdSense Dashboard */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Global Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
                "telephone": "+91 9643579101",
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
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            })
          }}
        />
      </head>
      <body className={outfit.className}>
        <ReCaptchaProvider siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}>
          <AuthProvider>
            <PresenceProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <GlobalAd />
                <Footer />
              </div>
            </PresenceProvider>
          </AuthProvider>
          <Toaster />
        </ReCaptchaProvider>
        <Analytics />
      </body>
    </html>
  )
}
