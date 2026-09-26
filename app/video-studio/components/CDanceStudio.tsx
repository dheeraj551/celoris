"use client";

// Video Studio → Seedance (ByteDance Seedance 2.5 / 2.0 on the Higgsfield API).
//
// Flow: reference videos / audio upload as soon as they're picked (straight
// from the browser to storage); images upload when Generate is pressed; then
// POST /api/ai/jobs { app: 'seedance', ... } starts the render and we poll
// GET /api/ai/jobs/{id} until the video is ready. The server checks the plan,
// the price and the wallet — see lib/seedance-server.ts.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Coins,
  Download,
  Image as ImageIcon,
  Layers,
  Loader2,
  Lock,
  Maximize2,
  Music,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Video as VideoIcon,
  Volume2,
  VolumeX,
  Wand2,
  X,
} from "lucide-react";
import {
  AiJob,
  AiJobsError,
  isPendingJob,
  listAiJobsWithBalance,
  readVideoDuration,
  startAiJob,
  uploadReferenceImage,
  uploadReferenceVideo,
  waitForAiJob,
} from "@/lib/ai-jobs-client";
import {
  SEEDANCE_ASPECT_RATIOS,
  SEEDANCE_AUDIO_TYPES,
  SEEDANCE_CREDITS_PER_SECOND,
  SEEDANCE_MODELS,
  SEEDANCE_MODE_LABEL,
  SOURCE_VIDEO_MODES,
  type SeedanceAspect,
  type SeedanceMode,
  type SeedanceModel,
  type SeedanceResolution,
  seedancePrice,
} from "@/lib/seedance-shared";

export type CDanceMode = SeedanceMode;

export interface CDanceStudioProps {
  onInsertToTimeline?: (videoUrl: string, title: string) => void;
  onBackToEditor?: () => void;
}

interface SeedancePlan {
  tier: string;
  label: string;
  models: Record<SeedanceModel, { allowed: boolean; upgradeTo: string }>;
  maxParallelVideos: number;
}

interface ReferenceItem {
  id: string;
  type: "image" | "video" | "audio";
  name: string;
  previewUrl: string;
  size: string;
  file: File;
  status: "uploading" | "ready" | "error";
  progress: number;
  error?: string;
  /** video/audio: where the server can fetch it */
  key?: string;
  url?: string;
  token?: string;
  /** video length (s) */
  seconds?: number;
}

interface SourceVideo {
  jobId: string;
  videoUrl: string;
  seconds: number | null;
  title: string;
}

const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
const EXAMPLE_VIDEO = "/vid/marketing-studio-slider-poster-Ads.mp4";

const CAMERA_MOVES = ["", "Slow push-in", "Dynamic orbit", "Drone FPV dive", "Pan left to right", "Handheld follow", "Static tripod"];

const MODE_INFO: Record<SeedanceMode, { desc: string; sample: string; refsHint: string }> = {
  "text-to-video": {
    desc: "Creates a cinematic clip from your words alone — describe the scene, the action, the camera and the mood.",
    sample:
      "Cinematic wide drone shot of a Himalayan monastery at sunrise, prayer flags fluttering, monks walking up stone steps, warm golden light and soft mist.",
    refsHint: "Text to Video uses only the prompt.",
  },
  "image-to-video": {
    desc: "Brings a still image to life while keeping the person, product or artwork exactly as it is.",
    sample: "The woman turns towards the camera and smiles as her dupatta flows in a gentle breeze; slow push-in, soft evening light.",
    refsHint: "Add 1 image (the first frame). Optional 2nd image = the last frame.",
  },
  "reference-to-video": {
    desc: "Generates a new clip guided by your images, videos and audio — characters, style, motion and sound.",
    sample:
      "A street food vendor in Old Delhi flips parathas on a hot tawa, steam rising; the camera circles around him as customers laugh in the background.",
    refsHint: "Add images, videos and/or audio as references.",
  },
  "video-edit": {
    desc: "Restyles or changes your video (lighting, setting, objects, look) while keeping its timing and camera movement.",
    sample: "Turn the daytime street into a rainy neon night scene with reflections on wet roads and glowing shop signs.",
    refsHint: "Add the video to edit (first video). Extra images/videos/audio are optional references.",
  },
  "video-extend": {
    desc: "Continues your video forward, keeping the characters, motion and sound consistent.",
    sample: "The camera keeps following the rider as the bike turns onto a coastal road at sunset, waves crashing below.",
    refsHint: "Add the video to extend (first video), or extend one of your results.",
  },
};

function fmtSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function fmtClock(s: number) {
  const t = Math.max(0, Math.floor(s || 0));
  return `${("0" + Math.floor(t / 60)).slice(-2)}:${("0" + (t % 60)).slice(-2)}`;
}

export function CDanceStudio({ onInsertToTimeline, onBackToEditor }: CDanceStudioProps) {
  const [model, setModel] = useState<SeedanceModel>("seedance-2.5");
  const [mode, setMode] = useState<SeedanceMode>("reference-to-video");
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [prompt, setPrompt] = useState(MODE_INFO["reference-to-video"].sample);
  const [camera, setCamera] = useState("");

  const [references, setReferences] = useState<ReferenceItem[]>([]);
  const [sourceVideo, setSourceVideo] = useState<SourceVideo | null>(null);

  const [generateAudio, setGenerateAudio] = useState(true);
  const [duration, setDuration] = useState(5);
  const [resolution, setResolution] = useState<SeedanceResolution>("720p");
  const [aspectRatio, setAspectRatio] = useState<SeedanceAspect>("16:9");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const [plan, setPlan] = useState<SeedancePlan | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [history, setHistory] = useState<AiJob[]>([]);
  const [activeJob, setActiveJob] = useState<AiJob | null>(null);
  const [signedOut, setSignedOut] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState("");
  const [error, setError] = useState<{ text: string; link?: "plans" | "credits" } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pollAbort = useRef<AbortController | null>(null);

  const spec = SEEDANCE_MODELS[model];
  const modelAllowed = plan ? plan.models[model].allowed : true;
  const usesSource = SOURCE_VIDEO_MODES.indexOf(mode) !== -1;
  const takesRefs = mode !== "text-to-video";
  const showAspect = mode === "text-to-video" || mode === "reference-to-video";
  const showDuration = mode !== "video-edit";

  // ---------------------------------------------------------------- history

  const upsertHistory = useCallback((job: AiJob) => {
    setHistory((prev) => [job, ...prev.filter((j) => j.id !== job.id)].slice(0, 24));
  }, []);

  const followJob = useCallback(
    async (job: AiJob) => {
      pollAbort.current?.abort();
      const ctrl = new AbortController();
      pollAbort.current = ctrl;
      setIsGenerating(true);
      const started = new Date(job.createdAt).getTime();
      const describe = (j: AiJob) => {
        const mins = Math.max(0, Math.floor((Date.now() - started) / 60000));
        const t = mins > 0 ? ` · ${mins} min` : "";
        return j.status === "queued" ? `Waiting in Higgsfield's queue${t}` : `Rendering with ${SEEDANCE_MODELS[(j.model as SeedanceModel) || "seedance-2.5"]?.label || "Seedance"}${t}`;
      };
      setGenerationStage(describe(job));
      setGenerationProgress((p) => Math.max(p, 15));
      try {
        const { job: done, balance: b } = await waitForAiJob(job.id, {
          signal: ctrl.signal,
          intervalMs: 5000,
          timeoutMs: 45 * 60 * 1000,
          onUpdate: (j) => {
            upsertHistory(j);
            setGenerationStage(describe(j));
            setGenerationProgress((p) => Math.min(95, Math.max(p, j.status === "in_progress" ? 30 : 15) + 2));
          },
        });
        upsertHistory(done);
        if (typeof b === "number") setBalance(b);
        if (done.status === "completed" && done.videoUrl) {
          setGenerationProgress(100);
          setActiveJob(done);
          window.setTimeout(() => {
            videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
          }, 300);
        } else {
          setError({ text: `${done.error || "The render failed."}${done.creditsCharged > 0 ? " Your credits were refunded." : ""}` });
          listAiJobsWithBalance("seedance")
            .then(({ balance: nb }) => nb !== null && setBalance(nb))
            .catch(() => {});
        }
      } catch (err: any) {
        if (ctrl.signal.aborted) return;
        setError({ text: err?.message || "Lost track of the render. It will appear in your history when it finishes." });
      } finally {
        if (pollAbort.current === ctrl) {
          setIsGenerating(false);
          setGenerationProgress(0);
          setGenerationStage("");
        }
      }
    },
    [upsertHistory]
  );

  useEffect(() => {
    let cancelled = false;
    listAiJobsWithBalance("seedance")
      .then(({ jobs, balance: b, plan: p }) => {
        if (cancelled) return;
        setHistory(jobs);
        setBalance(b);
        const sp = p as unknown as SeedancePlan | null;
        setPlan(sp);
        if (sp && !sp.models["seedance-2.5"].allowed && sp.models["seedance-2.0"].allowed) setModel("seedance-2.0");
        const done = jobs.find((j) => j.status === "completed" && j.videoUrl);
        if (done) setActiveJob(done);
        const pending = jobs.find(isPendingJob);
        if (pending) followJob(pending);
      })
      .catch((err) => {
        if (err instanceof AiJobsError && err.status === 401) setSignedOut(true);
      });
    return () => {
      cancelled = true;
      pollAbort.current?.abort();
    };
  }, [followJob]);

  // ---------------------------------------------------------------- model & mode

  const handleSelectMode = (next: SeedanceMode) => {
    setMode(next);
    setIsModeDropdownOpen(false);
    setPrompt(MODE_INFO[next].sample);
    setError(null);
    if (SOURCE_VIDEO_MODES.indexOf(next) === -1) setSourceVideo(null);
  };

  const handleSelectModel = (next: SeedanceModel) => {
    setModel(next);
    setError(null);
    const s = SEEDANCE_MODELS[next];
    if (s.modes.indexOf(mode) === -1) handleSelectMode("reference-to-video");
    setDuration((d) => Math.min(s.maxSeconds, Math.max(s.minSeconds, d)));
  };

  // ---------------------------------------------------------------- references

  const counts = useMemo(
    () => ({
      image: references.filter((r) => r.type === "image").length,
      video: references.filter((r) => r.type === "video").length,
      audio: references.filter((r) => r.type === "audio").length,
    }),
    [references]
  );

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    const list = Array.from(files);
    for (const file of list) {
      const isVideo = /^video\/(mp4|quicktime)$/.test(file.type);
      const isAudio = !!SEEDANCE_AUDIO_TYPES[file.type];
      const isImage = /^image\/(png|jpeg|webp)$/.test(file.type);
      if (!isVideo && !isAudio && !isImage) {
        setError({ text: `${file.name}: use JPG/PNG/WebP images, MP4/MOV videos or MP3/WAV/M4A audio.` });
        continue;
      }
      if (mode === "image-to-video" && !isImage) {
        setError({ text: "Image to Video takes images only (start frame and optional end frame)." });
        continue;
      }
      if (isVideo && file.size > MAX_VIDEO_BYTES) {
        setError({ text: `${file.name} is too large. Please keep videos under 200 MB.` });
        continue;
      }
      if (isAudio && file.size > MAX_AUDIO_BYTES) {
        setError({ text: `${file.name} is too large. Please keep audio under 50 MB.` });
        continue;
      }
      const item: ReferenceItem = {
        id: `ref-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: isVideo ? "video" : isAudio ? "audio" : "image",
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        size: fmtSize(file.size),
        file,
        status: isImage ? "ready" : "uploading",
        progress: 0,
      };
      if (isVideo) {
        try {
          item.seconds = await readVideoDuration(file);
        } catch {
          // the server measures it again when it matters
        }
      }
      setReferences((prev) => [...prev, item]);
      if (!isImage) {
        uploadReferenceVideo(
          file,
          (f) => setReferences((prev) => prev.map((r) => (r.id === item.id ? { ...r, progress: f } : r))),
          "seedance"
        )
          .then((up) =>
            setReferences((prev) =>
              prev.map((r) =>
                r.id === item.id ? { ...r, status: "ready", progress: 1, key: up.videoKey, url: up.videoUrl, token: up.videoToken } : r
              )
            )
          )
          .catch((err: any) => {
            setReferences((prev) => prev.map((r) => (r.id === item.id ? { ...r, status: "error", error: err?.message || "Upload failed." } : r)));
            if (err instanceof AiJobsError && err.status === 403) setError({ text: err.message, link: "plans" });
          });
      }
    }
  };

  const handleRemoveRef = (id: string) => {
    setReferences((prev) => {
      const r = prev.find((x) => x.id === id);
      if (r) URL.revokeObjectURL(r.previewUrl);
      return prev.filter((x) => x.id !== id);
    });
  };

  // ---------------------------------------------------------------- price

  const firstVideo = references.find((r) => r.type === "video");
  const sourceSeconds = usesSource ? (sourceVideo ? sourceVideo.seconds : firstVideo?.seconds ?? null) : null;
  const hasVideoInput = counts.video > 0 || !!sourceVideo;
  const price = seedancePrice({ model, mode, resolution, duration, sourceSeconds, hasVideoInput });

  // ---------------------------------------------------------------- generate

  const validate = (): string | null => {
    if (!modelAllowed) return `${spec.label} is included with the ${plan?.models[model].upgradeTo} plan and above.`;
    if (!prompt.trim() && (mode === "text-to-video" || usesSource)) return "Describe what you want in the prompt.";
    if (references.some((r) => r.status === "uploading")) return "Your files are still uploading — one moment.";
    if (references.some((r) => r.status === "error")) return "One of the uploads failed. Remove it and add it again.";
    if (mode === "image-to-video" && counts.image === 0) return "Add the image to animate.";
    if (mode === "image-to-video" && counts.image > 2) return "Image to Video takes a start image and an optional end image (2 max).";
    if (mode === "reference-to-video" && references.length === 0) return "Add at least one image, video or audio reference.";
    if (usesSource && !sourceVideo && counts.video === 0) return mode === "video-edit" ? "Add the video to edit." : "Add the video to extend.";
    if (counts.image > spec.maxImages) return `${spec.label} takes up to ${spec.maxImages} images.`;
    if (counts.audio > spec.maxAudios) return `${spec.label} takes up to ${spec.maxAudios} audio clips.`;
    if (counts.video > spec.maxVideos) return `${spec.label} takes up to ${spec.maxVideos} videos.`;
    if (!spec.imagesAndVideosTogether && counts.image && counts.video) return `${spec.label} takes image references or video references, not both.`;
    if (mode === "video-edit" && sourceSeconds && sourceSeconds > 30.5) return "The video to edit must be 30 seconds or shorter.";
    if (balance !== null && balance < price) return `This video costs ${price.toLocaleString("en-IN")} credits. Your balance is ${balance.toLocaleString("en-IN")}.`;
    return null;
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setError(null);
    const problem = validate();
    if (problem) {
      setError({
        text: problem,
        link: !modelAllowed ? "plans" : balance !== null && balance < price && problem.includes("costs") ? "credits" : undefined,
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(3);
    try {
      const images = references.filter((r) => r.type === "image");
      const imageUrls: string[] = new Array(images.length);
      if (images.length) {
        setGenerationStage(`Uploading ${images.length} image${images.length > 1 ? "s" : ""}…`);
        let done = 0;
        const queue = images.map((img, i) => ({ img, i }));
        const worker = async () => {
          while (queue.length) {
            const next = queue.shift()!;
            imageUrls[next.i] = await uploadReferenceImage(next.img.file, next.img.id);
            done++;
            setGenerationProgress(3 + Math.round((done / images.length) * 9));
          }
        };
        await Promise.all([worker(), worker(), worker(), worker()]);
      }

      setGenerationStage(`Sending to ${spec.label}…`);
      const finalPrompt = [prompt.trim(), camera ? `Camera: ${camera.toLowerCase()}.` : ""].filter(Boolean).join(" ");
      const res = await startAiJob({
        app: "seedance",
        model,
        mode,
        prompt: finalPrompt,
        displayPrompt: prompt.trim() || SEEDANCE_MODE_LABEL[mode],
        imageUrls,
        videos: references.filter((r) => r.type === "video").map((r) => ({ key: r.key, url: r.url, token: r.token })),
        audios: references.filter((r) => r.type === "audio").map((r) => ({ key: r.key, url: r.url, token: r.token })),
        sourceJobId: usesSource && sourceVideo ? sourceVideo.jobId : undefined,
        duration,
        resolution,
        aspectRatio,
        generateAudio,
      });
      if (typeof res.balance === "number") setBalance(res.balance);
      upsertHistory(res.job);
      await followJob(res.job);
    } catch (err: any) {
      const code = err instanceof AiJobsError ? err.data?.code : undefined;
      if (err instanceof AiJobsError && err.data?.plan) setPlan(err.data.plan);
      setError({ text: err?.message || "Could not start the render.", link: code === "needs_plan" ? "plans" : code === "needs_credits" ? "credits" : undefined });
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStage("");
    }
  };

  // ---------------------------------------------------------------- result actions

  const useResultAsSource = (next: "video-edit" | "video-extend") => {
    if (!activeJob?.videoUrl) return;
    if (plan && !plan.models["seedance-2.5"].allowed) {
      setError({ text: `Edit and Extend use Seedance 2.5, included with the ${plan.models["seedance-2.5"].upgradeTo} plan and above.`, link: "plans" });
      return;
    }
    setModel("seedance-2.5");
    setMode(next);
    setPrompt(MODE_INFO[next].sample);
    setSourceVideo({
      jobId: activeJob.id,
      videoUrl: activeJob.videoUrl,
      seconds: typeof activeJob.durationSeconds === "number" ? activeJob.durationSeconds : null,
      title: activeJob.prompt || "Your video",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------------------------------------------------------- player

  const resultUrl = activeJob?.videoUrl || EXAMPLE_VIDEO;
  const isExample = !activeJob?.videoUrl;

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      v.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    if (v.duration && Number.isFinite(v.duration)) setVideoDuration(v.duration);
  };

  // ---------------------------------------------------------------- render

  const availableModes = spec.modes;
  const refLimitsText =
    mode === "image-to-video"
      ? "Start image + optional end image"
      : `Up to ${spec.maxImages} images · ${spec.maxVideos} videos · ${spec.maxAudios} audio${spec.imagesAndVideosTogether ? "" : " (images or videos, not both)"}`;

  return (
    <div className="flex-1 flex flex-col bg-[#0b0c10] text-[#e1e4ea] min-h-0 overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.08] bg-[#0d0e13]">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-pink-950/70 border border-pink-500/40 text-pink-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <VideoIcon className="w-3 h-3 fill-pink-400" />
                Video Studio AI
              </span>
              {(["seedance-2.5", "seedance-2.0"] as SeedanceModel[]).map((m) => {
                const locked = plan ? !plan.models[m].allowed : false;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSelectModel(m)}
                    title={locked ? `Included with the ${plan?.models[m].upgradeTo} plan and above` : SEEDANCE_MODELS[m].label}
                    className={`font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 transition-colors ${
                      model === m ? "bg-[#ccff00] text-black border-[#ccff00]" : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {locked && <Lock className="w-3 h-3" />}
                    {SEEDANCE_MODELS[m].label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-0.5 h-6 text-white px-1">
                  <span className="w-1 h-3.5 bg-white rounded-full animate-pulse"></span>
                  <span className="w-1 h-5 bg-white rounded-full"></span>
                  <span className="w-1 h-2.5 bg-white rounded-full animate-pulse"></span>
                  <span className="w-1 h-4 bg-white rounded-full"></span>
                </div>
                <h1 className="text-2xl font-black text-white tracking-wider font-mono uppercase">{spec.label}</h1>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                  className="bg-[#191c24] hover:bg-[#202530] text-white border border-white/10 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all focus:outline-none"
                >
                  <span>{SEEDANCE_MODE_LABEL[mode]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isModeDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {isModeDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 bg-[#171a22] border border-white/15 rounded-xl shadow-2xl p-1.5 z-50 backdrop-blur-md">
                    <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1.5 tracking-wider">{spec.label} modes</div>
                    {availableModes.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleSelectMode(m)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                          mode === m ? "bg-white/10 text-white font-bold" : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{SEEDANCE_MODE_LABEL[m]}</span>
                        {mode === m && <Check className="w-3.5 h-3.5 text-[#ccff00]" />}
                      </button>
                    ))}
                    {model === "seedance-2.0" && (
                      <p className="px-3 py-1.5 text-[10px] text-slate-500">Video Edit and Video Extend need Seedance 2.5.</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{MODE_INFO[mode].desc}</p>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            {balance !== null && (
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                <Coins className="w-3.5 h-3.5 text-yellow-300" /> {balance.toLocaleString("en-IN")} credits
              </span>
            )}
            {onBackToEditor && (
              <button
                type="button"
                onClick={onBackToEditor}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all"
              >
                <span>Back to Timeline Editor</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {signedOut && (
        <div className="mx-6 mt-4 rounded-xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Please <Link href="/login" className="font-bold underline">sign in</Link> to generate videos.
        </div>
      )}
      {plan && !modelAllowed && (
        <div className="mx-6 mt-4 rounded-xl border border-[#ccff00]/30 bg-[#ccff00]/5 px-4 py-3 text-sm text-slate-200 flex flex-wrap items-center gap-3">
          <Lock className="w-4 h-4 text-[#ccff00]" />
          <span>
            {spec.label} is included with the <b>{plan.models[model].upgradeTo}</b> plan and above. You&apos;re on {plan.label}.
          </span>
          <Link href="/pricing" className="ml-auto text-xs font-bold text-[#ccff00] hover:underline">
            See plans →
          </Link>
        </div>
      )}

      {/* Workspace */}
      <div className="flex-1 p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* INPUT */}
            <div className="lg:col-span-5 bg-[#14161f] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">Input</h3>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{SEEDANCE_MODE_LABEL[mode]}</span>
              </div>

              {/* Prompt */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-slate-300">
                    Prompt{mode === "image-to-video" || mode === "reference-to-video" ? <span className="text-slate-500 font-normal"> (optional)</span> : null}
                  </label>
                  <button type="button" onClick={() => setPrompt(MODE_INFO[mode].sample)} className="text-[11px] text-[#ccff00] hover:underline flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Sample prompt
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={prompt}
                  maxLength={4000}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the scene, action, camera and mood…"
                  className="w-full bg-[#0c0d12] border border-white/10 hover:border-white/20 focus:border-[#ccff00] rounded-xl p-3 text-xs text-white leading-relaxed resize-none focus:outline-none transition-colors"
                />
              </div>

              {/* Source video (edit / extend a previous result) */}
              {usesSource && sourceVideo && (
                <div className="flex items-center gap-3 rounded-xl border border-[#ccff00]/30 bg-[#ccff00]/5 p-2.5">
                  <video src={sourceVideo.videoUrl} muted playsInline className="h-12 w-20 rounded-lg object-cover bg-black" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-[#ccff00]">
                      {mode === "video-edit" ? "Editing" : "Extending"} your result
                    </p>
                    <p className="text-xs text-slate-300 truncate">{sourceVideo.title}</p>
                  </div>
                  <button type="button" onClick={() => setSourceVideo(null)} className="p-1 text-slate-400 hover:text-white" title="Use an uploaded video instead">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* References */}
              {takesRefs ? (
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    onChange={(e) => {
                      handleFiles(e.target.files);
                      e.target.value = "";
                    }}
                    accept={
                      mode === "image-to-video"
                        ? "image/png,image/jpeg,image/webp"
                        : "image/png,image/jpeg,image/webp,video/mp4,video/quicktime,audio/mpeg,audio/wav,audio/x-wav,audio/mp4,audio/x-m4a,audio/aac"
                    }
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleFiles(e.dataTransfer.files);
                    }}
                    className="border border-dashed border-white/15 hover:border-white/30 bg-[#0c0d12]/70 rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3 mb-2.5">
                      {mode !== "image-to-video" && (
                        <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300">
                          <Music className="w-4 h-4" />
                        </div>
                      )}
                      <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      {mode !== "image-to-video" && (
                        <div className="w-9 h-9 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10 flex items-center justify-center text-slate-300">
                          <VideoIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-white group-hover:text-[#ccff00] transition-colors">
                      {usesSource && !sourceVideo ? "Add your video (and optional references)" : "Add elements or references"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{MODE_INFO[mode].refsHint}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{refLimitsText}</p>
                  </div>

                  {references.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {references.map((ref, i) => {
                        const isSource = usesSource && !sourceVideo && ref.type === "video" && references.filter((r) => r.type === "video")[0]?.id === ref.id;
                        const imgIndex = references.filter((r) => r.type === "image").findIndex((r) => r.id === ref.id);
                        const tag = isSource
                          ? mode === "video-edit"
                            ? "To edit"
                            : "To extend"
                          : mode === "image-to-video" && ref.type === "image"
                            ? imgIndex === 0
                              ? "Start"
                              : "End"
                            : null;
                        return (
                          <div key={ref.id} className="relative flex items-center gap-2 bg-[#0c0d12] border border-white/10 rounded-lg pl-1.5 pr-2 py-1.5 text-xs">
                            {ref.type === "image" ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={ref.previewUrl} alt="" className="w-8 h-8 rounded object-cover" />
                            ) : ref.type === "video" ? (
                              <video src={ref.previewUrl} muted className="w-8 h-8 rounded object-cover bg-black" />
                            ) : (
                              <div className="w-8 h-8 rounded bg-emerald-500/10 flex items-center justify-center">
                                <Music className="w-4 h-4 text-emerald-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-[11px] text-slate-300 font-mono truncate max-w-[120px]">{ref.name}</p>
                              <p className="text-[10px] text-slate-500 font-mono">
                                {ref.status === "uploading"
                                  ? `Uploading ${Math.round(ref.progress * 100)}%`
                                  : ref.status === "error"
                                    ? <span className="text-rose-400">{ref.error || "Failed"}</span>
                                    : `${ref.size}${ref.seconds ? ` · ${ref.seconds.toFixed(1)} s` : ""}`}
                              </p>
                            </div>
                            {tag && (
                              <span className="text-[9px] font-bold uppercase bg-[#ccff00]/15 text-[#ccff00] rounded px-1.5 py-0.5">{tag}</span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveRef(ref.id);
                              }}
                              className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition-colors"
                              aria-label={`Remove ${ref.name}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">{MODE_INFO[mode].refsHint}</p>
              )}

              {/* Audio */}
              <div className="flex items-center justify-between py-1">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-white">Generate audio</span>
                  <p className="text-[10px] text-slate-500">Synchronised sound effects, ambience, music and speech</p>
                </div>
                <button
                  type="button"
                  onClick={() => setGenerateAudio(!generateAudio)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 focus:outline-none ${generateAudio ? "bg-[#ccff00]" : "bg-slate-700"}`}
                  aria-pressed={generateAudio}
                >
                  <div className={`w-5 h-5 rounded-full bg-black shadow-md transition-transform ${generateAudio ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Length */}
              {showDuration ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {mode === "video-extend" ? "Add" : "Length"}
                    </span>
                    <span className="font-mono text-white">{duration} s</span>
                  </div>
                  <input
                    type="range"
                    min={spec.minSeconds}
                    max={spec.maxSeconds}
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                    className="w-full accent-[#ccff00] h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>{spec.minSeconds} s</span>
                    <span>{spec.maxSeconds} s</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Keeps the length of your video{sourceSeconds ? ` (${sourceSeconds.toFixed(1)} s)` : ""}.
                </p>
              )}

              {/* Resolution + aspect */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="flex items-center gap-1 bg-[#0c0d12] border border-white/10 rounded-xl p-1 text-xs">
                  <Sliders className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                  {(["480p", "720p"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setResolution(r)}
                      className={`px-2 py-1 rounded-lg font-mono font-semibold transition-all ${resolution === r ? "bg-white text-black" : "text-slate-400 hover:text-white"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {showAspect && (
                  <div className="flex flex-wrap items-center gap-1 bg-[#0c0d12] border border-white/10 rounded-xl p-1 text-xs">
                    <Layers className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
                    {SEEDANCE_ASPECT_RATIOS.map((ar) => (
                      <button
                        key={ar}
                        type="button"
                        onClick={() => setAspectRatio(ar)}
                        className={`px-2 py-1 rounded-lg font-mono font-semibold transition-all ${aspectRatio === ar ? "bg-white text-black" : "text-slate-400 hover:text-white"}`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Advanced */}
              <div className="border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white font-semibold transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                    Camera &amp; pricing
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAdvancedOpen ? "rotate-180" : ""}`} />
                </button>
                {isAdvancedOpen && (
                  <div className="mt-3 space-y-3 bg-[#0c0d12] border border-white/10 rounded-xl p-3.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between gap-3">
                      <label className="text-[11px] text-slate-400">Camera move (added to your prompt)</label>
                      <select
                        value={camera}
                        onChange={(e) => setCamera(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded px-2 py-1 text-white text-xs font-medium focus:outline-none"
                      >
                        {CAMERA_MOVES.map((c) => (
                          <option key={c || "none"} value={c}>
                            {c || "Let the model decide"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {spec.label}: {SEEDANCE_CREDITS_PER_SECOND[model]["480p"]} credits/s at 480p · {SEEDANCE_CREDITS_PER_SECOND[model]["720p"]} credits/s at 720p. Using
                      a video as input costs 1.5×. Failed renders are refunded automatically.
                    </p>
                  </div>
                )}
              </div>

              {error && !isGenerating && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[12px] text-rose-100 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-300" />
                  <div>
                    {error.text}
                    {error.link && (
                      <Link href="/pricing" className="block mt-1 font-semibold text-[#ccff00] hover:underline">
                        {error.link === "plans" ? "See plans →" : "Get more credits →"}
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || signedOut}
                className="w-full py-3 px-4 bg-white hover:bg-slate-100 disabled:bg-slate-300 text-black font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-black" />
                    <span className="truncate">{generationStage || "Working…"}</span>
                  </>
                ) : !modelAllowed ? (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Available with {plan?.models[model].upgradeTo} plan</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-black text-black" />
                    <span>Generate · {price.toLocaleString("en-IN")} credits</span>
                  </>
                )}
              </button>
            </div>

            {/* RESULT */}
            <div className="lg:col-span-7 bg-[#14161f] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">Result</h3>
                  {isExample ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">Example</span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Ready{activeJob?.resolution ? ` • ${activeJob.resolution}` : ""}
                      {activeJob?.durationSeconds ? ` • ${activeJob.durationSeconds}s` : ""}
                    </span>
                  )}
                </div>
                {!isExample && activeJob?.videoUrl && (
                  <div className="flex items-center gap-2">
                    {onInsertToTimeline && (
                      <button
                        type="button"
                        onClick={() => onInsertToTimeline(activeJob.videoUrl!, `Seedance - ${activeJob.prompt.slice(0, 40)}`)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#00a8ff] hover:bg-[#0092dd] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Insert to Studio Timeline</span>
                      </button>
                    )}
                    <a
                      href={`${activeJob.videoUrl}?download=1`}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Download MP4"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>

              <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 group shadow-inner">
                <video
                  key={resultUrl}
                  ref={videoRef}
                  src={resultUrl}
                  loop
                  muted={isMuted || isExample}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleTimeUpdate}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                  className="w-full h-full object-contain"
                />

                {isGenerating && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                    <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-[#ccff00] animate-spin mb-4" />
                    <h4 className="text-base font-bold text-white mb-1">Generating with {spec.label}</h4>
                    <p className="text-xs text-slate-400 mb-3 max-w-sm">{generationStage}</p>
                    <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ccff00] transition-all duration-300" style={{ width: `${generationProgress}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-3 max-w-xs">
                      Videos take a few minutes. You can leave this page — the result will be in your history.
                    </p>
                  </div>
                )}

                {!isGenerating && !isPlaying && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm transition-transform hover:scale-105 z-20 shadow-2xl"
                    aria-label="Play"
                  >
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </button>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center gap-3 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button type="button" onClick={togglePlay} className="p-1 hover:text-[#ccff00]">
                    {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={videoDuration || 1}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => {
                      const t = parseFloat(e.target.value);
                      setCurrentTime(t);
                      if (videoRef.current) videoRef.current.currentTime = t;
                    }}
                    className="flex-1 accent-[#ccff00] h-1 bg-white/20 rounded cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-slate-300">
                    {fmtClock(currentTime)} / {fmtClock(videoDuration)}
                  </span>
                  <button type="button" onClick={() => setIsMuted(!isMuted)} className="p-1 hover:text-[#ccff00]">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button type="button" onClick={() => videoRef.current?.requestFullscreen()} className="p-1 hover:text-[#ccff00]">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isExample && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => useResultAsSource("video-extend")}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
                    <span>Extend this video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => useResultAsSource("video-edit")}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Edit this video</span>
                  </button>
                  {activeJob?.prompt && <p className="w-full text-[11px] text-slate-500 line-clamp-2">“{activeJob.prompt}”</p>}
                </div>
              )}

              {/* History */}
              <div className="border-t border-white/10 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-300">Your videos</p>
                  <button
                    type="button"
                    onClick={() =>
                      listAiJobsWithBalance("seedance")
                        .then(({ jobs, balance: b }) => {
                          setHistory(jobs);
                          if (b !== null) setBalance(b);
                        })
                        .catch(() => {})
                    }
                    className="text-[11px] text-slate-500 hover:text-white inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Refresh
                  </button>
                </div>
                {history.length === 0 ? (
                  <p className="text-[11px] text-slate-500">Your generated videos will appear here.</p>
                ) : (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {history.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => {
                          if (j.status === "completed" && j.videoUrl) {
                            setActiveJob(j);
                            setIsPlaying(false);
                          }
                        }}
                        className={`relative shrink-0 w-36 rounded-lg border overflow-hidden text-left ${
                          activeJob?.id === j.id ? "border-[#ccff00]" : "border-white/10 hover:border-white/25"
                        }`}
                        title={j.prompt}
                      >
                        <div className="aspect-video bg-black flex items-center justify-center">
                          {j.status === "completed" && j.videoUrl ? (
                            <video src={j.videoUrl} muted preload="metadata" className="w-full h-full object-cover" />
                          ) : isPendingJob(j) ? (
                            <Loader2 className="w-5 h-5 animate-spin text-[#ccff00]" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-rose-400" />
                          )}
                        </div>
                        <div className="px-2 py-1">
                          <p className="text-[10px] text-slate-300 truncate">{j.prompt || "Seedance video"}</p>
                          <p className="text-[9px] text-slate-500 font-mono">
                            {SEEDANCE_MODE_LABEL[(j.mode as SeedanceMode) || "text-to-video"] || ""}
                            {j.status !== "completed" && !isPendingJob(j) ? " · failed" : ""}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
