"use client"

import React, { useState } from 'react';
import {
    Video,
    Image as ImageIcon,
    Plus,
    AtSign,
    MapPin,
    Layout,
    Languages,
    Calendar,
    ArrowRight,
    Search,
    ChevronRight,
    TrendingUp,
    Camera,
    PlayCircle,
    ShoppingBag,
    Star,
    Sparkles,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface DashboardContentProps {
    courses?: any[];
}

export function DashboardContent({ courses }: DashboardContentProps) {
    const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        const assistantMessage = { role: 'assistant', content: '' };
        setMessages(prev => [...prev, assistantMessage]);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) throw new Error("Failed to fetch stream");

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);

                    // We'll skip complex tool data parsing for the home dashboard for now
                    // to keep it simple, or we can add it if needed.
                    // Home dashboard usually doesn't show the tool results cards yet.
                    const cleanChunk = chunk.replace(/__DATA__.*?__END_DATA__\n?/, '');
                    fullContent += cleanChunk;

                    setMessages(prev => {
                        const updated = [...prev];
                        updated[updated.length - 1] = {
                            role: 'assistant',
                            content: fullContent
                        };
                        return updated;
                    });
                }
            }
        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: 'assistant',
                    content: "I'm sorry, I encountered an error. Please try again later."
                };
                return updated;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="py-16 px-8 max-w-6xl mx-auto">
            {/* Hero Title - Hide if there are messages */}
            {messages.length === 0 && (
                <div className="text-center mb-16 pt-10 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
                    <h1 className="text-4xl md:text-6xl font-medium tracking-tight text-white mb-6">
                        Welcome to Celoris <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Designs</span>
                    </h1>
                </div>
            )}

            {/* Chat History Section */}
            {messages.length > 0 && (
                <div className="max-w-4xl mx-auto mb-8 space-y-6">
                    {messages.map((m, idx) => (
                        <div key={idx} className={cn(
                            "flex flex-col gap-2 p-6 rounded-[2rem] border",
                            m.role === 'user'
                                ? "bg-white/5 border-white/5 ml-auto max-w-[80%]"
                                : "bg-emerald-500/5 border-emerald-500/10 mr-auto max-w-[90%]"
                        )}>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                {m.role === 'user' ? 'You' : 'Gemini 3.1 Pro'}
                            </div>
                            <div className="text-white text-lg font-light leading-relaxed">
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex flex-col gap-2 p-6 rounded-[2rem] border bg-emerald-500/5 border-emerald-500/10 mr-auto max-w-[90%] animate-pulse">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                                Gemini is thinking...
                            </div>
                            <div className="h-4 w-48 bg-white/10 rounded-full" />
                        </div>
                    )}
                </div>
            )}

            <div className="max-w-4xl mx-auto mb-20">
                <div className="relative group overflow-hidden rounded-[2rem]">
                    {/* Animated Border Beam */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-border-beam opacity-50 z-10" />

                    {/* Input Container */}
                    <div className="relative bg-[#1e1f20] border border-white/5 rounded-[2rem] shadow-2xl transition-all duration-500 focus-within:border-emerald-500/30 focus-within:bg-[#282a2d] p-6 pb-4 z-0">
                        <div className="text-[11px] font-medium text-slate-500 mb-4 px-2 uppercase tracking-widest">
                            Describe your idea
                        </div>
                        <textarea
                            className="w-full h-32 bg-transparent text-xl text-white placeholder:text-slate-600 resize-none focus:outline-none px-2 font-light"
                            placeholder="Tell me what you want to create..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />

                        {/* Bottom Controls Area */}
                        <div className="flex items-center justify-between mt-4">
                            {/* Left Side: Type/Model Selector */}
                            <div className="flex items-center gap-2">
                                <div className="flex bg-black/30 backdrop-blur-md p-1 rounded-full border border-white/5">
                                    <button
                                        onClick={() => setActiveTab('video')}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeTab === 'video' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <Video className="w-3 h-3" />
                                        Video
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('image')}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${activeTab === 'image' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <ImageIcon className="w-3 h-3" />
                                        Image
                                    </button>
                                </div>

                                <div className="h-4 w-px bg-white/10 mx-1" />

                                <button className="flex items-center bg-white/10 border border-white/5 rounded-full px-4 py-1.5 gap-2 hover:bg-white/20 transition-all group/btn">
                                    <Zap className="w-3 h-3 text-emerald-400 group-hover/btn:animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-200 uppercase tracking-tight">Gemini 3.1 Pro</span>
                                </button>
                            </div>

                            {/* Right Side: Tools & Submit */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
                                    <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                    <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors">
                                        <AtSign className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={handleSend}
                                    disabled={isLoading || !input.trim()}
                                    className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center transition-all border",
                                        input.trim() && !isLoading
                                            ? "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-105"
                                            : "bg-white/5 text-slate-700 border-white/5 cursor-not-allowed"
                                    )}
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-6 h-6" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Popular Features Section */}
            <div className="mb-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-white italic uppercase tracking-tight">Popular features</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {[
                        { title: "AI talking photo", icon: Camera, color: "bg-amber-500/10", iconColor: "text-amber-500" },
                        { title: "Avatar video", icon: PlayCircle, color: "bg-blue-500/10", iconColor: "text-blue-500" },
                        { title: "Product photo", icon: ShoppingBag, color: "bg-green-500/10", iconColor: "text-green-500" },
                        { title: "Vibe marketing", icon: TrendingUp, color: "bg-purple-500/10", iconColor: "text-purple-500", beta: true },
                        { title: "Product showcase", icon: Star, color: "bg-orange-500/10", iconColor: "text-orange-500" },
                    ].map((feature, i) => (
                        <button key={i} className="flex-shrink-0 bg-white/5 border border-white/5 p-4 rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all text-left flex items-center gap-4 group">
                            <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", feature.color)}>
                                <feature.icon className={cn("w-6 h-6", feature.iconColor)} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xs font-bold text-white truncate italic uppercase">{feature.title}</h3>
                                    {feature.beta && <span className="bg-emerald-600 text-white text-[8px] px-1 rounded">Beta</span>}
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold group-hover:text-emerald-400 italic">Try it now ↗</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Feed Section */}
            <div>
                <div className="flex items-center gap-8 border-b border-white/5 mb-8">
                    <button className="pb-4 border-b-2 border-emerald-500 text-white text-sm font-bold uppercase italic">Trending on Internet</button>
                    <button className="pb-4 text-sm font-bold text-slate-500 hover:text-white uppercase italic">Image inspiration</button>
                    <div className="ml-auto">
                        <button className="text-[11px] font-bold text-emerald-500 border border-emerald-500/20 px-4 py-1.5 rounded-full hover:bg-emerald-500/10 transition-colors uppercase italic">More inspirations</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {(courses || [1, 2, 3, 4, 5, 6]).map((item: any, i) => (
                        <div key={i} className="aspect-[3/4] bg-white/5 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 shadow-none hover:shadow-2xl hover:shadow-emerald-500/10 transition-all">
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col justify-end p-3">
                                <p className="text-[10px] text-white font-bold mb-1 truncate">{item.title || "AI Generated Marvel"}</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-white/20" />
                                    <span className="text-[8px] text-white font-medium">User #854</span>
                                </div>
                            </div>
                            {i === 0 ? (
                                <iframe
                                    src="https://www.youtube.com/embed/4eJcMyJFJnk?autoplay=1&mute=1&loop=1&playlist=4eJcMyJFJnk&controls=0"
                                    className="w-full h-full object-cover pointer-events-none"
                                    allow="autoplay; encrypted-media"
                                    title="AI Video Sample 1"
                                />
                            ) : i === 1 ? (
                                <iframe
                                    src="https://www.youtube.com/embed/nm2heuHYNM0?autoplay=1&mute=1&loop=1&playlist=nm2heuHYNM0&controls=0"
                                    className="w-full h-full object-cover pointer-events-none"
                                    allow="autoplay; encrypted-media"
                                    title="AI Video Sample 2"
                                />
                            ) : i === 2 ? (
                                <iframe
                                    src="https://www.youtube.com/embed/hQs4kJ00Rm4?autoplay=1&mute=1&loop=1&playlist=hQs4kJ00Rm4&controls=0"
                                    className="w-full h-full object-cover pointer-events-none"
                                    allow="autoplay; encrypted-media"
                                    title="AI Video Sample 3"
                                />
                            ) : i === 3 ? (
                                <iframe
                                    src="https://www.youtube.com/embed/zUoOvsjw4Bk?autoplay=1&mute=1&loop=1&playlist=zUoOvsjw4Bk&controls=0"
                                    className="w-full h-full object-cover pointer-events-none"
                                    allow="autoplay; encrypted-media"
                                    title="AI Video Sample 4"
                                />
                            ) : i === 4 ? (
                                <iframe
                                    src="https://www.youtube.com/embed/mZ-zhxOtzoI?autoplay=1&mute=1&loop=1&playlist=mZ-zhxOtzoI&controls=0"
                                    className="w-full h-full object-cover pointer-events-none"
                                    allow="autoplay; encrypted-media"
                                    title="AI Video Sample 5"
                                />
                            ) : i === 5 ? (
                                <iframe
                                    src="https://www.youtube.com/embed/OmGoSgGV7CM?autoplay=1&mute=1&loop=1&playlist=OmGoSgGV7CM&controls=0"
                                    className="w-full h-full object-cover pointer-events-none"
                                    allow="autoplay; encrypted-media"
                                    title="AI Video Sample 6"
                                />
                            ) : (
                                <img
                                    src={`https://images.unsplash.com/photo-${1600000000000 + (i * 100000)}?w=400&h=600&fit=crop`}
                                    className="w-full h-full object-cover"
                                    alt="sample"
                                />
                            )}
                            <div className="absolute top-2 left-2 z-20">
                                <span className="bg-black/50 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
                                    <Video className="w-2 h-2" /> AI Video
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div >
    );
}
