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
    Image as ImageIcon,
    Heart,
    Users,
    User as UserIcon,
    Wallet,
    ThumbsUp,
    LogOut
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from 'next/image';
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { DashboardShell } from '@/components/home-new/DashboardShell';

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
        hue: number;
    };

    // Image
    src?: string;
    filter?: string;
    isCropped?: boolean;
    isFlippedX?: boolean;

    // Text
    text?: string;
    fontSize?: number;
    color?: string;
    textShadow?: string;

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

const CLASSIC_FILTERS: FilterDef[] = [
    { name: 'Grayscale', image: 'https://picsum.photos/seed/f11/200/200', css: 'grayscale(100%)' },
    { name: 'Sepia', image: 'https://picsum.photos/seed/f12/200/200', css: 'sepia(100%)' },
    { name: 'Warm Sepia', image: 'https://picsum.photos/seed/f12b/200/200', css: 'sepia(80%) saturate(150%)' },
    { name: 'Invert', image: 'https://picsum.photos/seed/f13/200/200', css: 'invert(100%)' },
    { name: 'Hue Rotate', image: 'https://picsum.photos/seed/f14/200/200', css: 'hue-rotate(90deg)' },
];

const getFilterString = (obj: CanvasObject) => {
    let filterStr = '';
    if (obj.filter && obj.filter !== 'none') {
        filterStr += obj.filter + ' ';
    }
    if (obj.adjustments) {
        const { brightness = 0, contrast = 0, saturation = 0, tint = 0, blur = 0, hue = 0 } = obj.adjustments;
        if (brightness !== 0) filterStr += `brightness(${100 + brightness}%) `;
        if (contrast !== 0) filterStr += `contrast(${100 + contrast}%) `;
        if (saturation !== 0) filterStr += `saturate(${100 + saturation}%) `;
        if (tint !== 0) filterStr += `hue-rotate(${tint}deg) `;
        if (blur !== 0) filterStr += `blur(${blur}px) `;
        if (hue !== 0) filterStr += `hue-rotate(${hue}deg) `;
    }
    if (obj.effect && obj.effect !== 'none' && obj.effect !== 'vignette') {
        filterStr += obj.effect + ' ';
    }
    return filterStr.trim() || undefined;
};

