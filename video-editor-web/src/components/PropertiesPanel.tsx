import React, { useState } from 'react';
import { X, Type, Wand2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, ChevronDown, RotateCcw, SlidersHorizontal, Scissors } from 'lucide-react';
import { TextElement, Clip } from '../App';

interface PropertiesPanelProps {
  textElement: TextElement;
  setTextElement: React.Dispatch<React.SetStateAction<TextElement>>;
  clips: Clip[];
  setClips: React.Dispatch<React.SetStateAction<Clip[]>>;
  selectedClipId: string | null;
  duration: number;
}

export default function PropertiesPanel({ textElement, setTextElement, clips, setClips, selectedClipId, duration }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const selectedClip = clips.find(c => c.id === selectedClipId);
  const isVideoSelected = selectedClip?.type === 'video';

  // Force active tab to video effects if video is selected and current tab is text-specific
  if (isVideoSelected && ['preset', 'basic', 'text', 'anim'].includes(activeTab)) {
    setActiveTab('video-effects');
  } else if (!isVideoSelected && ['video-effects', 'video-trim'].includes(activeTab)) {
    setActiveTab('basic');
  }

  const handleVideoEffectChange = (effect: string, value: number) => {
    if (selectedClipId) {
      setClips(prev => prev.map(c => 
        c.id === selectedClipId ? { ...c, [effect]: value } : c
      ));
    }
  };

  const handleResetVideoEffects = () => {
    if (selectedClipId) {
      setClips(prev => prev.map(c => 
        c.id === selectedClipId ? {
          ...c,
          blur: 0,
          brightness: 100,
          contrast: 100,
          saturation: 100,
          hueRotate: 0,
          sepia: 0,
          grayscale: 0,
          scaleX: 100,
          scaleY: 100,
          rotation: 0
        } : c
      ));
    }
  };

  const handleTrimChange = (type: 'start' | 'end', value: number) => {
    if (selectedClipId && selectedClip) {
      setClips(prev => prev.map(c => {
        if (c.id === selectedClipId) {
          const currentInPoint = c.mediaOffset || 0;
          const currentOutPoint = currentInPoint + (c.end - c.start);
          
          if (type === 'start') {
            const newInPoint = Math.min(value, currentOutPoint - 1); // Min 1s duration
            const newDuration = currentOutPoint - newInPoint;
            return { ...c, mediaOffset: newInPoint, end: c.start + newDuration };
          } else {
            const newOutPoint = Math.max(value, currentInPoint + 1); // Min 1s duration
            const newDuration = newOutPoint - currentInPoint;
            return { ...c, end: c.start + newDuration };
          }
        }
        return c;
      }));
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextElement(prev => ({ ...prev, text: e.target.value }));
  };

  const toggleBold = () => setTextElement(prev => ({ ...prev, isBold: !prev.isBold }));
  const toggleItalic = () => setTextElement(prev => ({ ...prev, isItalic: !prev.isItalic }));
  const toggleUnderline = () => setTextElement(prev => ({ ...prev, isUnderline: !prev.isUnderline }));

  const handleOpacityChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = Math.round((x / rect.width) * 100);
    setTextElement(prev => ({ ...prev, opacity: percentage }));
  };

  const handleScaleChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = Math.round((x / rect.width) * 200); // 0 to 200%
    setTextElement(prev => ({ ...prev, scale: percentage }));
  };

  return (
    <div className="absolute right-4 top-4 w-[320px] bg-[#1a1a1a] rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[calc(100%-300px)] z-20 overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <h2 className="text-base font-semibold text-white">
          {activeTab === 'preset' && 'Preset'}
          {activeTab === 'basic' && 'Basic'}
          {activeTab === 'text' && 'Text Effects'}
          {activeTab === 'anim' && 'Animation'}
          {activeTab === 'video-effects' && 'Video Effects'}
          {activeTab === 'video-trim' && 'Trim Video'}
        </h2>
        <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Properties Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {activeTab === 'video-effects' && isVideoSelected && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Adjustments</h3>
                <button 
                  className="text-gray-500 hover:text-white transition-colors"
                  onClick={handleResetVideoEffects}
                  title="Reset effects"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Brightness */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Brightness</span>
                    <span>{selectedClip.brightness ?? 100}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="200" 
                    value={selectedClip.brightness ?? 100}
                    onChange={(e) => handleVideoEffectChange('brightness', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Contrast</span>
                    <span>{selectedClip.contrast ?? 100}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="200" 
                    value={selectedClip.contrast ?? 100}
                    onChange={(e) => handleVideoEffectChange('contrast', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Saturation</span>
                    <span>{selectedClip.saturation ?? 100}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="200" 
                    value={selectedClip.saturation ?? 100}
                    onChange={(e) => handleVideoEffectChange('saturation', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Blur */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Blur</span>
                    <span>{selectedClip.blur ?? 0}px</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="20" 
                    value={selectedClip.blur ?? 0}
                    onChange={(e) => handleVideoEffectChange('blur', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Hue Rotate */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Hue Rotate</span>
                    <span>{selectedClip.hueRotate ?? 0}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="360" 
                    value={selectedClip.hueRotate ?? 0}
                    onChange={(e) => handleVideoEffectChange('hueRotate', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Sepia */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Sepia</span>
                    <span>{selectedClip.sepia ?? 0}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={selectedClip.sepia ?? 0}
                    onChange={(e) => handleVideoEffectChange('sepia', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Grayscale */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Grayscale</span>
                    <span>{selectedClip.grayscale ?? 0}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="100" 
                    value={selectedClip.grayscale ?? 0}
                    onChange={(e) => handleVideoEffectChange('grayscale', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Scale X */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Scale X</span>
                    <span>{selectedClip.scaleX ?? 100}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="300" 
                    value={selectedClip.scaleX ?? 100}
                    onChange={(e) => handleVideoEffectChange('scaleX', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Scale Y */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Scale Y</span>
                    <span>{selectedClip.scaleY ?? 100}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" max="300" 
                    value={selectedClip.scaleY ?? 100}
                    onChange={(e) => handleVideoEffectChange('scaleY', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* Rotation */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Rotation</span>
                    <span>{selectedClip.rotation ?? 0}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="360" 
                    value={selectedClip.rotation ?? 0}
                    onChange={(e) => handleVideoEffectChange('rotation', parseInt(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'video-trim' && isVideoSelected && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Trim Video</h3>
              </div>

              <div className="space-y-4">
                {/* Start Time */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Start Point</span>
                    <span>{(selectedClip.mediaOffset || 0).toFixed(1)}s</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max={duration - 1} step="0.1"
                    value={selectedClip.mediaOffset || 0}
                    onChange={(e) => handleTrimChange('start', parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>

                {/* End Time */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>End Point</span>
                    <span>{((selectedClip.mediaOffset || 0) + (selectedClip.end - selectedClip.start)).toFixed(1)}s</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" max={duration} step="0.1"
                    value={(selectedClip.mediaOffset || 0) + (selectedClip.end - selectedClip.start)}
                    onChange={(e) => handleTrimChange('end', parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
                
                <div className="pt-4 border-t border-white/5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Duration</span>
                    <span className="text-white font-medium">{(selectedClip.end - selectedClip.start).toFixed(1)}s</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isVideoSelected && activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Text Input */}
              <div className="space-y-2">
                <textarea 
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg p-3 text-sm text-white resize-none focus:outline-none focus:border-[#00a8ff] transition-colors"
                  rows={2}
                  value={textElement.text}
                  onChange={handleTextChange}
                />
              </div>

          {/* Font Controls */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <select 
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white appearance-none focus:outline-none focus:border-[#00a8ff] transition-colors cursor-pointer"
                  value={textElement.fontFamily}
                  onChange={(e) => setTextElement(prev => ({ ...prev, fontFamily: e.target.value }))}
                >
                  <option value="sans-serif">Albert sans</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <div className="relative w-20">
                <select 
                  className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-2 py-2 text-sm text-white appearance-none focus:outline-none focus:border-[#00a8ff] transition-colors cursor-pointer"
                  value={textElement.fontSize}
                  onChange={(e) => setTextElement(prev => ({ ...prev, fontSize: Number(e.target.value) }))}
                >
                  {[24, 36, 48, 64, 72, 96, 120, 144, 200].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#2a2a2a] border border-white/10 rounded-lg p-1">
              <div className="flex items-center gap-1">
                <button 
                  onClick={toggleBold}
                  className={`p-1.5 rounded text-white font-serif font-bold w-8 h-8 flex items-center justify-center transition-colors ${textElement.isBold ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >B</button>
                <button 
                  onClick={toggleItalic}
                  className={`p-1.5 rounded text-white font-serif italic w-8 h-8 flex items-center justify-center transition-colors ${textElement.isItalic ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >I</button>
                <button 
                  onClick={toggleUnderline}
                  className={`p-1.5 rounded text-white font-serif underline w-8 h-8 flex items-center justify-center transition-colors ${textElement.isUnderline ? 'bg-white/20' : 'hover:bg-white/10'}`}
                >U</button>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center">
                  <span className="text-xs font-bold">Aa</span>
                </button>
                <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white w-8 h-8 flex items-center justify-center">
                  <AlignLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Style Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Style</h3>
              <button className="text-gray-500 hover:text-white transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Fill</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={textElement.fill}
                    onChange={(e) => setTextElement(prev => ({ ...prev, fill: e.target.value }))}
                    className="w-6 h-6 rounded bg-transparent border-0 cursor-pointer p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-white/20 [&::-webkit-color-swatch]:rounded"
                  />
                </div>
              </div>
            </div>
          </div>
            </div>
          )}

          {/* Text Effects Section */}
          {!isVideoSelected && activeTab === 'text' && (
            <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Text Effects</h3>
              <button 
                className="text-gray-500 hover:text-white transition-colors"
                onClick={() => setTextElement(prev => ({ 
                  ...prev, 
                  hasStroke: false, 
                  hasBackground: false, 
                  hasShadow: false 
                }))}
                title="Reset effects"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Stroke */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={textElement.hasStroke || false}
                      onChange={(e) => setTextElement(prev => ({ ...prev, hasStroke: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded bg-white/10 border-white/20 text-[#00a8ff] focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs text-gray-300">Stroke</span>
                  </label>
                  {textElement.hasStroke && (
                    <input 
                      type="color" 
                      value={textElement.strokeColor || '#000000'}
                      onChange={(e) => setTextElement(prev => ({ ...prev, strokeColor: e.target.value }))}
                      className="w-5 h-5 rounded bg-transparent border-0 cursor-pointer p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-white/20 [&::-webkit-color-swatch]:rounded"
                    />
                  )}
                </div>
                {textElement.hasStroke && (
                  <div className="pl-5 flex items-center gap-2">
                    <span className="text-[10px] text-gray-500 w-8">Width</span>
                    <input 
                      type="range" 
                      min="1" max="10" 
                      value={textElement.strokeWidth || 2}
                      onChange={(e) => setTextElement(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) }))}
                      className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                    />
                    <span className="text-[10px] text-gray-400 w-4 text-right">{textElement.strokeWidth || 2}</span>
                  </div>
                )}
              </div>

              {/* Background */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={textElement.hasBackground || false}
                      onChange={(e) => setTextElement(prev => ({ ...prev, hasBackground: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded bg-white/10 border-white/20 text-[#00a8ff] focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs text-gray-300">Background</span>
                  </label>
                  {textElement.hasBackground && (
                    <input 
                      type="color" 
                      value={textElement.backgroundColor || '#000000'}
                      onChange={(e) => setTextElement(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-5 h-5 rounded bg-transparent border-0 cursor-pointer p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-white/20 [&::-webkit-color-swatch]:rounded"
                    />
                  )}
                </div>
                {textElement.hasBackground && (
                  <>
                    <div className="pl-5 flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">Pad</span>
                      <input 
                        type="range" 
                        min="0" max="50" 
                        value={textElement.backgroundPadding || 10}
                        onChange={(e) => setTextElement(prev => ({ ...prev, backgroundPadding: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                      <span className="text-[10px] text-gray-400 w-4 text-right">{textElement.backgroundPadding || 10}</span>
                    </div>
                    <div className="pl-5 flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">Radius</span>
                      <input 
                        type="range" 
                        min="0" max="50" 
                        value={textElement.backgroundRadius || 8}
                        onChange={(e) => setTextElement(prev => ({ ...prev, backgroundRadius: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                      <span className="text-[10px] text-gray-400 w-4 text-right">{textElement.backgroundRadius || 8}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Shadow */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={textElement.hasShadow || false}
                      onChange={(e) => setTextElement(prev => ({ ...prev, hasShadow: e.target.checked }))}
                      className="w-3.5 h-3.5 rounded bg-white/10 border-white/20 text-[#00a8ff] focus:ring-0 focus:ring-offset-0"
                    />
                    <span className="text-xs text-gray-300">Shadow</span>
                  </label>
                  {textElement.hasShadow && (
                    <input 
                      type="color" 
                      value={textElement.shadowColor || '#000000'}
                      onChange={(e) => setTextElement(prev => ({ ...prev, shadowColor: e.target.value }))}
                      className="w-5 h-5 rounded bg-transparent border-0 cursor-pointer p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:border [&::-webkit-color-swatch]:border-white/20 [&::-webkit-color-swatch]:rounded"
                    />
                  )}
                </div>
                {textElement.hasShadow && (
                  <>
                    <div className="pl-5 flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">Blur</span>
                      <input 
                        type="range" 
                        min="0" max="50" 
                        value={textElement.shadowBlur || 10}
                        onChange={(e) => setTextElement(prev => ({ ...prev, shadowBlur: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                      <span className="text-[10px] text-gray-400 w-4 text-right">{textElement.shadowBlur || 10}</span>
                    </div>
                    <div className="pl-5 flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">Offset X</span>
                      <input 
                        type="range" 
                        min="-50" max="50" 
                        value={textElement.shadowOffsetX || 5}
                        onChange={(e) => setTextElement(prev => ({ ...prev, shadowOffsetX: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                      <span className="text-[10px] text-gray-400 w-4 text-right">{textElement.shadowOffsetX || 5}</span>
                    </div>
                    <div className="pl-5 flex items-center gap-2">
                      <span className="text-[10px] text-gray-500 w-8">Offset Y</span>
                      <input 
                        type="range" 
                        min="-50" max="50" 
                        value={textElement.shadowOffsetY || 5}
                        onChange={(e) => setTextElement(prev => ({ ...prev, shadowOffsetY: parseInt(e.target.value) }))}
                        className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                      <span className="text-[10px] text-gray-400 w-4 text-right">{textElement.shadowOffsetY || 5}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            </div>
          )}

          {/* Opacity Section */}
          {!isVideoSelected && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Opacity</h3>
                <button 
                  className="text-gray-500 hover:text-white transition-colors"
                  onClick={() => setTextElement(prev => ({ ...prev, opacity: 100 }))}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="flex-1 h-1.5 bg-white/10 rounded-full relative cursor-pointer"
                  onPointerDown={(e) => {
                    handleOpacityChange(e);
                    (e.target as HTMLElement).setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (e.buttons === 1) handleOpacityChange(e);
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 bg-white rounded-full" style={{ width: `${textElement.opacity}%` }}></div>
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow pointer-events-none" style={{ left: `calc(${textElement.opacity}% - 6px)` }}></div>
                </div>
                <span className="text-xs text-gray-300 w-10 text-right">{textElement.opacity}%</span>
                <div className="w-2 h-2 border border-gray-500 transform rotate-45"></div>
              </div>
            </div>
          )}

          {/* Adjustment Section */}
          {!isVideoSelected && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Adjustment</h3>
                <button 
                  className="text-gray-500 hover:text-white transition-colors"
                  onClick={() => setTextElement(prev => ({ ...prev, scale: 100 }))}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Scale</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="flex-1 h-1.5 bg-white/10 rounded-full relative cursor-pointer"
                      onPointerDown={(e) => {
                        handleScaleChange(e);
                        (e.target as HTMLElement).setPointerCapture(e.pointerId);
                      }}
                      onPointerMove={(e) => {
                        if (e.buttons === 1) handleScaleChange(e);
                      }}
                    >
                      <div className="absolute left-0 top-0 bottom-0 bg-white rounded-full" style={{ width: `${Math.min(100, textElement.scale / 2)}%` }}></div>
                      <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow pointer-events-none" style={{ left: `calc(${Math.min(100, textElement.scale / 2)}% - 6px)` }}></div>
                    </div>
                    <span className="text-xs text-gray-300 w-10 text-right">{textElement.scale}%</span>
                    <div className="w-2 h-2 border border-gray-500 transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Animation Section */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Animation</h3>
              <button 
                className="text-gray-500 hover:text-white transition-colors"
                onClick={() => setTextElement(prev => ({ ...prev, animation: 'none' }))}
                title="Reset animation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'None' },
                { id: 'fade-in', label: 'Fade In' },
                { id: 'slide-up', label: 'Slide Up' },
                { id: 'slide-down', label: 'Slide Down' },
                { id: 'slide-left', label: 'Slide Left' },
                { id: 'slide-right', label: 'Slide Right' },
                { id: 'zoom-in', label: 'Zoom In' },
                { id: 'zoom-out', label: 'Zoom Out' },
                { id: 'bounce', label: 'Bounce' },
                { id: 'spin', label: 'Spin' }
              ].map((anim) => (
                <button
                  key={anim.id}
                  onClick={() => setTextElement(prev => ({ ...prev, animation: anim.id }))}
                  className={`px-3 py-2 rounded text-xs font-medium transition-colors border ${
                    textElement.animation === anim.id 
                      ? 'bg-white/10 border-white text-white' 
                      : 'bg-[#2a2a2a] border-white/5 text-gray-400 hover:bg-[#333] hover:text-white'
                  }`}
                >
                  {anim.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apply to all */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="w-4 h-4 rounded bg-[#00a8ff] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <span className="text-sm text-gray-300">Apply to all</span>
            </label>
          </div>
          
        </div>

        {/* Right Side Tabs */}
        <div className="w-14 bg-[#121212] border-l border-white/5 flex flex-col items-center py-2 shrink-0">
          {!isVideoSelected ? (
            <>
              <button 
                onClick={() => setActiveTab('preset')}
                className={`w-10 h-10 flex flex-col items-center justify-center gap-1 transition-colors rounded mb-2 ${activeTab === 'preset' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <div className="w-4 h-4 border border-current rounded-sm"></div>
                <span className="text-[9px]">Preset</span>
              </button>
              <button 
                onClick={() => setActiveTab('basic')}
                className={`w-10 h-10 flex flex-col items-center justify-center gap-1 transition-colors rounded mb-2 ${activeTab === 'basic' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Type className="w-4 h-4" />
                <span className="text-[9px]">Basic</span>
              </button>
              <button 
                onClick={() => setActiveTab('text')}
                className={`w-10 h-10 flex flex-col items-center justify-center gap-1 transition-colors rounded mb-2 ${activeTab === 'text' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Wand2 className="w-4 h-4" />
                <span className="text-[9px]">Text...</span>
              </button>
              <button 
                onClick={() => setActiveTab('anim')}
                className={`w-10 h-10 flex flex-col items-center justify-center gap-1 transition-colors rounded ${activeTab === 'anim' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <div className="w-4 h-4 rounded-full border border-current border-dashed"></div>
                <span className="text-[9px]">Anim...</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setActiveTab('video-effects')}
                className={`w-10 h-10 flex flex-col items-center justify-center gap-1 transition-colors rounded mb-2 ${activeTab === 'video-effects' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="text-[9px]">Effects</span>
              </button>
              <button 
                onClick={() => setActiveTab('video-trim')}
                className={`w-10 h-10 flex flex-col items-center justify-center gap-1 transition-colors rounded mb-2 ${activeTab === 'video-trim' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Scissors className="w-4 h-4" />
                <span className="text-[9px]">Trim</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function MoreHorizontal(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}
