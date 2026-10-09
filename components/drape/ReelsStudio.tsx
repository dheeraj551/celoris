'use client'

import { useEffect, useMemo } from 'react'
import { ExternalLink, Film, Instagram, ShoppingBag } from 'lucide-react'
import { STORE, formatInr, type DrapeProduct, type DrapeReel } from '@/lib/drape-shared'
import { InstagramEmbed } from './InstagramEmbed'

interface ReelsStudioProps {
  reels: DrapeReel[]
  products: DrapeProduct[]
  activeReelId: string | null
  setActiveReelId: (id: string) => void
  onOpenProduct: (product: DrapeProduct) => void
  onQuickAdd: (product: DrapeProduct) => void
}

// Shoppable reels: the real Instagram reel plays on the left (Instagram's own
// embed), and every piece tagged in it is shoppable on the right.
export function ReelsStudio({ reels, products, activeReelId, setActiveReelId, onOpenProduct, onQuickAdd }: ReelsStudioProps) {
  const current = reels.find((r) => r.id === activeReelId) || reels[0] || null

  useEffect(() => {
    if (current && current.id !== activeReelId) setActiveReelId(current.id)
  }, [current, activeReelId, setActiveReelId])

  const tagged = useMemo(() => {
    if (!current) return []
    const byId = new Map(products.map((p) => [p.id, p]))
    return current.taggedProductIds.map((id) => byId.get(id)).filter((p): p is DrapeProduct => Boolean(p))
  }, [current, products])

  if (!current) {
    return (
      <section className="py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <Film className="w-10 h-10 mx-auto text-[#2C7A4F]" />
          <h2 className="font-serif text-2xl text-[#181716]">Reels are on their way</h2>
          <p className="text-sm text-[#6B655B]">Meanwhile, catch our latest styling videos on Instagram.</p>
          <a
            href={STORE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#181716] text-white rounded-lg"
          >
            <Instagram className="w-4 h-4" /> @{STORE.handle}
          </a>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2C7A4F] mb-1">
          <span>Watch &amp; shop</span>
          <span aria-hidden="true">·</span>
          <span>From @{STORE.handle}</span>
        </div>
        <h2 className="font-serif text-xl sm:text-2xl text-[#181716] font-medium">Shoppable reels</h2>
        <p className="text-xs sm:text-sm text-[#6B655B] max-w-xl mt-0.5">
          Every piece you see in a reel is listed next to it, ready to add to your bag.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col items-center gap-3">
          <div className="w-full max-w-[400px] rounded-2xl overflow-hidden shadow-2xl border border-[#EAE6DF] bg-white">
            <InstagramEmbed url={current.instagramUrl} title={current.title} className="h-[640px] sm:h-[700px]" />
          </div>
          <a
            href={current.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#6B655B] hover:text-[#181716]"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open on Instagram
          </a>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 bg-white rounded-2xl border border-[#EAE6DF] shadow-sm space-y-4">
            <div className="border-b border-[#EAE6DF] pb-3">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#2C7A4F]">Shop this reel</span>
              {current.title && <h3 className="font-serif text-lg font-medium text-[#181716]">{current.title}</h3>}
              {current.caption && <p className="text-xs text-[#6B655B] mt-1 whitespace-pre-line">{current.caption}</p>}
            </div>

            {tagged.length === 0 ? (
              <p className="text-xs text-[#8E877E]">No pieces tagged in this reel yet.</p>
            ) : (
              <div className="space-y-3">
                {tagged.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl border border-[#EAE6DF] hover:border-[#181716] transition-all flex items-center justify-between gap-3 group"
                  >
                    <button className="flex items-center gap-3 flex-1 min-w-0 text-left" onClick={() => onOpenProduct(product)}>
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={product.images[0]} alt={product.title} className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-[#F5F3EF] shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#181716] truncate group-hover:text-[#2C7A4F]">{product.title}</p>
                        <p className="text-xs text-[#6B655B]">{product.categoryLabel}</p>
                        <p className="text-xs font-medium text-[#181716] tabular-nums mt-0.5">{formatInr(product.priceInr)}</p>
                      </div>
                    </button>
                    <button
                      onClick={() => onQuickAdd(product)}
                      disabled={!product.inStock}
                      className="px-3 py-1.5 text-xs font-medium text-[#181716] bg-[#EFECE6] hover:bg-[#181716] hover:text-white rounded-lg transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50 disabled:hover:bg-[#EFECE6] disabled:hover:text-[#181716]"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{product.inStock ? 'Add' : 'Sold out'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {reels.length > 1 && (
            <div className="p-5 bg-white rounded-2xl border border-[#EAE6DF] shadow-sm space-y-3">
              <h4 className="text-xs uppercase font-semibold tracking-wider text-[#8E877E]">More reels ({reels.length})</h4>
              <div className="grid grid-cols-2 gap-3">
                {reels.map((reel, idx) => (
                  <button
                    key={reel.id}
                    onClick={() => setActiveReelId(reel.id)}
                    className={`text-left p-2.5 rounded-xl border transition-all ${
                      current.id === reel.id ? 'border-[#181716] bg-[#FAF9F6] shadow-sm' : 'border-[#EAE6DF] hover:border-[#BDB5A7]'
                    }`}
                  >
                    <p className="text-xs font-semibold text-[#181716] line-clamp-1">{reel.title || `Reel ${idx + 1}`}</p>
                    <p className="text-[10px] text-[#8E877E] mt-1">
                      {reel.taggedProductIds.length} {reel.taggedProductIds.length === 1 ? 'piece' : 'pieces'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
