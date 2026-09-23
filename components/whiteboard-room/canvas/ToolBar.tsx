"use client";

import React, { useState } from "react";
import {
  PenTool,
  Pencil,
  Pen,
  Highlighter,
  Eraser,
  Hand,
  Flame,
  Palette,
  Layers,
  Sparkles,
  Sliders,
} from "lucide-react";
import { ToolType, PaperTextureType } from "../types";

interface ToolBarProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  currentColor: string;
  onSelectColor: (color: string) => void;
  strokeSize: number;
  onSelectSize: (size: number) => void;
  paperTexture: PaperTextureType;
  onSelectPaperTexture: (texture: PaperTextureType) => void;
  livePressure: number;
}

const COLOR_PRESETS = [
  { name: "Charcoal Ink", value: "#1c1917" },
  { name: "Executive Navy", value: "#1e3a8a" },
  { name: "Crimson Red", value: "#dc2626" },
  { name: "Forest Emerald", value: "#059669" },
  { name: "Royal Violet", value: "#7c3aed" },
  { name: "Amber Ochre", value: "#d97706" },
  { name: "Highlighter Yellow", value: "#facc15" },
  { name: "Graphite Gray", value: "#4b5563" },
];

const SIZE_PRESETS = [
  { label: "Fine", size: 2.5 },
  { label: "Medium", size: 5 },
  { label: "Bold", size: 9 },
  { label: "Chisel", size: 16 },
];

const PAPER_PRESETS: { id: PaperTextureType; label: string; desc: string }[] = [
  { id: "paper-plain", label: "Natural Paper", desc: "Clean off-white fibrous tooth" },
  { id: "paper-grid", label: "Engineering Grid", desc: "5mm architectural square grid" },
  { id: "paper-dots", label: "Dot Matrix", desc: "Subtle dotted bullet journal" },
  { id: "paper-lined", label: "Ruled Paper", desc: "Classic horizontal notebook lines" },
  { id: "dark-grid", label: "Dark Blueprint", desc: "Night engineering dark grid" },
  { id: "parchment", label: "Warm Parchment", desc: "Organic aged vintage paper" },
];

