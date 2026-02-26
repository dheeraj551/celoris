'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    LayoutTemplate,
    Wand2,
    UploadCloud,
    Type,
    Shapes,
    Sticker,
    Square,
    Group,
    Palette,
    Blocks,
    MousePointer2,
    Hand,
    Undo,
    Redo,
    Download,
    HelpCircle,
    Settings,
    Crop,
    FlipHorizontal,
    Copy,
    MoreHorizontal,
    Sparkles,
    Eraser,
    SlidersHorizontal,
    Cpu,
    Droplet,
    Layers,
    ChevronDown,
    X,
    Cloud,
    Trash2,
    Type as TypeIcon,
    Circle,
    Square as SquareIcon,
    Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from 'next/link';

type ObjectType = 'image' | 'text' | 'shape' | 'frame';

type CanvasObject = {
    id: string;
    type: ObjectType;
    x: number;
    y: number;
    width: number;
    height: number;
    opacity?: number;
    zIndex?: number;
    effect?: string;
    adjustments?: {
        brightness: number;
        contrast: number;
        saturation: number;
        tint: number;
        blur: number;
    };

    // Image
    src?: string;
    filter?: string;

    // Text
    text?: string;
    fontSize?: number;
    color?: string;

    // Shape
    shapeType?: 'rectangle' | 'circle';
    backgroundColor?: string;

    // Frame
    frameType?: 'square' | 'circle';
};

type FilterDef = {
    name: string;
    image: string;
    css: string;
};

const QUALITY_FILTERS: FilterDef[] = [
    { name: 'Natural', image: 'https://picsum.photos/seed/f1/200/200', css: 'saturate(150%) contrast(110%)' },
    { name: 'Apricot', image: 'https://picsum.photos/seed/f2/200/200', css: 'sepia(30%) saturate(140%) hue-rotate(-10deg)' },
    { name: 'Walnut', image: 'https://picsum.photos/seed/f3/200/200', css: 'sepia(40%) contrast(110%) brightness(90%)' },
    { name: 'Coconut', image: 'https://picsum.photos/seed/f4/200/200', css: 'grayscale(20%) brightness(110%) contrast(105%)' },
    { name: 'Light', image: 'https://picsum.photos/seed/f5/200/200', css: 'brightness(120%) contrast(110%) saturate(110%)' },
];

const DELICACY_FILTERS: FilterDef[] = [
    { name: 'Snack', image: 'https://picsum.photos/seed/f6/200/200', css: 'saturate(140%) contrast(110%)' },
    { name: 'Charcoal', image: 'https://picsum.photos/seed/f7/200/200', css: 'grayscale(100%) contrast(120%)' },
    { name: 'Miso', image: 'https://picsum.photos/seed/f8/200/200', css: 'sepia(30%) hue-rotate(10deg) saturate(120%)' },
];

const RETRO_FILTERS: FilterDef[] = [
    { name: 'Carmel', image: 'https://picsum.photos/seed/f9/200/200', css: 'sepia(50%) contrast(120%) brightness(90%)' },
    { name: 'Miami', image: 'https://picsum.photos/seed/f10/200/200', css: 'hue-rotate(40deg) saturate(150%) contrast(110%)' },
];

const getFilterString = (obj: CanvasObject) => {
    let filterStr = '';
    if (obj.filter && obj.filter !== 'none') {
        filterStr += obj.filter + ' ';
    }
    if (obj.adjustments) {
        const { brightness = 0, contrast = 0, saturation = 0, tint = 0, blur = 0 } = obj.adjustments;
        if (brightness !== 0) filterStr += `brightness(${100 + brightness}%) `;
        if (contrast !== 0) filterStr += `contrast(${100 + contrast}%) `;
        if (saturation !== 0) filterStr += `saturate(${100 + saturation}%) `;
        if (tint !== 0) filterStr += `hue-rotate(${tint}deg) `;
        if (blur !== 0) filterStr += `blur(${blur}px) `;
    }
    if (obj.effect && obj.effect !== 'none') {
        filterStr += obj.effect + ' ';
    }
    return filterStr.trim() || undefined;
};

