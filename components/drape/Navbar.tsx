'use client'

import { Film, Grid3X3, Package, Settings2, ShoppingBag } from 'lucide-react'

export type DrapeTab = 'feed' | 'reels' | 'orders'

interface NavbarProps {
  activeTab: DrapeTab
  setActiveTab: (tab: DrapeTab) => void
  cartCount: number
  openCart: () => void
  isAdmin: boolean
  signedIn: boolean
}

const TABS: { id: DrapeTab; label: string; Icon: typeof Grid3X3 }[] = [
  { id: 'feed', label: 'Shop', Icon: Grid3X3 },
  { id: 'reels', label: 'Reels', Icon: Film },
  { id: 'orders', label: 'My Orders', Icon: Package },
]

export function Navbar({ activeTab, setActiveTab, cartCount, openCart, isAdmin, signedIn }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE6DF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('feed')}
            className="text-left group focus:outline-none"
            aria-label="Celoris Drape home"
          >
            <span className="font-serif text-xl sm:text-2xl font-semibold tracking-[0.2em] text-[#181716] uppercase block group-hover:opacity-80">
              Celoris <span className="text-[#2C7A4F]">Drape</span>
            </span>
          </button>
          <span className="hidden lg:inline text-[11px] tracking-widest text-[#8E877E] uppercase border-l border-[#D6D0C5] pl-3">
            Women&apos;s Western Wear
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`px-3 py-1.5 text-xs tracking-wider uppercase font-medium rounded transition-all ${
                activeTab === id
                  ? 'text-[#181716] font-semibold bg-[#EFECE6]'
                  : 'text-[#6B655B] hover:text-[#181716] hover:bg-[#F3EFE8]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAdmin && (
            <a
              href="/admin/drape"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-wider uppercase font-medium text-[#181716] border border-[#D6D0C5] rounded hover:border-[#181716] transition-colors"
              title="Manage products, reels and orders"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Manage store</span>
            </a>
          )}
          {!signedIn && (
            <a
              href="/login?redirect=/shop"
              className="hidden sm:inline text-xs uppercase tracking-wider font-medium text-[#6B655B] hover:text-[#181716]"
            >
              Sign in
            </a>
          )}
          <button
            onClick={openCart}
            className="relative p-2 text-[#181716] hover:bg-[#EFECE6] rounded-full transition-colors"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[#181716] text-[10px] font-semibold text-[#FAF9F6]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
