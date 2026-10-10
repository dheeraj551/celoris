"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/home-new/DashboardShell";


// Components
import Sidebar from './components/Sidebar';
import SecondarySidebar from './components/SecondarySidebar';
import Header from './components/Header';
import Canvas, { AspectRatioType } from './components/Canvas';
import Timeline from './components/Timeline';
import PropertiesPanel from './components/PropertiesPanel';
import { CDanceStudio } from './components/CDanceStudio';
import ShortcutsModal from './components/ShortcutsModal';

export interface Clip {
    id: string;
    type: 'text' | 'video' | 'audio';
    start: number; // in seconds
    end: number; // in seconds
    content: string;
    color: string;
    trackIndex: number;
    transition?: string;
    mediaOffset?: number; // in seconds, how much of the source media is skipped

    // Video Effects
    blur?: number;
    brightness?: number;
    contrast?: number;
    saturation?: number;
    hueRotate?: number;
    sepia?: number;
    grayscale?: number;
    invert?: number;
    scaleX?: number;
    scaleY?: number;
    rotation?: number;

    // FilmCraft Lumetri Color Engine
    temperature?: number; // -100 (cool/cyan) to +100 (warm/amber)
    tint?: number; // -100 (green) to +100 (magenta)
    exposure?: number; // -100 to +100
    highlights?: number; // -100 to +100
    shadows?: number; // -100 to +100
    whites?: number; // -100 to +100
    blacks?: number; // -100 to +100
    vignetteAmount?: number; // 0 to 100
    lookPreset?: 'none' | 'teal-orange' | 'kodak-vintage' | 'cyberpunk' | 'golden-hour' | 'noir' | 'bleach-bypass';

    // Effect Preset & Overlays
    effectPreset?: string;
    effectIntensity?: number;
    overlayFx?: 'none' | 'vignette' | 'grain' | 'scanlines' | 'rgb-split' | 'light-leak';
}

/**
 * Compute unified CSS filter string from standard and Lumetri color parameters
 */
export function computeLumetriFilter(clip: Clip): string {
    let filterString = '';

    // Blur
    if (clip.blur) filterString += `blur(${clip.blur}px) `;

    // Exposure & Brightness
    const exposureFactor = (clip.exposure ?? 0) * 0.5;
    const baseBrightness = clip.brightness ?? 100;
    const finalBrightness = Math.max(0, Math.min(250, baseBrightness + exposureFactor));
    if (finalBrightness !== 100) filterString += `brightness(${finalBrightness}%) `;

    // Contrast & Highlights/Shadows
    const contrastFactor = ((clip.highlights ?? 0) - (clip.shadows ?? 0)) * 0.25;
    const baseContrast = clip.contrast ?? 100;
    const finalContrast = Math.max(0, Math.min(250, baseContrast + contrastFactor));
    if (finalContrast !== 100) filterString += `contrast(${finalContrast}%) `;

    // Saturation
    if (clip.saturation !== undefined && clip.saturation !== 100) {
        filterString += `saturate(${clip.saturation}%) `;
    }

    // Temperature (warm sepia vs cool cyan)
    const temp = clip.temperature ?? 0;
    if (temp > 0) {
        filterString += `sepia(${Math.round(temp * 0.35)}%) `;
    } else if (temp < 0) {
        filterString += `hue-rotate(${Math.round(temp * 0.15)}deg) `;
    }

    // Tint (green vs magenta)
    const tint = clip.tint ?? 0;
    if (tint !== 0) {
        filterString += `hue-rotate(${Math.round(tint * 0.25)}deg) `;
    }

    // Custom Hue Rotate
    if (clip.hueRotate !== undefined && clip.hueRotate !== 0) {
        filterString += `hue-rotate(${clip.hueRotate}deg) `;
    }

    // Sepia, Grayscale, Invert
    if (clip.sepia) filterString += `sepia(${clip.sepia}%) `;
    if (clip.grayscale) filterString += `grayscale(${clip.grayscale}%) `;
    if (clip.invert) filterString += `invert(${clip.invert}%) `;

    // FilmCraft Looks Presets
    if (clip.lookPreset === 'teal-orange') {
        filterString += 'contrast(120%) saturate(125%) ';
    } else if (clip.lookPreset === 'kodak-vintage') {
        filterString += 'sepia(25%) contrast(110%) saturate(110%) ';
    } else if (clip.lookPreset === 'cyberpunk') {
        filterString += 'contrast(135%) saturate(145%) hue-rotate(20deg) ';
    } else if (clip.lookPreset === 'golden-hour') {
        filterString += 'sepia(35%) saturate(130%) brightness(105%) ';
    } else if (clip.lookPreset === 'noir') {
        filterString += 'grayscale(100%) contrast(140%) ';
    } else if (clip.lookPreset === 'bleach-bypass') {
        filterString += 'contrast(140%) saturate(60%) brightness(110%) ';
    }

    return filterString.trim();
}