export default function ImageStudio() {
    const { user, profile, loading: authLoading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const handleSignOut = async () => {
        try {
            await signOut()
        } catch (error) {
            console.error("Error signing out:", error)
        }
    }

    const [activeTab, setActiveTab] = useState('upload');
    const [activeRightTab, setActiveRightTab] = useState('filters');
    const [objects, setObjects] = useState<CanvasObject[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
    const [gallery, setGallery] = useState<string[]>([
        'https://picsum.photos/seed/edit1/400/400',
        'https://picsum.photos/seed/edit2/400/400'
    ]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLayerDragStart = (e: React.DragEvent, id: string) => {
        setDraggedLayerId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleLayerDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleLayerDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        if (!draggedLayerId || draggedLayerId === targetId) {
            setDraggedLayerId(null);
            return;
        }

        setObjects(prev => {
            const visualArray = [...prev].reverse();
            const draggedVisualIndex = visualArray.findIndex(o => o.id === draggedLayerId);
            const targetVisualIndex = visualArray.findIndex(o => o.id === targetId);

            if (draggedVisualIndex === -1 || targetVisualIndex === -1) return prev;

            const [draggedObj] = visualArray.splice(draggedVisualIndex, 1);
            visualArray.splice(targetVisualIndex, 0, draggedObj);

            return visualArray.reverse().map((o, i) => ({ ...o, zIndex: i }));
        });
        setDraggedLayerId(null);
    };

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

    const applyEffect = (effectName: string) => {
        if (!selectedId) return;
        let effectCss = '';
        if (effectName === 'Blur') effectCss = 'blur(4px)';
        else if (effectName === 'Drop Shadow') effectCss = 'drop-shadow(4px 4px 4px rgba(0,0,0,0.5))';
        else if (effectName === 'Glow') effectCss = 'drop-shadow(0 0 8px rgba(0,196,204,0.8))';
        else if (effectName === 'Outline') effectCss = 'drop-shadow(2px 0 0 #00C4CC) drop-shadow(-2px 0 0 #00C4CC) drop-shadow(0 2px 0 #00C4CC) drop-shadow(0 -2px 0 #00C4CC)';
        else if (effectName === 'Vignette') effectCss = 'vignette';

        setObjects(prev => prev.map(obj => obj.id === selectedId ? { ...obj, effect: obj.effect === effectCss ? 'none' : effectCss } : obj));
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

    const toggleCrop = (id: string) => {
        setObjects(prev => prev.map(o => {
            if (o.id === id && o.type === 'image') {
                if (!o.isCropped) {
                    const el = document.getElementById(`obj-${id}`);
                    const currentHeight = el ? el.offsetHeight : o.height;
                    return { ...o, isCropped: true, height: currentHeight };
                } else {
                    return { ...o, isCropped: false };
                }
            }
            return o;
        }));
    };

    const toggleFlipX = (id: string) => {
        setObjects(prev => prev.map(o => o.id === id && o.type === 'image' ? { ...o, isFlippedX: !o.isFlippedX } : o));
    };

    const selectedObject = objects.find(obj => obj.id === selectedId);

    return (
        <DashboardShell>
            <div className="flex h-[calc(100vh-64px)] w-full bg-[#F3F4F6] text-[13px] overflow-hidden font-sans selection:bg-blue-500/30">
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
                <div className="flex-1 flex flex-col relative min-w-0" onPointerDown={() => setSelectedId(null)}>
                    {/* Top Bar */}
                    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shrink-0" onPointerDown={e => e.stopPropagation()}>
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
                            {user && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="relative h-8 w-8 rounded-full p-0 outline-none focus:ring-2 focus:ring-[#00C4CC] focus:ring-offset-2">
                                            <Avatar className="h-8 w-8" key={profile?.avatar_url || 'default'}>
                                                <AvatarImage
                                                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=6366f1&color=fff`}
                                                    alt={profile?.full_name || 'User'}
                                                />
                                                <AvatarFallback className="bg-blue-500 text-white">
                                                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {profile?.full_name || user.email}
                                                </p>
                                                {profile?.full_name && (
                                                    <p className="text-xs leading-none text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                )}
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/social/swipe" className="cursor-pointer">
                                                <Heart className="mr-2 h-4 w-4" />
                                                <span>Discover</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/social/matches" className="cursor-pointer">
                                                <Users className="mr-2 h-4 w-4" />
                                                <span>Matches</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/social/likes" className="cursor-pointer">
                                                <ThumbsUp className="mr-2 h-4 w-4" />
                                                <span>Likes</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/social/profile" className="cursor-pointer">
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-default focus:bg-transparent">
                                            <Wallet className="mr-2 h-4 w-4 text-emerald-500" />
                                            <span className="text-xs font-bold uppercase tracking-tight italic">Credits: {profile?.wallet_balance || '0'}</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sign out</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 overflow-auto relative bg-[#F3F4F6] flex items-center justify-center p-12">
                        {/* Simulated Rulers */}
                        <div className="absolute top-0 left-0 right-0 h-4 border-b border-gray-200 bg-white flex items-center overflow-hidden z-10 px-4">
                            {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(m => (
                                <div key={m} className="absolute text-[8px] text-gray-400 border-l border-gray-200 h-full pt-1 pl-0.5" style={{ left: m + 16 }}>{m}</div>
                            ))}
                        </div>
                        <div className="absolute top-0 left-0 bottom-0 w-4 border-r border-gray-200 bg-white flex flex-col items-center overflow-hidden z-10 py-4">
                            {[0, 100, 200, 300, 400, 500, 600, 700, 800].map(m => (
                                <div key={m} className="absolute text-[8px] text-gray-400 border-t border-gray-200 w-full pl-0.5 pt-0.5" style={{ top: m + 16 }}>{m}</div>
                            ))}
                        </div>

                        {/* Interactive Selection Canvas */}
                        <div
                            id="canvas"
                            className="bg-white shadow-2xl relative overflow-hidden"
                            style={{ width: 800, height: 600 }}
                            onPointerDown={() => setSelectedId(null)}
                        >
                            {/* Objects List */}
                            {objects.map((obj) => (
                                <div
                                    key={obj.id}
                                    id={`obj-${obj.id}`}
                                    onPointerDown={(e) => handleDragStart(e, obj.id)}
                                    className={`absolute cursor-move select-none transition-shadow group ${selectedId === obj.id ? 'ring-2 ring-[#00C4CC] ring-offset-0 z-50 shadow-xl' : 'z-0 hover:ring-1 hover:ring-gray-300'}`}
                                    style={{
                                        left: obj.x,
                                        top: obj.y,
                                        width: obj.width,
                                        height: obj.type === 'text' ? 'auto' : obj.height,
                                        zIndex: obj.zIndex || 0,
                                        opacity: obj.opacity || 1
                                    }}
                                >
                                    {obj.type === 'image' && (
                                        <div className={`relative w-full h-full ${obj.isCropped ? 'overflow-hidden' : ''}`} style={{ filter: getFilterString(obj) }}>
                                            <img
                                                src={obj.src}
                                                alt="Canvas Object"
                                                className={`w-full h-full object-cover select-none pointer-events-none ${obj.isFlippedX ? 'scale-x-[-1]' : ''}`}
                                            />
                                        </div>
                                    )}

                                    {obj.type === 'text' && (
                                        <div
                                            className="w-full text-center break-words focus:outline-none"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => handleTextChange(obj.id, e.currentTarget.textContent || '')}
                                            style={{
                                                fontSize: obj.fontSize,
                                                color: obj.color,
                                                fontWeight: 'bold',
                                                textShadow: obj.textShadow,
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {obj.text}
                                        </div>
                                    )}

                                    {obj.type === 'shape' && (
                                        <div
                                            className="w-full h-full"
                                            style={{
                                                backgroundColor: obj.backgroundColor,
                                                borderRadius: obj.shapeType === 'circle' ? '50%' : '0%'
                                            }}
                                        />
                                    )}

                                    {obj.type === 'frame' && (
                                        <div
                                            className="w-full h-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
                                            style={{
                                                borderRadius: obj.frameType === 'circle' ? '50%' : '0%'
                                            }}
                                        >
                                            <ImageIcon size={32} className="text-gray-200" />
                                        </div>
                                    )}

                                    {/* Selection Handles */}
                                    {selectedId === obj.id && (
                                        <>
                                            <div
                                                className="absolute -right-2 -bottom-2 w-4 h-4 bg-white border-2 border-[#00C4CC] rounded-full cursor-nwse-resize z-[51] shadow-md"
                                                onPointerDown={(e) => handleResizeStart(e, obj.id)}
                                            />
                                            {/* Action Bar Overlay */}
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-lg shadow-xl border border-gray-100 p-1 flex items-center gap-1 opacity-100 transition-opacity whitespace-nowrap z-[60]">
                                                {obj.type === 'image' && (
                                                    <button onClick={() => toggleCrop(obj.id)} className={`p-1.5 rounded hover:bg-gray-100 ${obj.isCropped ? 'text-[#00C4CC]' : 'text-gray-600'}`}>
                                                        <Crop size={16} />
                                                    </button>
                                                )}
                                                {obj.type === 'image' && (
                                                    <button onClick={() => toggleFlipX(obj.id)} className={`p-1.5 rounded hover:bg-gray-100 ${obj.isFlippedX ? 'text-[#00C4CC]' : 'text-gray-600'}`}>
                                                        <FlipHorizontal size={16} />
                                                    </button>
                                                )}
                                                <button onClick={duplicateSelected} className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
                                                    <Copy size={16} />
                                                </button>
                                                <button onClick={() => setObjects(prev => prev.filter(o => o.id !== obj.id))} className="p-1.5 rounded hover:bg-red-50 text-red-500">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>
                                                <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Icon Strip */}
                <div className="w-[72px] bg-[#F8F9FA] border-l border-gray-200 flex flex-col items-center py-4 z-20 shrink-0">
                    <div className="text-xs font-semibold text-gray-800 mb-4">Layers</div>

                    {/* Layer thumbnails */}
                    <div className="flex flex-col gap-3 w-full px-2 mb-6 text-gray-400 overflow-y-auto max-h-[40vh] custom-scrollbar">
                        {[...objects].reverse().map(obj => (
                            <div
                                key={obj.id}
                                draggable
                                onDragStart={(e) => handleLayerDragStart(e, obj.id)}
                                onDragOver={handleLayerDragOver}
                                onDrop={(e) => handleLayerDrop(e, obj.id)}
                                onClick={() => setSelectedId(obj.id)}
                                className={`aspect-video bg-white rounded border-2 overflow-hidden relative cursor-pointer flex items-center justify-center ${selectedId === obj.id ? 'border-[#00C4CC]' : 'border-transparent hover:border-gray-300'} ${draggedLayerId === obj.id ? 'opacity-50' : ''}`}
                            >
                                {obj.type === 'image' && <img src={obj.src} alt="Layer" className="w-full h-full object-cover pointer-events-none" style={{ filter: getFilterString(obj) }} />}
                                {obj.type === 'shape' && (
                                    <div className="w-8 h-8 pointer-events-none" style={{ backgroundColor: obj.backgroundColor, borderRadius: obj.shapeType === 'circle' ? '50%' : '0%' }} />
                                )}
                                {obj.type === 'frame' && (
                                    <div className="w-8 h-8 bg-gray-100 flex items-center justify-center pointer-events-none" style={{ borderRadius: obj.frameType === 'circle' ? '50%' : '0%' }}>
                                        <ImageIcon size={16} className="text-gray-300" />
                                    </div>
                                )}
                                {obj.type === 'text' && <TypeIcon size={20} className="text-gray-400 pointer-events-none" />}
                            </div>
                        ))}
                    </div>

                    <div className="w-8 h-[1px] bg-gray-200 mb-4"></div>

                    <div className="flex-1 overflow-y-auto w-full">
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

                {/* Right Panel - Properties */}
                <div className={`w-[260px] bg-white border-l border-gray-200 p-4 overflow-y-auto ${activeRightTab ? 'block' : 'hidden'}`}>
                    {activeRightTab === 'filters' && (
                        <div className="flex flex-col gap-6">
                            <FilterSection title="Quality" filters={QUALITY_FILTERS} onSelect={applyFilter} activeFilter={selectedObject?.filter || ''} />
                            <FilterSection title="Delicacy" filters={DELICACY_FILTERS} onSelect={applyFilter} activeFilter={selectedObject?.filter || ''} />
                            <FilterSection title="Retro" filters={RETRO_FILTERS} onSelect={applyFilter} activeFilter={selectedObject?.filter || ''} />
                            <FilterSection title="Classic" filters={CLASSIC_FILTERS} onSelect={applyFilter} activeFilter={selectedObject?.filter || ''} />
                        </div>
                    )}

                    {activeRightTab === 'effects' && (
                        <div className="flex flex-col gap-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Visual Effects</h3>
                            {['Blur', 'Drop Shadow', 'Glow', 'Outline', 'Vignette'].map(effect => (
                                <button
                                    key={effect}
                                    onClick={() => applyEffect(effect)}
                                    className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-[#00C4CC] hover:bg-gray-50 transition-all text-gray-700"
                                >
                                    <span className="font-medium">{effect}</span>
                                    <Sparkles size={16} className="text-gray-400" />
                                </button>
                            ))}
                        </div>
                    )}

                    {['remove_bg', 'adjust', 'smart_tools', 'opacity', 'arrange'].includes(activeRightTab) && (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-center">
                            <Cpu size={32} className="opacity-20 mb-2" />
                            <p className="text-xs">Advanced processing tools are being initialized.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardShell>
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
