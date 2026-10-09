'use client'

import { BadgeCheck, Film, Instagram, MapPin, MessageCircle, Truck } from 'lucide-react'
import { FREE_SHIPPING_MIN_INR, STORE, formatInr, whatsappLink } from '@/lib/drape-shared'

interface ProfileHeaderProps {
  productCount: number
  reelCount: number
  onWatchReels: () => void
}

// Instagram-style store header. Only real numbers are shown (pieces and
// reels from the live catalog) — no invented follower counts or ratings.
export function ProfileHeader({ productCount, reelCount, onWatchReels }: ProfileHeaderProps) {
  return (
    <section className="pt-6 sm:pt-10 pb-6 border-b border-[#EAE6DF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          <button onClick={onWatchReels} className="relative group shrink-0" aria-label="Watch our reels">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-[2.5px] drape-ring transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full p-[2px] bg-[#FAF9F6]">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1F6B45] to-[#2C7A4F] flex flex-col items-center justify-center text-white">
                  <span className="font-serif text-2xl sm:text-3xl leading-none">cd</span>
                  <span className="text-[7px] tracking-[0.3em] uppercase mt-1 opacity-80">Drape</span>
                </div>
              </div>
            </div>
            {reelCount > 0 && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#181716] text-[#FAF9F6] text-[9px] tracking-widest uppercase font-medium px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                Reels
              </div>
            )}
          </button>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 mb-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#181716]">
                {STORE.handle}
              </h1>
              <BadgeCheck className="w-5 h-5 fill-[#2C7A4F] text-[#FAF9F6]" aria-label="Official Celoris store" />
              <span className="text-[11px] uppercase tracking-wider text-[#8E877E] bg-[#EFECE6] px-2 py-0.5 rounded">
                Boutique
              </span>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-6 sm:gap-8 text-xs sm:text-sm text-[#181716] mb-4">
              <div>
                <span className="font-semibold tabular-nums">{productCount}</span>{' '}
                <span className="text-[#8E877E]">{productCount === 1 ? 'Piece' : 'Pieces'}</span>
              </div>
              <div>
                <span className="font-semibold tabular-nums">{reelCount}</span>{' '}
                <span className="text-[#8E877E]">{reelCount === 1 ? 'Reel' : 'Reels'}</span>
              </div>
              <div className="hidden sm:block text-[#8E877E]">By Celoris Designs LLP</div>
            </div>

            <div className="text-xs sm:text-sm text-[#524C44] leading-relaxed max-w-xl mb-5 space-y-1">
              <p className="font-serif italic text-base text-[#181716]">Women&apos;s western wear, shoppable from our reels</p>
              <p>Dresses, tops, co-ords and everyday staples, picked and styled by our team.</p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 pt-1 text-xs text-[#8E877E]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {STORE.location} · Ships across India
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[#2C7A4F] font-medium flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Free shipping over {formatInr(FREE_SHIPPING_MIN_INR)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <a
                href={whatsappLink('Hi Celoris Drape! I have a question about your collection.')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#181716] hover:bg-[#33302C] rounded transition-all shadow-sm"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Ask a stylist</span>
              </a>
              <a
                href={STORE.instagramDm}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#181716] bg-[#EFECE6] hover:bg-[#E2DDD3] rounded transition-all"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>DM on Instagram</span>
              </a>
              {reelCount > 0 && (
                <button
                  onClick={onWatchReels}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium uppercase tracking-wider text-[#6B655B] border border-[#D6D0C5] hover:border-[#181716] hover:text-[#181716] rounded transition-all"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Watch &amp; shop</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
