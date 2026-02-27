import React from 'react';
import { Settings, ChevronDown, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline } from 'lucide-react';

import { TextElement } from '../page';

interface PropertiesPanelProps {
  textElement: TextElement;
  setTextElement: React.Dispatch<React.SetStateAction<TextElement>>;
}

const fonts = ['sans-serif', 'serif', 'monospace', 'cursive', 'system-ui', 'Outfit', 'Inter'];

export default function PropertiesPanel({ textElement, setTextElement }: PropertiesPanelProps) {
  const updateText = (key: keyof TextElement, value: any) => {
    setTextElement(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-[280px] bg-[#1a1a1a] border-l border-white/10 shrink-0 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0">
        <h2 className="text-base font-semibold text-white">Properties</h2>
        <button className="text-gray-400 hover:text-white transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Tabs */}
        <div className="flex border-b border-white/5">
          <button className="flex-1 py-3 text-xs font-medium text-white border-b-2 border-[#00a8ff]">Basic</button>
          <button className="flex-1 py-3 text-xs font-medium text-gray-400 hover:text-white transition-colors">Style</button>
          <button className="flex-1 py-3 text-xs font-medium text-gray-400 hover:text-white transition-colors">Animation</button>
        </div>

        <div className="p-4 flex flex-col gap-6">
          {/* Text Content */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Text</label>
            <textarea
              value={textElement.text}
              onChange={(e) => updateText('text', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#00a8ff] transition-colors resize-none h-24"
            />
          </div>

          {/* Typeface */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Font</label>
            <div className="relative">
              <select
                value={textElement.fontFamily}
                onChange={(e) => updateText('fontFamily', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:border-[#00a8ff] transition-colors appearance-none"
              >
                {fonts.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Font Controls */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Style</label>
            <div className="flex gap-1 bg-[#2a2a2a] p-1 rounded-lg border border-white/5">
              <button
                onClick={() => updateText('isBold', !textElement.isBold)}
                className={`flex-1 py-1.5 rounded flex items-center justify-center transition-colors ${textElement.isBold ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateText('isItalic', !textElement.isItalic)}
                className={`flex-1 py-1.5 rounded flex items-center justify-center transition-colors ${textElement.isItalic ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateText('isUnderline', !textElement.isUnderline)}
                className={`flex-1 py-1.5 rounded flex items-center justify-center transition-colors ${textElement.isUnderline ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Size</label>
              <input
                type="number"
                value={textElement.fontSize}
                onChange={(e) => updateText('fontSize', Number(e.target.value))}
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a8ff] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Color</label>
              <div className="flex items-center gap-2 bg-[#2a2a2a] border border-white/10 rounded-lg px-2 py-1.5">
                <input
                  type="color"
                  value={textElement.fill}
                  onChange={(e) => updateText('fill', e.target.value)}
                  className="w-8 h-6 bg-transparent border-none rounded cursor-pointer"
                />
                <span className="text-xs text-white uppercase">{textElement.fill}</span>
              </div>
            </div>
          </div>

          {/* Transformation */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Scale</label>
                <span className="text-[10px] text-gray-400">{textElement.scale}%</span>
              </div>
              <input
                type="range"
                min="10" max="300"
                value={textElement.scale}
                onChange={(e) => updateText('scale', Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00a8ff] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Opacity</label>
                <span className="text-[10px] text-gray-400">{textElement.opacity}%</span>
              </div>
              <input
                type="range"
                min="0" max="100"
                value={textElement.opacity}
                onChange={(e) => updateText('opacity', Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#00a8ff] [&::-webkit-slider-thumb]:rounded-full cursor-pointer"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Alignment</label>
            <div className="flex gap-1 bg-[#2a2a2a] p-1 rounded-lg border border-white/5">
              <button className="flex-1 py-1.5 rounded flex items-center justify-center text-white bg-white/10">
                <AlignLeft className="w-4 h-4" />
              </button>
              <button className="flex-1 py-1.5 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <AlignCenter className="w-4 h-4" />
              </button>
              <button className="flex-1 py-1.5 rounded flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                <AlignRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 shrink-0">
        <button className="w-full bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-medium transition-colors">
          Reset properties
        </button>
      </div>
    </div>
  );
}
