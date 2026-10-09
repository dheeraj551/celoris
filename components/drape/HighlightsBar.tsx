'use client'

import { useMemo } from 'react'
import { Sparkles } from 'lucide-react'
import { CATEGORIES, type DrapeProduct } from '@/lib/drape-shared'

interface HighlightsBarProps {
  products: DrapeProduct[]
  activeCategory: string
  onSelect: (category: string) => void
}

// Instagram-style highlight circles. Built from the live catalog: "New in"
// plus one circle per category that actually has products, using that
// category's newest photo. Tapping filters the shop grid.
export function HighlightsBar({ products, activeCategory, onSelect }: HighlightsBarProps) {
  const items = useMemo(() => {
    const out: { id: string; label: string; image: string }[] = []
    if (products.length) {
      const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
      out.push({ id: 'new', label: 'New in', image: newest?.images[0] || '' })
    }
    for (const c of CATEGORIES) {
      const inCat = products.filter((p) => p.category === c.id)
      if (inCat.length) out.push({ id: c.id, label: c.label, image: inCat.find((p) => p.images[0])?.images[0] || '' })
    }
    return out
  }, [products])

  if (!items.length) return null

  return (
    <div className="py-6 border-b border-[#EAE6DF] overflow-x-auto no-scrollbar">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-5 sm:gap-8 min-w-max">
        {items.map((item) => {
          const active = activeCategory === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelect(active ? 'all' : item.id)}
              className="flex flex-col items-center gap-2 group focus:outline-none"
            >
              <div
                className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full p-[2px] transition-transform group-hover:scale-105 ${
                  active ? 'bg-[#181716]' : 'drape-ring'
                }`}
              >
                <div className="w-full h-full rounded-full p-[2px] bg-[#FAF9F6]">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.label} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#EFECE6] flex items-center justify-center text-[#2C7A4F]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
              <span
                className={`text-[11px] sm:text-xs tracking-tight whitespace-nowrap ${
                  active ? 'font-semibold text-[#181716]' : 'font-medium text-[#524C44] group-hover:text-[#181716]'
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
