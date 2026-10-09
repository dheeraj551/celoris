import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { checkoutErrorMessage } from '@/lib/drape-server'
import { CREDITS_PER_RUPEE, FREE_SHIPPING_MIN_INR, SHIPPING_FEE_INR } from '@/lib/drape-shared'

// Places a Celoris Drape order paid from the shopper's Celoris wallet.
// The browser only sends WHAT to buy (product id, size, colour, quantity) and
// WHERE to deliver. Prices, stock and the credit amount are all worked out in
// the database (drape_place_order), and the wallet debit + order are a single
// transaction — so nothing here can be used to pay less or charge someone else.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function clean(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Please sign in to place your order.' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const rawItems: any[] = Array.isArray(body?.items) ? body.items : []
    if (rawItems.length < 1 || rawItems.length > 20) {
      return NextResponse.json({ error: 'Your bag is empty or has too many lines (max 20).' }, { status: 400 })
    }
    const items = rawItems.map((it) => ({
      productId: clean(it?.productId, 40),
      size: clean(it?.size, 20),
      color: clean(it?.color, 40),
      quantity: Math.floor(Number(it?.quantity) || 0),
    }))
    if (items.some((it) => !UUID_RE.test(it.productId) || it.quantity < 1 || it.quantity > 10)) {
      return NextResponse.json({ error: 'Some items in your bag are not valid. Please refresh the page.' }, { status: 400 })
    }

    const c = body?.customer || {}
    const customer = {
      name: clean(c.name, 120),
      phone: clean(c.phone, 20),
      email: clean(c.email, 200),
      address: clean(c.address, 400),
      city: clean(c.city, 80),
      state: clean(c.state, 80),
      pincode: clean(c.pincode, 10),
      notes: clean(c.notes, 500),
    }
    if (!/^[0-9+\-\s]{10,15}$/.test(customer.phone)) {
      return NextResponse.json({ error: 'Please enter a valid 10-digit mobile number.' }, { status: 400 })
    }
    if (!/^[1-9][0-9]{5}$/.test(customer.pincode)) {
      return NextResponse.json({ error: 'Please enter a valid 6-digit PIN code.' }, { status: 400 })
    }
    if (!customer.name || !customer.address || !customer.city) {
      return NextResponse.json({ error: 'Please fill in your name, address and city.' }, { status: 400 })
    }

    const admin = createSupabaseClientForServer()
    const { data, error } = await admin.rpc('drape_place_order', {
      p_user_id: user.id,
      p_items: items,
      p_customer: customer,
      p_credits_per_rupee: CREDITS_PER_RUPEE,
      p_free_shipping_min: FREE_SHIPPING_MIN_INR,
      p_shipping_fee: SHIPPING_FEE_INR,
    })

    if (error) {
      const mapped = checkoutErrorMessage(error.message)
      if (mapped.code === 'UNKNOWN') console.error('[drape] checkout failed:', error.message)
      return NextResponse.json({ error: mapped.message, code: mapped.code }, { status: mapped.status })
    }

    return NextResponse.json({
      orderId: data.order_id,
      orderNumber: data.order_number,
      subtotalInr: Number(data.subtotal_inr),
      shippingInr: Number(data.shipping_inr),
      totalInr: Number(data.total_inr),
      creditsCharged: data.credits_charged,
      balance: Number(data.balance),
    })
  } catch (error: any) {
    console.error('[drape] checkout exception:', error)
    return NextResponse.json({ error: 'Something went wrong placing your order. You have not been charged.' }, { status: 500 })
  }
}
