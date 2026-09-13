import React, { useState } from 'react';
import {
  Coffee,
  Volume2,
  VolumeX,
  Shield,
  Sliders,
  Sparkles,
  Users,
  MessageSquareQuote,
  Check,
} from 'lucide-react';
import { SeasonalThemeId, UserProfile, CafeTable } from '../types';
import { SEASONAL_THEMES } from '../utils/themes';
import { cafeAudio } from '../utils/cafeAudio';

interface CafeHeaderProps {
  currentTheme: SeasonalThemeId;
  onThemeChange: (theme: SeasonalThemeId) => void;
  currentUser: UserProfile;
  onOpenProfile: () => void;
  onOpenModeration: () => void;
  tables: CafeTable[];
  activeTableId: string;
  onSelectTable: (tableId: string) => void;
  pendingReportsCount: number;
  onlineCount: number;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onSwitchToRetro?: () => void;
  onOpenWallOfFame?: () => void;
  guestbookCount?: number;
}

export const CafeHeader: React.FC<CafeHeaderProps> = ({
  currentTheme,
  onThemeChange,
  currentUser,
  onOpenProfile,
  onOpenModeration,
  tables,
  activeTableId,
  onSelectTable,
  pendingReportsCount,
  onlineCount,
  onToggleSidebar,
  isSidebarOpen,
  onSwitchToRetro,
  onOpenWallOfFame,
  guestbookCount,
}) => {
  const [audioPlaying, setAudioPlaying] = useState(cafeAudio.enabled);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [rainVol, setRainVol] = useState(cafeAudio.rainVolume);
  const [musicVol, setMusicVol] = useState(cafeAudio.musicVolume);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const themeConfig = SEASONAL_THEMES[currentTheme];

  const handleAudioToggle = () => {
    const newState = cafeAudio.toggle();
    setAudioPlaying(newState);
  };

  const handleRainVolChange = (val: number) => {
    setRainVol(val);
    cafeAudio.setRainVolume(val);
  };

  const handleMusicVolChange = (val: number) => {
    setMusicVol(val);
    cafeAudio.setMusicVolume(val);
  };

  const isStaff = currentUser.role === 'moderator' || currentUser.role === 'admin' || currentUser.role === 'barista';

  return (
    <header
      id="cafe-header"
      className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-500 ${themeConfig.headerBg} ${themeConfig.borderTone}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Brand & Theme Tag */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={onOpenProfile}>
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shadow-md transition-transform group-hover:scale-105"
                style={{ backgroundColor: themeConfig.accentColor }}
              >
                ☕
              </div>
              <span className="absolute -bottom-1 -right-1 text-xs">
                {themeConfig.icon}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg sm:text-xl tracking-tight text-amber-50 leading-none">
                  Chat Café
                </h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${themeConfig.badgeBg}`}>
                  {themeConfig.name}
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 hidden sm:block">
                {themeConfig.tagline}
              </p>
            </div>
          </div>

          {/* Center: Table Selector on Desktop */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
            {tables.map((table) => {
              const isActive = table.id === activeTableId;
              return (
                <button
                  key={table.id}
                  onClick={() => onSelectTable(table.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600/30 text-amber-100 border border-amber-500/40 shadow-sm'
                      : 'text-stone-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{table.icon}</span>
                  <span>{table.name}</span>
                  {table.slowModeSeconds > 0 && (
                    <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1 rounded">
                      {table.slowModeSeconds}s
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions (Theme, Audio, Patron info, Moderation) */}
          <div className="flex items-center gap-2">
            {/* Ambient Soundscape Toggle */}
            <div className="relative">
              <button
                id="cafe-ambient-sound-toggle"
                onClick={handleAudioToggle}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setShowAudioControls(!showAudioControls);
                }}
                title={audioPlaying ? 'Mute ambient cafe sound (Right-click for mixer)' : 'Start ambient cafe sound (Rain & Lofi chords)'}
                className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
                  audioPlaying
                    ? 'bg-emerald-900/40 text-emerald-200 border-emerald-500/40 shadow-sm shadow-emerald-950/20'
                    : 'bg-black/20 text-stone-400 border-white/10 hover:text-stone-200'
                }`}
              >
                {audioPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">Lo-fi & Rain</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span className="hidden sm:inline">Ambiance</span>
                  </>
                )}
              </button>

              {/* Mini Audio Mixer popover */}
              {showAudioControls && (
                <div className="absolute right-0 top-12 w-64 p-3.5 rounded-2xl bg-stone-900/95 border border-stone-700 shadow-2xl backdrop-blur-lg z-50 text-xs text-stone-200 space-y-3">
                  <div className="flex items-center justify-between font-serif font-bold text-amber-300">
                    <span>Café Ambiance Mixer</span>
                    <button
                      onClick={() => setShowAudioControls(false)}
                      className="text-stone-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>🌧️ Rain on Window</span>
                      <span className="text-stone-400">{Math.round(rainVol * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={rainVol}
                      onChange={(e) => handleRainVolChange(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span>🎹 Warm Lo-fi Chords</span>
                      <span className="text-stone-400">{Math.round(musicVol * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={musicVol}
                      onChange={(e) => handleMusicVolChange(parseFloat(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-stone-400 italic">
                    Procedural audio generated in browser with Web Audio API.
                  </p>
                </div>
              )}
            </div>

            {/* Seasonal Theme Switcher Dropdown */}
            <div className="relative">
              <button
                id="seasonal-theme-button"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="p-2 rounded-xl bg-black/20 hover:bg-black/30 border border-white/10 text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-all"
                title="Change seasonal café theme"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="hidden md:inline">{themeConfig.icon} {themeConfig.name}</span>
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 top-12 w-56 p-2 rounded-2xl bg-stone-900/95 border border-stone-700 shadow-2xl backdrop-blur-lg z-50 space-y-1">
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                    Seasonal Themes
                  </div>
                  {(['autumn', 'spring', 'summer', 'winter'] as SeasonalThemeId[]).map((tid) => {
                    const t = SEASONAL_THEMES[tid];
                    const isCur = t.id === currentTheme;
                    return (
                      <button
                        key={tid}
                        onClick={() => {
                          onThemeChange(tid);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isCur
                            ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
                            : 'text-stone-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{t.icon}</span>
                          <div className="text-left">
                            <div>{t.name}</div>
                            <div className="text-[10px] text-stone-400">{t.seasonLabel}</div>
                          </div>
                        </div>
                        {isCur && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Wall of Fame & Guestbook Button */}
            {onOpenWallOfFame && (
              <button
                id="open-wall-of-fame-btn"
                onClick={onOpenWallOfFame}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                title="View Wall of Fame & Sign the Permanent Guestbook"
              >
                <span>🏆</span>
                <span className="hidden sm:inline">Wall of Fame</span>
                {guestbookCount !== undefined && guestbookCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-mono font-bold leading-none">
                    {guestbookCount}
                  </span>
                )}
              </button>
            )}

            {/* Retro 1999 Arcade Mode Switcher */}
            {onSwitchToRetro && (
              <button
                id="switch-to-retro-arcade-btn"
                onClick={onSwitchToRetro}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-900/80 to-amber-900/80 hover:from-purple-800 hover:to-amber-800 border border-amber-500/50 text-amber-200 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                title="Switch to Retro 1999 Arcade & Yahoo! Chat View"
              >
                <span>🕹️</span>
                <span className="hidden sm:inline">1999 Arcade</span>
              </button>
            )}

            {/* Moderation Suite Button (Staff or Patron with admin toggle) */}
            <button
              id="open-moderation-panel-btn"
              onClick={onOpenModeration}
              className={`relative p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
                isStaff
                  ? 'bg-amber-950/40 text-amber-200 border-amber-600/50 hover:bg-amber-900/50'
                  : 'bg-black/20 text-stone-300 border-white/10 hover:text-white'
              }`}
              title="Moderation & Café Rules Dashboard"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">
                {isStaff ? 'Staff Suite' : 'Mod Tools'}
              </span>
              {pendingReportsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {pendingReportsCount}
                </span>
              )}
            </button>

            {/* User Profile Pill */}
            <button
              id="user-profile-header-btn"
              onClick={onOpenProfile}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/25 hover:bg-black/40 border border-white/10 transition-all text-left"
              title="Edit avatar, drink & custom chat bubble"
            >
              <div
                className={`w-7 h-7 rounded-xl bg-gradient-to-br ${currentUser.avatarColor} flex items-center justify-center text-sm shadow-sm border border-white/20`}
              >
                {currentUser.avatarId === 'cat_barista' ? '🐱' :
                 currentUser.avatarId === 'fox_books' ? '🦊' :
                 currentUser.avatarId === 'owl_philosophy' ? '🦉' :
                 currentUser.avatarId === 'bear_cozy' ? '🐻' :
                 currentUser.avatarId === 'rabbit_matcha' ? '🐰' :
                 currentUser.avatarId === 'capybara_chill' ? '🦫' :
                 currentUser.avatarId === 'otter_latte' ? '🦦' :
                 currentUser.avatarId === 'raccoon_pastry' ? '🦝' : '🐕'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-amber-100 truncate max-w-[90px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-amber-300/80 truncate max-w-[90px]">
                  {currentUser.currentDrink}
                </div>
              </div>
            </button>

            {/* Toggle Patrons Sidebar Button */}
            <button
              id="toggle-patrons-sidebar-btn"
              onClick={onToggleSidebar}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs ${
                isSidebarOpen
                  ? 'bg-amber-600/30 text-amber-100 border-amber-500/40'
                  : 'bg-black/20 text-stone-300 border-white/10 hover:text-white'
              }`}
              title="View active patrons list"
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span className="text-[11px] font-medium">{onlineCount}</span>
            </button>
          </div>
        </div>

        {/* Mobile Table Selector Bar */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto py-2 scrollbar-none">
          {tables.map((table) => {
            const isActive = table.id === activeTableId;
            return (
              <button
                key={table.id}
                onClick={() => onSelectTable(table.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-600/30 text-amber-100 border border-amber-500/40'
                    : 'text-stone-300 bg-black/20 border border-white/5'
                }`}
              >
                <span>{table.icon}</span>
                <span>{table.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
