import type { Metadata } from 'next'
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google'
import DrapeApp from '@/components/drape/DrapeApp'

// Celoris Drape — Instagram-style store for women's western wear.
// Ported from the "Atelier Nova" prototype into the main app. Browsing is
// public (shoppers arrive from Instagram); sign-in is only needed at checkout.

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-drape-serif',
  display: 'swap',
})
const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-drape-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Celoris Drape | Women's Western Wear, Shop From Our Reels",
  description:
    "Shop women's western wear from Celoris Drape: dresses, tops, co-ords and more, styled in our Instagram reels. Ships across India from Gurgaon.",
  alternates: { canonical: '/shop' },
  openGraph: {
    title: "Celoris Drape | Women's Western Wear",
    description: 'Dresses, tops and co-ords you can shop straight from our reels. Ships across India.',
    url: '/shop',
    type: 'website',
  },
}

export default function ShopPage() {
  return (
    <div className={`${serif.variable} ${sans.variable}`}>
      <DrapeApp />
    </div>
  )
}
