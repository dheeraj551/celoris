'use client'

import { Film, Grid3X3, Package, ShoppingBag } from 'lucide-react'
import type { DrapeTab } from './Navbar'

interface MobileBottomNavProps {
  activeTab: DrapeTab
  setActiveTab: (tab: DrapeTab) => void
  cartCount: number
  openCart: () => void
}

export function MobileBottomNav({ activeTab, setActiveTab, cartCount, openCart }: MobileBottomNavProps) {
  const item = (active: boolean) =>
    `relative flex flex-col items-center justify-center p-2 min-w-[54px] min-h-[44px] transition-colors ${
      active ? 'text-[#181716]' : 'text-[#8E877E]'
    }`
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#EAE6DF] h-14 px-3 flex items-center justify-around">
      <button onClick={() => setActiveTab('feed')} className={item(activeTab === 'feed')} aria-label="Shop">
        <Grid3X3 className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[9px] font-medium mt-0.5">Shop</span>
      </button>
      <button onClick={() => setActiveTab('reels')} className={item(activeTab === 'reels')} aria-label="Reels">
        <Film className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[9px] font-medium mt-0.5">Reels</span>
      </button>
      <button onClick={openCart} className={item(false)} aria-label="Bag">
        <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[9px] font-medium mt-0.5">Bag</span>
        {cartCount > 0 && (
          <span className="absolute top-1 right-2 flex h-3.5 min-w-3.5 px-0.5 items-center justify-center rounded-full bg-[#181716] text-[8px] font-bold text-white">
            {cartCount}
          </span>
        )}
      </button>
      <button onClick={() => setActiveTab('orders')} className={item(activeTab === 'orders')} aria-label="My orders">
        <Package className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[9px] font-medium mt-0.5">Orders</span>
      </button>
    </nav>
  )
}
