import React from 'react';
import { ShoppingBag, MessageSquare, Plus, BarChart3, Film, Grid3X3, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'feed' | 'reels' | 'messages' | 'analytics';
  setActiveTab: (tab: 'feed' | 'reels' | 'messages' | 'analytics') => void;
  cartCount: number;
  openCart: () => void;
  openEmbedModal: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  openEmbedModal,
  unreadCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE6DF] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('feed')}
            className="text-left group cursor-pointer focus:outline-none"
            aria-label="ReelCart Home"
          >
            <span className="font-serif text-xl sm:text-2xl font-semibold tracking-[0.25em] text-[#181716] uppercase block transition-opacity group-hover:opacity-80">
              REELCART
            </span>
          </button>
          <span className="hidden lg:inline text-[11px] tracking-widest text-[#8E877E] uppercase font-sans border-l border-[#D6D0C5] pl-3">
            Western Tailoring
          </span>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase font-medium rounded transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'text-[#181716] font-semibold bg-[#EFECE6]'
                : 'text-[#6B655B] hover:text-[#181716] hover:bg-[#F3EFE8]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Grid3X3 className="w-3.5 h-3.5" />
              Shop Feed
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reels')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase font-medium rounded transition-all cursor-pointer ${
              activeTab === 'reels'
                ? 'text-[#181716] font-semibold bg-[#EFECE6]'
                : 'text-[#6B655B] hover:text-[#181716] hover:bg-[#F3EFE8]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              Reels Studio
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`relative px-3 py-1.5 text-xs tracking-wider uppercase font-medium rounded transition-all cursor-pointer ${
              activeTab === 'messages'
                ? 'text-[#181716] font-semibold bg-[#EFECE6]'
                : 'text-[#6B655B] hover:text-[#181716] hover:bg-[#F3EFE8]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              VIP Stylist DM
            </span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8C6239] text-[9px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 text-xs tracking-wider uppercase font-medium rounded transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'text-[#181716] font-semibold bg-[#EFECE6]'
                : 'text-[#6B655B] hover:text-[#181716] hover:bg-[#F3EFE8]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              Owner Studio
            </span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openEmbedModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs tracking-wider uppercase font-medium text-[#181716] border border-[#D6D0C5] rounded hover:border-[#181716] transition-colors cursor-pointer"
            title="Embed Instagram Reel"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Embed Reel</span>
          </button>

          <button
            onClick={openCart}
            className="relative p-2 text-[#181716] hover:bg-[#EFECE6] rounded-full transition-colors cursor-pointer"
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {cartCount > 0 && (
              <span className="absolute 1 top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#181716] text-[10px] font-semibold text-[#FAF9F6]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
