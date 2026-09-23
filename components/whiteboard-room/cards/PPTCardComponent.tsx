"use client";

import React, { useState, useRef } from "react";
import { PPTCard, SlideData, ViewportTransform } from "../types";
import { CardWrapper } from "./CardWrapper";
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  FileText,
  Layers,
  Edit3,
  Check,
  Upload,
  Globe,
  Maximize2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { parsePptxFile } from "../utils/fileParsers";
import { useBoardReadOnly } from "../boardContext";
import { safeHttpsUrl } from "../utils/safety";

interface PPTCardProps {
  card: PPTCard;
  viewport: ViewportTransform;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (cardId: string, updates: any) => void;
  onDelete: (cardId: string) => void;
}

export const PPTCardComponent: React.FC<PPTCardProps> = ({
  card,
  viewport,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [embedInput, setEmbedInput] = useState(card.data.embedUrl || "");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const readOnly = useBoardReadOnly();

  const { slides, currentSlide, deckTitle, sourceType, embedUrl, fileName } = card.data;
  const safeEmbedUrl = safeHttpsUrl(embedUrl);
  const activeSlide = slides[currentSlide] || slides[0] || {
    title: "Empty Slide",
    bullets: ["Click + Slide to add content"],
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      onUpdate(card.id, {
        data: {
          ...card.data,
          currentSlide: currentSlide - 1,
        },
      });
    }
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      onUpdate(card.id, {
        data: {
          ...card.data,
          currentSlide: currentSlide + 1,
        },
      });
    }
  };

  const handleSelectSlide = (idx: number) => {
    onUpdate(card.id, {
      data: {
        ...card.data,
        currentSlide: idx,
      },
    });
  };

  // Upload genuine .pptx presentation
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMsg(`Parsing ${file.name}...`);

    try {
      const parsed = await parsePptxFile(file);
      onUpdate(card.id, {
        title: file.name,
        data: {
          ...card.data,
          deckTitle: parsed.deckTitle,
          fileName: file.name,
          slides: parsed.slides,
          currentSlide: 0,
          sourceType: "native",
        },
      });
      setStatusMsg(`Loaded ${parsed.slides.length} slides!`);
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      setStatusMsg(`Failed to parse: ${err.message}`);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyEmbed = () => {
    if (!safeHttpsUrl(embedInput)) {
      setStatusMsg("Embed links must start with https://");
      setTimeout(() => setStatusMsg(null), 3500);
      return;
    }
    onUpdate(card.id, {
      data: {
        ...card.data,
        sourceType: "embed",
        embedUrl: embedInput.trim(),
      },
    });
    setShowEmbedDialog(false);
  };

  const handleAddSlide = () => {
    const newSlide: SlideData = {
      title: `Slide ${slides.length + 1}: Classroom Discussion`,
      subtitle: "Interactive Whiteboard Notes",
      bullets: [
        "Key topic identified during classroom discussion",
        "Student question or hypothesis",
        "Homework problem or exam takeaway",
      ],
      bgTheme: "light",
      diagramType: "columns",
    };
    onUpdate(card.id, {
      data: {
        ...card.data,
        slides: [...slides, newSlide],
        currentSlide: slides.length,
      },
    });
  };

  const getSlideBgClass = (theme?: string) => {
    switch (theme) {
      case "dark":
        return "bg-neutral-900 text-white";
      case "navy":
        return "bg-slate-900 text-white";
      case "forest":
        return "bg-emerald-950 text-white";
      case "light":
      default:
        return "bg-white text-neutral-900";
    }
  };

  return (
    <CardWrapper
      card={card}
      viewport={viewport}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      icon={<Presentation className="w-4 h-4 text-orange-400" />}
      headerColorClass="bg-[#C43E1C] border-b border-[#962F15]"
      badgeText={sourceType === "embed" ? "Office Online PPT" : "PowerPoint Deck (.pptx)"}
    >
      <div className="flex flex-col h-full bg-[#1e1e1e] text-neutral-200 select-none overflow-hidden">
        {/* PowerPoint Ribbon Toolbar */}
        <div className="px-3 py-1.5 bg-[#2d2d2d] border-b border-neutral-700 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-1.5">
            {/* Hidden Input for .pptx */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pptx"
              onChange={handleFileUpload}
              className="hidden"
            />
            {!readOnly && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 bg-[#C43E1C] hover:bg-[#a83315] text-white rounded font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
              title="Open a real .pptx PowerPoint presentation from your computer"
            >
              <Upload className="w-3 h-3" />
              <span>Open .pptx File</span>
            </button>
            )}

            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-1 px-2 rounded text-[11px] flex items-center gap-1 font-medium transition-colors ${
                showThumbnails ? "bg-neutral-600 text-white" : "hover:bg-neutral-700 text-neutral-300"
              }`}
              title="Toggle slide deck thumbnails"
            >
              <Layers className="w-3 h-3" /> Slides ({slides.length})
            </button>

            {!readOnly && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-1 px-2 rounded text-[11px] flex items-center gap-1 font-medium transition-colors ${
                showNotes ? "bg-neutral-600 text-white" : "hover:bg-neutral-700 text-neutral-300"
              }`}
              title="Toggle speaker / teacher notes"
            >
              <FileText className="w-3 h-3" /> Notes
            </button>
            )}

            {!readOnly && (
            <button
              onClick={() => setShowEmbedDialog(!showEmbedDialog)}
              className="px-2 py-1 hover:bg-neutral-700 rounded text-[11px] font-medium flex items-center gap-1 text-neutral-300 transition-colors"
              title="Embed Microsoft 365 or Google Slides link"
            >
              <Globe className="w-3 h-3" />
              <span>Embed Link</span>
            </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-neutral-400 text-xs">
            {statusMsg ? (
              <span className="text-orange-400 font-medium bg-neutral-800 px-2 py-0.5 rounded text-[10px] animate-pulse">
                {statusMsg}
              </span>
            ) : readOnly ? (
              <span className="text-[10px] text-neutral-500">Following the trainer&apos;s slides</span>
            ) : null}
          </div>
        </div>

        {/* Embed Link Dialog */}
        {showEmbedDialog && !readOnly && (
          <div className="bg-[#3a1d17] text-white p-3 border-b border-orange-900 text-xs animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1 text-sm text-orange-200">
                <Globe className="w-4 h-4" /> Embed Microsoft PowerPoint Online or Google Slides
              </span>
              <button onClick={() => setShowEmbedDialog(false)} className="text-orange-300 hover:text-white">
                ✕
              </button>
            </div>
            <p className="text-[11px] text-orange-200 mb-2">
              Paste an official Microsoft 365 / OneDrive embed URL or published Google Slides link:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={embedInput}
                onChange={(e) => setEmbedInput(e.target.value)}
                placeholder="https://onedrive.live.com/embed?... or Google Slides embed link"
                className="flex-1 bg-neutral-900 text-white px-2 py-1 rounded text-xs border border-orange-800 focus:outline-none"
              />
              <button
                onClick={handleApplyEmbed}
                className="px-3 py-1 bg-[#C43E1C] hover:bg-[#a83315] font-semibold rounded text-xs transition-colors"
              >
                Embed
              </button>
            </div>
          </div>
        )}

        {/* Main Stage & Slide Viewer */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Thumbnails Sidebar */}
          {showThumbnails && sourceType !== "embed" && (
            <div className="w-36 bg-[#252525] border-r border-neutral-700 p-2 overflow-y-auto flex flex-col gap-2 shrink-0">
              <div className="flex items-center justify-between px-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                <span>Slides</span>
                {!readOnly && (
                <button
                  onClick={handleAddSlide}
                  className="text-orange-400 hover:text-orange-300"
                  title="Add new slide"
                >
                  <Plus className="w-3 h-3" />
                </button>
                )}
              </div>

              {slides.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => { if (!readOnly) handleSelectSlide(idx); }}
                  className={`p-1.5 rounded cursor-pointer border text-left transition-all ${
                    idx === currentSlide
                      ? "border-orange-500 bg-orange-950/40 ring-1 ring-orange-500"
                      : "border-neutral-700 bg-neutral-800 hover:border-neutral-500"
                  }`}
                >
                  <div className="text-[9px] font-bold text-neutral-400 mb-0.5">#{idx + 1}</div>
                  <div className="text-[10px] font-medium line-clamp-2 text-neutral-200">
                    {s.title}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slide Presentation Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#141414] overflow-hidden">
            {sourceType === "embed" && safeEmbedUrl ? (
              <iframe
                src={safeEmbedUrl}
                className="w-full h-full bg-white rounded shadow-md border border-neutral-700"
                title="Embedded PowerPoint Deck"
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
              />
            ) : (
              <div
                className={`w-full max-w-2xl aspect-[16/9] rounded-lg shadow-2xl p-6 flex flex-col justify-between transition-all duration-300 relative overflow-hidden border border-neutral-700/60 ${getSlideBgClass(
                  activeSlide.bgTheme
                )}`}
              >
                {/* Decorative Slide Corner Accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-transparent pointer-events-none" />

                {/* Slide Header */}
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight mb-1">
                    {activeSlide.title}
                  </h2>
                  {activeSlide.subtitle && (
                    <p className="text-sm opacity-70 font-medium">{activeSlide.subtitle}</p>
                  )}
                  <div className="w-12 h-1 bg-[#C43E1C] rounded-full mt-2" />
                </div>

                {/* Slide Body */}
                <div className="my-auto py-2">
                  {activeSlide.bullets && activeSlide.bullets.length > 0 && (
                    <ul className="space-y-2 text-sm leading-relaxed">
                      {activeSlide.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-[#C43E1C] font-bold mt-0.5">&bull;</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Slide Footer */}
                <div className="flex items-center justify-between text-[10px] opacity-60 pt-2 border-t border-neutral-500/20">
                  <span className="font-semibold">{deckTitle}</span>
                  <span>
                    Slide {currentSlide + 1} of {slides.length}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Presenter Notes Bar */}
        {showNotes && !readOnly && activeSlide.presenterNotes && (
          <div className="bg-[#242424] border-t border-neutral-700 p-2.5 px-4 text-xs text-amber-200/90 flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 mr-1">Speaker Notes:</span>
              <span>{activeSlide.presenterNotes}</span>
            </div>
          </div>
        )}

        {/* Slide Navigation Bottom Bar */}
        <div className="px-3 py-1.5 bg-[#252525] border-t border-neutral-700 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            {!readOnly && (
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="p-1 px-2 rounded bg-neutral-700 hover:bg-neutral-600 disabled:opacity-30 disabled:hover:bg-neutral-700 text-white flex items-center gap-1 font-semibold transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            )}
            <span className="text-neutral-400 text-xs font-mono">
              {currentSlide + 1} / {slides.length}
            </span>
            {!readOnly && (
            <button
              onClick={handleNext}
              disabled={currentSlide >= slides.length - 1}
              className="p-1 px-2 rounded bg-neutral-700 hover:bg-neutral-600 disabled:opacity-30 disabled:hover:bg-neutral-700 text-white flex items-center gap-1 font-semibold transition-colors"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
            )}
          </div>

          <div className="text-[11px] text-neutral-400 font-mono">
            {fileName || `${deckTitle}.pptx`}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
