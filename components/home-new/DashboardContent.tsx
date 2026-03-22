"use client"

import React, { useState } from 'react';
import {
    Video,
    Image as ImageIcon,
    ArrowRight,
    Search,
    PlayCircle,
    Star,
    Sparkles,
    Zap,
    X,
    Clock,
    BrainCircuit,
    Globe,
    Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { YouTubeFeed } from './YouTubeFeed';
import { CommunityFeed } from './CommunityFeed';

interface DashboardContentProps {
    courses?: any[];
}

export function DashboardContent({ courses }: DashboardContentProps) {
    const [activeTab, setActiveTab] = useState<'video' | 'image'>('video');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModelSelect, setShowModelSelect] = useState(false);
    const [selectedModel, setSelectedModel] = useState({ name: 'Groq Llama 3.1', provider: 'Meta', isPremium: false });

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
                        India's Free Creative <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Studio</span>
                    </h1>
                </div>
            )}

            {/* Chat History Section */}
            {messages.length > 0 && (
                <div className="max-w-4xl mx-auto mb-8 space-y-6">
                    {messages.map((m: any, idx: number) => (
                        <div key={idx} className={cn(
                            "flex flex-col gap-2 p-6 rounded-[2rem] border",
                            m.role === 'user'
                                ? "bg-white/5 border-white/5 ml-auto max-w-[80%]"
                                : "bg-emerald-500/5 border-emerald-500/10 mr-auto max-w-[90%]"
                        )}>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                {m.role === 'user' ? 'You' : 'Groq Llama 3.1'}
                            </div>
                            <div className="text-white text-lg font-light leading-relaxed">
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex flex-col gap-2 p-6 rounded-[2rem] border bg-emerald-500/5 border-emerald-500/10 mr-auto max-w-[90%] animate-pulse">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                                Groq is thinking...
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

                                <button onClick={() => setShowModelSelect(true)} className="flex items-center bg-white/10 border border-white/5 rounded-full px-4 py-1.5 gap-2 hover:bg-white/20 transition-all group/btn">
                                    <Zap className="w-3 h-3 text-emerald-400 group-hover/btn:animate-pulse" />
                                    <span className="text-[10px] font-bold text-slate-200 uppercase tracking-tight">{selectedModel.name}</span>
                                </button>
                            </div>

                            {/* Right Side: Tools & Submit */}
                            <div className="flex items-center gap-3">
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

            {/* Suggestions Section 1 */}
            <div className="mb-12">
                <h2 className="text-xl font-bold text-white tracking-tight mb-6">You might want to try</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                    {/* Item 1 */}
                    <Link href="/video-studio" className="flex-shrink-0 w-[400px] h-32 bg-white/5 hover:bg-white/10 border border-white/5 p-8 rounded-card-lg transition-all relative overflow-hidden group flex items-center justify-between">
                        <span className="text-2xl font-bold text-white">Video Studio</span>
                        <div className="relative w-48 h-full flex items-center justify-center translate-x-4">
                            <img
                                src="/images/homepage/new-video-cta-transparent.png"
                                className="w-full h-full object-contain scale-150 group-hover:scale-[1.6] transition-transform duration-500"
                                alt="Video Studio icon"
                            />
                        </div>
                    </Link>

                    {/* Item 2 */}
                    <Link href="/image-studio" className="flex-shrink-0 w-80 h-32 bg-white/5 hover:bg-white/10 border border-white/5 p-4 pl-6 rounded-card-lg transition-all relative overflow-hidden group flex items-center justify-between">
                        <div className="flex-1 text-left">
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2 uppercase tracking-tight">New</span>
                            <div className="mt-1">
                                <span className="text-base font-bold text-white block leading-tight">
                                    Image Studio
                                </span>
                                <span className="text-base font-bold text-white block leading-tight">
                                    Creative Engine
                                    <Sparkles className="w-3 h-3 text-rose-500 inline-block ml-1" />
                                </span>
                            </div>
                        </div>
                        <div className="w-32 h-full flex items-center justify-center translate-x-4">
                            <img
                                src="/images/homepage/ai-video-tool-transparent.png"
                                className="w-full h-full object-contain scale-[1.4] group-hover:scale-[1.5] transition-transform duration-500"
                                alt="Image Studio"
                            />
                        </div>
                    </Link>

                    {/* Item 5 */}
                    <button className="flex-shrink-0 w-80 h-32 bg-white/5 hover:bg-white/10 border border-white/5 p-4 pl-6 rounded-3xl transition-all relative overflow-hidden group flex items-center justify-between">
                        <div className="flex-1 text-left">
                            <span className="text-base font-bold text-white block leading-tight truncate pr-2">Celoris 3D</span>
                        </div>
                        <div className="w-32 h-full flex items-center justify-center translate-x-4">
                            <img
                                src="/images/homepage/celoris-3d-character.png"
                                className="w-full h-full object-contain scale-[1.3] group-hover:scale-[1.4] transition-transform duration-500"
                                alt="Celoris 3D Character"
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* YouTube Feed Layout */}
            <YouTubeFeed />

            {/* Community Feed Section */}
            <CommunityFeed />

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>

            {/* Models Modal */}
            {showModelSelect && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-4xl bg-[#1e1f20] border border-white/10 rounded-2xl shadow-2xl flex flex-col"
                        style={{ maxHeight: '85vh' }}
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-bold text-white tracking-tight">Select a model</h2>
                            <button onClick={() => setShowModelSelect(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 relative">
                            {/* Search */}
                            <div className="relative mb-6">
                                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Explore models"
                                    className="w-full bg-[#151618] border border-white/10 rounded-full py-3 pl-12 pr-4 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent text-amber-500 border border-amber-500/20 hover:bg-amber-500/10 transition-colors text-xs font-bold uppercase tracking-wider">
                                    <span className="opacity-70">$</span> PRO
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent text-amber-500 border border-amber-500/20 hover:bg-amber-500/10 transition-colors text-xs font-bold uppercase tracking-wider">
                                    <span className="opacity-70">$$</span> MAX
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent text-slate-300 border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold">
                                    <Clock className="w-3 h-3 text-slate-500" /> Recent Picks
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent text-slate-300 border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold">
                                    <Star className="w-3 h-3 text-slate-500" /> New
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent text-amber-500 border border-amber-500/20 hover:bg-amber-500/10 transition-colors text-xs font-bold">
                                    <BrainCircuit className="w-3 h-3" /> Reasoning
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10 transition-colors text-xs font-bold">
                                    <Zap className="w-3 h-3" /> Fast
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent text-slate-300 border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold">
                                    <Globe className="w-3 h-3 text-slate-500" /> Search
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent text-slate-300 border border-white/10 hover:bg-white/5 transition-colors text-xs font-bold">
                                    <ImageIcon className="w-3 h-3 text-slate-500" /> Images
                                </button>
                            </div>

                            {/* Trending */}
                            <div className="mb-8">
                                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Trending Model Picks</h3>
                                <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
                                    {/* 1 */}
                                    <div className="flex-shrink-0 w-64 bg-transparent border border-white/10 rounded-2xl p-4 hover:border-emerald-500/30 transition-all cursor-pointer group relative overflow-hidden">
                                        <div className="absolute top-4 right-4"><Lock className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" /></div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-[#151618] flex items-center justify-center overflow-hidden p-0.5">
                                                <img src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/kimi-color.svg" alt="Kimi" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">Kimi K2.5</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#151618] flex items-center justify-center overflow-hidden p-0.5">
                                                <img src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg" alt="OpenAI" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-emerald-400">GPT-5.2 <span className="opacity-70 font-medium">(High)</span></span>
                                        </div>
                                    </div>
                                    {/* 2 */}
                                    <div className="flex-shrink-0 w-64 bg-transparent border border-white/10 rounded-2xl p-4 hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden">
                                        <div className="absolute top-4 right-4"><Lock className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" /></div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-[#151618] flex items-center justify-center overflow-hidden p-0.5">
                                                <img src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/google-color.svg" alt="Google" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">Google Imagen 4</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#151618] flex items-center justify-center overflow-hidden p-0.5">
                                                <img src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/bfl.svg" alt="FLUX" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-200 group-hover:text-white">FLUX1.1 Pro</span>
                                        </div>
                                    </div>
                                    {/* 3 */}
                                    <div onClick={() => { setSelectedModel({ name: 'Groq Llama 3.1', provider: 'Meta', isPremium: false }); setShowModelSelect(false); }} className="flex-shrink-0 w-64 bg-transparent border border-white/10 rounded-2xl p-4 hover:border-purple-500/30 transition-all cursor-pointer group relative overflow-hidden">
                                        {selectedModel.name === 'Groq Llama 3.1' && <div className="absolute top-0 right-0 p-2 opacity-50"><Zap className="w-6 h-6 text-purple-500" /></div>}
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-[#151618] flex items-center justify-center overflow-hidden p-0.5">
                                                <img src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen-color.svg" alt="Qwen" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">Qwen3.5 397B A17B</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#151618] flex items-center justify-center overflow-hidden p-0.5">
                                                <img src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini-color.svg" alt="Gemini" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-cyan-400">Gemini 3.1 Pro</span>
                                        </div>
                                    </div>
                                    {/* 4 */}
                                    <div className="flex-shrink-0 w-64 bg-transparent border border-white/10 rounded-2xl p-4 hover:border-indigo-500/30 transition-all cursor-pointer group relative overflow-hidden">
                                        <div className="absolute top-4 right-4"><Lock className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-colors" /></div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-[#151618] flex items-center justify-center overflow-hidden p-0.5">
                                                <img src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/xai.svg" alt="Grok" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">Grok 4.1 Fast</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-[#151618] flex items-center justify-center overflow-hidden p-0.5">
                                                <img src="https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek-color.svg" alt="DeepSeek" className="w-full h-full object-contain" />
                                            </div>
                                            <span className="text-sm font-bold text-blue-400">DeepSeek V3.2 <span className="text-[10px] text-amber-500 ml-1 font-black">$$</span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* All Models Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pb-8">
                                {[
                                    { title: 'GPT', by: 'OpenAI', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/openai.svg' },
                                    { title: 'Qwen', by: 'Alibaba', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/qwen-color.svg' },
                                    { title: 'Mistral', by: 'Mistral AI', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/mistral-color.svg' },
                                    { title: 'DeepSeek', by: 'DeepSeek', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/deepseek-color.svg', premium: 'PRO' },
                                    { title: 'Llama', by: 'Meta', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/meta-color.svg' },
                                    { title: 'Gemini', by: 'Google', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemini-color.svg', premium: 'MAX' },
                                    { title: 'Claude', by: 'Anthropic', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/claude-color.svg', premium: 'MAX' },
                                    { title: 'GLM', by: 'Z.ai', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/glmv-color.svg' },
                                    { title: 'Kimi', by: 'Moonshot AI', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/kimi-color.svg' },
                                    { title: 'MiniMax', by: 'MiniMax AI', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/minimax-color.svg' },
                                    { title: 'FLUX', by: 'Black Forest Labs', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/bfl.svg' },
                                    { title: 'Grok', by: 'xAI', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/xai.svg', premium: 'PRO' },
                                    { title: 'Gemma', by: 'Google', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/gemma-color.svg' },
                                    { title: 'Nova', by: 'Amazon', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/bedrock-color.svg' },
                                    { title: 'Command', by: 'Cohere', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/commanda-color.svg' },
                                    { title: 'Nemotron', by: 'NVIDIA', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/nvidia-color.svg', premium: 'PRO' },
                                    { title: 'ERNIE', by: 'Baidu', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/baidu-color.svg' },
                                    { title: 'Imagen', by: 'Google', iconUrl: 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons/google-color.svg' },
                                ].map((provider: any, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => { setSelectedModel({ name: provider.title, provider: provider.by, isPremium: !!provider.premium }); setShowModelSelect(false); }}
                                        className="flex items-center justify-between px-4 py-3 rounded-2xl bg-transparent border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-[#151618] flex items-center justify-center overflow-hidden p-1.5">
                                                <img src={provider.iconUrl} alt={provider.title} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="text-left flex flex-col items-start leading-tight">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{provider.title}</span>
                                                    {provider.title !== 'Llama' && <Lock className="w-3 h-3 text-slate-500 group-hover:text-amber-500 transition-colors" />}
                                                </div>
                                                <span className="text-[10px] text-slate-500">by {provider.by}</span>
                                            </div>
                                        </div>
                                        {provider.premium && (
                                            <div className="flex items-center px-1.5 py-0.5 text-amber-500 text-[10px] font-bold">
                                                <span>{provider.premium === 'MAX' ? '$$ MAX' : '$ PRO'}</span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div >
    );
}
