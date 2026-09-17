import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ModelAsset, Coupon } from '../types';
import { MiniModelPreview } from './MiniModelPreview';
import {
  Eye,
  Download,
  Zap,
  Heart,
  Star,
  Box,
  Check,
  RotateCw,
  Scale,
} from 'lucide-react';

interface ModelCardProps {
  asset: ModelAsset;
  activeCoupon: Coupon | null;
  onInspect: (asset: ModelAsset) => void;
  onDownload: (asset: ModelAsset) => void;
  isLiked: boolean;
  onToggleLike: (assetId: string) => void;
  onAuthorClick: (authorId: string) => void;
  isComparing?: boolean;
  onToggleCompare?: (asset: ModelAsset) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  asset,
  activeCoupon,
  onInspect,
  onDownload,
  isLiked,
  onToggleLike,
  onAuthorClick,
  isComparing = false,
  onToggleCompare,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Price after coupon discount
  const finalPrice =
    activeCoupon && asset.price > 0
      ? Math.max(0, +(asset.price * (1 - activeCoupon.discountPercent / 100)).toFixed(2))
      : asset.price;

  return (
    <motion.div
      id={`model-card-${asset.id}`}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group relative flex flex-col rounded-2xl bg-white border border-zinc-200/90 hover:border-emerald-500/60 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Thumbnail & Real-Time Interactive 3D Canvas Stage */}
      <div
        className="relative h-60 w-full bg-gradient-to-b from-zinc-50/80 via-emerald-50/20 to-white border-b border-zinc-100 overflow-hidden flex items-center justify-center cursor-pointer select-none"
        onClick={() => onInspect(asset)}
      >
        {/* Subtle decorative isometric grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b9810a_1px,transparent_1px),linear-gradient(to_bottom,#10b9810a_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* Real-time WebGL Mini 3D Viewport with Gyro/Mouse Tilt */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
          <MiniModelPreview
            generatorType={asset.generatorType}
            primaryColor={asset.primaryColor}
            accentColor={asset.accentColor}
            isHovered={isHovered}
            thumbnailDataUrl={asset.thumbnailDataUrl}
          />
        </div>

        {/* 3D Model Floating Glow Aura */}
        <div
          className="absolute w-28 h-28 blur-3xl opacity-20 rounded-full pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
          style={{ backgroundColor: asset.primaryColor || '#10b981' }}
        />

        {/* Top Badges: Category, Compare Toggle & Wishlist */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-emerald-800 border border-emerald-200/80 shadow-xs">
            {asset.category}
          </span>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Compare Toggle Button */}
            {onToggleCompare && (
              <motion.button
                whileTap={{ scale: 0.88 }}
                id={`btn-compare-${asset.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(asset);
                }}
                className={`px-2 py-1.5 rounded-xl backdrop-blur-md border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                  isComparing
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-white/90 border-zinc-200 text-zinc-600 hover:text-emerald-700 hover:bg-white hover:border-emerald-300'
                }`}
                title={isComparing ? 'Remove from side-by-side comparison' : 'Add to compare'}
              >
                <Scale className="w-3 h-3" />
                <span className="hidden xs:inline">{isComparing ? 'Comparing' : 'Compare'}</span>
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.85 }}
              id={`btn-like-${asset.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(asset.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-xs ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-500'
                  : 'bg-white/90 border-zinc-200 text-zinc-400 hover:text-zinc-800 hover:bg-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* 3D Orbit Indicator Pill */}
        <div className="absolute bottom-3 right-3 pointer-events-none z-10 flex items-center gap-1 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-zinc-200/80 text-[10px] text-zinc-500 font-mono transition-opacity duration-200 group-hover:opacity-0">
          <RotateCw className="w-2.5 h-2.5 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>3D View</span>
        </div>

        {/* Formats Pills */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 pointer-events-none z-10 group-hover:opacity-0 transition-opacity">
          {asset.formats.slice(0, 3).map((fmt) => (
            <span
              key={fmt}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-white/95 text-zinc-600 border border-zinc-200 shadow-xs"
            >
              .{fmt}
            </span>
          ))}
          {asset.formats.length > 3 && (
            <span className="text-[9px] font-mono text-zinc-400 bg-white/85 px-1 rounded border border-zinc-200">
              +{asset.formats.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Hover Action Overlay Bar */}
        <div
          className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-300 z-20 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id={`btn-inspect-overlay-${asset.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onInspect(asset);
            }}
            className="flex-1 py-2 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 font-semibold text-xs border border-zinc-200 flex items-center justify-center gap-1.5 shadow-md backdrop-blur-md transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-emerald-600" /> Inspect 3D
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id={`btn-quick-download-${asset.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onDownload(asset);
            }}
            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center gap-1 transition-colors cursor-pointer"
            title="Fast Download"
          >
            {activeCoupon ? <Zap className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          </motion.button>
        </div>
      </div>

      {/* Model Metadata Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onInspect(asset)}
              className="text-sm font-bold text-zinc-950 hover:text-emerald-600 transition-colors cursor-pointer line-clamp-1"
            >
              {asset.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500 shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{asset.rating}</span>
            </div>
          </div>

          {/* Technical Spec Row */}
          <div className="flex items-center gap-2.5 mt-2 text-[11px] text-zinc-500">
            <span className="font-mono">{asset.polyCount.toLocaleString()} Polys</span>
            <span>•</span>
            <span className="text-emerald-700 font-medium">{asset.isPbr ? 'PBR 4K' : 'Standard'}</span>
            <span>•</span>
            <span className="font-mono">{asset.fileSizeMb} MB</span>
          </div>
        </div>

        {/* Author & Pricing Footer */}
        <div className="pt-2.5 border-t border-zinc-100 flex items-center justify-between">
          {/* Author */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onAuthorClick(asset.author.id);
            }}
            className="flex items-center gap-2 cursor-pointer group/author"
          >
            <img
              src={asset.author.avatar}
              alt={asset.author.name}
              className="w-6 h-6 rounded-full object-cover border border-zinc-200"
            />
            <span className="text-xs text-zinc-600 group-hover/author:text-zinc-950 transition-colors truncate max-w-[100px]">
              {asset.author.name}
            </span>
          </div>

          {/* Price & Fast CDN Badge */}
          <div className="text-right">
            {asset.price === 0 ? (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                FREE
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                {activeCoupon && asset.price !== finalPrice && (
                  <span className="text-[11px] line-through text-zinc-400 font-mono">
                    ₹{asset.price}
                  </span>
                )}
                <span className="text-sm font-bold text-zinc-950 font-mono">₹{finalPrice}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
