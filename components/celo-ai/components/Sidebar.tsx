import React from 'react';
import { MessageSquarePlus, Compass, Clock, HelpCircle, Settings } from 'lucide-react';
import { GeminiSparkle } from './GeminiSparkle';

interface SidebarProps {
  onNewChat: () => void;
  activeView?: 'chat' | 'explore' | 'history';
  onSelectView?: (view: 'chat' | 'explore' | 'history') => void;
  hasMessages: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNewChat,
  activeView = 'chat',
  onSelectView,
  hasMessages,
}) => {
  return (
    <aside className="w-16 sm:w-20 flex-shrink-0 flex flex-col items-center py-5 bg-[#1e1f20] border-r border-[#333537] justify-between z-30 select-none">
      {/* Top Logo & Navigation */}
      <div className="flex flex-col items-center gap-7 w-full">
        {/* Sleek Gradient Brand Logo Icon from Sleek Interface design */}
        <button
          type="button"
          onClick={onNewChat}
          className="group relative p-2.5 rounded-2xl bg-gradient-to-br from-[#4b90ff] to-[#ff5546] shadow-lg shadow-blue-500/20 hover:shadow-orange-500/20 hover:scale-105 active:scale-95 transition-all duration-200"
          title="Celo AI - Start Fresh"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <GeminiSparkle size={20} glow={false} />
          </div>
        </button>

        {/* Navigation icon buttons */}
        <nav className="flex flex-col items-center gap-4 w-full px-2">
          {/* New Chat Button */}
          <button
            type="button"
            id="sidebar-new-chat-btn"
            onClick={onNewChat}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
              hasMessages
                ? 'bg-[#333537] text-white shadow-sm'
                : 'text-[#c4c7c5] hover:bg-[#333537] hover:text-white opacity-80 hover:opacity-100'
            }`}
            title="New Chat"
            aria-label="New Chat"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>

          {/* Explore / Capabilities */}
          <button
            type="button"
            onClick={() => onSelectView?.('explore')}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-[#c4c7c5] hover:bg-[#333537] hover:text-white transition-all duration-200 ${
              activeView === 'explore' ? 'bg-[#333537] text-white' : 'opacity-70 hover:opacity-100'
            }`}
            title="Explore Capabilities"
            aria-label="Explore Capabilities"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* History */}
          <button
            type="button"
            onClick={() => onSelectView?.('history')}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-[#c4c7c5] hover:bg-[#333537] hover:text-white transition-all duration-200 ${
              activeView === 'history' ? 'bg-[#333537] text-white' : 'opacity-70 hover:opacity-100'
            }`}
            title="History"
            aria-label="History"
          >
            <Clock className="w-5 h-5" />
          </button>

          {/* Help */}
          <button
            type="button"
            onClick={() => {
              alert('Celo AI: Type an app idea or prompt to design and build instant solutions.');
            }}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#c4c7c5] hover:bg-[#333537] hover:text-white transition-all duration-200 opacity-70 hover:opacity-100"
            title="Help & FAQ"
            aria-label="Help & FAQ"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Bottom Profile Avatar from Sleek Interface */}
      <div className="flex flex-col items-center gap-4 mb-2">
        <div
          className="w-9 h-9 rounded-full bg-[#444746] hover:bg-[#525554] flex items-center justify-center text-xs font-bold text-[#e3e3e3] border border-[#333537] cursor-pointer transition-colors shadow-inner"
          title="User Account (JD)"
        >
          JD
        </div>
      </div>
    </aside>
  );
};
