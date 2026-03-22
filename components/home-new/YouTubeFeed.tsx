"use client";

import React from 'react';
import Script from 'next/script';
import { MoreVertical, ChevronRight, Box, Instagram } from 'lucide-react';

// Placeholder data - you can easily swap these out when you receive the actual YouTube links/data from the user
export const MOCK_VIDEOS = [
  {
    id: "1",
    title: "Low Poly City",
    embedUrl: "https://sketchfab.com/models/c5f3bb50fed947e8891b236bc85b4f7d/embed",
    thumbnail: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=338&fit=crop",
    channelAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop",
    duration: "3D",
    views: "2.1k views",
    time: "2 days ago",
    tag: "3D Model"
  },
  {
    id: "2",
    title: "Tiny Isometric Room",
    embedUrl: "https://sketchfab.com/models/6db0b351424141099e30834c6115f40a/embed",
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=338&fit=crop",
    channelAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
    duration: "3D",
    views: "5 views",
    time: "3 weeks ago",
    tag: "3D Model"
  },
  {
    id: "3",
    title: "Tomb Raider Laracroft",
    embedUrl: "https://sketchfab.com/models/3da7952b31484ea88a6c8edd371b40ad/embed",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=338&fit=crop",
    channelAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
    duration: "3D",
    views: "3 views",
    time: "3 weeks ago",
    tag: "3D Model"
  }
];

export const MOCK_SHORTS = [
  {
    id: "s1",
    title: "The Ultimate Purple Power Look! 💜✨...",
    embedUrl: "https://www.youtube.com/embed/MeZBi_BXKzw",
    thumbnail: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=300&h=500&fit=crop",
    views: "823 views",
    time: "14 hours ago",
  },
  {
    id: "s2",
    title: "Saree Vibes & Rap Beats! ✨💃 #shorts ...",
    embedUrl: "https://www.youtube.com/embed/6jT2OQo9Cms",
    thumbnail: "https://images.unsplash.com/photo-1583391733958-d25e07fac04f?w=300&h=500&fit=crop",
    views: "865 views",
    time: "23 hours ago",
  },
  {
    id: "s3",
    title: "Chann Ke Mohalla 💫 Traditional Grace ...",
    embedUrl: "https://www.youtube.com/embed/yQo_XP23ZqY",
    thumbnail: "https://images.unsplash.com/photo-1605656510800-cb64c126d40f?w=300&h=500&fit=crop",
    views: "64 views",
    time: "2 days ago",
  },
  {
    id: "s4",
    title: "Real Life Princess ✨ #shorts #trending ...",
    embedUrl: "https://www.youtube.com/embed/1hwLsJwEsHk",
    thumbnail: "https://images.unsplash.com/photo-1595954605944-7f62e6005d5e?w=300&h=500&fit=crop",
    views: "93 views",
    time: "3 days ago",
  },
  {
    id: "s5",
    title: "Husband vs Neighbor Who won 😂",
    embedUrl: "https://www.youtube.com/embed/riV19LoJAp4",
    thumbnail: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=300&h=500&fit=crop",
    views: "921 views",
    time: "3 days ago",
  },
  {
    id: "s6",
    title: "POV You're the cutest 3D character ever! ✨ ...",
    embedUrl: "https://www.youtube.com/embed/nthGqWrIzyM",
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=500&fit=crop",
    views: "789 views",
    time: "4 days ago",
  }
];

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
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const shortsScrollRef = React.useRef<HTMLDivElement>(null);
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
      
      {/* Videos Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Box className="w-6 h-6 text-emerald-500" />
          Celoris 3D
        </h2>
        
        <div className="relative group/section">
          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x"
          >
            {MOCK_VIDEOS.map((video) => (
              <div key={video.id} className="flex-shrink-0 w-[280px] md:w-[320px] snap-start cursor-pointer group">
                {/* Thumbnail */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-3 border border-white/5 bg-black/50 pointer-events-auto">
                  {(video as any).embedUrl ? (
                      <iframe 
                        title={video.title} 
                        frameBorder="0" 
                        allowFullScreen 
                        allow="autoplay; fullscreen; xr-spatial-tracking" 
                        src={(video as any).embedUrl}
                        className="w-full h-full"
                      />
                  ) : (
                      <>
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                          <div className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[11px] font-medium tracking-wide">
                            {video.duration}
                          </div>
                      </>
                  )}
                </div>
                
                {/* Info Container */}
                <div className="flex gap-3">
                  {/* Channel Avatar */}
                  <div className="flex-shrink-0 mt-1">
                    <img src={video.channelAvatar} alt="channel" className="w-9 h-9 rounded-full object-cover" />
                  </div>
                  
                  {/* Text Info */}
                  <div className="flex-1 pr-6 relative">
                    <h3 className="text-[15px] font-semibold line-clamp-2 leading-snug group-hover:text-cyan-400 text-slate-100 transition-colors">
                      {video.title}
                    </h3>
                    <div className="text-[13px] text-slate-400 mt-1 flex flex-col gap-0.5">

                      {video.tag && (
                        <div>
                          <span className="inline-block bg-blue-500/20 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5">
                            {video.tag}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Menu dots */}
                    <button className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll(scrollRef, 'right')}
            className="absolute right-0 top-[35%] -translate-y-1/2 w-10 h-10 bg-[#212121] hover:bg-[#3d3d3d] text-white rounded-full flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity shadow-lg z-10 hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/10 mb-8" />

      {/* Shorts Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          {/* YouTube Shorts Logo SVG Path */}
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-500 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.77,10.32l-1.2-.5L18,9.06a3.74,3.74,0,0,0-1.34-5.32,3.8,3.8,0,0,0-5.18,1.43L8.13,11a3.75,3.75,0,0,0,1.35,5.32c.17.1.34.18.52.25l1.2.5-1.42.76a3.74,3.74,0,0,0,1.34,5.32,3.8,3.8,0,0,0,5.18-1.43l3.35-5.87h0A3.75,3.75,0,0,0,17.77,10.32ZM10.53,14.65V9.41l4.24,2.62Z"/>
          </svg>
          Animated Shorts
        </h2>

        <div className="relative group/section">
          <div 
            ref={shortsScrollRef}
            className="flex gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth snap-x"
          >
            {MOCK_SHORTS.map((short) => (
              <div key={short.id} className="flex-shrink-0 w-[160px] md:w-[200px] snap-start cursor-pointer group">
                <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden mb-3 bg-black/50 pointer-events-auto">
                  {(short as any).embedUrl ? (
                    <iframe
                      src={(short as any).embedUrl}
                      title={short.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : (
                    <img src={short.thumbnail} alt={short.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
                  )}
                </div>
                <div className="relative pr-6">
                  <h3 className="text-sm font-semibold line-clamp-2 leading-snug group-hover:text-cyan-400 text-slate-100 transition-colors">
                    {short.title}
                  </h3>

                  <button className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full text-slate-400">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => scroll(shortsScrollRef, 'right')}
            className="absolute right-0 top-[40%] -translate-y-1/2 w-10 h-10 bg-[#212121] hover:bg-[#3d3d3d] text-white rounded-full flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity shadow-lg z-10 hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/10 my-10" />

      {/* Instagram Reels Section */}
      <div>
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
  );
}
