import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ModelAsset, Coupon } from '../types';
import { MiniModelPreview } from './MiniModelPreview';
import {
  X,
  Scale,
  Eye,
  Download,
  Trash2,
  Check,
  Zap,
  Box,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface CompareDrawerProps {
  selectedAssets: ModelAsset[];
  onRemoveAsset: (assetId: string) => void;
  onClearAll: () => void;
  onInspectAsset: (asset: ModelAsset) => void;
  onDownloadAsset: (asset: ModelAsset) => void;
  activeCoupon: Coupon | null;
}

export const CompareModal: React.FC<CompareDrawerProps> = ({
  selectedAssets,
  onRemoveAsset,
  onClearAll,
  onInspectAsset,
  onDownloadAsset,
  activeCoupon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (selectedAssets.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Compare Bar Indicator */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        // Bottom-LEFT, not bottom-right: the site's SupportBotWidget lives at
        // a fixed bottom-5 right-5 with a higher z-index ([60] vs this tray's
        // 40), so anchoring both trays to the same corner let the chat bubble
        // sit on top of this tray's buttons (including Clear), making them
        // unclickable. Opposite corners avoids the collision entirely rather
        // than trying to out-stack a z-index race.
        className="fixed bottom-5 left-5 z-40 flex items-center gap-3 p-2 pl-3.5 bg-white border border-zinc-200/90 rounded-2xl shadow-xl backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <Scale className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-zinc-950 flex items-center gap-1.5">
              <span>Comparing</span>
              <span className="bg-emerald-100 text-emerald-800 font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {selectedAssets.length}
              </span>
            </div>
            <div className="text-[10px] text-zinc-500">Up to 4 models</div>
          </div>
        </div>

        {/* Small avatar previews */}
        <div className="flex -space-x-1.5 overflow-hidden">
          {selectedAssets.map((asset) => (
            <div
              key={asset.id}
              className="w-7 h-7 rounded-lg bg-zinc-100 border-2 border-white overflow-hidden shadow-2xs relative"
              title={asset.title}
            >
              <div className="w-full h-full transform scale-150">
                <MiniModelPreview
                  generatorType={asset.generatorType}
                  primaryColor={asset.primaryColor}
                  accentColor={asset.accentColor}
                  thumbnailDataUrl={asset.thumbnailDataUrl}
                  isHovered={false}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 pl-1 border-l border-zinc-200">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="btn-open-compare-overlay"
            onClick={() => setIsOpen(true)}
            className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
          >
            <span>Compare Specs</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.button>

          <button
            onClick={onClearAll}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Clear comparison list"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Full Modal Comparison Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div
            id="compare-modal-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              id="compare-modal-container"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-5xl bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 bg-white border-b border-zinc-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-zinc-950 flex items-center gap-2">
                      <span>Side-by-Side Model Comparison</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-mono font-semibold border border-emerald-200">
                        {selectedAssets.length} Selected
                      </span>
                    </h2>
                    <p className="text-xs text-zinc-500">
                      Compare polygon budget, texturing, animation rig status, and format support
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={onClearAll}
                    className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button
                    id="btn-close-compare-modal"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Comparison Matrix Table */}
              <div className="p-6 overflow-x-auto overflow-y-auto">
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `180px repeat(${selectedAssets.length}, minmax(220px, 1fr))`,
                  }}
                >
                  {/* TOP ROW: Previews & Titles */}
                  <div className="font-semibold text-xs text-zinc-400 uppercase tracking-wider flex items-end pb-3">
                    Model Overview
                  </div>
                  {selectedAssets.map((asset) => {
                    const finalPrice =
                      activeCoupon && asset.price > 0
                        ? Math.max(0, +(asset.price * (1 - activeCoupon.discountPercent / 100)).toFixed(2))
                        : asset.price;

                    return (
                      <div
                        key={asset.id}
                        className="relative p-3.5 rounded-2xl bg-zinc-50/70 border border-zinc-200 flex flex-col space-y-3"
                      >
                        <button
                          onClick={() => onRemoveAsset(asset.id)}
                          className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-white/90 border border-zinc-200 text-zinc-400 hover:text-rose-500 hover:border-rose-200 transition-colors cursor-pointer shadow-2xs"
                          title="Remove from comparison"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="w-full h-36 rounded-xl bg-white border border-zinc-200/80 overflow-hidden relative shadow-2xs">
                          <MiniModelPreview
                            generatorType={asset.generatorType}
                            primaryColor={asset.primaryColor}
                            accentColor={asset.accentColor}
                            thumbnailDataUrl={asset.thumbnailDataUrl}
                            isHovered={true}
                          />
                          <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/90 text-emerald-800 border border-emerald-200 shadow-2xs">
                            {asset.category}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-bold text-sm text-zinc-950 truncate" title={asset.title}>
                            {asset.title}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-900 font-mono">
                              {asset.price === 0 ? (
                                <span className="text-emerald-700">FREE</span>
                              ) : (
                                <>
                                  {activeCoupon && asset.price !== finalPrice && (
                                    <span className="line-through text-zinc-400 mr-1 text-[11px]">
                                      ₹{asset.price}
                                    </span>
                                  )}
                                  ₹{finalPrice}
                                </>
                              )}
                            </span>
                            <span className="text-[10px] text-zinc-500">★ {asset.rating}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              onInspectAsset(asset);
                            }}
                            className="py-1.5 px-2 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-[11px] font-bold text-zinc-800 flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Eye className="w-3 h-3 text-emerald-600" />
                            <span>View 3D</span>
                          </button>
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              onDownloadAsset(asset);
                            }}
                            className="py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-[11px] font-bold text-white flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Download className="w-3 h-3" />
                            <span>Get</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* SPEC ROW: Polygon Count */}
                  <div className="py-3 px-3 rounded-xl bg-zinc-100/60 font-semibold text-xs text-zinc-700 flex items-center">
                    Polygon Count
                  </div>
                  {selectedAssets.map((asset) => (
                    <div
                      key={'poly-' + asset.id}
                      className="py-3 px-3 rounded-xl bg-white border border-zinc-200/80 text-xs font-mono font-bold text-zinc-900 flex items-center justify-between"
                    >
                      <span>{asset.polyCount.toLocaleString()} polys</span>
                      <span className="text-[10px] text-zinc-400 font-sans font-normal">
                        {asset.polyCount < 20000 ? 'Low-Poly' : asset.polyCount < 60000 ? 'Mid-Poly' : 'High-Poly'}
                      </span>
                    </div>
                  ))}

                  {/* SPEC ROW: PBR Texturing */}
                  <div className="py-3 px-3 rounded-xl bg-zinc-100/60 font-semibold text-xs text-zinc-700 flex items-center">
                    PBR Textures
                  </div>
                  {selectedAssets.map((asset) => (
                    <div
                      key={'pbr-' + asset.id}
                      className="py-3 px-3 rounded-xl bg-white border border-zinc-200/80 text-xs flex items-center justify-between"
                    >
                      {asset.isPbr ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                          <Check className="w-4 h-4 text-emerald-600" /> 4K Multi-Channel
                        </span>
                      ) : (
                        <span className="text-zinc-400">Standard Diffuse</span>
                      )}
                    </div>
                  ))}

                  {/* SPEC ROW: Rigging */}
                  <div className="py-3 px-3 rounded-xl bg-zinc-100/60 font-semibold text-xs text-zinc-700 flex items-center">
                    Skeletal Rigging
                  </div>
                  {selectedAssets.map((asset) => (
                    <div
                      key={'rig-' + asset.id}
                      className="py-3 px-3 rounded-xl bg-white border border-zinc-200/80 text-xs flex items-center justify-between"
                    >
                      {asset.isRigged ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                          <Check className="w-4 h-4 text-emerald-600" /> Bone Rigged
                        </span>
                      ) : (
                        <span className="text-zinc-400">Static Mesh</span>
                      )}
                    </div>
                  ))}

                  {/* SPEC ROW: Animation */}
                  <div className="py-3 px-3 rounded-xl bg-zinc-100/60 font-semibold text-xs text-zinc-700 flex items-center">
                    Animations Included
                  </div>
                  {selectedAssets.map((asset) => (
                    <div
                      key={'anim-' + asset.id}
                      className="py-3 px-3 rounded-xl bg-white border border-zinc-200/80 text-xs flex items-center justify-between"
                    >
                      {asset.isAnimated ? (
                        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
                          <Check className="w-4 h-4 text-emerald-600" /> Motion Loops
                        </span>
                      ) : (
                        <span className="text-zinc-400">None</span>
                      )}
                    </div>
                  ))}

                  {/* SPEC ROW: Formats */}
                  <div className="py-3 px-3 rounded-xl bg-zinc-100/60 font-semibold text-xs text-zinc-700 flex items-center">
                    File Formats
                  </div>
                  {selectedAssets.map((asset) => (
                    <div
                      key={'fmt-' + asset.id}
                      className="py-3 px-3 rounded-xl bg-white border border-zinc-200/80 text-xs flex flex-wrap gap-1 items-center"
                    >
                      {asset.formats.map((f) => (
                        <span
                          key={f}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-100 text-zinc-700 border border-zinc-200"
                        >
                          .{f}
                        </span>
                      ))}
                    </div>
                  ))}

                  {/* SPEC ROW: File Size */}
                  <div className="py-3 px-3 rounded-xl bg-zinc-100/60 font-semibold text-xs text-zinc-700 flex items-center">
                    File Size (CDN Package)
                  </div>
                  {selectedAssets.map((asset) => (
                    <div
                      key={'size-' + asset.id}
                      className="py-3 px-3 rounded-xl bg-white border border-zinc-200/80 text-xs font-mono font-semibold text-zinc-700 flex items-center justify-between"
                    >
                      <span>{asset.fileSizeMb} MB</span>
                    </div>
                  ))}

                  {/* SPEC ROW: License */}
                  <div className="py-3 px-3 rounded-xl bg-zinc-100/60 font-semibold text-xs text-zinc-700 flex items-center">
                    Commercial License
                  </div>
                  {selectedAssets.map((asset) => (
                    <div
                      key={'lic-' + asset.id}
                      className="py-3 px-3 rounded-xl bg-white border border-zinc-200/80 text-xs text-zinc-800 flex items-center"
                    >
                      <span className="font-semibold text-zinc-900">{asset.license}</span>
                    </div>
                  ))}

                  {/* SPEC ROW: Creator */}
                  <div className="py-3 px-3 rounded-xl bg-zinc-100/60 font-semibold text-xs text-zinc-700 flex items-center">
                    Creator
                  </div>
                  {selectedAssets.map((asset) => (
                    <div
                      key={'auth-' + asset.id}
                      className="py-3 px-3 rounded-xl bg-white border border-zinc-200/80 text-xs flex items-center gap-2"
                    >
                      <img
                        src={asset.author.avatar}
                        alt={asset.author.name}
                        className="w-5 h-5 rounded-full object-cover border border-zinc-200"
                      />
                      <span className="font-medium text-zinc-800 truncate">{asset.author.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-500">
                <span>Select more items from the store to add up to 4 models side-by-side.</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs cursor-pointer transition-colors shadow-xs"
                >
                  Close Comparison
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
