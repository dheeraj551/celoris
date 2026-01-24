"use client"

import React from 'react';
import { Play, Sparkles, Youtube } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { motion } from 'framer-motion';

interface VideoPostProps {
    category: string;
    title: string;
    views: string;
    date: string;
    image: string;
    duration: string;
    author: string;
    youtube_url: string;
}

const VideoCard: React.FC<VideoPostProps> = ({ category, title, views, date, image, duration, author, youtube_url }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="group cursor-pointer"
    >
        <a href={youtube_url} target="_blank" rel="noopener noreferrer" className="block">
            {/* Thumbnail Container */}
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-[#0d1321] mb-5 border border-white/5 shadow-3xl group-hover:border-emerald-500/30 transition-all duration-500">
                <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-80" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/40 transition-all duration-500 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center pl-1 shadow-3xl shadow-emerald-500/50">
                            <Play size={16} className="text-white fill-white" />
                        </div>
                    </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-4 right-4 bg-[#050810]/80 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black text-white tracking-widest border border-white/5">
                    {duration}
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-emerald-500/90 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border border-emerald-500/20 italic">
                    {category}
                </div>
            </div>

            {/* Content */}
            <div className="flex gap-4 px-2">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 overflow-hidden flex items-center justify-center">
                        <img
                            src={`https://ui-avatars.com/api/?name=${author}&background=10b981&color=fff&size=80`}
                            alt={author}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <h3 className="font-black text-white text-base leading-tight mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors italic uppercase tracking-tighter">
                        {title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                        <span>{author}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700" />
                        <span>{views} Syncs</span>
                    </div>
                </div>
            </div>
        </a>
    </motion.div>
);

export const Blog = ({ initialVideos = null }: { initialVideos?: any[] | null }) => {
    const hardcodedPosts = [
        {
            category: "Tutorial",
            title: "LangChain in Action: Real Workflows | Master LLM Orchestration",
            views: "1.2K",
            date: "2025",
            author: "Celoris Team",
            duration: "12:00",
            image: "https://img.youtube.com/vi/-Z1P-ebnfwQ/maxresdefault.jpg",
            youtube_url: "https://youtu.be/-Z1P-ebnfwQ"
        },
        {
            category: "Education",
            title: "Building Model-Native Agent Systems (End-to-End)",
            views: "1.2K",
            date: "2025",
            author: "Celoris Team",
            duration: "08:00",
            image: "https://img.youtube.com/vi/MoZQeCYorns/maxresdefault.jpg",
            youtube_url: "https://youtu.be/MoZQeCYorns"
        },
        {
            category: "Education",
            title: "Sovereign Intelligence: Private & Local AI Knowledge Base",
            views: "850+",
            date: "2025",
            author: "Celoris Team",
            duration: "06:00",
            image: "https://img.youtube.com/vi/v5O_K6z2vEY/maxresdefault.jpg",
            youtube_url: "https://youtu.be/v5O_K6z2vEY"
        }
    ];

    const [posts, setPosts] = React.useState<any[]>(hardcodedPosts);

    React.useEffect(() => {
        // If we want to merge with DB later, we could, but for now we follow the "no role of backend" instruction
        if (initialVideos && initialVideos.length > 0) {
            const dbPosts = initialVideos
                .map((v: any) => ({
                    category: v.category,
                    title: v.title,
                    views: `${v.views_count > 1000 ? (v.views_count / 1000).toFixed(1) + 'K' : v.views_count}`,
                    date: new Date(v.created_at).toLocaleDateString(),
                    author: v.author,
                    duration: v.duration,
                    image: v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_url.split('v=')[1]?.split('?')[0]}/maxresdefault.jpg`,
                    youtube_url: v.youtube_url
                }))
                .filter(p => !p.youtube_url.includes("-Z1P-ebnfwQ") && !p.title.toLowerCase().includes("excel"));

            setPosts([hardcodedPosts[0], ...dbPosts].slice(0, 6));
        }
    }, [initialVideos]);

    return (
        <div className="mt-24 md:mt-32">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between mb-12 px-4"
            >
                <div>
                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                        <Sparkles size={12} /> Visual Transmissions
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter">Featured Videos</h2>
                    <div className="h-1 w-16 bg-emerald-600 rounded-full mt-3 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                </div>
                <a
                    href="https://www.youtube.com/@celorisacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 text-slate-300 rounded-2xl hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-widest italic"
                >
                    <Youtube size={16} className="text-red-500 shrink-0" />
                    Watch YouTube
                </a>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map((post, idx) => (
                    <VideoCard key={idx} {...post} />
                ))}
            </div>
        </div>
    );
};
