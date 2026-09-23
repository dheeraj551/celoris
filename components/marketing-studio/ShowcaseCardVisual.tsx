"use client"

import React, { useRef, useEffect, useState } from 'react';
import { CarouselCard } from './marketingStudioData';
import { Box, Play, Megaphone, Layout, ShoppingBag } from 'lucide-react';

interface ShowcaseCardVisualProps {
  card: CarouselCard;
  isActive: boolean;
}

export function ShowcaseCardVisual({ card, isActive }: ShowcaseCardVisualProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    }
  }, [card.videoUrl]);

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Box':
        return <Box className="w-3 h-3" />;
      case 'Play':
        return <Play className="w-3 h-3 fill-current" />;
      case 'Megaphone':
        return <Megaphone className="w-3 h-3" />;
      case 'Layout':
        return <Layout className="w-3 h-3" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-3 h-3" />;
      default:
        return <Box className="w-3 h-3" />;
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl select-none group bg-black/80">
      {/* 1. Main Video Element */}
      {!videoError && card.videoUrl ? (
        <video
          ref={videoRef}
          src={card.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onError={() => setVideoError(true)}
          className="w-full h-full object-cover select-none pointer-events-none transform scale-[1.01]"
        />
      ) : (
        /* Fallback placeholder background if video cannot be loaded */
        <div className={`w-full h-full bg-gradient-to-b ${card.bgGradient} flex items-center justify-center p-4`}>
          <div className="text-center">
            <span className="text-2xl font-black text-white/90 uppercase tracking-tight font-sans">
              {card.title}
            </span>
          </div>
        </div>
      )}

      {/* 2. Ambient Bottom Gradient for Badge Contrast */}
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />

      {/* 3. Bottom Pill Badge matching the screenshot */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg transition-colors">
          {renderBadgeIcon(card.badgeIcon)}
          <span>{card.badge}</span>
        </span>
      </div>

      {/* 4. Active Card Glowing Border & Sheen */}
      {isActive && (
        <div className="absolute inset-0 rounded-2xl ring-2 ring-white/80 pointer-events-none shadow-[inset_0_0_25px_rgba(255,255,255,0.2),0_0_30px_rgba(212,255,0,0.25)]" />
      )}
    </div>
  );
}
