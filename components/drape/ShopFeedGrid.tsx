'use client'

import { useEffect, useMemo, useState } from 'react'
import { Heart, MessageCircle, ShoppingBag } from 'lucide-react'
import { CATEGORIES, formatInr, whatsappLink, type DrapeProduct } from '@/lib/drape-shared'

interface ShopFeedGridProps {
  products: DrapeProduct[]
  activeCategory: string
  setActiveCategory: (c: string) => void
  onSelectProduct: (product: DrapeProduct) => void
  onQuickAdd: (product: DrapeProduct) => void
}

const SAVED_KEY = 'celoris-drape-saved-v1'

export function ShopFeedGrid({ products, activeCategory, setActiveCategory, onSelectProduct, onQuickAdd }: ShopFeedGridProps) {
  // Saved looks are a per-browser convenience (like Instagram's bookmark).
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  useEffect(() => {
    try {
      setSaved(JSON.parse(localStorage.getItem(SAVED_KEY) || '{}') || {})
    } catch {}
  }, [])
  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setSaved((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      if (!next[id]) delete next[id]
      try {
        localStorage.setItem(SAVED_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const tabs = useMemo(() => {
    const present = new Set(products.map((p) => p.category))
    const list: { id: string; label: string }[] = [{ id: 'all', label: 'All pieces' }]
    if (products.length) list.push({ id: 'new', label: 'New in' })
    for (const c of CATEGORIES) if (present.has(c.id)) list.push({ id: c.id, label: c.label })
    if (Object.keys(saved).length) list.push({ id: 'saved', label: 'Saved' })
    return list
  }, [products, saved])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return products
    if (activeCategory === 'saved') return products.filter((p) => saved[p.id])
    if (activeCategory === 'new') {
      return [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 12)
    }
    return products.filter((p) => p.category === activeCategory)
  }, [products, activeCategory, saved])

  if (!products.length) {
    return (
      <section className="py-20 px-4 text-center">
        <div className="max-w-md mx-auto space-y-3">
          <h2 className="font-serif text-2xl text-[#181716]">New collection dropping soon</h2>
          <p className="text-sm text-[#6B655B]">
            We&apos;re styling our first pieces. Follow us on Instagram to see them first.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto no-scrollbar pb-2">
          <div className="inline-flex items-center gap-1.5 p-1 bg-[#EFECE6] rounded-lg">
            {tabs.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium tracking-wide rounded-md transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-[#FAF9F6] text-[#181716] shadow-sm font-semibold'
                    : 'text-[#6B655B] hover:text-[#181716]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-sm text-[#6B655B] py-12">Nothing here yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {filtered.map((product) => {
              const isSaved = !!saved[product.id]
              const onSale = product.compareAtInr != null && product.compareAtInr > product.priceInr
              return (
                <article
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className="group cursor-pointer flex flex-col justify-between bg-white rounded-xl border border-[#EAE6DF] overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F3EF]">
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                          product.inStock ? '' : 'opacity-60 grayscale'
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-[#8E877E]">Celoris Drape</div>
                    )}

                    <div className="absolute top-2.5 right-2.5 z-10">
                      <button
                        onClick={(e) => toggleSave(e, product.id)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${
                          isSaved ? 'bg-rose-50 text-rose-600' : 'bg-black/30 text-white hover:bg-black/50'
                        }`}
                        aria-label={isSaved ? 'Remove from saved' : 'Save this look'}
                      >
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600' : 'stroke-[2]'}`} />
                      </button>
                    </div>

                    {!product.inStock ? (
                      <span className="absolute top-2.5 left-2.5 text-[10px] uppercase tracking-wider font-semibold bg-white/90 text-[#181716] px-2 py-0.5 rounded">
                        Sold out
                      </span>
                    ) : onSale ? (
                      <span className="absolute top-2.5 left-2.5 text-[10px] uppercase tracking-wider font-semibold bg-[#2C7A4F] text-white px-2 py-0.5 rounded">
                        Sale
                      </span>
                    ) : product.tags[0] ? (
                      <span className="absolute top-2.5 left-2.5 text-[10px] uppercase tracking-wider font-semibold bg-[#181716] text-[#FAF9F6] px-2 py-0.5 rounded">
                        {product.tags[0]}
                      </span>
                    ) : null}

                    {product.inStock && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-between gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onQuickAdd(product)
                          }}
                          className="flex-1 py-2 px-3 bg-[#FAF9F6] text-[#181716] text-xs font-semibold tracking-wider uppercase rounded hover:bg-white flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{product.sizes.length > 1 || product.colors.length > 1 ? 'Choose size' : 'Add to bag'}</span>
                        </button>
                        <a
                          href={whatsappLink(`Hi! I'd like to know more about "${product.title}" (${formatInr(product.priceInr)}).`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
                          title="Ask about this piece on WhatsApp"
                          aria-label="Ask about this piece on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#8E877E] uppercase tracking-wider mb-1">
                        <span>{product.categoryLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span className={product.inStock ? '' : 'text-rose-700'}>{product.inStock ? 'In stock' : 'Sold out'}</span>
                      </div>
                      <h3 className="font-serif text-base sm:text-lg text-[#181716] font-medium leading-snug line-clamp-1 group-hover:text-[#2C7A4F] transition-colors">
                        {product.title}
                      </h3>
                    </div>
                    <div className="pt-2 sm:pt-3 flex items-center justify-between border-t border-[#F0ECE4] mt-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm sm:text-base font-semibold text-[#181716] tabular-nums">
                          {formatInr(product.priceInr)}
                        </span>
                        {onSale && (
                          <span className="text-xs text-[#8E877E] line-through tabular-nums">
                            {formatInr(product.compareAtInr!)}
                          </span>
                        )}
                      </div>
                      {product.sizes.length > 0 && (
                        <span className="text-[11px] text-[#8E877E] hidden sm:inline">
                          {product.sizes.length} {product.sizes.length === 1 ? 'size' : 'sizes'}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
