"use client";

import React from 'react';
import { X, Keyboard, Scissors, Play, Sliders, Type, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  const shortcutSections = [
    {
      title: 'FilmCraft Quick Trimming & Cutting',
      icon: Scissors,
      color: 'text-emerald-400',
      items: [
        { key: 'Q', label: 'Ripple Trim Head to Playhead', desc: 'Trims start of clip to playhead and pulls trailing clips left' },
        { key: 'W', label: 'Ripple Trim Tail to Playhead', desc: 'Trims end of clip to playhead and pulls trailing clips left' },
        { key: 'C / S', label: 'Razor Tool / Split Clip', desc: 'Splits clip under playhead at exact timestamp' },
        { key: 'Shift + Del', label: 'Ripple Delete', desc: 'Deletes selected clip and closes empty timeline gap' },
        { key: 'Del / Backspace', label: 'Delete Clip', desc: 'Deletes selected clip leaving gap in place' },
        { key: 'D', label: 'Duplicate Clip', desc: 'Clones selected clip and places it immediately after' },
      ]
    },
    {
      title: 'Transport & Shuttle Playback',
      icon: Play,
      color: 'text-cyan-400',
      items: [
        { key: 'Space', label: 'Play / Pause', desc: 'Toggles timeline sequence playback' },
        { key: 'J', label: 'Shuttle Reverse', desc: 'Jumps back 1 second or rewinds sequence' },
        { key: 'K', label: 'Stop Playback', desc: 'Pauses sequence immediately' },
        { key: 'L', label: 'Shuttle Forward', desc: 'Jumps forward 1 second or accelerates playback' },
        { key: 'Home / 0', label: 'Jump to Start', desc: 'Moves playhead to 00:00:00' },
        { key: 'End', label: 'Jump to End', desc: 'Moves playhead to duration finish' },
      ]
    },
    {
      title: 'Three-Point Editing & In/Out Marks',
      icon: Sliders,
      color: 'text-amber-400',
      items: [
        { key: 'I', label: 'Set Mark In Point', desc: 'Sets in-point for playback loop or range export' },
        { key: 'O', label: 'Set Mark Out Point', desc: 'Sets out-point for playback loop or range export' },
        { key: 'Alt + X', label: 'Clear In/Out Marks', desc: 'Clears marked sequence boundaries' },
        { key: 'M', label: 'Toggle Magnet Snap', desc: 'Toggles timeline magnetic snapping on/off' },
      ]
    },
    {
      title: 'General & History',
      icon: Command,
      color: 'text-purple-400',
      items: [
        { key: 'Ctrl / ⌘ + Z', label: 'Undo', desc: 'Reverts last timeline or text change' },
        { key: 'Ctrl + Y / ⌘ + ⇧ + Z', label: 'Redo', desc: 'Reapplies previously undone action' },
        { key: '?', label: 'Open Shortcuts Cheat Sheet', desc: 'Toggles this quick reference palette' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0e111a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-4 bg-[#0a0d14] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                FilmCraft & Premiere Pro Shortcuts
                <span className="text-[10px] font-mono font-bold bg-[#ccff00]/15 text-[#ccff00] border border-[#ccff00]/30 px-1.5 py-0.5 rounded">
                  PRO NLE
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Industry-standard single-key editing shortcuts</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 custom-scrollbar text-xs">
          {shortcutSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title} className="space-y-2.5">
                <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
                  <Icon className={`w-3.5 h-3.5 ${section.color}`} />
                  <span>{section.title}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className="p-2.5 bg-[#141722] border border-white/5 rounded-xl flex items-start justify-between gap-3 hover:border-white/15 transition-colors"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="font-semibold text-slate-200">{item.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                      </div>
                      <kbd className="px-2 py-1 bg-black/60 border border-white/10 rounded-lg text-emerald-400 font-mono font-bold text-[11px] shrink-0 shadow-inner">
                        {item.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#0a0d14] border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Press <kbd className="font-mono bg-white/10 px-1 rounded text-white font-bold">?</kbd> anytime to toggle this modal</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}
