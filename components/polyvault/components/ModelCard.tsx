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
  CheckCircle2,
  Sparkles,
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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-3xl bg-white/95 backdrop-blur-sm border border-zinc-200/90 hover:border-emerald-500/60 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_40px_-8px_rgba(16,185,129,0.16)] transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Thumbnail & Real-Time Interactive 3D Canvas Stage */}
      <div
        className="relative h-60 w-full bg-gradient-to-b from-slate-50/90 via-emerald-50/20 to-white border-b border-zinc-100/90 overflow-hidden flex items-center justify-center cursor-pointer select-none"
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
          className="absolute w-32 h-32 blur-3xl opacity-25 rounded-full pointer-events-none transition-opacity duration-300 group-hover:opacity-50"
          style={{ backgroundColor: asset.primaryColor || '#10b981' }}
        />

        {/* Corner HUD Marks on Hover */}
        <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-emerald-500/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-emerald-500/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Top Badges: Category, Compare Toggle & Wishlist */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-md text-emerald-800 border border-emerald-200/80 shadow-xs">
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
                className={`px-2.5 py-1 rounded-xl backdrop-blur-md border text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                  isComparing
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-600/30'
                    : 'bg-white/90 border-zinc-200 text-zinc-600 hover:text-emerald-700 hover:bg-white hover:border-emerald-300'
                }`}
                title={isComparing ? 'Remove from comparison' : 'Add to compare'}
              >
                <Scale className="w-3 h-3" />
                <span className="hidden xs:inline">{isComparing ? 'Comparing' : 'Compare'}</span>
              </motion.button>
            )}

            {/* Like Heart Button with Spring Animation */}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.82 }}
              id={`btn-like-${asset.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(asset.id);
              }}
              className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-xs ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-rose-500/20'
                  : 'bg-white/90 border-zinc-200 text-zinc-400 hover:text-zinc-800 hover:bg-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* 3D Orbit Indicator Pill */}
        <div className="absolute bottom-3 right-3 pointer-events-none z-10 flex items-center gap-1 bg-white/85 backdrop-blur-md px-2 py-0.5 rounded-lg border border-zinc-200/80 text-[10px] text-zinc-500 font-mono transition-opacity duration-200 group-hover:opacity-0">
          <RotateCw className="w-2.5 h-2.5 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Interactive 3D</span>
        </div>

        {/* Formats Pills */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 pointer-events-none z-10 group-hover:opacity-0 transition-opacity">
          {asset.formats.slice(0, 3).map((fmt) => (
            <span
              key={fmt}
              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-white/90 backdrop-blur-xs text-zinc-600 border border-zinc-200/90 shadow-xs"
            >
              .{fmt}
            </span>
          ))}
          {asset.formats.length > 3 && (
            <span className="text-[9px] font-mono text-zinc-400 bg-white/90 px-1 rounded border border-zinc-200">
              +{asset.formats.length - 3}
            </span>
          )}
        </div>

        {/* Bottom Hover Action Overlay Bar with smooth spring */}
        <div
          className={`absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-300 z-20 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
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
            className="flex-1 py-2.5 rounded-xl bg-white/95 hover:bg-white text-zinc-900 font-bold text-xs border border-zinc-200/90 flex items-center justify-center gap-1.5 shadow-md backdrop-blur-md transition-colors cursor-pointer"
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
            className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md flex items-center gap-1 transition-all cursor-pointer"
            title="Fast Download Package"
          >
            {activeCoupon ? <Zap className="w-3.5 h-3.5 animate-pulse" /> : <Download className="w-3.5 h-3.5" />}
          </motion.button>
        </div>
      </div>

      {/* Model Metadata Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-white">
        <div>
          {/* Title & Rating */}
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onInspect(asset)}
              className="text-sm font-extrabold text-zinc-950 hover:text-emerald-600 transition-colors cursor-pointer line-clamp-1 leading-snug"
            >
              {asset.title}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200/80 shrink-0">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{asset.rating}</span>
            </div>
          </div>

          {/* Technical Spec Row */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-zinc-500 font-medium">
            <span className="font-mono text-zinc-600 font-semibold">{asset.polyCount.toLocaleString()} Polys</span>
            <span className="text-zinc-300">•</span>
            <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              {asset.isPbr ? 'PBR 4K' : 'Standard'}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="font-mono text-zinc-500">{asset.fileSizeMb} MB</span>
          </div>
        </div>

        {/* Author & Pricing Footer */}
        <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
          {/* Author with verified check */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onAuthorClick(asset.author.id);
            }}
            className="flex items-center gap-2 cursor-pointer group/author"
          >
            <div className="relative">
              <img
                src={asset.author.avatar}
                alt={asset.author.name}
                className="w-6 h-6 rounded-full object-cover border border-zinc-200"
              />
              {asset.author.verified && (
                <CheckCircle2 className="w-2.5 h-2.5 fill-emerald-500 text-white absolute -bottom-0.5 -right-0.5" />
              )}
            </div>
            <span className="text-xs font-medium text-zinc-600 group-hover/author:text-zinc-950 transition-colors truncate max-w-[100px]">
              {asset.author.name}
            </span>
          </div>

          {/* Price & Fast CDN Badge */}
          <div className="text-right">
            {asset.price === 0 ? (
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-xs">
                FREE
              </span>
            ) : (
              <div className="flex items-center gap-1.5">
                {activeCoupon && asset.price !== finalPrice && (
                  <span className="text-[11px] line-through text-zinc-400 font-mono">
                    ₹{asset.price}
                  </span>
                )}
                <span className="text-sm font-black text-zinc-950 font-mono tracking-tight">₹{finalPrice}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
