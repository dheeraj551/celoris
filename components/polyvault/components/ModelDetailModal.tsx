import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Sparkles,
  Cpu,
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
  const finalPrice =
    activeCoupon && asset.price > 0
      ? Math.max(0, +(asset.price * (1 - activeCoupon.discountPercent / 100)).toFixed(2))
      : asset.price;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Format description text cleanly (handles raw text or properties dump gracefully)
  const formatDescription = (desc: string) => {
    if (desc.includes('Properties:') || desc.includes('Faces[Polys]:')) {
      // Clean up raw export string into readable sentence
      const clean = desc
        .replace(/Properties:.*$/i, '')
        .replace(/Full PBR texture maps\([^)]*\):/i, 'Includes complete high-fidelity 4K PBR material maps:')
        .trim();
      return clean || desc;
    }
    return desc;
  };

  return (
    <div
      id="model-detail-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        id="model-detail-container"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-6xl h-[92vh] bg-white border border-zinc-200/90 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left / Main Section: 3D Interactive Viewport Studio */}
        <div className="flex-1 flex flex-col h-[52%] md:h-full bg-slate-950 border-b md:border-b-0 md:border-r border-zinc-200/90 relative overflow-hidden">
          <ThreeViewport asset={asset} height="100%" showControlPanel={true} />
        </div>

        {/* Right Section: Model Specifications, Author, Pricing & Download CTA */}
        <div className="w-full md:w-[420px] lg:w-[450px] h-[48%] md:h-full flex flex-col bg-white text-zinc-800 overflow-y-auto">
          {/* Header Bar */}
          <div className="p-5 border-b border-zinc-100 flex items-start justify-between gap-3 sticky top-0 bg-white/95 backdrop-blur-md z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200/80 uppercase tracking-wider">
                  {asset.category}
                </span>
                {asset.isPbr && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100/80 text-emerald-900 border border-emerald-300/80">
                    4K PBR
                  </span>
                )}
                {asset.isRigged && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-800 border border-sky-200">
                    Rigged
                  </span>
                )}
              </div>
              <h1 className="text-xl font-black text-zinc-950 tracking-tight leading-snug">{asset.title}</h1>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onToggleCompare && (
                <button
                  id="btn-compare-detail"
                  onClick={() => onToggleCompare(asset)}
                  className={`px-3 py-2 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isComparing
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                      : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                  title={isComparing ? 'Remove from comparison' : 'Add to compare'}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isComparing ? 'Comparing' : 'Compare'}</span>
                </button>
              )}

              <button
                id="btn-like-detail"
                onClick={() => onToggleLike(asset.id)}
                className={`p-2 rounded-2xl border transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-xs'
                    : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <button
                id="btn-share-detail"
                onClick={handleShare}
                className="p-2 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all relative cursor-pointer"
                title="Share Asset"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink && (
                  <span className="absolute -bottom-8 right-0 bg-zinc-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-lg whitespace-nowrap">
                    Link Copied!
                  </span>
                )}
              </button>

              <button
                id="btn-close-detail"
                onClick={onClose}
                className="p-2 rounded-2xl bg-zinc-50 border border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-all cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-6 flex-1">
            {/* Price & Speed Tier CTA Box */}
            <div className="p-4 rounded-3xl bg-gradient-to-br from-zinc-50 to-emerald-50/30 border border-zinc-200/90 space-y-3.5 shadow-xs">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                    License & Pricing
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    {asset.price === 0 ? (
                      <span className="text-2xl font-black text-emerald-600">FREE</span>
                    ) : (
                      <>
                        <span className="text-2xl font-black text-zinc-950 font-mono tracking-tight">
                          ₹{finalPrice}
                        </span>
                        {activeCoupon && asset.price !== finalPrice && (
                          <span className="text-sm line-through text-zinc-400 font-medium font-mono">
                            ₹{asset.price}
                          </span>
                        )}
                      </>
                    )}
                    <span className="text-xs text-zinc-500 font-medium">({asset.license})</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-zinc-200/90 text-xs shadow-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-zinc-950">{asset.rating}</span>
                  <span className="text-zinc-400 font-mono">({asset.reviewCount})</span>
                </div>
              </div>

              {/* Coupon Speed Info Banner */}
              {activeCoupon ? (
                <div className="p-3 rounded-2xl bg-emerald-50/90 border border-emerald-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-950 font-medium">
                    <Zap className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                    <span>Turbo CDN Coupon <strong className="font-mono font-bold text-emerald-700">{activeCoupon.code}</strong> Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md font-bold">
                    120 MB/s
                  </span>
                </div>
              ) : (
                <button
                  id="btn-trigger-coupon-from-detail"
                  onClick={onOpenCouponModal}
                  className="w-full py-2.5 px-3.5 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs text-zinc-700 transition-colors cursor-pointer shadow-xs"
                >
                  <span className="flex items-center gap-2 text-emerald-700 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" /> Unlock 120 MB/s Gigabit Speed
                  </span>
                  <span className="text-emerald-600 font-bold underline">Apply Coupon</span>
                </button>
              )}

              {/* Direct Download Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                id="btn-download-from-detail"
                onClick={() => onOpenDownload(asset)}
                className="relative overflow-hidden w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {activeCoupon ? <Zap className="w-4 h-4 animate-pulse" /> : <Download className="w-4 h-4" />}
                <span>{activeCoupon ? 'Fast Speed Turbo Download' : 'Download 3D Package'}</span>
              </motion.button>
            </div>

            {/* Description Overview */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Model Overview
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed bg-zinc-50/60 p-3.5 rounded-2xl border border-zinc-200/70">
                {formatDescription(asset.description)}
              </p>
            </div>

            {/* Technical Specifications Grid */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-emerald-600" /> Technical Details
              </h3>
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Polygons</span>
                  <span className="text-zinc-950 font-mono font-black mt-0.5 text-sm">
                    {asset.polyCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-medium">Quad Dominant</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Vertices</span>
                  <span className="text-zinc-950 font-mono font-black mt-0.5 text-sm">
                    {asset.vertexCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">Optimized Normals</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Rigging</span>
                  <span className="text-zinc-950 font-bold mt-0.5 text-sm">
                    {asset.isRigged ? 'Rigged Biped' : 'Static Mesh'}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">{asset.isRigged ? 'Hierarchy OK' : 'Clean Pivot'}</span>
                </div>
                <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex flex-col">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Animation</span>
                  <span className="text-zinc-950 font-bold mt-0.5 text-sm">
                    {asset.isAnimated ? 'Cycle Included' : 'None'}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-medium">{asset.isAnimated ? '60 FPS Keyframes' : 'Ready to Rig'}</span>
                </div>
              </div>
            </div>

            {/* Available Formats */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Supported 3D Formats
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {asset.formats.map((fmt) => (
                  <span
                    key={fmt}
                    className="px-3 py-1 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono font-bold text-zinc-800"
                  >
                    .{fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Included Textures */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" /> PBR Material Passes (4K)
              </h3>
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200/80 text-xs text-zinc-700 space-y-1.5">
                {asset.textures.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-medium text-zinc-800">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator / Author Card */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Verified Creator</h3>
              <div
                id={`author-card-${asset.author.id}`}
                onClick={() => onOpenAuthorProfile(asset.author.id)}
                className="p-4 rounded-2xl bg-zinc-50 hover:bg-emerald-50/40 border border-zinc-200/90 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={asset.author.avatar}
                      alt={asset.author.name}
                      className="w-10 h-10 rounded-2xl object-cover border border-zinc-200"
                    />
                    <CheckCircle2 className="w-3 h-3 fill-emerald-500 text-white absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-zinc-950 text-xs">{asset.author.name}</span>
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-[11px] text-zinc-500 font-medium">{asset.author.handle}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 font-bold border border-emerald-200">
                    {asset.author.badge}
                  </span>
                  <div className="text-[10px] text-zinc-500 mt-1 font-mono">{asset.author.salesCount} Sales</div>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {asset.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-xl bg-zinc-100 text-[11px] font-medium text-zinc-600 border border-zinc-200/80"
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
