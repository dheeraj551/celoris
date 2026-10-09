'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Lock, MessageCircle, ShieldCheck, Wallet, X } from 'lucide-react'
import { STORE, creditsFor, formatInr, shippingFor, whatsappLink } from '@/lib/drape-shared'
import type { CartLine } from './CartDrawer'

interface CheckoutModalProps {
  onClose: () => void
  lines: CartLine[]
  user: any
  profile: any
  onOrderPlaced: () => void
  onViewOrders: () => void
}

interface PlacedOrder {
  orderNumber: string
  totalInr: number
  creditsCharged: number
  balance: number
}

const ADDRESS_KEY = 'celoris-drape-address-v1'

type Form = {
  name: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  pincode: string
  notes: string
}

export function CheckoutModal({ onClose, lines, user, profile, onOrderPlaced, onViewOrders }: CheckoutModalProps) {
  const [form, setForm] = useState<Form>({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [placed, setPlaced] = useState<PlacedOrder | null>(null)

  // Prefill: last address used in this browser, then the Celoris profile.
  useEffect(() => {
    let saved: Partial<Form> = {}
    try {
      saved = JSON.parse(localStorage.getItem(ADDRESS_KEY) || '{}') || {}
    } catch {}
    setForm((f) => ({
      ...f,
      ...saved,
      name: saved.name || profile?.full_name || '',
      phone: saved.phone || profile?.phone || '',
      email: saved.email || user?.email || '',
      notes: '',
    }))
  }, [profile, user])

  const subtotal = lines.reduce((sum, l) => sum + l.product.priceInr * l.quantity, 0)
  const shipping = shippingFor(subtotal)
  const total = subtotal + shipping
  const creditsNeeded = creditsFor(total)
  const balance = Math.floor(Number(profile?.wallet_balance) || 0)
  const short = Math.max(0, creditsNeeded - balance)

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/drape/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lines.map((l) => ({ productId: l.productId, size: l.size, color: l.color, quantity: l.quantity })),
          customer: form,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Could not place your order. You have not been charged.')
      try {
        const { notes, ...addr } = form
        localStorage.setItem(ADDRESS_KEY, JSON.stringify(addr))
      } catch {}
      setPlaced({
        orderNumber: data.orderNumber,
        totalInr: data.totalInr,
        creditsCharged: data.creditsCharged,
        balance: data.balance,
      })
      onOrderPlaced()
    } catch (err: any) {
      setError(err?.message || 'Could not place your order.')
    } finally {
      setSubmitting(false)
    }
  }

  const input =
    'w-full p-2.5 bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg focus:outline-none focus:border-[#181716] text-sm'
  const label = 'text-[11px] uppercase font-semibold text-[#8E877E] tracking-wider block'

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={submitting ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          disabled={submitting}
          className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-[#FAF9F6] text-[#6B655B] hover:text-[#181716]"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {placed ? (
          <div className="p-6 sm:p-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#2C7A4F] font-bold">Order placed</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#181716] font-medium">Thank you, {form.name.split(' ')[0] || 'there'}!</h3>
              <p className="text-xs sm:text-sm text-[#6B655B]">We&apos;re getting your pieces ready. You can follow the order in My Orders.</p>
            </div>
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] text-left space-y-3 text-xs">
              <Row k="Order number" v={<span className="font-semibold">#{placed.orderNumber}</span>} />
              <Row k="Deliver to" v={`${form.address}, ${form.city} ${form.pincode}`} />
              <Row k="Order total" v={formatInr(placed.totalInr)} />
              <Row k="Paid from wallet" v={`${placed.creditsCharged.toLocaleString('en-IN')} credits`} />
              <Row k="Wallet balance now" v={`${Math.floor(placed.balance).toLocaleString('en-IN')} credits`} last />
            </div>
            <div className="space-y-2 pt-2">
              <button
                onClick={onViewOrders}
                className="w-full py-3 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl"
              >
                View my orders
              </button>
              <a
                href={whatsappLink(`Hi Celoris Drape! I just placed order #${placed.orderNumber}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 text-xs text-[#2C7A4F] font-semibold flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" /> Message us about this order
              </a>
              <button onClick={onClose} className="w-full py-2 text-xs text-[#6B655B] hover:text-[#181716]">
                Continue shopping
              </button>
            </div>
          </div>
        ) : !user ? (
          <div className="p-6 sm:p-8 space-y-5 text-center">
            <Wallet className="w-10 h-10 mx-auto text-[#2C7A4F]" />
            <div className="space-y-1">
              <h3 className="font-serif text-2xl text-[#181716] font-medium">Sign in to check out</h3>
              <p className="text-sm text-[#6B655B]">
                Celoris Drape orders are paid from your Celoris wallet. Your bag is saved, so you can pick up right here after signing in.
              </p>
            </div>
            <a
              href="/login?redirect=/shop"
              className="block w-full py-3 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl"
            >
              Sign in or create an account
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 sm:p-8 space-y-5">
            <div className="border-b border-[#EAE6DF] pb-4">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#2C7A4F]">Celoris Drape checkout</span>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#181716]">Delivery details</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={label} htmlFor="d-name">Full name</label>
                  <input id="d-name" required value={form.name} onChange={set('name')} className={input} autoComplete="name" />
                </div>
                <div className="space-y-1">
                  <label className={label} htmlFor="d-phone">Mobile number</label>
                  <input id="d-phone" required inputMode="tel" value={form.phone} onChange={set('phone')} className={input} autoComplete="tel" placeholder="10-digit mobile" />
                </div>
              </div>
              <div className="space-y-1">
                <label className={label} htmlFor="d-email">Email (for updates)</label>
                <input id="d-email" type="email" value={form.email} onChange={set('email')} className={input} autoComplete="email" />
              </div>
              <div className="space-y-1">
                <label className={label} htmlFor="d-address">Address</label>
                <textarea id="d-address" required rows={2} value={form.address} onChange={set('address')} className={input} autoComplete="street-address" placeholder="House / flat, street, area, landmark" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className={label} htmlFor="d-city">City</label>
                  <input id="d-city" required value={form.city} onChange={set('city')} className={input} autoComplete="address-level2" />
                </div>
                <div className="space-y-1">
                  <label className={label} htmlFor="d-state">State</label>
                  <input id="d-state" value={form.state} onChange={set('state')} className={input} autoComplete="address-level1" />
                </div>
                <div className="space-y-1">
                  <label className={label} htmlFor="d-pin">PIN code</label>
                  <input id="d-pin" required inputMode="numeric" maxLength={6} value={form.pincode} onChange={set('pincode')} className={input} autoComplete="postal-code" />
                </div>
              </div>
              <div className="space-y-1">
                <label className={label} htmlFor="d-notes">Note for us (optional)</label>
                <input id="d-notes" value={form.notes} onChange={set('notes')} className={input} placeholder="e.g. gift wrap, call before delivery" />
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF9F6] rounded-xl border border-[#EAE6DF] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B655B]">
                <span>Items ({lines.reduce((n, l) => n + l.quantity, 0)})</span>
                <span className="text-[#181716] font-medium tabular-nums">{formatInr(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6B655B]">
                <span>Shipping</span>
                <span className="text-[#2C7A4F] font-medium">{shipping === 0 ? 'Free' : formatInr(shipping)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#181716] pt-1.5 border-t border-[#EAE6DF]">
                <span>Total</span>
                <span className="tabular-nums">{formatInr(total)}</span>
              </div>
              <div className="flex justify-between text-[#181716] pt-1">
                <span className="flex items-center gap-1.5"><Wallet className="w-3.5 h-3.5 text-[#2C7A4F]" /> Pay with Celoris credits</span>
                <span className="font-semibold tabular-nums">{creditsNeeded.toLocaleString('en-IN')} credits</span>
              </div>
              <div className="flex justify-between text-[11px] text-[#8E877E]">
                <span>Your wallet</span>
                <span className="tabular-nums">{balance.toLocaleString('en-IN')} credits</span>
              </div>
            </div>

            {short > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
                <span>You need {short.toLocaleString('en-IN')} more credits for this order.</span>
                <a href={STORE.topUpUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 px-3 py-1.5 bg-[#181716] text-white rounded-lg font-semibold">
                  Add credits
                </a>
              </div>
            )}

            {error && <p className="text-xs text-rose-700 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={submitting || short > 0 || lines.length === 0}
              className="w-full py-3.5 bg-[#181716] hover:bg-[#33302C] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span>Placing your order…</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay {creditsNeeded.toLocaleString('en-IN')} credits · Place order</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-2 text-[10px] text-[#8E877E]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2C7A4F]" />
              <span>Credits are only taken when your order is confirmed. Refunds go back to your wallet.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function Row({ k, v, last }: { k: string; v: React.ReactNode; last?: boolean }) {
  return (
    <div className={`flex justify-between gap-4 ${last ? '' : 'border-b border-[#EAE6DF] pb-2'}`}>
      <span className="text-[#8E877E] shrink-0">{k}</span>
      <span className="font-medium text-[#181716] text-right">{v}</span>
    </div>
  )
}
