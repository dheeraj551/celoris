import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Minus,
  Square,
  Volume2,
  VolumeX,
  Tv,
  Gamepad2,
  Coffee,
  Shield,
  HelpCircle,
  Sparkles,
  Pin,
  Gift,
  AlertTriangle,
  ChevronDown,
  User,
  Send as SendIcon,
  Trophy,
  Scroll,
} from 'lucide-react';
import {
  UserProfile,
  ChatMessage,
  CafeTable,
  RetroThemeSkin,
  RetroViewMode,
  CafeDrink,
} from './types';
import { RetroSmiley, RETRO_EMOTICONS } from './RetroSmiley';
import { cafeAudio } from './utils/cafeAudio';

interface RetroYahooChatWindowProps {
  tables: CafeTable[];
  activeTableId: string;
  onSelectTable: (id: string) => void;
  messages: ChatMessage[];
  currentUser: UserProfile;
  activePatrons: UserProfile[];
  onSendMessage: (text: string, whisperTo?: string) => void;
  onGiftDrinkToUser: (recipient: UserProfile) => void;
  onOpenProfileModal: () => void;
  onOpenModerationModal: () => void;
  onOpenAskBaristaModal: () => void;
  onOpenTopicModal: () => void;
  onReportMessage: (msg: ChatMessage) => void;
  onMuteUser: (userId: string, userName: string) => void;
  onToggleArcadeCabinet: () => void;
  onTogglePlayArcadeGame: () => void;
  isArcadeOpen: boolean;
  retroSkin: RetroThemeSkin;
  onChangeRetroSkin: (skin: RetroThemeSkin) => void;
  crtScanlines: boolean;
  onToggleCrtScanlines: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenWallOfFame?: () => void;
  guestbookCount?: number;
  typingUsers?: string[];
  onTyping?: () => void;
}

// Retro name color palette (mimicking late 90s/early 2000s chatrooms)
const RETRO_NAME_COLORS = [
  '#0000AA', // Classic Navy Blue
  '#7A2B9A', // Royal Purple
  '#008000', // Forest Green
  '#AA0000', // Crimson
  '#B85D00', // Amber Bronze
  '#008888', // Dark Cyan
  '#CC0066', // Deep Magenta
  '#1E3A8A', // Deep Indigo
];

function getUsernameColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return RETRO_NAME_COLORS[Math.abs(hash) % RETRO_NAME_COLORS.length];
}

