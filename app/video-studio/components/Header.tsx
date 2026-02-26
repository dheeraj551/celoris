import React from 'react';
import Link from 'next/link';
import { Undo, Redo, MousePointer2, Hand, Share, CheckCircle, HelpCircle, Settings, User, ChevronDown, Cloud } from 'lucide-react';

interface HeaderProps {
  activeTool: 'pointer' | 'hand';
  setActiveTool: (tool: 'pointer' | 'hand') => void;
  canvasZoom: number;
  setCanvasZoom: (zoom: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Header({
  activeTool,
  setActiveTool,
  canvasZoom,
  setCanvasZoom,
  undo,
  redo,
  canUndo,
  canRedo
}: HeaderProps) {
  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#121212] shrink-0">
      <div className="flex items-center gap-4">
        {/* Logo placeholder */}
        <Link href="/" className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xl rounded-sm hover:bg-gray-200 transition-colors">
          C
        </Link>

        <div className="flex items-center gap-2 text-sm font-medium hover:bg-white/5 px-2 py-1 rounded cursor-pointer transition-colors">
          <Cloud className="w-4 h-4" />
          <span>Stunning video</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white/5 rounded-md p-1">
          <button
            onClick={() => setActiveTool('pointer')}
            className={`p-1.5 rounded transition-colors ${activeTool === 'pointer' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            <MousePointer2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('hand')}
            className={`p-1.5 rounded transition-colors ${activeTool === 'hand' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            <Hand className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm relative group cursor-pointer">
          <select
            className="appearance-none bg-transparent text-gray-400 hover:text-white focus:outline-none cursor-pointer pr-6 py-1"
            value={canvasZoom}
            onChange={(e) => setCanvasZoom(Number(e.target.value))}
          >
            <option value={25}>25%</option>
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={150}>150%</option>
            <option value={200}>200%</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="h-4 w-px bg-white/10 mx-2"></div>

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${canUndo ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${canRedo ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-[#00a8ff] hover:bg-[#0097e6] text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
          Share
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <CheckCircle className="w-5 h-5" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden border border-white/10 ml-2 relative">
          <img src="https://picsum.photos/seed/user/32/32" alt="User" referrerPolicy="no-referrer" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-[#121212]"></div>
        </div>
      </div>
    </header>
  );
}
