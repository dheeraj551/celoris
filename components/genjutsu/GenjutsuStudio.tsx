"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { ControlPanel, UploadedFile } from './ControlPanel';
import { MainStage } from './MainStage';
import {
  GENJUTSU_MODELS,
  ModelOption,
  PRESET_MOTIONS,
  PresetMotion,
  GenerationHistoryItem,
  isFreeRender,
  motionSwapPrice,
} from './genjutsuData';
import {
  ModelPickerModal,
  MotionLibraryModal,
  HowItWorksModal,
  HistoryDrawer,
  GenerationResultModal,
} from './Modals';
import {
  AiJob,
  AiJobsError,
  isPendingJob,
  listAiJobsWithBalance,
  type MotionSwapPlan,
  readVideoDuration,
  startAiJob,
  uploadReferenceImage,
  uploadReferenceVideo,
  waitForAiJob,
} from '@/lib/ai-jobs-client';

// Motion Swap Studio — real Higgsfield Genjutsu generations.
//
// Flow: the reference video uploads as soon as it's picked (straight from
// the browser to storage), photos upload when you press Generate, then
// POST /api/ai/jobs starts the render and we poll GET /api/ai/jobs/{id}
// until the video is ready. Renders keep going if the page is closed;
// they show up in History and resume here on the next visit.

const MIN_SECONDS = 4;
const MAX_SECONDS = 30;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;
const PRODUCTION_ORIGIN = 'https://celorisdesigns.com';

export interface ReferenceVideoState extends UploadedFile {
  seconds: number;
  status: 'uploading' | 'ready' | 'error';
  progress: number; // 0..1
  error?: string;
  videoKey?: string;
  videoToken?: string;
  videoUrl?: string;
}

export interface ResultView {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  prompt?: string;
  model: string;
  quality: string;
  duration: string;
}

const fmtSeconds = (s: number) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;

function timeAgo(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString();
}

function jobToHistory(job: AiJob): GenerationHistoryItem {
  const mode = job.mode === 'objects-swap' ? 'objects-swap' : 'motion-transfer';
  return {
    id: job.id,
    status: job.status,
    error: job.error,
    mode,
    title: mode === 'motion-transfer' ? 'Motion transfer' : 'Object swap',
    createdAt: timeAgo(job.createdAt),
    thumbnailUrl: '',
    videoUrl: job.videoUrl || '',
    duration: job.durationSeconds ? fmtSeconds(job.durationSeconds) : '',
    model: 'Higgsfield Genjutsu',
    quality: job.resolution || '720p',
    prompt: job.prompt,
  };
}

