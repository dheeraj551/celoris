"use client"

import React, { useState, useEffect } from 'react';
import {
    Video,
    Users,
    Shapes,
    Music,
    Type,
    Languages,
    FileSearch,
    Star,
    ArrowRightLeft,
    Wind,
    Briefcase,
    Grid2X2,
    UploadCloud,
    Search,
    SlidersHorizontal,
    Monitor,
    Smartphone,
    Play,
    SkipBack,
    SkipForward,
    Mic,
    Scissors,
    Plus,
    Minus,
    Maximize2,
    Download,
    Undo2,
    Redo2,
    Settings,
    HelpCircle,
    ChevronDown,
    Cloud,
    FolderOpen,
    Eraser,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SIDEBAR_ITEMS = [
    { id: 'media', icon: Video, label: 'Media' },
    { id: 'models', icon: Users, label: 'Templates' },
    { id: 'elements', icon: Shapes, label: 'Elements' },
    { id: 'audio', icon: Music, label: 'Audio' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'captions', icon: Languages, label: 'Captions' },
    { id: 'transcript', icon: FileSearch, label: 'Transcript' },
    { id: 'effects', icon: Star, label: 'Effects' },
    { id: 'transitions', icon: ArrowRightLeft, label: 'Transitions' },
    { id: 'filters', icon: Wind, label: 'Filters' },
    { id: 'brand', icon: Briefcase, label: 'Brand Kit' },
    { id: 'extensions', icon: Grid2X2, label: 'Extensions' },
];

const ASSETS = [
    { id: 1, duration: '00:28', thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=200&h=300&fit=crop', name: '202602211532.mp4' },
    { id: 2, duration: '00:14', thumbnail: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=300&fit=crop', name: 'kling_20260213_M...' },
    { id: 3, duration: '00:16', thumbnail: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&h=300&fit=crop', name: 'kling_20260212_M...' },
    { id: 4, duration: '00:12', thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=300&fit=crop', name: '20240820154600...' },
    { id: 5, duration: '00:30', thumbnail: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop', name: '640245658_8995...' },
    { id: 6, duration: '00:22', thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&h=300&fit=crop', name: 'IKN6ZM08-7IRL-C...' },
];

export default function VideoStudio() {
    const [activeTab, setActiveTab] = useState('media');
    const [zoom, setZoom] = useState(100);
    const [currentTime, setCurrentTime] = useState('00:00:00');
    const [duration] = useState('00:00:00');

    return (
        <div className="h-screen w-full bg-[#f8f9fa] text-slate-800 flex font-sans overflow-hidden">

            {/* Left Sidebar (Dark) */}
            <div className="w-[72px] bg-[#000000] flex flex-col items-center py-2 shrink-0 z-30">
                <div className="w-10 h-10 mb-4 flex items-center justify-center p-1">
                    <img src="/celoris-logo.png" alt="Celoris" className="w-8 h-8 object-contain" />
                </div>

                <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center">
                    {SIDEBAR_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full py-3 flex flex-col items-center gap-1 transition-colors relative group ${activeTab === item.id ? 'text-white' : 'text-[#888888] hover:text-white'
                                }`}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#00c4cc] rounded-r-full"
                                />
                            )}
                            <item.icon className="w-5 h-5 mb-0.5" />
                            <span className="text-[9px] font-medium leading-tight text-center px-1 whitespace-pre-wrap">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Panel (Darker) */}
            <div className="w-[320px] bg-[#1a1c20] flex flex-col shrink-0 z-20 border-r border-white/5">
                <div className="p-4 flex flex-col gap-4">
                    {/* Workspace Selector */}
                    <div className="flex items-center gap-2 text-white/90 text-sm font-bold bg-white/5 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <div className="w-5 h-5 bg-[#00c4cc] rounded flex items-center justify-center text-[10px] text-white">C</div>
                        <span className="flex-1">Celoris TV's space</span>
                        <ChevronDown className="w-4 h-4 text-white/50" />
                    </div>

                    {/* Upload Section */}
                    <button className="w-full bg-[#00c4cc] hover:bg-[#00b0b8] text-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg active:scale-95">
                        <UploadCloud className="w-4 h-4" />
                        Upload
                    </button>

                    {/* Format Selector */}
                    <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
                        <button className="flex-1 py-1.5 flex items-center justify-center rounded bg-white/10">
                            <Smartphone className="w-4 h-4 text-white" />
                        </button>
                        <button className="flex-1 py-1.5 flex items-center justify-center rounded hover:bg-white/5">
                            <Monitor className="w-4 h-4 text-white/50" />
                        </button>
                    </div>

                    {/* Promo Card */}
                    <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl p-4 border border-white/10 relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-white/10 rounded-lg">
                                    <Sparkles className="w-4 h-4 text-[#00c4cc]" />
                                </div>
                                <span className="text-white font-bold text-sm">Pippit AI</span>
                            </div>
                            <p className="text-white/60 text-[11px] mb-3 leading-relaxed">Create stunning marketing content in a few clicks</p>
                            <button className="w-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                                Try <ArrowRightLeft className="w-3 h-3 rotate-45" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid of Assets */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar-dark">
                    <div className="grid grid-cols-2 gap-3">
                        {ASSETS.map((asset) => (
                            <div key={asset.id} className="group cursor-pointer">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden relative border border-white/5 group-hover:border-[#00c4cc] transition-all">
                                    <img src={asset.thumbnail} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-white font-mono">
                                        {asset.duration}
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                                        <div className="w-8 h-8 bg-[#00c4cc] rounded-full flex items-center justify-center text-white shadow-xl">
                                            <Plus className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-white/40 mt-1 truncate px-0.5">{asset.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f0f2f5]">

                {/* Topbar */}
                <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer border border-transparent hover:border-slate-100 transition-all">
                            <Cloud className="w-4 h-4 text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">202602221216</span>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button className="w-9 h-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                            <Play className="w-4 h-4 fill-current opacity-20" />
                        </button>
                        <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg flex items-center gap-1.5">
                            {zoom}% <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="w-px h-4 bg-slate-200 mx-2" />
                        <button className="w-9 h-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                            <Redo2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2 mr-2">
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-emerald-500 flex items-center justify-center text-[10px] text-white font-bold">JD</div>
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                                <Plus className="w-3 h-3 text-slate-400" />
                            </div>
                        </div>
                        <button className="bg-[#00c4cc] hover:bg-[#00b0b8] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95">
                            <Download className="w-3.5 h-3.5" />
                            Export
                        </button>
                        <button className="w-9 h-9 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-600 border border-slate-200">
                            <Grid2X2 className="w-4 h-4" />
                        </button>
                    </div>
                </header>

                {/* Canvas Area */}
                <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">

                    {/* Floating Vertical Format Tool */}
                    <div className="absolute top-8 left-8 bg-white rounded-xl shadow-xl border border-slate-100 p-1.5 flex flex-col gap-1 items-center z-10 w-14">
                        <button className="w-10 h-10 rounded-lg bg-slate-50 flex flex-col items-center justify-center gap-1 border border-slate-200/50">
                            <div className="w-4 h-5 border border-slate-400 rounded-sm" />
                            <span className="text-[8px] font-bold text-slate-500 uppercase">Format</span>
                        </button>
                    </div>

                    {/* Main Upload Dropzone */}
                    <div className="w-full max-w-2xl text-center space-y-6">
                        <div className="relative inline-block group cursor-pointer">
                            <div className="absolute inset-0 bg-[#00c4cc]/20 blur-3xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500" />
                            <div className="relative w-16 h-16 bg-[#00c4cc] rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-all duration-300">
                                <Plus className="w-8 h-8" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800 italic uppercase tracking-tight mb-2">Click to upload</h2>
                            <p className="text-slate-400 text-sm">Or drag and drop a file here</p>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 shadow-sm">
                                <div className="w-5 h-5 bg-[#00c4cc]/10 rounded flex items-center justify-center">
                                    <Cloud className="w-3.5 h-3.5 text-[#00c4cc]" />
                                </div>
                                <span className="text-sm font-bold text-slate-600">Google Drive</span>
                            </button>
                            <button className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-3 shadow-sm">
                                <div className="w-5 h-5 bg-blue-500/10 rounded flex items-center justify-center">
                                    <FolderOpen className="w-3.5 h-3.5 text-blue-500" />
                                </div>
                                <span className="text-sm font-bold text-slate-600">Dropbox</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Floating Design Tools */}
                    <div className="absolute top-8 right-8 flex flex-col gap-3">
                        {[Monitor, Eraser, Settings, HelpCircle, Maximize2].map((Icon, i) => (
                            <button key={i} className="w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-[#00c4cc] transition-colors">
                                <Icon className="w-4.5 h-4.5" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Timeline Area */}
                <div className="h-[240px] bg-white border-t border-slate-200 flex flex-col shrink-0">

                    {/* Timeline Toolbar */}
                    <div className="h-12 border-b border-slate-100 flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                <button className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Scissors className="w-3.5 h-3.5" />
                                </button>
                                <button className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Sparkles className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="w-px h-4 bg-slate-200" />
                            <div className="flex items-center gap-3 ml-2">
                                <button className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-[#00c4cc] hover:text-white transition-all">
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                </button>
                                <span className="text-xs font-mono font-bold text-slate-600 tracking-wider">{currentTime} / {duration}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Mic className="w-4 h-4 text-slate-400" />
                                <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="w-[60%] h-full bg-[#00c4cc] rounded-full" />
                                </div>
                            </div>
                            <div className="w-px h-4 bg-slate-200" />
                            <div className="flex items-center gap-2">
                                <button className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <div className="w-24 h-1 bg-slate-100 rounded-full" />
                                <button className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <button className="w-8 h-8 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400">
                                <Maximize2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Timeline Ruler & Track */}
                    <div className="flex-1 relative overflow-hidden bg-[#f8f9fa] group">
                        {/* Ruler */}
                        <div className="h-6 border-b border-slate-200 flex items-center relative overflow-hidden bg-white">
                            {[0, 10, 20, 30, 40, 50, 60].map((t) => (
                                <div key={t} className="absolute flex flex-col items-start" style={{ left: `${t * 20}px` }}>
                                    <div className="h-2 w-[1px] bg-slate-300" />
                                    <span className="text-[8px] text-slate-400 mt-1 pl-1 font-mono">{t}:00</span>
                                    <div className="absolute left-[10px] h-1 w-[1.5px] bg-slate-100 top-0" />
                                    <div className="absolute left-[20px] h-1.5 w-[1.5px] bg-slate-200 top-0" />
                                    <div className="absolute left-[30px] h-1 w-[1.5px] bg-slate-100 top-0" />
                                </div>
                            ))}
                        </div>

                        {/* Playhead */}
                        <div className="absolute top-0 bottom-0 left-[100px] w-0.5 bg-rose-500 z-10 shadow-[0_0_8px_rgba(244,63,94,0.4)] pointer-events-none">
                            <div className="w-3 h-3 bg-rose-500 rounded-full absolute top-[-6px] left-[-5.5px] border-2 border-white shadow-sm" />
                        </div>

                        {/* Tracks */}
                        <div className="flex-1 p-4 flex flex-col gap-2">
                            <div className="h-24 w-full bg-white/50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center group/track hover:border-[#00c4cc]/30 transition-colors">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover/track:scale-110 transition-transform">
                                        <Plus className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Drag and drop a media file here</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar-dark::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar-dark::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
            `}</style>
        </div>
    );
}
