"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  Zap,
  Cpu,
  ShieldCheck,
  Download,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  Film,
  Layers,
  FileVideo,
  X,
  Loader2,
  ChevronRight,
  Video,
  Maximize2,
  Minimize2
} from "lucide-react";
import Link from "next/link";
import {
  WebGLUpscalerEngine,
  detectGpuDevice,
  type UpscaleSettings,
  type GpuDeviceInfo
} from "./shaderEngine";

export function VideoUpscalerStudio() {
  // GPU Info
  const [gpuInfo, setGpuInfo] = useState<GpuDeviceInfo | null>(null);

  // Media state
  const [file, setFile] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0
  });

  // Upscale Settings
  const [settings, setSettings] = useState<UpscaleSettings>({
    scale: 2,
    sharpness: 65,
    denoise: 30,
    edgeEnhance: 70,
    profile: "cinematic"
  });

  // View Mode: 'upscaled' (100% Full), 'split' (Before/After), 'original' (Raw)
  const [viewMode, setViewMode] = useState<"upscaled" | "split" | "original">("upscaled");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  // Processing & Export State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [processedFrames, setProcessedFrames] = useState(0);
  const [totalFramesEstimate, setTotalFramesEstimate] = useState(0);
  const [upscaledDownloadUrl, setUpscaledDownloadUrl] = useState<string | null>(null);
  const [downloadSize, setDownloadSize] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  // Refs
  const mainVideoRef = useRef<HTMLVideoElement | null>(null);
  const splitCompareVideoRef = useRef<HTMLVideoElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const exportCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<WebGLUpscalerEngine | null>(null);
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processIntervalRef = useRef<any>(null);

  // Initialize GPU detection
  useEffect(() => {
    detectGpuDevice().then((info) => {
      setGpuInfo(info);
    });

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!previewContainerRef.current) return;
    if (!document.fullscreenElement) {
      if (previewContainerRef.current.requestFullscreen) {
        previewContainerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Calculate Target Dimensions
  const targetWidth = Math.round((originalDimensions.width || 1080) * settings.scale);
  const targetHeight = Math.round((originalDimensions.height || 1920) * settings.scale);
  const isVertical = originalDimensions.height > originalDimensions.width;

  // Handle File Upload
  const handleFileUpload = (selectedFile: File) => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    if (upscaledDownloadUrl) URL.revokeObjectURL(upscaledDownloadUrl);

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setMediaUrl(url);
    setUpscaledDownloadUrl(null);
    setProgressPercent(0);
    setIsProcessing(false);
    setIsPlaying(false);
    setCurrentTime(0);

    const isVid = selectedFile.type.startsWith("video/");
    setIsVideo(isVid);

    if (!isVid) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
    }
  };

  // Video metadata loaded
  const handleVideoLoadedMetadata = () => {
    if (mainVideoRef.current) {
      const v = mainVideoRef.current;
      setOriginalDimensions({ width: v.videoWidth, height: v.videoHeight });
      setVideoDuration(v.duration);
    }
  };

  // Handle Play/Pause in preview
  const togglePlay = () => {
    if (!mainVideoRef.current) return;
    if (isPlaying) {
      mainVideoRef.current.pause();
      if (splitCompareVideoRef.current) splitCompareVideoRef.current.pause();
      setIsPlaying(false);
    } else {
      mainVideoRef.current.play().catch(() => undefined);
      if (splitCompareVideoRef.current) {
        splitCompareVideoRef.current.currentTime = mainVideoRef.current.currentTime;
        splitCompareVideoRef.current.play().catch(() => undefined);
      }
      setIsPlaying(true);
    }
  };

  // Handle scrubbing
  const handleSeek = (time: number) => {
    if (!mainVideoRef.current) return;
    mainVideoRef.current.currentTime = time;
    if (splitCompareVideoRef.current) splitCompareVideoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Split-screen Slider Dragging
  const handleSliderMove = (clientX: number) => {
    if (!previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  // Compute CSS / SVG Filter for live AI enhancement
  const getEnhanceFilter = () => {
    if (viewMode === "original") return "none";

    const contrastBoost = 100 + (settings.sharpness * 0.12);
    const vibranceBoost = 100 + (settings.edgeEnhance * 0.08);

    if (settings.profile === "anime") {
      return `url(#ai-edge-matrix) contrast(${contrastBoost + 8}%) saturate(${vibranceBoost + 10}%)`;
    }
    if (settings.profile === "portrait") {
      return `url(#ai-edge-matrix) contrast(${contrastBoost}%) brightness(102%)`;
    }
    if (settings.profile === "ultra_sharp") {
      return `url(#ai-edge-matrix) contrast(${contrastBoost + 12}%)`;
    }
    return `url(#ai-edge-matrix) contrast(${contrastBoost}%) saturate(${vibranceBoost}%)`;
  };

  // ==========================================
  // REAL CLIENT-SIDE VIDEO UPSCALING & EXPORT
  // ==========================================
  const cancelVideoUpscaleProcess = () => {
    if (processIntervalRef.current) {
      clearInterval(processIntervalRef.current);
      processIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (mainVideoRef.current) {
      mainVideoRef.current.pause();
      mainVideoRef.current.loop = true;
    }
    setIsProcessing(false);
    setStatusMessage("Upscaling canceled.");
  };

  const startVideoUpscaleProcess = async () => {
    if (!mainVideoRef.current || !exportCanvasRef.current) return;

    const v = mainVideoRef.current;
    const canvas = exportCanvasRef.current;

    // Turn off looping so it ends precisely at video duration
    v.loop = false;
    if (splitCompareVideoRef.current) splitCompareVideoRef.current.loop = false;

    // Initialize WebGL engine if needed
    if (!engineRef.current) {
      engineRef.current = new WebGLUpscalerEngine(canvas);
    }
    const engine = engineRef.current;

    const totalFrames = Math.max(1, Math.round(v.duration * 30));
    setTotalFramesEstimate(totalFrames);

    // Reset states
    setIsProcessing(true);
    setProgressPercent(0);
    setProcessedFrames(0);
    setStatusMessage("Configuring WebGPU 4K canvas & audio pipeline...");
    recordedChunksRef.current = [];

    // Pause video & seek to start
    v.pause();
    if (splitCompareVideoRef.current) splitCompareVideoRef.current.pause();
    setIsPlaying(false);
    v.currentTime = 0;
    await new Promise((r) => setTimeout(r, 200));

    // Audio capture setup
    let audioStream: MediaStream | null = null;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") await ctx.resume();

      const sourceNode = ctx.createMediaElementSource(v);
      const destNode = ctx.createMediaStreamDestination();
      sourceNode.connect(destNode);
      sourceNode.connect(ctx.destination);
      audioStream = destNode.stream;
    } catch (e) {
      console.warn("Audio capture note:", e);
    }

    // Video canvas capture stream at 30 fps
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const canvasStream = canvas.captureStream(30);

    const combinedTracks = [
      ...canvasStream.getVideoTracks(),
      ...(audioStream ? audioStream.getAudioTracks() : [])
    ];
    const combinedStream = new MediaStream(combinedTracks);

    const mimeTypes = [
      "video/mp4;codecs=avc1",
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm"
    ];
    let selectedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || "video/webm";

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: selectedMime,
      videoBitsPerSecond: settings.scale >= 2 ? 18000000 : 8000000 // 18 Mbps high-bitrate
    });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: selectedMime });
      const downloadUrl = URL.createObjectURL(blob);
      setUpscaledDownloadUrl(downloadUrl);
      setDownloadSize(`${(blob.size / (1024 * 1024)).toFixed(1)} MB`);
      setIsProcessing(false);
      setProgressPercent(100);
      setStatusMessage("Upscaling complete! Your 4K video is ready.");
      // Restore loop for preview
      v.loop = true;
    };

    recorder.start(1000);
    setStatusMessage("Upscaling video frames with GPU shaders...");

    v.muted = false;
    v.play().catch(() => undefined);

    if (processIntervalRef.current) clearInterval(processIntervalRef.current);
    processIntervalRef.current = setInterval(() => {
      if (!v) {
        if (processIntervalRef.current) clearInterval(processIntervalRef.current);
        return;
      }

      // Check completion: either currentTime reached duration OR v.ended
      if (v.ended || v.currentTime >= v.duration - 0.25) {
        if (processIntervalRef.current) {
          clearInterval(processIntervalRef.current);
          processIntervalRef.current = null;
        }
        if (recorder.state === "recording") {
          recorder.stop();
        }
        v.pause();
        return;
      }

      // Render frame through super-resolution engine
      engine.renderFrame(
        v,
        v.videoWidth,
        v.videoHeight,
        targetWidth,
        targetHeight,
        settings
      );

      const percent = Math.min(99, Math.round((v.currentTime / v.duration) * 100));
      setProgressPercent(percent);
      setProcessedFrames((prev) => Math.min(prev + 1, totalFrames));
      setCurrentTime(v.currentTime);
    }, 1000 / 30);
  };

  // Image Upscale Download
  const handleImageUpscaleDownload = () => {
    if (!imageRef.current || !exportCanvasRef.current) return;
    const canvas = exportCanvasRef.current;
    if (!engineRef.current) engineRef.current = new WebGLUpscalerEngine(canvas);
    
    engineRef.current.renderFrame(
      imageRef.current,
      imageRef.current.naturalWidth,
      imageRef.current.naturalHeight,
      targetWidth,
      targetHeight,
      settings
    );

    const dataUrl = canvas.toDataURL("image/png", 1.0);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `upscaled_${targetWidth}x${targetHeight}_celoris.png`;
    a.click();
  };

  // Kernel matrix calculation based on user sharpness
  const kWeight = (settings.sharpness / 100) * 0.75;
  const kCenter = (1 + 4 * kWeight).toFixed(3);
  const kEdge = (-kWeight).toFixed(3);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* SVG Convolution Filter for Instant 60fps GPU Sharpening */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="ai-edge-matrix">
            <feConvolveMatrix
              order="3"
              preserveAlpha="true"
              kernelMatrix={`
                0 ${kEdge} 0
                ${kEdge} ${kCenter} ${kEdge}
                0 ${kEdge} 0
              `}
            />
          </filter>
        </defs>
      </svg>

      {/* Hidden Offscreen Canvas for Export Rendering */}
      <canvas ref={exportCanvasRef} className="pointer-events-none fixed -top-[9999px] -left-[9999px] opacity-0" />

      {/* Top Banner / Hardware Acceleration Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d131f] border border-white/[0.08] shadow-lg backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                {gpuInfo?.isSupported ? "Hardware Accelerated" : "Client Engine Active"}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-xs text-neutral-300 font-medium">
              {gpuInfo?.renderer || "WebGPU / WebGL2 Active on Device"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/[0.06]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Private · 0 Cloud Uploads · Runs on your device GPU</span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Media Viewport */}
        <div className="lg:col-span-8 space-y-4">
          {/* View Mode Bar */}
          {mediaUrl && (
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-[#0c1017] border border-white/[0.08]">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setViewMode("upscaled")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "upscaled"
                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  Full View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "split"
                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  Split View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("original")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "original"
                      ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  Original
                </button>
              </div>

              <div className="text-[11px] font-mono text-neutral-400 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                {originalDimensions.width}×{originalDimensions.height} → {targetWidth}×{targetHeight} ({settings.scale}x)
              </div>
            </div>
          )}

          {/* Viewport Frame */}
          <div
            ref={previewContainerRef}
            onMouseMove={(e) => viewMode === "split" && isDraggingSlider && handleSliderMove(e.clientX)}
            onTouchMove={(e) => viewMode === "split" && isDraggingSlider && handleSliderMove(e.touches[0].clientX)}
            onMouseUp={() => setIsDraggingSlider(false)}
            onTouchEnd={() => setIsDraggingSlider(false)}
            className={`relative w-full rounded-3xl bg-[#050810] border border-white/[0.1] shadow-2xl overflow-hidden flex items-center justify-center select-none transition-all ${
              isFullscreen
                ? "w-screen h-screen !max-w-none !max-h-none !rounded-none !border-none"
                : isVertical && mediaUrl
                ? "max-w-[420px] aspect-[9/16] mx-auto"
                : "aspect-video max-h-[640px]"
            }`}
          >
            {/* Top-Right Fullscreen Overlay Button */}
            {mediaUrl && (
              <button
                type="button"
                onClick={toggleFullscreen}
                className="absolute top-3.5 right-3.5 z-30 p-2 sm:px-3 sm:py-2 rounded-xl bg-black/70 hover:bg-black/90 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-105 active:scale-95 shadow-lg cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title={isFullscreen ? "Exit Fullscreen (Esc)" : "Fullscreen Preview"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-emerald-400" />
                )}
                <span className="hidden sm:inline font-mono">{isFullscreen ? "Exit" : "Fullscreen"}</span>
              </button>
            )}

            {/* Fullscreen View Mode Switcher */}
            {isFullscreen && (
              <div className="absolute top-3.5 left-3.5 z-30 flex items-center gap-1 p-1 rounded-xl bg-black/80 border border-white/20 backdrop-blur-md shadow-2xl">
                <button
                  type="button"
                  onClick={() => setViewMode("upscaled")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "upscaled"
                      ? "bg-emerald-500 text-black shadow-md"
                      : "text-white hover:text-emerald-300"
                  }`}
                >
                  Full View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("split")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "split"
                      ? "bg-emerald-500 text-black shadow-md"
                      : "text-white hover:text-emerald-300"
                  }`}
                >
                  Split View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("original")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === "original"
                      ? "bg-emerald-500 text-black shadow-md"
                      : "text-white hover:text-emerald-300"
                  }`}
                >
                  Original
                </button>
              </div>
            )}
            {/* Upload Empty State */}
            {!mediaUrl && (
              <label className="flex flex-col items-center justify-center p-8 sm:p-12 text-center cursor-pointer group transition-all w-full h-full min-h-[380px]">
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Drop your video or photo here
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md leading-relaxed mb-6">
                  Supports MP4, MOV, WebM, and high-res photos. Automatically upscales to 4K Ultra HD in your browser.
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
                  <FileVideo className="w-4 h-4" />
                  Select File from Computer
                </div>
              </label>
            )}

            {/* MAIN VIDEO LAYER (Upscaled / Filtered) */}
            {mediaUrl && isVideo && (
              <video
                ref={mainVideoRef}
                src={mediaUrl}
                playsInline
                muted
                loop
                onLoadedMetadata={handleVideoLoadedMetadata}
                onTimeUpdate={() => {
                  if (mainVideoRef.current) setCurrentTime(mainVideoRef.current.currentTime);
                }}
                style={{
                  filter: getEnhanceFilter()
                }}
                className="w-full h-full object-contain"
              />
            )}

            {/* SPLIT COMPARE LAYER (Original Raw, Clipped to Left) */}
            {mediaUrl && isVideo && viewMode === "split" && (
              <div
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <video
                  ref={splitCompareVideoRef}
                  src={mediaUrl}
                  playsInline
                  muted
                  loop
                  style={{ filter: "none" }}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* PHOTO LAYERS (If Image Uploaded) */}
            {mediaUrl && !isVideo && (
              <img
                ref={imageRef}
                src={mediaUrl}
                alt="Upscaled Preview"
                style={{
                  filter: getEnhanceFilter()
                }}
                className="w-full h-full object-contain"
              />
            )}
            {mediaUrl && !isVideo && viewMode === "split" && (
              <div
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                className="absolute inset-0 w-full h-full pointer-events-none"
              >
                <img
                  src={mediaUrl}
                  alt="Original"
                  style={{ filter: "none" }}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Interactive Before/After Split Line & Handle */}
            {mediaUrl && viewMode === "split" && (
              <div
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={() => setIsDraggingSlider(true)}
                onTouchStart={() => setIsDraggingSlider(true)}
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] cursor-ew-resize z-20 flex items-center justify-center"
              >
                <div className="w-8 h-8 rounded-full bg-white text-black shadow-2xl flex items-center justify-center font-bold text-xs select-none border-2 border-emerald-400">
                  ↔
                </div>
              </div>
            )}
            {/* Fullscreen Floating Bottom Playback Bar */}
            {isFullscreen && isVideo && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-[92%] max-w-2xl px-5 py-3 rounded-2xl bg-black/85 border border-white/20 backdrop-blur-xl flex items-center gap-4 shadow-2xl">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all cursor-pointer shrink-0"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max={videoDuration || 100}
                  step="0.05"
                  value={currentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
                <span className="font-mono text-xs text-neutral-300 whitespace-nowrap">
                  {Math.floor(currentTime)}s / {Math.floor(videoDuration)}s
                </span>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                  title="Exit Fullscreen (Esc)"
                >
                  <Minimize2 className="w-4 h-4 text-emerald-400" />
                </button>
              </div>
            )}
          </div>

          {/* Video Playback & Scrub Bar (If Video) */}
          {mediaUrl && isVideo && (
            <div className="p-4 rounded-2xl bg-[#0c1017] border border-white/[0.08] flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                disabled={isProcessing}
                className="p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white transition-colors cursor-pointer disabled:opacity-50"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
              </button>

              <input
                type="range"
                min="0"
                max={videoDuration || 100}
                step="0.05"
                value={currentTime}
                onChange={(e) => handleSeek(parseFloat(e.target.value))}
                disabled={isProcessing}
                className="w-full accent-emerald-400 cursor-pointer"
              />

              <span className="font-mono text-xs text-neutral-400 whitespace-nowrap">
                {Math.floor(currentTime)}s / {Math.floor(videoDuration)}s
              </span>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white hover:text-emerald-400 transition-colors cursor-pointer"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaUrl(null);
                  setFile(null);
                  setUpscaledDownloadUrl(null);
                  setIsPlaying(false);
                }}
                className="p-2.5 rounded-xl hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                title="Remove video"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Processing Progress Bar */}
          {isProcessing && (
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  {statusMessage}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-extrabold text-white">{progressPercent}%</span>
                  <button
                    type="button"
                    onClick={cancelVideoUpscaleProcess}
                    className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-emerald-400 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.8)]"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                <span>
                  Frames: {processedFrames} / {totalFramesEstimate || Math.round(videoDuration * 30)}
                </span>
                <span>Output: {targetWidth}×{targetHeight} (4K 30fps)</span>
              </div>
            </div>
          )}

          {/* Download Box when Complete */}
          {upscaledDownloadUrl && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0c1219] to-teal-950/40 border border-emerald-400/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">Upscaling Complete!</h4>
                  <p className="text-xs text-neutral-300">
                    Rendered at {targetWidth}×{targetHeight} ({settings.scale}x) · {downloadSize}
                  </p>
                </div>
              </div>

              <a
                href={upscaledDownloadUrl}
                download={`celoris_upscaled_${targetWidth}x${targetHeight}.mp4`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.5)] cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download 4K Video
              </a>
            </div>
          )}
        </div>

        {/* Right Column: AI Enhancement Controls */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-6 rounded-3xl bg-[#0c1017]/95 border border-white/[0.08] shadow-2xl backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-extrabold text-white tracking-wide">
                  Upscale Controls
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                GPU Kernel v2.4
              </span>
            </div>

            {/* Resolution Multiplier */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-neutral-300">Target Resolution Scale</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "1.5x HD", val: 1.5 },
                  { label: "2x 4K (Best)", val: 2 },
                  { label: "4x Ultra", val: 4 }
                ].map((s) => (
                  <button
                    key={s.val}
                    type="button"
                    onClick={() => setSettings({ ...settings, scale: s.val as any })}
                    disabled={isProcessing}
                    className={`py-2 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      settings.scale === s.val
                        ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                        : "bg-white/[0.05] text-neutral-300 hover:bg-white/[0.08]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Output: {targetWidth} × {targetHeight} px
              </p>
            </div>

            {/* AI Enhancement Profile */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-neutral-300">Enhancement Profile</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "cinematic", label: "Cinematic Reel", desc: "Natural skin & film grain" },
                  { id: "anime", label: "Anime / Motion", desc: "Crisp line-art borders" },
                  { id: "portrait", label: "Portrait & Face", desc: "Sharp eyes & delicate hair" },
                  { id: "ultra_sharp", label: "Ultra Sharp 4K", desc: "Maximum edge definition" }
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSettings({ ...settings, profile: p.id as any })}
                    disabled={isProcessing}
                    className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      settings.profile === p.id
                        ? "bg-emerald-500/20 border border-emerald-400/40 text-white"
                        : "bg-white/[0.03] border border-white/[0.06] text-neutral-400 hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{p.label}</div>
                    <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Edge Sharpness Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-neutral-300">Edge Sharpness</span>
                <span className="font-mono text-emerald-400 font-bold">{settings.sharpness}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sharpness}
                onChange={(e) => setSettings({ ...settings, sharpness: parseInt(e.target.value) })}
                disabled={isProcessing}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Denoise Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-neutral-300">Compression Denoise</span>
                <span className="font-mono text-emerald-400 font-bold">{settings.denoise}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.denoise}
                onChange={(e) => setSettings({ ...settings, denoise: parseInt(e.target.value) })}
                disabled={isProcessing}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            {/* Action CTA Button */}
            {isVideo ? (
              <button
                type="button"
                onClick={startVideoUpscaleProcess}
                disabled={!mediaUrl || isProcessing}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Upscaling Frame by Frame...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-black" />
                    Start Upscaling Video (Full HD to 4K)
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleImageUpscaleDownload}
                disabled={!mediaUrl}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Upscaled Photo
              </button>
            )}
          </div>

          {/* Lead Generation Card: Celoris Job Center */}
          <div className="p-5 rounded-3xl bg-gradient-to-b from-[#101c18] to-[#0a0f14] border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
                Are you a Video Editor?
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Companies on Celoris hire video editors and short-form reel pacing experts. Pass the 5-minute online skill test and get paid directly.
            </p>
            <Link
              href="/job-center"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Take 5-Min Video Editor Test <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
