'use client'

import { useEffect, useState } from 'react'
import { Check, Film, MessageCircle, RotateCcw, ShoppingBag, Truck, X } from 'lucide-react'
import {
  FREE_SHIPPING_MIN_INR,
  STORE,
  creditsFor,
  formatInr,
  isSizeAvailable,
  stockForSize,
  whatsappLink,
  type DrapeProduct,
  type DrapeReel,
} from '@/lib/drape-shared'

interface ProductDetailModalProps {
  product: DrapeProduct
  onClose: () => void
  onAddToCart: (product: DrapeProduct, size: string, color: string, quantity: number) => void
  onOpenBag: () => void
  reel: DrapeReel | null
  onWatchReel: (reelId: string) => void
}

export function ProductDetailModal({ product, onClose, onAddToCart, onOpenBag, reel, onWatchReel }: ProductDetailModalProps) {
  const firstAvailableSize = product.sizes.find((s) => isSizeAvailable(product, s)) || ''
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes.length === 1 ? firstAvailableSize : '')
  const [selectedColor, setSelectedColor] = useState<string>(product.colors.length === 1 ? product.colors[0] : '')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(product.images[0] || '')
  const [added, setAdded] = useState(false)
  const [hint, setHint] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const onSale = product.compareAtInr != null && product.compareAtInr > product.priceInr
  const sizeStock = selectedSize ? stockForSize(product, selectedSize) : null
  const maxQty = Math.min(10, sizeStock ?? 10)

  const handleAdd = () => {
    if (product.sizes.length && !selectedSize) return setHint('Please choose a size')
    if (product.colors.length && !selectedColor) return setHint('Please choose a colour')
    setHint('')
    onAddToCart(product, selectedSize, selectedColor, Math.min(quantity, maxQty))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const askText = `Hi! I'm looking at "${product.title}" (${formatInr(product.priceInr)})${
    selectedSize ? ` in size ${selectedSize}` : ''
  }. Can you help me with the fit?`

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={product.title}
    >
      <div
        className="relative w-full max-w-4xl bg-white sm:rounded-2xl shadow-2xl overflow-hidden my-auto sm:max-h-[95vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#181716] shadow-sm"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery */}
        <div className="w-full md:w-1/2 bg-[#F5F3EF] flex flex-col p-4 sm:p-6">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-stone-200">
            {activeImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={activeImage} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-serif text-[#8E877E]">Celoris Drape</div>
            )}
            {product.tags.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider font-semibold bg-[#181716] text-[#FAF9F6] px-2 py-0.5 rounded shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 pt-4 overflow-x-auto no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-[#181716] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Photo ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Purchase */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between md:overflow-y-auto no-scrollbar space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-[#8E877E] uppercase tracking-wider">
              <span>{product.categoryLabel}</span>
              <span aria-hidden="true">·</span>
              <span className={product.inStock ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
                {product.inStock ? 'In stock' : 'Sold out'}
              </span>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#181716] font-medium leading-snug pr-8">{product.title}</h2>
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-2">
                <span className="text-2xl font-semibold text-[#181716] tabular-nums">{formatInr(product.priceInr)}</span>
                {onSale && (
                  <span className="text-base text-[#8E877E] line-through tabular-nums">{formatInr(product.compareAtInr!)}</span>
                )}
                <span className="text-xs text-[#8E877E]">= {creditsFor(product.priceInr).toLocaleString('en-IN')} Celoris credits</span>
              </div>
            </div>

            {reel && (
              <button
                onClick={() => onWatchReel(reel.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#2C7A4F] hover:text-[#215B3B]"
              >
                <Film className="w-4 h-4" />
                <span>See it styled in our reel</span>
              </button>
            )}

            {product.description && (
              <p className="text-xs sm:text-sm text-[#524C44] leading-relaxed whitespace-pre-line">{product.description}</p>
            )}

            {product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase font-semibold text-[#8E877E] tracking-wider block">
                  Colour{selectedColor && <>: <span className="text-[#181716] font-medium normal-case">{selectedColor}</span></>}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                        selectedColor === color
                          ? 'border-[#181716] bg-[#181716] text-[#FAF9F6] font-semibold'
                          : 'border-[#D6D0C5] text-[#524C44] hover:border-[#181716]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-semibold text-[#8E877E] tracking-wider">Size</span>
                  <a
                    href={whatsappLink(askText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#2C7A4F] underline font-medium hover:text-[#215B3B]"
                  >
                    Not sure? Ask a stylist
                  </a>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((size) => {
                    const available = isSizeAvailable(product, size)
                    return (
                      <button
                        key={size}
                        disabled={!available}
                        onClick={() => {
                          setSelectedSize(size)
                          setQuantity(1)
                        }}
                        className={`py-2 text-xs font-medium rounded-lg border transition-all ${
                          !available
                            ? 'border-[#EAE6DF] text-[#C9C3B8] line-through cursor-not-allowed'
                            : selectedSize === size
                              ? 'border-[#181716] bg-[#181716] text-[#FAF9F6]'
                              : 'border-[#D6D0C5] text-[#181716] hover:border-[#181716]'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
                {sizeStock !== null && sizeStock > 0 && sizeStock <= 3 && (
                  <p className="text-[11px] text-rose-700 font-medium">Only {sizeStock} left in {selectedSize}</p>
                )}
              </div>
            )}

            {(product.fabric || product.fitNotes) && (
              <div className="pt-2 border-t border-[#F0ECE4] space-y-2 text-xs text-[#524C44]">
                {product.fabric && (
                  <div>
                    <span className="font-semibold text-[#181716]">Fabric:</span> {product.fabric}
                  </div>
                )}
                {product.fitNotes && (
                  <div>
                    <span className="font-semibold text-[#181716]">Fit:</span> {product.fitNotes}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2.5 pt-4 border-t border-[#F0ECE4]">
            {hint && <p className="text-xs text-rose-700 font-medium">{hint}</p>}
            {product.inStock ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#D6D0C5] rounded-xl overflow-hidden bg-[#FAF9F6]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-xs text-[#181716] hover:bg-[#EFECE6]"
                    aria-label="Less"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-xs font-medium text-[#181716] tabular-nums">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                    className="px-3 py-2 text-xs text-[#181716] hover:bg-[#EFECE6]"
                    aria-label="More"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={added ? onOpenBag : handleAdd}
                  className="flex-1 py-3 px-4 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs sm:text-sm font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added · View bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to bag · {formatInr(product.priceInr * quantity)}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="py-3 text-center text-xs font-semibold uppercase tracking-wider bg-[#EFECE6] text-[#6B655B] rounded-xl">
                Sold out
              </div>
            )}

            <a
              href={whatsappLink(askText)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-[#EFECE6] hover:bg-[#E0DBD0] text-[#181716] text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#2C7A4F]" />
              <span>Ask about sizing on WhatsApp</span>
            </a>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#8E877E] pt-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Free shipping over {formatInr(FREE_SHIPPING_MIN_INR)}
              </span>
              <a href={STORE.returnsUrl} className="flex items-center gap-1 hover:text-[#181716]">
                <RotateCcw className="w-3.5 h-3.5" /> Returns &amp; refunds
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
