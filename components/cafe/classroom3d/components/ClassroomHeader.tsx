"use client"

import React, { useState } from 'react';
import {
  Users,
  Hand,
  Monitor,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Radio,
  Mic,
  MicOff,
  PhoneOff,
} from 'lucide-react';

interface ClassroomHeaderProps {
  presentCount: number;
  handsCount: number;
  courseTitle: string;
  isHost: boolean;
  onSoundToggle?: () => void;
  isMuted?: boolean;
  /** Real mic control — the original demo had no audio anywhere, so this is new. */
  micOn: boolean;
  canSpeak: boolean;
  onToggleMic: () => void;
  onLeave: () => void;
}

export const ClassroomHeader: React.FC<ClassroomHeaderProps> = ({
  presentCount,
  handsCount,
  courseTitle,
  isHost,
  onSoundToggle,
  isMuted = false,
  micOn,
  canSpeak,
  onToggleMic,
  onLeave,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <header
      id="classroom-top-header"
      className="h-14 w-full bg-[#0b0f19] border-b border-[#1e293b] px-4 flex items-center justify-between z-40 select-none"
    >
      {/* Left: Brand, Subject Title & Subtitle */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)]">
          <Monitor className="w-5 h-5 text-slate-950 stroke-[2.2]" />
        </div>

        <div>
          <h1 className="text-base font-semibold text-slate-100 tracking-tight">
            Aula · {courseTitle}
          </h1>
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span className="flex items-center space-x-1 text-emerald-400 font-medium">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>Live lesson</span>
            </span>
            <span>·</span>
            <span>{isHost ? 'You are the trainer' : 'Student mode'}</span>
          </div>
        </div>
      </div>

      {/* Right: Presence and Raised Hands Badges + Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Attendance Pill */}
        <div
          id="badge-attendance"
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#162032] border border-slate-700/60 text-xs font-medium text-slate-200"
        >
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>{presentCount} present</span>
        </div>

        {/* Raised Hands Pill */}
        <div
          id="badge-hands-raised"
          className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-medium text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
        >
          <Hand className="w-3.5 h-3.5 text-amber-400" />
          <span>{handsCount} hands</span>
        </div>

        {/* Mic toggle — real audio, gated by canSpeak (host is always true; a
            student only after being called on) */}
        <button
          onClick={onToggleMic}
          disabled={!canSpeak}
          className={`p-2 rounded-lg border transition-colors ${
            !canSpeak
              ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
              : micOn
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              : 'bg-red-950/60 border-red-500/40 text-red-400 hover:bg-red-900/60'
          }`}
          title={!canSpeak ? 'Trainer muted you' : micOn ? 'Mute mic' : 'Unmute mic'}
        >
          {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Sound effects toggle (chimes) */}
        {onSoundToggle && (
          <button
            onClick={onSoundToggle}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {/* Fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Leave — the original demo had no way to leave the room at all */}
        <button
          onClick={onLeave}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-colors"
        >
          <PhoneOff className="w-3.5 h-3.5" />
          <span>Leave</span>
        </button>
      </div>
    </header>
  );
};
