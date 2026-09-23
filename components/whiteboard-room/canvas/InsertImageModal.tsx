"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  X,
  Check,
} from "lucide-react";
import { fileToBoardImage } from "../utils/imageTools";
import { safeImageSrc } from "../utils/safety";

interface InsertImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (src: string, title: string, naturalWidth?: number, naturalHeight?: number) => void;
}


export const InsertImageModal: React.FC<InsertImageModalProps> = ({
  isOpen,
  onClose,
  onInsert,
}) => {
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [urlPreview, setUrlPreview] = useState<string | null>(null);
  const [urlError, setUrlError] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    // Downscaled + re-encoded so it fits through the room's event log.
    fileToBoardImage(file)
      .then(({ src, width, height }) => {
        onInsert(src, file.name, width, height);
        onClose();
      })
      .catch((err: Error) => alert(err.message));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleUrlPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    if (!safeImageSrc(urlInput)) {
      setUrlError(true);
      return;
    }

    setUrlError(false);
    const img = new Image();
    img.onload = () => {
      setUrlPreview(urlInput.trim());
    };
    img.onerror = () => {
      setUrlError(true);
      setUrlPreview(null);
    };
    img.src = urlInput.trim();
  };

  const handleConfirmUrl = () => {
    if (!urlInput.trim()) return;
    if (!safeImageSrc(urlInput)) {
      setUrlError(true);
      return;
    }
    const img = new Image();
    img.onload = () => {
      onInsert(urlInput.trim(), "Web Image", img.naturalWidth, img.naturalHeight);
      onClose();
    };
    img.onerror = () => {
      setUrlError(true);
    };
    img.src = urlInput.trim();
  };


  return (
    <div
      id="insert-image-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150 pointer-events-auto"
      onClick={onClose}
    >
      <div
        id="insert-image-modal-content"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 leading-none">
                Insert Image to Whiteboard
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Place diagrams, mockups, or photos onto your infinite canvas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 bg-neutral-100/60 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "upload"
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <button
            onClick={() => setActiveTab("url")}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "url"
                ? "border-purple-600 text-purple-700"
                : "border-transparent text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>From Web URL</span>
          </button>

        </div>

        {/* Tab content */}
        <div className="p-5 flex-1 min-h-[260px] flex flex-col justify-center">
          {activeTab === "upload" && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDraggingOver
                  ? "border-purple-500 bg-purple-50/60 scale-[0.99]"
                  : "border-neutral-300 hover:border-purple-400 hover:bg-neutral-50/80 bg-neutral-50/40"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-800">
                Click to browse or drag & drop image
              </p>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                PNG, JPG, WebP or GIF. Large photos are resized automatically so the whole class can load them quickly.
              </p>
              <div className="mt-4 px-3.5 py-1.5 bg-white border border-neutral-200 text-neutral-700 rounded-lg text-xs font-medium shadow-sm hover:bg-neutral-50 transition-colors">
                Select from Device
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          )}

          {activeTab === "url" && (
            <div className="flex flex-col gap-4">
              <form onSubmit={handleUrlPreview} className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="https://example.com/architecture-diagram.png"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-purple-500 focus:bg-white"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Preview
                </button>
              </form>

              {urlError && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  Could not load image from this URL. Please verify the URL points to a public, CORS-accessible image.
                </div>
              )}

              {urlPreview && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full h-36 bg-neutral-900 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-neutral-200">
                    <img
                      src={urlPreview}
                      alt="Preview"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain rounded"
                    />
                  </div>
                  <button
                    onClick={handleConfirmUrl}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    <span>Insert This Image</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="px-5 py-2.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Tip: You can also drag & drop images directly onto the canvas.</span>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
