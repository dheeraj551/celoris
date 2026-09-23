"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarouselCard, SHOWCASE_CARDS } from './marketingStudioData';
import { ShowcaseCardVisual } from './ShowcaseCardVisual';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Curved3DCarouselProps {
  onSelectCard: (card: CarouselCard) => void;
  selectedCardId?: string;
}

export function Curved3DCarousel({ onSelectCard, selectedCardId = 'fizzo' }: Curved3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = SHOWCASE_CARDS.findIndex((c) => c.id === selectedCardId);
    return idx !== -1 ? idx : 2; // Default to center "CITRUS FIZZO"
  });

  const total = SHOWCASE_CARDS.length;

  const handlePrev = () => {
    const newIdx = (activeIndex - 1 + total) % total;
    setActiveIndex(newIdx);
    onSelectCard(SHOWCASE_CARDS[newIdx]);
  };

  const handleNext = () => {
    const newIdx = (activeIndex + 1) % total;
    setActiveIndex(newIdx);
    onSelectCard(SHOWCASE_CARDS[newIdx]);
  };

  const handleCardClick = (index: number) => {
    setActiveIndex(index);
    onSelectCard(SHOWCASE_CARDS[index]);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[290px] sm:h-[340px] md:h-[390px] flex items-center justify-center select-none perspective-[1200px] overflow-hidden sm:overflow-visible">
      {/* Background radial glow matching the active card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[100px] opacity-25 pointer-events-none transition-colors duration-700"
        style={{
          backgroundColor: SHOWCASE_CARDS[activeIndex]?.accentColor || '#34D399',
        }}
      />

      {/* Cards Deck */}
      <div className="relative w-full h-full flex items-center justify-center">
        {SHOWCASE_CARDS.map((card, index) => {
          // Calculate relative offset from activeIndex (-2, -1, 0, 1, 2)
          let offset = index - activeIndex;
          if (offset < -2) offset += total;
          if (offset > 2) offset -= total;

          const isCenter = offset === 0;
          const isImmediate = Math.abs(offset) === 1;
          const isOuter = Math.abs(offset) >= 2;

          // Compute transform properties for curved 3D arc
          const xOffset = offset * 180; // horizontal spacing in px
          const zOffset = isCenter ? 60 : isImmediate ? -40 : -140;
          const yOffset = isCenter ? -10 : Math.abs(offset) * 12;
          const rotateY = offset * -7; // subtle inward curve angle
          const scale = isCenter ? 1.15 : isImmediate ? 0.92 : 0.78;
          const opacity = isCenter ? 1 : isImmediate ? 0.75 : 0.45;
          const zIndex = isCenter ? 30 : isImmediate ? 20 : 10;

          return (
            <motion.div
              key={card.id}
              onClick={() => handleCardClick(index)}
              initial={false}
              animate={{
                x: xOffset,
                y: yOffset,
                z: zOffset,
                rotateY: rotateY,
                scale: scale,
                opacity: opacity,
              }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 24,
              }}
              style={{
                zIndex,
                transformStyle: 'preserve-3d',
              }}
              className={`absolute cursor-pointer w-[190px] h-[240px] sm:w-[220px] sm:h-[280px] md:w-[250px] md:h-[320px] transition-shadow duration-300 ${
                isCenter
                  ? 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]'
                  : 'hover:opacity-90'
              }`}
            >
              <ShowcaseCardVisual card={card} isActive={isCenter} />
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Arrows (subtle floating controls) */}
      <button
        onClick={handlePrev}
        aria-label="Previous Showcase"
        className="absolute left-2 sm:left-4 z-40 p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next Showcase"
        className="absolute right-2 sm:right-4 z-40 p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/70 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Pagination dots */}
      <div className="absolute -bottom-2 sm:bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40">
        {SHOWCASE_CARDS.map((c, i) => (
          <button
            key={c.id}
            onClick={() => handleCardClick(i)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === activeIndex
                ? 'w-6 h-1.5 bg-white'
                : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
