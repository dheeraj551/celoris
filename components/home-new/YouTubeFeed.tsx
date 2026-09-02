"use client";

import React from 'react';
import Script from 'next/script';
import { MoreVertical, ChevronRight, Instagram } from 'lucide-react';

// Placeholder data - you can easily swap these out when you receive the actual YouTube links/data from the user
export const MOCK_REELS = [
  {
    id: "r1",
    title: "How to Build Your Training Business on Celoris ✨🚀",
    embedUrl: "https://www.youtube.com/embed/7I10NZmVTfY",
    thumbnail: "https://images.unsplash.com/photo-1611224885990-ab73ec3478cc?w=300&h=500&fit=crop",
    views: "5.4k views",
  },
  {
    id: "r2",
    title: "Behind the scene of 3D Modeling 🛠️✨",
    embedUrl: "https://www.youtube.com/embed/-DF758qpV7c",
    thumbnail: "https://images.unsplash.com/photo-1626379953822-baec19c3bbcd?w=300&h=500&fit=crop",
    views: "2.5k views",
  },
  {
    id: "r3",
    title: "New update in Image Studio! 🚀🔥",
    embedUrl: "https://www.youtube.com/embed/oyikFVltqII",
    thumbnail: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300&h=500&fit=crop",
    views: "890 views",
  },
  {
    id: "r4",
    title: "Join our Community! 🤝✨ #Creators",
    embedUrl: "https://www.youtube.com/embed/8QoLDjrkprI",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=500&fit=crop",
    views: "3.1k views",
  },
  {
    id: "r5",
    title: "Cinematic AI Generation tutorial 🎬🤖",
    embedUrl: "https://www.youtube.com/embed/1OvbFB9Vcac",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=500&fit=crop",
    views: "1.7k views",
  }
];

export function YouTubeFeed() {
  const [activeTab, setActiveTab ] = React.useState<'youtube' | 'instagram'>('youtube');
  const reelsScrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300;
      ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full text-white font-sans py-12 mt-8 mb-12">
      <Script src="//www.instagram.com/embed.js" strategy="afterInteractive" />
      
      {/* Instagram Reels Section */}
      <div className="relative w-full rounded-[2.5rem] bg-[#0a0a0a] border border-pink-900/30 overflow-hidden shadow-[0_0_100px_rgba(236,72,153,0.05)] p-8 md:p-12 mb-12">
        {/* Background Dot Grid */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(236,72,153,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[radial-gradient(circle,rgba(236,72,153,0.15)_2px,transparent_2px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-pink-600/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Instagram className="w-6 h-6 text-pink-500" />
            Trending Reels
          </h2>

          <div className="relative group/section">
            <div 
              ref={reelsScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x"
            >
            {MOCK_REELS.map((reel) => (
              <div key={reel.id} className="flex-shrink-0 w-[220px] md:w-[280px] snap-start cursor-pointer group">
                <div className="relative w-full aspect-[4/5] md:aspect-[9/16] rounded-2xl overflow-hidden mb-4 bg-black/50 pointer-events-auto shadow-2xl border border-white/5">
                  {(reel as any).embedUrl ? (
                    <iframe
                      src={(reel as any).embedUrl}
                      title={reel.title}
                      frameBorder="0"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <img src={reel.thumbnail} alt={reel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                  )}
                  {/* Overlay for better mobile touch */}
                  <div className="absolute inset-0 bg-transparent z-10 pointer-events-none" />
                </div>
                <div className="relative pr-6">
                  <button className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll(reelsScrollRef, 'right')}
            className="absolute right-0 top-[40%] -translate-y-1/2 w-10 h-10 bg-[#212121] hover:bg-[#3d3d3d] text-white rounded-full flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity shadow-lg z-20 hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
