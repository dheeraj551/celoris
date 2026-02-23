"use client"

import React, { useState } from 'react';
import {
    LayoutTemplate,
    Palette,
    UploadCloud,
    Type,
    Shapes,
    Smile,
    Image as ImageIcon,
    Layers,
    Briefcase,
    Grid,
    Search,
    SlidersHorizontal,
    ChevronDown,
    Play,
    History,
    Monitor,
    Undo2,
    Redo2,
    Download,
    HelpCircle,
    Settings,
    PaintBucket,
    Crop,
    Plus,
    Maximize2,
    ChevronLeft,
    ChevronRight,
    AlignLeft,
    Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';

const SIDEBAR_ITEMS = [
    { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
    { id: 'design', icon: Palette, label: 'Design' },
    { id: 'uploads', icon: UploadCloud, label: 'Uploads' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'shapes', icon: Shapes, label: 'Shapes' },
    { id: 'stickers', icon: Smile, label: 'Stickers' },
    { id: 'frames', icon: ImageIcon, label: 'Frames' },
    { id: 'layers', icon: Layers, label: 'Layers' },
    { id: 'brand', icon: Briefcase, label: 'Brand Kit' },
    { id: 'apps', icon: Grid, label: 'Apps' },
];

const TEMPLATES = [
    { id: 1, image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=200&h=200&fit=crop' },
    { id: 2, image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop' },
    { id: 3, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=200&h=200&fit=crop' },
    { id: 4, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&h=200&fit=crop' },
    { id: 5, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop' },
    { id: 6, image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&h=200&fit=crop' },
];

export default function ImageStudio() {
    const [activeTab, setActiveTab] = useState('templates');
    const [zoom, setZoom] = useState(68);
    const [uploads, setUploads] = useState<string[]>([]);
    const [canvasImage, setCanvasImage] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setUploads(prev => [result, ...prev]);
                setCanvasImage(result);
            };
            reader.readAsDataURL(file);
            e.target.value = ''; // Reset input to allow uploading the same file again
        }
    };

    const handleDeleteUpload = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        setUploads(prev => {
            const newUploads = [...prev];
            const deletedUrl = newUploads[index];
            newUploads.splice(index, 1);
            if (canvasImage === deletedUrl) {
                setCanvasImage(null);
            }
            return newUploads;
        });
    };

    return (
        <div className="h-screen w-full bg-[#f3f4f6] text-slate-800 flex font-sans overflow-hidden">

            {/* Leftmost Sidebar (Dark) */}
            <div className="w-[72px] bg-[#111111] flex flex-col items-center py-4 shrink-0 z-20">
                <div className="w-10 h-10 mb-6 flex items-center justify-center">
                    <img src="/celoris-logo.png" alt="Celoris" className="w-8 h-8 object-contain" />
                </div>

                <div className="flex-1 w-full overflow-y-auto no-scrollbar flex flex-col items-center gap-2">
                    {SIDEBAR_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full py-3 flex flex-col items-center gap-1.5 transition-colors relative ${activeTab === item.id
                                ? 'text-white'
                                : 'text-[#888888] hover:text-white'
                                }`}
                        >
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-white rounded-r-md"
                                />
                            )}
                            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'fill-current opacity-20' : ''}`} />
                            <span className="text-[10px] font-medium leading-none">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Secondary Panel (Dark Grey) */}
            <div className="w-[320px] bg-[#1a1a1a] flex flex-col shrink-0 z-10 border-r border-[#2a2a2a]">
                {activeTab === 'templates' ? (
                    <>
                        <div className="p-4 flex flex-col gap-4">
                            {/* Search Bar */}
                            <div className="relative flex items-center">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    className="w-full bg-[#252525] text-white text-sm rounded-lg pl-9 pr-10 py-2.5 outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500"
                                />
                                <button className="absolute right-3">
                                    <SlidersHorizontal className="w-4 h-4 text-slate-400 hover:text-white" />
                                </button>
                            </div>

                            {/* Pills */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                <button className="whitespace-nowrap bg-[#252525] hover:bg-[#333333] text-slate-300 text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-2">
                                    <span>Father's Day</span>
                                </button>
                                <button className="whitespace-nowrap bg-[#252525] hover:bg-[#333333] text-slate-300 text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                                    <span>Wallpaper</span>
                                </button>
                            </div>

                            {/* Promo Card */}
                            <div className="bg-gradient-to-br from-[#2a1a3a] to-[#1a1f3a] p-4 rounded-xl border border-white/5 relative overflow-hidden group cursor-pointer">
                                <div className="absolute top-2 right-2 text-white/50 hover:text-white">×</div>
                                <h4 className="text-white text-sm font-bold mb-1">Text to design</h4>
                                <p className="text-slate-400 text-xs mb-3 pr-4 leading-relaxed">Generate personalized design from your prompts and text.</p>
                                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                                    Try now →
                                </button>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto p-4 pt-0 custom-scrollbar-dark grid grid-cols-2 gap-3 auto-rows-max">
                            <div className="col-span-2 flex items-center justify-between mt-2 mb-1">
                                <span className="text-white text-sm font-bold">Current size</span>
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                            </div>

                            {TEMPLATES.map((t) => (
                                <div key={t.id} onClick={() => setCanvasImage(t.image)} className="aspect-[4/5] bg-[#252525] rounded-xl overflow-hidden cursor-pointer group relative border border-transparent hover:border-blue-500 transition-colors">
                                    <img src={t.image} alt="Template" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-bold bg-blue-600 px-3 py-1.5 rounded-full">Apply</span>
                                    </div>
                                </div>
                            ))}
                            {TEMPLATES.map((t) => (
                                <div key={`${t.id}-dup`} onClick={() => setCanvasImage(t.image)} className="aspect-square bg-[#252525] rounded-xl overflow-hidden cursor-pointer group relative border border-transparent hover:border-blue-500 transition-colors">
                                    <img src={t.image} alt="Template" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </>
                ) : activeTab === 'uploads' ? (
                    <div className="p-4 flex flex-col h-full gap-4">
                        <div className="bg-[#252525] p-6 rounded-xl border border-dashed border-slate-600 flex flex-col items-center justify-center text-center">
                            <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
                            <h4 className="text-white text-sm font-bold mb-1">Upload files</h4>
                            <p className="text-slate-400 text-xs mb-4">Click to browse your device</p>
                            <label className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer w-full text-center inline-block">
                                Upload Media
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                            </label>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar-dark grid grid-cols-2 gap-3 auto-rows-max content-start">
                            {uploads.map((url, i) => (
                                <div key={i} onClick={() => setCanvasImage(url)} className="aspect-square bg-[#252525] rounded-xl overflow-hidden cursor-pointer group relative border border-transparent hover:border-blue-500 transition-colors">
                                    <img src={url} alt="Upload" className="w-full h-full object-cover" />
                                    <button
                                        onClick={(e) => handleDeleteUpload(e, i)}
                                        className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-md hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                                    >
                                        <Trash2 className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="p-4 flex items-center justify-center h-full text-slate-500 text-sm">
                        {SIDEBAR_ITEMS.find(item => item.id === activeTab)?.label} coming soon...
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Top White Navbar */}
                <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 hover:bg-slate-100 px-2 py-1.5 rounded-md transition-colors">
                            <ImageIcon className="w-5 h-5 text-slate-600" />
                            <span className="text-sm font-medium text-slate-900">Untitled image</span>
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button className="w-9 h-9 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600 tooltip-trigger">
                            <Play className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600 tooltip-trigger">
                            <History className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600 tooltip-trigger">
                            <Monitor className="w-4 h-4" />
                        </button>

                        <div className="w-px h-4 bg-slate-200 mx-1" />

                        <div className="flex items-center gap-1">
                            <button className="px-2 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md flex items-center gap-1">
                                {zoom}% <ChevronDown className="w-3 h-3 text-slate-500" />
                            </button>
                        </div>

                        <div className="w-px h-4 bg-slate-200 mx-1" />

                        <button className="w-9 h-9 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-not-allowed">
                            <Undo2 className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-not-allowed">
                            <Redo2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="bg-[#00c4cc] hover:bg-[#00b0b8] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                            <HelpCircle className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm cursor-pointer" />
                    </div>
                </div>

                {/* Workspace Area */}
                <div className="flex-1 flex overflow-hidden relative">

                    {/* Top Ruler Simulation */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-white border-b border-slate-200 flex z-10 overflow-hidden opacity-50">
                        <div className="w-4 h-full border-r border-slate-200 shrink-0" /> {/* Corner intersection */}
                        <div className="flex-1 relative" style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 49px, #e2e8f0 49px, #e2e8f0 50px)' }}>
                            <div className="absolute top-0 text-[8px] text-slate-400 pl-1">0</div>
                            <div className="absolute top-0 left-[50px] text-[8px] text-slate-400 pl-1">50</div>
                            <div className="absolute top-0 left-[100px] text-[8px] text-slate-400 pl-1">100</div>
                            <div className="absolute top-0 left-[200px] text-[8px] text-slate-400 pl-1">200</div>
                            <div className="absolute top-0 left-[300px] text-[8px] text-slate-400 pl-1">300</div>
                            <div className="absolute top-0 left-[400px] text-[8px] text-slate-400 pl-1">400</div>
                        </div>
                    </div>

                    {/* Left Ruler Simulation */}
                    <div className="absolute top-0 left-0 bottom-0 w-4 bg-white border-r border-slate-200 flex flex-col z-10 overflow-hidden opacity-50">
                        <div className="h-4 w-full border-b border-slate-200 shrink-0" />
                        <div className="flex-1 relative" style={{ background: 'repeating-linear-gradient(180deg, transparent, transparent 49px, #e2e8f0 49px, #e2e8f0 50px)' }}>
                            <div className="absolute left-0 top-[50px] text-[8px] text-slate-400 transform -rotate-90 origin-left translate-x-3 -translate-y-2">50</div>
                            <div className="absolute left-0 top-[100px] text-[8px] text-slate-400 transform -rotate-90 origin-left translate-x-3 -translate-y-2">100</div>
                            <div className="absolute left-0 top-[200px] text-[8px] text-slate-400 transform -rotate-90 origin-left translate-x-3 -translate-y-2">200</div>
                        </div>
                    </div>

                    {/* Main Canvas Scroll Area */}
                    <div className="flex-1 bg-[#f3f4f6] overflow-auto flex items-center justify-center p-12 relative pt-20">

                        {/* Page Label */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs font-medium text-slate-500 w-[800px] flex justify-between items-end">
                            <span>Page 1</span>
                            <div className="flex items-center gap-2">
                                <button className="hover:bg-slate-200 p-1 rounded"><Download className="w-3.5 h-3.5" /></button>
                                <button className="hover:bg-slate-200 p-1 rounded"><AlignLeft className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>

                        {/* White Canvas Paper */}
                        <div
                            className="bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-transform duration-200 ease-out relative overflow-hidden"
                            style={{
                                width: '800px',
                                height: '600px',
                                transform: `scale(${zoom / 100})`,
                                transformOrigin: 'center center'
                            }}
                        >
                            {canvasImage ? (
                                <img src={canvasImage} alt="Canvas content" className="w-full h-full object-contain" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-slate-300">
                                    Empty Canvas - Ready for design
                                </div>
                            )}
                        </div>

                        {/* Floating Context Menu (Right of canvas) */}
                        <div className="absolute top-24 right-8 bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col items-center p-2 gap-2">
                            <button className="w-12 h-14 rounded-lg hover:bg-slate-50 flex flex-col items-center justify-center gap-1.5 transition-colors group">
                                <div className="w-6 h-6 rounded border border-slate-200 bg-white" />
                                <span className="text-[9px] font-medium text-slate-500 group-hover:text-slate-700">Background</span>
                            </button>
                            <div className="w-8 h-px bg-slate-100" />
                            <button className="w-12 h-14 rounded-lg hover:bg-slate-50 flex flex-col items-center justify-center gap-1.5 transition-colors group">
                                <Crop className="w-5 h-5 text-slate-600" />
                                <span className="text-[9px] font-medium text-slate-500 group-hover:text-slate-700">Resize</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="h-12 border-t border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hover:bg-slate-100 px-3 py-1.5 rounded-md">
                        <Plus className="w-4 h-4" /> Add page
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <button className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-not-allowed">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-medium text-slate-600">1 / 1</span>
                            <button className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-not-allowed">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Zoom Slider */}
                        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                            <div
                                className="w-4 h-4 rounded-full border border-slate-300 relative cursor-pointer"
                                onClick={() => setZoom(Math.max(10, zoom - 10))}
                            >
                                <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-px bg-slate-400" />
                            </div>
                            <div className="w-24 h-1 bg-slate-200 rounded-full relative">
                                <div className="absolute top-1/2 -translate-y-1/2 left-[68%] w-3 h-3 bg-white border border-slate-300 rounded-full shadow-sm cursor-grab" />
                            </div>
                            <div
                                className="w-4 h-4 rounded-full border border-slate-300 relative cursor-pointer"
                                onClick={() => setZoom(Math.min(200, zoom + 10))}
                            >
                                <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-px bg-slate-400" />
                                <div className="absolute inset-y-1 left-1/2 -translate-x-1/2 w-px bg-slate-400" />
                            </div>
                            <span className="text-xs font-medium text-slate-600 w-8">{zoom}%</span>
                        </div>

                        <button className="w-8 h-8 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-600">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>

            {/* Right Layers Panel */}
            <div className="w-64 bg-white border-l border-slate-200 flex flex-col shrink-0">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900">Layers</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar-light">
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex gap-3 cursor-pointer hover:border-blue-300 transition-colors transition-colors ring-1 ring-blue-500">
                        <div className="w-12 h-12 bg-white rounded border border-slate-200 shadow-sm shrink-0" />
                        <div className="flex-1 flex flex-col justify-center">
                            <span className="text-sm font-semibold text-slate-700">Background</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar-dark::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar-dark::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 6px;
                }
                .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }

                .custom-scrollbar-light::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar-light::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar-light::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 6px;
                }
                .custom-scrollbar-light::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.2);
                }

                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
