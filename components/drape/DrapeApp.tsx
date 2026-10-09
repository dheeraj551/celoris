'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { STORE, cartKey, type CartItem, type DrapeProduct, type DrapeReel } from '@/lib/drape-shared'
import { Navbar, type DrapeTab } from './Navbar'
import { ProfileHeader } from './ProfileHeader'
import { HighlightsBar } from './HighlightsBar'
import { ShopFeedGrid } from './ShopFeedGrid'
import { ReelsStudio } from './ReelsStudio'
import { OrdersView } from './OrdersView'
import { ProductDetailModal } from './ProductDetailModal'
import { CartDrawer, type CartLine } from './CartDrawer'
import { CheckoutModal } from './CheckoutModal'
import { MobileBottomNav } from './MobileBottomNav'
import './drape.css'

const CART_STORAGE_KEY = 'celoris-drape-cart-v1'
const ADMIN_ROLES = ['admin', 'super_admin']

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed)
      ? parsed.filter((i) => i && typeof i.productId === 'string' && Number(i.quantity) > 0)
      : []
  } catch {
    return []
  }
}

export default function DrapeApp() {
  const { user, profile, refreshProfile } = useAuth() as any
  const isAdmin = ADMIN_ROLES.includes(String(profile?.role || ''))

  const [products, setProducts] = useState<DrapeProduct[]>([])
  const [reels, setReels] = useState<DrapeReel[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [activeTab, setActiveTab] = useState<DrapeTab>('feed')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeReelId, setActiveReelId] = useState<string | null>(null)

  const [cart, setCart] = useState<CartItem[]>([])
  const [cartReady, setCartReady] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<DrapeProduct | null>(null)
  const [ordersVersion, setOrdersVersion] = useState(0)

  // Catalog
  const loadCatalog = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch('/api/drape/catalog', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Could not load the store')
      setProducts(data.products || [])
      setReels(data.reels || [])
    } catch (e: any) {
      setLoadError(e?.message || 'Could not load the store')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCatalog()
  }, [loadCatalog])

  // Cart persistence (per browser)
  useEffect(() => {
    setCart(loadCart())
    setCartReady(true)
  }, [])
  useEffect(() => {
    if (!cartReady) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {}
  }, [cart, cartReady])

  // Deep links: /shop?tab=reels, /shop?product=<slug>
  useEffect(() => {
    if (loading) return
    try {
      const params = new URLSearchParams(window.location.search)
      const tab = params.get('tab')
      if (tab === 'reels' || tab === 'orders') setActiveTab(tab)
      const slug = params.get('product')
      if (slug) {
        const p = products.find((x) => x.slug === slug || x.id === slug)
        if (p) setSelectedProduct(p)
      }
    } catch {}
    // only once, after the first catalog load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  const openProduct = useCallback((p: DrapeProduct | null) => {
    setSelectedProduct(p)
    try {
      const url = new URL(window.location.href)
      if (p?.slug) url.searchParams.set('product', p.slug)
      else url.searchParams.delete('product')
      window.history.replaceState(null, '', url.toString())
    } catch {}
  }, [])

  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])

  // Lines the shopper can actually buy (drops products that were unpublished).
  const cartLines: CartLine[] = useMemo(
    () =>
      cart
        .map((item) => {
          const product = productById.get(item.productId)
          return product ? { ...item, product } : null
        })
        .filter((l): l is CartLine => Boolean(l)),
    [cart, productById]
  )
  const totalCartCount = cartLines.reduce((n, l) => n + l.quantity, 0)

  const handleAddToCart = (product: DrapeProduct, size: string, color: string, quantity: number) => {
    const key = cartKey(product.id, size, color)
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.key === key)
      if (idx > -1) {
        const next = [...prev]
        next[idx] = { ...next[idx], quantity: Math.min(10, next[idx].quantity + quantity) }
        return next
      }
      return [...prev, { key, productId: product.id, size, color, quantity: Math.min(10, quantity) }]
    })
  }

  // "Quick bag" only works when there's nothing to choose; otherwise open the product.
  const handleQuickAdd = (product: DrapeProduct) => {
    if (product.sizes.length > 1 || product.colors.length > 1 || !product.inStock) {
      openProduct(product)
      return
    }
    handleAddToCart(product, product.sizes[0] || '', product.colors[0] || '', 1)
    setIsCartOpen(true)
  }

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, quantity: Math.min(10, i.quantity + delta) } : i))
        .filter((i) => i.quantity > 0)
    )
  }
  const handleRemove = (key: string) => setCart((prev) => prev.filter((i) => i.key !== key))

  const handleOrderPlaced = () => {
    setCart([])
    setOrdersVersion((v) => v + 1)
    try {
      refreshProfile?.()
    } catch {}
  }

  const reelForProduct = (productId: string) => reels.find((r) => r.taggedProductIds.includes(productId)) || null

  const watchReel = (reelId: string) => {
    setActiveReelId(reelId)
    setActiveTab('reels')
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {}
  }

  return (
    <div className="drape-root min-h-screen bg-[#FAF9F6] text-[#181716] flex flex-col pb-16 md:pb-0">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        isAdmin={isAdmin}
        signedIn={!!user}
      />

      <main className="flex-1">
        {activeTab !== 'orders' && (
          <>
            <ProfileHeader
              productCount={products.length}
              reelCount={reels.length}
              onWatchReels={() => setActiveTab('reels')}
            />
            <HighlightsBar
              products={products}
              activeCategory={activeCategory}
              onSelect={(cat) => {
                setActiveCategory(cat)
                setActiveTab('feed')
              }}
            />
          </>
        )}

        {loading ? (
          <div className="py-24 flex justify-center">
            <div className="h-10 w-10 border-2 border-[#EAE6DF] border-t-[#2C7A4F] rounded-full animate-spin" />
          </div>
        ) : loadError ? (
          <div className="py-20 text-center space-y-3 px-4">
            <p className="text-sm text-[#524C44]">{loadError}</p>
            <button
              onClick={loadCatalog}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-[#181716] text-white rounded-lg"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'feed' && (
              <ShopFeedGrid
                products={products}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                onSelectProduct={openProduct}
                onQuickAdd={handleQuickAdd}
              />
            )}
            {activeTab === 'reels' && (
              <ReelsStudio
                reels={reels}
                products={products}
                activeReelId={activeReelId}
                setActiveReelId={setActiveReelId}
                onOpenProduct={openProduct}
                onQuickAdd={handleQuickAdd}
              />
            )}
          </>
        )}

        {activeTab === 'orders' && <OrdersView signedIn={!!user} version={ordersVersion} />}
      </main>

      <footer className="border-t border-[#EAE6DF] bg-white py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#8E877E]">
          <div className="space-y-1 text-center md:text-left">
            <span className="font-serif text-sm font-semibold tracking-[0.2em] text-[#181716] uppercase">
              Celoris Drape
            </span>
            <p className="text-[11px] text-[#6B655B]">
              {STORE.tagline} By Celoris Designs LLP, {STORE.location}.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[#524C44]">
            <button onClick={() => setActiveTab('feed')} className="hover:text-[#181716]">Shop</button>
            <button onClick={() => setActiveTab('reels')} className="hover:text-[#181716]">Reels</button>
            <a href={STORE.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#181716]">
              Instagram
            </a>
            <a href={STORE.returnsUrl} className="hover:text-[#181716]">Returns &amp; refunds</a>
            <a href="/" className="hover:text-[#181716]">Celoris</a>
          </div>
          <div className="text-[11px] text-[#8E877E]">© {new Date().getFullYear()} Celoris Designs LLP</div>
        </div>
      </footer>

      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
      />

      {selectedProduct && (
        <ProductDetailModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => openProduct(null)}
          onAddToCart={(p, size, color, qty) => {
            handleAddToCart(p, size, color, qty)
          }}
          onOpenBag={() => {
            openProduct(null)
            setIsCartOpen(true)
          }}
          reel={reelForProduct(selectedProduct.id)}
          onWatchReel={(reelId) => {
            openProduct(null)
            watchReel(reelId)
          }}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lines={cartLines}
        staleCount={cart.length - cartLines.length}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemove}
        onProceedToCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
          // Make sure the wallet balance shown at checkout is current.
          try {
            refreshProfile?.()
          } catch {}
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          onClose={() => setIsCheckoutOpen(false)}
          lines={cartLines}
          user={user}
          profile={profile}
          onOrderPlaced={handleOrderPlaced}
          onViewOrders={() => {
            setIsCheckoutOpen(false)
            setActiveTab('orders')
          }}
        />
      )}
    </div>
  )
}
