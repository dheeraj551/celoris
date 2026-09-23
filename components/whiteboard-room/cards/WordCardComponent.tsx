"use client";

import React, { useState, useRef, useMemo } from "react";
import { WordCard, ViewportTransform } from "../types";
import { CardWrapper } from "./CardWrapper";
import {
  FileText,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Download,
  Upload,
  BookOpen,
  Globe,
  ExternalLink,
  Eye,
  Edit3,
  Sparkles,
} from "lucide-react";
import { parseWordFile } from "../utils/fileParsers";
import { useBoardReadOnly } from "../boardContext";
import { sanitizeDocHtml, safeHttpsUrl } from "../utils/safety";

interface WordCardProps {
  card: WordCard;
  viewport: ViewportTransform;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (cardId: string, updates: any) => void;
  onDelete: (cardId: string) => void;
}

export const WordCardComponent: React.FC<WordCardProps> = ({
  card,
  viewport,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const { docTitle, author, lastModified, content, isHtml, sourceType, embedUrl } = card.data;
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const [embedInput, setEmbedInput] = useState(embedUrl || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const readOnly = useBoardReadOnly();
  const safeEmbedUrl = safeHttpsUrl(embedUrl);
  // Sanitised on every render — the stored HTML came from a .docx the trainer
  // uploaded (or typed), and it's shown to every student in the room.
  const safeHtml = useMemo(() => (isHtml ? sanitizeDocHtml(content) : ""), [isHtml, content]);

  // Upload genuine .docx file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMsg(`Loading ${file.name}...`);

    try {
      const parsed = await parseWordFile(file);
      onUpdate(card.id, {
        title: file.name,
        data: {
          ...card.data,
          fileName: parsed.fileName,
          docTitle: parsed.docTitle,
          content: parsed.htmlContent,
          isHtml: true,
          sourceType: "native",
          lastModified: "Just imported",
        },
      });
      setLocalContent(parsed.htmlContent);
      setIsEditing(false);
      setStatusMsg(`Loaded "${file.name}"!`);
      setTimeout(() => setStatusMsg(null), 3500);
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveEdit = () => {
    onUpdate(card.id, {
      data: {
        ...card.data,
        content: localContent,
        lastModified: "Just now",
      },
    });
    setIsEditing(false);
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

  return (
    <CardWrapper
      card={card}
      viewport={viewport}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      icon={<FileText className="w-4 h-4 text-blue-400" />}
      headerColorClass="bg-[#2B579A] border-b border-[#204375]"
      badgeText={sourceType === "embed" ? "Office Online Doc" : "Word Document (.docx)"}
    >
      <div className="flex flex-col h-full bg-[#f3f4f6] text-neutral-800 select-none overflow-hidden">
        {/* Document Action Ribbon (trainer only) */}
        {!readOnly && (
        <div className="px-3 py-1.5 bg-[#f9fafb] border-b border-neutral-300 flex items-center justify-between text-xs text-neutral-700">
          <div className="flex items-center gap-1.5">
            {/* Hidden Input for .docx */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 bg-white hover:bg-blue-50 text-blue-800 border border-blue-300 rounded font-semibold text-[11px] flex items-center gap-1 shadow-sm transition-colors"
              title="Open a real .docx assignment or document from your computer"
            >
              <Upload className="w-3 h-3 text-blue-600" />
              <span>Open .docx File</span>
            </button>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition-colors ${
                isEditing
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-300"
              }`}
            >
              {isEditing ? <Eye className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
              <span>{isEditing ? "View Doc" : "Edit / Answer"}</span>
            </button>

            <button
              onClick={() => setShowEmbedDialog(!showEmbedDialog)}
              className="px-2 py-1 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
              title="Embed Microsoft 365 or Google Docs URL"
            >
              <Globe className="w-3 h-3 text-neutral-500" />
              <span>Embed Link</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
            {statusMsg ? (
              <span className="text-blue-700 font-medium bg-blue-100 px-2 py-0.5 rounded text-[10px] animate-pulse">
                {statusMsg}
              </span>
            ) : null}
          </div>
        </div>
        )}

        {/* Embed Link Dialog */}
        {showEmbedDialog && !readOnly && (
          <div className="bg-blue-900 text-white p-3 border-b border-blue-800 text-xs animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold flex items-center gap-1 text-sm text-blue-200">
                <Globe className="w-4 h-4" /> Embed Microsoft Word Online or Google Docs
              </span>
              <button onClick={() => setShowEmbedDialog(false)} className="text-blue-300 hover:text-white">
                ✕
              </button>
            </div>
            <p className="text-[11px] text-blue-200 mb-2">
              Paste an official Microsoft 365 / OneDrive embed URL or published Google Docs link to view live:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={embedInput}
                onChange={(e) => setEmbedInput(e.target.value)}
                placeholder="https://onedrive.live.com/embed?... or Google Docs publish link"
                className="flex-1 bg-white text-neutral-900 px-2 py-1 rounded text-xs focus:outline-none"
              />
              <button
                onClick={handleApplyEmbed}
                className="px-3 py-1 bg-blue-500 hover:bg-blue-400 font-semibold rounded text-xs transition-colors"
              >
                Embed
              </button>
            </div>
          </div>
        )}

        {/* Document Content Area */}
        <div className="flex-1 overflow-auto p-4 bg-[#e5e7eb] flex justify-center">
          {sourceType === "embed" && safeEmbedUrl ? (
            <iframe
              src={safeEmbedUrl}
              className="w-full h-full bg-white rounded shadow-sm border border-neutral-300"
              title="Embedded Document"
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : isEditing && !readOnly ? (
            <div className="w-full max-w-2xl bg-white shadow-md rounded-sm p-6 border border-neutral-300 flex flex-col gap-2">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-xs text-neutral-700">Student Editor & Markdown Notes</span>
                <button
                  onClick={handleSaveEdit}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                >
                  Save Changes
                </button>
              </div>
              <textarea
                value={localContent}
                onChange={(e) => setLocalContent(e.target.value)}
                className="w-full h-64 flex-1 font-sans text-xs p-2 border border-neutral-200 rounded focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Type your notes or answers here..."
              />
            </div>
          ) : (
            /* Authentic Word Document Sheet */
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-sm p-8 border border-neutral-300 min-h-[400px] text-neutral-900 font-serif selection:bg-blue-100">
              {isHtml ? (
                <div
                  className="prose prose-sm max-w-none prose-headings:font-sans prose-headings:text-neutral-900 prose-p:text-neutral-800 prose-li:text-neutral-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: safeHtml }}
                />
              ) : (
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-neutral-800">
                  {content}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Word Document Footer Status */}
        <div className="px-3 py-1 bg-white border-t border-neutral-300 flex items-center justify-between text-[10px] text-neutral-500">
          <span className="font-medium text-neutral-700">{docTitle}</span>
          <span className="font-mono">{card.data.fileName || "Standard Document Page"}</span>
        </div>
      </div>
    </CardWrapper>
  );
};
