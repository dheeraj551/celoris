import React, { useRef } from 'react';
import { Subtitles, Type, Music, Upload, LayoutTemplate, Shapes, FileText, Wand2, ArrowRightLeft, SlidersHorizontal, Plus, Search, Image as ImageIcon, Video, Folder } from 'lucide-react';

import { Clip } from '../page';

interface SecondarySidebarProps {
  activeTab: string;
  setVideoSrc?: React.Dispatch<React.SetStateAction<string>>;
  setVideoName?: React.Dispatch<React.SetStateAction<string>>;
  setDuration?: React.Dispatch<React.SetStateAction<number>>;
  setClips?: React.Dispatch<React.SetStateAction<Clip[]>>;
  currentTime?: number;
}

export default function SecondarySidebar({ activeTab, setVideoSrc, setVideoName, setDuration, setClips, currentTime = 0 }: SecondarySidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      if (setVideoSrc) setVideoSrc(url);
      if (setVideoName) setVideoName(file.name);

      // We'll let the Canvas component update the duration when the video metadata loads
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddText = () => {
    if (setClips) {
      setClips(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'text',
          start: currentTime,
          end: currentTime + 5, // Default 5 seconds duration
          content: 'New Text',
          color: '#e67e22',
          trackIndex: 0
        }
      ]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <div className="p-4 flex flex-col gap-4 h-full">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/*"
              className="hidden"
            />
            <button
              onClick={handleUploadClick}
              className="w-full bg-[#00a8ff] hover:bg-[#0097e6] text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload media
            </button>
            <div className="flex-1 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <Folder className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Drag and drop your files here</p>
              <p className="text-xs mt-1 opacity-70">Supported formats: MP4, MOV</p>
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="p-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a8ff] transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[9/16] bg-[#2a2a2a] rounded-lg border border-white/5 relative group cursor-pointer overflow-hidden">
                  <img src={`https://picsum.photos/seed/template${i}/150/260`} alt="Template" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                    <span className="text-[10px] font-medium text-white bg-black/50 px-1.5 py-0.5 rounded">00:15</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'audio':
        return (
          <div className="p-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search audio"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a8ff] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              {['Trending', 'Pop', 'Vlog', 'Travel', 'Chill'].map((category, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#2a2a2a] hover:bg-[#333] rounded-lg cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1a1a1a] rounded flex items-center justify-center">
                      <Music className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{category} Music</h4>
                      <p className="text-xs text-gray-400">02:30</p>
                    </div>
                  </div>
                  <button className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#00a8ff] hover:text-white">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      case 'text':
        return (
          <div className="p-4 flex flex-col gap-4">
            <button
              onClick={handleAddText}
              className="w-full bg-[#00a8ff] hover:bg-[#0097e6] text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add heading
            </button>
            <div className="flex flex-col gap-2 mt-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Text templates</h3>
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="aspect-video bg-[#2a2a2a] rounded-lg border border-white/5 flex items-center justify-center cursor-pointer hover:bg-[#333] transition-colors">
                    <span className="text-sm font-bold text-white">Style {i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'elements':
        return (
          <div className="p-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search elements"
                className="w-full bg-[#2a2a2a] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#00a8ff] transition-colors"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                <div key={i} className="aspect-square bg-[#2a2a2a] rounded-lg border border-white/5 flex items-center justify-center cursor-pointer hover:bg-[#333] transition-colors">
                  <Shapes className="w-6 h-6 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        );
      case 'effects':
        return (
          <div className="p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              {['Video effects', 'Body effects', 'Photo effects'].map((category, i) => (
                <div key={i} className="aspect-square bg-[#2a2a2a] rounded-lg border border-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#333] transition-colors p-2 text-center">
                  <Wand2 className="w-6 h-6 text-[#00a8ff]" />
                  <span className="text-xs font-medium text-white">{category}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'transitions':
        return (
          <div className="p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              {['Overlay', 'Camera', 'Blur', 'Basic', 'Light effect', 'Distortion'].map((category, i) => (
                <div key={i} className="aspect-video bg-[#2a2a2a] rounded-lg border border-white/5 flex items-center justify-center cursor-pointer hover:bg-[#333] transition-colors p-2 text-center relative overflow-hidden group">
                  <img src={`https://picsum.photos/seed/trans${i}/150/100`} alt="Transition" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" referrerPolicy="no-referrer" />
                  <span className="text-xs font-medium text-white relative z-10">{category}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'filters':
        return (
          <div className="p-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-2">
              {['Life', 'Food', 'Movies', 'Nature', 'Retro', 'B&W'].map((category, i) => (
                <div key={i} className="aspect-square bg-[#2a2a2a] rounded-lg border border-white/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#333] transition-colors p-2 text-center relative overflow-hidden group">
                  <img src={`https://picsum.photos/seed/filter${i}/150/150`} alt="Filter" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" referrerPolicy="no-referrer" />
                  <span className="text-xs font-medium text-white relative z-10">{category}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'captions':
        return (
          <div className="p-4 flex flex-col gap-3 overflow-y-auto">
            <button className="bg-[#2a2a2a] hover:bg-[#333] border border-white/10 rounded-lg p-4 flex flex-col items-center text-center transition-colors group">
              <Subtitles className="w-6 h-6 mb-2 text-gray-300 group-hover:text-white" />
              <h3 className="text-sm font-medium text-white mb-1">Auto captions</h3>
              <p className="text-xs text-gray-400">Automatically recognize speech in videos.</p>
            </button>

            <button className="bg-[#2a2a2a] hover:bg-[#333] border border-white/10 rounded-lg p-4 flex flex-col items-center text-center transition-colors group">
              <Type className="w-6 h-6 mb-2 text-gray-300 group-hover:text-white" />
              <h3 className="text-sm font-medium text-white mb-1">Manual captions</h3>
              <p className="text-xs text-gray-400">Enter captions manually.</p>
            </button>

            <button className="bg-[#2a2a2a] hover:bg-[#333] border border-white/10 rounded-lg p-4 flex flex-col items-center text-center transition-colors group">
              <Music className="w-6 h-6 mb-2 text-gray-300 group-hover:text-white" />
              <h3 className="text-sm font-medium text-white mb-1">Auto lyrics</h3>
              <p className="text-xs text-gray-400">Automatically recognize lyrics in songs.</p>
            </button>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <p className="text-sm text-gray-400 mt-2">Select an option from the left to see details here.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-[280px] bg-[#1a1a1a] border-r border-white/10 shrink-0 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-white/5 shrink-0">
        <h2 className="text-base font-semibold text-white capitalize">{activeTab}</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
}