export function RetroYahooChatWindow({
  tables,
  activeTableId,
  onSelectTable,
  messages,
  currentUser,
  activePatrons,
  onSendMessage,
  onGiftDrinkToUser,
  onOpenProfileModal,
  onOpenModerationModal,
  onOpenAskBaristaModal,
  onOpenTopicModal,
  onReportMessage,
  onMuteUser,
  onToggleArcadeCabinet,
  onTogglePlayArcadeGame,
  isArcadeOpen,
  retroSkin,
  onChangeRetroSkin,
  crtScanlines,
  onToggleCrtScanlines,
  soundEnabled,
  onToggleSound,
  onOpenWallOfFame,
  guestbookCount,
  typingUsers = [],
  onTyping,
}: RetroYahooChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [selectedPatron, setSelectedPatron] = useState<UserProfile | null>(null);
  const [whisperRecipient, setWhisperRecipient] = useState<UserProfile | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showEmoticonPicker, setShowEmoticonPicker] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [customTextColor, setCustomTextColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const activeTable = tables.find((t) => t.id === activeTableId) || tables[0];
  const tableMessages = messages.filter((m) => m.tableId === activeTableId && !m.isDeleted);
  const pinnedMessage = tableMessages.find((m) => m.isPinned);

  // Auto scroll transcript to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tableMessages.length]);

  // Handle outside click to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.retro-menu-container')) {
        setActiveMenu(null);
      }
      if (!target.closest('.emoticon-picker-container')) {
        setShowEmoticonPicker(false);
      }
      if (!target.closest('.font-picker-container')) {
        setShowFontMenu(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (soundEnabled) {
      cafeAudio.playKeyClick();
    }

    onSendMessage(trimmed, whisperRecipient?.id);
    setInputText('');
    setWhisperRecipient(null);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectEmoticon = (code: string) => {
    setInputText((prev) => (prev ? `${prev} ${code}` : code));
    setShowEmoticonPicker(false);
    inputRef.current?.focus();
  };

  // Title bar style themes
  const getTitleBarGradient = () => {
    switch (retroSkin) {
      case 'win98_teal':
        return 'bg-gradient-to-r from-[#000080] via-[#1084d0] to-[#000080] text-white';
      case 'arcade_neon':
        return 'bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] text-white';
      case 'cyber_dark':
        return 'bg-gradient-to-r from-[#18181b] via-[#27272a] to-[#09090b] text-amber-300';
      case 'xp_purple':
      default:
        // Authentic purple/lavender gradient matching user's uploaded screenshot!
        return 'bg-gradient-to-r from-[#9478c9] via-[#b6a1e0] to-[#c7b7eb] text-white';
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="retro-button px-4 py-2 flex items-center gap-2 font-bold text-xs shadow-xl cursor-pointer"
        >
          <RetroSmiley type="happy" size={16} />
          <span>{activeTable.name}:1 -- Chat (Minimized)</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`retro-bevel-out bg-[#ece9d8] text-black font-retro-tahoma select-none shadow-2xl flex flex-col transition-all duration-150 ${
        isMaximized
          ? 'fixed inset-2 z-40 rounded-none'
          : 'w-full max-w-4xl mx-auto rounded-t-lg'
      }`}
      style={{
        boxShadow:
          '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px #404040, inset 1px 1px 0 #ffffff',
      }}
    >
      {/* 1. CLASSIC TITLE BAR */}
      <div
        className={`px-2 py-1.5 flex items-center justify-between font-bold text-xs shadow-sm cursor-move select-none ${
          retroSkin === 'xp_purple' ? 'rounded-t-[6px]' : ''
        } ${getTitleBarGradient()}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <RetroSmiley type="cool" size={16} />
          <span className="truncate tracking-wide drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">
            {activeTable.name}:1 -- Chat
          </span>
          <span className="text-[10px] opacity-80 font-normal hidden sm:inline">
            ({activePatrons.length} Users online)
          </span>
        </div>

        {/* Window Controls (Minimize, Maximize, Close) */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Minimize */}
          <button
            onClick={() => setIsMinimized(true)}
            className="w-4 h-4 bg-[#ece9d8] hover:bg-[#f5f2e3] border-t border-l border-white border-r border-b border-[#404040] text-black flex items-center justify-center text-[9px] font-bold active:translate-y-px"
            title="Minimize"
          >
            <Minus className="w-2.5 h-2.5" />
          </button>

          {/* Maximize / Restore */}
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-4 h-4 bg-[#ece9d8] hover:bg-[#f5f2e3] border-t border-l border-white border-r border-b border-[#404040] text-black flex items-center justify-center text-[9px] font-bold active:translate-y-px"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="w-2.5 h-2.5" />
          </button>

          {/* Close Window */}
          <button
            onClick={() => {
              if (window.confirm('Leave this retro chat session?')) {
                window.location.reload();
              }
            }}
            className="w-4 h-4 bg-[#ece9d8] hover:bg-rose-500 hover:text-white border-t border-l border-white border-r border-b border-[#404040] text-black flex items-center justify-center text-[10px] font-bold active:translate-y-px"
            title="Close"
          >
            <X className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* 2. CLASSIC MENU BAR (Chat  Edit  View  Actions  Help) */}
      <div className="relative bg-[#ece9d8] px-1 py-0.5 border-b border-[#919b9c] flex items-center text-xs text-black retro-menu-container">
        {/* Chat Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'chat' ? null : 'chat');
            }}
            className={`px-2 py-0.5 rounded-sm hover:bg-[#0a246a] hover:text-white cursor-pointer ${
              activeMenu === 'chat' ? 'bg-[#0a246a] text-white' : ''
            }`}
          >
            Chat
          </button>
          {activeMenu === 'chat' && (
            <div className="absolute top-full left-0 mt-0.5 w-48 bg-[#ece9d8] text-black retro-bevel-out shadow-lg z-50 py-1 text-xs">
              <button
                onClick={() => {
                  onOpenProfileModal();
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5" /> Change Nickname / Avatar
              </button>
              <button
                onClick={() => {
                  onToggleSound();
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center gap-2"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                Sound FX: {soundEnabled ? 'ON' : 'OFF'}
              </button>
              <div className="h-px bg-gray-400 my-1 mx-1" />
              <button
                onClick={() => {
                  if (window.confirm('Clear your chat transcript buffer?')) {
                    // local clear
                    setActiveMenu(null);
                  }
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white"
              >
                Clear Screen
              </button>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'edit' ? null : 'edit');
            }}
            className={`px-2 py-0.5 rounded-sm hover:bg-[#0a246a] hover:text-white cursor-pointer ${
              activeMenu === 'edit' ? 'bg-[#0a246a] text-white' : ''
            }`}
          >
            Edit
          </button>
          {activeMenu === 'edit' && (
            <div className="absolute top-full left-0 mt-0.5 w-44 bg-[#ece9d8] text-black retro-bevel-out shadow-lg z-50 py-1 text-xs">
              <button
                onClick={() => {
                  const transcript = tableMessages
                    .map((m) => `${m.sender.name}: ${m.content}`)
                    .join('\n');
                  navigator.clipboard.writeText(transcript);
                  alert('Chat transcript copied to clipboard!');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white"
              >
                Copy Transcript
              </button>
              <button
                onClick={() => {
                  inputRef.current?.select();
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white"
              >
                Select Input Box
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'view' ? null : 'view');
            }}
            className={`px-2 py-0.5 rounded-sm hover:bg-[#0a246a] hover:text-white cursor-pointer ${
              activeMenu === 'view' ? 'bg-[#0a246a] text-white' : ''
            }`}
          >
            View
          </button>
          {activeMenu === 'view' && (
            <div className="absolute top-full left-0 mt-0.5 w-52 bg-[#ece9d8] text-black retro-bevel-out shadow-lg z-50 py-1 text-xs">
              <button
                onClick={() => {
                  onToggleCrtScanlines();
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center justify-between"
              >
                <span>CRT Scanlines FX</span>
                <span>{crtScanlines ? '✓' : ''}</span>
              </button>
              <button
                onClick={() => {
                  onToggleArcadeCabinet();
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center justify-between"
              >
                <span>Arcade Cabinet View</span>
                <span>{isArcadeOpen ? '✓' : ''}</span>
              </button>
              {onOpenWallOfFame && (
                <button
                  onClick={() => {
                    onOpenWallOfFame();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center justify-between"
                >
                  <span>📜 Wall of Fame Plaques</span>
                  <span>{guestbookCount !== undefined ? `(${guestbookCount})` : ''}</span>
                </button>
              )}
              <div className="h-px bg-gray-400 my-1 mx-1" />
              <div className="px-3 py-0.5 text-[10px] text-gray-600 font-bold uppercase">Skin Theme:</div>
              <button
                onClick={() => {
                  onChangeRetroSkin('xp_purple');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center justify-between"
              >
                <span>💜 Yahoo! 2001 (Purple)</span>
                <span>{retroSkin === 'xp_purple' ? '✓' : ''}</span>
              </button>
              <button
                onClick={() => {
                  onChangeRetroSkin('win98_teal');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center justify-between"
              >
                <span>🟦 Windows 98 Classic</span>
                <span>{retroSkin === 'win98_teal' ? '✓' : ''}</span>
              </button>
              <button
                onClick={() => {
                  onChangeRetroSkin('arcade_neon');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center justify-between"
              >
                <span>🕹️ Arcade Cyber Neon</span>
                <span>{retroSkin === 'arcade_neon' ? '✓' : ''}</span>
              </button>
            </div>
          )}
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'actions' ? null : 'actions');
            }}
            className={`px-2 py-0.5 rounded-sm hover:bg-[#0a246a] hover:text-white cursor-pointer ${
              activeMenu === 'actions' ? 'bg-[#0a246a] text-white' : ''
            }`}
          >
            Actions
          </button>
          {activeMenu === 'actions' && (
            <div className="absolute top-full left-0 mt-0.5 w-56 bg-[#ece9d8] text-black retro-bevel-out shadow-lg z-50 py-1 text-xs">
              <button
                onClick={() => {
                  onTogglePlayArcadeGame();
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center gap-2"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-rose-600" /> Play Arcade Game Box
              </button>
              <button
                onClick={() => {
                  cafeAudio.playArcadeCoin();
                  alert('🪙 *Clink-Clank-Ding!* You inserted a 25¢ arcade coin! (+1 Credit)');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white"
              >
                Insert Coin [25¢]
              </button>
              <button
                onClick={() => {
                  onOpenAskBaristaModal();
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Ask Barista Nora (AI)
              </button>
              <button
                onClick={() => {
                  if (selectedPatron) onGiftDrinkToUser(selectedPatron);
                  else alert('Select a user from the right list first to gift a drink!');
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center gap-2"
              >
                <Gift className="w-3.5 h-3.5 text-purple-600" /> Gift Cafe Drink to User
              </button>
              {onOpenWallOfFame && (
                <button
                  onClick={() => {
                    onOpenWallOfFame();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center gap-2 text-amber-900 font-bold"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-600" /> Wall of Fame (Guestbook)
                </button>
              )}
              <div className="h-px bg-gray-400 my-1 mx-1" />
              <button
                onClick={() => {
                  onOpenModerationModal();
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white flex items-center gap-2 text-rose-800"
              >
                <Shield className="w-3.5 h-3.5" /> Staff Moderation Console
              </button>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenu(activeMenu === 'help' ? null : 'help');
            }}
            className={`px-2 py-0.5 rounded-sm hover:bg-[#0a246a] hover:text-white cursor-pointer ${
              activeMenu === 'help' ? 'bg-[#0a246a] text-white' : ''
            }`}
          >
            Help
          </button>
          {activeMenu === 'help' && (
            <div className="absolute top-full left-0 mt-0.5 w-48 bg-[#ece9d8] text-black retro-bevel-out shadow-lg z-50 py-1 text-xs">
              <button
                onClick={() => {
                  alert(
                    '📜 CHAT CAFÉ HOUSE RULES:\n1. Be kind & hospitable to all users.\n2. Keep discussions civil and cafe-friendly.\n3. No spam, advertising, or harassment.\n4. Enjoy the warm tea, coffee, and arcade games!'
                  );
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white"
              >
                Café House Rules
              </button>
              <button
                onClick={() => {
                  alert(
                    'Chat Café: 1999 Arcade Edition\nCrafted with nostalgic early 2000s chat styling, procedural Web Audio, CRT effects, and retro arcade cabinet visuals.'
                  );
                  setActiveMenu(null);
                }}
                className="w-full text-left px-3 py-1 hover:bg-[#0a246a] hover:text-white"
              >
                About Chat Café
              </button>
            </div>
          )}
        </div>

        {/* Quick status on far right */}
        <div className="ml-auto flex items-center gap-1.5 px-1 text-[11px] text-gray-600">
          <span className="hidden sm:inline">Room: {activeTable.name}</span>
          {onOpenWallOfFame && (
            <button
              id="retro-wall-of-fame-quick-btn"
              onClick={onOpenWallOfFame}
              className="px-2 py-0.5 rounded bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-stone-950 font-bold text-[10px] flex items-center gap-1 shadow-sm border border-amber-700 cursor-pointer active:translate-y-px"
              title="Open Wall of Fame & Perpetual Guestbook"
            >
              <Trophy className="w-3 h-3 text-amber-950" />
              <span>Wall of Fame</span>
              {guestbookCount !== undefined && guestbookCount > 0 && (
                <span className="px-1 rounded bg-amber-950 text-amber-300 text-[9px] font-mono leading-none py-0.5">
                  {guestbookCount}
                </span>
              )}
            </button>
          )}
          <button
            onClick={onTogglePlayArcadeGame}
            className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-amber-950 font-bold text-[10px] flex items-center gap-1 shadow-sm border border-amber-800"
          >
            <Gamepad2 className="w-3 h-3" /> Arcade Box
          </button>
        </div>
      </div>

      {/* 3. RETRO TABLE / ROOM TAB BAR */}
      <div className="bg-[#ece9d8] px-2 pt-1 flex items-center gap-1 border-b border-[#919b9c] overflow-x-auto text-xs">
        {tables.map((table) => {
          const isActive = table.id === activeTableId;
          return (
            <button
              key={table.id}
              onClick={() => onSelectTable(table.id)}
              className={`px-3 py-1 font-bold whitespace-nowrap text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-white text-black border-t-2 border-l-2 border-r-2 border-[#808080] border-b-0 -mb-[1px] shadow-sm z-10'
                  : 'bg-[#dedac9] hover:bg-[#f0ece0] text-gray-700 border border-[#808080] border-b-0'
              }`}
              style={{
                borderTopLeftRadius: '3px',
                borderTopRightRadius: '3px',
              }}
            >
              <span>{table.icon}</span>
              <span>{table.name}</span>
              {table.slowModeSeconds > 0 && (
                <span className="text-[9px] px-1 bg-amber-200 text-amber-900 rounded font-normal">
                  {table.slowModeSeconds}s
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. MAIN SPLIT PANE: CHAT TRANSCRIPT (LEFT) + PATRON LIST (RIGHT) */}
      <div className="p-2 flex flex-col md:flex-row gap-2 bg-[#ece9d8] flex-1 min-h-[320px] max-h-[520px]">
        {/* LEFT COLUMN: CHAT TRANSCRIPT */}
        <div className="flex-1 flex flex-col min-w-0">
          <div
            id="retro-chat-transcript"
            className="retro-bevel-in bg-white p-2.5 flex-1 overflow-y-auto retro-scrollbar text-black space-y-1.5 min-h-[260px] select-text relative"
            style={{ minHeight: isMaximized ? 'calc(100vh - 280px)' : '320px' }}
          >
            {/* Optional CRT Scanline layer inside transcript */}
            {crtScanlines && (
              <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-20" />
            )}

            {/* Pinned Message of the Day (MOTD) banner */}
            {pinnedMessage && (
              <div className="mb-2 p-1.5 bg-[#fffee0] border border-[#d4d090] text-xs text-[#554400] flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <Pin className="w-3 h-3 text-[#aa7700] flex-shrink-0" />
                  <span className="font-bold">[Pinned MOTD]</span>
                  <span className="font-bold">{pinnedMessage.sender.name}:</span>
                  <span className="italic truncate">{pinnedMessage.content}</span>
                </div>
              </div>
            )}

            {/* Guided Discussion Starter Prompt */}
            {activeTable.activeTopic && (
              <div className="mb-2 p-2 bg-[#f0f4fc] border border-[#a4c0eb] text-xs text-[#1e3a8a] rounded-sm">
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>☕ Table Topic: {activeTable.activeTopic.title}</span>
                  <button
                    onClick={onOpenTopicModal}
                    className="text-[10px] text-blue-700 underline hover:text-blue-900"
                  >
                    Change Topic
                  </button>
                </div>
                <div className="text-[11px] italic text-gray-700 mb-1.5">
                  "{activeTable.activeTopic.prompt}"
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeTable.activeTopic.starterQuestions.slice(0, 2).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSendMessage(q)}
                      className="px-2 py-0.5 rounded bg-white hover:bg-blue-100 border border-blue-300 text-[10px] text-blue-900 transition-colors"
                    >
                      💬 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Welcome system header */}
            <div className="text-gray-500 text-[11px] italic pb-1 border-b border-gray-200">
              *** Welcome to {activeTable.name}! Please observe house rules. Type your message below. ***
            </div>

            {/* Messages list */}
            {tableMessages.map((msg) => {
              const isMe = msg.sender.id === currentUser.id;
              const isBarista = msg.sender.role === 'barista';
              const nameColor = getUsernameColor(msg.sender.id);

              // 1. Drink gift announcement
              if (msg.drinkGift) {
                return (
                  <div key={msg.id} className="text-xs text-[#7c2d12] py-0.5">
                    <span className="font-bold">🎁 [Café Treat] </span>
                    <span className="font-bold" style={{ color: nameColor }}>
                      {msg.sender.name}
                    </span>{' '}
                    treated {msg.drinkGift.recipientName || 'everyone'} to a{' '}
                    <span className="font-bold underline">{msg.drinkGift.drink.name}</span>!{' '}
                    {msg.drinkGift.note && (
                      <span className="italic text-stone-600">"{msg.drinkGift.note}"</span>
                    )}
                  </div>
                );
              }

              // 2. Barista AI Nora Special Output
              if (isBarista) {
                return (
                  <div key={msg.id} className="text-xs text-[#065f46] py-0.5 leading-relaxed">
                    <span className="font-bold text-[#047857]">⭐ Nora [Barista AI]: </span>
                    <span>{msg.content}</span>
                  </div>
                );
              }

              // 3. System / Action / Arcade score message
              if (msg.content.startsWith('🕹️ [Arcade')) {
                return (
                  <div key={msg.id} className="text-xs text-[#7e22ce] font-bold py-0.5">
                    {msg.content}
                  </div>
                );
              }

              // 4. Standard Classic Chat Line (matching user's screenshot: `username: text`)
              return (
                <div
                  key={msg.id}
                  className={`text-xs leading-relaxed py-0.5 hover:bg-amber-50 group flex flex-wrap items-baseline gap-1 ${
                    fontSize === 'large' ? 'text-sm' : 'text-xs'
                  }`}
                >
                  {/* Reply badge if present */}
                  {msg.replyTo && (
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1 rounded mr-1">
                      re: {msg.replyTo.senderName}
                    </span>
                  )}

                  {/* Sender Name in bold color */}
                  <button
                    onClick={() => setSelectedPatron(msg.sender)}
                    className="font-bold hover:underline cursor-pointer text-left"
                    style={{ color: nameColor }}
                  >
                    {msg.sender.name}:
                  </button>

                  {/* Message Content */}
                  <span className="text-black break-words select-text">{msg.content}</span>

                  {/* Quick hover actions */}
                  <span className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-400 ml-auto flex items-center gap-1.5 transition-opacity">
                    <button
                      onClick={() => setWhisperRecipient(msg.sender)}
                      className="text-blue-700 hover:underline"
                    >
                      Whisper
                    </button>
                    <button
                      onClick={() => onReportMessage(msg)}
                      className="text-rose-700 hover:underline"
                    >
                      Report
                    </button>
                  </span>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* RIGHT COLUMN: ROOM PATRON / BUDDY LIST (exactly like user's screenshot!) */}
        <div className="w-full md:w-56 flex flex-col flex-shrink-0">
          {/* Header */}
          <div className="flex items-center justify-between pb-1 text-xs text-gray-700 font-bold">
            <span>Users ({activePatrons.length})</span>
            <span className="text-[10px] text-gray-500">In this room</span>
          </div>

          {/* Sunken list box with scrollbar */}
          <div className="retro-bevel-in bg-white flex-1 overflow-y-auto retro-scrollbar p-1 min-h-[160px] md:min-h-[220px] max-h-[320px]">
            {activePatrons.map((patron, idx) => {
              const isSelected = selectedPatron?.id === patron.id;
              const isMe = patron.id === currentUser.id;

              return (
                <div
                  key={`${patron.id}-${idx}`}
                  onClick={() => setSelectedPatron(patron)}
                  onDoubleClick={() => setWhisperRecipient(patron)}
                  className={`px-1.5 py-1 text-xs flex items-center gap-1.5 cursor-pointer rounded-none transition-colors select-none ${
                    isSelected
                      ? 'bg-[#0a246a] text-white font-bold'
                      : 'hover:bg-gray-100 text-black'
                  }`}
                  title={`${patron.name} (${patron.currentDrink || 'Coffee Lover'})\nDouble-click to IM`}
                >
                  {/* Classic Yellow Retro Smiley Avatar */}
                  <RetroSmiley
                    type={
                      patron.role === 'barista'
                        ? 'barista'
                        : isMe
                        ? 'cool'
                        : idx % 4 === 0
                        ? 'wink'
                        : idx % 4 === 1
                        ? 'grin'
                        : idx % 4 === 2
                        ? 'tongue'
                        : 'happy'
                    }
                    size={14}
                  />

                  {/* Patron Name (truncated like user screenshot) */}
                  <span className="truncate flex-1">
                    {patron.name}
                    {isMe && <span className="opacity-75 text-[10px] ml-1">(you)</span>}
                  </span>

                  {/* Drink Icon badge */}
                  <span className="text-[10px] opacity-70" title={patron.currentDrink}>
                    ☕
                  </span>
                </div>
              );
            })}
          </div>

          {/* Classic Action Buttons under Patron List (IM & Ignore User) */}
          <div className="mt-1.5 grid grid-cols-2 gap-1">
            {/* IM Button */}
            <button
              onClick={() => {
                if (selectedPatron) {
                  setWhisperRecipient(selectedPatron);
                  inputRef.current?.focus();
                } else {
                  alert('Click on a user in the list first to whisper!');
                }
              }}
              className="retro-button py-1 px-2 text-xs font-bold flex items-center justify-center gap-1"
              title="Instant Message / Whisper to selected user"
            >
              IM
            </button>

            {/* Ignore User Button */}
            <button
              onClick={() => {
                if (selectedPatron) {
                  onMuteUser(selectedPatron.id, selectedPatron.name);
                } else {
                  alert('Select a user from the list to mute/ignore.');
                }
              }}
              className="retro-button py-1 px-2 text-xs font-bold"
              title="Mute / Ignore selected user"
            >
              Ignore User
            </button>
          </div>

          {/* Gift Drink button under IM */}
          <button
            onClick={() => {
              if (selectedPatron) {
                onGiftDrinkToUser(selectedPatron);
              } else {
                onGiftDrinkToUser(currentUser);
              }
            }}
            className="mt-1 w-full retro-button py-1 px-2 text-xs font-bold flex items-center justify-center gap-1 text-amber-900 bg-[#f7f2e4]"
          >
            <Gift className="w-3 h-3 text-amber-700" /> Send Café Treat
          </button>
        </div>
      </div>

      {/* 5. FORMATTING TOOLBAR (😎 Emoticons, Font 'T', Sound, Report Abuse) */}
      <div className="px-2 py-1 bg-[#ece9d8] border-t border-[#919b9c] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          {/* Retro Emoticons Button 😎 */}
          <div className="relative emoticon-picker-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowEmoticonPicker(!showEmoticonPicker);
              }}
              className="retro-button px-2 py-0.5 flex items-center gap-1 text-xs cursor-pointer"
              title="Add Emoticon"
            >
              <RetroSmiley type="cool" size={14} />
              <span className="font-bold text-[11px]">Emoticons</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>

            {showEmoticonPicker && (
              <div className="absolute bottom-full left-0 mb-1 w-64 bg-[#ece9d8] retro-bevel-out p-2 shadow-2xl z-50">
                <div className="text-[10px] font-bold text-gray-700 mb-1 pb-0.5 border-b border-gray-400">
                  Select Vintage Emoticon:
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {RETRO_EMOTICONS.map((emo) => (
                    <button
                      key={emo.code}
                      onClick={() => handleSelectEmoticon(emo.code)}
                      className="p-1 hover:bg-[#0a246a] hover:text-white rounded text-center text-xs flex flex-col items-center cursor-pointer"
                      title={`${emo.label} (${emo.code})`}
                    >
                      <span className="text-base">{emo.emoji}</span>
                      <span className="text-[9px] font-mono">{emo.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Font Styling 'T' Button */}
          <div className="relative font-picker-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFontMenu(!showFontMenu);
              }}
              className={`retro-button px-2 py-0.5 font-bold text-xs flex items-center gap-1 cursor-pointer ${
                isBold ? 'bg-[#d8d4c0]' : ''
              }`}
              title="Font & Text Styling"
            >
              <span className="font-serif font-bold text-sm">T</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>

            {showFontMenu && (
              <div className="absolute bottom-full left-0 mb-1 w-48 bg-[#ece9d8] retro-bevel-out p-2 shadow-xl z-50 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span>Bold Text:</span>
                  <input
                    type="checkbox"
                    checked={isBold}
                    onChange={(e) => setIsBold(e.target.checked)}
                    className="cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Font Size:</span>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value as any)}
                    className="bg-white text-xs border border-gray-500 p-0.5"
                  >
                    <option value="normal">Normal (12px)</option>
                    <option value="large">Large (14px)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* CRT scanlines quick toggle */}
          <button
            onClick={onToggleCrtScanlines}
            className={`retro-button px-2 py-0.5 text-[11px] flex items-center gap-1 ${
              crtScanlines ? 'bg-[#c8e6c9] text-green-900 border-green-700' : ''
            }`}
            title="Toggle CRT Cathode-Ray Tube scanlines"
          >
            <Tv className="w-3 h-3" />
            <span className="hidden sm:inline">CRT:</span> {crtScanlines ? 'ON' : 'OFF'}
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className="retro-button px-2 py-0.5 text-[11px] flex items-center gap-1"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 className="w-3 h-3 text-green-800" /> : <VolumeX className="w-3 h-3 text-gray-500" />}
          </button>
        </div>

        {/* Right side: Report Abuse link (exact match to user screenshot!) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const lastMsg = tableMessages[tableMessages.length - 1];
              if (lastMsg) onReportMessage(lastMsg);
              else alert('No messages in room to report.');
            }}
            className="text-blue-800 hover:text-blue-900 underline text-xs cursor-pointer"
            title="Report inappropriate behavior to moderation staff"
          >
            Report Abuse
          </button>
        </div>
      </div>

      {/* "X is typing…" indicator, right above the input box */}
      {typingUsers.length > 0 && (
        <div className="px-2 pb-0.5 bg-[#ece9d8] text-[10px] italic text-gray-500">
          {typingUsers.length === 1
            ? `${typingUsers[0]} is typing…`
            : typingUsers.length === 2
            ? `${typingUsers[0]} and ${typingUsers[1]} are typing…`
            : `${typingUsers.length} people are typing…`}
        </div>
      )}

      {/* 6. INPUT BOX & SEND BUTTON (exact match to user screenshot!) */}
      <div className="p-2 pt-0 bg-[#ece9d8] flex items-center gap-2">
        {/* Input field with optional whisper recipient badge */}
        <div className="flex-1 flex flex-col">
          {whisperRecipient && (
            <div className="text-[10px] text-purple-900 bg-purple-100 px-2 py-0.5 flex items-center justify-between border-t border-l border-r border-[#808080]">
              <span>
                Whispering privately to <b>{whisperRecipient.name}</b>:
              </span>
              <button
                onClick={() => setWhisperRecipient(null)}
                className="text-rose-600 hover:underline font-bold"
              >
                ✕ Cancel
              </button>
            </div>
          )}
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (e.target.value.trim()) onTyping?.();
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              whisperRecipient
                ? `Type private whisper to ${whisperRecipient.name}...`
                : `Type a message in ${activeTable.name}...`
            }
            className={`w-full px-2.5 py-1.5 retro-bevel-in bg-white text-black outline-none font-retro-tahoma ${
              isBold ? 'font-bold' : ''
            } ${fontSize === 'large' ? 'text-sm' : 'text-xs'}`}
            autoFocus
          />
        </div>

        {/* Classic 3D Bevel Send Button */}
        <button
          onClick={handleSend}
          className="retro-button px-5 py-2 font-bold text-xs flex items-center justify-center cursor-pointer active:translate-y-px"
          style={{ minWidth: '70px', height: '36px' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
