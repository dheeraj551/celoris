"use client"

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/home-new/DashboardShell";


// Components
import Sidebar from './components/Sidebar';
import SecondarySidebar from './components/SecondarySidebar';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Timeline from './components/Timeline';
import PropertiesPanel from './components/PropertiesPanel';

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
    scaleX?: number;
    scaleY?: number;
    rotation?: number;
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

    const [activeTab, setActiveTab] = useState('captions');
    const [textElement, setTextElement] = useState<TextElement>(initialTextElement);

    // Toolbar state
    const [activeTool, setActiveTool] = useState<'pointer' | 'hand'>('pointer');
    const [canvasZoom, setCanvasZoom] = useState(100);

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(596); // Big Buck Bunny duration

    // Video state
    const [videoSrc, setVideoSrc] = useState<string>("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
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

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                redo();
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
        <DashboardShell>
            <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#0e0e0e] text-gray-300 font-sans overflow-hidden">
                <Header
                    activeTool={activeTool}
                    setActiveTool={setActiveTool}
                    canvasZoom={canvasZoom}
                    setCanvasZoom={setCanvasZoom}
                    undo={undo}
                    redo={redo}
                    canUndo={historyIndex > 0}
                    canRedo={historyIndex < history.length - 1}
                />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                    <SecondarySidebar
                        activeTab={activeTab}
                        setVideoSrc={setVideoSrc}
                        setVideoName={setVideoName}
                        setDuration={setDuration}
                        setClips={setClips}
                        currentTime={currentTime}
                        selectedClipId={selectedClipId}
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
                        />
                        <PropertiesPanel
                            textElement={textElement}
                            setTextElement={setTextElement}
                            clips={clips}
                            setClips={setClips}
                            selectedClipId={selectedClipId}
                            duration={duration}
                        />
                    </div>
                </div>
            </div>
        </DashboardShell>
    );
}
