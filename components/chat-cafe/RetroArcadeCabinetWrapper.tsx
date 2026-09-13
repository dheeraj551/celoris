import React, { useState } from 'react';
import {
  Gamepad2,
  Tv,
  Coins,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Monitor,
  Music,
} from 'lucide-react';
import { RetroViewMode } from './types';
import { cafeAudio } from './utils/cafeAudio';

interface RetroArcadeCabinetWrapperProps {
  children: React.ReactNode;
  viewMode: RetroViewMode;
  onChangeViewMode: (mode: RetroViewMode) => void;
  crtScanlines: boolean;
  onToggleCrtScanlines: () => void;
  onInsertCoin: () => void;
  credits: number;
  onTogglePlayArcadeGame: () => void;
  isArcadeGameOpen: boolean;
  ambientAudioEnabled: boolean;
  onToggleAmbientAudio: () => void;
  onOpenWallOfFame?: () => void;
}

export function RetroArcadeCabinetWrapper({
  children,
  viewMode,
  onChangeViewMode,
  crtScanlines,
  onToggleCrtScanlines,
  onInsertCoin,
  credits,
  onTogglePlayArcadeGame,
  isArcadeGameOpen,
  ambientAudioEnabled,
  onToggleAmbientAudio,
  onOpenWallOfFame,
}: RetroArcadeCabinetWrapperProps) {
  const [coinAnim, setCoinAnim] = useState(false);

  const handleCoinClick = () => {
    setCoinAnim(true);
    onInsertCoin();
    setTimeout(() => setCoinAnim(false), 600);
  };

  return (
    <div className="relative w-full flex flex-col bg-black overflow-hidden select-none rounded-2xl border border-white/10 shadow-2xl">
      {/* 1. BACKGROUND: 1990s RETRO ARCADE ROOM WALLPAPER */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700 pointer-events-none"
        style={{
          backgroundImage: `url(/chat-cafe/retro-arcade-background.jpg)`,
          filter: viewMode === 'arcade_cabinet' ? 'brightness(0.35) blur(3px)' : 'brightness(0.65)',
        }}
      />

      {/* Ambient Vignette & Neon Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

      {/* Global CRT Scanlines if toggled */}
      {crtScanlines && (
        <div className="absolute inset-0 crt-scanlines pointer-events-none z-30 opacity-45" />
      )}

      {/* 2. RETRO ARCADE MARQUEE TOP BAR */}
      <header className="relative z-20 w-full bg-neutral-950/90 border-b-2 border-amber-500/70 shadow-2xl backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Left: Glowing Marquee Branding */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-600/30 border border-amber-400 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-rose-400 tracking-wider font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                CELORIS CAFE 2000
              </span>
              <span className="hidden md:inline px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-500/60 font-pixel text-[8px] text-rose-300">
                ARCADE EDITION
              </span>
            </div>
            <div className="text-[10px] text-stone-400 font-mono hidden sm:block">
              1999 Cyber Lounge • Real-Time Chat & Coin-Op Box
            </div>
          </div>
        </div>

        {/* Center: Coin Slot & Score LED */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* LED Credits Display */}
          <div className="bg-black/90 px-2.5 py-1 rounded border border-neutral-700 font-pixel text-[9px] flex items-center gap-2">
            <span className="text-amber-400 hidden sm:inline">CREDITS:</span>
            <span className="text-emerald-400 font-bold">{String(credits).padStart(2, '0')}</span>
          </div>

          {/* Insert Coin 25¢ button */}
          <button
            onClick={handleCoinClick}
            className={`px-3 py-1.5 rounded-lg bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-amber-950 font-pixel text-[9px] font-bold border-2 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)] flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
              coinAnim ? 'scale-105 ring-2 ring-yellow-200 brightness-125' : ''
            }`}
            title="Insert a coin for authentic arcade sound & play credits!"
          >
            <Coins className="w-3.5 h-3.5" />
            <span>INSERT COIN [25¢]</span>
          </button>

          {/* Play Arcade Game Box Toggle */}
          <button
            onClick={onTogglePlayArcadeGame}
            className={`px-3 py-1.5 rounded-lg font-pixel text-[9px] font-bold border-2 flex items-center gap-1.5 cursor-pointer transition-all ${
              isArcadeGameOpen
                ? 'bg-rose-600 text-white border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                : 'bg-purple-900/80 hover:bg-purple-800 text-purple-200 border-purple-400/80 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
            }`}
            title="Play the Retro Arcade Game Box"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isArcadeGameOpen ? 'CLOSE GAME' : 'PLAY ARCADE'}</span>
          </button>
        </div>

        {/* Right: CRT Scanlines & Ambient Audio toggles */}
        <div className="flex items-center gap-2">
          {/* CRT Monitor Toggle */}
          <button
            onClick={onToggleCrtScanlines}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-all ${
              crtScanlines
                ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'bg-neutral-900 text-stone-400 border-neutral-700 hover:text-white'
            }`}
            title="Toggle CRT Cathode-Ray Tube scanlines effect"
          >
            <Tv className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden lg:inline font-mono">CRT</span>
          </button>

          {/* Ambient Café / Arcade Music Toggle */}
          <button
            onClick={onToggleAmbientAudio}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-all ${
              ambientAudioEnabled
                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                : 'bg-neutral-900 text-stone-400 border-neutral-700 hover:text-white'
            }`}
            title="Toggle Lo-fi Ambient Café Chords & Rain"
          >
            {ambientAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* View Mode Toggle */}
          <button
            onClick={() =>
              onChangeViewMode(viewMode === 'arcade_cabinet' ? 'retro_window' : 'arcade_cabinet')
            }
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-stone-300 hover:text-white text-xs flex items-center gap-1"
            title="Switch View Mode: Arcade Cabinet vs Floating Retro Window"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden xl:inline font-mono">
              {viewMode === 'arcade_cabinet' ? 'Cabinet' : 'Desktop'}
            </span>
          </button>
        </div>
      </header>

      {/* 3. MAIN WORKSPACE */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 flex flex-col justify-center items-center min-h-[75vh]">
        {/* If Cabinet view, wrap in physical arcade cabinet bezel */}
        {viewMode === 'arcade_cabinet' ? (
          <div
            className="w-full max-w-5xl bg-neutral-950 p-3 sm:p-6 rounded-3xl border-8 border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center relative overflow-hidden"
            style={{
              boxShadow:
                '0 0 60px rgba(168, 85, 247, 0.2), inset 0 0 40px rgba(0,0,0,0.95), 0 0 0 4px #52525b',
            }}
          >
            {/* Top Cabinet Bezel Speakers */}
            <div className="w-full flex items-center justify-between px-6 py-1.5 mb-3 bg-neutral-900 rounded-xl border border-neutral-800">
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-950 border border-neutral-800" />
                ))}
              </div>
              <div className="font-pixel text-[9px] text-amber-400/80 tracking-widest uppercase">
                ★ COIN-OPERATED CYBER TERMINAL ★
              </div>
              <div className="flex gap-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-neutral-950 border border-neutral-800" />
                ))}
              </div>
            </div>

            {/* Embedded Retro Chat Window */}
            <div className="w-full relative">{children}</div>

            {/* Bottom Arcade Control Panel / Coin Door simulation */}
            <div className="w-full mt-4 pt-3 border-t-2 border-neutral-800 flex items-center justify-between px-4 text-neutral-500 font-pixel text-[8px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 inline-block shadow-[0_0_6px_rgba(220,38,38,0.8)]" />
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shadow-[0_0_6px_rgba(37,99,235,0.8)]" />
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block shadow-[0_0_6px_rgba(234,179,8,0.8)]" />
                <span className="hidden sm:inline text-neutral-400">ARCADE CONTROLS READY</span>
              </div>
              <div className="flex items-center gap-3">
                <span>INSERT 25¢ FOR BONUS SOUND FX</span>
                <span className="text-amber-500 font-bold">1 PLAY = 1 CREDIT</span>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Floating Window Mode: clean retro window over arcade hall wallpaper */
          <div className="w-full flex justify-center items-center py-2">{children}</div>
        )}
      </main>

      {/* 4. RETRO DESKTOP TASKBAR / BOTTOM BAR */}
      <footer className="relative z-20 w-full bg-[#ece9d8] border-t-2 border-white text-black font-retro-tahoma px-2 py-1 flex items-center justify-between text-xs select-none shadow-md">
        <div className="flex items-center gap-2">
          {/* Classic Start Button */}
          <button
            onClick={() => alert('Chat Café OS 2000\nClick on Chat menu or tables to switch rooms!')}
            className="retro-button px-3 py-1 font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <span className="text-sm">🪟</span>
            <span className="font-bold text-green-900">Start</span>
          </button>

          {/* Running Task button */}
          <div className="px-3 py-1 bg-white border-t border-l border-[#808080] border-r border-b border-white text-xs font-bold flex items-center gap-1.5 shadow-inner">
            <span className="text-sm">💬</span>
            <span className="truncate max-w-[140px] sm:max-w-xs">Celoris Cafe:1 -- Chat</span>
          </div>

          {/* Quick Arcade Game Task Button */}
          <button
            onClick={onTogglePlayArcadeGame}
            className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              isArcadeGameOpen
                ? 'bg-white border-t border-l border-[#808080] border-r border-b border-white text-purple-900'
                : 'retro-button text-gray-800'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden sm:inline">Cyber Invaders Game</span>
          </button>

          {/* Wall of Fame Taskbar Button */}
          {onOpenWallOfFame && (
            <button
              onClick={onOpenWallOfFame}
              className="retro-button px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 cursor-pointer text-amber-900 hover:bg-amber-100"
              title="Open Wall of Fame & Perpetual Guestbook"
            >
              <span>🏆</span>
              <span className="hidden sm:inline">Wall of Fame</span>
            </button>
          )}
        </div>

        {/* Right side: System Tray */}
        <div className="retro-bevel-in bg-[#ece9d8] px-2.5 py-1 flex items-center gap-2 text-xs">
          <button
            onClick={onToggleAmbientAudio}
            className="text-gray-700 hover:text-black cursor-pointer"
            title="Toggle Ambient Audio"
          >
            {ambientAudioEnabled ? '🔊' : '🔈'}
          </button>
          <span className="text-gray-500 font-mono text-[11px]">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </footer>
    </div>
  );
}
