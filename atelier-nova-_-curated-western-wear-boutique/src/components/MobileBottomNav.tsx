import React from 'react';
import { Grid3X3, Film, MessageSquare, ShoppingBag, BarChart3 } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'feed' | 'reels' | 'messages' | 'analytics';
  setActiveTab: (tab: 'feed' | 'reels' | 'messages' | 'analytics') => void;
  cartCount: number;
  openCart: () => void;
  unreadCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  unreadCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#EAE6DF] h-14 px-3 flex items-center justify-around">
      {/* Feed */}
      <button
        onClick={() => setActiveTab('feed')}
        className={`flex flex-col items-center justify-center p-2 min-w-[54px] min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'feed' ? 'text-[#181716]' : 'text-[#8E877E]'
        }`}
        aria-label="Shop Feed"
      >
        <Grid3X3 className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[9px] font-medium tracking-tight mt-0.5">Feed</span>
      </button>

      {/* Reels */}
      <button
        onClick={() => setActiveTab('reels')}
        className={`flex flex-col items-center justify-center p-2 min-w-[54px] min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'reels' ? 'text-[#181716]' : 'text-[#8E877E]'
        }`}
        aria-label="Reels Studio"
      >
        <Film className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[9px] font-medium tracking-tight mt-0.5">Reels</span>
      </button>

      {/* VIP Stylist DM */}
      <button
        onClick={() => setActiveTab('messages')}
        className={`relative flex flex-col items-center justify-center p-2 min-w-[54px] min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'messages' ? 'text-[#181716]' : 'text-[#8E877E]'
        }`}
        aria-label="VIP Stylist Consultation"
      >
        <MessageSquare className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[9px] font-medium tracking-tight mt-0.5">Stylist</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#8C6239] text-[8px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Shopping Bag */}
      <button
        onClick={openCart}
        className="relative flex flex-col items-center justify-center p-2 min-w-[54px] min-h-[44px] text-[#8E877E] transition-colors cursor-pointer"
        aria-label="Shopping Bag"
      >
        <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[9px] font-medium tracking-tight mt-0.5">Bag</span>
        {cartCount > 0 && (
          <span className="absolute top-1 right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#181716] text-[8px] font-bold text-white">
            {cartCount}
          </span>
        )}
      </button>

      {/* Owner Studio / Analytics */}
      <button
        onClick={() => setActiveTab('analytics')}
        className={`flex flex-col items-center justify-center p-2 min-w-[54px] min-h-[44px] transition-colors cursor-pointer ${
          activeTab === 'analytics' ? 'text-[#181716]' : 'text-[#8E877E]'
        }`}
        aria-label="Owner Analytics"
      >
        <BarChart3 className="w-5 h-5 stroke-[1.8]" />
        <span className="text-[9px] font-medium tracking-tight mt-0.5">Analytics</span>
      </button>
    </nav>
  );
};
