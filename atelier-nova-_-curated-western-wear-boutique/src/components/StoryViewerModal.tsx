import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ShoppingBag, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { Story, Product } from '../types';

interface StoryViewerModalProps {
  story: Story | null;
  onClose: () => void;
  products: Product[];
  onOpenProduct: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  story,
  onClose,
  products,
  onOpenProduct,
  onQuickAdd,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!story) return;
    setCurrentIndex(0);
    setProgress(0);
  }, [story]);

  useEffect(() => {
    if (!story || isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < story.items.length - 1) {
            setCurrentIndex((curr) => curr + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2.5; // ~4 seconds per slide
      });
    }, 100);

    return () => clearInterval(timer);
  }, [story, currentIndex, isPaused, onClose]);

  if (!story) return null;

  const currentItem = story.items[currentIndex];
  const taggedProduct = currentItem?.taggedProductId
    ? products.find((p) => p.id === currentItem.taggedProductId)
    : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < story.items.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Story Box Container */}
      <div
        className="relative w-full max-w-sm sm:max-w-md h-full sm:h-[88vh] max-h-[820px] rounded-none sm:rounded-2xl overflow-hidden bg-[#181716] shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Visual Background with simulated editorial atmosphere */}
        <div
          className={`absolute inset-0 bg-gradient-to-b ${currentItem.imageGradient} flex items-center justify-center`}
        >
          {taggedProduct?.image && (
            <img
              src={taggedProduct.image}
              alt={taggedProduct.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />
        </div>

        {/* Top Header & Progress Bars */}
        <div className="relative z-10 p-4 space-y-3">
          {/* Progress Indicators */}
          <div className="flex gap-1.5 w-full">
            {story.items.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100 ease-linear rounded-full"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Account Bar */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-white/60 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="ReelCart"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide">reelcart.studio</p>
                <p className="text-[10px] text-white/70">{story.title} Highlight</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                aria-label="Close story"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Touch Areas */}
        <div className="absolute inset-y-16 inset-x-0 flex items-center justify-between z-10 pointer-events-none">
          <button
            onClick={handlePrev}
            className="w-1/3 h-full pointer-events-auto flex items-center justify-start pl-2 opacity-0 hover:opacity-100 transition-opacity text-white/60 hover:text-white"
            aria-label="Previous story item"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNext}
            className="w-1/3 h-full pointer-events-auto flex items-center justify-end pr-2 opacity-0 hover:opacity-100 transition-opacity text-white/60 hover:text-white"
            aria-label="Next story item"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Bottom Content & Shoppable Tag */}
        <div className="relative z-20 p-5 space-y-4">
          <div className="space-y-1 text-white">
            {currentItem.subtitle && (
              <p className="text-xs tracking-wider uppercase text-[#DFBA73] font-medium">
                {currentItem.subtitle}
              </p>
            )}
            <p className="text-sm sm:text-base leading-snug font-serif text-white/95">
              {currentItem.caption}
            </p>
          </div>

          {/* Interactive Shoppable Product Card Overlay */}
          {taggedProduct && (
            <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-between gap-3 text-white transition-all hover:bg-white/15">
              <div
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                onClick={() => {
                  onClose();
                  onOpenProduct(taggedProduct);
                }}
              >
                <img
                  src={taggedProduct.image}
                  alt={taggedProduct.title}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-lg object-cover bg-stone-800 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{taggedProduct.title}</p>
                  <p className="text-xs text-white/80 tabular-nums font-mono">${taggedProduct.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(taggedProduct);
                  }}
                  className="px-3 py-1.5 text-xs font-medium bg-white text-[#181716] rounded-lg hover:bg-stone-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenProduct(taggedProduct);
                  }}
                  className="p-1.5 text-white/80 hover:text-white transition-colors"
                  aria-label="View product details"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
