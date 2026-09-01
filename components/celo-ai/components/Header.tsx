import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, RotateCcw, Cpu, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CeloLogo } from './CeloLogo';
import { AI_MODELS } from '../constants/models';

interface HeaderProps {
  onReset: () => void;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  hasMessages: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  selectedModel,
  onSelectModel,
  hasMessages,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredModels = AI_MODELS.filter((m) =>
    m.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const headerContent = (
    <div className="w-full flex justify-between items-center">
      {/* Left: Celo AI Custom Branding & Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer select-none group"
        onClick={onReset}
      >
        <CeloLogo size={28} showText={true} />
      </div>

      {/* Middle/Right: Model badge & actions */}
      <div className="flex items-center gap-3">
        {/* Model dropdown container */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            id="model-selector-btn"
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shadow-sm border ${
              isOpen
                ? 'bg-[#282a2c] text-white border-[#00f0ff]/50 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                : 'bg-[#1e1f20] hover:bg-[#282a2c] text-[#e3e3e3] border-[#333537] hover:border-[#4f5358]'
            }`}
            aria-expanded={isOpen}
            aria-label="Select AI Model"
          >
            <Cpu className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="max-w-[120px] sm:max-w-[180px] truncate">{selectedModel}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#8e918f] transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-[#00f0ff]' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#1e1f20] border border-[#333537] shadow-[0_12px_36px_rgba(0,0,0,0.7)] backdrop-blur-xl z-50 overflow-hidden flex flex-col max-h-[420px]"
              >
                {/* Search Bar */}
                <div className="p-2.5 border-b border-[#2e2f30] bg-[#18191a]">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#282a2c] border border-[#3c4043] focus-within:border-[#00f0ff]/50 focus-within:ring-1 focus-within:ring-[#00f0ff]/30 transition-all">
                    <Search className="w-3.5 h-3.5 text-[#8e918f]" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 36+ models..."
                      className="w-full bg-transparent text-xs text-white placeholder-[#8e918f] focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="text-[10px] text-[#8e918f] hover:text-white px-1"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Models List */}
                <div className="overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar flex-1">
                  <div className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#8e918f]">
                    Available Student Models ({filteredModels.length})
                  </div>

                  {filteredModels.length === 0 ? (
                    <div className="px-3 py-6 text-center text-xs text-[#8e918f]">
                      No models matching &quot;{searchQuery}&quot;
                    </div>
                  ) : (
                    filteredModels.map((model) => {
                      const isSelected = selectedModel.toLowerCase() === model.toLowerCase();
                      return (
                        <button
                          key={model}
                          type="button"
                          onClick={() => {
                            onSelectModel(model);
                            setIsOpen(false);
                            setSearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 text-left ${
                            isSelected
                              ? 'bg-[#282a2c] text-[#00f0ff] font-medium border border-[#00f0ff]/30 shadow-sm'
                              : 'text-[#c4c7c5] hover:bg-[#282a2c] hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]' : 'bg-[#555]'
                              }`}
                            />
                            <span className="truncate">{model}</span>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#00f0ff] flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* New chat button if there are messages */}
        {hasMessages && (
          <button
            type="button"
            id="new-chat-btn"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1e1f20] hover:bg-[#333537] text-xs font-medium text-[#e3e3e3] border border-[#333537] transition-all shadow-sm active:scale-95"
            title="Start new conversation"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#4b90ff]" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        )}
      </div>
    </div>
  );

  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.getElementById('dashboard-header-content');
    if (el) setContainer(el);
  }, []);

  if (container) {
    return createPortal(headerContent, container);
  }

  // Fallback if container is not found
  return (
    <header className="w-full px-6 sm:px-8 py-3.5 flex justify-between items-center bg-[#131314]/80 border-b border-[#262626]/80 sticky top-0 z-20 backdrop-blur-md">
      {headerContent}
    </header>
  );
};