export const ToolBar: React.FC<ToolBarProps> = ({
  currentTool,
  onSelectTool,
  currentColor,
  onSelectColor,
  strokeSize,
  onSelectSize,
  paperTexture,
  onSelectPaperTexture,
  livePressure,
}) => {
  const [showColorPopover, setShowColorPopover] = useState(false);
  const [showPaperPopover, setShowPaperPopover] = useState(false);

  return (
    <nav
      id="whiteboard-bottom-toolbar"
      aria-label="Drawing Tools"
      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 select-none pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl shadow-2xl border border-neutral-200/90 flex items-center gap-1.5">
        {/* Tool: Fountain Pen (Calligraphy & Bleed) */}
        <button
          id="tool-fountain-pen"
          onClick={() => onSelectTool("fountain-pen")}
          className={`p-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
            currentTool === "fountain-pen"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
          title="Fountain Pen (Realistic organic ink bleeding into paper fibers)"
        >
          <PenTool className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Fountain Pen</span>
        </button>

        {/* Tool: Sketching Pencil (Graphite) */}
        <button
          id="tool-sketch-pencil"
          onClick={() => onSelectTool("sketch-pencil")}
          className={`p-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
            currentTool === "sketch-pencil"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
          title="Sketching Pencil (Soft 2B graphite with paper tooth)"
        >
          <Pencil className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Pencil</span>
        </button>

        {/* Tool: Ballpoint Pen */}
        <button
          id="tool-ballpoint"
          onClick={() => onSelectTool("ballpoint")}
          className={`p-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
            currentTool === "ballpoint"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
          title="Ballpoint Pen (Fluid oil-based ink)"
        >
          <Pen className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Ballpoint</span>
        </button>

        {/* Tool: Chisel Highlighter */}
        <button
          id="tool-marker-highlighter"
          onClick={() => onSelectTool("marker-highlighter")}
          className={`p-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
            currentTool === "marker-highlighter"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
          title="Chisel Highlighter (Translucent multiply ink for documents)"
        >
          <Highlighter className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Highlighter</span>
        </button>

        {/* Tool: Eraser */}
        <button
          id="tool-eraser"
          onClick={() => onSelectTool("eraser")}
          className={`p-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
            currentTool === "eraser"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
          title="Eraser"
        >
          <Eraser className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Eraser</span>
        </button>

        {/* Tool: Laser Pointer (Presentation Mode) */}
        <button
          id="tool-laser-pointer"
          onClick={() => onSelectTool("laser-pointer")}
          className={`p-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
            currentTool === "laser-pointer"
              ? "bg-rose-600 text-white shadow-md shadow-rose-500/20"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
          title="Laser Pointer (Live presentation beam with fading trail)"
        >
          <Flame className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-semibold hidden md:inline">Laser</span>
        </button>

        {/* Tool: Hand / Pan */}
        <button
          id="tool-hand-pan"
          onClick={() => onSelectTool("hand-pan")}
          className={`p-2 rounded-xl flex items-center gap-1.5 transition-all relative ${
            currentTool === "hand-pan"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-neutral-700 hover:bg-neutral-100"
          }`}
          title="Pan Canvas (Space + Drag or Middle Click)"
        >
          <Hand className="w-4 h-4" />
          <span className="text-xs font-semibold hidden md:inline">Pan</span>
        </button>

        <div className="h-6 w-px bg-neutral-200 mx-1" />

        {/* Color Palette Popover */}
        <div className="relative">
          <button
            id="btn-color-palette"
            onClick={() => {
              setShowColorPopover(!showColorPopover);
              setShowPaperPopover(false);
            }}
            className="p-1.5 rounded-xl border border-neutral-300 hover:border-neutral-400 flex items-center gap-1.5 transition-all"
            title="Choose Ink Color"
          >
            <div
              className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
              style={{ backgroundColor: currentColor }}
            />
          </button>

          {showColorPopover && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-3 w-56 z-40 text-xs">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Pigment Ink Palette
              </div>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      onSelectColor(c.value);
                      setShowColorPopover(false);
                    }}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-transform hover:scale-110 ${
                      currentColor === c.value
                        ? "border-indigo-600 ring-2 ring-indigo-500 ring-offset-2"
                        : "border-black/10"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                <span className="text-neutral-500 text-[11px]">Custom:</span>
                <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => onSelectColor(e.target.value)}
                  className="w-7 h-7 rounded border border-neutral-300 cursor-pointer p-0 bg-transparent"
                />
                <span className="text-neutral-700 font-mono text-[11px]">{currentColor}</span>
              </div>
            </div>
          )}
        </div>

        {/* Stroke Nib Size Picker */}
        <div className="flex items-center gap-1 bg-neutral-100 px-2 py-1 rounded-xl">
          {SIZE_PRESETS.map((s) => (
            <button
              key={s.label}
              onClick={() => onSelectSize(s.size)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                Math.abs(strokeSize - s.size) < 0.5
                  ? "bg-white text-indigo-700 font-bold shadow-sm"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Paper Texture Popover */}
        <div className="relative">
          <button
            id="btn-paper-texture"
            onClick={() => {
              setShowPaperPopover(!showPaperPopover);
              setShowColorPopover(false);
            }}
            className="p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 flex items-center gap-1.5 transition-colors"
            title="Select Paper Texture & Bleed Pattern"
          >
            <Layers className="w-4 h-4 text-neutral-600" />
            <span className="text-xs font-semibold hidden lg:inline">Paper</span>
          </button>

          {showPaperPopover && (
            <div className="absolute bottom-full right-0 mb-3 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-3 w-64 z-40 text-xs">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Paper Texture & Grid
              </div>
              <div className="space-y-1.5">
                {PAPER_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPaperTexture(p.id);
                      setShowPaperPopover(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-xl text-left border flex items-center justify-between transition-all ${
                      paperTexture === p.id
                        ? "border-indigo-500 bg-indigo-50/70 text-indigo-900 font-medium"
                        : "border-neutral-100 hover:bg-neutral-50 text-neutral-700"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-xs">{p.label}</div>
                      <div className="text-[10px] text-neutral-500">{p.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stylus Pressure Bar Feedback */}
        <div
          className="hidden sm:flex flex-col items-center justify-center px-1.5 py-1 bg-neutral-50 rounded-lg border border-neutral-200"
          title="Live Stylus Pressure Sensor Meter"
        >
          <span className="text-[8px] font-mono uppercase text-neutral-400 font-bold leading-none mb-0.5">
            Pressure
          </span>
          <div className="w-12 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-rose-500 transition-all duration-75"
              style={{ width: `${Math.round(Math.max(0.1, livePressure) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};
