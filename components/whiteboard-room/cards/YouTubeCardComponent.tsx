"use client";

import React, { useState } from "react";
import { YouTubeCard, ViewportTransform } from "../types";
import { CardWrapper } from "./CardWrapper";
import { Youtube, ExternalLink, Play } from "lucide-react";
import { useBoardReadOnly } from "../boardContext";
import { isYouTubeId, safeHttpsUrl } from "../utils/safety";

interface YouTubeCardProps {
  card: YouTubeCard;
  viewport: ViewportTransform;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (cardId: string, updates: any) => void;
  onDelete: (cardId: string) => void;
}

function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export const YouTubeCardComponent: React.FC<YouTubeCardProps> = ({
  card,
  viewport,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const readOnly = useBoardReadOnly();
  const [inputUrl, setInputUrl] = useState(card.data.url);
  const [urlError, setUrlError] = useState<string | null>(null);
  const videoId = isYouTubeId(card.data.videoId) ? card.data.videoId : null;
  const openUrl = safeHttpsUrl(card.data.url);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractYouTubeId(inputUrl);
    setUrlError(id ? null : "That doesn't look like a YouTube link.");
    if (id) {
      onUpdate(card.id, {
        title: `YouTube: ${id}`,
        data: {
          ...card.data,
          url: inputUrl,
          videoId: id,
          title: `Video (${id})`,
        },
      });
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
      icon={<Youtube className="w-4 h-4 text-red-500" />}
      headerColorClass="bg-neutral-900 border-b border-neutral-700"
      badgeText="Video"
    >
      <div className="flex flex-col h-full bg-neutral-950 text-white">
        {/* Paste a link (trainer only) */}
        {!readOnly && (
        <div className="p-2 border-b border-neutral-800 bg-neutral-900 flex items-center gap-2">
          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-1.5">
            <input
              id={`yt-input-${card.id}`}
              type="text"
              placeholder="Paste YouTube video link..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 text-xs bg-neutral-800 border border-neutral-700 rounded px-2.5 py-1 text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-500"
            />
            <button
              id={`yt-load-${card.id}`}
              type="submit"
              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-current" />
              Load
            </button>
          </form>

        </div>
        )}
        {urlError && !readOnly && (
          <div className="px-3 py-1 text-[11px] text-red-300 bg-red-950/40 border-b border-red-900">{urlError}</div>
        )}

        {/* Video Player Frame */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {videoId ? (
            <iframe
              id={`yt-frame-${card.id}`}
              className="w-full h-full border-0"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
              title={card.data.title || "YouTube video player"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-6 text-neutral-400">
              <Youtube className="w-12 h-12 mx-auto text-neutral-600 mb-2" />
              <p className="text-sm font-medium">No video loaded</p>
              <p className="text-xs text-neutral-500 mt-1">
                {readOnly ? "Your trainer hasn't picked a video yet" : "Paste a YouTube link above to show it to the class"}
              </p>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-3 py-1.5 bg-neutral-900/90 text-neutral-400 text-[11px] flex items-center justify-between border-t border-neutral-800">
          <span className="truncate max-w-[80%]">{card.data.title || "YouTube Stream"}</span>
          {openUrl && (
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 flex items-center gap-1"
            >
              Open <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};
