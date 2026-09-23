"use client";

import React, { useState, useRef } from "react";
import { ImageCard, ViewportTransform } from "../types";
import { CardWrapper } from "./CardWrapper";
import {
  Image as ImageIcon,
  RotateCw,
  Maximize2,
  Minimize2,
  Download,
  RefreshCw,
  AlertCircle,
  FileImage,
  Upload,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { useBoardReadOnly } from "../boardContext";
import { safeImageSrc } from "../utils/safety";
import { fileToBoardImage } from "../utils/imageTools";

interface ImageCardProps {
  card: ImageCard;
  viewport: ViewportTransform;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (cardId: string, updates: any) => void;
  onDelete: (cardId: string) => void;
}

export const ImageCardComponent: React.FC<ImageCardProps> = ({
  card,
  viewport,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const readOnly = useBoardReadOnly();
  // Derived from the shared card (not local state) so students see the
  // trainer's rotate / fit changes.
  const rotation = card.data.rotation || 0;
  const fitMode: "contain" | "cover" = card.data.fitMode || "contain";
  const imageSrc = safeImageSrc(card.data.src);
  const [hasError, setHasError] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);
  const [replaceUrl, setReplaceUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRot = (rotation + 90) % 360;
    onUpdate(card.id, {
      data: {
        ...card.data,
        rotation: newRot,
      },
    });
  };

  const handleToggleFit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newFit = fitMode === "contain" ? "cover" : "contain";
    onUpdate(card.id, {
      data: {
        ...card.data,
        fitMode: newFit,
      },
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageSrc) return;
    try {
      const a = document.createElement("a");
      a.href = imageSrc;
      a.download = card.title || "whiteboard_image.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      window.open(imageSrc, "_blank", "noopener,noreferrer");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    fileToBoardImage(file)
      .then(({ src, width, height }) => {
        setHasError(false);
        setIsReplacing(false);
        onUpdate(card.id, {
          title: file.name,
          data: {
            ...card.data,
            src,
            naturalWidth: width,
            naturalHeight: height,
            aspectRatio: width / height,
          },
        });
      })
      .catch((err: Error) => alert(err.message))
      .finally(() => {
        if (fileInputRef.current) fileInputRef.current.value = "";
      });
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceUrl.trim()) return;
    if (!safeImageSrc(replaceUrl)) {
      alert("Image links must start with https://");
      return;
    }

    const img = new Image();
    img.onload = () => {
      setHasError(false);
      setIsReplacing(false);
      onUpdate(card.id, {
        title: "Web Image",
        data: {
          ...card.data,
          src: replaceUrl.trim(),
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
        },
      });
      setReplaceUrl("");
    };
    img.onerror = () => {
      alert("Could not load image from this URL. Please verify the URL is accessible.");
    };
    img.src = replaceUrl.trim();
  };

  return (
    <CardWrapper
      card={card}
      viewport={viewport}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      icon={<ImageIcon className="w-4 h-4 text-purple-300" />}
      headerColorClass="bg-[#581c87] border-b border-[#3b0764]"
      badgeText="Image"
    >
      <div className="flex flex-col h-full bg-neutral-900 text-neutral-100 select-none overflow-hidden relative">
        {/* Sub-toolbar */}
        {!readOnly && (
        <div className="px-3 py-1.5 bg-neutral-800/90 border-b border-neutral-700/60 flex items-center justify-between text-xs text-neutral-300">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleFit}
              className="px-2 py-0.5 rounded hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
              title={fitMode === "contain" ? "Switch to Fill" : "Switch to Fit"}
            >
              {fitMode === "contain" ? (
                <>
                  <Maximize2 className="w-3 h-3 text-purple-400" />
                  <span>Fit</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3 h-3 text-purple-400" />
                  <span>Fill</span>
                </>
              )}
            </button>

            <button
              onClick={handleRotate}
              className="px-2 py-0.5 rounded hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1 font-medium transition-colors"
              title="Rotate 90 degrees clockwise"
            >
              <RotateCw className="w-3 h-3 text-purple-400" />
              <span>{rotation ? `${rotation}°` : "Rotate"}</span>
            </button>

            <button
              onClick={() => setIsReplacing(!isReplacing)}
              className={`px-2 py-0.5 rounded flex items-center gap-1 font-medium transition-colors ${
                isReplacing
                  ? "bg-purple-600 text-white"
                  : "hover:bg-neutral-700 text-neutral-300 hover:text-white"
              }`}
              title="Replace image or URL"
            >
              <RefreshCw className="w-3 h-3 text-purple-400" />
              <span>Replace</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleDownload}
              className="p-1 rounded hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
              title="Download image"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        )}

        {/* Replace image overlay */}
        {isReplacing && !readOnly && (
          <div className="absolute top-8 left-0 right-0 z-20 bg-neutral-900/95 backdrop-blur-md border-b border-purple-500/30 p-3 shadow-xl flex flex-col gap-2">
            <div className="text-xs font-semibold text-neutral-200 flex items-center justify-between">
              <span>Change Image Source</span>
              <button
                onClick={() => setIsReplacing(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-1.5 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <form onSubmit={handleApplyUrl} className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <LinkIcon className="w-3 h-3 text-neutral-400 absolute left-2 top-2.5" />
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={replaceUrl}
                  onChange={(e) => setReplaceUrl(e.target.value)}
                  className="w-full pl-7 pr-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                type="submit"
                disabled={!replaceUrl.trim()}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-white rounded text-xs font-medium border border-neutral-700"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Image viewport */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-neutral-950 p-2">
          {hasError || !imageSrc ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-400 gap-2">
              <AlertCircle className="w-8 h-8 text-amber-500" />
              <div className="text-xs font-medium text-neutral-200">Unable to load image</div>
              <div className="text-[11px] text-neutral-500 max-w-xs">
                The image link may be expired, private, or invalid.
              </div>
              {!readOnly && (
              <button
                onClick={() => setIsReplacing(true)}
                className="mt-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-medium flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace Image</span>
              </button>
              )}
            </div>
          ) : (
            <img
              src={imageSrc}
              alt={card.data.alt || card.title}
              onError={() => setHasError(true)}
              referrerPolicy="no-referrer"
              className={`max-w-full max-h-full transition-transform duration-200 pointer-events-none rounded ${
                fitMode === "cover" ? "w-full h-full object-cover" : "object-contain"
              }`}
              style={{
                transform: `rotate(${rotation}deg)`,
              }}
            />
          )}
        </div>
      </div>
    </CardWrapper>
  );
};
