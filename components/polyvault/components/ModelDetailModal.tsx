import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ModelAsset, Coupon, UserProfile } from '../types';
import { ThreeViewport } from './ThreeViewport';
import {
  X,
  Download,
  Zap,
  Heart,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Layers,
  Box,
  FileCheck,
  Star,
  ExternalLink,
  Award,
  Scale,
} from 'lucide-react';

interface ModelDetailModalProps {
  asset: ModelAsset | null;
  activeCoupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDownload: (asset: ModelAsset) => void;
  onOpenCouponModal: () => void;
  onOpenAuthorProfile: (authorId: string) => void;
  isLiked: boolean;
  onToggleLike: (assetId: string) => void;
  isComparing?: boolean;
  onToggleCompare?: (asset: ModelAsset) => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  asset,
  activeCoupon,
  isOpen,
  onClose,
  onOpenDownload,
  onOpenCouponModal,
  onOpenAuthorProfile,
  isLiked,
  onToggleLike,
  isComparing = false,
  onToggleCompare,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !asset) return null;

  // Calculate discounted price if coupon is active
  const finalPrice = activeCoupon && asset.price > 0
    ? Math.max(0, +(asset.price * (1 - activeCoupon.discountPercent / 100)).toFixed(2))
    : asset.price;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      id="model-detail-backdrop"
      className="fixed inset-0 z-40 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        id="model-detail-container"
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-6xl h-[90vh] bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left / Main Section: 3D Interactive Viewport Studio */}
        <div className="flex-1 flex flex-col h-[55%] md:h-full bg-zinc-950 border-b md:border-b-0 md:border-r border-zinc-200 relative">
          <ThreeViewport asset={asset} height="100%" showControlPanel={true} />
        </div>

        {/* Right Section: Model Specifications, Author, Pricing & Download CTA */}
        <div className="w-full md:w-96 lg:w-[420px] h-[45%] md:h-full flex flex-col bg-white text-zinc-800 overflow-y-auto">
          {/* Header Bar */}
          <div className="p-5 border-b border-zinc-200 flex items-start justify-between gap-3 sticky top-0 bg-white/95 backdrop-blur-md z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                  {asset.category}
                </span>
                {asset.isPbr && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    PBR 4K
                  </span>
                )}
              </div>
              <h1 className="text-lg font-bold text-zinc-950 leading-snug">{asset.title}</h1>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onToggleCompare && (
                <button
                  id="btn-compare-detail"
                  onClick={() => onToggleCompare(asset)}
                  className={`px-2.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isComparing
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                  title={isComparing ? 'Remove from comparison' : 'Add to side-by-side comparison'}
                >
                  <Scale className="w-4 h-4" />
                  <span className="hidden sm:inline">{isComparing ? 'Comparing' : 'Compare'}</span>
                </button>
              )}

              <button
                id="btn-like-detail"
                onClick={() => onToggleLike(asset.id)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
              </button>

              <button
                id="btn-share-detail"
                onClick={handleShare}
                className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors relative cursor-pointer"
                title="Share Asset"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink && (
                  <span className="absolute -bottom-8 right-0 bg-zinc-900 text-white text-[10px] px-2 py-0.5 rounded shadow">
                    Link Copied!
                  </span>
                )}
              </button>

              <button
                id="btn-close-detail"
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-5 flex-1">
            {/* Price & Speed Tier CTA Box */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3 shadow-xs">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">
                    License & Price
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    {asset.price === 0 ? (
                      <span className="text-2xl font-black text-emerald-600">FREE</span>
                    ) : (
                      <>
                        <span className="text-2xl font-black text-zinc-950 font-mono">₹{finalPrice}</span>
                        {activeCoupon && asset.price !== finalPrice && (
                          <span className="text-sm line-through text-zinc-400 font-medium font-mono">
                            ₹{asset.price}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-zinc-200 text-xs shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-zinc-900">{asset.rating}</span>
                  <span className="text-zinc-500">({asset.reviewCount})</span>
                </div>
              </div>

              {/* Coupon Speed Info Banner */}
              {activeCoupon ? (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-900">
                    <Zap className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Coupon <strong>{activeCoupon.code}</strong> Applied</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold">120 MB/s Turbo</span>
                </div>
              ) : (
                <button
                  id="btn-trigger-coupon-from-detail"
                  onClick={onOpenCouponModal}
                  className="w-full py-2 px-3 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 flex items-center justify-between text-xs text-zinc-700 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" /> Have a coupon for Turbo speed?
                  </span>
                  <span className="text-emerald-600 font-semibold underline">Redeem</span>
                </button>
              )}

              {/* Direct Download Button */}
              <button
                id="btn-download-from-detail"
                onClick={() => onOpenDownload(asset)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                {activeCoupon ? <Zap className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                <span>{activeCoupon ? 'Fast Speed Turbo Download' : 'Download Asset'}</span>
              </button>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Overview</h3>
              <p className="text-xs text-zinc-600 leading-relaxed">{asset.description}</p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-emerald-600" /> Technical Details
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                  <span className="text-zinc-500 text-[11px]">Polygon Count</span>
                  <span className="text-zinc-900 font-mono font-bold mt-0.5">
                    {asset.polyCount.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                  <span className="text-zinc-500 text-[11px]">Vertices</span>
                  <span className="text-zinc-900 font-mono font-bold mt-0.5">
                    {asset.vertexCount.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                  <span className="text-zinc-500 text-[11px]">Rigged</span>
                  <span className="text-zinc-900 font-bold mt-0.5">
                    {asset.isRigged ? 'Yes, Biped Rig' : 'Static Mesh'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col">
                  <span className="text-zinc-500 text-[11px]">Animated</span>
                  <span className="text-zinc-900 font-bold mt-0.5">
                    {asset.isAnimated ? 'Cycle Included' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Available Formats */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Supported Formats
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {asset.formats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2.5 py-1 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-mono font-medium text-zinc-700"
                  >
                    .{fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Included Textures */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" /> PBR Texture Maps (4K)
              </h3>
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 space-y-1">
                {asset.textures.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator / Author Card */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Creator</h3>
              <div
                id={`author-card-${asset.author.id}`}
                onClick={() => onOpenAuthorProfile(asset.author.id)}
                className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-emerald-400 transition-colors cursor-pointer flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={asset.author.avatar}
                    alt={asset.author.name}
                    className="w-10 h-10 rounded-xl object-cover border border-zinc-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-900 text-xs">{asset.author.name}</span>
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-zinc-500">{asset.author.handle}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                    {asset.author.badge}
                  </span>
                  <div className="text-[10px] text-zinc-500 mt-1">{asset.author.salesCount} Sales</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {asset.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-zinc-100 text-[11px] text-zinc-600 border border-zinc-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
