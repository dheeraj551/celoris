"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Hand,
  Image as ImageIcon,
  Maximize,
  MessageSquare,
  Mic,
  MicOff,
  Minus,
  MonitorUp,
  MonitorX,
  Plus,
  Presentation,
  Redo2,
  Trash2,
  Undo2,
  Users,
  Youtube,
} from "lucide-react";
import type { CardType } from "./types";
import type { RoomParticipant } from "./hooks/useWhiteboardRoom";

interface RoomTopBarProps {
  roomName: string;
  isHost: boolean;
  connected: boolean;
  participants: RoomParticipant[];
  // board (trainer)
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onAddCard: (type: Exclude<CardType, "screenshare">) => void;
  // view
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onDownload: () => void;
  // media
  sharingScreen: boolean;
  onToggleScreenShare: () => void;
  micOn: boolean;
  canSpeak: boolean;
  onToggleMic: () => void;
  handRaised: boolean;
  onToggleHand: () => void;
  // panels
  panelOpen: boolean;
  unread: number;
  onTogglePanel: () => void;
  onLeave: () => void;
}

const INSERT_OPTIONS: { type: Exclude<CardType, "screenshare">; label: string; hint: string; icon: React.ReactNode }[] = [
  { type: "excel", label: "Spreadsheet", hint: "Open .xlsx or teach formulas live", icon: <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> },
  { type: "image", label: "Image / diagram", hint: "Upload, paste or link a picture", icon: <ImageIcon className="w-4 h-4 text-purple-600" /> },
  { type: "youtube", label: "YouTube video", hint: "Paste a video link", icon: <Youtube className="w-4 h-4 text-red-600" /> },
  { type: "word", label: "Word document", hint: "Open a .docx (text & headings)", icon: <FileText className="w-4 h-4 text-blue-600" /> },
  { type: "ppt", label: "Slides (text only)", hint: "Opens a .pptx's text — share your screen for full design", icon: <Presentation className="w-4 h-4 text-orange-600" /> },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return (parts[0] || "?").slice(0, 2).toUpperCase();
}