export function GenjutsuStudio() {
  // Navigation & Mode
  const [activeTab, setActiveTab] = useState<'create' | 'edit' | 'motion-control'>('create');
  const [mode, setMode] = useState<'motion-transfer' | 'objects-swap'>('motion-transfer');

  // Model & Settings
  const [selectedModel, setSelectedModel] = useState<ModelOption>(GENJUTSU_MODELS[0]);
  const [quality, setQuality] = useState<string>('720p');

  // Inputs
  const [referenceVideo, setReferenceVideo] = useState<ReferenceVideoState | null>(null);
  const [characterImages, setCharacterImages] = useState<UploadedFile[]>([]);
  const [promptEnabled, setPromptEnabled] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');

  // Hero Display & Presets
  const [activeHeroVideo, setActiveHeroVideo] = useState<PresetMotion>(PRESET_MOTIONS[4] || PRESET_MOTIONS[0]);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Modals
  const [isModelPickerOpen, setIsModelPickerOpen] = useState(false);
  const [isMotionLibraryOpen, setIsMotionLibraryOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // History, wallet & results
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  // What the member's plan allows here (Motion Swap is a Pro/Max feature,
  // with a few free renders a month — set in Admin → Plans).
  const [plan, setPlan] = useState<MotionSwapPlan | null>(null);
  const [activeResult, setActiveResult] = useState<ResultView | null>(null);

  // Generation Progress
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [needsPro, setNeedsPro] = useState(false);

  const pollAbort = useRef<AbortController | null>(null);
  const uploadToken = useRef(0);

  const upsertHistory = useCallback((job: AiJob) => {
    const item = jobToHistory(job);
    setHistory((prev) => [item, ...prev.filter((h) => h.id !== item.id)]);
  }, []);

  const showResult = useCallback((job: AiJob) => {
    if (!job.videoUrl) return;
    setActiveResult({
      videoUrl: job.videoUrl,
      thumbnailUrl: '',
      title: job.mode === 'objects-swap' ? 'Object swap' : 'Motion transfer',
      prompt: job.prompt,
      model: 'Higgsfield Genjutsu',
      quality: job.resolution || '720p',
      duration: job.durationSeconds ? fmtSeconds(job.durationSeconds) : '',
    });
    setIsResultModalOpen(true);
  }, []);

  /** Polls one job until it finishes, updating the progress panel. */
  const followJob = useCallback(
    async (job: AiJob) => {
      pollAbort.current?.abort();
      const ctrl = new AbortController();
      pollAbort.current = ctrl;
      setIsGenerating(true);
      const started = new Date(job.createdAt).getTime();
      const describe = (j: AiJob) => {
        const mins = Math.max(0, Math.floor((Date.now() - started) / 60000));
        const t = mins > 0 ? ` · ${mins} min` : '';
        return j.status === 'queued' ? `Waiting in Higgsfield's queue${t}` : `Rendering your video${t}`;
      };
      setGenerationStage(describe(job));
      // Renders usually take a few minutes; creep the bar towards 95%.
      setGenerationProgress(15);
      try {
        const { job: done } = await waitForAiJob(job.id, {
          signal: ctrl.signal,
          intervalMs: 5000,
          timeoutMs: 45 * 60 * 1000,
          onUpdate: (j) => {
            upsertHistory(j);
            setGenerationStage(describe(j));
            setGenerationProgress((p) => Math.min(95, Math.max(p, j.status === 'in_progress' ? 30 : 15) + 2));
          },
        });
        upsertHistory(done);
        // A failed render is refunded — refresh the balance shown.
        if (done.status !== 'completed') {
          listAiJobsWithBalance('motion-swap')
            .then(({ balance: b, plan: p }) => {
              if (b !== null) setBalance(b);
              if (p) setPlan(p);
            })
            .catch(() => {});
        }
        if (done.status === 'completed' && done.videoUrl) {
          setGenerationProgress(100);
          showResult(done);
        } else {
          setGenerateError(done.error || 'The render failed. Please try again.');
        }
      } catch (err: any) {
        if (ctrl.signal.aborted) return;
        setGenerateError(err?.message || 'Lost track of the render. It will appear in History when it finishes.');
      } finally {
        if (pollAbort.current === ctrl) {
          setIsGenerating(false);
          setGenerationProgress(0);
          setGenerationStage('');
        }
      }
    },
    [showResult, upsertHistory]
  );

  // Load real history (and resume a render that was still running).
  useEffect(() => {
    let cancelled = false;
    listAiJobsWithBalance('motion-swap')
      .then(({ jobs, balance: b, plan: p }) => {
        if (cancelled) return;
        setHistory(jobs.map(jobToHistory));
        setBalance(b);
        setPlan(p);
        if (p && !p.allowed) setNeedsPro(true);
        const pending = jobs.find(isPendingJob);
        if (pending) followJob(pending);
      })
      .catch((err) => {
        if (err instanceof AiJobsError && err.status === 401) setGenerateError('Please sign in to use Motion Swap Studio.');
      });
    return () => {
      cancelled = true;
      pollAbort.current?.abort();
    };
  }, [followJob]);

  // ---------------------------------------------------------------- inputs

  const handlePickVideo = async (file: File) => {
    setGenerateError(null);
    const token = ++uploadToken.current;
    if (!/^video\/(mp4|quicktime)$/.test(file.type)) {
      setGenerateError('Please use an MP4 or MOV video.');
      return;
    }
    if (file.size > MAX_VIDEO_BYTES) {
      setGenerateError('That video is too large. Please keep it under 200 MB.');
      return;
    }
    let seconds: number;
    try {
      seconds = await readVideoDuration(file);
    } catch (err: any) {
      setGenerateError(err?.message || "Couldn't read that video.");
      return;
    }
    if (seconds < MIN_SECONDS || seconds > MAX_SECONDS + 0.5) {
      setGenerateError(`The reference video must be ${MIN_SECONDS}–${MAX_SECONDS} seconds long (this one is ${seconds.toFixed(1)} s).`);
      return;
    }

    const base: ReferenceVideoState = {
      id: `vid-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file),
      duration: fmtSeconds(seconds),
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      seconds,
      status: 'uploading',
      progress: 0,
    };
    setReferenceVideo(base);
    setSelectedPresetId(null);
    try {
      const uploaded = await uploadReferenceVideo(file, (f) => {
        if (uploadToken.current === token) setReferenceVideo((v) => (v && v.id === base.id ? { ...v, progress: f } : v));
      });
      if (uploadToken.current !== token) return;
      setReferenceVideo((v) => (v && v.id === base.id ? { ...v, ...uploaded, status: 'ready', progress: 1 } : v));
    } catch (err: any) {
      if (uploadToken.current !== token) return;
      if (err instanceof AiJobsError && err.status === 403) setNeedsPro(true);
      setReferenceVideo((v) => (v && v.id === base.id ? { ...v, status: 'error', error: err?.message || 'Upload failed.' } : v));
    }
  };

  const clearReferenceVideo = () => {
    uploadToken.current++;
    setReferenceVideo(null);
  };

  // Presets are inspiration (preview + prompt idea). Only presets with a
  // real `referenceVideoUrl` clip can be used as the motion reference.
  const handleSelectPreset = (preset: PresetMotion) => {
    setSelectedPresetId(preset.id);
    setActiveHeroVideo(preset);
    if (preset.referenceVideoUrl && preset.referenceSeconds) {
      uploadToken.current++;
      setReferenceVideo({
        id: `preset-ref-${preset.id}`,
        name: `${preset.title} (preset motion)`,
        url: preset.referenceVideoUrl,
        duration: fmtSeconds(preset.referenceSeconds),
        size: 'Preset clip',
        seconds: preset.referenceSeconds,
        status: 'ready',
        progress: 1,
        // Higgsfield has to download it, so it needs the public site URL.
        videoUrl: new URL(preset.referenceVideoUrl, PRODUCTION_ORIGIN).toString(),
      });
    }
    if (!prompt) {
      setPrompt(preset.promptSuggestion);
      setPromptEnabled(true);
    }
  };

  // ---------------------------------------------------------------- generate

  const handleGenerate = async () => {
    setGenerateError(null);
    if (isGenerating) return;
    if (!referenceVideo) {
      setGenerateError(
        mode === 'motion-transfer'
          ? 'Add a reference video (4–30 seconds) to take the motion from.'
          : 'Add the video you want to edit (4–30 seconds).'
      );
      return;
    }
    if (referenceVideo.status === 'uploading') {
      setGenerateError('Your video is still uploading — one moment.');
      return;
    }
    if (referenceVideo.status === 'error') {
      setGenerateError(referenceVideo.error || 'The video upload failed. Please add it again.');
      return;
    }
    if (characterImages.length === 0) {
      setGenerateError(
        mode === 'motion-transfer'
          ? 'Add at least one photo of your character, product or clothing.'
          : 'Add a photo of the replacement object or clothing.'
      );
      return;
    }
    // Quick checks before uploading photos (the server checks again, using
    // the video's real length).
    if (plan && !plan.allowed) {
      setNeedsPro(true);
      setGenerateError(`Motion Swap Studio is included with the ${plan.upgradeTo} plan and above. You're on ${plan.label}.`);
      return;
    }
    const free = isFreeRender(plan, referenceVideo.seconds);
    const price = free ? 0 : motionSwapPrice(referenceVideo.seconds, quality);
    if (balance !== null && balance < price) {
      setNeedsPro(true);
      setGenerateError(`This video costs ${price.toLocaleString('en-IN')} credits. Your balance is ${balance.toLocaleString('en-IN')}.`);
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(3);
    setGenerationStage(`Uploading ${characterImages.length} photo${characterImages.length > 1 ? 's' : ''}…`);
    try {
      // Photos: resized in the browser and uploaded, 4 at a time.
      const urls: string[] = new Array(characterImages.length);
      let done = 0;
      const queue = characterImages.map((img, i) => ({ img, i }));
      const worker = async () => {
        while (queue.length) {
          const next = queue.shift()!;
          urls[next.i] = await uploadReferenceImage(next.img.file || next.img.url, next.img.id);
          done++;
          setGenerationProgress(3 + Math.round((done / characterImages.length) * 9));
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);

      setGenerationStage('Sending to Higgsfield Genjutsu…');
      const started = await startAiJob({
        app: 'motion-swap',
        mode,
        prompt: promptEnabled ? prompt.trim() : '',
        imageUrls: urls,
        resolution: quality === '480p' ? '480p' : '720p',
        videoKey: referenceVideo.videoKey,
        videoUrl: referenceVideo.videoKey ? undefined : referenceVideo.videoUrl,
        videoToken: referenceVideo.videoKey ? undefined : referenceVideo.videoToken,
        videoName: referenceVideo.name,
        durationSeconds: referenceVideo.seconds,
      });
      const { job, balance: b } = started;
      if (typeof b === 'number') setBalance(b);
      if (started.plan) setPlan(started.plan);
      upsertHistory(job);
      await followJob(job);
    } catch (err: any) {
      if (err instanceof AiJobsError && (err.status === 403 || err.status === 402)) setNeedsPro(true);
      if (err instanceof AiJobsError && err.data?.plan) setPlan(err.data.plan);
      setGenerateError(err?.message || 'Could not start the render.');
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStage('');
    }
  };

  const handleSelectHistoryVideo = (item: GenerationHistoryItem) => {
    if (item.status !== 'completed' || !item.videoUrl) return;
    setIsHistoryOpen(false);
    setActiveResult({
      videoUrl: item.videoUrl,
      thumbnailUrl: item.thumbnailUrl,
      title: item.title,
      prompt: item.prompt,
      model: item.model,
      quality: item.quality,
      duration: item.duration,
    });
    setIsResultModalOpen(true);
  };

  return (
    <div className="w-full h-screen bg-[#0a0b0e] text-slate-100 flex flex-col overflow-hidden font-sans">

      {/* Top Universal App Navigation Bar */}
      <div className="h-12 border-b border-white/[0.08] bg-[#0c0d12] px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Celoris</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/10 mx-1 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white tracking-wide">
              Celoris <span className="text-[#d4f634]">Motion Swap Studio</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-[#d4f634]/15 text-[#d4f634] border border-[#d4f634]/30 px-2 py-0.5 rounded-full font-bold">
              Higgsfield Genjutsu Engine
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHowItWorksOpen(true)}
            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#d4f634]" />
            <span className="hidden md:inline">Quick Guide</span>
          </button>

          <Link
            href="/pricing"
            className="text-[11px] font-semibold text-black bg-[#d4f634] hover:bg-[#cbf11e] px-2.5 py-1 rounded-full transition-all"
          >
            Pro Access
          </Link>
        </div>
      </div>

      {/* Main Split Layout: Left Control Panel + Right Main Stage */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Sidebar Control Panel */}
        <ControlPanel
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mode={mode}
          setMode={setMode}
          selectedModel={selectedModel}
          onOpenModelPicker={() => setIsModelPickerOpen(true)}
          referenceVideo={referenceVideo}
          onPickVideo={handlePickVideo}
          onClearVideo={clearReferenceVideo}
          characterImages={characterImages}
          setCharacterImages={setCharacterImages}
          promptEnabled={promptEnabled}
          setPromptEnabled={setPromptEnabled}
          prompt={prompt}
          setPrompt={setPrompt}
          quality={quality}
          setQuality={setQuality}
          isGenerating={isGenerating}
          generationProgress={generationProgress}
          generationStage={generationStage}
          generateError={generateError}
          needsPro={needsPro}
          plan={plan}
          onGenerate={handleGenerate}
        />

        {/* Right Main Content Showcase & Presets Shelf */}
        <MainStage
          activeHeroVideo={activeHeroVideo}
          setActiveHeroVideo={setActiveHeroVideo}
          selectedPresetId={selectedPresetId}
          onSelectPreset={handleSelectPreset}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenLibrary={() => setIsMotionLibraryOpen(true)}
          onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
          balance={balance}
        />
      </div>

      {/* Interactive Modals & Drawers */}
      <ModelPickerModal
        isOpen={isModelPickerOpen}
        onClose={() => setIsModelPickerOpen(false)}
        selectedModel={selectedModel.name}
        onSelectModel={(model) => setSelectedModel(model)}
      />

      <MotionLibraryModal
        isOpen={isMotionLibraryOpen}
        onClose={() => setIsMotionLibraryOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectVideo={handleSelectHistoryVideo}
      />

      <GenerationResultModal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        result={activeResult}
      />

    </div>
  );
}

export const MotionSwapStudio = GenjutsuStudio;
