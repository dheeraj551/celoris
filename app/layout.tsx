import { type Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PresenceProvider } from "@/components/providers/PresenceProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Celoris Unified Platform - Learn, Earn, Fun & Apps",
  description: "Transform your digital future with Celoris. Comprehensive platform for learning, earning opportunities, games, and productivity tools.",
  keywords: ["education", "jobs", "gaming", "productivity", "digital transformation"],
  authors: [{ name: "Celoris Designs LLP" }],
  creator: "Celoris Designs LLP",
  publisher: "Celoris Designs LLP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://celoris.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://celoris.com",
    title: "Celoris Unified Platform - Learn, Earn, Fun & Apps",
    description: "Transform your digital future with Celoris. Comprehensive platform for learning, earning opportunities, games, and productivity tools.",
    siteName: "Celoris Platform",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Celoris Unified Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Celoris Unified Platform - Learn, Earn, Fun & Apps",
    description: "Transform your digital future with Celoris. Comprehensive platform for learning, earning opportunities, games, and productivity tools.",
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
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2389622666573829"
          crossOrigin="anonymous"></script>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <PresenceProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </PresenceProvider>
        <Toaster />
      </body>
    </html>
  )
}