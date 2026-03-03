import React from 'react';
import { 
  Upload, LayoutTemplate, Music, Type, Shapes, FileText, Subtitles, 
  Wand2, ArrowRightLeft, SlidersHorizontal, MessageSquare
} from 'lucide-react';

const navItems = [
  { id: 'upload', icon: Upload, label: 'Upload' },
  { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  { id: 'audio', icon: Music, label: 'Audio' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'elements', icon: Shapes, label: 'Elements' },
  { id: 'transcript', icon: FileText, label: 'Transcript' },
  { id: 'captions', icon: Subtitles, label: 'Captions' },
  { id: 'effects', icon: Wand2, label: 'Effects' },
  { id: 'transitions', icon: ArrowRightLeft, label: 'Transitions' },
  { id: 'filters', icon: SlidersHorizontal, label: 'Filters' },
];

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id: string) => void }) {
  return (
    <div className="w-[72px] bg-[#121212] border-r border-white/10 flex flex-col items-center py-4 shrink-0 overflow-y-auto overflow-x-hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-full py-3 gap-1 transition-colors relative ${
              isActive ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {isActive && <div className="absolute left-0 top-1/4 bottom-1/4 w-0.5 bg-white rounded-r-full"></div>}
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
      
      <div className="mt-auto pt-4">
        <button className="flex flex-col items-center justify-center w-full py-3 gap-1 text-gray-400 hover:text-white transition-colors">
          <MessageSquare className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