export default function ImageStudio() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const [activeTab, setActiveTab] = useState('upload');
    const [activeRightTab, setActiveRightTab] = useState('filters');
    const [objects, setObjects] = useState<CanvasObject[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([
        'https://picsum.photos/seed/edit1/400/400',
        'https://picsum.photos/seed/edit2/400/400'
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Keyboard shortcuts (Delete)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Backspace' || e.key === 'Delete') && selectedId) {
                // Don't delete if editing text
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.getAttribute('contenteditable') === 'true') {
                    return;
                }
                setObjects(prev => prev.filter(img => img.id !== selectedId));
                setSelectedId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setGallery(prev => [url, ...prev]);
            addImageToCanvas(url);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const addImageToCanvas = (src: string) => {
        const newObj: CanvasObject = {
            id: Date.now().toString(),
            type: 'image',
            src,
            x: 150 + Math.random() * 50,
            y: 100 + Math.random() * 50,
            width: 300,
            height: 300,
            filter: 'none',
            opacity: 1,
            zIndex: objects.length
        };
        setObjects(prev => [...prev, newObj]);
        setSelectedId(newObj.id);
    };

    const addTextToCanvas = (text: string, fontSize: number) => {
        const newObj: CanvasObject = {
            id: Date.now().toString(),
            type: 'text',
            x: 200,
            y: 200,
            width: 300,
            height: fontSize * 1.5,
            text,
            fontSize,
            color: '#000000',
            opacity: 1,
            zIndex: objects.length
        };
        setObjects(prev => [...prev, newObj]);
        setSelectedId(newObj.id);
    };

    const addShapeToCanvas = (shapeType: 'rectangle' | 'circle') => {
        const newObj: CanvasObject = {
            id: Date.now().toString(),
            type: 'shape',
            x: 200,
            y: 200,
            width: 150,
            height: 150,
            shapeType,
            backgroundColor: '#00C4CC',
            opacity: 1,
            zIndex: objects.length
        };
        setObjects(prev => [...prev, newObj]);
        setSelectedId(newObj.id);
    };

    const addFrameToCanvas = (frameType: 'square' | 'circle') => {
        const newObj: CanvasObject = {
            id: Date.now().toString(),
            type: 'frame',
            x: 200,
            y: 200,
            width: 200,
            height: 200,
            frameType,
            opacity: 1,
            zIndex: objects.length
        };
        setObjects(prev => [...prev, newObj]);
        setSelectedId(newObj.id);
    };

    const applyFilter = (filterCss: string) => {
        if (!selectedId) return;
        setObjects(prev => prev.map(obj => obj.id === selectedId && obj.type === 'image' ? { ...obj, filter: filterCss } : obj));
    };

    const handleDragStart = (e: React.PointerEvent, id: string) => {
        e.stopPropagation();
        setSelectedId(id);
        const obj = objects.find(o => o.id === id);
        if (!obj) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const initialX = obj.x;
        const initialY = obj.y;

        const onPointerMove = (moveEvent: PointerEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            setObjects(prev => prev.map(o => o.id === id ? { ...o, x: initialX + deltaX, y: initialY + deltaY } : o));
        };

        const onPointerUp = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    const handleResizeStart = (e: React.PointerEvent, id: string) => {
        e.stopPropagation();
        const obj = objects.find(i => i.id === id);
        if (!obj) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = obj.width;
        const startHeight = obj.height;

        const onPointerMove = (moveEvent: PointerEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            setObjects(prev => prev.map(i => {
                if (i.id === id) {
                    if (i.type === 'image') {
                        return { ...i, width: Math.max(50, startWidth + deltaX) };
                    } else {
                        return { ...i, width: Math.max(50, startWidth + deltaX), height: Math.max(50, startHeight + deltaY) };
                    }
                }
                return i;
            }));
        };

        const onPointerUp = () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    };

    const duplicateSelected = () => {
        if (!selectedId) return;
        const obj = objects.find(i => i.id === selectedId);
        if (!obj) return;

        const newObj = {
            ...obj,
            id: Date.now().toString(),
            x: obj.x + 20,
            y: obj.y + 20,
            zIndex: objects.length
        };
        setObjects(prev => [...prev, newObj]);
        setSelectedId(newObj.id);
    };

    const handleTextChange = (id: string, newText: string) => {
        setObjects(prev => prev.map(o => o.id === id ? { ...o, text: newText } : o));
    };

    const selectedObject = objects.find(obj => obj.id === selectedId);

    return (
        <div className="flex h-screen w-full bg-[#F3F4F6] text-[13px] overflow-hidden font-sans selection:bg-blue-500/30">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />

            {/* Left Sidebar - Icon Strip */}
            <div className="w-[72px] bg-[#111111] flex flex-col items-center py-4 border-r border-white/10 z-20 shrink-0">
                <Link href="/" className="w-10 h-10 mb-6 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <img src="/celoris-logo.png" alt="Celoris" className="w-8 h-8 object-contain" />
                </Link>

                <div className="flex flex-col gap-4 w-full">
                    <NavItem icon={<LayoutTemplate size={20} />} label="Templates" active={activeTab === 'templates'} onClick={() => setActiveTab('templates')} />
                    <NavItem icon={<Wand2 size={20} />} label="Design" active={activeTab === 'design'} onClick={() => setActiveTab('design')} />
                    <NavItem icon={<UploadCloud size={20} />} label="Uploads" active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} />
                    <NavItem icon={<Type size={20} />} label="Text" active={activeTab === 'text'} onClick={() => setActiveTab('text')} />
                    <NavItem icon={<Shapes size={20} />} label="Elements" active={activeTab === 'shapes'} onClick={() => setActiveTab('shapes')} />
                    <NavItem icon={<Sticker size={20} />} label="Stickers" active={activeTab === 'stickers'} onClick={() => setActiveTab('stickers')} />
                    <NavItem icon={<Square size={20} />} label="Frames" active={activeTab === 'frames'} onClick={() => setActiveTab('frames')} />
                    <NavItem icon={<Group size={20} />} label="Group" active={activeTab === 'group'} onClick={() => setActiveTab('group')} />
                    <NavItem icon={<Palette size={20} />} label="Brand Kit" active={activeTab === 'brand'} onClick={() => setActiveTab('brand')} />
                    <NavItem icon={<Blocks size={20} />} label="Apps" active={activeTab === 'extensions'} onClick={() => setActiveTab('extensions')} />
                </div>
            </div>

            {/* Left Sidebar - Content Panel */}
            <div className="w-[300px] bg-[#18191B] flex flex-col border-r border-white/10 text-white z-10 shrink-0">
                <div className="flex border-b border-white/10">
                    <button className="flex-1 py-4 text-center font-medium relative text-white">
                        Project
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#00C4CC]"></div>
                    </button>
                    <button className="flex-1 py-4 text-center font-medium text-gray-400 hover:text-white transition-colors">
                        Workspace
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'upload' && (
                        <div className="p-4 flex flex-col gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 transition-colors"
                            >
                                <UploadCloud size={18} />
                                <span className="font-medium">Upload</span>
                                <div className="ml-auto mr-2">
                                    <div className="w-4 h-6 border border-white/30 rounded-sm flex items-center justify-center">
                                        <span className="text-[10px]">📱</span>
                                    </div>
                                </div>
                            </button>

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                {gallery.map((url, i) => (
                                    <div
                                        key={i}
                                        onClick={() => addImageToCanvas(url)}
                                        className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden border border-white/20 group cursor-pointer hover:border-[#00C4CC] transition-colors"
                                    >
                                        <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 font-medium text-xs bg-black/50 px-2 py-1 rounded">Add</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'text' && (
                        <div className="p-4 flex flex-col gap-4">
                            <button onClick={() => addTextToCanvas('Add a heading', 48)} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg py-4 font-bold text-2xl transition-colors">
                                Add a heading
                            </button>
                            <button onClick={() => addTextToCanvas('Add a subheading', 32)} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg py-3 font-semibold text-xl transition-colors">
                                Add a subheading
                            </button>
                            <button onClick={() => addTextToCanvas('Add a little bit of body text', 20)} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-lg py-3 text-base transition-colors">
                                Add a little bit of body text
                            </button>
                        </div>
                    )}

                    {activeTab === 'shapes' && (
                        <div className="p-4 grid grid-cols-3 gap-3">
                            <button onClick={() => addShapeToCanvas('rectangle')} className="aspect-square bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                                <SquareIcon size={32} className="text-white" fill="currentColor" />
                            </button>
                            <button onClick={() => addShapeToCanvas('circle')} className="aspect-square bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                                <Circle size={32} className="text-white" fill="currentColor" />
                            </button>
                        </div>
                    )}

                    {activeTab === 'templates' && (
                        <div className="p-4 grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} onClick={() => addImageToCanvas(`https://picsum.photos/seed/tpl${i}/400/600`)} className="aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden border border-white/20 cursor-pointer hover:border-[#00C4CC]">
                                    <img src={`https://picsum.photos/seed/tpl${i}/200/300`} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'stickers' && (
                        <div className="p-4 grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                                <div key={i} onClick={() => addImageToCanvas(`https://picsum.photos/seed/stk${i}/200/200`)} className="aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-[#00C4CC] flex items-center justify-center p-2">
                                    <img src={`https://picsum.photos/seed/stk${i}/200/200`} className="w-full h-full object-contain drop-shadow-md rounded-md" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'frames' && (
                        <div className="p-4 grid grid-cols-2 gap-2">
                            <div onClick={() => addFrameToCanvas('square')} className="aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-[#00C4CC] flex items-center justify-center">
                                <Square size={40} className="text-gray-400" />
                            </div>
                            <div onClick={() => addFrameToCanvas('circle')} className="aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-[#00C4CC] flex items-center justify-center">
                                <Circle size={40} className="text-gray-400" />
                            </div>
                        </div>
                    )}

                    {['design', 'group', 'brand', 'extensions'].includes(activeTab) && (
                        <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-4">
                            <Wand2 size={32} className="opacity-50" />
                            <p>This feature will be available soon.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative min-w-0" onClick={() => setSelectedId(null)}>
                {/* Top Bar */}
                <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shrink-0" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                            <Cloud size={14} className="text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-700">Untitled image</span>
                        <ChevronDown size={16} className="text-gray-400" />
                    </div>

                    <div className="flex items-center gap-1">
                        <ToolButton icon={<MousePointer2 size={18} />} active />
                        <ToolButton icon={<Hand size={18} />} />
                        <div className="w-[1px] h-4 bg-gray-300 mx-2"></div>
                        <ToolButton icon={<Square size={18} />} />
                        <div className="flex items-center gap-1 px-2 text-gray-600 font-medium cursor-pointer hover:bg-gray-50 rounded py-1">
                            68% <ChevronDown size={14} />
                        </div>
                        <div className="w-[1px] h-4 bg-gray-300 mx-2"></div>
                        <ToolButton icon={<Undo size={18} />} />
                        <ToolButton icon={<Redo size={18} className="text-gray-300" />} />
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => alert('Download mockup triggered!')}
                            className="bg-[#00C4CC] hover:bg-[#00B3BA] text-white px-4 py-1.5 rounded-md font-medium flex items-center gap-2 transition-colors"
                        >
                            <Download size={16} />
                            Download
                        </button>
                        <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                        <button className="text-gray-500 hover:text-gray-800"><Settings size={18} /></button>
                        <button className="text-gray-500 hover:text-gray-800"><HelpCircle size={18} /></button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-sm cursor-pointer" />
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-auto relative bg-[#F3F4F6] flex items-center justify-center p-12">
                    {/* Simulated Rulers */}
                    <div className="absolute top-0 left-0 right-0 h-6 bg-white border-b border-gray-200 flex items-end overflow-hidden">
                        <div className="w-full h-full flex items-end text-[9px] text-gray-400" style={{ backgroundImage: 'linear-gradient(90deg, transparent 49px, #e5e7eb 50px)', backgroundSize: '50px 100%' }}>
                            <span className="ml-[45px]">0</span><span className="ml-[45px]">50</span><span className="ml-[40px]">100</span><span className="ml-[40px]">150</span><span className="ml-[40px]">200</span><span className="ml-[40px]">250</span><span className="ml-[40px]">300</span><span className="ml-[40px]">350</span><span className="ml-[40px]">400</span><span className="ml-[40px]">450</span><span className="ml-[40px]">500</span><span className="ml-[40px]">550</span><span className="ml-[40px]">600</span><span className="ml-[40px]">650</span><span className="ml-[40px]">700</span>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 bottom-0 w-6 bg-white border-r border-gray-200 flex flex-col items-end overflow-hidden">
                        <div className="w-full h-full flex flex-col items-end text-[9px] text-gray-400" style={{ backgroundImage: 'linear-gradient(180deg, transparent 49px, #e5e7eb 50px)', backgroundSize: '100% 50px' }}>
                            <span className="mt-[45px]">0</span><span className="mt-[45px]">50</span><span className="mt-[40px]">100</span><span className="mt-[40px]">150</span><span className="mt-[40px]">200</span><span className="mt-[40px]">250</span><span className="mt-[40px]">300</span><span className="mt-[40px]">350</span><span className="mt-[40px]">400</span>
                        </div>
                    </div>

                    {/* Canvas Page */}
                    <div className="bg-white shadow-sm w-[800px] h-[600px] relative mt-6 ml-6 overflow-hidden">
                        <div className="absolute -top-6 left-0 text-gray-400 text-xs">Page 1</div>

                        {objects.length === 0 && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                                <UploadCloud size={48} className="mb-4 opacity-50" />
                                <p>Click an option on the left to add elements to the canvas</p>
                            </div>
                        )}

                        {/* Render Objects */}
                        {objects.map(obj => (
                            <div
                                key={obj.id}
                                onPointerDown={(e) => handleDragStart(e, obj.id)}
                                className={`absolute cursor-move ${selectedId === obj.id ? 'ring-2 ring-[#00C4CC]' : ''}`}
                                style={{
                                    left: obj.x,
                                    top: obj.y,
                                    width: obj.width,
                                    height: obj.type === 'image' ? 'auto' : obj.height,
                                    minHeight: obj.type === 'text' ? 'auto' : undefined,
                                    opacity: obj.opacity ?? 1,
                                    zIndex: obj.zIndex ?? 0
                                }}
                            >
                                {obj.type === 'image' && (
                                    <img
                                        src={obj.src}
                                        alt="Canvas layer"
                                        className="w-full h-auto pointer-events-none"
                                        style={{ filter: getFilterString(obj) }}
                                        draggable={false}
                                    />
                                )}

                                {obj.type === 'shape' && (
                                    <div
                                        className="w-full h-full pointer-events-none"
                                        style={{
                                            backgroundColor: obj.backgroundColor,
                                            borderRadius: obj.shapeType === 'circle' ? '50%' : '0%',
                                            filter: getFilterString(obj)
                                        }}
                                    />
                                )}

                                {obj.type === 'frame' && (
                                    <div
                                        className="w-full h-full pointer-events-none overflow-hidden bg-gray-100 flex items-center justify-center"
                                        style={{
                                            borderRadius: obj.frameType === 'circle' ? '50%' : '0%',
                                            filter: getFilterString(obj)
                                        }}
                                    >
                                        <ImageIcon size={48} className="text-gray-300" />
                                    </div>
                                )}

                                {obj.type === 'text' && (
                                    <textarea
                                        value={obj.text}
                                        onChange={(e) => handleTextChange(obj.id, e.target.value)}
                                        className="w-full h-full bg-transparent outline-none resize-none overflow-hidden"
                                        style={{
                                            fontSize: obj.fontSize,
                                            color: obj.color,
                                            lineHeight: 1.2,
                                            fontFamily: 'inherit',
                                            filter: getFilterString(obj)
                                        }}
                                        onPointerDown={e => e.stopPropagation()}
                                        onClick={e => { e.stopPropagation(); setSelectedId(obj.id); }}
                                    />
                                )}

                                {/* Selection Handles & Toolbar */}
                                {selectedId === obj.id && (
                                    <>
                                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-[#00C4CC] rounded-full"></div>
                                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-[#00C4CC] rounded-full"></div>
                                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-[#00C4CC] rounded-full"></div>

                                        {/* Resize Handle (Bottom Right) */}
                                        <div
                                            className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#00C4CC] rounded-full cursor-se-resize z-10"
                                            onPointerDown={(e) => handleResizeStart(e, obj.id)}
                                        ></div>

                                        {/* Floating Toolbar */}
                                        <div
                                            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-md border border-gray-200 flex items-center p-1 gap-1 cursor-default whitespace-nowrap z-20"
                                            onPointerDown={e => e.stopPropagation()}
                                        >
                                            {obj.type === 'image' && (
                                                <>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700" title="Crop"><Crop size={16} /></button>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700" title="Flip"><FlipHorizontal size={16} /></button>
                                                </>
                                            )}
                                            {obj.type === 'text' && (
                                                <>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 font-bold" title="Bold">B</button>
                                                    <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700 italic" title="Italic">I</button>
                                                </>
                                            )}
                                            {obj.type === 'shape' && (
                                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700" title="Color"><Palette size={16} /></button>
                                            )}
                                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-700" title="Duplicate" onClick={duplicateSelected}><Copy size={16} /></button>
                                            <div className="w-[1px] h-4 bg-gray-200 mx-1"></div>
                                            <button
                                                className="p-1.5 hover:bg-red-50 text-red-600 rounded"
                                                title="Delete"
                                                onClick={() => {
                                                    setObjects(prev => prev.filter(i => i.id !== obj.id));
                                                    setSelectedId(null);
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Sidebar - Properties Panel */}
            <div className="w-[320px] bg-white border-l border-gray-200 flex flex-col z-10 shrink-0">
                <div className="h-14 border-b border-gray-200 flex items-center justify-between px-4">
                    <h2 className="font-semibold text-gray-800 text-base">
                        {!selectedObject ? 'Properties' :
                            activeRightTab === 'filters' ? 'Filters' :
                                activeRightTab === 'effects' ? 'Effects' :
                                    activeRightTab === 'remove_bg' ? "Remove Background" :
                                        activeRightTab === 'adjust' ? 'Adjust' :
                                            activeRightTab === 'smart_tools' ? 'Smart Tools' :
                                                activeRightTab === 'opacity' ? 'Opacity' :
                                                    activeRightTab === 'arrange' ? 'Arrange' : 'Properties'}
                    </h2>
                    <button className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
                    {!selectedObject ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 text-center mt-20">
                            <MousePointer2 size={48} className="opacity-20" />
                            <p>Select an element on the canvas to edit its properties.</p>
                        </div>
                    ) : (
                        <>
                            {activeRightTab === 'filters' && selectedObject.type === 'image' && (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <div
                                            onClick={() => applyFilter('none')}
                                            className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center cursor-pointer transition-colors ${selectedObject.filter === 'none' ? 'border-[#00C4CC] bg-[#E5F9FA]' : 'border-gray-200 hover:border-gray-300 bg-gray-50'}`}
                                        >
                                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                                <div className="w-8 h-[2px] bg-gray-300 transform rotate-45"></div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium">None</span>
                                    </div>

                                    <FilterSection
                                        title="Quality"
                                        filters={QUALITY_FILTERS}
                                        onSelect={applyFilter}
                                        activeFilter={selectedObject.filter || 'none'}
                                    />

                                    <FilterSection
                                        title="Delicacy"
                                        filters={DELICACY_FILTERS}
                                        onSelect={applyFilter}
                                        activeFilter={selectedObject.filter || 'none'}
                                    />

                                    <FilterSection
                                        title="Retro"
                                        filters={RETRO_FILTERS}
                                        onSelect={applyFilter}
                                        activeFilter={selectedObject.filter || 'none'}
                                    />
                                </>
                            )}

                            {activeRightTab === 'effects' && (
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Blur', 'Drop Shadow', 'Glow', 'Outline'].map(effect => (
                                            <button key={effect} className="p-4 border border-gray-200 rounded-lg hover:border-[#00C4CC] hover:bg-gray-50 flex flex-col items-center gap-3 transition-colors">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Sparkles size={20} className="text-gray-500" />
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">{effect}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeRightTab === 'remove_bg' && (
                                <div className="flex flex-col gap-4">
                                    <button className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
                                        <Eraser size={20} />
                                        Remove Background
                                    </button>
                                    <p className="text-xs text-gray-500 text-center px-4 leading-relaxed">
                                        Automatically remove the background from your image in one click using AI.
                                    </p>
                                </div>
                            )}

                            {activeRightTab === 'adjust' && (
                                <div className="flex flex-col gap-6">
                                    {[
                                        { id: 'brightness', label: 'Brightness', min: -100, max: 100 },
                                        { id: 'contrast', label: 'Contrast', min: -100, max: 100 },
                                        { id: 'saturation', label: 'Saturation', min: -100, max: 100 },
                                        { id: 'tint', label: 'Tint', min: -100, max: 100 },
                                        { id: 'blur', label: 'Blur', min: 0, max: 100 }
                                    ].map(adj => {
                                        const val = selectedObject.adjustments?.[adj.id as keyof typeof selectedObject.adjustments] ?? 0;
                                        return (
                                            <div key={adj.id}>
                                                <div className="flex justify-between mb-2">
                                                    <label className="text-xs font-medium text-gray-700">{adj.label}</label>
                                                    <span className="text-xs text-gray-500">{val}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min={adj.min}
                                                    max={adj.max}
                                                    value={val}
                                                    onChange={(e) => {
                                                        const newVal = parseInt(e.target.value);
                                                        setObjects(prev => prev.map(o => {
                                                            if (o.id === selectedId) {
                                                                return {
                                                                    ...o,
                                                                    adjustments: {
                                                                        ...(o.adjustments || { brightness: 0, contrast: 0, saturation: 0, tint: 0, blur: 0 }),
                                                                        [adj.id]: newVal
                                                                    }
                                                                };
                                                            }
                                                            return o;
                                                        }));
                                                    }}
                                                    className="w-full accent-[#00C4CC]"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {activeRightTab === 'smart_tools' && (
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { name: 'Magic Eraser', icon: <Eraser size={24} /> },
                                            { name: 'AI Upscale', icon: <Cpu size={24} /> },
                                            { name: 'Replace', icon: <Sparkles size={24} /> },
                                        ].map(tool => (
                                            <button key={tool.name} className="p-4 border border-gray-200 rounded-lg hover:border-[#00C4CC] hover:bg-gray-50 flex flex-col items-center gap-3 text-center transition-colors">
                                                <div className="text-[#00C4CC]">{tool.icon}</div>
                                                <span className="text-xs font-medium text-gray-700">{tool.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeRightTab === 'opacity' && (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-xs font-medium text-gray-700">Transparency</label>
                                            <span className="text-xs text-gray-500">{Math.round((selectedObject.opacity ?? 1) * 100)}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={(selectedObject.opacity ?? 1) * 100}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) / 100;
                                                setObjects(prev => prev.map(o => o.id === selectedId ? { ...o, opacity: val } : o));
                                            }}
                                            className="w-full accent-[#00C4CC]"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeRightTab === 'arrange' && (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => {
                                            setObjects(prev => {
                                                const maxZ = Math.max(...prev.map(o => o.zIndex ?? 0), 0);
                                                return prev.map(o => o.id === selectedId ? { ...o, zIndex: maxZ + 1 } : o);
                                            });
                                        }}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#00C4CC] text-sm text-gray-700 font-medium text-left transition-colors"
                                    >
                                        Bring to front
                                    </button>
                                    <button
                                        onClick={() => {
                                            setObjects(prev => {
                                                const minZ = Math.min(...prev.map(o => o.zIndex ?? 0), 0);
                                                return prev.map(o => o.id === selectedId ? { ...o, zIndex: minZ - 1 } : o);
                                            });
                                        }}
                                        className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-[#00C4CC] text-sm text-gray-700 font-medium text-left transition-colors"
                                    >
                                        Send to back
                                    </button>
                                </div>
                            )}

                            {/* Text/Shape specific properties when filters tab is active but a text/shape is selected */}
                            {activeRightTab === 'filters' && selectedObject.type === 'text' && (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Font Size</label>
                                        <input
                                            type="range"
                                            min="12"
                                            max="120"
                                            value={selectedObject.fontSize}
                                            onChange={(e) => setObjects(prev => prev.map(o => o.id === selectedId ? { ...o, fontSize: parseInt(e.target.value), height: parseInt(e.target.value) * 1.5 } : o))}
                                            className="w-full accent-[#00C4CC]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Color</label>
                                        <div className="flex gap-2">
                                            {['#000000', '#FFFFFF', '#EF4444', '#3B82F6', '#10B981', '#F59E0B'].map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setObjects(prev => prev.map(o => o.id === selectedId ? { ...o, color } : o))}
                                                    className={`w-8 h-8 rounded-full border-2 ${selectedObject.color === color ? 'border-[#00C4CC]' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeRightTab === 'filters' && selectedObject.type === 'shape' && (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="text-xs font-medium text-gray-700 mb-1 block">Fill Color</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['#00C4CC', '#000000', '#FFFFFF', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'].map(color => (
                                                <button
                                                    key={color}
                                                    onClick={() => setObjects(prev => prev.map(o => o.id === selectedId ? { ...o, backgroundColor: color } : o))}
                                                    className={`w-8 h-8 rounded-full border-2 ${selectedObject.backgroundColor === color ? 'border-gray-800' : 'border-gray-200'}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Right Sidebar - Icon Strip */}
            <div className="w-[72px] bg-[#F8F9FA] border-l border-gray-200 flex flex-col items-center py-4 z-20 shrink-0">
                <div className="text-xs font-semibold text-gray-800 mb-4">Layers</div>

                {/* Layer thumbnails */}
                <div className="flex flex-col gap-3 w-full px-2 mb-6">
                    {objects.map(obj => (
                        <div
                            key={obj.id}
                            onClick={() => setSelectedId(obj.id)}
                            className={`aspect-video bg-white rounded border-2 overflow-hidden relative cursor-pointer flex items-center justify-center ${selectedId === obj.id ? 'border-[#00C4CC]' : 'border-transparent hover:border-gray-300'}`}
                        >
                            {obj.type === 'image' && <img src={obj.src} alt="Layer" className="w-full h-full object-cover" style={{ filter: obj.filter }} />}
                            {obj.type === 'shape' && (
                                <div className="w-8 h-8" style={{ backgroundColor: obj.backgroundColor, borderRadius: obj.shapeType === 'circle' ? '50%' : '0%' }} />
                            )}
                            {obj.type === 'frame' && (
                                <div className="w-8 h-8 bg-gray-100 flex items-center justify-center" style={{ borderRadius: obj.frameType === 'circle' ? '50%' : '0%' }}>
                                    <ImageIcon size={16} className="text-gray-300" />
                                </div>
                            )}
                            {obj.type === 'text' && <TypeIcon size={20} className="text-gray-400" />}
                        </div>
                    ))}
                    <div className="aspect-video bg-white rounded border border-gray-200 flex items-center justify-center relative cursor-pointer hover:bg-gray-50">
                        <Square size={16} className="text-gray-300" />
                    </div>
                </div>

                <div className="w-8 h-[1px] bg-gray-200 mb-4"></div>

                <div className="flex flex-col gap-2 w-full">
                    <RightNavItem icon={<Wand2 size={20} />} label="Filters" active={activeRightTab === 'filters'} onClick={() => setActiveRightTab('filters')} />
                    <RightNavItem icon={<Sparkles size={20} />} label="Effects" active={activeRightTab === 'effects'} onClick={() => setActiveRightTab('effects')} />
                    <RightNavItem icon={<Eraser size={20} />} label="Remove BG" active={activeRightTab === 'remove_bg'} onClick={() => setActiveRightTab('remove_bg')} />
                    <RightNavItem icon={<SlidersHorizontal size={20} />} label="Adjust" active={activeRightTab === 'adjust'} onClick={() => setActiveRightTab('adjust')} />
                    <RightNavItem icon={<Cpu size={20} />} label="Smart Tools" active={activeRightTab === 'smart_tools'} onClick={() => setActiveRightTab('smart_tools')} />
                    <RightNavItem icon={<Droplet size={20} />} label="Opacity" active={activeRightTab === 'opacity'} onClick={() => setActiveRightTab('opacity')} />
                    <RightNavItem icon={<Layers size={20} />} label="Arrange" active={activeRightTab === 'arrange'} onClick={() => setActiveRightTab('arrange')} />
                </div>
            </div>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1.5 w-full py-2 transition-colors ${active ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}>
            <div className={`${active ? 'bg-white/10 rounded-lg p-1.5' : 'p-1.5'}`}>
                {icon}
            </div>
            <span className="text-[10px] text-center leading-tight px-1">{label}</span>
        </button>
    );
}

function RightNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-full py-2 transition-colors ${active ? 'text-[#00C4CC]' : 'text-gray-500 hover:text-gray-800'}`}>
            <div className={`${active ? 'bg-[#E5F9FA] rounded-lg p-2' : 'p-2'}`}>
                {icon}
            </div>
            <span className="text-[9px] text-center leading-tight px-1">{label}</span>
        </button>
    );
}

function ToolButton({ icon, active, className = '' }: { icon: React.ReactNode, active?: boolean, className?: string }) {
    return (
        <button className={`p-2 rounded-md transition-colors ${active ? 'bg-gray-100 text-gray-800' : 'text-gray-600 hover:bg-gray-50'} ${className}`}>
            {icon}
        </button>
    );
}

function FilterSection({
    title,
    filters,
    onSelect,
    activeFilter
}: {
    title: string,
    filters: FilterDef[],
    onSelect: (css: string) => void,
    activeFilter: string
}) {
    if (filters.length === 0) return null;

    return (
        <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <div className="grid grid-cols-3 gap-3">
                {filters.map((filter, i) => {
                    const isActive = activeFilter === filter.css;
                    return (
                        <div key={i} className="flex flex-col gap-1.5 cursor-pointer group" onClick={() => onSelect(filter.css)}>
                            <div className={`aspect-square rounded-xl overflow-hidden relative border-2 transition-colors ${isActive ? 'border-[#00C4CC]' : 'border-transparent group-hover:border-gray-300'}`}>
                                <img src={filter.image} alt={filter.name} className="w-full h-full object-cover" style={{ filter: filter.css }} />
                            </div>
                            <span className={`text-[11px] text-center truncate ${isActive ? 'text-[#00C4CC] font-medium' : 'text-gray-600'}`}>
                                {filter.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