export const RoomTopBar: React.FC<RoomTopBarProps> = (props) => {
  const {
    roomName,
    isHost,
    connected,
    participants,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onClear,
    onAddCard,
    zoom,
    onZoomIn,
    onZoomOut,
    onFit,
    onDownload,
    sharingScreen,
    onToggleScreenShare,
    micOn,
    canSpeak,
    onToggleMic,
    handRaised,
    onToggleHand,
    panelOpen,
    unread,
    onTogglePanel,
    onLeave,
  } = props;

  const [insertOpen, setInsertOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const insertRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!insertOpen) return;
    const close = (e: MouseEvent) => {
      if (insertRef.current && !insertRef.current.contains(e.target as Node)) setInsertOpen(false);
    };
    window.addEventListener("mousedown", close);
    return () => window.removeEventListener("mousedown", close);
  }, [insertOpen]);

  const hands = participants.filter((p) => p.handRaised && !p.isHost).length;
  const shown = participants.slice(0, 5);

  const iconBtn =
    "h-9 w-9 rounded-xl flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors";

  return (
    <header className="relative z-40 h-14 shrink-0 bg-white/95 backdrop-blur border-b border-neutral-200 px-2 sm:px-3 flex items-center gap-2 text-neutral-800">
      {/* Left: leave + room */}
      <button onClick={onLeave} className={iconBtn} title="Leave room">
        <ArrowLeft className="w-4 h-4" />
      </button>
      <div className="min-w-0 flex items-center gap-2 mr-1">
        <span className={`w-2 h-2 rounded-full shrink-0 ${connected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"}`} />
        <div className="min-w-0">
          <div className="text-sm font-bold truncate max-w-[9rem] sm:max-w-[16rem]">{roomName}</div>
          <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold truncate">
            {isHost ? "You're teaching" : "Live class"} · Whiteboard
          </div>
        </div>
      </div>

      {/* Center: trainer tools */}
      <div className="flex-1 flex items-center justify-center gap-1 min-w-0">
        {isHost && (
          <>
            <div className="relative" ref={insertRef}>
              <button
                onClick={() => setInsertOpen((o) => !o)}
                className="h-9 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Insert</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
              {insertOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-1.5 z-50">
                  {INSERT_OPTIONS.map((o) => (
                    <button
                      key={o.type}
                      onClick={() => {
                        setInsertOpen(false);
                        onAddCard(o.type);
                      }}
                      className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-neutral-50 text-left"
                    >
                      <span className="mt-0.5">{o.icon}</span>
                      <span>
                        <span className="block text-sm font-semibold text-neutral-800">{o.label}</span>
                        <span className="block text-[11px] text-neutral-500">{o.hint}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onToggleScreenShare}
              className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                sharingScreen
                  ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                  : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
              }`}
              title={sharingScreen ? "Stop sharing your screen" : "Share your screen (PowerPoint, Word, anything)"}
            >
              {sharingScreen ? <MonitorX className="w-4 h-4" /> : <MonitorUp className="w-4 h-4" />}
              <span className="hidden md:inline">{sharingScreen ? "Stop sharing" : "Share screen"}</span>
            </button>

            <div className="hidden sm:flex items-center ml-1">
              <button onClick={onUndo} disabled={!canUndo} className={iconBtn} title="Undo (Ctrl+Z)">
                <Undo2 className="w-4 h-4" />
              </button>
              <button onClick={onRedo} disabled={!canRedo} className={iconBtn} title="Redo (Ctrl+Y)">
                <Redo2 className="w-4 h-4" />
              </button>
              <div className="relative">
                <button onClick={() => setConfirmClear((c) => !c)} className={iconBtn} title="Clear all ink">
                  <Trash2 className="w-4 h-4" />
                </button>
                {confirmClear && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-neutral-200 p-3 z-50 text-xs">
                    <p className="text-neutral-700 mb-2">Erase all writing for everyone? Cards stay. You can undo this.</p>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setConfirmClear(false)} className="px-2.5 py-1 rounded-lg hover:bg-neutral-100">
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setConfirmClear(false);
                          onClear();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700"
                      >
                        Clear ink
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="hidden md:flex items-center ml-1 rounded-xl border border-neutral-200">
          <button onClick={onZoomOut} className={iconBtn} title="Zoom out">
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono w-10 text-center text-neutral-500">{Math.round(zoom * 100)}%</span>
          <button onClick={onZoomIn} className={iconBtn} title="Zoom in">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={onFit} className={iconBtn} title="Fit everything on screen">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
        <button onClick={onDownload} className={`${iconBtn} hidden sm:flex`} title="Download the board as an image">
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Right: people + voice + chat */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button onClick={onTogglePanel} className="hidden lg:flex items-center -space-x-2 mr-1" title="People in this class">
          {shown.map((p) => (
            <span
              key={p.id}
              className={`w-7 h-7 rounded-full ring-2 ring-white text-[10px] font-bold text-white flex items-center justify-center ${
                p.speaking > 0.08 ? "outline outline-2 outline-emerald-400" : ""
              }`}
              style={{ backgroundColor: p.color }}
              title={`${p.name}${p.isHost ? " (trainer)" : ""}`}
            >
              {initials(p.name)}
            </span>
          ))}
          {participants.length > shown.length && (
            <span className="w-7 h-7 rounded-full ring-2 ring-white bg-neutral-200 text-[10px] font-bold text-neutral-600 flex items-center justify-center">
              +{participants.length - shown.length}
            </span>
          )}
        </button>

        {isHost && hands > 0 && (
          <button
            onClick={onTogglePanel}
            className="h-9 px-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1"
            title="Raised hands"
          >
            <Hand className="w-4 h-4" /> {hands}
          </button>
        )}

        {!isHost && (
          <button
            onClick={onToggleHand}
            className={`h-9 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
              handRaised ? "bg-amber-400 text-amber-950 border-amber-400" : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
            }`}
            title={handRaised ? "Lower your hand" : "Raise your hand to ask to speak"}
          >
            <Hand className="w-4 h-4" />
            <span className="hidden sm:inline">{handRaised ? "Hand raised" : "Raise hand"}</span>
          </button>
        )}

        <button
          onClick={onToggleMic}
          disabled={!canSpeak}
          className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-colors disabled:opacity-40 ${
            micOn && canSpeak ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-neutral-500 border-neutral-200"
          }`}
          title={!canSpeak ? "The trainer can let you speak after you raise your hand" : micOn ? "Mute" : "Unmute"}
        >
          {micOn && canSpeak ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        <button
          onClick={onTogglePanel}
          className={`relative h-9 px-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            panelOpen ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
          }`}
          title="Chat & people"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Chat</span>
          <Users className="w-3.5 h-3.5 opacity-70 hidden sm:inline" />
          <span className="text-[11px] opacity-80">{participants.length}</span>
          {unread > 0 && !panelOpen && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
