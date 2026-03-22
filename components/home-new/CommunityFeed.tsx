"use client";

import React from 'react';
import { Heart, MessageCircle, UserPlus, Share2, Sparkles, Box, Palette, Zap, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const COMMUNITY_POSTS = [
    {
        id: "p1",
        creator: "Aman Singh",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        title: "Neon Delhi 2077",
        image: "/images/community/neon-delhi-2077.jpg",
        likes: "1.2k",
        comments: "84",
        tool: "Image Studio",
        toolIcon: <Palette className="w-3 h-3" />
    },
    {
        id: "p2",
        creator: "Priya Sharma",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        title: "Traditional Madhubani Art",
        image: "/images/community/traditional-madhubani-art.jpg",
        likes: "3.4k",
        comments: "156",
        tool: "Vernacular AI",
        toolIcon: <Sparkles className="w-3 h-3" />
    },
    {
        id: "p3",
        creator: "Rahul Verma",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        title: "Isometric Gaming Room",
        image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=600&h=800&fit=crop",
        embed: "https://sketchfab.com/models/7811a14a0e7e4459b5dd26bd4a5e97c2/embed",
        likes: "920",
        comments: "42",
        tool: "Celoris 3D",
        toolIcon: <Box className="w-3 h-3" />
    },
    {
        id: "p4",
        creator: "Sneha Kapoor",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
        title: "Cyberpunk Bollywood",
        image: "/images/community/cyberpunk-bollywood.jpg",
        likes: "2.1k",
        comments: "98",
        tool: "Image Studio",
        toolIcon: <Palette className="w-3 h-3" />
    },
    {
        id: "p5",
        creator: "Vikram Das",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
        title: "Modern Minimalist Interior",
        image: "https://images.unsplash.com/photo-1616489953149-755e37604d53?w=600&h=800&fit=crop",
        embed: "https://sketchfab.com/models/145684ac3b9b457f88ff2798acdb4306/embed",
        likes: "1.5k",
        comments: "67",
        tool: "Celoris 3D",
        toolIcon: <Box className="w-3 h-3" />
    }
];

export function CommunityFeed() {
    const scrollRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = 400;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full text-white font-sans py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                        <Users className="w-6 h-6 text-cyan-400" />
                        Community Creations
                    </h2>
                    <p className="text-sm text-slate-500 font-medium italic">Discover what others are building with Celoris AI</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="hidden md:flex text-slate-400 hover:text-white hover:bg-white/5 rounded-full px-4 font-bold uppercase tracking-widest text-[10px]">
                        View Global Feed
                    </Button>
                </div>
            </div>

            <div className="relative group/section">
                {/* Left Navigation Arrow */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute -left-4 top-[45%] -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-cyan-500/20 text-white rounded-full flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity shadow-2xl z-20 hidden md:flex hover:border-cyan-500/50"
                >
                    <ChevronLeft className="w-6 h-6 text-cyan-400" />
                </button>

                <div 
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x"
                >
                    {COMMUNITY_POSTS.map((post) => (
                        <div 
                            key={post.id} 
                            className="flex-shrink-0 w-[280px] md:w-[320px] snap-start bg-[#0a0f1d] rounded-[2.5rem] border border-white/5 hover:border-cyan-500/30 transition-all duration-500 overflow-hidden shadow-2xl group/card"
                        >
                            {/* Card Header */}
                            <div className="p-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={post.avatar} alt={post.creator} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-[#0a0f1d] flex items-center justify-center">
                                            <Zap className="w-2 h-2 text-white fill-current" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-none mb-1">{post.creator}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Verified Creator</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10">
                                    <UserPlus className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Main Image or Embed */}
                            <div className="relative aspect-[4/5] overflow-hidden bg-black/40">
                                {(post as any).embed ? (
                                    <iframe 
                                        src={(post as any).embed}
                                        title={post.title}
                                        className="w-full h-full border-0"
                                        allow="autoplay; fullscreen; xr-spatial-tracking"
                                    />
                                ) : (
                                    <img 
                                        src={post.image} 
                                        alt={post.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" 
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                
                                {/* Tool Badge */}
                                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2">
                                        <span className="text-cyan-400">{post.toolIcon}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
                                            {post.tool}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="p-6">
                                <h3 className="text-base font-bold text-white mb-4 line-clamp-1 italic">
                                    "{post.title}"
                                </h3>
                                
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button className="flex items-center gap-1.5 text-slate-400 hover:text-rose-500 transition-colors group/btn">
                                            <Heart className="w-4 h-4 group-hover/btn:fill-current" />
                                            <span className="text-xs font-bold">{post.likes}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors">
                                            <MessageCircle className="w-4 h-4" />
                                            <span className="text-xs font-bold">{post.comments}</span>
                                        </button>
                                    </div>
                                    <button className="text-slate-500 hover:text-white transition-colors">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Navigation Arrow */}
                <button 
                    onClick={() => scroll('right')}
                    className="absolute -right-4 top-[45%] -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-md border border-white/10 hover:bg-cyan-500/20 text-white rounded-full flex items-center justify-center opacity-0 group-hover/section:opacity-100 transition-opacity shadow-2xl z-20 hidden md:flex hover:border-cyan-500/50"
                >
                    <ChevronRight className="w-6 h-6 text-cyan-400" />
                </button>

                <style jsx global>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </div>
    );
}
