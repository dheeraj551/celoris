"use client"

import React, { useState, useRef } from 'react';
import { Box, CircleDashed, Cylinder, Hexagon, Sparkles, Image as ImageIcon, Download, Settings2, Upload, X, Undo2, Redo2, Rotate3D, History, Orbit } from 'lucide-react';
import ModelViewer from './ModelViewer';
import { generateTexture } from '@/lib/celoris-3d/geminiService';
import { generate3DModelMock } from '@/lib/celoris-3d/mock3DService';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type ShapeType = 'sphere' | 'cube' | 'cylinder' | 'torus';

interface GenerationState {
  textureUrl: string | null;
  modelUrl: string | null;
  mode: 'texture' | 'mesh';
  prompt: string;
  imagePreview: string | null;
  shape: ShapeType;
  baseColor: string;
  emissiveColor: string;
}

const initialState: GenerationState = {
  textureUrl: null,
  modelUrl: null,
  mode: 'mesh',
  prompt: '',
  imagePreview: null,
  shape: 'sphere',
  baseColor: '#ffffff',
  emissiveColor: '#000000'
};

export default function Celoris3D() {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'texture' | 'mesh'>('mesh');
  const [shape, setShape] = useState<ShapeType>('sphere');
  const [baseColor, setBaseColor] = useState('#ffffff');
  const [emissiveColor, setEmissiveColor] = useState('#000000');
  const [isGenerating, setIsGenerating] = useState(false);
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const [history, setHistory] = useState<GenerationState[]>([initialState]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const applyState = (state: GenerationState) => {
    setTextureUrl(state.textureUrl);
    setModelUrl(state.modelUrl);
    setMode(state.mode);
    setPrompt(state.prompt);
    setImagePreview(state.imagePreview);
    setShape(state.shape);
    setBaseColor(state.baseColor || '#ffffff');
    setEmissiveColor(state.emissiveColor || '#000000');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      applyState(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      applyState(history[newIndex]);
      setHistoryIndex(newIndex);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !imagePreview) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      let base64Data: string | undefined;
      let mimeType: string | undefined;

      if (imagePreview) {
        base64Data = imagePreview.split(',')[1];
        const match = imagePreview.match(/^data:([^;]+);/);
        if (match) {
          mimeType = match[1];
        }
      }

      let newTextureUrl: string | null = null;
      let newModelUrl: string | null = null;

      if (mode === 'texture') {
        newTextureUrl = await generateTexture(prompt, base64Data, mimeType);
        setTextureUrl(newTextureUrl);
        setModelUrl(null);
      } else {
        newModelUrl = await generate3DModelMock(prompt, base64Data);
        setModelUrl(newModelUrl);
        setTextureUrl(null);
      }

      const newState: GenerationState = {
        textureUrl: newTextureUrl,
        modelUrl: newModelUrl,
        mode,
        prompt,
        imagePreview,
        shape,
        baseColor,
        emissiveColor
      };
      
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newState);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate 3D material');
    } finally {
      setIsGenerating(false);
    }
  };

  const shapes: { id: ShapeType; icon: React.ReactNode; label: string }[] = [
    { id: 'sphere', icon: <CircleDashed className="w-5 h-5" />, label: 'Sphere' },
    { id: 'cube', icon: <Box className="w-5 h-5" />, label: 'Cube' },
    { id: 'cylinder', icon: <Cylinder className="w-5 h-5" />, label: 'Cylinder' },
    { id: 'torus', icon: <Hexagon className="w-5 h-5" />, label: 'Torus' },
  ];

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-[#050810]">
      {/* Sidebar Controls */}
      <aside className="w-full lg:w-80 border-r border-white/5 bg-[#0a0f1d]/50 p-6 flex flex-col gap-8 overflow-y-auto shrink-0 custom-scrollbar">
        
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Generation Mode</h2>
          <div className="flex bg-black/50 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setMode('mesh')}
              className={cn("flex-1 text-xs font-bold py-2 rounded-lg transition-all", mode === 'mesh' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white")}
            >
              3D Mesh (Mock)
            </button>
            <button
              onClick={() => setMode('texture')}
              className={cn("flex-1 text-xs font-bold py-2 rounded-lg transition-all", mode === 'texture' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white")}
            >
              Texture (AI)
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Generation Prompt</h2>
          </div>
          
          <div className="relative">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            
            {!imagePreview ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-white/10 rounded-2xl bg-black/30 hover:bg-white/5 hover:border-emerald-500/50 transition-all text-slate-400"
              >
                <Upload className="w-5 h-5" />
                <span className="text-xs font-medium">Upload Image (Optional)</span>
              </button>
            ) : (
              <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-white/10 group">
                <img src={imagePreview} alt="Reference" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={clearImage}
                    className="bg-red-500/80 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe a material, texture, or pattern..."
              className="w-full h-32 bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
            />
            <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">
              {prompt.length}/500
            </div>
          </div>
        </div>

        {mode === 'texture' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Base Geometry</h2>
            <div className="grid grid-cols-2 gap-3">
              {shapes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShape(s.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all",
                    shape === s.id 
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                      : "bg-black/30 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {s.icon}
                  <span className="text-xs font-bold uppercase tracking-tighter">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Material Colors</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Base Color</label>
              <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-xl p-2">
                <input 
                  type="color" 
                  value={baseColor} 
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-[10px] font-mono text-slate-400 uppercase">{baseColor}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Emissive</label>
              <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-xl p-2">
                <input 
                  type="color" 
                  value={emissiveColor} 
                  onChange={(e) => setEmissiveColor(e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <span className="text-[10px] font-mono text-slate-400 uppercase">{emissiveColor}</span>
              </div>
            </div>
          </div>
        </div>

        {history.length > 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-500" />
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">History</h2>
            </div>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {[...history].reverse().map((state, revIndex) => {
                const index = history.length - 1 - revIndex;
                if (index === 0) return null;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      applyState(state);
                      setHistoryIndex(index);
                    }}
                    className={cn(
                      "text-left p-3 rounded-xl border transition-all text-xs",
                      historyIndex === index
                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-100"
                        : "bg-black/30 border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="font-bold truncate mb-1" title={state.prompt}>
                      {state.prompt || "Image reference generation"}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] opacity-60 font-mono uppercase font-bold tracking-tighter">
                      <span>{state.mode}</span>
                      <span>•</span>
                      <span>{state.shape}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
            {error}
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-white/5">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!prompt.trim() && !imagePreview)}
            className="w-full relative group overflow-hidden rounded-2xl bg-emerald-600 px-4 py-4 font-bold uppercase tracking-widest text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
          >
            <div className="flex items-center justify-center gap-2">
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 3D</span>
                </>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* 3D Canvas Area */}
      <section className="flex-1 p-6 relative flex flex-col min-h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Viewport 3D</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleUndo} 
              disabled={historyIndex <= 0 || isGenerating}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors rounded-xl hover:bg-white/5"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleRedo} 
              disabled={historyIndex >= history.length - 1 || isGenerating}
              className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors rounded-xl hover:bg-white/5"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            
            <div className="w-px h-4 bg-white/10 mx-1"></div>

            <button 
              onClick={() => setAutoRotate(!autoRotate)} 
              className={cn(
                "p-2 transition-colors rounded-xl hover:bg-white/5",
                autoRotate ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400 hover:text-white"
              )}
              title={autoRotate ? "Disable Auto-Rotate" : "Enable Auto-Rotate"}
            >
              <Rotate3D className="w-4 h-4" />
            </button>

            <div className="w-px h-4 bg-white/10 mx-1"></div>

            {(textureUrl || modelUrl) && (
              <a 
                href={textureUrl || modelUrl || '#'}
                download={textureUrl ? `celoris-texture-${shape}.png` : `celoris-model.glb`}
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/10"
              >
                <Download className="w-3.5 h-3.5" />
                Export {textureUrl ? 'Texture' : 'Model'}
              </a>
            )}
          </div>
        </div>
        <div className="flex-1 relative">
          <ModelViewer 
            textureUrl={textureUrl} 
            modelUrl={modelUrl}
            shape={shape} 
            isGenerating={isGenerating} 
            baseColor={baseColor}
            emissiveColor={emissiveColor}
            autoRotate={autoRotate}
          />
        </div>
      </section>
    </div>
  );
}
