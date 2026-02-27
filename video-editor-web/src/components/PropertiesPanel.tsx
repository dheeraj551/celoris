import React, { useState } from 'react';
import { X, Type, Wand2, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, ChevronDown, RotateCcw } from 'lucide-react';
import { TextElement } from '../App';

interface PropertiesPanelProps {
  textElement: TextElement;
  setTextElement: React.Dispatch<React.SetStateAction<TextElement>>;
}

export default function PropertiesPanel({ textElement, setTextElement }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState('basic');

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
        </h2>
        <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Properties Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
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
              
              <div className="flex items-center justify-between opacity-50">
                <span className="text-xs text-gray-400">Stroke</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-white/20 cursor-not-allowed relative">
                    <div className="absolute inset-0 border-t border-red-500 transform rotate-45 origin-center"></div>
                  </div>
                  <button className="p-1 text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex items-center justify-between opacity-50">
                <span className="text-xs text-gray-400">Background</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-white/20 cursor-not-allowed relative">
                    <div className="absolute inset-0 border-t border-red-500 transform rotate-45 origin-center"></div>
                  </div>
                  <button className="p-1 text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="flex items-center justify-between opacity-50">
                <span className="text-xs text-gray-400">Shadow</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded border border-white/20 cursor-not-allowed relative">
                    <div className="absolute inset-0 border-t border-red-500 transform rotate-45 origin-center"></div>
                  </div>
                  <button className="p-1 text-gray-500"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Opacity Section */}
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

          {/* Adjustment Section */}
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
