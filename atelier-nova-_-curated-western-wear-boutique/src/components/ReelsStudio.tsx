import React, { useState } from 'react';
import { Heart, MessageSquare, Share2, Bookmark, ShoppingBag, Volume2, VolumeX, Plus, Play, Pause, ExternalLink } from 'lucide-react';
import { Reel, Product } from '../types';

interface ReelsStudioProps {
  reels: Reel[];
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
  onOpenEmbedModal: () => void;
}

export const ReelsStudio: React.FC<ReelsStudioProps> = ({
  reels,
  products,
  onOpenProduct,
  onQuickAdd,
  onOpenEmbedModal,
}) => {
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const [savedReels, setSavedReels] = useState<Record<string, boolean>>({});
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [activeShopDrawer, setActiveShopDrawer] = useState(false);

  const currentReel = reels[activeReelIndex] || reels[0];
  const taggedProducts = currentReel.taggedProductIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  const isLiked = likedReels[currentReel.id];
  const isSaved = savedReels[currentReel.id];

  const toggleLike = () => {
    setLikedReels((prev) => ({ ...prev, [currentReel.id]: !prev[currentReel.id] }));
    if (!isLiked) {
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 800);
    }
  };

  const toggleSave = () => {
    setSavedReels((prev) => ({ ...prev, [currentReel.id]: !prev[currentReel.id] }));
  };

  return (
    <section className="py-6 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6">
      {/* Top Banner with Embed Reel Callout */}
      <div className="mb-6 p-4 sm:p-5 bg-[#FAF9F6] border border-[#EAE6DF] rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6239] mb-1">
            <span>Watch & Shop Directly</span>
            <span aria-hidden="true">·</span>
            <span>Instagram Synced</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl text-[#181716] font-medium">
            Shoppable Reels Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#6B655B] max-w-xl mt-0.5">
            Every garment featured in our video looks can be purchased immediately or discussed with a stylist.
          </p>
        </div>

        <button
          onClick={onOpenEmbedModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#181716] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-[#33302C] transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Embed Instagram Reel</span>
        </button>
      </div>

      {/* Main Reels Viewport Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left/Center: Vertical Video Reel Container */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-full max-w-[390px] h-[660px] sm:h-[720px] rounded-2xl overflow-hidden shadow-2xl bg-black border border-[#2A2723] flex flex-col justify-between">
            {/* Reel Video Ambient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-b ${currentReel.gradientBg} flex items-center justify-center`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {taggedProducts[0]?.image && (
                <img
                  src={taggedProducts[0].image}
                  alt={currentReel.title}
                  referrerPolicy="no-referrer"
                  className={`w-full h-full object-cover opacity-75 mix-blend-luminosity transition-transform duration-1000 ${
                    isPlaying ? 'scale-105' : 'scale-100'
                  }`}
                />
              )}

              {/* Scrim overlay for contrast compliance */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 pointer-events-none" />

              {/* Floating Heart Burst on double-tap/like */}
              {showHeartBurst && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-ping">
                  <Heart className="w-24 h-24 fill-rose-600 text-rose-600 drop-shadow-2xl" />
                </div>
              )}

              {/* Play/Pause indicator overlay */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="p-4 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <Play className="w-8 h-8 fill-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Top Bar on Reel */}
            <div className="relative z-20 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 bg-black/40 backdrop-blur-md rounded border border-white/20">
                  REEL #{activeReelIndex + 1} OF {reels.length}
                </span>
                <span className="text-[10px] text-white/80 tabular-nums">
                  {currentReel.viewsCount.toLocaleString()} plays
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white transition-colors cursor-pointer"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Right Side Action Column (Instagram style) */}
            <div className="absolute right-3 bottom-24 z-30 flex flex-col items-center gap-4 text-white">
              {/* Like Button */}
              <button
                onClick={toggleLike}
                className="flex flex-col items-center gap-1 group cursor-pointer"
                aria-label="Like reel"
              >
                <div
                  className={`p-3 rounded-full backdrop-blur-md transition-all ${
                    isLiked
                      ? 'bg-rose-500/20 text-rose-500'
                      : 'bg-black/40 hover:bg-black/60 text-white'
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${isLiked ? 'fill-rose-500 text-rose-500' : 'stroke-[2]'}`}
                  />
                </div>
                <span className="text-[10px] font-mono tabular-nums font-medium drop-shadow">
                  {currentReel.likesCount + (isLiked ? 1 : 0)}
                </span>
              </button>

              {/* Comments Button */}
              <button
                onClick={() => setActiveShopDrawer(true)}
                className="flex flex-col items-center gap-1 group cursor-pointer"
                aria-label="Reel details"
              >
                <div className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white transition-all">
                  <MessageSquare className="w-6 h-6 stroke-[2]" />
                </div>
                <span className="text-[10px] font-mono tabular-nums font-medium drop-shadow">
                  {currentReel.commentsCount}
                </span>
              </button>

              {/* Bookmark / Save */}
              <button
                onClick={toggleSave}
                className="flex flex-col items-center gap-1 group cursor-pointer"
                aria-label="Bookmark reel"
              >
                <div
                  className={`p-3 rounded-full backdrop-blur-md transition-all ${
                    isSaved
                      ? 'bg-[#C29D59]/30 text-[#DFBA73]'
                      : 'bg-black/40 hover:bg-black/60 text-white'
                  }`}
                >
                  <Bookmark
                    className={`w-6 h-6 ${isSaved ? 'fill-[#DFBA73] text-[#DFBA73]' : 'stroke-[2]'}`}
                  />
                </div>
                <span className="text-[10px] font-mono tabular-nums font-medium drop-shadow">
                  Save
                </span>
              </button>

              {/* External IG Link */}
              <a
                href={currentReel.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60 text-white transition-all"
                title="View on Instagram"
              >
                <ExternalLink className="w-5 h-5 stroke-[2]" />
              </a>
            </div>

            {/* Bottom Caption & Audio & Tagged Products Card */}
            <div className="relative z-20 p-4 space-y-3">
              {/* Creator info & Audio */}
              <div className="space-y-1.5 text-white max-w-[80%]">
                <div className="flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="ReelCart"
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-white/60"
                  />
                  <span className="text-xs font-semibold tracking-wide">reelcart.studio</span>
                  <span className="text-[10px] text-white/60">· {currentReel.createdAt}</span>
                </div>

                <p className="text-xs text-white/95 line-clamp-2 leading-relaxed">
                  {currentReel.caption}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-white/75 truncate pt-0.5">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DFBA73] animate-pulse" />
                    <span className="truncate">{currentReel.audioTrack}</span>
                  </div>
                </div>
              </div>

              {/* Interactive Tagged Products Chip Overlay on Reel */}
              {taggedProducts.length > 0 && (
                <div
                  onClick={() => setActiveShopDrawer(true)}
                  className="p-2.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-between gap-3 text-white cursor-pointer hover:bg-white/25 transition-all shadow-lg"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative">
                      <img
                        src={taggedProducts[0].image}
                        alt={taggedProducts[0].title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover bg-black"
                      />
                      {taggedProducts.length > 1 && (
                        <span className="absolute -top-1 -right-1 bg-[#181716] text-[8px] font-bold text-white px-1 rounded-full border border-white/40">
                          +{taggedProducts.length - 1}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-white truncate">
                        {taggedProducts[0].title}
                      </p>
                      <p className="text-[10px] text-white/80 font-mono">
                        ${taggedProducts[0].price} · Tap to Shop Look
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-white text-[#181716] rounded-md shrink-0">
                    Shop
                  </span>
                </div>
              )}

              {/* Video Progress Bar */}
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white/90 rounded-full animate-[progress_15s_linear_infinite]" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Reel Playlist & Shoppable Lookbook Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Reel Product Breakdown */}
          <div className="p-5 bg-white rounded-2xl border border-[#EAE6DF] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE6DF] pb-3">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#8C6239]">
                  Shoppable Outfits in This Reel
                </span>
                <h3 className="font-serif text-lg font-medium text-[#181716]">
                  Tagged Atelier Pieces
                </h3>
              </div>
              <span className="text-xs text-[#8E877E] tabular-nums">
                {taggedProducts.length} items
              </span>
            </div>

            <div className="space-y-3">
              {taggedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 rounded-xl border border-[#EAE6DF] hover:border-[#181716] transition-all flex items-center justify-between gap-3 group"
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    onClick={() => onOpenProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#181716] truncate group-hover:text-[#8C6239] transition-colors">
                        {product.title}
                      </p>
                      <p className="text-xs text-[#6B655B]">{product.categoryLabel}</p>
                      <p className="text-xs font-mono font-medium text-[#181716] tabular-nums mt-0.5">
                        ${product.price}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onQuickAdd(product)}
                    className="px-3 py-1.5 text-xs font-medium text-[#181716] bg-[#EFECE6] hover:bg-[#181716] hover:text-white rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Reel Playlist / Thumbnails Carousel */}
          <div className="p-5 bg-white rounded-2xl border border-[#EAE6DF] shadow-sm space-y-3">
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#8E877E]">
              Explore Other Reels ({reels.length})
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {reels.map((reel, idx) => (
                <button
                  key={reel.id}
                  onClick={() => {
                    setActiveReelIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    activeReelIndex === idx
                      ? 'border-[#181716] bg-[#FAF9F6] shadow-sm'
                      : 'border-[#EAE6DF] hover:border-[#BDB5A7]'
                  }`}
                >
                  <p className="text-xs font-semibold text-[#181716] line-clamp-1">
                    {reel.title}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#8E877E] mt-1 font-mono tabular-nums">
                    <span>{reel.viewsCount.toLocaleString()} plays</span>
                    <span>{reel.duration}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