export interface TextElement {
    text: string;
    fontSize: number;
    fontFamily: string;
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    fill: string;
    opacity: number;
    scale: number;
    x: number;
    y: number;
    rotation: number;
    animation?: string;
    hasStroke?: boolean;
    strokeColor?: string;
    strokeWidth?: number;
    hasBackground?: boolean;
    backgroundColor?: string;
    backgroundPadding?: number;
    backgroundRadius?: number;
    hasShadow?: boolean;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
}

const initialTextElement: TextElement = {
    text: 'Celoris Web',
    fontSize: 120,
    fontFamily: 'sans-serif',
    isBold: true,
    isItalic: false,
    isUnderline: false,
    fill: '#ffffff',
    opacity: 100,
    scale: 100,
    x: 50, // percentage
    y: 50, // percentage
    rotation: 0,
    animation: 'none',
    hasStroke: false,
    strokeColor: '#000000',
    strokeWidth: 2,
    hasBackground: false,
    backgroundColor: '#000000',
    backgroundPadding: 10,
    backgroundRadius: 8,
    hasShadow: false,
    shadowColor: '#000000',
    shadowBlur: 10,
    shadowOffsetX: 5,
    shadowOffsetY: 5
};

export default function VideoStudio() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [viewMode, setViewMode] = useState<'editor' | 'cdance'>('editor');
    const [activeTab, setActiveTab] = useState('captions');
    const [textElement, setTextElement] = useState<TextElement>(initialTextElement);

    // Toolbar state
    const [activeTool, setActiveTool] = useState<'pointer' | 'hand'>('pointer');
    const [canvasZoom, setCanvasZoom] = useState(100);
    const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(596); // Big Buck Bunny duration

    // Video state
    const [videoSrc, setVideoSrc] = useState<string>("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
    const [videoName, setVideoName] = useState<string>("Big Buck Bunny");

    // Timeline clips
    const initialClips: Clip[] = [
        { id: '1', type: 'text', start: 0, end: 30, content: 'Celoris Web', color: '#e67e22', trackIndex: 0 },
        { id: '2', type: 'text', start: 31, end: 60, content: 'Text', color: '#e67e22', trackIndex: 0 },
        { id: '3', type: 'video', start: 0, end: 596, content: 'Big Buck Bunny', color: '#2c3e50', trackIndex: 1 },
        { id: '4', type: 'audio', start: 0, end: 45, content: 'Lazy Sunday', color: '#1abc9c', trackIndex: 2 },
    ];
    const [clips, setClips] = useState<Clip[]>(initialClips);
    const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

    // FilmCraft Pro NLE State
    const [markIn, setMarkIn] = useState<number | null>(null);
    const [markOut, setMarkOut] = useState<number | null>(null);
    const [showShortcutsModal, setShowShortcutsModal] = useState(false);
    const [showScopes, setShowScopes] = useState(false);
    const [masterVolume, setMasterVolume] = useState(1);
    const [masterMuted, setMasterMuted] = useState(false);

    // Exporting state
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    // Download handler
    const handleDownload = async () => {
        setIsExporting(true);
        setExportProgress(0);

        try {
            // Create hidden video element to load and play the source video cleanly
            const sourceVideo = document.createElement('video');
            sourceVideo.src = videoSrc;
            sourceVideo.muted = true;
            sourceVideo.playsInline = true;
            sourceVideo.crossOrigin = 'anonymous';

            await new Promise<void>((resolve, reject) => {
                sourceVideo.onloadedmetadata = () => resolve();
                sourceVideo.onerror = (e) => reject(e);
            });

            // Set canvas size for vertical video (9:16, e.g., 720x1280)
            const width = 720;
            const height = 1280;
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not get canvas context");

            // Setup stream and MediaRecorder (prefer mp4 if supported, otherwise webm)
            const stream = canvas.captureStream(30); // 30 fps
            let options = { mimeType: 'video/webm;codecs=vp9' };
            
            // Check browser support and set options
            if (typeof MediaRecorder !== 'undefined') {
                if (MediaRecorder.isTypeSupported('video/mp4')) {
                    options = { mimeType: 'video/mp4' };
                } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
                    options = { mimeType: 'video/webm;codecs=h264' };
                }
            }

            let recorder: MediaRecorder;
            try {
                recorder = new MediaRecorder(stream, options);
            } catch (e) {
                recorder = new MediaRecorder(stream); // fallback
            }

            const chunks: Blob[] = [];
            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunks.push(e.data);
            };

            const exportDuration = duration || sourceVideo.duration || 10;
            
            // Start recording
            recorder.start();

            // Seek to start
            sourceVideo.currentTime = 0;
            await sourceVideo.play();

            const renderFrame = () => {
                if (sourceVideo.paused || sourceVideo.ended || sourceVideo.currentTime >= exportDuration) {
                    if (recorder.state !== 'inactive') {
                        recorder.stop();
                    }
                    return;
                }

                // Update progress
                const progress = Math.min(Math.round((sourceVideo.currentTime / exportDuration) * 99), 99);
                setExportProgress(progress);

                ctx.clearRect(0, 0, width, height);

                // 1. Draw active video clip
                const currentT = sourceVideo.currentTime;
                const activeVideo = clips.find(c => c.type === 'video' && currentT >= c.start && currentT <= c.end);

                ctx.save();
                if (activeVideo) {
                    // Apply filters including Lumetri Color Engine
                    const filterString = computeLumetriFilter(activeVideo);
                    if (filterString) {
                        ctx.filter = filterString;
                    }

                    // Apply transformation
                    const scaleX = (activeVideo.scaleX ?? 100) / 100;
                    const scaleY = (activeVideo.scaleY ?? 100) / 100;
                    const rotation = (activeVideo.rotation ?? 0) * Math.PI / 180;

                    ctx.translate(width / 2, height / 2);
                    ctx.rotate(rotation);
                    ctx.scale(scaleX, scaleY);
                    
                    // Draw centered cover-style video frame
                    const vAspect = sourceVideo.videoWidth / sourceVideo.videoHeight;
                    const cAspect = width / height;
                    let drawW = width;
                    let drawH = height;
                    if (vAspect > cAspect) {
                        drawW = height * vAspect;
                    } else {
                        drawH = width / vAspect;
                    }
                    ctx.drawImage(sourceVideo, -drawW / 2, -drawH / 2, drawW, drawH);

                    // Overlay FX & FilmCraft Vignette
                    const hasVignette = activeVideo.overlayFx === 'vignette' || (activeVideo.vignetteAmount && activeVideo.vignetteAmount > 0);
                    if (hasVignette) {
                        const radius = Math.max(drawW, drawH) / 2;
                        const vigAmount = (activeVideo.vignetteAmount ?? 85) / 100;
                        const vigGrad = ctx.createRadialGradient(0, 0, radius * 0.4, 0, 0, radius);
                        vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
                        vigGrad.addColorStop(1, `rgba(0,0,0,${Math.min(0.95, vigAmount)})`);
                        ctx.save();
                        ctx.filter = 'none';
                        ctx.fillStyle = vigGrad;
                        ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
                        ctx.restore();
                    } else if (activeVideo.overlayFx === 'light-leak') {
                        const leakGrad = ctx.createRadialGradient(drawW / 3, -drawH / 3, 0, drawW / 3, -drawH / 3, drawW * 0.7);
                        leakGrad.addColorStop(0, 'rgba(251, 146, 60, 0.5)');
                        leakGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.2)');
                        leakGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                        ctx.save();
                        ctx.filter = 'none';
                        ctx.globalCompositeOperation = 'screen';
                        ctx.fillStyle = leakGrad;
                        ctx.fillRect(-drawW / 2, -drawH / 2, drawW, drawH);
                        ctx.restore();
                    }
                } else {
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, width, height);
                }
                ctx.restore();

                // 2. Draw text overlay
                const textClip = clips.find(c => c.type === 'text' && currentT >= c.start && currentT <= c.end);
                if (textClip) {
                    ctx.save();
                    
                    const posX = (textElement.x / 100) * width;
                    const posY = (textElement.y / 100) * height;
                    const scale = textElement.scale / 100;
                    const rotation = (textElement.rotation ?? 0) * Math.PI / 180;

                    ctx.translate(posX, posY);
                    ctx.rotate(rotation);
                    ctx.scale(scale, scale);

                    ctx.font = `${textElement.isItalic ? 'italic ' : ''}${textElement.isBold ? 'bold ' : ''}${textElement.fontSize}px ${textElement.fontFamily || 'sans-serif'}`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const text = textElement.text || textClip.content;
                    const textWidth = ctx.measureText(text).width;
                    const textHeight = textElement.fontSize;

                    // Background Box
                    if (textElement.hasBackground) {
                        const padding = textElement.backgroundPadding ?? 10;
                        const radius = textElement.backgroundRadius ?? 8;
                        ctx.fillStyle = textElement.backgroundColor || '#000000';
                        
                        const rx = -textWidth / 2 - padding;
                        const ry = -textHeight / 2 - padding;
                        const rw = textWidth + padding * 2;
                        const rh = textHeight + padding * 2;
                        ctx.beginPath();
                        if (ctx.roundRect) {
                            ctx.roundRect(rx, ry, rw, rh, radius);
                        } else {
                            ctx.rect(rx, ry, rw, rh);
                        }
                        ctx.fill();
                    }

                    // Shadow Setup
                    if (textElement.hasShadow) {
                        ctx.shadowColor = textElement.shadowColor || 'rgba(0,0,0,0.5)';
                        ctx.shadowBlur = textElement.shadowBlur ?? 10;
                        ctx.shadowOffsetX = textElement.shadowOffsetX ?? 5;
                        ctx.shadowOffsetY = textElement.shadowOffsetY ?? 5;
                    }

                    // Draw Text
                    ctx.fillStyle = textElement.fill || '#ffffff';
                    ctx.fillText(text, 0, 0);

                    // Draw Stroke
                    if (textElement.hasStroke) {
                        ctx.strokeStyle = textElement.strokeColor || '#000000';
                        ctx.lineWidth = textElement.strokeWidth ?? 2;
                        ctx.strokeText(text, 0, 0);
                    }

                    ctx.restore();
                }

                requestAnimationFrame(renderFrame);
            };

            // Wait for recording to complete
            await new Promise<void>((resolve) => {
                recorder.onstop = () => resolve();
                requestAnimationFrame(renderFrame);
            });

            sourceVideo.pause();
            setExportProgress(100);

            // Generate blob and download file
            const videoBlob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
            const downloadUrl = URL.createObjectURL(videoBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            
            const isMp4 = recorder.mimeType.includes('mp4');
            a.download = `${videoName.split('.')[0]}_edited.${isMp4 ? 'mp4' : 'webm'}`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Advanced render export failed, using fallback direct download", error);
            const a = document.createElement('a');
            a.href = videoSrc;
            a.target = '_blank';
            a.download = videoName;
            a.click();
        } finally {
            setTimeout(() => {
                setIsExporting(false);
            }, 1000);
        }
    };

    // History state for undo/redo
    const [history, setHistory] = useState<{ textElement: TextElement, clips: Clip[] }[]>([{ textElement: initialTextElement, clips: initialClips }]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Ref to track if the current change should be added to history
    const isInternalUpdate = useRef(false);

    // Effect to add to history when clips or textElement changes
    useEffect(() => {
        if (isInternalUpdate.current) {
            isInternalUpdate.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            setHistory(prevHistory => {
                const current = prevHistory[historyIndex];
                if (!current) return prevHistory;

                const hasChanged =
                    JSON.stringify(current.textElement) !== JSON.stringify(textElement) ||
                    JSON.stringify(current.clips) !== JSON.stringify(clips);

                if (hasChanged) {
                    const newHistory = prevHistory.slice(0, historyIndex + 1);
                    newHistory.push({ textElement, clips });
                    if (newHistory.length > 50) newHistory.shift();

                    // We update the index separately to avoid stale state issues
                    setTimeout(() => setHistoryIndex(newHistory.length - 1), 0);
                    return newHistory;
                }
                return prevHistory;
            });
        }, 500); // Debounce history entries

        return () => clearTimeout(timeout);
    }, [textElement, clips, historyIndex]);

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            isInternalUpdate.current = true;
            setHistoryIndex(newIndex);
            setTextElement(history[newIndex].textElement);
            setClips(history[newIndex].clips);
        }
    }, [historyIndex, history]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            isInternalUpdate.current = true;
            setHistoryIndex(newIndex);
            setTextElement(history[newIndex].textElement);
            setClips(history[newIndex].clips);
        }
    }, [historyIndex, history]);

    // Keyboard shortcuts for undo/redo and FilmCraft hotkeys
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                redo();
            } else if (e.key === '?') {
                setShowShortcutsModal(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0e0e0e] text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00a8ff]"></div>
            </div>
        );
    }

    return (
        <DashboardShell hideTopBar>
            <div className="flex flex-col h-screen w-full bg-[#0e0e0e] text-gray-300 font-sans overflow-hidden">
                <Header
                    activeTool={activeTool}
                    setActiveTool={setActiveTool}
                    canvasZoom={canvasZoom}
                    setCanvasZoom={setCanvasZoom}
                    undo={undo}
                    redo={redo}
                    canUndo={historyIndex > 0}
                    canRedo={historyIndex < history.length - 1}
                    onDownload={handleDownload}
                    isExporting={isExporting}
                    viewMode={viewMode}
                    onViewModeChange={(mode) => {
                        setViewMode(mode);
                        if (mode === 'cdance') setActiveTab('cdance');
                        else if (activeTab === 'cdance') setActiveTab('captions');
                    }}
                    onOpenShortcuts={() => setShowShortcutsModal(true)}
                    showScopes={showScopes}
                    onToggleScopes={() => setShowScopes(prev => !prev)}
                />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar 
                        activeTab={viewMode === 'cdance' ? 'cdance' : activeTab} 
                        setActiveTab={(tab) => {
                            if (tab === 'cdance') {
                                setViewMode('cdance');
                                setActiveTab('cdance');
                            } else {
                                setViewMode('editor');
                                setActiveTab(tab);
                            }
                        }} 
                    />

                    {viewMode === 'cdance' ? (
                        <CDanceStudio 
                            onInsertToTimeline={(url, title) => {
                                const newClipId = `clip-${Date.now()}`;
                                const newClip: Clip = {
                                    id: newClipId,
                                    type: 'video',
                                    start: 0,
                                    end: 15,
                                    content: title,
                                    color: '#ccff00',
                                    trackIndex: 1
                                };
                                setVideoSrc(url);
                                setVideoName(title);
                                setDuration(15);
                                setClips(prev => [newClip, ...prev.filter(c => c.type !== 'video')]);
                                setViewMode('editor');
                                setActiveTab('captions');
                            }}
                            onBackToEditor={() => {
                                setViewMode('editor');
                                setActiveTab('captions');
                            }}
                        />
                    ) : (
                        <>
                            <SecondarySidebar
                                activeTab={activeTab}
                                setVideoSrc={setVideoSrc}
                                setVideoName={setVideoName}
                                setDuration={setDuration}
                                clips={clips}
                                setClips={setClips}
                                currentTime={currentTime}
                                selectedClipId={selectedClipId}
                                setSelectedClipId={setSelectedClipId}
                                videoSrc={videoSrc}
                                setTextElement={setTextElement}
                                setAspectRatio={setAspectRatio}
                                setCurrentTime={setCurrentTime}
                            />

                            <div className="flex flex-col flex-1 overflow-hidden relative">
                                <Canvas
                                    textElement={textElement}
                                    setTextElement={setTextElement}
                                    activeTool={activeTool}
                                    canvasZoom={canvasZoom}
                                    setCanvasZoom={setCanvasZoom}
                                    isPlaying={isPlaying}
                                    currentTime={currentTime}
                                    setCurrentTime={setCurrentTime}
                                    videoSrc={videoSrc}
                                    setDuration={setDuration}
                                    clips={clips}
                                    aspectRatio={aspectRatio}
                                    setAspectRatio={setAspectRatio}
                                    showScopes={showScopes}
                                    setShowScopes={setShowScopes}
                                    masterVolume={masterVolume}
                                    setMasterVolume={setMasterVolume}
                                    masterMuted={masterMuted}
                                    setMasterMuted={setMasterMuted}
                                />
                                <Timeline
                                    isPlaying={isPlaying}
                                    setIsPlaying={setIsPlaying}
                                    currentTime={currentTime}
                                    setCurrentTime={setCurrentTime}
                                    duration={duration}
                                    setDuration={setDuration}
                                    videoName={videoName}
                                    clips={clips}
                                    setClips={setClips}
                                    selectedClipId={selectedClipId}
                                    setSelectedClipId={setSelectedClipId}
                                    markIn={markIn}
                                    setMarkIn={setMarkIn}
                                    markOut={markOut}
                                    setMarkOut={setMarkOut}
                                    onOpenShortcuts={() => setShowShortcutsModal(true)}
                                />
                                <PropertiesPanel
                                    textElement={textElement}
                                    setTextElement={setTextElement}
                                    clips={clips}
                                    setClips={setClips}
                                    selectedClipId={selectedClipId}
                                    duration={duration}
                                    showScopes={showScopes}
                                    onToggleScopes={() => setShowScopes(prev => !prev)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {isExporting && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999]">
                    <div className="bg-[#121212]/95 border border-white/10 p-8 rounded-2xl w-[400px] flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#00a8ff]/10 blur-[120px] rounded-full"></div>
                        
                        {/* Spinner icon or animating circle */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>
                            <div 
                                className="absolute inset-0 border-4 border-t-[#00a8ff] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"
                                style={{ animationDuration: '1s' }}
                            ></div>
                            <span className="text-xl font-bold text-white">{exportProgress}%</span>
                        </div>
                        
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-white mb-1">Rendering Video</h3>
                            <p className="text-sm text-gray-400">Compiling your tracks, texts, and filters...</p>
                        </div>
                        
                        {/* Progress bar container */}
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="bg-gradient-to-r from-[#00a8ff] to-[#00d2ff] h-full transition-all duration-300 ease-out"
                                style={{ width: `${exportProgress}%` }}
                            ></div>
                        </div>
                        
                        <p className="text-xs text-gray-500 italic">Do not close this tab. Your download will start automatically.</p>
                    </div>
                </div>
            )}

            {/* FilmCraft Shortcuts Cheat Sheet Modal */}
            <ShortcutsModal
                isOpen={showShortcutsModal}
                onClose={() => setShowShortcutsModal(false)}
            />
        </DashboardShell>
    );
}
