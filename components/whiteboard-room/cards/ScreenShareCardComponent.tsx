"use client";

import React, { useEffect, useRef, useState } from "react";
import { ScreenShareCard, ViewportTransform } from "../types";
import { CardWrapper } from "./CardWrapper";
import {
  Monitor,
  Maximize2,
  Volume2,
  VolumeX,
  Radio,
  StopCircle,
  ExternalLink,
  Sparkles,
  Share2,
  Video,
} from "lucide-react";
import { screenShareService } from "../services/screenShareRegistry";

interface ScreenShareCardProps {
  card: ScreenShareCard;
  viewport: ViewportTransform;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (cardId: string, updates: any) => void;
  onDelete: (cardId: string) => void;
  localUserId?: string;
  onStopScreenShare?: () => void;
}

export const ScreenShareCardComponent: React.FC<ScreenShareCardProps> = ({
  card,
  viewport,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  localUserId,
  onStopScreenShare,
}) => {
  const { streamId, presenterId, presenterName, presenterColor, isLive, hasAudio, startedAt } =
    card.data;

  const isLocalPresenter = localUserId === presenterId;
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasStream, setHasStream] = useState(false);
  const [hasFallbackFrame, setHasFallbackFrame] = useState(false);
  const [isMuted, setIsMuted] = useState(isLocalPresenter); // local presenter always muted to prevent audio feedback
  const [elapsedTime, setElapsedTime] = useState("00:00");
  const [isPipSupported, setIsPipSupported] = useState(false);

  // Timer counter
  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - (startedAt || now)) / 1000));
      const mins = Math.floor(diffSec / 60);
      const secs = diffSec % 60;
      setElapsedTime(
        `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  // Check PiP capability
  useEffect(() => {
    if (typeof document !== "undefined" && "pictureInPictureEnabled" in document) {
      setIsPipSupported(true);
    }
  }, []);

  // Subscribe to screen share stream updates (WebRTC MediaStream or fallback frames)
  useEffect(() => {
    const attachStreamToVideo = (stream: MediaStream) => {
      if (videoRef.current) {
        if (videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream;
        }
        videoRef.current.play().catch(() => {});
        setHasStream(true);
      }
    };

    const drawFrameToCanvas = (frameData: string) => {
      if (!canvasRef.current) return;
      const img = new Image();
      img.onload = () => {
        const cvs = canvasRef.current;
        if (!cvs) return;
        const ctx = cvs.getContext("2d");
        if (ctx) {
          cvs.width = img.naturalWidth || 1280;
          cvs.height = img.naturalHeight || 720;
          ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
          setHasFallbackFrame(true);
        }
      };
      img.src = frameData;
    };

    // 1. Direct local check
    const existing = screenShareService.getStream(streamId);
    if (existing) {
      attachStreamToVideo(existing);
    } else {
      const existingFrame = screenShareService.getFrame(streamId);
      if (existingFrame) {
        drawFrameToCanvas(existingFrame);
      }
    }

    // 2. Subscribe to live stream updates
    const unsubscribe = screenShareService.subscribe(streamId, ({ stream, frame, isEnded }) => {
      if (isEnded) {
        setHasStream(false);
        setHasFallbackFrame(false);
        onUpdate(card.id, {
          data: {
            ...card.data,
            isLive: false,
          },
        });
        return;
      }

      if (stream) {
        attachStreamToVideo(stream);
      } else if (frame) {
        drawFrameToCanvas(frame);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [streamId, card.id, card.data, onUpdate]);

  const handleToggleFullscreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleTogglePip = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (e) {
      console.warn("PiP error:", e);
    }
  };

  const handleStopSharing = () => {
    if (isLocalPresenter) {
      screenShareService.stopSharing();
      if (onStopScreenShare) {
        onStopScreenShare();
      }
    }
    onDelete(card.id);
  };

  return (
    <CardWrapper
      card={card}
      viewport={viewport}
      isSelected={isSelected}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      icon={<Monitor className="w-4 h-4 text-emerald-400" />}
      headerColorClass="bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-900 border-b border-emerald-950"
      badgeText={isLocalPresenter ? "Your Shared Screen (LIVE)" : `${presenterName}'s Screen`}
    >
      <div className="flex flex-col h-full bg-neutral-950 text-neutral-100 select-none overflow-hidden relative group">
        {/* Top Floating Control Ribbon */}
        <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-emerald-300 font-bold uppercase tracking-wider text-[10px]">
                LIVE
              </span>
              <span className="text-neutral-400 font-mono text-[10px] pl-1 border-l border-white/20">
                {elapsedTime}
              </span>
            </div>

            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white shadow-md"
              style={{ borderLeftColor: presenterColor, borderLeftWidth: 3 }}
            >
              <span>{presenterName}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1.5 pointer-events-auto opacity-90 group-hover:opacity-100 transition-opacity">
            {hasAudio && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg bg-black/70 hover:bg-neutral-800 text-white backdrop-blur-md border border-white/10 transition-colors shadow-sm"
                title={isMuted ? "Unmute shared audio" : "Mute shared audio"}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            )}

            {isPipSupported && (
              <button
                onClick={handleTogglePip}
                className="p-1.5 rounded-lg bg-black/70 hover:bg-neutral-800 text-white backdrop-blur-md border border-white/10 transition-colors shadow-sm"
                title="Picture-in-Picture window"
              >
                <Radio className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 rounded-lg bg-black/70 hover:bg-neutral-800 text-white backdrop-blur-md border border-white/10 transition-colors shadow-sm"
              title="Fullscreen view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {isLocalPresenter && (
              <button
                onClick={handleStopSharing}
                className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-lg transition-transform active:scale-95"
                title="Stop sharing your screen"
              >
                <StopCircle className="w-3.5 h-3.5" />
                <span>Stop Sharing</span>
              </button>
            )}
          </div>
        </div>

        {/* Video / Screen Stream Container */}
        <div className="flex-1 w-full h-full flex items-center justify-center bg-black relative overflow-hidden">
          {/* Main Video Element for Direct MediaStream (WebRTC or local displayMedia) */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className={`w-full h-full object-contain ${
              hasStream ? "block" : "hidden"
            } transition-opacity duration-300`}
          />

          {/* Fallback Canvas for Frame Streaming */}
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-contain ${
              !hasStream && hasFallbackFrame ? "block" : "hidden"
            }`}
          />

          {/* Placeholder when waiting or ended */}
          {!hasStream && !hasFallbackFrame && (
            <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-400">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-3 text-emerald-400">
                <Monitor className="w-7 h-7 animate-pulse" />
              </div>
              <div className="font-semibold text-sm text-neutral-200 mb-1">
                {isLocalPresenter ? "Connecting Your Screen Stream..." : `Connecting to ${presenterName}'s Screen...`}
              </div>
              <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                Stream negotiation is active. The screen will render automatically.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Status & Classroom Hint */}
        <div className="px-3 py-1.5 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-neutral-300">
              {isLocalPresenter ? "You are presenting" : `Viewing ${presenterName}`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-neutral-500">
            <span>✏️ Annotate directly over or around screen</span>
            <span className="text-neutral-700">|</span>
            <span className="font-mono">{card.width} × {card.height}</span>
          </div>
        </div>
      </div>
    </CardWrapper>
  );
};
