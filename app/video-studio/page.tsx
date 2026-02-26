"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

// Components
import Sidebar from './components/Sidebar';
import SecondarySidebar from './components/SecondarySidebar';
import Header from './components/Header';
import Canvas from './components/Canvas';
import Timeline from './components/Timeline';
import PropertiesPanel from './components/PropertiesPanel';

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
};

export default function VideoStudio() {
    const { user, profile, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('captions');
    const [textElement, setTextElement] = useState<TextElement>(initialTextElement);

    // Toolbar state
    const [activeTool, setActiveTool] = useState<'pointer' | 'hand'>('pointer');
    const [canvasZoom, setCanvasZoom] = useState(100);

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(596); // Big Buck Bunny duration

    // History state for undo/redo
    const [history, setHistory] = useState<TextElement[]>([initialTextElement]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // Custom setter that updates history
    const handleSetTextElement = (newElementOrUpdater: React.SetStateAction<TextElement>) => {
        setTextElement(prev => {
            const newElement = typeof newElementOrUpdater === 'function'
                ? (newElementOrUpdater as (prevState: TextElement) => TextElement)(prev)
                : newElementOrUpdater;

            // Only add to history if it actually changed
            if (JSON.stringify(prev) !== JSON.stringify(newElement)) {
                const newHistory = history.slice(0, historyIndex + 1);
                newHistory.push(newElement);
                // Keep history size reasonable
                if (newHistory.length > 50) newHistory.shift();
                setHistory(newHistory);
                setHistoryIndex(newHistory.length - 1);
            }

            return newElement;
        });
    };

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setTextElement(history[newIndex]);
        }
    };

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setTextElement(history[newIndex]);
        }
    };

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
    }, [historyIndex, history]);

    const router = useRouter();

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
            />

            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <SecondarySidebar activeTab={activeTab} />

                <div className="flex flex-col flex-1 overflow-hidden relative">
                    <Canvas
                        textElement={textElement}
                        setTextElement={handleSetTextElement}
                        activeTool={activeTool}
                        canvasZoom={canvasZoom}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        setCurrentTime={setCurrentTime}
                    />
                    <Timeline
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        currentTime={currentTime}
                        setCurrentTime={setCurrentTime}
                        duration={duration}
                        setDuration={setDuration}
                    />
                    <PropertiesPanel textElement={textElement} setTextElement={handleSetTextElement} />
                </div>
            </div>
        </div>
    );
}
