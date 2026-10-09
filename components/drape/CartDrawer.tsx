'use client'

import { ArrowRight, ShoppingBag, Trash2, Truck, Wallet, X } from 'lucide-react'
import {
  FREE_SHIPPING_MIN_INR,
  creditsFor,
  formatInr,
  shippingFor,
  type CartItem,
  type DrapeProduct,
} from '@/lib/drape-shared'

export type CartLine = CartItem & { product: DrapeProduct }

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  lines: CartLine[]
  staleCount: number
  onUpdateQuantity: (key: string, delta: number) => void
  onRemoveItem: (key: string) => void
  onProceedToCheckout: () => void
}

export function CartDrawer({ isOpen, onClose, lines, staleCount, onUpdateQuantity, onRemoveItem, onProceedToCheckout }: CartDrawerProps) {
  if (!isOpen) return null

  const subtotal = lines.reduce((sum, l) => sum + l.product.priceInr * l.quantity, 0)
  const shipping = shippingFor(subtotal)
  const total = subtotal + shipping
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_MIN_INR) * 100)
  const count = lines.reduce((n, l) => n + l.quantity, 0)
  const hasSoldOut = lines.some((l) => !l.product.inStock)

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-4 sm:p-6 border-b border-[#EAE6DF] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#181716]" />
              <h3 className="font-serif text-xl font-medium text-[#181716]">Your bag ({count})</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-[#FAF9F6] text-[#6B655B] hover:text-[#181716]" aria-label="Close bag">
              <X className="w-5 h-5" />
            </button>
          </div>

          {lines.length > 0 && (
            <div className="p-4 bg-[#FAF9F6] border-b border-[#EAE6DF] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-[#524C44]">
                <Truck className="w-3.5 h-3.5 text-[#2C7A4F]" />
                {shipping === 0 ? (
                  <span className="font-semibold text-emerald-700">You&apos;ve unlocked free shipping!</span>
                ) : (
                  <span>Add {formatInr(FREE_SHIPPING_MIN_INR - subtotal)} more for free shipping</span>
                )}
              </div>
              <div className="w-full h-1.5 bg-[#EAE6DF] rounded-full overflow-hidden">
                <div className="h-full bg-[#2C7A4F] transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-[#F0ECE4]">
            {staleCount > 0 && (
              <p className="text-[11px] text-[#8E877E] pb-2">
                {staleCount} item{staleCount === 1 ? ' is' : 's are'} no longer available and {staleCount === 1 ? 'was' : 'were'} left out.
              </p>
            )}
            {lines.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF9F6] flex items-center justify-center text-[#8E877E] border border-[#EAE6DF]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-serif text-lg text-[#181716]">Your bag is empty</h4>
                <p className="text-xs text-[#6B655B] max-w-xs">Browse the collection or shop straight from our reels.</p>
                <button onClick={onClose} className="mt-2 px-4 py-2 bg-[#181716] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#33302C]">
                  Start shopping
                </button>
              </div>
            ) : (
              lines.map((line) => (
                <div key={line.key} className="pt-4 first:pt-0 flex gap-4">
                  {line.product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={line.product.images[0]} alt={line.product.title} className="w-20 h-24 object-cover rounded-lg bg-stone-100 shrink-0 border border-[#EAE6DF]" />
                  ) : (
                    <div className="w-20 h-24 rounded-lg bg-[#F5F3EF] shrink-0 border border-[#EAE6DF]" />
                  )}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-[#181716] line-clamp-2">{line.product.title}</h4>
                        <button onClick={() => onRemoveItem(line.key)} className="text-[#8E877E] hover:text-rose-600 p-0.5" aria-label="Remove item">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#6B655B] mt-0.5">
                        {line.size && <>Size: <span className="font-medium text-[#181716]">{line.size}</span></>}
                        {line.size && line.color && ' · '}
                        {line.color && <>Colour: <span className="font-medium text-[#181716]">{line.color}</span></>}
                      </p>
                      {!line.product.inStock && <p className="text-[11px] text-rose-700 font-medium mt-0.5">Sold out — please remove</p>}
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[#D6D0C5] rounded-md overflow-hidden bg-[#FAF9F6]">
                        <button onClick={() => onUpdateQuantity(line.key, -1)} className="px-2 py-0.5 text-xs text-[#181716] hover:bg-[#EFECE6]" aria-label="Less">-</button>
                        <span className="px-2.5 py-0.5 text-xs tabular-nums">{line.quantity}</span>
                        <button onClick={() => onUpdateQuantity(line.key, 1)} className="px-2 py-0.5 text-xs text-[#181716] hover:bg-[#EFECE6]" aria-label="More">+</button>
                      </div>
                      <span className="text-sm font-semibold text-[#181716] tabular-nums">{formatInr(line.product.priceInr * line.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {lines.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#EAE6DF] bg-[#FAF9F6] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6B655B]">
                  <span>Subtotal</span>
                  <span className="text-[#181716] font-medium tabular-nums">{formatInr(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#6B655B]">
                  <span>Shipping</span>
                  <span className="text-[#2C7A4F] font-medium">{shipping === 0 ? 'Free' : formatInr(shipping)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#181716] pt-2 border-t border-[#EAE6DF]">
                  <span>Total</span>
                  <span className="tabular-nums">{formatInr(total)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#6B655B]">
                  <span className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5" /> Paid from your Celoris wallet
                  </span>
                  <span className="font-semibold text-[#181716] tabular-nums">{creditsFor(total).toLocaleString('en-IN')} credits</span>
                </div>
              </div>
              <button
                onClick={onProceedToCheckout}
                disabled={hasSoldOut}
                className="w-full py-3.5 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
