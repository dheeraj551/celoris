'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Package } from 'lucide-react'
import { ORDER_STATUS_LABEL, formatInr, whatsappLink, type DrapeOrder } from '@/lib/drape-shared'

const STEPS = ['placed', 'packed', 'shipped', 'delivered'] as const

export function OrdersView({ signedIn, version }: { signedIn: boolean; version: number }) {
  const [orders, setOrders] = useState<DrapeOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!signedIn) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    fetch('/api/drape/orders', { cache: 'no-store' })
      .then((r) => r.json().then((d) => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        if (cancelled) return
        if (!ok) throw new Error(d?.error || 'Could not load your orders')
        setOrders(d.orders || [])
      })
      .catch((e) => !cancelled && setError(e?.message || 'Could not load your orders'))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [signedIn, version])

  return (
    <section className="py-8 sm:py-12 max-w-3xl mx-auto px-4 sm:px-6">
      <h2 className="font-serif text-2xl sm:text-3xl text-[#181716] font-medium mb-6">My orders</h2>

      {!signedIn ? (
        <div className="text-center py-12 space-y-3">
          <p className="text-sm text-[#6B655B]">Sign in to see your Celoris Drape orders.</p>
          <a href="/login?redirect=/shop%3Ftab%3Dorders" className="inline-block px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#181716] text-white rounded-lg">
            Sign in
          </a>
        </div>
      ) : loading ? (
        <div className="py-16 flex justify-center">
          <div className="h-8 w-8 border-2 border-[#EAE6DF] border-t-[#2C7A4F] rounded-full animate-spin" />
        </div>
      ) : error ? (
        <p className="text-sm text-rose-700">{error}</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 space-y-2">
          <Package className="w-10 h-10 mx-auto text-[#8E877E]" />
          <p className="text-sm text-[#6B655B]">No orders yet. Your first find is waiting in the shop.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((o) => {
            const stepIdx = STEPS.indexOf(o.status as (typeof STEPS)[number])
            return (
              <article key={o.id} className="bg-white border border-[#EAE6DF] rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-[#181716]">#{o.orderNumber}</p>
                    <p className="text-[11px] text-[#8E877E]">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${
                      o.status === 'refunded'
                        ? 'bg-rose-50 text-rose-700'
                        : o.status === 'delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-[#EFECE6] text-[#181716]'
                    }`}
                  >
                    {ORDER_STATUS_LABEL[o.status]}
                  </span>
                </div>

                {o.status !== 'refunded' && (
                  <div className="flex items-center gap-1.5">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex-1 space-y-1">
                        <div className={`h-1.5 rounded-full ${i <= stepIdx ? 'bg-[#2C7A4F]' : 'bg-[#EAE6DF]'}`} />
                        <p className={`text-[10px] ${i <= stepIdx ? 'text-[#181716] font-medium' : 'text-[#8E877E]'}`}>
                          {ORDER_STATUS_LABEL[s]}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {o.trackingInfo && (
                  <p className="text-xs text-[#524C44] bg-[#FAF9F6] border border-[#EAE6DF] rounded-lg p-2.5">
                    <span className="font-semibold">Tracking:</span> {o.trackingInfo}
                  </p>
                )}

                <div className="divide-y divide-[#F0ECE4]">
                  {o.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex items-center gap-3">
                      {it.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt="" className="w-12 h-14 rounded-md object-cover bg-stone-100 shrink-0" />
                      ) : (
                        <div className="w-12 h-14 rounded-md bg-[#F5F3EF] shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#181716] truncate">{it.title}</p>
                        <p className="text-[11px] text-[#6B655B]">
                          {[it.size && `Size ${it.size}`, it.color, `Qty ${it.quantity}`].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <span className="text-xs font-medium tabular-nums">{formatInr(it.unitPriceInr * it.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F0ECE4] text-xs">
                  <span className="text-[#6B655B]">
                    Total <span className="font-semibold text-[#181716]">{formatInr(o.totalInr)}</span> ·{' '}
                    {o.creditsCharged.toLocaleString('en-IN')} credits
                    {o.status === 'refunded' && ' (refunded to wallet)'}
                  </span>
                  <a
                    href={whatsappLink(`Hi Celoris Drape! I have a question about order #${o.orderNumber}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#2C7A4F] font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Help with this order
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
